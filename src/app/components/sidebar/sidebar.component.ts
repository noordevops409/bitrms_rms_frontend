import { Component, OnInit, OnDestroy, NgZone, Input } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";
import { BroadcastService } from '../../shared/broadcast.service';
import { Subscription } from 'rxjs';

import { AppConstant } from '../../shared/app-constant.enum';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  @Input() isToggle: boolean = true;

  // Define the menu items in the desired order
  public menu: any = [
    { id: 1, value: 'Dashboard', 
    href: 'dashboard', 
    logo: 'assets/images/dashboard_rms.png',
    roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER] },
    { id: 2, value: 'RCA Report', 
    href: 'rca-report', 
    logo: 'assets/images/root_cause.png',
    roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.CUSTOMER] },
    {
      id: 3,
      value: 'RCA Master',
      href: 'rca-master',
      logo: 'assets/images/root_cause.png',
      roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1],
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
      logo: 'assets/images/rms_report_icon.png',
      roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER],
      subMenu: [
        { id: 4.1, value: "Raw Data Report", href: "raw-data-report" , roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER],},
        { id: 4.2, value: "(TEE) Power Tracker Report", href: "tee-power-tracker", roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER]    },
        { id: 4.3, value: "(Hybrid) Power Tracker Report", href: "hybrid-power-tracker"  ,     roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.CUSTOMER],},
        { id: 4.4, value: "(TEE) Energy and Run Hours Report", href: "tee-energy-run-hours",roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER] },
        { id: 4.5, value: "(Hybrid) Energy and Run Hours Report", href: "hybrid-energy-run-hours",      roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER],      }
      ]
    },
    {
      id: 5,
      value: 'Map Site List',
      href: 'google-data-studio',
      logo: 'assets/images/map_rms.png',
      roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.CUSTOMER]
    },
    {
      id: 6,
      value: 'Master Data',
      href: 'master-data',
      logo: 'assets/images/Master.png',
      roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1],
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
      logo: 'assets/images/remote_rms.png',
      roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1]
    },
    {
      id: 8,
      value: 'Alarm Status',
      href: 'alarm-status',
      logo: 'assets/images/alarm_status_rms.png',
      roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.CUSTOMER]
    },
    {
      id: 9,
      value: 'Energy Report',
      href: 'energy-report',
      logo: 'assets/images/energy_report.png',
      roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.CUSTOMER]
    },
    {
      id: 10,
      value: 'Lithium Battery Data',
      href: 'lithlatestdata',
      logo: 'assets/images/energy_report.png',
      roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2],
      subMenu: [
        { id: 10.1, value: "Lithium Battery 1-15", href: "" },
        { id: 10.2, value: "Lithium Battery 16-32", href: "part2" }
      ]
    },
    {
      id: 11,
      value: 'Power Report',
      href: 'power-report',
      logo: 'assets/images/power_report_rms (1).png',
      roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.CUSTOMER ]
    },
    {
      id: 11,
      value: 'Energy Billing Report',
      href: 'energy-billing-report',
      logo: 'assets/images/energy_billing_report_rms.png',
      roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.CUSTOMER]
    },
    {
      id: 12,
      value: 'Users',
      href: 'users',
      logo: 'assets/images/Users_rms.png',
      roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1]
    },
    {
      id: 13,
      value: 'Logout',
      href: 'logout',
      logo: 'assets/images/logout.png',
      roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER]
    },
    {
      id: 14,
      value: 'DG Maintenace Alert',
      href: 'dg-maintenance-alert',
      logo: 'assets/images/energy_billing_report_rms.png',
      roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1 ]
    },

    {
      id: 15,
      value: 'Settable Load',
      href: 'settable-load',
      logo: 'assets/images/energy_billing_report_rms.png',
      roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1 ]
    },
    {
      id: 16,
      value: 'Battery Life Cycle Count',
      href: 'batt-life-cycle-count',
      logo: 'assets/images/energy_billing_report_rms.png',
      roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1 ]
    }


  ];
  private prevIndex: any = null;
  private prevSel: any = null;

  // Define the desired order of main menu items
  private mainSortOrder: string[] = [
    'Dashboard', 'Alarm Status','DG Maintenace Alert','Settable Load','Battery Life Cycle Count','Reports', 'Power Report',
    'Energy Report', 'Energy Billing Report', 'RCA Report',
    'RCA Master', 'Map Site List', 'Master Data','Lithium Battery Data',
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
    this.setMenuByRoleId();
    this.setSubMenuByRoleId();
    this.listen();
    // Sort the menu items based on sortOrder
    this.sortMenuItems();
  }

  ngOnDestroy(): void {
    // ... OnDestroy logic ...
  }

  setSubMenuByRoleId() {
    let authToken: any = null;
    if ((window as any).localStorage.getItem('authToken')) {
      authToken = JSON.parse((window as any).localStorage.getItem('authToken'));
    }

    const reportsMenu = this.menu.find((item: any) => item.value === 'Reports');

    if (reportsMenu && reportsMenu.subMenu) {
      const initialSubMenuLength = reportsMenu.subMenu.length; 

      reportsMenu.subMenu = reportsMenu.subMenu.filter((subMenuItem: any) => {
        return subMenuItem && subMenuItem.roleIds && subMenuItem.roleIds.includes && subMenuItem.roleIds.includes(authToken.umDashboardLevelIds);
      });

      const filteredSubMenuLength = reportsMenu.subMenu.length; 

      if (filteredSubMenuLength === 0) {
        delete reportsMenu.subMenu;
      } else if (initialSubMenuLength !== filteredSubMenuLength) {
      }
    }
  }



  setMenuByRoleId() {
    let authToken: any = null;
    if ((window as any).localStorage.getItem('authToken')) {
      authToken = JSON.parse((window as any).localStorage.getItem('authToken'));
    }
    this.menu = this.menu.filter((item: any) => {
     
      return item.roleIds.includes(authToken.umDashboardLevelIds);
    });
    // console.log("221",this.menu);
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

  // menuClick(evt: any, item: any) {
  //   if (item.id === 13) {
  //     this.router.navigate(['logout']);
  //   } else {
  //     this.router.navigate(['pages', item.href]);
  //   }
  // }
  expandCollapse(evt: any, item: any, index: any) {
  
    if (index !== this.prevIndex && this.prevSel) {
      this.prevSel.isExpanded = false;
    }
    item.isExpanded = !item.isExpanded;
    this.prevSel = item;
    this.prevIndex = index;
  }

  // subMenuClick(evt: any, item: any, subMenuItem: any) {
  //   this.router.navigate(['pages', item.href, subMenuItem.href]);
  // }

  menuClick(evt: any, item: any) {
    if (evt.ctrlKey || evt.metaKey || evt.button === 1) {
      // Allow default behavior for opening in a new tab
      return;
    }
    evt.preventDefault();
    if (item.id === 13) {
      this.router.navigate(['logout']);
    } else {
      this.router.navigate(['pages', item.href]);
    }
  }

  subMenuClick(evt: any, item: any, subMenuItem: any) {
    if (evt.ctrlKey || evt.metaKey || evt.button === 1) {
      // Allow default behavior for opening in a new tab
      return;
    }
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
