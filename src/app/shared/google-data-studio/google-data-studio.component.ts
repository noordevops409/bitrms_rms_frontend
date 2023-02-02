import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { alarmCategory } from '../../pages/data/alarm-category';
import { alarmStatus } from '../../pages/data/alarm-status';
import { clusterMaster } from '../../pages/data/cluster-master';
import { customerMaster } from '../../pages/data/customer-master';
import { deviceTypeMaster } from '../../pages/data/device-type-master';
import { hourlyReport } from '../../pages/data/hourly-report';
import { latestData } from '../../pages/data/latest-data';
import { latestReportStatus } from '../../pages/data/latest-report-status';
import { regionMaster } from '../../pages/data/region-master';
import { siteCodeMaster } from '../../pages/data/site-code-master';
import { siteTypeMaster } from '../../pages/data/site-type-master';
import { zoneMaster } from '../../pages/data/zone-master';

import { geoLocation } from '../../pages/data/site-geolocation';

@Component({
  selector: 'app-google-data-studio',
  templateUrl: './google-data-studio.component.html',
  styleUrls: ['./google-data-studio.component.scss']
})
export class GoogleDataStudioComponent implements OnInit {

  @Input() isReqToShowTowerList: boolean = true;

  zoom = 6
  center!: google.maps.LatLngLiteral
  options: google.maps.MapOptions = {
    // mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
  };

  public markers: any = [];
  public siteList: any = siteCodeMaster;

  constructor() { }

  ngOnInit(): void {
    this.center = {
      lat: 20.7038,
      lng: 95.22442,
    }
    this.setMarkerData();
  }

  setMarkerData() {
    // markers
    let list = [];

    let obj: any = {
      "1": '#151A30',
      "2": '#CCEAFF',
      "3": '#1F3D99',
      "4": '#3366FF'
    }
    let counter = 0;
    for (let item of geoLocation) {
      counter += 1;
      this.markers.push({
        position: {
          lat: item.smLatitude,
          lng: item.smLongitude
        },
        clickable: true,

        options: {
          // animation: google.maps.Animation.BOUNCE,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            strokeColor: obj[item.smSitetypeid],
            fillColor: obj[item.smSitetypeid],
            scale: 3,

          },
          shape: {
            coords: [],
            type: 'rect'
          },
        }
      })
    }
  }

  openInfoWindow(label: string) {
    console.log("click of marker ", label)
  }

}
