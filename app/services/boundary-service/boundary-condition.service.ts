import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders,HttpParams } from "@angular/common/http";
import { BoundaryCondition } from '../../models/boundary-condition/boundary-condition-list';
import {EventType} from "../../models/event-type/event-type-list";
import {Mappings} from "../../models/boundary-condition/MappingsAttribute";
import {AttributesData} from "../../models/boundary-condition/MappingsAttribute";
import { ConditionFilters } from 'src/app/models/boundary-condition/boundaryconditionfilters';
import { Group } from 'src/app/models/group/group';

@Injectable()
export class BoundaryConditionService{
    constructor(private http: HttpClient, 
        @Inject('Core_BaseURL') private coreBaseURL: string) {        
    }

    getBoundaryConditions(): Observable<BoundaryCondition[]>{
        return this.http.get<BoundaryCondition[]>("api/boundaryCondition/list");
    }

    getFilteredConditions(filters : ConditionFilters): Observable<BoundaryCondition[]>{
        return this.http.post<BoundaryCondition[]>("api/boundaryCondition/search",filters);
    }

    removeBoundaryConditions(Id: string): Observable<any>{        
        return this.http.delete(`api/boundaryCondition/${Id}`);
    }

    getBoundaryConditionsById(Id: string): Observable<BoundaryCondition[]>{
        const params = new HttpParams().set('Id', Id);        
        return this.http.get<BoundaryCondition[]>(`api/boundaryCondition/${Id}`,{'params': params});
    }

    getBoundaryConditionsGroup(Id: string) : Observable<Group[]>{
        const params = new HttpParams().set('Id', Id);        
        return this.http.get<Group[]>(`api/boundaryCondition/group/${Id}`,{'params': params});
    }

    addBoundaryConditions(bc : BoundaryCondition): Observable<any>{        
        const headers = new HttpHeaders().set('content-type', 'application/json');
        const params = new HttpParams().set('BoundaryConditionList', JSON.stringify(bc));
        const body=JSON.stringify(bc);
        return this.http.post<any>("api/boundaryCondition",body,{'headers': headers,'params': params});
    }

    updateBoundaryConditions(bc : BoundaryCondition): Observable<any>{
        const headers = new HttpHeaders().set('content-type', 'application/json');
        const params = new HttpParams().set('BoundaryCondition', JSON.stringify(bc));
        const body=JSON.stringify(bc);
        return this.http.put<any>("api/boundaryCondition",body,{'headers': headers, 'params': params});
    }

    getThersholdType():Observable<Mappings[]>{
        const headers = new HttpHeaders().set('content-type', 'application/json');
        return this.http.get<Mappings[]>("api/boundaryCondition/thersholdTypes");
    }

    getAttributes():Observable<AttributesData>{
        const headers = new HttpHeaders().set('content-type', 'application/json');
        return this.http.get<AttributesData>("api/boundaryCondition/attributes");
    }

    getAttributesById(Id: string):Observable<AttributesData>{
        const headers = new HttpHeaders().set('content-type', 'application/json');
        const params = new HttpParams().set('bcId', Id);        
        return this.http.get<AttributesData>(`api/boundaryCondition/attributes/${Id}`,{'params': params});
    }

    addBcAttributes(data : AttributesData, bcId: string , thresholdId: string): Observable<any>{
        const headers = new HttpHeaders().set('content-type', 'application/json');
        const params = new HttpParams()
                        .set('AttributesData', JSON.stringify(data))
                        .set('bcId', bcId)
                        .set('thresholdId', thresholdId);
        const body=JSON.stringify(data);
        return this.http.post<any>("api/boundaryCondition/attributes",body,{'headers': headers, 'params': params});
    }
}