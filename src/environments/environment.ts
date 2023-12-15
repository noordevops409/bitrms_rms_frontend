// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // api: 'http://52.2.178.166:8080/digitrinityApi/api'
  // api: 'http://52.2.178.166:8080/digitrinity-rest-services'
  // api: 'http://52.2.178.166:8080/digitrinity-rest-services_prod_repl',
 // api: 'https://rmsnewprodrepl.bitrms.in:8443/digitrinity-rest-services_prod',
  //api: 'http://localhost:8080/digitrinity-rest-services_prod',

    // http://52.2.178.166:8080/digitrinity/prf_dashboard/site_summary,
api:'https://rmsnew.yomamicropowerservice.com:8443/digitrinity-rest-services_prod',
  // http://54.254.44.119:8080/digitrinity/prf_dashboard/site_summary
  mapbox: {
    accessToken: 'pk.eyJ1IjoiZGlnaXRyaW5pdHkiLCJhIjoiY2thMjdzaDY1MDNmZzNmbXN1Yjl4aXp5bSJ9.2rBqqFjtw-u4qtDSFkOR0w'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
