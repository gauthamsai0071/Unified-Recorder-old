import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Group } from '../../models/group/group';

@Injectable()
export class GroupService{
    constructor(private http: HttpClient, 
        @Inject('Core_BaseURL') private coreBaseURL: string) {        
    }

    getGroups(): Observable<Group[]>{        
        const headers = new HttpHeaders().set('content-type', 'application/json');
        return this.http.get<Group[]>("api/group/list");
    }
}