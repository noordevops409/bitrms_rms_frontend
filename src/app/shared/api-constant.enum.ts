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
  getAlarmData: `${GATEWAY}/api/alarm-report/adata`,
  getAlarmSummaryCount: `${GATEWAY}/api/alarm-report/alarmcounts_summary`,
  getAlarmStatusPOST: `${GATEWAY}/api/dashboard-report-controller/getAlarmStatusUsingPOST`,
  getAlarmCategory: `${GATEWAY}/api/dashboard/alarm-category`,
  getHighCriticalAlarm: `${GATEWAY}/api/alarm-report/get_critical_alarms`,
  getAlarmsCountSummary: `${GATEWAY}/api/alarm-report/alarmcounts_summary`,
  getAlarmCatSummary: `${GATEWAY}/api/alarm-report/get_alarms_cat_summary`,
  getHourlyReport: `${GATEWAY}/api/dashboard/hourly-report`,
  getPowerReport: `${GATEWAY}/api/dashboard/hourly-power-report`,
  getSDEnergyListing: `${GATEWAY}/api/prf_dashboard/perf-report`,
  getEventReport: `${GATEWAY}/api/prf_dashboard/alarm-status`,
  getFuelConsumptionReport: `${GATEWAY}/api/prf_dashboard/fuel-consumption-report`,
  getNoLoadOutageReport: `${GATEWAY}/api/prf_dashboard/no-load-outage-report`,
  getHourlyReportPOST: `${GATEWAY}/api/performance-dashboard-controller/getSiteSummaryUsingPOST`,
  getCustomerMaster: `${GATEWAY}/api/dashboard/customer-master`,
  getSiteCode: `${GATEWAY}/api/dashboard/site-code-master`,
  getSiteType: `${GATEWAY}/api/dashboard/site-type-master`,
  getClusterMaster: `${GATEWAY}/api/dashboard/cluster-master`,
  getSimMaster: `${GATEWAY}/api/dashboard/sim-master`,
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
  deleteRCAData: `${GATEWAY}/api/rca/delete_rca_details`,
  filterRCAData: `${GATEWAY}/api/rca/site-name`,

  saveRCADetails: `${GATEWAY}/api/rca/save_rca-details`,
  getRCADetails: `${GATEWAY}/api/rca/get_rca_details`,

  getIssueCategory: `${GATEWAY}/api/rca_master_data/issue_category`,
  getOutageCategory: `${GATEWAY}/api/rca_master_data/outage_category`,
  getFaultCategory: `${GATEWAY}/api/rca_master_data/fault_category`,

  getRawDataReport: `${GATEWAY}/api/raw-report/raw-data`,
  getTeePowerTrackerReport: `${GATEWAY}/api/power-tracker/tee/pageNumber`,
  getHybridPowerTrackerReport: `${GATEWAY}/api/power-tracker/hybrid/pageNumber`,
  getTeeEnergyRunHoursReport: `${GATEWAY}/api/energy-runhours/tee/pageNumber`,
  getHybridEnergyRunHoursReport: `${GATEWAY}/api/energy-runhours/hybrid/pageNumber`,
  getRawDataReportDropboxLink: `${GATEWAY}/api/raw-report/dropboxlink`,
  getRawDataReportExportEmail: `${GATEWAY}/api/raw-report/export_email`,
  getRawDataReportExcel: `${GATEWAY}/api/raw-report/raw-data-exel`,


  getCountryMasterData: `${GATEWAY}/api/master_data/view_countrymaster_form`,
  saveCountryMasterData: `${GATEWAY}/api/master_data/country`,
  deleteCountryMasterData: `${GATEWAY}/api/master_data/delete_country_details`,

  getRegionMasterData: `${GATEWAY}/api/master_data/view_regionmaster_form`,
  saveRegionMasterData: `${GATEWAY}/api/master_data/region`,
  deleteRegionMasterData: `${GATEWAY}/api/master_data/delete_region_details`,

  getZoneMasterData: `${GATEWAY}/api/master_data/view_zonemaster_form`,
  saveZoneMasterData: `${GATEWAY}/api/master_data/zone`,
  deleteZoneMasterData: `${GATEWAY}/api/master_data/delete_zone_details`,

  getEmployeeMasterData: `${GATEWAY}/api/master_data/view_employee_form`,
  saveEmployeeMasterData: `${GATEWAY}/api/master_data/employee`,
  deleteEmployeeMasterData: `${GATEWAY}/api/master_data/delete_employee_details`,

  getEmployeeRoleMasterData: `${GATEWAY}/api/master_data/view_employeerole_form`,
  saveEmployeeRoleMasterData: `${GATEWAY}/api/master_data/employeerole`,
  deleteEmployeeRoleMasterData: `${GATEWAY}/api/master_data/delete_employeerole_details`,

  getPlannedEnergyMasterData: `${GATEWAY}/api/master_data/view_plannedenergy_form`,
  savePlannedEnergyMasterData: `${GATEWAY}/api/master_data/planned_energy`,
  deletePlannedEnergyMasterData: `${GATEWAY}/api/master_data/delete_planned_energy_details`,

  getSiteMasterData: `${GATEWAY}/api/master_data/view_sitemaster_form`,
  saveSiteMasterData: `${GATEWAY}/api/master_data/site`,
  deleteSiteMasterData: `${GATEWAY}/api/master_data/delete_sitemaster_details`,

  getClusterMasterData: `${GATEWAY}/api/master_data/view_clustermaster_form`,
  saveClusterMasterData: `${GATEWAY}/api/master_data/cluster`,
  deleteClusterMasterData: `${GATEWAY}/api/master_data/delete_clustermaster_details`,

  getSimMasterData: `${GATEWAY}/api/master_data/view_simmaster_form`,
  saveSimMasterData: `${GATEWAY}/api/master_data/add_simmaster`,
  deleteSimMasterData: `${GATEWAY}/api/master_data/delete_sim_master_details`,

  getFaultCategoryData: `${GATEWAY}/api/rca_master_data/view_faultCategory_form`,
  saveFaultCategoryData: `${GATEWAY}/api/rca_master_data/fault_category`,
  deleteFaultCategoryData: `${GATEWAY}/api/rca_master_data/delete_faultCategory_details`,

  getOutageCategoryData: `${GATEWAY}/api/rca_master_data/view_outageCategory_form`,
  saveOutageCategoryData: `${GATEWAY}/api/rca_master_data/outage_category`,
  deleteOutageCategoryData: `${GATEWAY}/api/rca_master_data/delete_outageCategory_details`,

  getIssueCategoryData: `${GATEWAY}/api/rca_master_data/view_issuecategory_form`,
  saveIssueCategoryData: `${GATEWAY}/api/rca_master_data/issue_category`,
  deleteIssueCategoryData: `${GATEWAY}/api/rca_master_data/delete_issueCategory_details`,

  getRemoteSite: `${GATEWAY}/api/remote/sitepage/`,
  viewRemoteSite: `${GATEWAY}/api/remote/view_site_data_json`,
  viewRemoteSiteFilter: `${GATEWAY}/api/remote/view_site_data_json`,
  viewWriteMasterCommand: `${GATEWAY}/api/remote/view_write_master_command`,
  saveOutgoingData: `${GATEWAY}/api/remote/save-outgoingdata`,
  getEnergyBillingReport: `${GATEWAY}/api/energy-biling/report/pageNumber`

};

