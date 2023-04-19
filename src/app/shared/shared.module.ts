import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS } from '@danielmoncada/angular-datetime-picker';
import { GoogleMapsModule } from '@angular/google-maps';

import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

import { GoogleDataStudioComponent } from './google-data-studio/google-data-studio.component';
import { TableListingComponent } from './table-listing/table-listing.component';
import { CustomCommonDropdownComponent } from './custom-common-dropdown/custom-common-dropdown.component';
import { CustomDateFilterComponent } from './custom-date-filter/custom-date-filter.component';
import { CustomSelectDdComponent } from './custom-select-dd/custom-select-dd.component';
import { FilterWrapperComponent } from './filter-wrapper/filter-wrapper.component';
import { CardComponent } from './components/card/card.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { TowerFilterWrapperComponent } from './tower-filter-wrapper/tower-filter-wrapper.component';
import { SiteDetailsComponent } from './site-details/site-details.component';
import { SdSummaryListingComponent } from './sd-summary-listing/sd-summary-listing.component';
import { SdEnergyListingComponent } from './sd-energy-listing/sd-energy-listing.component';
import { SdEventComponent } from './sd-event/sd-event.component';
import { SdFuelConsumptionComponent } from './sd-fuel-consumption/sd-fuel-consumption.component';
import { SdNoLoadOutageComponent } from './sd-no-load-outage/sd-no-load-outage.component';
import { SdRemoteComponent } from './sd-remote/sd-remote.component';
import { YearPickerComponent } from './year-picker/year-picker.component';
import { MonthPickerComponent } from './month-picker/month-picker.component';
import { GlobalSearchComponent } from './global-search/global-search.component';

import { NgChartsModule } from 'ng2-charts';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { AlarmCategoryComponent } from './alarm-category/alarm-category.component';
import { HourlyReportComponent } from './hourly-report/hourly-report.component';


// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'l LT',
  datePickerInput: 'DD MMM YYYY',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};


@NgModule({
  declarations: [
    CustomCommonDropdownComponent,
    CustomDateFilterComponent,
    CustomSelectDdComponent,
    FilterWrapperComponent,
    GoogleDataStudioComponent,
    TableListingComponent,
    CardComponent,
    CheckboxComponent,
    TowerFilterWrapperComponent,
    SiteDetailsComponent,
    SdSummaryListingComponent,
    SdEnergyListingComponent,
    SdEventComponent,
    SdFuelConsumptionComponent,
    SdNoLoadOutageComponent,
    SdRemoteComponent,
    YearPickerComponent,
    MonthPickerComponent, GlobalSearchComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AlarmCategoryComponent,
    HourlyReportComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    GoogleMapsModule,
    NgxMatDatetimePickerModule, 
    NgxMatTimepickerModule,
    NgChartsModule
  ],
  providers: [
    BsLocaleService,
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS }
  ],
  exports: [
    GoogleDataStudioComponent,
    TableListingComponent,
    CustomCommonDropdownComponent,
    CustomDateFilterComponent,
    CustomSelectDdComponent,
    FilterWrapperComponent,
    CardComponent,
    CheckboxComponent,
    TowerFilterWrapperComponent,
    SiteDetailsComponent,
    SdEnergyListingComponent,
    SdFuelConsumptionComponent,
    SdRemoteComponent,
    YearPickerComponent,
    MonthPickerComponent,
    GlobalSearchComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AlarmCategoryComponent,
    HourlyReportComponent
  ]
})
export class SharedModule { }
