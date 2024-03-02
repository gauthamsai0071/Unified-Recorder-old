import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Constants } from "../../_common/constants.endpoints";
import { XML } from "../../_common/xml-request/xml.requests";
import { Group } from '../../models/group/group';
import { Action } from '../../models/action/action';

@Injectable()
export class ServerityService{
    constructor(private http: HttpClient) {        
    }

    addNewSeverity(name: string, groupId: string): Observable<string> {
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = XML.Requests.Login.addSeverityLevelRequest.replace("{name}", name)
                                                .replace("{groupId}", groupId);

        return this.http.post(Constants.EndPoints.EventType.AddNewSeverityEndPoint, data, {   
                headers: httpHeaders,
                responseType: 'text' 
            });            
    }

    getSeverityAvailableGroups(id: string): Observable<any>{
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

            const data = XML.Requests.Login.getSeverityAvailableGroupsRequest.replace("{Id}", id);

            return this.http.post(Constants.EndPoints.EventType.GetSeverityAvailableGroupsEndPoint, data, {   
            headers: httpHeaders,
            responseType: 'text' 
            });
    }

    updateSeverity(severityId: number, name: string, groupId: string): Observable<string> {
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = XML.Requests.Login.updateSeverityRequest.replace("{severityId}", severityId.toString())
                                                .replace("{name}", name)
                                                .replace("{groupId}", groupId);

        return this.http.post(Constants.EndPoints.EventType.UpdateSeverityEndPoint, data, {   
                headers: httpHeaders,
                responseType: 'text' 
            });            
    }

    removeSeverity(Id: string): Observable<string>{
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = XML.Requests.Login.removeSeverityRequest.replace("{Id}", Id);

        return this.http.post(Constants.EndPoints.EventType.RemoveSeverityEndPoint, data, {   
                headers: httpHeaders,
                responseType: 'text' 
            });
    }

    getSeverityLevels(): Observable<any>{
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = XML.Requests.Login.getSeverityLevelsRequest;                   

        return this.http.post(Constants.EndPoints.EventType.GetSeverityLevelsEndPoint, data,{ headers: httpHeaders,
            responseType: 'text' }); 
    }
}