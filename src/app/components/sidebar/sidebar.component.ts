import { Component, OnInit, OnDestroy, NgZone, Input } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";
import { BroadcastService } from '../../shared/broadcast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  @Input() isToggle: boolean = true;

  // Define the menu items in the desired order
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
        { id: 4.2, value: "(TEE) Power Tracker Report", href: "tee-power-tracker" },
        { id: 4.3, value: "(Hybrid) Power Tracker Report", href: "hybrid-power-tracker" },
        { id: 4.4, value: "(TEE) Energy and Run Hours Report", href: "tee-energy-run-hours" },
        { id: 4.5, value: "(Hybrid) Energy and Run Hours Report", href: "hybrid-energy-run-hours" }
      ]
    },
    {
      id: 5,
      value: 'Map Site List',
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
      value: 'Alarm Status',
      href: 'alarm-status',
      matIcon: 'view_quilt'
    },
    {
      id: 9,
      value: 'Energy Report',
      href: 'energy-report',
      matIcon: 'view_quilt'
    },
    {
      id: 10,
      value: 'Power Report',
      href: 'power-report',
      matIcon: 'view_quilt'
    },
    {
      id: 11,
      value: 'Energy Billing Report',
      href: 'energy-billing-report',
      matIcon: 'view_quilt'
    },
    {
      id: 12,
      value: 'Users',
      href: 'users',
      matIcon: 'view_quilt'
    },
    {
      id: 13,
      value: 'Logout',
      href: 'logout',
      matIcon: 'logout'
    }
  ];
  private prevIndex: any = null;
  private prevSel: any = null;

  // Define the desired order of main menu items
  private mainSortOrder: string[] = [
    'Dashboard', 'Alarm Status', 'Reports', 'Power Report', 
    'Energy Report', 'Energy Billing Report', 'RCA Report', 
    'RCA Master', 'Map Site List', 'Master Data', 
    'Remote Commands', 'Users', 'Logout'
  ];

  private toggleSidebar!: Subscription;

  constructor(
    private broadcast: BroadcastService,
    private router: Router,
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
    // Sort the menu items based on sortOrder
    this.sortMenuItems();
  }

  ngOnDestroy(): void {
    // ... OnDestroy logic ...
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
    for (let item of this.menu) {
      if (data.url.indexOf(item.href) > -1) {
        item.isActive = true;
        this.prevSel = item;
      }
    }
  }

  menuClick(evt: any, item: any) {
    evt.stopPropagation();
    evt.preventDefault();
    if (item.id === 13) {
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

  private sortMenuItems() {
    this.menu.sort((a: any, b: any) => {
      const indexA = this.mainSortOrder.indexOf(a.value);
      const indexB = this.mainSortOrder.indexOf(b.value);
      return indexA - indexB;
    });

    for (const item of this.menu) {
      if (item.subMenu) {
        item.subMenu.sort((a: any, b: any) => {
          const indexA = this.mainSortOrder.indexOf(a.value);
          const indexB = this.mainSortOrder.indexOf(b.value);
          return indexA - indexB;
        });
      }
    }
  }
}
