import { Component, OnInit, OnDestroy, Inject, Input, ViewChild, Output, EventEmitter, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params, NavigationEnd } from "@angular/router";
import { CommonUtilService } from '../../shared/common-util.service';
import { BroadcastService } from '../../shared/broadcast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  @Input() isToggle: boolean = true;

  public menu: any = [
    { id: 1, value: 'Dashboard', href: 'dashboard', matIcon: 'pie_chart' },
    { id: 2, value: 'RCA Report', href: 'rca-report', matIcon: 'view_compact' },
    {
      id: 3,
      value: 'RCA Master',
      href: 'rca-master',
      matIcon: 'view_quilt',
      subMenu: [
        { id: 3.1, value: "Add Issue Category", href: "issue-category" },
        { id: 3.2, value: "Add Outage Category", href: "outage-category" },
        { id: 3.3, value: "Add Fault Category", href: "fault-category" }
      ]
    },
    {
      id: 4,
      value: 'Reports',
      href: 'reports',
      matIcon: 'view_quilt',
      subMenu: [
        { id: 4.1, value: "Raw Data Report", href: "raw-data-report" },
        { id: 4.2, value: "Power Tracker Report(TEE)", href: "power-tracker-report-tee" },
        { id: 4.3, value: "Power Tracker Report(Hybrid)", href: "power-tracker-report-hybrid" },
        { id: 4.4, value: "Energy and Run Hours Report(TEE)", href: "energy-run-hours-report-tee" },
        { id: 4.5, value: "Energy and Run Hours Report(Hybrid)", href: "energy-run-hours-report-hybrid" }
      ]
    },
    {
      id: 5,
      value: 'Google Data Studio',
      href: 'google-data-studio',
      matIcon: 'view_quilt'
    },
    {
      id: 6,
      value: 'Master Data',
      href: 'master-data',
      matIcon: 'view_quilt',
      subMenu: [
        { id: 6.1, value: "Country Master", href: "country" },
        { id: 6.2, value: "Region Master", href: "region" },
        { id: 6.3, value: "Zone Master", href: "zone" },
        { id: 6.4, value: "Employee Role Master", href: "employee-role" },
        { id: 6.5, value: "Employee Master", href: "employee" },
        { id: 6.6, value: "Cluster Master", href: "cluster" },
        { id: 6.7, value: "Site Master", href: "site" },
        { id: 6.8, value: "Planned Energy", href: "planned-energy" },
        { id: 6.9, value: "Sim Master", href: "sim" }
      ]
    },
    {
      id: 7,
      value: 'Remote Commands',
      href: 'remote-commands',
      matIcon: 'view_quilt'
    },
    {
      id: 8,
      value: 'Logout',
      href: 'logout',
      matIcon: 'logout'
    }
  ];

  private prevSel: any = null;
  private prevIndex: any = null;
  private toggleSidebar!: Subscription;

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone
  ) {

    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        setTimeout(() => {
          this.setActiveMenuOnLoad(e);
        }, 500);
      }
    });
  }

  ngOnInit(): void {
    this.listen();
  }

  ngOnDestroy(): void {
  }

  listen() {
    this.toggleSidebar = this.broadcast.on<string>('TOGGLE_SIDEBAR').subscribe((data: any) => {
      this.ngZone.run(() => {
        this.isToggle = data;
        if (this.isToggle) {
          this.prevSel.isExpanded = false;
        }
      });
    });
  }

  setActiveMenuOnLoad(data: any) {
    let counter = 0;
    for (let item of this.menu) {
      if (data.url.indexOf(item.href) > -1) {
        item.isActive = true;
        this.prevSel = item;
        this.prevIndex = counter;
      }
      counter += 1;
    }
  }

  menuClick(evt: any, item: any) {
    evt.stopPropagation();
    evt.preventDefault();
    if(item.id === 8) {
      this.router.navigate(['logout']);
    } else {
      this.router.navigate(['pages', item.href]);
    }
  }

  expandCollapse(evt: any, item: any, index: any) {
    evt.preventDefault();
    evt.stopPropagation();
    if (index !== this.prevIndex && this.prevSel) {
      this.prevSel.isExpanded = false;
    }
    item.isExpanded = !item.isExpanded;
    this.prevSel = item;
    this.prevIndex = index;
  }

  subMenuClick(evt: any, item: any, subMenuItem: any) {
    evt.stopPropagation();
    evt.preventDefault();
    this.router.navigate(['pages', item.href, subMenuItem.href]);
  }

}
