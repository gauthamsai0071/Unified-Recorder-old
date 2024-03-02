import { Injectable, } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { AuditLogs } from '../../models/audit/auditlogs';
import { AuditLogsData } from '../../models/audit/auditlogs';
import { Inject } from '@angular/core';
import { FilterDataStruct } from 'src/app/models/audit/AuditLogFilters';

@Injectable()
export class AuditLogService {
  constructor(private http: HttpClient, 
    @Inject('Core_BaseURL') private coreBaseURL: string) {        
  }
  
  getAuditLogs(pageSize: string, pageNumber: string): Observable<AuditLogsData>{
    const headers = new HttpHeaders().set('content-type', 'application/json');
    const params = new HttpParams()
                        .set('pageSize', pageSize)
                        .set('pageNumber', pageNumber);
    return this.http.get<AuditLogsData>("api/auditlog/list", {'headers': headers, 'params': params});
  }

  getAuditFilersData(): Observable<FilterDataStruct>{          
    return this.http.get<FilterDataStruct>("api/auditlog/logFilters");
  }

  searchAuditLogs(data:FilterDataStruct,pageSize: string, pageNumber: string): Observable<any>{     
    const headers = new HttpHeaders().set('content-type', 'application/json');
    const params = new HttpParams()
                        .set('pageSize', pageSize)
                        .set('pageNumber', pageNumber);         
    return this.http.post<AuditLogsData>("api/auditlog/search",data, {'headers': headers, 'params': params});
  } 
}
