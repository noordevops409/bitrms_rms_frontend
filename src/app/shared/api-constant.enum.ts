import { environment } from '../../environments/environment';

const GATEWAY = environment.api;

export const ApiConstant = {
  SEARCH_FILTER_CONTROLLER: '',
  GET_USER_PHOTO: '',
  CONIGURABLE_COLUMN_CONTROLLER: '',
  IMAGE_PATH: '',
  getAllClientIdOrgShortURL: '',


  login: `${GATEWAY}/login`,
  authToken: `${GATEWAY}/oauth/token`,

  getLatestReportStatus: `${GATEWAY}/api/dashboard/latest-report-status`,
  getLatestData: `${GATEWAY}/api/dashboard/latest-data`,
  getLatestData1: `${GATEWAY}/api/dashboard/latest-data1`,
  getAlarmStatus: `${GATEWAY}/api/dashboard/alarm-status`,
  getAlarmStatusPOST: `${GATEWAY}/api/dashboard-report-controller/getAlarmStatusUsingPOST`,
  getAlarmCategory: `${GATEWAY}/api/dashboard/alarm-category`,
  getHourlyReport: `${GATEWAY}/api/dashboard/hourly-report`,
  getSDEnergyListing: `${GATEWAY}/api/prf_dashboard/perf-report`,
  getEventReport: `${GATEWAY}/api/prf_dashboard/alarm-status`,
  getFuelConsumptionReport: `${GATEWAY}/api/prf_dashboard/fuel-consumption-report`,
  getNoLoadOutageReport: `${GATEWAY}/api/prf_dashboard/no-load-outage-report`,
  getHourlyReportPOST: `${GATEWAY}/api/performance-dashboard-controller/getSiteSummaryUsingPOST`,
  getCustomerMaster: `${GATEWAY}/api/dashboard/customer-master`,
  getSiteCode: `${GATEWAY}/api/dashboard/site-code-master`,
  getSiteType: `${GATEWAY}/api/dashboard/site-type-master`,
  getClusterMaster: `${GATEWAY}/api/dashboard/cluster-master`,
  getZoneMaster: `${GATEWAY}/api/dashboard/zone-master`,
  getRegionMaster: `${GATEWAY}/api/dashboard/region-master`,
  getDeviceTypeMaster: `${GATEWAY}/api/dashboard/device-type-master`,
  getAlarmSeverity: `${GATEWAY}/api/dashboard/alarm-severity`,
  getRegionByCountryId: `${GATEWAY}/api/dashboard/getRegionByCountryId`,
  getZoneByRegionId: `${GATEWAY}/api/dashboard/getZoneByRegionId`,
  getPowerSourceCount: `${GATEWAY}/api/dashboard/powersource-count`,
  getSiteName: `${GATEWAY}/api/dashboard/site-name`,
  
  getSiteSummaryData: `${GATEWAY}/api/prf-dashboard/site-summary`,
  getSitePerfReport: `${GATEWAY}/api/prf-dashboard/perf-report`,
  getSiteFuelConsumptionReport: `${GATEWAY}/api/prf-dashboard/fuel-consumption-report`,
  getSitePowerSource: `${GATEWAY}/api/prf-dashboard/power-source-report`,
  getSiteNoLoadOutageReport: `${GATEWAY}/api/prf-dashboard/no-load-outage-report`,
  getSiteAlarmStatus: `${GATEWAY}/api/prf-dashboard/alarm-status`,
  getSiteGetHourlyData: `${GATEWAY}/api/prf-dashboard/get-hourly-data`,
  getSiteGetRemoteData: `${GATEWAY}/api/prf-dashboard/get-remotedata`,
  getSiteTabSummary: `${GATEWAY}/api/prf-dashboard/tab-summary`,



  getRCADataAll: `${GATEWAY}/api/rca/get-rcadata`,
  createUpdateRCAData: `${GATEWAY}/api/rca/site-name`,
  deleteRCAData: `${GATEWAY}/api/rca/site-name`,
  filterRCAData: `${GATEWAY}/api/rca/site-name`,

  saveRCADetails: `${GATEWAY}/api/rca/save_rca-details`,
  getRCADetails: `${GATEWAY}/api/rca/get_rca_details`,

  getIssueCategory: `${GATEWAY}/api/rca_master_data/issue_category`,
  getOutageCategory: `${GATEWAY}/api/rca_master_data/outage_category`,
  getFaultCategory: `${GATEWAY}/api/rca_master_data/fault_category`,

  getRawDataReport: `${GATEWAY}/api/raw-report/raw-data`,
  getRawDataReportDropboxLink: `${GATEWAY}/api/raw-report/dropboxlink`,
  getRawDataReportExportEmail: `${GATEWAY}/api/raw-report/export_email`,
  getRawDataReportExcel: `${GATEWAY}/api/raw-report/raw-data-exel`,
};

