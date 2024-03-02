import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { PurgeDatas } from '../../models/boundary-condition/MappingsAttribute';


@Injectable()
export class PurgeService{
    constructor(private http: HttpClient) {        
    }

    getAckEventsPurgeHistory(): Observable<any>{        
        const headers = new HttpHeaders().set('content-type', 'application/json');
        return this.http.get<any>("api/purgehistory/ackEvents");
    }

    getUnAckEventsPurgeHistory(): Observable<any>{        
        const headers = new HttpHeaders().set('content-type', 'application/json');
        return this.http.get<any>("api/purgehistory/unAckEvents");
    }

    getAuditLogsPurgeHistory(): Observable<any>{        
        const headers = new HttpHeaders().set('content-type', 'application/json');
        return this.http.get<any>("api/purgehistory/auditlogs");
    }

    purgeAuditLogs(dateTime: Date):Observable<any>{
        const headers = new HttpHeaders().set('content-type', 'application/json');
        const params = new HttpParams()
                        .set('DateTime', dateTime.toISOString());        
        return this.http.delete("api/purgehistory/auditlogs",{'headers': headers, 'params': params});
    }

    purgeEvents(dateTime: Date, ack: string):Observable<any>{
        const headers = new HttpHeaders().set('content-type', 'application/json');
        const params = new HttpParams()
                        .set('DateTime',dateTime.toISOString())
                        .set('ack', ack);    
        return this.http.delete("api/purgehistory/events",{'headers': headers, 'params': params});
    }

    getObjectsForPurge(objType: number, pageNumber : number, pageSize: number):Observable<PurgeDatas>{
        const headers = new HttpHeaders().set('content-type', 'application/json');
        const params = new HttpParams()
                        .set('objType', objType.toString())
                        .set('pageNumber', pageNumber.toString())
                        .set('pageSize', pageSize.toString());        
        return this.http.get<PurgeDatas>("api/purgehistory/list",{'headers': headers, 'params': params});
    }

    purgeObjects(id: number, objType: number):Observable<any>{
        const headers = new HttpHeaders().set('content-type', 'application/json');
        const params = new HttpParams()
                        .set('id',id.toString())
                        .set('objType', objType.toString());
        return this.http.delete("api/purgehistory/objects",{'headers': headers, 'params': params});
    }

}