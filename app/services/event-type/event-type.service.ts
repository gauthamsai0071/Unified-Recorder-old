import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Constants } from "../../_common/constants.endpoints";
import { XML } from "../../_common/xml-request/xml.requests";
import { Group } from '../../models/group/group';
import { Action } from '../../models/action/action';

@Injectable()
export class EventTypeService {
    constructor(private http: HttpClient, 
        @Inject('Core_BaseURL') private coreBaseURL: string) {        
    }

    addEventType(eventType: string, groupId: string): Observable<string> {
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = XML.Requests.Login.addEventTypeRequest.replace("{eventType}", eventType)
                                                .replace("{groupId}", groupId);

        return this.http.post(Constants.EndPoints.EventType.AddEndPoint, data, {   
                headers: httpHeaders,
                responseType: 'text' 
            });            
    }
    
    getEventTypeList(): Observable<any>{
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = XML.Requests.Login.getEventTypeListRequest;                   

        return this.http.post(Constants.EndPoints.EventType.GetEventTypeGroupEndPoint, data,{ headers: httpHeaders,
            responseType: 'text' }); 
    }

    getEventTypeAvailableGroups(id: string): Observable<any>{
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

            const data = XML.Requests.Login.getEventTypeGroupsRequest.replace("{Id}", id);

            return this.http.post(Constants.EndPoints.EventType.GetEventTypeGroupEndPoint, data, {   
            headers: httpHeaders,
            responseType: 'text' 
            });
    }

    updateEventType(eventId: number, eventType: string, groupId: string): Observable<string> {
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = XML.Requests.Login.updateEventTypeRequest.replace("{eventId}", eventId.toString())
                                                .replace("{eventType}", eventType)
                                                .replace("{groupId}", groupId);

        return this.http.post(Constants.EndPoints.EventType.UpdateEventTypeEndPoint, data, {   
                headers: httpHeaders,
                responseType: 'text' 
            });            
    }

    removeEventType(Id: string): Observable<string>{
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = XML.Requests.Login.removeEventTypeRequest.replace("{Id}", Id);

        return this.http.post(Constants.EndPoints.EventType.RemoveEvenTypeEndPoint, data, {   
                headers: httpHeaders,
                responseType: 'text' 
            });
    }

    getTemplateSeverities(Id: string): Observable<string>{
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = XML.Requests.Login.getTemplateSeveritiesRequest.replace("{Id}", Id);

        return this.http.post(Constants.EndPoints.EventType.GetTemplateSeveritiesEndPoint, data, {   
                headers: httpHeaders,
                responseType: 'text' 
            });
    }

    getSeveritiesForEventType(Id: string): Observable<string>{
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = XML.Requests.Login.getSeveritiesForEventTypeRequest.replace("{Id}", Id);

        return this.http.post(Constants.EndPoints.EventType.GetSeveritiesForEventTypeEndPoint, data, {   
                headers: httpHeaders,
                responseType: 'text' 
            });
    }

    removeSeverityFromTemplate(Id: string, SId: string): Observable<string>{
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = XML.Requests.Login.removeSeverityFromTemplateRequest.replace("{Id}", Id)
                                                            .replace("{SId}", SId);

        return this.http.post(Constants.EndPoints.EventType.RemoveSeverityFromTemplateEndPoint, data, {   
                headers: httpHeaders,
                responseType: 'text' 
            });
    }

    addSeverityToTemplate(Id: string, SId: string): Observable<string>{
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = XML.Requests.Login.addSeverityToTemplateRequest.replace("{Id}", Id)
                                                            .replace("{SId}", SId);

        return this.http.post(Constants.EndPoints.EventType.AddSeverityToTemplateEndPoint, data, {   
                headers: httpHeaders,
                responseType: 'text' 
            });
    }

    getSeverityActions(Id: string, SId: string): Observable<string>{
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = XML.Requests.Login.getSeverityActionsRequest.replace("{Id}", Id)
                                                            .replace("{SId}", SId);

        return this.http.post(Constants.EndPoints.EventType.GetSeverityActionsEndPoint, data, {   
                headers: httpHeaders,
                responseType: 'text' 
            });
    }

    createAction(action: Action): Observable<string>{
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');                           

        const data = XML.Requests.Login.createActionRequest.replace("{url}", action.URL)
                                                            .replace("{parameters}", action.Parameters)
                                                            .replace("{message}", action.Message)
                                                            .replace("{name}", action.Name)
                                                            .replace("{max}", action.MaxUpdateTime.toString())
                                                            .replace("{min}", action.MinUpdateTime.toString())
                                                            .replace("{triggers}", action.Triggers)
                                                            .replace("{distance}", action.Distance.toString())
                                                            .replace("{actionType}", action.ActionType)
                                                            .replace("{Sid}", action.Id.toString())
                                                            .replace("{alertCode}", action.AlertCode.toString())
                                                            .replace("{fault}", action.FaultDescription)
                                                            .replace("{exepath}", action.ExePath)
                                                            .replace("{deviceName}", action.DeviceName)
                                                            .replace("{sndEvtorg}", action.Send2EvtOrg);

        return this.http.post(Constants.EndPoints.EventType.CreateActionEndPoint, data, {   
                headers: httpHeaders,
                responseType: 'text' 
            });
    }

    addActionToSeverity(Id: string, SId: string, ActionId : string, TableOrder: string): Observable<string>{
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = XML.Requests.Login.addActionToSeverityRequest.replace("{TemplateId}", Id)
                                                            .replace("{SeverityId}", SId)
                                                            .replace("{ActionId}", ActionId)
                                                            .replace("{TableOrder}", TableOrder);

        return this.http.post(Constants.EndPoints.EventType.AddActionToSeverityEndPoint, data, {   
                headers: httpHeaders,
                responseType: 'text' 
            });
    }

    updateAction(action: Action): Observable<string>{
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');                           

        const data = XML.Requests.Login.updateActionRequest.replace("{Id}", action.Id.toString())
                                                            .replace("{URL}", action.URL)
                                                            .replace("{parameters}", action.Parameters)
                                                            .replace("{message}", action.Message)
                                                            .replace("{name}", action.Name)
                                                            .replace("{max}", action.MaxUpdateTime.toString())
                                                            .replace("{min}", action.MinUpdateTime.toString())
                                                            .replace("{triggers}", action.Triggers)
                                                            .replace("{distance}", action.Distance.toString())
                                                            .replace("{actionType}", action.ActionType)
                                                            .replace("{groupId}", action.GroupID.toString())                                                            
                                                            .replace("{alertcode}", action.AlertCode.toString())
                                                            .replace("{fault}", action.FaultDescription)
                                                            .replace("{exePath}", action.ExePath)
                                                            .replace("{deviceName}", action.DeviceName)
                                                            .replace("{sndEvtOrg}", action.Send2EvtOrg);

        return this.http.post(Constants.EndPoints.EventType.UpdateActionEndPoint, data, {   
                headers: httpHeaders,
                responseType: 'text' 
            });
    }

    removeActionFromSeverity(typeId: string, severityId: string, actionId: string): Observable<string>{
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = XML.Requests.Login.removeActionFromSeverityRequest.replace("{typeId}", typeId)
                                                            .replace("{serverityId}", severityId)
                                                            .replace("{actionId}", actionId);

        return this.http.post(Constants.EndPoints.EventType.RemoveActionFromSeverityEndPoint, data, {   
                headers: httpHeaders,
                responseType: 'text' 
            });
    }

    getActionAvailableGroups(id: string): Observable<any>{
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

            const data = XML.Requests.Login.getActionAvailableGroupsRequest.replace("{Id}", id);

            return this.http.post(Constants.EndPoints.EventType.GetActionAvailableGroupsEndPoint, data, {   
            headers: httpHeaders,
            responseType: 'text' 
            });
    }

}