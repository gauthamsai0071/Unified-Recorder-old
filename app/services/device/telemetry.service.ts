import { Injectable, } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { LocationFilters } from '../../models/device/locationFilters';
import { Inject } from '@angular/core';
import { DropDown } from '../../models/device/dropDown';
import {TelemetryFilters} from '../../models/device/TelemetryInfo';

@Injectable()
export class TelemetryService {
  constructor(private http: HttpClient, 
    @Inject('Core_BaseURL') private coreBaseURL: string) {              
  }

  getLatestRGHistoryForGroup(telemetryFilters: TelemetryFilters):  Observable<any>{
    const headers = new HttpHeaders().set('content-type', 'application/json');
    const params = new HttpParams()
                    .set('TelemetryFilters', JSON.stringify(telemetryFilters));
    const body=JSON.stringify(telemetryFilters);
    return this.http.post("api/telemetry/search", body,{'headers': headers, 'params': params});
  }

  getTelemetryForGroup(telemetryFilters: TelemetryFilters):  Observable<any>{
    const headers = new HttpHeaders().set('content-type', 'application/json');
    const params = new HttpParams()
                    .set('TelemetryFilters', JSON.stringify(telemetryFilters));
    const body=JSON.stringify(telemetryFilters);
    return this.http.post("api/telemetry/search", body,{'headers': headers, 'params': params});
  }
}  