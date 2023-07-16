import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnDestroy, ViewContainerRef } from '@angular/core';
import { CommonUtilService } from '../common-util.service';
import { ListingApiService } from '../listing-api.service';
import { ApiConstant } from '../api-constant.enum';
import { AppConstant } from '../app-constant.enum';
import { ViewType, PartialRefreshParams } from '../listing.enum';
import { INPUT_DATA_TYPE } from '../actions.enum';
import { get, debounce } from 'lodash';
import { BroadcastService } from '../../shared/broadcast.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-table-listing',
  templateUrl: './table-listing.component.html',
  styleUrls: ['./table-listing.component.scss']
})
export class TableListingComponent implements OnInit, OnDestroy {

  // Inputs
  @Input('appType') appType: any = 0;

  @Input('defaultFilterList') defaultFilterList: any;

  @Input('listData') listData: any;

  @Input('inifiniteScroll') inifiniteScroll: any = true;

  @Input('folderPath') folderPath: any;

  @Input('noRecordMsg') noRecordMsg: any;

  @Input('pager') pager: any = true;

  @Input('rpp') rpp: any = true;

  @Input('breadcrumb') breadcrumb: boolean = true;

  @Input('recordCounter') recordCounter: boolean = true;

  @Input('customizable') customizable: boolean = true;

  @Input('resizable') resizable: boolean = true;

  @Input('draggable') draggable: boolean = true;

  @Input('dragFiles') dragFiles: boolean = false;

  @Input('enableColumnFilter') enableColumnFilter: boolean = true;

  @Input('checkboxColumn') checkboxColumn: boolean = true;

  @Input('template') template: any = {};

  @Input('viewSwitch') viewSwitch: boolean = false;

  @Input('allowResizeWin') allowResizeWin: boolean = false;

  @Input('enableSorting') enableSorting: boolean = true;

  @Input('treeSelection') treeSelection: any;

  @Input('multipleListing') multipleListing: any;

  // Events
  /**
   * @description Manipulate row data after partial refresh
   * @type {*}
   * @memberof TableListingComponent
   */
  @Output() manipulateRowData: EventEmitter<any> = new EventEmitter<any>();
  /**
   * @description Event emitter for change in listing (Paging, rpp)
   * @type {EventEmitter<any>}
   * @memberof TableListingComponent
   */
  @Output() onSelectionChange: EventEmitter<any> = new EventEmitter<any>();
  /**
   * @description Event emitter for change in row selection
   * @type {EventEmitter<any>}
   * @memberof TableListingComponent
   */
  @Output() onRowSelectionChange: EventEmitter<any> = new EventEmitter<any>();
  /**
   * @description Event emitter for change in flag
   * @type {EventEmitter<any>}
   * @memberof TableListingComponent
   */
  @Output() onFlagChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @description Event emitter for when selected rows are updated
   * @type {EventEmitter<any>}
   * @memberof TableListingComponent
   */
  @Output() onRowUpdated: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @description Event emitter for change in delete key
   * @type {EventEmitter<any>}
   * @memberof TableListingComponent
   */
  @Output() onSingleDelete: EventEmitter<any> = new EventEmitter<any>();
  /**
   * @description Event emitter for change in delete all
   * @type {EventEmitter<any>}
   * @memberof TableListingComponent
   */
  @Output() onDeleteAll: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @description Event emitter for change in Min/Max view
   * @type {EventEmitter<any>}
   * @memberof TableListingComponent
   */
  @Output() onMinMaxWinChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @description Selected data array
   * @type {*}
   * @memberof TableListingComponent
   */
  selectedData: any = [];

  /**
   * @description Element reference of component
   * @type {ElementRef}
   * @memberof TableListingComponent
   */
  @ViewChild('element', { static: true }) $element: any;

  /**
   * @description Global jQuery context
   * @private
   * @type {*}
   * @memberof TableListingComponent
   */
  private $: any = (window as any)['jQuery'];
  /**
   * @description Default minimum column width
   * @private
   * @memberof TableListingComponent
   */
  private minColWidth = 35;
  /**
   * @description Initial Rows to show onLoad
   * @private
   * @memberof TableListingComponent
   */
  private initialRows = 0;
  /**
   * @description Add buffer rows for infinite scroll
   * @private
   * @memberof TableListingComponent
   */
  private rowBuffer = 4;
  /**
   * @description Least amount of rows to be added while inifnite scrolling
   * @private
   * @memberof TableListingComponent
   */
  private loadItems = 20;
  /**
   * @description Min height added to scroll
   * @private
   * @memberof TableListingComponent
   */
  private scrollAreaHeight = 30;
  /**
   * @description Row height
   * @private
   * @memberof TableListingComponent
   */
  private rowHeight = 37;
  /**
   * @description jQuery body element
   * @private
   * @type {*}
   * @memberof TableListingComponent
   */
  private bodyElement: any = '';
  /**
   * @description Last Index of row for shift + selection by checkbox
   * @private
   * @memberof TableListingComponent
   */
  private lastIndex = 0;
  /**
   * @description Timestamp for event binding
   * @type {*}
   * @memberof TableListingComponent
   */
  timestamp: any = '';
  /**
   * @description Scope passed for child components
   * @memberof TableListingComponent
   */
  multiScope = {};
  /**
   * @description Key of UniqueId in each row
   * @memberof TableListingComponent
   */
  uniqueId = '';

  /**
   * @description Pending sort column object
   * @memberof TableListingComponent
   */
  pendingSortingColumn: any;

  /**
   * @description Data type constants
   * @memberof TableListingComponent
   */
  INPUT_DATA_TYPE: any = INPUT_DATA_TYPE;

  /**
   * Set `true` to disable drag and drop
   */
  freezeDnD: boolean = false;

  /**
   * Define min or max view
   */
  maxView: boolean = false;

  /**
   * @description Workflow css class map
   * @private
   * @memberof TableListingComponent
   */
  private workflowStatusCssClassMap: any = {
    1: 'scheduled', // workflow is RUNNING.
    2: 'pending', // workflow is COMPLETED.
    3: 'overdue', // workflow is FAILED.
    4: 'overdue', // workflow is SUSPENDED.
    5: 'overdue' // workflow is CANCELLED.
  };
  /**
   * @description Tooltip
   * @private
   * @memberof TableListingComponent
   */
  private altTitleMap: any = {
    revisionNum: '',
    issueNo: ''
  };

  private customColumns: any = {
    workflowStatus: (itemB: any, itemH: any, index: any) => {
      let title = this.tooltip(itemB, itemH);
      const workflowStatusVO = itemB.workflowStatusVO;

      if (!workflowStatusVO || !workflowStatusVO[itemH.fieldName]) {
        return '--';
      }

      const data = workflowStatusVO[itemH.fieldName] || '';
      if (!title) {
        title = workflowStatusVO.workflowName || '';
      }

      title = title.replace(/\"/g, '&quot;');

      // tslint:disable-next-line: max-line-length
      const text = this.$('<a href="javascript:void(0)" title="' + title + '" class="text-ellipsis cursor-pointer ' + this.workflowStatusCssClassMap[workflowStatusVO.workflowStatusId] + '">' + data + '</a>');
      // (!itemB.hasOwnProperty('canView') || itemB.canView) && text.bind('click', (e) => {
      //   let fn = this.listingApi.viewWorkflowProgress;
      //   fn && fn.call(this.listingApi, itemB);
      // });

      return text;
    },
    removeAssocflag: (itemB: any, itemH: any, index: any) => {
      const text = this.$('<a href="javascript:void(0)" title="Remove"><i class="fa fa-trash"></i></a>');
      // (!itemB.hasOwnProperty('canView') || itemB.canView) && itemH['function'] && text.bind('click', (e) => {
      //   let fn = this.listingApi[itemH['function']];
      //   let i = this.listingData.itemBody.indexOf(itemB);
      //   fn && fn.call(this.listingApi, this.listingData.itemBody, text, i, (array, el, i) => {
      //     this.onSingleDelete.emit({ e: e, array: array, item: itemB, index: i, type: this.listingData.listingType });
      //   });
      // });

      return text;
    },
  };

  private activityLangKeyMap: any = {
    1001: 'revision-upload',
    1002: 'file-distribution',
    1003: 'viewer-edit-attribute',
    1004: 'update-status',
    1005: 'discussion'
  }

  /**
   * @description General Column Template
   * @private
   * @memberof TableListingComponent
   */
  private templateMap: any = {
    checkbox: (itemB: any, itemH: any, index: any) => {
      let checkbox: any = document.createElement('input');
      checkbox.type = 'checkbox';

      if (this.checkboxColumn || (!itemB.hasOwnProperty('canView') || itemB.canView)) {

        this.selectedData.some((item: any, index: any) => {
          if (item[this.uniqueId] === itemB[this.uniqueId]) {
            this.selectedData.splice(index, 1, itemB);
            itemB.checked = true;
            return true;
          } else {
            return false;
          }
        });

        checkbox.checked = itemB.checked;

        checkbox = this.$(checkbox);

        checkbox.bind('click', (e: any) => {
          this.checkboxClick(e, itemB, index);
        });
      } else {
        checkbox.disabled = true;
        checkbox.checked = false;
      }

      checkbox = this.$(checkbox).addClass('check-row');
      return checkbox;
    },
    img: (itemB: any, itemH: any, index: any) => {
      const title = this.tooltip(itemB, itemH);
      let img;
      if (itemB[itemH.fieldName]) {
        if (itemH.fieldName === 'attachmentImageName' || itemH.fieldName === 'assocFormImgName') {
          img = `<div class="dropdown assoc-dd">
            <button class="btn btn-default dropdown-toggle no-border" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <img title="${title}" src="/images/${itemB[itemH.fieldName]}" height=16 width=16 />
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <div class="aLoader"></div>
            </div>
          </div>`
        } else {
          img = `<img title="${title}" src="/images/${itemB[itemH.fieldName]}" height=16 width=16 />`;
        }
      } else {
        img = '<span>--</span>';
      }

      img = this.$(img);
      if (itemH.fieldName === 'flagTypeImageName' || itemH.fieldName === 'attachmentImageName'
        || itemH.fieldName === 'chkStatusImgName' || itemH.fieldName === 'attachmentImgName') {
        img.addClass('cursor-pointer');
      }

      if (itemH.fieldName === 'commentImgName' && itemH['function'] === 'openCommentsDocument') {
        img.addClass('cursor-pointer');
        let commentTooltipLoaded = false;
        img.hover(() => {
          if (commentTooltipLoaded) {
            return;
          }
          commentTooltipLoaded = true;
          // this.listingApi.getCommentMarkupToolTip(itemB, (tooltip) => {
          //   img.attr('title', tooltip)
          // });
        });
      }
      return img;
    },
    imgwithtext: (itemB: any, itemH: any) => {
      const title = this.tooltip(itemB, itemH);
      let a;
      let userId = '';
      let data = itemB[itemH.fieldName];

      if (itemH['funParams']) {
        userId = itemB[itemH['funParams']];
      }

      if (!data) {
        return '--';
      }

      data = (data + '').replace(/&/g, '&amp;');
      const url = ApiConstant.IMAGE_PATH + (userId + '').split('$$')[0] + '&v=' + this.util.getLastModifiedProfileTime(data.split('#')[0]);
      if (itemH['function'] && (!itemB.hasOwnProperty('canView') || itemB.canView)) {
        // tslint:disable-next-line: max-line-length
        a = '<a href="javascript:void(0)" title="' + title + '" class="text-ellipsis cursor-pointer" user-id="' + userId + '"><img src="' + url + '" class="user-img img-circle" onerror="this.onerror=null;this.src=\'/images/avatar.png\'" height=24 width=24 /> ' + data.split('#')[1] + '</a>';
      } else {
        a = '<span title="' + title + '" class="text-ellipsis"><img src="' + url + '" class="user-img" onerror="this.onerror=null;this.src=\'/images/avatar.png\'" height=24 width=24 /> ' + data.split('#')[1] + '</span>';
      }

      a = this.$(a);
      // itemH['function'] && (!itemB.hasOwnProperty('canView') || itemB.canView) && a.bind('click', (e) => {
      //   let fn = this.listingApi[itemH['function']];
      //   fn && fn.call(this.listingApi, itemB);
      // });

      return a;
    },
    textwithimg: (itemB: any, itemH: any) => {
      const title = this.tooltip(itemB, itemH);
      let text: any = '';
      let data = itemB[itemH.fieldName];

      if (!data) {
        return '--';
      }

      data = (data + '').replace(/&/g, '&amp;');
      if (data.indexOf('#filetype') > -1) {
        text = ' <img src="/images/' + data.split('#')[1] + '" width="16" height="16" />';
      }

      // tslint:disable-next-line: max-line-length
      text = '<a href="javascript:void(0)" class="text-ellipsis cursor-pointer" title="' + title + '">' + data.split('#')[0] + text + '</a>';

      // if ((!itemB.hasOwnProperty('canView') || itemB.canView) && itemH['function']) {
      // tslint:disable-next-line: max-line-length
      //   text = '<a href="javascript:void(0)" class="text-ellipsis cursor-pointer" title="' + title + '">' + data.split('#')[0] + text + '</a>';
      // } else {
      //   text = '<span class="text-ellipsis" title="' + title + '">' + data.split('#')[0] + text + '</span>';
      // }

      text = this.$(text);
      // if ((!itemB.hasOwnProperty('canView') || itemB.canView) && itemH['function']) {
      //   text.bind('click', (e) => {
      //     let fn = this.listingApi[itemH['function']];
      //     fn && fn.call(this.listingApi, itemB);
      //   });
      // }

      return text;
    },
    textwithlink: (itemB: any, itemH: any) => {
      const title = this.tooltip(itemB, itemH) || '';
      let text;

      let data = itemB[itemH.fieldName];
      if (!data) {
        return '--';
      }

      data = (data + '').replace(/&/g, '&amp;');
      if (!itemB.hasOwnProperty('canView') || itemB.canView) {
        text = this.$('<a href="javascript:void(0)" class="text-ellipsis cursor-pointer" title="' + title + '">' + data + '</a>');
        this.setStatusPopover(itemH, text, title);
        if (itemH['function']) {
          text.bind('click', (e: any) => {
            let fn: any = (this.listingApi as any)[itemH['function']];
            fn && fn.call(this.listingApi, itemB);
          });
        }
      } else {
        text = this.$('<span class="text-ellipsis" title="' + title + '">' + data + '</span>');
      }

      return text;
    },
    multiobject: (itemB: any, itemH: any) => {
      const title = this.tooltip(itemB, itemH);
      let text = '';
      let html;

      if (itemH.fieldName === 'actions#actionTime') {
        let activeAction: any = null;
        let actionTime: any = null;

        // tslint:disable-next-line: no-unused-expression
        itemB.actions && itemB.actions.forEach((action: any) => {
          if (action.isActive && action.actionStatus === 0 && action.recipientId === (window as any)['USP'].userID.split('$$')[0]) {
            const currentTime = parseInt(action.actionTime.split(' ')[0]);
            if (!actionTime || actionTime > currentTime) {
              actionTime = currentTime;
              activeAction = action;
            }
          }
        });

        if (activeAction) {
          text = activeAction.actionTime || '--';
        }
      } else {
        text = get(itemB, itemH.fieldName.replace('#', '[0].'), '--');
        text = text.replace(/&/g, '&amp;');
        // tslint:disable-next-line: no-unused-expression
        !text && (text = '--');
      }

      if (text && itemH.dataType == 'timestamp') {
        text = text.split('#')[0];
      }

      if (itemH.fieldName === 'actions#actionName') {
        const recipientId = itemB['actions'][0].recipientId;
        const actionStatus = itemB['actions'][0].actionStatus;
        const currentUserId = (window as any)['USP'].userID && (window as any)['USP'].userID.split('$$') && parseInt((window as any)['USP'].userID.split('$$')[0]);

        if (actionStatus || currentUserId !== recipientId || (itemB.hasOwnProperty('canView') && !itemB.canView)) {
          html = `<span class="text-ellipsis" title="${title}">${text}</span>`;
        } else {
          html = `<a href="javascript:void(0)" title="${title}" class="text-ellipsis cursor-pointer">${text}</a>`;
          if (this.listingData.listingType === AppConstant.FILE_TRANSMITTAL_LISTING) {
            itemH['function'] = 'completeFileAction';
          } else if (this.listingData.listingType === AppConstant.APPS_TRANSMITTAL_LISTING) {
            itemH['function'] = 'completeFormAction';
          }
        }
      } else {
        const userCard = (!itemB.hasOwnProperty('canView') || itemB.canView) && itemH['function'] && itemH['function'] === 'showUserContactCard' ? `user-id="${itemB.actions[0] && itemB.actions[0].recipient_user_id}"` : '';
        if ((!itemB.hasOwnProperty('canView') || itemB.canView) && itemH['function'] && text != '--') {
          html = `<a href="javascript:void(0)" title="${title}" class="text-ellipsis cursor-pointer"  ${userCard}>${text}</a>`;
        } else {
          html = `<span class="text-ellipsis" title="${title}">${text}</span>`;
        }
      }

      html = this.$(html);
      if ((!itemB.hasOwnProperty('canView') || itemB.canView) && itemH['function'] && text !== '--') {
        // html.bind('click', (e) => {
        //   let fn = this.listingApi[itemH['function']];
        //   fn && fn.call(this.listingApi, itemB, undefined, this.util.copy(this.listData), () => {
        //     this.onRowUpdated.emit([itemB]);
        //   });
        // });
      }
      return html;
    },
    multiobjectwithcount: (itemB: any, itemH: any, index: any) => {
      if (!itemB.actions || !itemB.actions.length) {
        return '';
      }
      return itemB.actions[0].actionName;
    },
    text: (itemB: any, itemH: any) => {
      const title = this.tooltip(itemB, itemH)
      let text;
      // console.log('****************', itemH)
      let data = itemB[itemH.fieldName] || '';

      if (itemH.fieldName == 'Amount Sent') {
        data = itemB['amount_sent'] || '';
      }
      data = (data + '').replace(/&/g, '&amp;');
      data = itemH.dataType === 'timestamp' ? (data.split('#')[0] || '--') : (data || '--');

      if (itemH.fieldName === 'issueNo' || itemH.fieldName === 'revisionNum') {
        itemH['function'] = 'openDocument';
      }

      if ((!itemB.hasOwnProperty('canView') || itemB.canView) && itemH['function'] && data != '--') {
        text = '<a href="javascript:void(0)" title="' + title + '" class="text-ellipsis cursor-pointer">' + data + '</a>';
      } else {
        text = '<span title="' + title + '" class="text-ellipsis">' + data + '</span>';
      }

      text = this.$(text);
      this.setStatusPopover(itemH, text, title);
      // if ((!itemB.hasOwnProperty('canView') || itemB.canView) && itemH['function'] && data != '--') {
      //   text.bind('click', (e) => {
      //     let fn = this.listingApi[itemH['function']];
      //     fn && fn.call(this.listingApi, itemB);
      //   });
      // }

      return text;
    },
    thumb: (itemB: any) => {
      return '';
    }
  };

  /**
   * @description Customization Object
   * @type {*}
   * @memberof TableListingComponent
   */
  customization: any = {
    selectedField: [],
    availableField: [],
    leftSelected: [],
    rightSelected: [],
    isopen: false,
    pager: true,
    pagedItems: 0,
    gap: 5
  };

  /**
   * @description Listing data object
   * @type {*}
   * @memberof TableListingComponent
   */
  listingData: any = {
    itemHeader: [],
    allHeader: [],
    itemBody: [],
    allItem: [],
    sortOrder: null,
    sortField: null,
    sortFieldType: null,
    noRecordMsg: ''
  };
  /**
   * @description Default view type enum
   * @type {*}
   * @memberof TableListingComponent
   */
  ViewType: any = ViewType;

  private columnFilterXhr: any;

  filterCriteriaData: any = [];

  private treeBackup: any = {
    projectId: '-1',
    folderId: '-1'
  };


  /**
   * @description Default active view type
   * @memberof TableListingComponent
   */
  activeViewType: any = this.ViewType.LIST;
  lazyLoadCompleted: boolean = false;
  maintainScrollPosition: boolean = false;

  private inifiniteScrollLocal: any;
  private onRowSelectionChangedDebouncer: any;
  private curOpenActionPopover: any;
  private curListingType: any;
  private setDefaultAdminFIlter = false;
  private adminDefaultFilters: any = [];
  private scrollTimer: any = undefined;
  private resizeTimer: any = undefined;
  private resizing: boolean = false;

  constructor(
    private util: CommonUtilService,
    public listingApi: ListingApiService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
  ) { }


  ngOnInit() {
    this.bodyElement = this.$('body');
    Object.assign(this.templateMap, this.template);
    this.inifiniteScrollLocal = this.inifiniteScroll;
    this.onRowSelectionChangedDebouncer = debounce(this.onRowSelectionChanged, 100);
    this.listingData.recordBatchSize = this.listingApi.retainNoOfShow = (window as any)['retainNoOfShow'] || 10;

    this.setLazyLoadBatchSize();
    this.uniqueId;
    this.timestamp = (new Date()).getTime();
    this.init();
    this.broadcast.on<String>('searchResult').subscribe(data => {
      console.log
    })
  }

  ngOnDestroy() {
    this.$(this.$element.nativeElement).find('.gbody').unbind('scroll');
    this.$(this.$element.nativeElement).find('.thumbnail-wrapper').unbind('scroll');
    this.$((window as any)).unbind('resize.listing' + this.timestamp);
    this.removeStatusTooltip();
  }

  /**
   * @description Set lazy load batch size based on window size and `inifiniteScroll` is enabled or not
   * @memberof TableListingComponent
   */
  setLazyLoadBatchSize() {
    if (this.inifiniteScroll) {
      this.listingApi.lazyLoadBatchSize = this.listingApi.retainNoOfShow;
      return;
    }

    this.listingApi.lazyLoadBatchSize = this.getEnoughRowCount();
  }

  /**
   * @description Set view type from data (Tile/List)
   * @memberof TableListingComponent
   */
  setViewType() {
    if (this.viewSwitch && this.listData && this.listData.viewType && this.listData.viewType == this.ViewType.THUMB) {
      this.activeViewType = this.ViewType.THUMB;
      this.inifiniteScroll = false;
    } else {
      this.inifiniteScroll = this.inifiniteScrollLocal;
    }
  }

  /**
   * @description Switch Min/Max
   * @memberof TableListingComponent
   */
  toggleMinMaxView() {
    this.maxView = !this.maxView;
    this.onMinMaxWinChange.emit(this.maxView);
  }

  /**
   * @description Switch view (Tile/List)
   * @param {*} viewType
   * @memberof TableListingComponent
   */
  changeView(viewType: any) {
    if (this.listData.viewType === viewType) {
      return;
    }
    this.listData.viewType = viewType;
    this.activeViewType = viewType;
    // this.listingApi.saveDefaultListingView({
    //   viewType: this.activeViewType,
    //   listingType: this.listingData.listingType
    // });
    this.init();
    // this.filterMainComponent.toggleFilterClass();
  }

  /**
   * @description Init all data and events
   * @returns
   * @memberof TableListingComponent
   */
  init() {
    if (!this.listData || !this.listData.columnHeader) {
      return;
    }

    this.lazyLoadCompleted = false;
    this.selectedData.length = 0;
    const data = this.listData;

    const type = data.listingType;
    if (this.curListingType !== type) {
      this.curListingType = type;
      this.setDefaultAdminFIlter = true;
    } else {
      this.setDefaultAdminFIlter = false;
    }

    this.rpp = (this.listData.editable) ? this.rpp : false;
    this.draggable = (this.listData.editable) ? this.draggable : false;

    this.removeStatusTooltip();
    this.setViewType();
    this.setLazyLoadBatchSize();

    switch (type) {
      case AppConstant.LATEST_DATA1_LISTING_TYPE:
        this.uniqueId = 'smSiteCode';
        break;
      case AppConstant.ALARM_STATUS_LISTING_TYPE:
        this.uniqueId = 'alrid';
        break;
      case AppConstant.TEE_POWER_TRACKER_LISTING_TYPE:
        this.uniqueId = 'smSiteId';
        break;
      case AppConstant.HYBRID_POWER_TRACKER_LISTING_TYPE:
        this.uniqueId = 'smSiteId';
        break;
      case AppConstant.TEE_ENERGY_RUN_HOURS_LISTING_TYPE:
        this.uniqueId = 'smSiteId';
        break;
      case AppConstant.HYBRID_ENERGY_RUN_HOURS_LISTING_TYPE:
        this.uniqueId = 'smSiteId';
        break;
      case AppConstant.COUNTRY_MASTER_LISTING_TYPE:
        this.uniqueId = 'countryID';
        break;
      case AppConstant.REGION_MASTER_LISTING_TYPE:
        this.uniqueId = 'rgRegionID';
        break;
      case AppConstant.ZONE_MASTER_LISTING_TYPE:
        this.uniqueId = 'znZoneID';
        break;
      case AppConstant.EMPLOYEE_MASTER_LISTING_TYPE:
        this.uniqueId = 'emEmpID';
        break;
      case AppConstant.EMPLOYEE_ROLE_MASTER_LISTING_TYPE:
        this.uniqueId = 'erRoleID';
        break;
      case AppConstant.TEE_POWER_TRACKER_LISTING_TYPE:
        this.uniqueId = 'smSitecode';
        break;
      case AppConstant.SITE_MASTER_LISTING_TYPE:
        this.uniqueId = 'smSitecode';
        break;
      case AppConstant.USER_LISTING_TYPE:
        this.uniqueId = 'umID';
        break;
      case AppConstant.CLUSTER_MASTER_LISTING_TYPE:
        this.uniqueId = 'crClusterID';
        break;
      case AppConstant.SIM_MASTER_LISTING_TYPE:
        this.uniqueId = 'simID';
        break;
      case AppConstant.FAULT_CATEGORY_LISTING_TYPE:
        this.uniqueId = 'faultID';
        break;
      case AppConstant.OUTAGE_CATEGORY_LISTING_TYPE:
        this.uniqueId = 'outageCatID';
        break;
      case AppConstant.ISSUE_CATEGORY_LISTING_TYPE:
        this.uniqueId = 'issueCatID';
        break;
      case AppConstant.REMOTE_COMMANDS_LISTING_TYPE:
        this.uniqueId = 'rmcid';
        break;
      case AppConstant.VIEW_REMOTE_SITE_LISTING_TYPE:
        this.uniqueId = 'issueCatID';
        break;
      case AppConstant.ENERGY_BILLING_REPORT_LISTING_TYPE:
        this.uniqueId = 'smSiteCode';
        break;
      default:
        this.uniqueId = 'distUniqueId';
    }

    Object.assign(this.listingData, {
      recordBatchSize: this.listingApi.retainNoOfShow,
      totalDocs: data.totalDocs,
      recstartfrom: data.recordStartFrom,
      listingType: data.listingType,
      currentPage: data.currentPageNo || 1,
      recEndfrom: Math.min((data.currentPageNo || 1) * this.listingApi.retainNoOfShow, data.totalDocs),
      path: this.folderPath,
      noRecordMsg: data.data && data.data.length ? '' : (this.noRecordMsg || 'No record available')
    });

    this.freezeDnD = false;
    this.loadColumnFilterData();

    setTimeout(() => {
      this.bindEvent();
      if (this.activeViewType === this.ViewType.LIST) {
        const gbody = this.$(this.$element.nativeElement).find('.gbody');
        gbody.scrollTop(0);
        // tslint:disable-next-line: no-unused-expression
        !this.maintainScrollPosition && gbody.scrollLeft(0);
        this.maintainScrollPosition = false;
        this.setInitRowCount();
        this.sortHeader(data);
        this.render(data);
        gbody.prev().scrollLeft(gbody.scrollLeft());
        this.updateCheckAll();
      } else {
        const thubnailWrapper = this.$(this.$element.nativeElement).find('.thumbnail-wrapper');
        thubnailWrapper.scrollTop(0);
        this.renderThumbnail(data);
      }
      this.onRowSelectionChanged();
    });
  }

  /**
   * @description Add new items into exiting list
   * @param rows - list of new row
   * @memberof TableListingComponent
   */
  addNewRows(rows: any) {
    this.listingData.allItem = this.listData.data || [];
    const fragment = this.$(document.createDocumentFragment());

    if (this.activeViewType === this.ViewType.LIST) {
      const len = this.listingData.allItem.length - rows.length;
      rows.forEach((itemB: any, i: any) => {
        this.listingData.itemBody.push(itemB);
        fragment.append(this.addRow(itemB, len + i));
      });

      this.$(this.$element.nativeElement).find('.list-item-container').append(fragment);
      if (this.listingData.checkAll) {
        setTimeout(() => {
          this.checkall();
        });
      }
      return;
    }

    rows.forEach((itemB: any, i: any) => {
      this.listingData.itemBody.push(itemB);
      fragment.append(this.templateMap['thumb'](itemB));
    });

    this.$(this.$element.nativeElement).find('.thumbnail-item-container').append(fragment);
  }

  /**
   * @description Get column filter criteria
   * @returns
   * @memberof TableListingComponent
   */
  loadColumnFilterData() {
    if (!this.listData || !this.enableColumnFilter) {
      return;
    }

    const projectId = this.getProjectId();
    const folderId = this.getFolderId();

    // tslint:disable-next-line: max-line-length
    if (this.filterCriteriaData && this.filterCriteriaData.length && this.treeBackup.projectId === projectId && this.treeBackup.folderId == folderId) {
      this.addAdminDefaultFilters();
      this.setColumnFilterData();
      return;
    }

    if (this.columnFilterXhr) {
      this.columnFilterXhr.unsubscribe();
    }

    this.treeBackup.projectId = projectId;
    this.treeBackup.folderId = folderId;

    this.columnFilterXhr = this.util.ajax({
      url: ApiConstant.SEARCH_FILTER_CONTROLLER,
      method: 'POST',
      data: {
        action_id: AppConstant.GET_USER_SEARCH_FILTERS_COLUMNS,
        // collectionType: this.filterData.opts.listingType,
        appType: this.appType,
        selectedProjectIds: projectId,
        selectedFolderIds: folderId
      },
      _dcId: this.treeSelection ? this.treeSelection.dcId : undefined,
      success: (response: any) => {
        if (!response.body) {
          return;
        }
        this.columnFilterXhr = false;

        if (!response.body.fieldsColumns && !response.body.fieldsColumns.length) {
          return;
        }

        this.filterCriteriaData.length = 0;
        response.body.fieldsColumns.forEach((item: any) => {
          // item.langlabelName = this.util.lang.get(item.languageKey) || item.fieldName;
          this.filterCriteriaData.push(item);
        });

        this.addAdminDefaultFilters();
        this.setColumnFilterData();
      },
      error: (err: any) => {
        this.columnFilterXhr = false;
      }
    });
  };

  /**
   * @description Set column filter data in column header detail
   * @returns
   * @memberof TableListingComponent
   */
  setColumnFilterData() {
    // tslint:disable-next-line: max-line-length
    // if (!this.filterCriteriaData || !this.filterCriteriaData.length || !this.listData.columnHeader || !this.filterMainComponent || this.listData.viewType === this.ViewType.THUMB) {
    // tslint:disable-next-line: max-line-length
    if (!this.filterCriteriaData || !this.filterCriteriaData.length || !this.listData.columnHeader || this.listData.viewType === this.ViewType.THUMB) {
      return;
    }

    const appliedFilters: any = null; // this.filterMainComponent.getSelectedFilter().filterQueryVOs || [];
    this.listData.columnHeader.forEach((header: any) => {
      let headerFieldName = header.fieldName.toLowerCase();
      if (headerFieldName === 'actions#actionname#actiontime') {
        headerFieldName = 'actions#actionname';
      }

      if (this.curListingType === AppConstant.DISCUSSION_LISTING) {
        if (headerFieldName === 'uploadfilename') {
          headerFieldName = 'filetype';
        }

        if (headerFieldName === 'doctitle') {
          headerFieldName = 'description';
        }

        if (headerFieldName === 'attachmentimagename') {
          headerFieldName = 'assocformimgname';
        }
      }

      this.filterCriteriaData.some((item: any) => {
        const listingColumnFieldName = (item.listingColumnFieldName && item.listingColumnFieldName.toLowerCase());

        if (header.isCustomAttributeColumn === item.isCustomAttribute &&
          ((headerFieldName === listingColumnFieldName) ||
            (headerFieldName.indexOf('#') === -1 && listingColumnFieldName.indexOf('#') !== -1 &&
              listingColumnFieldName.split('#').indexOf(headerFieldName) !== -1))) {

          header.isFilterApplied = false;
          const originalData = item.popupTo && item.popupTo.data || [];
          appliedFilters.some((appliedItem: any) => {
            if (header.isCustomAttributeColumn === appliedItem.isCustomAttribute &&
              ((listingColumnFieldName === (appliedItem.listingColumnFieldName &&
                appliedItem.listingColumnFieldName.toLowerCase())) ||
                (appliedItem.filterId && appliedItem.indexField === item.indexField))) {
              const labelName = item.labelName;
              item = appliedItem;
              item.fieldName = labelName;
              header.isFilterApplied = true;
              return true;
            } else {
              return false;
            }
          });

          if (!item.popupTo || !item.popupTo.data) {
            item.popupTo = {
              recordBatchSize: 10,
              data: []
            };
            // tslint:disable-next-line: max-line-length
          } else if (header.isFilterApplied && !item.dynamic && originalData.length && (item.optionalValues != '-1' || item.optionalValues != 'null')) {
            const mergeData: any = [];
            originalData.forEach((data: any) => {
              let copyData = null; // this.util.copy(data);
              item.popupTo.data.some((selectedData: any) => {
                if (data.id === selectedData.id) {
                  copyData = null; // this.util.copy(selectedData);
                  return true;
                } else {
                  return false;
                }
              });

              mergeData.push(copyData);
            });

            if (item.isBlankSearchAllowed) {
              item.popupTo.data.some((selectedData: any) => {
                if ('Blank(--)' === selectedData.id) {
                  mergeData.splice(0, 0, {
                    id: 'Blank(--)',
                    imgId: -1,
                    imgPath: null,
                    isActive: true,
                    isSelected: true,
                    rangeFilterData: null,
                    // 'value': this.util.lang.get('blank-filter'),
                    isSystemField: true
                  });
                  return true;
                } else {
                  return false;
                }
              });
            }
            item.popupTo.data = mergeData;
          }

          header.quickSearchData = null; // this.util.copy(item);

          return true;
        } else {
          return false;
        }
      });
    });
  }

  /**
   * @description Added admin default filter based on other filter is added or not
   * @private
   * @returns
   * @memberof TableListingComponent
   */
  private addAdminDefaultFilters() {
    if (!this.setDefaultAdminFIlter) {
      return;
    }

    this.setDefaultAdminFIlter = false;

    const selectedFilter: any = null; // this.filterMainComponent.getSelectedFilter();
    if (this.listData.searchFields && (!selectedFilter.id || selectedFilter.id == -1)) {
      this.removeAdminDefaultFitlers();
      this.adminDefaultFilters = JSON.parse(this.listData.searchFields);
      this.adminDefaultFilters.forEach((searchFieldId: any) => {
        this.filterCriteriaData.some((filter: any) => {
          if (filter.id == searchFieldId) {
            // this.filterMainComponent.addQuery(filter, true, true);
            return true;
          } else {
            return false;
          }
        });
      });

      return;
    }

    this.removeAdminDefaultFitlers();
  }

  /**
   * @description Remove admin default filters if there is no change by user
   * @private
   * @returns
   * @memberof TableListingComponent
   */
  private removeAdminDefaultFitlers() {
    const selectedFilter: any = null; // this.filterMainComponent.getSelectedFilter();

    if (!selectedFilter.id || selectedFilter.id == -1) {
      selectedFilter.filterQueryVOs && selectedFilter.filterQueryVOs.forEach((filter: any) => {
        // tslint:disable-next-line: no-unused-expression
        this.adminDefaultFilters && this.adminDefaultFilters.some((adminFilter: any) => {
          if (filter.id === adminFilter) {
            // this.filterMainComponent.removeQuery(filter, undefined, true);
          }
        });
      });
    }

    this.adminDefaultFilters = [];
  }

  private $statusTitleTip: any;
  /**
   * @description Display tooltip in popover if current field name is status.
   * @private
   * @returns
   * @memberof TableListingComponent
   */
  private setStatusPopover(itemH: any, text: any, title: any) {
    if (itemH.fieldName === 'status' || itemH.isAvailTooltip) {
      text.removeAttr('title');
      this.removeStatusTooltip();

      text.bind('mouseenter', () => {
        if (!this.$statusTitleTip) {
          this.$statusTitleTip = this.$(title);
        }
        const position = text[0].getBoundingClientRect();
        this.$statusTitleTip.css('top', position.top - 34);
        this.$statusTitleTip.css('left', position.left - 520);
        this.$('body').append(this.$statusTitleTip);
      });

      text.bind('mouseleave', () => {
        this.removeStatusTooltip();
      });
    }
  }

  private removeStatusTooltip() {
    if (this.$statusTitleTip && this.$statusTitleTip.length) {
      this.$statusTitleTip.remove();
    }

    this.$statusTitleTip = undefined;
  }

  /**
   * @description Get projectId from tree selection
   * @private
   * @returns
   * @memberof TableListingComponent
   */
  private getProjectId() {
    const treeObj = this.treeSelection || {};
    let projectId = treeObj.projectId || treeObj.projectID || '-1';

    if (!projectId || projectId.split('$$')[0] == -1) {
      projectId = '-1';
    }

    return projectId;
  }

  /**
   * @description Get folderId from tree selection
   * @private
   * @returns
   * @memberof TableListingComponent
   */
  private getFolderId() {
    let folderId = '-1';
    const treeObj = this.treeSelection;

    if (treeObj) {
      if (treeObj.folderId) {
        folderId = treeObj.folderId;
      } else if (treeObj.instanceGroupId) {
        folderId = treeObj.instanceGroupId;
      } else if (treeObj.formType_List) {
        const gId: any = [];
        treeObj.formType_List.forEach((formTypeItem: any) => {
          gId.push(formTypeItem.instanceGroupId);
        });
        folderId = gId.join(',');
      }
    }

    return folderId;
  };

  /**
   * @description Set initial row count for default rows to show in infinite scrolling
   * @private
   * @memberof TableListingComponent
   */
  private setInitRowCount() {
    if (this.inifiniteScroll && this.$(this.$element.nativeElement).find('.gbody').length) {
      this.initialRows = this.getEnoughRowCount();
    }
  };

  /**
   * @description Get row counts to load on scolling
   * @private
   * @returns
   * @memberof TableListingComponent
   */
  private getEnoughRowCount() {
    if (this.inifiniteScroll) {
      const gbodyDom = this.$(this.$element.nativeElement).find('.gbody')[0];
      const height = gbodyDom.clientHeight;
      if (height) {
        return (Math.ceil(gbodyDom.clientHeight / this.rowHeight) + this.rowBuffer);
      }

      return 0;
    }

    const availableHeight = window.innerHeight || (window.screen && window.screen.availHeight);
    return Math.min(this.listingApi.retainNoOfShow, Math.round(availableHeight / this.rowHeight) * 2);
  }

  /**
   * @description Set title of column header
   * @private
   * @param {*} itemH
   * @memberof TableListingComponent
   */
  private setAltTitle(itemH: any) {
    const title = this.altTitleMap[itemH.fieldName];
    if (title) {
      itemH.altTitle = title;
    }
  }

  /**
   * @description Sort columns by position
   * @private
   * @param {*} response
   * @memberof TableListingComponent
   */
  private sortHeader(response: any) {
    response.columnHeader = response.columnHeader.sort((a: any, b: any) => a.userIndex - b.userIndex);

    this.listingData.itemHeader = [];
    this.listingData.allHeader = response.columnHeader || [];
    this.customization.selectedField = [];
    this.customization.availableField = [];

    response.columnHeader.forEach((itemH: any) => {
      if (!this.checkboxColumn && itemH.colType == 'checkbox') {
        return;
      }

      this.setAltTitle(itemH);

      if (response.sortField && response.sortOrder && (response.sortField == itemH.fieldName ||
        (itemH.isCustomAttributeColumn && response.sortField == itemH.id)) && response.sortFieldType == itemH.dataType) {
        itemH.order = response.sortOrder;
        this.listingData.sortOrder = itemH.order;
        this.listingData.sortField = itemH.fieldName;
        this.listingData.sortFieldType = itemH.dataType;
      }

      if (itemH.userIndex > -1) {
        itemH.widthOfColumn = Math.max(itemH.widthOfColumn, this.minColWidth);
        // tslint:disable-next-line: no-unused-expression
        ['checkbox', 'img'].indexOf(itemH.colType) > -1 && (itemH.widthOfColumn = 35);
        this.listingData.itemHeader.push(itemH);
      }
    });

    this.resetCostomFields();

    this.listingData.checkAll = false;
  };

  /**
   * @description Reset customization object
   * @private
   * @returns
   * @memberof TableListingComponent
   */
  private resetCostomFields() {
    this.customization.selectedField = [];
    this.customization.availableField = [];

    const headers = this.listingData.allHeader;
    if (!headers || !headers.length) {
      return;
    }

    headers.forEach((itemH: any) => {
      if (itemH.userIndex > -1) {
        if (itemH.colType == 'checkbox' && itemH.colDisplayName == '') {
          itemH.colDisplayName = 'Checkbox';
        }

        this.customization.selectedField.push(itemH);
      } else {
        this.customization.availableField.push(itemH);
      }
    });

    if (this.customization.availableField.length) {
      this.customization.availableField = this.customization.availableField.sort((a: any, b: any) => a.colDisplayName - b.colDisplayName);
    }

  };

  /**
   * @description Render Html of list view
   * @private
   * @param {*} response
   * @memberof TableListingComponent
   */
  private render(response: any) {
    if (!response.data) {
      response.data = [];
    }

    this.listingData.allItem = response.data.slice(0, response.data.length);
    if (this.inifiniteScroll && this.initialRows && response.data) {
      this.listingData.itemBody = response.data.slice(0, this.initialRows);
      this.lazyLoadCompleted = true;
    } else {
      this.listingData.itemBody = response.data.slice(0, response.data.length);
      // tslint:disable-next-line: max-line-length
      this.lazyLoadCompleted = this.listingApi.retainNoOfShow <= this.listingApi.lazyLoadBatchSize || response.totalDocs <= this.listingApi.lazyLoadBatchSize;
    }

    const fragment = this.$(document.createDocumentFragment());
    this.listingData.itemBody.forEach((itemB: any, i: any) => {
      fragment.append(this.addRow(itemB, i));
    });

    this.$(this.$element.nativeElement).find('.list-item-container').html(fragment);
  }

  /**
   * @description Render Html of tile view
   * @private
   * @param {*} response
   * @memberof TableListingComponent
   */
  private renderThumbnail(response: any) {
    if (!response.data) {
      response.data = [];
    }

    this.listingData.allItem = response.data.slice(0, response.data.length);
    this.listingData.itemBody = response.data.slice(0, response.data.length);

    // tslint:disable-next-line: max-line-length
    this.lazyLoadCompleted = this.listingApi.retainNoOfShow <= this.listingApi.lazyLoadBatchSize || response.totalDocs <= this.listingApi.lazyLoadBatchSize;

    if (this.listingData.itemBody.length) {
      const fragment = this.$(document.createDocumentFragment());
      this.listingData.itemBody.forEach((itemB: any) => {
        fragment.append(this.templateMap['thumb'](itemB));
      });

      this.$(this.$element.nativeElement).find('.thumbnail-item-container').html(fragment);
      return;
    }

    this.$(this.$element.nativeElement).find('.thumbnail-item-container').empty();
  };

  private preventEvent(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }

  /**
   * @description Bind scroll and resizing event
   * @private
   * @memberof TableListingComponent
   */
  private bindEvent() {
    const self = this;

    const elThumbnailWrapper = this.$(this.$element.nativeElement).find('.thumbnail-wrapper');
    const elBody = this.$(this.$element.nativeElement).find('.gbody');
    if (this.activeViewType === this.ViewType.LIST) {
      elThumbnailWrapper.unbind('scroll');
      this.$(this.$element.nativeElement).find('.gbody').unbind('scroll').bind('scroll', () => {
        // tslint:disable-next-line: no-unused-expression
        this.curOpenActionPopover && this.curOpenActionPopover.closePopover();
        this.closeFilterDropdown();
        self.onBodyScroll(elBody[0], elBody.prev(), elBody);
      });
    } else {
      this.$(this.$element.nativeElement).find('.gbody').unbind('scroll');
      elThumbnailWrapper.unbind('scroll').bind('scroll', () => {
        clearTimeout(this.scrollTimer);
        this.scrollTimer = setTimeout(() => {
          // tslint:disable-next-line: max-line-length
          if ((elThumbnailWrapper[0].scrollHeight - elThumbnailWrapper[0].clientHeight - this.scrollAreaHeight) < elThumbnailWrapper.scrollTop()) {
            this.loadMoreRows();
          }
        }, 200);
      });

    }

    this.$(window).unbind('resize.listing' + this.timestamp).bind('resize.listing' + this.timestamp, (event: any) => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        if (this.inifiniteScroll) {
          const visibleRowCount = this.getEnoughRowCount();
          if (visibleRowCount && visibleRowCount > (this.initialRows - 2)) {
            this.addLazyRows();
          }
          return;
        }
        this.setLazyLoadBatchSize();
        if (this.listingApi.lazyLoadBatchSize > (this.listingData.allItem.length - 2)) {
          this.loadMoreRows();
        }
      }, 500);
    });
  }

  /**
   * @description On scroll event callback
   * @private
   * @param {*} gbodyDom
   * @param {*} ghead
   * @param {*} gbody
   * @memberof TableListingComponent
   */
  private onBodyScroll(gbodyDom: any, ghead: any, gbody: any) {
    ghead.scrollLeft(gbody.scrollLeft());

    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      if ((gbodyDom.scrollHeight - gbodyDom.clientHeight - this.scrollAreaHeight) < gbody.scrollTop()) {
        if (this.inifiniteScroll) {
          this.addLazyRows();
          return;
        }

        this.loadMoreRows();
      }
    }, 200);
  }

  private loadMoreRows() {
    if (this.inifiniteScroll) {
      return;
    }

    // tslint:disable-next-line: max-line-length
    let startFrom = Math.max((this.listData.recordStartFrom + this.listingApi.lazyLoadBatchSize), (this.listingData.currentPage - 1) * this.listingApi.retainNoOfShow + (this.listingData.allItem.length || 0));
    if (startFrom >= this.listingData.recEndfrom || startFrom >= this.listingData.totalDocs || this.lazyLoadCompleted) {
      this.lazyLoadCompleted = true;
      return;
    }

    const maxRPP = this.listingData.currentPage * this.listingApi.retainNoOfShow;
    startFrom = Math.min(startFrom, maxRPP);
    // tslint:disable-next-line: max-line-length
    const recordBatchSize = ((maxRPP - startFrom) >= this.listingApi.lazyLoadBatchSize) ? this.listingApi.lazyLoadBatchSize : maxRPP - startFrom;
    this.updateListingData({
      recordStartFrom: startFrom,
      recordBatchSize,
      lazyLoaded: true
    });
  }

  /**
   * @description Add rows on infinite scrolling
   * @private
   * @returns
   * @memberof TableListingComponent
   */
  private addLazyRows() {
    if (!this.initialRows || this.initialRows >= this.listingData.allItem.length) {
      return;
    }

    const len = Math.min(this.listingData.allItem.length, this.initialRows + this.loadItems);
    const fragment = this.$(document.createDocumentFragment());

    for (let i = this.initialRows; i < len; i++) {
      const itemB = this.listingData.allItem[i];
      this.listingData.itemBody.push(itemB);
      fragment.append(this.addRow(itemB, i));
      this.initialRows++;
    }

    this.$(this.$element.nativeElement).find('.list-item-container').append(fragment);
  }

  /**
   * @description Trigger signal when row selection is changed
   * @memberof TableListingComponent
   */
  private onRowSelectionChanged() {
    this.onRowSelectionChange.emit(this.getSelectionDataCurrentPage());
  }


  /**
   * @description Set title of column data
   * @param {*} itemB
   * @param {*} itemH
   * @returns
   * @memberof TableListingComponent
   */
  tooltip(itemB: any, itemH: any) {
    const titlesrc = itemH.tooltipSrc;
    let titleSrcList = [];
    if (titlesrc.indexOf(',') > -1) {
      titleSrcList = titlesrc.split(',');
    }

    let title = '';
    if (titleSrcList.length) {
      titleSrcList.forEach((titleSrcItem: any) => {
        const titlePart = titleSrcItem.split('#');
        if (itemB[titlePart[1]] !== undefined) {
          title += titlePart[0] + ': ' + itemB[titlePart[1]].replace('#', ', ') + '\n';
        }
      });
    } else if (titlesrc.indexOf('#') !== -1) {
      title = get(itemB, titlesrc.replace('#', '[0].'), '');
    } else {
      title = itemB[titlesrc];
    }

    if (title && itemH.dataType === 'timestamp') {
      title = title.split('#')[1];
    }

    // exception for status column for document listing and form listing
    if (itemH.fieldName == 'status') {
      // tslint:disable-next-line: max-line-length
      if (itemB.canAccessHistory && itemB.canAccessHistory !== 'null' && itemB.statusChangeUserName && itemB.statusChangeUserName != 'null') {
        let statusSetBy = itemB.statusChangeUserName;
        if (itemB.statusChangeUserOrg) {
          statusSetBy += ', ' + itemB.statusChangeUserOrg;
        }
        if (itemB.statusChangeUserEmail) {
          statusSetBy += ' (' + itemB.statusChangeUserEmail + ')';
        }
        const statusSetOn = (itemB.statusUpdateDate ? itemB.statusUpdateDate.replace('#', ' ') : '--');
        const userImageUrl = ApiConstant.GET_USER_PHOTO + (itemB.statusChangeUserId || itemB.publisherId || itemB.originatorId);

        title = '<div class=\'status-detail clearfix\'>'
          // tslint:disable-next-line: max-line-length
          + '<div class=\'pull-left img-wrapper\'><img class=\'user-img\' src=\'' + userImageUrl + '\' title=\'' + itemB.statusChangeUserName + '\' /></div>'
          + '<div class=\'pull-left details\'>'
          + '<div class=\'status-detail-row text-ellipsis\'><b>' + 'Status set by' + ': </b> ' + statusSetBy + '</div>'
          + '<div class=\'status-detail-row text-ellipsis\'><b>' + 'Status set on' + ': </b> ' + statusSetOn + '</div>'
          + '</div><div class=\'arrow\'></div></div>';
      }
    }

    if (itemH.fieldName === 'surveyDocuments' || itemH.fieldName === 'surveyPhotos') {
      const data = itemB.ciFeasibilitySurveyDetail;
      let filterData: any = [];
      let ullist: any = [];
      for (let item of filterData) {
        ullist.push(`<ul class="repeated-item"><li>${item.attenName}</li><li>${item.attenPosition}</li></ul>`)
      }
      const table = `<div class='tooltip-detail'>
        <div class='details'>
          <div class='ghead'>
            <ul>
              <li>Name</li>
              <li>Position</li>
            </ul>
          </div>
          <div class='gbody'>
            <div class='list-item-container'>${ullist.join('')}</div>
          </div>
        </div>
        <div class='arrow'></div>
      </div>`;
      if (ullist.length) {
        title = table;
      } else {
        title = '';
      }
    }

    if (itemH.fieldName === 'ymlAttendees' || itemH.fieldName === 'clientAttendees') {
      const data = itemB.ciFirstMomAttendDetail || itemB.ciProposalReviewAttendDetail || itemB.ciSkomAttendDetails;
      let filterData = [];
      if (itemH.fieldName === 'ymlAttendees') {
        filterData = data.filter((item: any) => {
          return item.attenType.toLowerCase() === 'ymp';
        });
      } else if (itemH.fieldName === 'clientAttendees') {
        filterData = data.filter((item: any) => {
          return item.attenType.toLowerCase() === 'client';
        });
      }

      if (filterData.length) {
        let ullist: any = [];
        for (let item of filterData) {
          ullist.push(`<ul class="repeated-item"><li>${(item as any).attenName}</li><li>${(item as any).attenPosition}</li></ul>`)
        }
        const table = `<div class='tooltip-detail'>
          <div class='details'>
            <div class='ghead'>
              <ul>
                <li>Name</li>
                <li>Position</li>
              </ul>
            </div>
            <div class='gbody'>
              <div class='list-item-container'>${ullist.join('')}</div>
            </div>
          </div>
          <div class='arrow'></div>
        </div>`;
        title = table;
      } else {
        title = '';
      }
    }

    // exception for flag
    if (itemH.fieldName === 'flagTypeImageName') {
      if (itemB.flagType === 0) {
        title = this.util.lang.get('set-high-flag').replace('{0}', this.util.lang.get('high'));
      } else if (itemB.flagType === 1) {
        title = this.util.lang.get('set-clear-flag').replace('{0}', this.util.lang.get('high'));
      } else if (itemB.flagType === 2) {
        title = this.util.lang.get('set-clear-flag').replace('{0}', this.util.lang.get('medium'));
      } else if (itemB.flagType === 3) {
        title = this.util.lang.get('set-clear-flag').replace('{0}', this.util.lang.get('low'));
      }
    }

    if (itemH.fieldName === 'chkStatusImgName' && itemB.checkOutStatus) {
      // tslint:disable-next-line: max-line-length
      title = this.util.lang.get('checked-out-by') + ' ' + itemB.checkout_username + ', ' + itemB.checkout_orgname + ' ' + itemB.date_checked_out + '. ' + this.util.lang.get('click-here-to-undo-check-out-file');
    }

    if (itemH.fieldName == 'activityLockImage' && itemB.isActivityLocked) {
      const activityTitleTip: any = [];
      const lockedActivities = itemB.lockActivityIds.split(',');
      lockedActivities.forEach((lockedActivity: any) => {
        activityTitleTip.push(this.util.lang.get(this.activityLangKeyMap[lockedActivity]))
      });

      title = activityTitleTip.join('\n');
    }


    if (!title && itemH.colType != 'img') {
      title = itemB[itemH.fieldName] || '';
    }

    title = title || '';

    // escape quot for title attribute to work properly
    if (typeof title === 'string') {
      title = title.replace(/&/g, '&amp;').replace(/\"/g, '&quot;');
    }

    return title;
  }

  /**
   * @description Set status style
   * @param {*} $row
   * @param {*} data
   * @memberof TableListingComponent
   */
  setStyle($row: any, data: any, forRow: any) {
    if (!data.statusRecordStyle || (data.hasOwnProperty('canView') && !data.canView)) {
      return;
    }
    const settingsAppliedOn = get(data, 'statusRecordStyle.settingApplyOn', '');
    if (!settingsAppliedOn || (forRow && settingsAppliedOn === 1) || (!forRow && settingsAppliedOn === 2)) {
      return;
    }
    const statusRecordStyle = get(data, 'statusRecordStyle', {});
    const [fontWeight, fontStyle, underline, lineThrough] = statusRecordStyle.fontEffect.split('#');
    const settingCssClass: any = [];
    const settingStyle: any = {};

    parseInt(fontWeight) && settingCssClass.push('bold');
    parseInt(fontStyle) && settingCssClass.push('italic');
    parseInt(underline) && parseInt(lineThrough) && settingCssClass.push('underline-line-through');
    parseInt(underline) && !parseInt(lineThrough) && settingCssClass.push('underline');
    !parseInt(underline) && parseInt(lineThrough) && settingCssClass.push('line-through');
    statusRecordStyle.fontColor && settingCssClass.push('hasTextColor');

    settingStyle['font-family'] = statusRecordStyle.fontType;
    settingStyle['color'] = statusRecordStyle.fontColor + ' !important;';
    (statusRecordStyle.backgroundColor || '').toLowerCase() != '#f8f8f8' && (settingStyle['background-color'] = statusRecordStyle.backgroundColor);

    $row.addClass(settingCssClass.join(' '));
    $row.css(settingStyle);
  }

  /**
   * @description
   * @param {*} $el
   * @memberof TableListingComponent
   */

  getAttachmentDetails($el: any, selectedData: any) {
    // $el.find('.dropdown-menu').html('<div class="aLoader"></div>');
    // this.util.getProjectPermission(this.util.getProjectId(selectedData), selectedData.dcId, (data) => {
    //   if (!this.util.hasAccess(data.privileges, 'PRIV_CAN_ACESS_AUDIT_INFO')) {
    //     return;
    //   }

    //   let entityType = '';
    //   if (this.listingData.listingType == AppConstant.FILE_LISTING) {
    //     entityType = 'FILE';
    //   } else if (this.listingData.listingType == AppConstant.DISCUSSION_LISTING) {
    //     entityType = 'DISCUSSION';
    //   } else {
    //     entityType = 'FORM';
    //   }

    //   selectedData.entityType = entityType;
    //   let params: any = {
    //     action_id: AppConstant.GET_ASSOCIATION_COUNTS,
    //     projectId: this.util.getProjectId(selectedData),
    //     entityType: entityType,
    //   }

    //   if (this.listingData.listingType == AppConstant.FILE_LISTING) {
    //     params.revisionId = selectedData.revisionId;
    //   } else if (this.listingData.listingType == AppConstant.DISCUSSION_LISTING) {
    //     params.commId = selectedData.commId;
    //   } else {
    //     params.formId = selectedData.formId;
    //   }

    //   this.util.ajax({
    //     url: ApiConstant.COMMUNICATIONS_CONTROLLER,
    //     method: 'POST',
    //     data: params,
    //     _dcId: selectedData.dcId,
    //     success: (response) => {
    //       if (!response.body) {
    //         return;
    //       }

    //       let countObj = response.body;
    //       let html = [];
    //       let setHtml = (text, strId) => {
    //         html.push(`<button id="${strId}" type="button" class="dropdown-item cursor-pointer" data-toggle="tab" ${countObj.isDisableLink ? 'disabled="true"' : ''}>${text}</button>`);
    //       };

    //       parseInt(countObj.attach_count) && setHtml(`${this.util.lang.get('attachments')} (${countObj.attach_count})`, 'Attachments');
    //       parseInt(countObj.assoc_doc_count) && setHtml(`${this.util.lang.get('files')} (${countObj.assoc_doc_count})`, 'Files');
    //       parseInt(countObj.ref_file_count) && setHtml(`${this.util.lang.get('files')} (${countObj.ref_file_count})`, 'Ref_Files');
    //       parseInt(countObj.assoc_form_count) && setHtml(`${this.util.lang.get('forms')} (${countObj.assoc_form_count})`, 'Forms');
    //       parseInt(countObj.ref_form_count) && setHtml(`${this.util.lang.get('form_ref')} (${countObj.ref_form_count})`, 'Ref_Forms');
    //       parseInt(countObj.assoc_discussion_count) && setHtml(`${this.util.lang.get('discussions')} (${countObj.assoc_discussion_count})`, 'Discussions');
    //       parseInt(countObj.ref_discussion_count) && setHtml(`${this.util.lang.get('discussions')} (${countObj.ref_discussion_count})`, 'Ref_Discussions');
    //       parseInt(countObj.assoc_views_count) && setHtml(`${this.util.lang.get('views')} (${countObj.assoc_views_count})`, 'Views');
    //       parseInt(countObj.objectList_count) && setHtml(`${this.util.lang.get('lists')} (${countObj.objectList_count})`, 'Lists');

    //       let $menu = $el.find('.dropdown-menu');
    //       $menu.html(html.join(''));
    //       $menu.find('button').on('click', (e) => {
    //         e.stopPropagation();
    //         window['bidirectionModal'].generateDataForAssoc(e.currentTarget, Object.assign(selectedData, countObj));
    //       });
    //     }
    //   });
    // });
  }

  /**
   * @description Get individual row html
   * @private
   * @param {*} itemB
   * @param {*} i
   * @returns
   * @memberof TableListingComponent
   */
  private addRow(itemB: any, i: any) {

    const row = this.$(`<ul class="repeated-item" />`);
    // this.setStyle(row, itemB, true);

    itemB.columns = this.util.copy(this.listingData.itemHeader);
    itemB.listingType = this.listingData.listingType;

    itemB.columns.forEach((itemH: any) => {
      let callback;
      if (this.customColumns[itemH.fieldName]) {
        callback = this.customColumns[itemH.fieldName];
      } else {
        callback = this.templateMap[itemH.colType];
      }
      const li = this.$('<li />');

      if (['checkbox', 'img'].indexOf(itemH.colType) > -1) {
        li.addClass('text-center');
      }

      // if()

      if (['checkbox'].indexOf(itemH.colType) > -1) {
        li.addClass('relative');
      }
      itemH.$el = callback(itemB, itemH, i);

      li.width(['checkbox', 'img'].indexOf(itemH.colType) > -1 ? 35 : itemH.widthOfColumn).append(itemH.$el);
      (itemH.fieldName == 'attachmentImageName' || itemH.fieldName == 'assocFormImgName') && li.addClass('overflow-visible');
      itemH.fieldName == 'status' && this.setStyle(li, itemB, false);
      row.append(li);
    });

    itemB.checked && row.addClass('row-selected');

    // if (this.contextMenu) {
    //   this.bindContextMenu({
    //     $html: row,
    //     rowData: itemB,
    //     index: i
    //   });
    // }

    itemB.$el = row;
    return row;
  }

  /**
   * @description Change selection on contextmenu click
   * @private
   * @param {*} $target
   * @param {*} options
   * @returns
   * @memberof TableListingComponent
   */
  private makeSelection($target: any, options: any) {
    const $checkbox = $target.find('.check-row');
    if ($checkbox.prop('checked')) {
      return;
    }

    this.removeCurrentPageSelection();
    $checkbox.prop('checked', true);
    options.rowData.checked = true;
    this.lastIndex = options.index;
    this.selectRow(options.rowData, $target);
    this.updateCheckAll();
  }

  /**
   * @description Bind contextmenu event of each row
   * @private
   * @param {*} options
   * @memberof TableListingComponent
   */
  private bindContextMenu(options: any) {
    options.$html.off('contextmenu').on('contextmenu', (e: any) => {
      e.preventDefault();
      this.makeSelection(this.$(e.currentTarget), options);
      // this.contextMenu.onInit(this.getSelectionDataCurrentPage(), e);
    });
  }

  /**
   * @description Checkbox click callback
   * @private
   * @param {*} e
   * @param {*} rowData
   * @param {*} index
   * @returns
   * @memberof TableListingComponent
   */
  private checkboxClick(e: any, rowData: any, index: any) {
    rowData.checked = e.currentTarget.checked;

    if (e.shiftKey) {
      this.selectItemsInRange(index, this.lastIndex);
      this.updateCheckAll();
      return;
    }

    this.lastIndex = index;

    if (rowData.checked) {
      const alreadySelected = !!this.selectedData.filter((val: any) => {
        return val[this.uniqueId] === rowData[this.uniqueId];
      }).length;
      // tslint:disable-next-line: no-unused-expression
      !alreadySelected && this.selectRow(rowData, this.$(e.currentTarget).closest('.repeated-item'));
    } else {
      this.selectedData.some((item: any, index: any) => {
        if (item[this.uniqueId] == rowData[this.uniqueId]) {
          this.removeRow(index, this.$(e.currentTarget).closest('.repeated-item'));
          return true;
        } else {
          return false;
        }
      });
    }

    this.updateCheckAll();
  }

  /**
   * @description Select row and add data into selection
   * @private
   * @param {*} data
   * @param {*} $row
   * @memberof TableListingComponent
   */
  private selectRow(data: any, $row: any) {
    this.selectedData.push(data);
    $row.addClass('row-selected');
    this.onRowSelectionChangedDebouncer();
  }

  /**
   * @description Remove row and remove data from selection
   * @private
   * @param {*} index
   * @param {*} [$row]
   * @memberof TableListingComponent
   */
  private removeRow(index: any, $row?: any) {
    this.selectedData.splice(index, 1);
    // tslint:disable-next-line: no-unused-expression
    $row && $row.removeClass('row-selected');
    this.onRowSelectionChangedDebouncer();
  }

  /**
   * @description Get selected data
   * @returns
   * @memberof TableListingComponent
   */
  public getSelectionData() {
    return this.selectedData;
  }

  /**
   * @description Get selection data of current page
   * @returns
   * @memberof TableListingComponent
   */
  public getSelectionDataCurrentPage() {
    return this.listingData.allItem.filter((val: any) => {
      return val.checked;
    });
  }

  /**
   * @description Get all data of current page
   * @returns
   * @memberof TableListingComponent
   */
  public getListingData() {
    return this.util.copy(this.listData);
  }

  public getUniqueId(row: any) {
    return row[this.uniqueId];
  }

  /**
   * @description Get rows which unique id is matched with passed id string
   * @param {string} sUniqueIds - Comma separated unique ids list
   * @returns
   * @memberof TableListingComponent
   */
  public getListingDataFromUniqId(sUniqueIds: any) {
    const allData = this.getListingData().data || [];
    const uniqueIds = sUniqueIds.split(',');

    return allData.filter((row: any) => {
      let bRowMatched = false;
      uniqueIds.some((uniqId: any) => {
        if (row[this.uniqueId] === uniqId) {
          bRowMatched = true;
          return true;
        } else {
          return false;
        }
      });
      return bRowMatched;
    });
  }

  /**
   * @description Remove all selected from current page
   * @private
   * @returns
   * @memberof TableListingComponent
   */
  private removeCurrentPageSelection() {
    if (!this.selectedData.length) {
      return;
    }

    const $body = this.$(this.$element.nativeElement).find('.gbody');
    $body.find('.row-selected').removeClass('row-selected');
    $body.find('.check-row').prop('checked', false);

    const list = this.listingData.allItem;
    list.forEach((listItem: any) => {
      for (let j = this.selectedData.length - 1; j >= 0; j--) {
        const uniqueId = this.selectedData[j][this.uniqueId];
        if (uniqueId === listItem[this.uniqueId]) {
          this.selectedData[j].checked = false;
          this.removeRow(j);
          break;
        }
      }
    });
  }

  /**
   * @description Select items in rage for shift + selection
   * @private
   * @param {*} currentIndex
   * @param {*} lastIndex
   * @memberof TableListingComponent
   */
  private selectItemsInRange(currentIndex: any, lastIndex: any) {
    let list = this.listingData.allItem, startIndex: any, endIndex: any;

    if (currentIndex < lastIndex) {
      startIndex = currentIndex;
      endIndex = lastIndex;
    } else {
      startIndex = lastIndex;
      endIndex = currentIndex;
    }

    let checkboxes = this.$(this.$element.nativeElement).find('.gbody').find('.check-row'), checked;

    this.removeCurrentPageSelection();
    list.forEach((item: any, i: any) => {
      checked = (i >= startIndex && i <= endIndex && (!item.hasOwnProperty('canView') || item.canView));
      list[i].checked = checked;

      if (checkboxes[i]) {
        checkboxes[i].checked = checked;
      }
      if (checked) {
        this.selectRow(item, this.$(checkboxes[i]).closest('.repeated-item'));
      }
    });
  }

  /**
   * @description sync selected all checkbox according to selected items below it.
   * @private
   * @returns
   * @memberof TableListingComponent
   */
  private updateCheckAll() {
    const list = this.listingData.allItem;
    if (!list || !list.length) {
      return;
    }

    let isAllSelected = true;
    list.forEach((item: any) => {
      if ((this.checkboxColumn || !item.hasOwnProperty('canView') || item.canView) && !item.checked) {
        isAllSelected = false;
        return true;
      } else {
        return false;
      }
    });

    this.listingData.checkAll = isAllSelected;
  }

  /**
   * @description Update listing data
   * @private
   * @param {*} [json]
   * @memberof TableListingComponent
   */
  private updateListingData(json?: any) {
    this.listingData.recstartfrom = (json && json.recordStartFrom) || (this.listingData.currentPage - 1) * this.listingApi.retainNoOfShow;
    this.listingData.recEndfrom = Math.min(this.listingData.currentPage * this.listingApi.retainNoOfShow, this.listingData.totalDocs);

    const item = {
      currentPageNo: this.listingData.currentPage,
      recordStartFrom: this.listingData.recstartfrom,
      listingType: this.listingData.listingType
    };

    if (json) {
      Object.assign(item, json);
    }

    this.onSelectionChange.emit(item);
  }

  /**
   * @description Get pagination range
   * @returns
   * @memberof TableListingComponent
   */
  range() {
    const size = this.totalPages();
    const ret: any = [];
    let cpage = this.listingData.currentPage || 1;
    let start;
    let end;

    if (cpage < 1 || cpage > size) {
      this.listingData.currentPage = 1;
      cpage = 1;
    }

    const leftRightPages = Math.floor(this.customization.gap / 2);
    if (cpage <= leftRightPages) {
      start = 1;
      end = Math.min(this.customization.gap, size);
    } else if (cpage >= size - leftRightPages) {
      start = Math.max(size - this.customization.gap, 1);
      end = size;
    } else {
      start = Math.max(cpage - leftRightPages, 1);
      end = Math.min(cpage + leftRightPages, size);
    }

    for (let i = start; i <= end; i++) {
      ret.push(i);
    }

    return ret;
  }

  /**
   * @description Get total pages count
   * @returns
   * @memberof TableListingComponent
   */
  totalPages() {
    return Math.ceil(this.listingData.totalDocs / this.listingData.recordBatchSize);
  }

  /**
   * @description Go to Previous page
   * @returns
   * @memberof TableListingComponent
   */
  prevPage() {
    if (this.listingData.currentPage === 1) {
      return;
    }

    this.listingData.currentPage--;
    this.updateListingData();
  }

  /**
   * @description Go to next page
   * @returns
   * @memberof TableListingComponent
   */
  nextPage() {
    if (this.listingData.currentPage === this.totalPages()) {
      return;
    }

    this.listingData.currentPage++;
    this.updateListingData();
  }

  /**
   * @description Go to specified page
   * @param {*} n
   * @returns
   * @memberof TableListingComponent
   */
  setPage(n: any) {
    if (this.listingData.currentPage === n) {
      return;
    }

    this.listingData.currentPage = n;
    this.updateListingData();
  }

  /**
   * @description Change record per page
   * @param {*} record
   * @returns
   * @memberof TableListingComponent
   */
  changeRpp(record: any) {
    if (!this.listingData.listingType || this.listingApi.retainNoOfShow === record) {
      return;
    }

    this.listingApi.retainNoOfShow = record;
    this.listingData.currentPage = 1;
    this.setLazyLoadBatchSize();
    // this.listingApi.updateRpp(record);
    this.updateListingData();
  }

  /**
   * @description Save customization config
   * @returns
   * @memberof TableListingComponent
   */
  submitConfig() {
    if (!this.listingData.listingType) {
      return;
    }

    this.listingData.currentPage = 1;

    // this.listingApi.saveListConfig(this.customization.selectedField, this.listingData.listingType, () => {
    //   this.updateListingData();
    // });

    this.closeConfig();
  }

  /**
   * @description Colse customization dropdown
   * @memberof TableListingComponent
   */
  closeConfig() {
    this.customization.isopen = false;
    this.customization.rightSelected = [];
    this.customization.leftSelected = [];
    this.resetCostomFields();
  }

  /**
   * @description Sort by field
   * @param {*} e
   * @param {*} itemH
   * @returns
   * @memberof TableListingComponent
   */
  headerCellClick(e: any, itemH: any) {
    if (!this.enableSorting || itemH.quickSearchFreezed) {
      return;
    }

    if (this.resizing) {
      this.resizing = false;
      return;
    }

    if (itemH.fieldName === 'removeAssocflag') {
      const fn = (this.listingApi as any)[itemH['function']];
      fn && fn.call(this.listingApi, this.listingData.itemBody, 'all', null, (array: any, el: any, index: any) => {
        this.onDeleteAll.emit({ e: e, array: array, type: this.listingData.listingType });
      });

      return;
    }

    if (!itemH.isSortSupported) {
      return;
    }

    if (itemH.fieldName === 'actions#actionTime') {
      this.pendingSortingColumn = itemH;
      this.$(this.$element.nativeElement).find('#taskTimeSortConfirmation').modal('show');
      return;
    }

    this.sortColumnData(itemH);
  }

  sortColumnData(itemH: any) {
    if (!itemH || !itemH.isSortSupported) {
      return;
    }

    this.pendingSortingColumn = undefined;

    let sortOrder = 'asc';
    if (itemH.order && itemH.order === 'asc') {
      sortOrder = 'desc';
    }

    this.listingData.currentPage = 1;

    this.updateListingData({
      sortField: itemH.isCustomAttributeColumn ? itemH.id : itemH.fieldName,
      isCustomAttribute: itemH.isCustomAttributeColumn,
      sortFieldType: itemH.dataType,
      sortOrder,
      isSortingApply: true
    });
    return;

    let paramObj = {
      action_id: AppConstant.SAVE_SORT_DETAILS_FOR_USER,
      controller: ApiConstant.CONIGURABLE_COLUMN_CONTROLLER,
      isCustomAttribute: itemH.isCustomAttributeColumn,
      listingType: this.listingData.listingType,
      sortField: itemH.isCustomAttributeColumn ? itemH.id : itemH.fieldName,
      sortFieldType: itemH.dataType,
      sortOrder
    };

    this.customization.xhr = this.util.ajax({
      url: ApiConstant.CONIGURABLE_COLUMN_CONTROLLER,
      method: 'POST',
      data: paramObj,
      success: (response: any) => {
        this.customization.xhr = false;
        this.maintainScrollPosition = true;
        this.updateListingData({
          sortField: itemH.isCustomAttributeColumn ? itemH.id : itemH.fieldName,
          isCustomAttribute: itemH.isCustomAttributeColumn,
          sortFieldType: itemH.dataType,
          sortOrder
        });
      },
      error: (err: any) => {
        this.customization.xhr = false;
        // this.util.notification.error({
        //   theClass: 'notification-sm',
        //   msg: this.util.lang.get('customize-column-error-msg')
        // });
        return true;
      }
    });
  }


  /**
   * @description Set drag and drop column header status based on column has quck filter dropdown is opened or not
   * @param {*} itemH
   * @returns
   * @memberof TableListingComponent
   */
  toggleDnDFreedStatus() {
    this.freezeDnD = false;
    if (!this.listData.columnHeader) {
      return;
    }

    this.listData.columnHeader.some((header: any) => {
      if (header.quickSearchFreezed) {
        this.freezeDnD = true;
        return true;
      } else {
        return false;
      }
    });
  }

  /**
   * @description Add or remove filter from main filter criteria list based on filter query has value or not
   * @param {*} itemH
   * @returns
   * @memberof TableListingComponent
   */
  doFilter(query: any) {
    query.preventFocus = true;
    this.maintainScrollPosition = true;
    // this.filterMainComponent.addQuery(query, true);
    this.closeFilterDropdown();
  }

  /**
   * @description Close opened dropdown if there is any fitler dropdown is opened after 0 timeout
   * @memberof TableListingComponent
   */
  closeFilterDropdown() {
    setTimeout(() => {
      const $dropdownTriggerEl = this.$(this.$element.nativeElement).find('.quick-search-dd .freezed');
      if ($dropdownTriggerEl.length) {
        $dropdownTriggerEl.trigger('click');
      }
    }, 0);
  }

  /**
   * @description Check all checkbox click callback
   * @memberof TableListingComponent
   */
  checkall() {
    const isChecked = this.listingData.checkAll;
    const list = this.listingData.allItem;
    const checkboxes = this.$(this.$element.nativeElement).find('.gbody').find('.check-row');

    let isAllLoaded = true;

    if (!this.inifiniteScroll && !this.lazyLoadCompleted) {
      const startFrom = (this.listingData.currentPage - 1) * this.listingApi.retainNoOfShow;
      const totalPageRecords = list.length;
      if (totalPageRecords < this.listingData.recEndfrom - startFrom) {
        this.updateListingData({
          recordStartFrom: startFrom + totalPageRecords,
          recordBatchSize: this.listingData.recEndfrom - startFrom - totalPageRecords,
          lazyLoaded: true
        });

        isAllLoaded = false;
        this.lazyLoadCompleted = true;
      }
    }

    if (isAllLoaded) {
      this.selectedData.length = 0;
      list.forEach((item: any, i: any) => {
        if (this.checkboxColumn || !item.hasOwnProperty('canView') || item.canView) {
          item.checked = isChecked;

          if (isChecked) {
            this.selectRow(item, this.$(checkboxes[i]).closest('.repeated-item'));
          }

          if (checkboxes[i]) {
            checkboxes[i].checked = isChecked;
          }
        }
      });
    }

    if (!isChecked) {
      this.selectedData.length = 0;
      this.$(this.$element.nativeElement).find('.gbody').find('.row-selected').removeClass('row-selected');
      this.onRowSelectionChangedDebouncer();
    }

    this.lastIndex = 0;
  }

  /**
   * @description Resize column width
   * @param {*} event
   * @param {*} itemH
   * @param {*} index
   * @memberof TableListingComponent
   */
  resizeColumn(event: any, itemH: any, index: any) {
    this.preventEvent(event);

    const oldX = event.clientX;
    const gbodyDim = this.$(this.$element.nativeElement).find('.gbody')[0].getBoundingClientRect();
    const verticleResizeLine = this.$('<div class="verticleResizeLine" id="verticleResizeLine"></div>');
    let widthColumn = itemH.widthOfColumn;

    this.resizing = true;

    this.$(this.$element.nativeElement).find('.table-grid').append(verticleResizeLine);
    verticleResizeLine.css('left', oldX - gbodyDim.left - 1 + 'px');
    this.bodyElement.unbind('mousemove.cellresize').bind('mousemove.cellresize', (event: any) => {
      this.preventEvent(event);
      verticleResizeLine.css('left', event.clientX - gbodyDim.left + 'px');
    });

    this.bodyElement.unbind('mouseup.cellresize').bind('mouseup.cellresize', (event: any) => {
      this.preventEvent(event);

      this.bodyElement.unbind('mousemove.cellresize');
      this.bodyElement.unbind('mouseup.cellresize');

      widthColumn += (event.clientX - oldX);
      widthColumn = Math.round(Math.max(widthColumn, this.minColWidth));
      itemH.widthOfColumn = widthColumn;

      verticleResizeLine.remove();

      const listHolderDom = this.$(this.$element.nativeElement).find('.list-item-container')[0];
      listHolderDom.childNodes.forEach((row: any) => {
        let cells = row.childNodes;
        if (cells && cells.length) {
          cells[index].style.width = widthColumn + 'px';
        }
      });

      // this.resizable && this.listingApi.saveListConfig(this.listingData.itemHeader, this.listingData.listingType);

      this.resizing = false;
    });
  };

  /**
   * @description Remove all selection
   * @memberof TableListingComponent
   */
  reset() {
    const allCheckBox = this.$(this.$element.nativeElement).find('.gbody').find('.check-row');
    allCheckBox.forEach((item: any) => {
      if (item.checked) {
        item.checked = false;
      }
    });
  }

  /**
   * @description Header track by
   * @param {*} h
   * @returns
   * @memberof TableListingComponent
   */
  headerTrackBy(h: any) {
    return h.userIndex;
  }

  /**
   * @description On Drop of column header rearrange index of column
   * @param {CdkDragDrop<string[]>} event
   * @memberof TableListingComponent
   */
  drop(event: any) { // event: CdkDragDrop<string[]>
    // let newIndex = event.currentIndex + 1;
    // let oldIndex = event.previousIndex + 1;
    // if (!this.checkboxColumn) {
    //   newIndex = event.currentIndex;
    //   oldIndex = event.previousIndex;
    // }
    // moveItemInArray(this.listingData.itemHeader, oldIndex, newIndex);

    // this.listingData.itemHeader.forEach((heder, ind) => {
    //   heder.userIndex = ind;
    // });

    // let listHolderDom = this.$(this.$element.nativeElement).find('.list-item-container')[0];
    // listHolderDom.childNodes.forEach((row) => {
    //   let cells = row.childNodes;

    //   if (cells && cells.length) {
    //     if (oldIndex < newIndex) {
    //       if (cells[newIndex + 1]) {
    //         row.insertBefore(cells[oldIndex], cells[newIndex + 1]);
    //       } else {
    //         row.appendChild(cells[oldIndex]);
    //       }
    //     } else if (oldIndex > newIndex) {
    //       row.insertBefore(cells[oldIndex], cells[newIndex]);
    //     }
    //   }
    // });

    // this.listingApi.saveListConfig(this.listingData.itemHeader, this.listingData.listingType);
  }

  /**
   * @description On filter change emit
   * @param {*} data
   * @memberof TableListingComponent
   */
  onFilterChange(data: any) {
    if (data !== undefined) {
      this.onSelectionChange.emit(data);
      return;
    }
    this.setColumnFilterData();
  }

  /**
   * @description Prepare filter
   * @param {*} list
   * @memberof TableListingComponent
   */
  prepareFilters(list: any) {
    // this.filterMainComponent.prepareFilters(list);
  }

  /**
   * @description Return a max width of column from original width of column or 200
   * @param {*} column - Column header detail object
   * @memberof TableListingComponent
   */
  getColumnMaxWidth(column: any) {
    return window['Math'].max(column.widthOfColumn, 200);
  }

  /**
   * @description Get selected filter
   * @returns
   * @memberof TableListingComponent
   */
  getSelectedFilter() {
    // return this.filterMainComponent.getSelectedFilter();
  }

  /**
   * @description Add Queries in selected filter
   * @param {*} queries
   * @memberof TableListingComponent
   */
  addQueries(queries: any, treeSelection?: any, defaultQueries?: any) {
    setTimeout(() => {
      // this.filterMainComponent.addQueries(queries, treeSelection, defaultQueries);
    });
  }

  /**
   * @description select filter
   * @param {*} queries
   * @memberof TableListingComponent
   */
  selectAppliedFilter(fitler: any, treeSelection?: any) {
    // this.filterMainComponent.selectAppliedFilter(fitler, treeSelection);
  }

  /**
   * @description Get Row Data from server via Partial Refresh
   * @param {PartialRefreshParams} param
   * @memberof TableListingComponent
   */
  updateRowData(param: PartialRefreshParams,) {
    // this.listingApi.getPartialData(param, (data) => {
    //   data.forEach((item) => {
    //     this.manipulateRowData.emit(item);
    //     this.setUpdatedRowData(item);
    //   });
    // });
  }

  /**
   * @description Update current page selected data
   * @memberof TableListingComponent
   */
  updateSelectedRowData(param: PartialRefreshParams, rows?: any) {
    const selectedRowData = rows || this.getSelectionDataCurrentPage();
    if (!selectedRowData.length) {
      return;
    }
    const dcViseObject: any = this.getDcViseObject(selectedRowData);

    if (Object.keys(dcViseObject).length) {
      for (const dcObj in dcViseObject) {
        if (dcViseObject.hasOwnProperty(dcObj)) {
          // tslint:disable-next-line: no-shadowed-variable
          const rows = dcViseObject[dcObj];
          const params = this.util.copy(param);
          const updateKeys: any = [];
          rows.forEach((row: any) => {
            const keysToGet = params.key.split('#');
            const key: any = [];
            keysToGet.forEach((item: any) => {
              key.push(get(row, item, ''));
            });
            updateKeys.push(key.join('#'));
          });
          params.updateData = updateKeys.join(',');
          params.dcId = dcObj;
          delete params.key;
          this.updateRowData(params);
        }
      }
    }
  }

  updateSelectedRow(item: any) {
    this.manipulateRowData.emit(item);
    this.setUpdatedRowData(item);
  }

  /**
   * @description Returns DC vise object with row data
   * @param {*} data
   * @returns
   * @memberof TableListingComponent
   */
  getDcViseObject(data: any) {
    let dcObj: any = {};
    data.forEach((element: any) => {
      if (element.dcId) {
        // tslint:disable-next-line: no-unused-expression
        !dcObj[element.dcId] && (dcObj[element.dcId] = []);
        dcObj[element.dcId].push(element);
      }
    });
    return dcObj;
  }

  /**
   * @description Update html for partial refresh
   * @param {*} data
   * @memberof TableListingComponent
   */
  setUpdatedHtml(data: any) {
    const index = this.listingData.itemBody.indexOf(data);
    if (index === -1) {
      return;
    }
    if (this.activeViewType == this.ViewType.LIST) {
      // tslint:disable-next-line: max-line-length
      this.$(this.$element.nativeElement).find('.list-item-container').find(`ul:nth-child(${index + 1})`).replaceWith(this.addRow(data, index));
    } else {
      // tslint:disable-next-line: max-line-length
      this.$(this.$element.nativeElement).find('.thumbnail-item-container').find(`div:nth-child(${index + 1})`).replaceWith(this.templateMap['thumb'](data));
    }
  }

  /**
   * @description Update listing data for partial refresh
   * @param {*} data
   * @memberof TableListingComponent
   */
  setUpdatedRowData(data: any) {
    const isSelected = !!this.selectedData.filter((val: any) => {
      return val[this.uniqueId] == data[this.uniqueId];
    }).length;
    // tslint:disable-next-line: no-unused-expression
    isSelected && (data.checked = true);

    const listingData = [this.listingData.itemBody, this.listingData.allItem, this.selectedData];

    listingData.forEach((items) => {
      if (items.length) {
        items.some((element: any, index: any) => {
          if (element[this.uniqueId] === data[this.uniqueId]) {
            items.splice(index, 1, data);
            return true;
          } else {
            return false;
          }
        });
      }
    });

    this.setUpdatedHtml(data);
  }

  /**
   * @description Listing type change event
   * @param {*} listings
   * @param {*} selected
   * @memberof TableListingComponent
   */
  changeListing(listings: any, selected: any) {
    listings.selected = selected;
    this.onSelectionChange.emit({
      listingType: selected.id,
      listingTypeChanged: true
    });
  }
}
