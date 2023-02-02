import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import { NgbDropdown, NgbDatepickerI18n, NgbDateParserFormatter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

import { CustomDatepickerService, I18nDateParserFormatter, StrDateParserFormatter } from '../custom-datepicker.service';
import { CommonUtilService } from '../common-util.service'

@Component({
  selector: 'app-custom-date-filter',
  templateUrl: './custom-date-filter.component.html',
  styleUrls: ['./custom-date-filter.component.scss'],
  providers: [
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerService },
    { provide: NgbDateParserFormatter, useClass: I18nDateParserFormatter },
    { provide: NgbDateAdapter, useClass: StrDateParserFormatter }]
})
export class CustomDateFilterComponent implements OnInit {

  @ViewChild('dropDown', { static: true }) dropDown!: NgbDropdown;

  // Inputs
  @Input('isOpen') isOpen: any;

  @Input('placement') placement: any = ['bottom-left', 'bottom-right'];

  @Input('hideTriggerEl') hideTriggerEl: boolean = false;

  @Input('ddData') ddData: any;

  // Events
  @Output() onSelectionChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() onDropdownClose: EventEmitter<any> = new EventEmitter<any>();

  dd: any;
  name: any = Date.now();


  private backup: any = {};
  private closeAfterUpdate: boolean = false;
  private defOpt: any = {
    targetId: "Between",
    fromVal: "",
    toVal: "",
    onDate: "",
    targetVal: "",
    iswithIn: "Last",
    targetWithin: "minutes"
  };

  constructor(
    private util: CommonUtilService
  ) { }

  ngOnInit() {
    this.init();
    this.setPopupTo();

    if (this.isOpen) {
      setTimeout(() => {
        this.dropDown.open();
      })
    }
  }

  ngOnDestroy() {
    if ((this.dropDown as any).isOpen) {
      this.onToggle(false);
    }
  }

  init() {
    this.dd = this.util.copy(this.defOpt);
    this.backup = this.util.copy(this.defOpt);
  }

  private setPopupTo() {
    let popupTo = this.ddData.popupTo || {};
    let data = popupTo.data || [];

    data = (data[0] || {}).rangeFilterData;
    if (!data) {
      this.setTitle();
      return;
    }

    this.dd.targetId = data.targetId;

    if (data.targetId) {
      this.ddData.hasValue = true;
    } else {
      delete this.ddData.hasValue;
    }

    switch (data.targetId) {
      case 'Between':
        this.dd.fromVal = data.fromVal;
        this.dd.toVal = data.toVal;
        break;
      default:
        break;
    }

    this.setTitle();
  };

  private setTitle() {
    // get saved selection
    let all = this.util.lang.get('all');
    this.dd.title = all;

    if (this.valid() && this.dd.targetId) {
      this.dd.title = this.dd.targetId;

      switch (this.dd.targetId) {
        case 'Between':
          this.dd.title += ' ' + this.dd.fromVal + ' - ' + this.dd.toVal;
          break;
        default:
          break;
      }
    }
  }

  valid() {
    if (!this.dd.targetId) {
      return true;
    }

    switch (this.dd.targetId) {
      case 'Between':
        if (!this.dd.toVal || !this.dd.fromVal) {
          return false;
        }
        try {
          let fromVal = this.util.parseDate(this.util.userDateFormat, this.dd.fromVal);
          let toVal = this.util.parseDate(this.util.userDateFormat, this.dd.toVal);
          if (fromVal > toVal) {
            return false;
          }
        } catch (e) {
          return false;
        }
        break;
      default:
        return false;
        break;
    }

    return true;
  }

  onToggle(open: any) {
    if (open) {
      this.backup = this.util.copy(this.dd);
    } else {
      if (!this.closeAfterUpdate) {
        if (!this.valid()) {
          if (this.isDirty()) {
            Object.assign(this.dd, this.backup);
          }
        } else {
          this.update();
        }

        this.closeAfterUpdate = false;
      }

      this.setTitle();
    }
  }

  private isDirty() {
    for (let key in this.dd) {
      if (this.dd.hasOwnProperty(key) && key !== 'title' && this.dd[key] !== this.backup[key]) {
        return true;
      }
    }

    return false;
  }

  onRadioChange(type: any) {
    this.dd.targetId = type;
    switch (type) {
      case 'Between':
        this.dd.iswithIn = "Last";
        this.dd.targetVal = "";
        this.dd.targetWithin = "minutes";
        this.dd.onDate = "";
        break;
    }
  }

  update() {
    if (!this.isDirty() || !this.valid()) {
      this.closeAfterUpdate = true;
      this.dropDown.close();
      this.onDropdownClose.emit();
      return;
    }

    let id = "";
    let rangeData: any = {
      targetId: this.dd.targetId,
      dataType: 'Date'
    };

    if (this.dd.targetId) {
      this.ddData.hasValue = true;
    } else {
      delete this.ddData.hasValue;
    }

    switch (this.dd.targetId) {
      case 'Between':
        id = 'rptbetween#from#' + this.dd.fromVal + '|' + this.dd.toVal;
        rangeData.fromVal = this.dd.fromVal;
        rangeData.toVal = this.dd.toVal;
        break;
      default:
        id = '-1';
        rangeData = null;
        break;
    }

    this.ddData.popupTo.data = [{
      id: id,
      value: id,
      isSelected: false,
      imageId: 0,
      rangeFilterData: rangeData
    }];

    this.onSelectionChange.emit(this.ddData);

    this.closeAfterUpdate = true;
    this.dropDown.close();
    this.onDropdownClose.emit();
  }

  reset(silent?: any) {
    this.dd = this.util.copy(this.defOpt);
    !silent && this.update();
  }

  getFutureDate(number: any, isNextDay: any) {
    let currentDate = new Date(),
      selectedDate,
      rawOffSet = (window as any)['USP'].localeVO._timezone.rawOffset;


    if (isNextDay) {
      selectedDate = new Date(currentDate.setDate(currentDate.getDate() + number));
    } else {
      selectedDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + number));
    }

    let utc = selectedDate.getTime() + (this.getDaylightSavingTime(selectedDate) * 60000);
    let nd = new Date(utc + rawOffSet);
    return this.util.formatDate(this.util.userDateFormat, new Date(nd.toUTCString()));
  }

  getStdTimezoneOffset(selectedDate: any) {
    let jan = new Date(selectedDate.getFullYear(), 0, 1);
    let jul = new Date(selectedDate.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  }

  getDaylightSavingTime(selectedDate: any) {
    let timeZoneOffset = 0;
    let stdTimeZOneOffSet = this.getStdTimezoneOffset(selectedDate);
    if (selectedDate.getTimezoneOffset() < stdTimeZOneOffSet) {
      timeZoneOffset = stdTimeZOneOffSet;
    } else {
      timeZoneOffset = selectedDate.getTimezoneOffset();
    }
    return timeZoneOffset;
  }

}
