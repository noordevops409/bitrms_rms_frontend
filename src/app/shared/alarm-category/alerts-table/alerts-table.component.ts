import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiConstant } from '../../api-constant.enum';
import { Observable } from 'rxjs';
import { AppConstant } from '../../app-constant.enum';

@Component({
  selector: 'app-alerts-table',
  templateUrl: './alerts-table.component.html',
  styleUrls: ['./alerts-table.component.scss']
})
export class AlertsTableComponent {
isOpenTabularFilter: any;
activeListing: any = {};
public listingTemplate: any = {};
public appType1: Number = AppConstant.ALARM_STATUS_APP_TYPE;
private isMultipleRowSelected: boolean = false;
private multipleSelRow: any;
private selectedRow: any;
  currentPageNo: any;
  pageSize: any;
  recordStartFrom: any;
  isReqToOpenFilter: boolean = false;filterParam!: { siteId: any; clusters: any; zones: any; regions: any; deviceType: any; siteStatus: any[]; siteType: any; customers: any; date: any; };
ddExport: any;
  loading: boolean=true;
;

exportOptSelected($event: any) {
throw new Error('Method not implemented.');
}
searchGlobally($event: any) {
throw new Error('Method not implemented.');
}
openTabularFilter($event: any) {
throw new Error('Method not implemented.');
}
goBack($event: any) {
throw new Error('Method not implemented.');
}
tableData: any;
tableData1: any;
type:any;
apiUrl:any;

  constructor(private route: ActivatedRoute,private httpClient: HttpClient, ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      console.log('in the alert-table.component');
      this.type = params.get('type');
      console.log('line 23', this.type);
      this.loading = true; // Set loading to true before making the request
      this.getAlertsTableDataByType(this.type); // Assign the observable
    });
  }
  
  private getAlertsTableDataByType(type: any) {
    this.apiUrl = `${ApiConstant.getAlertsDetails}/${type}`; // Use backticks to create the template string
    console.log('line 23', this.apiUrl);
  
    // const url = ApiConstant.getLatestData;
    this.httpClient.get(this.apiUrl).subscribe((data) => {
      this.tableData1 = data;
      console.log('API Response:', data);
      this.loading = false; // Set loading to false once data is fetched
    });
  }
  
  onRowSelectionChanged(data: any) {
    if (data && data.length) {
      this.isMultipleRowSelected = data.length > 1;
      this.multipleSelRow = data;
      if (this.isMultipleRowSelected) {
        // custom business logic
      } else {
        this.selectedRow = data;
      }
    } else {
      this.multipleSelRow = null;
      this.selectedRow = null;
    }
  }
  loadListing(data: any) {
    this.updateListParam(data);
  }
  updateListParam(data: any) {
    this.currentPageNo = data.currentPageNo ? (data.currentPageNo - 1) : this.currentPageNo;
    this.pageSize = data.pageSize || this.pageSize;
    this.recordStartFrom = data.recordStartFrom || this.recordStartFrom;

    // if (data && data.popupTo) {
    //   this.applyFilter(data);
    // } else {
    //   this.loadTowerLatestData();
    // }
  }
  applyFilter(evt?: any) {
    this.isReqToOpenFilter = false;
    this.isOpenTabularFilter = false;
    if (evt) {
      this.setFilterParam(evt);
     // this.loadFilterTowerStatusData();
    } else {
      // this.setDefaultFilter();
      // this.loadFilterTowerStatusData();
    }
  }
  setFilterParam(fData) {

    let regions: any = ["All"];
    let zones: any = ["All"];
    let clusters: any = ["All"];
    let siteId: any = ["All"];
    let deviceType: any = ["All"];
    let siteType: any = ["All"];
    let siteStatus: any = null;
    let customer: any = ["All"];
    let rangeDate: any = "";
    if (fData && fData.length) {
      if (fData[0].popupTo.data && fData[0].popupTo.data.length) {
        regions = fData[0].popupTo.data.map((item) => {
          return item.id;
        });
      }

      if (fData[1].popupTo.data && fData[1].popupTo.data.length) {
        zones = fData[1].popupTo.data.map((item) => {
          return item.id;
        });
      }

      if (fData[2].popupTo.data && fData[2].popupTo.data.length) {
        clusters = fData[2].popupTo.data.map((item) => {
          return item.id;
        });
      }

      if (fData[3].popupTo.data && fData[3].popupTo.data.length) {
        siteId = fData[3].popupTo.data.map((item) => {
          return item.id;
        });
      }

      if (fData[4].popupTo.data && fData[4].popupTo.data.length) {
        deviceType = fData[4].popupTo.data.map((item) => {
          return item.id;
        });
      }

      if (fData[5] && fData[5].length) {
        siteType = fData[5].filter((item) => {
          return item.isChecked && item.text;
        }).map((item) => {
          return item.text;
        });
      }

      if (fData[6] && fData[6].startDate && fData[6].endDate) {
        rangeDate = fData[6].startDate.replace(/-/g, '/') + ' - ' + fData[6].endDate.replace(/-/g, '/');
      }
      // siteStatus = parseInt(fData[7], 10);
      siteStatus = fData[7];

      if (fData[8] && fData[8].length) {
        customer = fData[8].filter((item) => {
          return item.isChecked && item.text;
        }).map((item) => {
          return item.text;
        });
      }
    }
    this.filterParam = {
      "siteId": siteId,
      "clusters": clusters,
      "zones": zones,
      "regions": regions,
      "deviceType": deviceType,
      "siteStatus": siteStatus ? [siteStatus] : ['All'],
      "siteType": siteType.length === 0 ? ['All'] : siteType,
      "customers": customer.length === 0 ? ['All'] : customer,
      "date": rangeDate
    };
  }


}