import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams, HttpHeaders } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { HttpResponse } from '@angular/common/http';

import { CALENDAR_FORMAT } from './calendar.format.enum';
import { catchError, map, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CommonUtilService {

  private dashboardChartFilter: any = null;
  private dashboardAlarmChartFilter: any = null;

  constructor(
    private http: HttpClient,
    private notifyService: NotificationsService
  ) { }

  dateFormats = CALENDAR_FORMAT;
  userDateFormat = this.dateFormats['en_GB'];

  lang = {
    get: (key: any) => {
      return key;
    },
    getLangObj: () => {

    }
  };

  private notificationOptions = {
    timeOut: 5000,
    maxStack: 2,
    showProgressBar: false,
    position: ['top', 'right']
  };

  notification = {
    success: (options: any) => {
      // tslint:disable-next-line: max-line-length
      return this.notifyService.success(this.escapeAmp(options.title || ''), this.escapeAmp(options.msg || ''), Object.assign({}, this.notificationOptions, options));
    },
    error: (options: any) => {
      // tslint:disable-next-line: max-line-length
      return this.notifyService.error(this.escapeAmp(options.title || ''), this.escapeAmp(options.msg || ''), Object.assign({}, this.notificationOptions, options));
    },
    warn: (options: any) => {
      // tslint:disable-next-line: max-line-length
      return this.notifyService.warn(this.escapeAmp(options.title || ''), this.escapeAmp(options.msg || ''), Object.assign({}, this.notificationOptions, options));
    },
    info: (options: any) => {
      // tslint:disable-next-line: max-line-length
      return this.notifyService.info(this.escapeAmp(options.title || ''), this.escapeAmp(options.msg || ''), Object.assign({}, this.notificationOptions, options));
    },
    clear: (id: any) => {
      this.notifyService.remove(id);
    }
  };

  convertQueryStrToObj() {
    const pairs = window.location.search.substring(1).split('&');
    const obj: any = {};
    let pair, i;
    for (i in pairs) {
      if (pairs[i] === '') { continue; }
      pair = pairs[i].split('=');
      obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return obj;
  }

  copy(source: any, maxDepth?: any) {
    let stackSource: any = [];
    let stackDest: any = [];
    let isArray = Array.isArray;
    let getPrototypeOf = Object.getPrototypeOf;
    function isObject(a: any) { return null !== a && "object" == typeof a }
    function isFunction(a: any) { return "function" == typeof a }

    return copyElement(source, maxDepth);

    function copyRecurse(source: any, destination: any, maxDepth: any) {
      maxDepth--;
      if (maxDepth < 0) {
        return '...';
      }
      let key;
      if (isArray(source)) {
        for (let i = 0, ii = source.length; i < ii; i++) {
          destination.push(copyElement(source[i], maxDepth));
        }
      } else if (source && typeof source.hasOwnProperty === 'function') {
        // Slow path, which must rely on hasOwnProperty
        for (key in source) {
          if (source.hasOwnProperty(key)) {
            destination[key] = copyElement(source[key], maxDepth);
          }
        }
      } else {
        // Slowest path --- hasOwnProperty can't be called as a method
        for (key in source) {
          if (window.hasOwnProperty.call(source, key)) {
            destination[key] = copyElement(source[key], maxDepth);
          }
        }
      }
      return destination;
    }

    function copyElement(source: any, maxDepth?: any) {
      // Simple values
      if (!isObject(source)) {
        return source;
      }

      // Already copied values
      let index = stackSource.indexOf(source);
      if (index !== -1) {
        return stackDest[index];
      }

      let needsRecurse = false;
      let destination: any = copyType(source);

      if (destination === undefined) {
        destination = isArray(source) ? [] : Object.create(getPrototypeOf(source));
        needsRecurse = true;
      }

      stackSource.push(source);
      stackDest.push(destination);

      return needsRecurse
        ? copyRecurse(source, destination, maxDepth)
        : destination;
    }

    function copyType(source: any) {
      let toStr = Object.prototype.toString;
      switch (toStr.call(source)) {
        case '[object Int8Array]':
        case '[object Int16Array]':
        case '[object Int32Array]':
        case '[object Float32Array]':
        case '[object Float64Array]':
        case '[object Uint8Array]':
        case '[object Uint8ClampedArray]':
        case '[object Uint16Array]':
        case '[object Uint32Array]':
          return new source.constructor(copyElement(source.buffer), source.byteOffset, source.length);

        case '[object ArrayBuffer]':
          // Support: IE10
          if (!source.slice) {
            // If we're in this case we know the environment supports ArrayBuffer
            /* eslint-disable no-undef */
            const copied = new ArrayBuffer(source.byteLength);
            new Uint8Array(copied).set(new Uint8Array(source));
            /* eslint-enable */
            return copied;
          }
          return source.slice(0);

        case '[object Boolean]':
        case '[object Number]':
        case '[object String]':
        case '[object Date]':
          return new source.constructor(source.valueOf());

        case '[object RegExp]':
          const re = new RegExp(source.source, source.toString().match(/[^/]*$/)[0]);
          re.lastIndex = source.lastIndex;
          return re;

        case '[object Blob]':
          return new source.constructor([source], { type: source.type });
      }

      if (isFunction(source.cloneNode)) {
        return source.cloneNode(true);
      }
    }
  }

  private ticksTo1970 = (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) + Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000);

  getDuration(date: any) {
    if (!date) {
      return '';
    }

    let todayUTCSplit: any = new Date().toUTCString().split(" ")[4].split(":");
    let now = new Date();
    let utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    utcDate.setHours(parseInt(todayUTCSplit[0]) + ((window as any)['timezoneOffset'] / (3600 * 1000)), todayUTCSplit[1], todayUTCSplit[2]);

    let dueDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    dueDate.setHours(23, 59, 0, 0);

    let dmili = dueDate.getTime();
    let tmili = utcDate.getTime();
    let diff = dmili - tmili;

    let diff_days: any = diff / (24 * 60 * 60 * 1000);	// in days
    let diff_hours: any = diff / (60 * 60 * 1000);		// in hours
    diff_days = parseInt(diff_days);	// in days
    diff_hours = parseInt(diff_hours);		// in hours

    if (diff_hours > 23)
      return (diff_days + ' d');
    else
      return (diff_hours + ' h');
  }

  formatDate(format: any, date: any) {
    if (!date) {
      return "";
    }

    let iFormat: any,
      nameMap = this.getCalendarNames(),
      dayNamesShort = nameMap.DAY_NAMES_SHORT,
      dayNames = nameMap.DAY_NAMES,
      monthNamesShort = nameMap.MONTH_NAMES_SHORT,
      monthNames = nameMap.MONTH_NAMES,

      // Check whether a format character is doubled
      lookAhead = (match: any) => {
        let matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
        if (matches) {
          iFormat++;
        }
        return matches;
      },
      formatNumber = (match: any, value: any, len: any) => {
        let num = "" + value;
        if (lookAhead(match)) {
          while (num.length < len) {
            num = "0" + num;
          }
        }
        return num;
      },
      // Format a name, short or long as requested
      formatName = (match: any, value: any, shortNames: any, longNames: any) => {
        return (lookAhead(match) ? longNames[value] : shortNames[value]);
      },
      output = "",
      literal = false;

    if (date) {
      for (iFormat = 0; iFormat < format.length; iFormat++) {
        if (literal) {
          if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
            literal = false;
          } else {
            output += format.charAt(iFormat);
          }
        } else {
          switch (format.charAt(iFormat)) {
            case "d":
              output += formatNumber("d", date.getDate(), 2);
              break;
            case "D":
              output += formatName("D", date.getDay(), dayNamesShort, dayNames);
              break;
            case "o":
              output += formatNumber("o",
                Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
              break;
            case "m":
              output += formatNumber("m", date.getMonth() + 1, 2);
              break;
            case "M":
              output += formatName("M", date.getMonth(), monthNamesShort, monthNames);
              break;
            case "y":
              output += (lookAhead("y") ? date.getFullYear() :
                (date.getYear() % 100 < 10 ? "0" : "") + date.getYear() % 100);
              break;
            case "t":
              output += (date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
              break;
            case "p":
              output += this.getDuration(date);
              break;
            case "@":
              output += date.getTime();
              break;
            case "!":
              output += date.getTime() * 10000 + this.ticksTo1970;
              break;
            case "'":
              if (lookAhead("'")) {
                output += "'";
              } else {
                literal = true;
              }
              break;
            default:
              output += format.charAt(iFormat);
          }
        }
      }
    }
    return output;
  };

  getCalendarNames() {
    return {
      'DAY_NAMES_SHORTEST': this.lang.get("abbr-sort-day-name-array").split(','),		// "Su,Mo,Tu,We,Th,Fr,Sa"
      'DAY_NAMES_SHORT': this.lang.get("abbr-day-name-array").split(','), 				// "Sun,Mon,Tue,Wed,Thu,Fri,Sat"
      'DAY_NAMES': this.lang.get("day-name-array").split(','),							// "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday"
      'MONTH_NAMES_SHORT': this.lang.get("abbr-month-array").split(','),				// "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec"
      'MONTH_NAMES': this.lang.get("month-array").split(',')	 						// "January,February,March,April,May,June,July,August,September,October,November,December"
    };
  };

  parseDate(format: any, value: any) {
    if (format == null || value == null) {
      throw this.lang.get("invalid-arguments");
    }

    value = (typeof value === "object" ? value.toString() : value + "");
    if (value === "") {
      return null;
    }

    let iFormat: any, dim, extra,
      iValue = 0,
      shortYearCutoff = 26,
      nameMap = this.getCalendarNames(),
      dayNamesShort = nameMap.DAY_NAMES_SHORT,
      dayNames = nameMap.DAY_NAMES,
      monthNamesShort = nameMap.MONTH_NAMES_SHORT,
      monthNames = nameMap.MONTH_NAMES,
      year = -1,
      time = -1,
      month = -1,
      day = -1,
      doy = -1,
      literal = false,
      date,
      // Check whether a format character is doubled
      lookAhead = (match: any) => {
        let matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
        if (matches) {
          iFormat++;
        }
        return matches;
      },
      // Extract a number from the string value
      getNumber = (match: any) => {
        let isDoubled = lookAhead(match),
          size = (match === "@" ? 14 : (match === "!" ? 20 :
            (match === "y" && isDoubled ? 4 : (match === "o" ? 3 : 2)))),
          minSize = (match === "y" ? size : 1);

        let num;
        if (match === "t") {
          num = value.substring(iValue).match(new RegExp("^\\d{1,2}:\\d{1,2}:\\d{1,2}"));
        } else {
          num = value.substring(iValue).match(new RegExp("^\\d{" + minSize + "," + size + "}"));
        }
        if (!num) {
          throw this.lang.get("missing-number-at-position") + iValue;
        }

        iValue += num[0].length;
        if (match === "t") {
          return num[0];
        }

        return parseInt(num[0], 10);
      },
      // Extract a name from the string value and convert to an index
      getName = (match: any, shortNames: any, longNames: any) => {
        let index = -1,
          names = (window as any)['$'].map(lookAhead(match) ? longNames : shortNames, (v: any, k: any) => {
            return [[k, v]];
          }).sort((a: any, b: any) => {
            return -(a[1].length - b[1].length);
          });

        (window as any)['$'].each(names, (pair: any) => {
          let name: any = pair[1];
          if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
            index = pair[0];
            iValue += name.length;
            return false;
          } else {
            return true;
          }
        });
        if (index !== -1) {
          return index + 1;
        } else {
          throw this.lang.get("unknown-name-at-position") + iValue;
        }
      },
      // Confirm that a literal character matches the string value
      checkLiteral = () => {
        if (value.charAt(iValue) !== format.charAt(iFormat)) {
          throw this.lang.get("unexpected-literal-at-position") + iValue;
        }
        iValue++;
      };

    for (iFormat = 0; iFormat < format.length; iFormat++) {
      if (literal) {
        if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
          literal = false;
        } else {
          checkLiteral();
        }
      } else {
        switch (format.charAt(iFormat)) {
          case "d":
            day = getNumber("d");
            break;
          case "D":
            getName("D", dayNamesShort, dayNames);
            break;
          case "o":
            doy = getNumber("o");
            break;
          case "m":
            month = getNumber("m");
            break;
          case "M":
            month = getName("M", monthNamesShort, monthNames);
            break;
          case "y":
            year = getNumber("y");
            break;
          case "t":
            time = getNumber("t");
            break;
          case "@":
            date = new Date(getNumber("@"));
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            break;
          case "!":
            date = new Date((getNumber("!") - this.ticksTo1970) / 10000);
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            break;
          case "'":
            if (lookAhead("'")) {
              checkLiteral();
            } else {
              literal = true;
            }
            break;
          default:
            checkLiteral();
        }
      }
    }

    if (iValue < value.length) {
      extra = value.substr(iValue);
      if (!/^\s+/.test(extra)) {
        throw this.lang.get("extra-unparsed-char-in-date") + extra;
      }
    }

    if (year === -1) {
      year = new Date().getFullYear();
    } else if (year < 100) {
      year += new Date().getFullYear() - new Date().getFullYear() % 100 +
        (year <= shortYearCutoff ? 0 : -100);
    }

    let _daylightSavingAdjust = (date: any) => {
      if (!date) {
        return null;
      }
      date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
      return date;
    };

    let _getDaysInMonth = (year: any, month: any) => {
      return 32 - _daylightSavingAdjust(new Date(year, month, 32)).getDate();
    };

    if (doy > -1) {
      month = 1;
      day = doy;
      do {
        dim = _getDaysInMonth(year, month - 1);
        if (day <= dim) {
          break;
        }
        month++;
        day -= dim;
      } while (true);
    }

    date = _daylightSavingAdjust(new Date(year, month - 1, day));
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
      throw this.lang.get("invalid-date"); // E.g. 31/02/00
    }

    if (time !== -1) {
      let timeSplit = (time + "").split(':');
      date.setHours(timeSplit[0]);
      date.setMinutes(timeSplit[1]);
      date.setSeconds(timeSplit[2]);
    }

    return date;
  }

  tryToParseDate(value: any, format: any) {
    let possibleFormat = ['yy-mm-dd', 'yy/mm/dd', 'dd/mm/yy', 'dd-mm-yy',
      'yy-m-d', 'yy/m/d', 'd/m/yy', 'd-m-yy',
      'y-mm-dd', 'y/mm/dd', 'dd/mm/y', 'dd-mm-y',
      'y/m/d', 'y/m/d', 'd/m/y', 'd-m-y'];

    let date = undefined;
    for (let i = 0; i < possibleFormat.length; i++) {
      let dateFormat = possibleFormat[i];
      if (!format || dateFormat != format) {
        try {
          date = this.parseDate(dateFormat, value);
          return date;
        } catch (e) {
          continue;
        }
      }
    }

    if (!date)
      return value;
  }

  getLastModifiedProfileTime(imagepath: string): string {
    if (!imagepath) {
      return '0';
    }
    let lastModiPicDate = imagepath.split('?')[1] || '';
    lastModiPicDate = lastModiPicDate.split('&')[0] || '';
    const lastModiPicDateArray = lastModiPicDate.split('=');
    if (lastModiPicDateArray[0] && lastModiPicDateArray[0] == 'v') {
      lastModiPicDate = lastModiPicDateArray[1] || '';
      lastModiPicDate = lastModiPicDate.split('#')[0] || '';
    } else {
      lastModiPicDate = '0';
    }

    return lastModiPicDate;
  }

  isIE(): boolean {
    const nu = navigator.userAgent;
    return (nu.indexOf('.NET CLR') > -1 || navigator.appVersion.indexOf('MSIE') != -1 || nu.indexOf('Trident/') != -1);
  }

  isIEEdge(): boolean {
    return (navigator.userAgent.indexOf('Edge/') != -1);
  }

  ieVer() {
    if (!this.isIE()) {
      return 0;
    }

    if (!!navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.indexOf('rv:11.0') != -1) {
      return 11;
    }

    if (navigator.appVersion.indexOf('MSIE 10') != -1) {
      return 10;
    }

    if (navigator.appVersion.indexOf('MSIE 9') != -1) {
      return 9;
    }

    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
      return new Number(RegExp.$1);
    }

    return 0;
  }

  isMobile() {
    let check = false;
    ((a) => {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
        check = true;
      }
    })(navigator.userAgent || navigator.vendor || (window as any)['opera']);
    return check;
  }

  isMac() {
    return (navigator.appVersion.indexOf('Mac') > 0 && navigator.appVersion.indexOf('Macintosh') < 0);
  }

  escapeAmp(str: any) {
    if (!str || typeof str !== 'string') {
      return '';
    }
    return str.replace(/&/g, '&amp;');
  }

  ajax(options: any): any {
    let body = options.data;

    // if (typeof options.data !== 'string') {
    //   body = [];

    //   if (options.repeatData && options.repeatData.length) {
    //     // tslint:disable-next-line: prefer-const
    //     for (let item of options.repeatData) {
    //       const obj = item;
    //       // tslint:disable-next-line: prefer-const
    //       for (let p in obj) {
    //         if (obj.hasOwnProperty(p)) {
    //           body.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    //         }
    //       }
    //     }
    //   }

    //   // tslint:disable-next-line: prefer-const
    //   for (let p in options.data) {
    //     if (options.data.hasOwnProperty(p)) {
    //       body.push(encodeURIComponent(p) + '=' + encodeURIComponent(options.data[p]));
    //     }
    //   }

    //   body = body.join('&');
    // }

    let headers = new HttpHeaders().set('Content-Type', options.contentType || 'application/x-www-form-urlencoded');
    if (options.ApiKey) {
      headers = headers.append('ApiKey', options.ApiKey);
    }
    let opts: any = {
      headers,
      withCredentials: false
    };
    opts = Object.assign(opts, options);

    if (options.method && options.method.toLowerCase() === 'get') {
      if (options.url.indexOf('?') == -1) {
        options.url += '?t=' + Date.now();
      } else {
        options.url += '&t=' + Date.now();
      }
    }

    if (opts.params) {
      opts.params = new HttpParams({ fromObject: opts.params });
    }

    const req = new HttpRequest(options.method || 'POST', options.url, body, opts);

    return this.http.request(req).subscribe(response => {
      if (response instanceof HttpResponse) {
        // tslint:disable-next-line: no-unused-expression
        options.success && options.success(response);
      }
    }, err => {
      let preventError = false;
      if (options.error) {
        preventError = options.error(err);
      }

      if (!preventError) {
        options.error && options.error(err);
      }
    });
  }

  submitForm(option: any) {
    const form = document.createElement('form');
    form.target = option.target || '_blank';

    form.action = option.url;
    form.method = option.method || 'POST';

    // tslint:disable-next-line: prefer-const
    // tslint:disable-next-line: forin
    for (let name in option.param) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = option.param[name];
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
    (window as any)['$'](form).remove();
  }

  makeSepRefOfObj(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }

  setDashboardChartFilter(data) {
    this.dashboardChartFilter = data;
  }

  getDashboardChartFilter() {
    return this.dashboardChartFilter;
  }

  setDashboardAlarmStatusChartFilter(data) {
    this.dashboardAlarmChartFilter = data;
  }

  getDashboardAlarmStatusChartFilter() {
    return this.dashboardAlarmChartFilter;
  }

  fileUpload(fileItem: File): any {

    let apiCreateEndpoint = "sitehandler/api/sites/upload_sites";
    const formData: FormData = new FormData();

    formData.append("file", fileItem);

    const req = new HttpRequest("POST", apiCreateEndpoint, formData, {
      reportProgress: true // for progress data
    });
    return this.http.request(req);
  }

  uploadAnyImage(url: any, fileToUpload: any, oldPath: any): any {
    const formData: FormData = new FormData();
    formData.append("multipartFile", fileToUpload);

    return this.http
      .post(url, formData)
      .pipe(map((response: any) => response));
  }

  updateUploadFile(url: any, params: any, fileToUpload: any): any {
    const formData: FormData = new FormData();
    formData.append("uploadFile", fileToUpload);

    return this.http
      .post(url, formData, { params: params })
      .pipe(map((response: any) => response));
  }

  uploadPDFFile(url: any, fileToUpload: any): any {
    const formData: FormData = new FormData();
    formData.append("uploadFile", fileToUpload);

    return this.http
      .post(url, formData)
      .pipe(map((response: any) => response));
  }
}
