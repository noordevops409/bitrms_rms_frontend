import { Component, OnInit, ViewChild, OnDestroy, NgZone, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';

import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';

import { CommonUtilService } from '../../shared/common-util.service';
import { BroadcastService } from '../../shared/broadcast.service';
import { ApiConstant } from '../../shared/api-constant.enum';
import { AppConstant } from '../../shared/app-constant.enum';
import { geoLocation } from '../../pages/data/site-geolocation';

@Component({
  selector: 'app-google-data-studio',
  templateUrl: './google-data-studio.component.html',
  styleUrls: ['./google-data-studio.component.scss']
})
export class GoogleDataStudioComponent implements OnInit {

  @Input('isReqToShowSiteList') isReqToShowSiteList: boolean = true;

  public map: any = mapboxgl.Map;
  public mapStyle: any = 'mapbox://styles/mapbox/streets-v11';
  public center: any = {
    lat: 20.7038,
    lng: 95.22442
  };
  public markers: any = [];

  public siteList: any = [];
  public allList: any = [];


  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {

  }

  init() {
    this.initMap();
    this.loadSiteData();
  }

  listen() {
    this.map.on('load', (event) => {
      // add the real time map data
    });

    // this.map.addSource('customMarker', {
    //   type: 'geojson',
    //   data: {
    //     type: 'FeatureCollection',
    //     features: []
    //   }
    // });
  }

  loadSiteData() {
    let apiUrl: any = ApiConstant.getSiteMasterData;
    this.httpClient.post(apiUrl, null).subscribe((res: any) => {
      if (res && res.siteMasterList && res.siteMasterList.length) {
        this.siteList = res.siteMasterList;
        this.allList = res.siteMasterList;
        this.setMarkers();
      }
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading Raw Data Report details!'
      })
    });
  }

  initMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'mapbox',
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: this.mapStyle,
      center: [this.center.lng, this.center.lat],
      zoom: 6
    });
  }

  getColorSiteWise(req) {
    for (let item of geoLocation) {
      if (item.smsitecode === req.smSitecode) {
        if (item.status.toLowerCase() === 'red') {
          req['bgColor'] = 'red';
        } else if (item.status.toLowerCase() === 'yellow') {
          req['bgColor'] = 'yellow';
        } else if (item.status.toLowerCase() === 'blue') {
          req['bgColor'] = 'blue';
        } else {
          req['bgColor'] = '#151A30';
        }
      }
    }
  }

  setMarkers() {
    let list: any = [];
    for (let item of this.siteList) {
      this.getColorSiteWise(item);
      let obj = {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [item.smLongitude, item.smLatitude]
        },
        'properties': {
          'title': item.smSitecode,
          'message': item.smSitename,
          'description': `<strong>${item.smSitecode}</strong><p>${item.smSitename}</p>`,
          'bgColor': item.bgColor,
          'customerId': item.smCustomerId,
          'smSitetypeid': item.smSitetypeid
        }
      };
      list.push(obj);
      this.createMarker(obj);
    }
    this.map.addSource('places', {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': list
      }
    })
    this.addPopupOnMarker();
  }

  createMarker(marker: any) {
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundColor = marker.properties.bgColor;
    el.style.width = `${15}px`;
    el.style.height = `${15}px`;
    el.style.borderRadius = '15px';
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.router.navigate(['pages', 'dashboard', 'prfdash', marker.properties.title]);
    });

    // Add markers to the map.
    this.markers.push(new mapboxgl.Marker(el)
      .setLngLat(marker.geometry.coordinates)
      .addTo(this.map));
  }

  removeAllMarker() {
    for (let item of this.markers) {
      item.remove();
    }
  }

  addPopupOnMarker() {

    // Add a layer showing the places.
    this.map.addLayer({
      'id': 'places',
      'type': 'circle',
      'source': 'places',
      'paint': {
        'circle-color': '#4264fb',
        'circle-radius': 6,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    });

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    this.map.on('mouseenter', 'places', (e) => {
      // Change the cursor style as a UI indicator.
      this.map.getCanvas().style.cursor = 'pointer';

      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.description;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(coordinates).setHTML(description).addTo(this.map);
    });

    this.map.on('mouseleave', 'places', () => {
      this.map.getCanvas().style.cursor = '';
      popup.remove();
    });
  }

  search(evt?: any) {
    setTimeout(() => {
      let { value } = evt.target;
      value = value.toLowerCase();
      if (value) {
        this.siteList = this.allList.filter((item) => {
          return (item.smSitecode.toLowerCase().includes(value));
        });
      } else {
        this.siteList = this.allList;
      }
      this.removeAllMarker();
      this.setMarkers();
    }, 500);
  }

}
