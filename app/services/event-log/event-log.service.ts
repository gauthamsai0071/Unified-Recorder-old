import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Constants } from "../../_common/constants.endpoints";
import { XML } from "../../_common/xml-request/xml.requests";
import { LogEventFilter } from '../../models/event-log/event-log-filter';

@Injectable()
export class EventLogService {
    constructor(private http: HttpClient, 
        @Inject('Core_BaseURL') private coreBaseURL: string) {        
    }

    getEventLogs(filter: LogEventFilter): Observable<any>{
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

            //.replace("{startDate}",'2020-10-15T00:00:00.000Z')
            const data = XML.Requests.Login.getEventListRequest.replace("{isOriginator}", filter.IsOrigFilterApplied.toString())
                                                                    .replace("{isEventType}", filter.IsETFilterApplied.toString())
                                                                    .replace("{isSeverity}", filter.IsSevFilterApplied.toString())
                                                                    .replace("{originator}", filter.Originators)
                                                                    .replace("{eventType}", filter.EventTypes)
                                                                    .replace("{severity}", filter.Severities)
                                                                    .replace("{startDate}", filter.StartDate.toISOString())
                                                                    .replace("{endDate}", filter.EndDate.toISOString())
                                                                    .replace("{status}", filter.Ack)
                                                                    .replace("{pageSize}", filter.PageSize.toString())
                                                                    .replace("{pageNum}", filter.PageNumber.toString());

            return this.http.post(Constants.EndPoints.EventType.GetEventListEndPoint, data, {   
            headers: httpHeaders,
            responseType: 'text' 
            });
    }

    acknowledgeEventLog(Id: string): Observable<string> {
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = XML.Requests.Login.acknowledgeEventRequest.replace("{Id}", Id);

        return this.http.post(Constants.EndPoints.EventType.AcknowledgeEventEndPoint, data, {   
                headers: httpHeaders,
                responseType: 'text' 
            });            
    }

    removeEventLog(Id: string): Observable<string>{
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = XML.Requests.Login.removeEventRequest.replace("{Id}", Id);

        return this.http.post(Constants.EndPoints.EventType.RemoveEventEndPoint, data, {   
                headers: httpHeaders,
                responseType: 'text' 
            });
    }
}