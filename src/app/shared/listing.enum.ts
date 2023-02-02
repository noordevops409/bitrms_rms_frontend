export enum ViewType {
  THUMB = 'thumb',
  LIST = 'listing'
}

export interface PartialRefreshParams {
  action_id: Number,
  appType: Number,
  entityTypeId: Number,
  updateData: String,
  dcId: Number,
  key?: String
}

export interface ListingResponse {
  totalDocs: Number,
  recordBatchSize: Number,
  listingType: Number,
  currentPageNo: Number,
  recordStartFrom: Number,
  sortField: String,
  sortFieldType: String,
  sortOrder: String,
  editable: Boolean,
  isIncludeSubFolder: Boolean,
  totalListData: Number,
  columnHeader: Array<any>,
  data: Array<any>
}

export interface InterfaceColumHeader {
  id: String,
  fieldName: String,
  solrIndexfieldName: String,
  colDisplayName: String,
  colType: String,
  userIndex: Number,
  imgName: String,
  tooltipSrc: String,
  dataType: String,
  function: String,
  funParams: String,
  wrapData: String,
  widthOfColumn: Number,
  isSortSupported: false,
  isCustomAttributeColumn: false
}
