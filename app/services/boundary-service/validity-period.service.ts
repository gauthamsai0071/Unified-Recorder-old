import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders,HttpParams } from "@angular/common/http";
import { Constants } from "../../_common/constants.endpoints";
import { MBS } from "../../_common/xml-request/mbs.xml.request";
import { ValidityPeriods } from 'src/app/models/validity-period/validity-period-list';

@Injectable()
export class ValidityPeriodService{
    constructor(private http: HttpClient,
        @Inject('Core_BaseURL') private coreBaseURL: string) {        
    }

    getValidityPeriods(): Observable<string>{
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = MBS.XML.Requests.MbSService.getValidityPeriodsRequest;

        return this.http.post(Constants.EndPoints.BoundaryService.GetValidityPeriodsEndPoint, data, {   
                headers: httpHeaders,
                responseType: 'text' 
        });
    }

    removeValidityPeriod(Id: string): Observable<any>{
        const headers = new HttpHeaders().set('content-type', 'application/json');
        const params = new HttpParams().set('Id', Id);
        const body=JSON.stringify(Id);
        return this.http.delete(`api/boundaryCondition/validityperiod/${Id}`);
    }

    addValidityPeriod(vpList: ValidityPeriods): Observable<any>{
        const headers = new HttpHeaders().set('content-type', 'application/json');
        const params = new HttpParams()
                        .set('ValidityPeriods', JSON.stringify(vpList));
        const body=JSON.stringify(vpList);
        return this.http.post("api/boundaryCondition/validityperiod",body,{'headers': headers, 'params': params});
        
    }

    updateValidityPeriod(vpList: ValidityPeriods): Observable<any>{
        const headers = new HttpHeaders().set('content-type', 'application/json');
        const params = new HttpParams()
                        .set('ValidityPeriods', JSON.stringify(vpList));
        const body=JSON.stringify(vpList);
        return this.http.put("api/boundaryCondition/validityperiod",body,{'headers': headers, 'params': params});
    }
}