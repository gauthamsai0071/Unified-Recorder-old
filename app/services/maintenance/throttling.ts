import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Constants } from "../../_common/constants.endpoints";
import { XML } from "../../_common/xml-request/xml.requests";
import {Throttling, ThrottlingConfiguration} from '../../models/maintenance/throttlingconfig'

@Injectable()
export class ThrottlingService{
    constructor(private http: HttpClient, 
        @Inject('Core_BaseURL') private motolocatorBaseURL: string) {        
    }

    getDropDownValues(): Observable<Throttling>{        
        const headers = new HttpHeaders().set('content-type', 'application/json');
        return this.http.get<Throttling>("api/throttling/values");
    }

    getThrottlingConfig(): Observable<ThrottlingConfiguration>{        
        const headers = new HttpHeaders().set('content-type', 'application/json');
        return this.http.get<ThrottlingConfiguration>("api/throttling/config");
    }

    updateThrottlingConfig(throttlingConfiguration : ThrottlingConfiguration): Observable<any> {
        const headers = new HttpHeaders().set('content-type', 'application/json');
        const params = new HttpParams()
                        .set('ThrottlingMessageConfig', JSON.stringify(throttlingConfiguration));
        const body=JSON.stringify(throttlingConfiguration);
        return this.http.put("api/throttling/config",body,{'headers': headers, 'params': params});           
    }
}