import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import * as _ from 'lodash';
import * as jwt_decode from 'jwt-decode';
import { Constants } from '../../_common/constants.endpoints';
import { XML } from '../../_common/xml-request/xml.requests';
import { Credential } from '../../models/login/credential';
import { DOMParser } from 'xmldom';
import { MBS } from "../../_common/xml-request/mbs.xml.request";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    constructor(
            private router: Router,
            private httpClient: HttpClient,
            private cookieService: CookieService,
            @Inject('Core_BaseURL') private coreBaseURL: string) {
    }
    private userName: string;

    get roles(): number {
        return Number(window.sessionStorage.getItem('MotoLocator_roles'));
    }

    get token(): string {
        return window.sessionStorage.getItem('MotoLocator_token');
    }

    isAuthenticated() {
        if (window.sessionStorage.getItem('MotoLocator_token')) {
            // logged in so return true
            return true;
        }

        return false;
    }
    
    rememberCredentials(userName: string, password: string) {
        this.cookieService.set('MotoLocator_username', userName);
        this.cookieService.set('MotoLocator_password', password);
    }

    forgetCredentials() {
        this.cookieService.delete('MotoLocator_username');
        this.cookieService.delete('MotoLocator_password');
    }

    getUserName(): string {
        return window.sessionStorage.getItem('MotoLocator_username');
    }

    getCredential(): Credential {       
        const credential = new Credential();

        if (this.cookieService.get('MotoLocator_username') !== undefined && this.cookieService.get('MotoLocator_username') !== null) {
            credential.name = this.cookieService.get('MotoLocator_username');
        }

        if (this.cookieService.get('MotoLocator_password') !== undefined && this.cookieService.get('MotoLocator_username') !== null) {
            credential.password = this.cookieService.get('MotoLocator_password');
        }

        return credential;
    }

    getAuthenticationToken(): string {
        return window.sessionStorage.getItem('MotoLocator_token');
    }

    removeAuthenticationToken(): void {
        window.sessionStorage.removeItem('MotoLocator_token');
    }

    removeSessionStorage(): void{
        window.sessionStorage.removeItem('MotoLocator_token')
        window.sessionStorage.removeItem('MotoLocator_portNo')
        window.sessionStorage.removeItem('MotoLocator_username')
        window.sessionStorage.removeItem('MotoLocator_roles')
    }

    getMotolocatorAPIPort(): string{
        return window.sessionStorage.getItem('MotoLocator_portNo');
    }

    authenticate(userName: string, password: string): Observable<boolean> {        
        const authenticateResult = new Subject<boolean>();
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = XML.Requests.Login.loginRequest.replace("{user}", userName).replace("{password}", password);
        this.userName = userName;
        this.httpClient.post(Constants.EndPoints.Login.EndPoint,
            data,
            {   
                headers: httpHeaders,
                responseType: 'text' 
            }
            ).subscribe((response: any) => {
                const xmlResponse = new DOMParser().parseFromString(response);
                if ((xmlResponse.getElementsByTagName("MSSLoginResult")[0]).firstChild.nodeValue.toString().toLowerCase() == "pass") {
                    const token = (xmlResponse.getElementsByTagName("token")[0]).firstChild.nodeValue.toString();
                    const roles = (xmlResponse.getElementsByTagName("roles")[0]).firstChild.firstChild.nodeValue.toString();
                    window.sessionStorage.setItem('MotoLocator_token', token);
                    window.sessionStorage.setItem('MotoLocator_roles', roles);
                    window.sessionStorage.setItem('MotoLocator_username', userName);
                    authenticateResult.next(true);
                } else {
                    authenticateResult.next(false);
                }                
            }, (error: any) => {
                console.log(error);
                authenticateResult.next(false);
            });

        return authenticateResult.asObservable();
    }

    signOut(): Observable<boolean> {
        const signOutResult = new Subject<boolean>();

        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = XML.Requests.Login.logoutRequest.replace("{token}",window.sessionStorage.getItem('MotoLocator_token'));

        this.httpClient.post(Constants.EndPoints.Logout.EndPoint,
            data,
            {   
                headers: httpHeaders,
                responseType: 'text' 
            }
            ).subscribe((response: any) => {
                const xmlResponse = new DOMParser().parseFromString(response);                 
                const logoutResult = (xmlResponse.getElementsByTagName("MSSLogoutResult")[0]).firstChild.nodeValue.toString().toLowerCase();
                if (logoutResult.indexOf("pass") !== -1 ||  logoutResult === "tokentimeoutexpire") {
                    window.sessionStorage.removeItem('MotoLocator_token');
                    signOutResult.next(true);
                } else {
                    signOutResult.next(false);
                }                
            }, (error: any) => {
                console.log(error);
                signOutResult.next(false);
            });

        return signOutResult.asObservable();
    }
    
    mbsauthenticate(userName: string, password: string): Observable<boolean> {        
        const authenticateResult = new Subject<boolean>();
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = MBS.XML.Requests.MbSService.loginRequest.replace("{user}", userName).replace("{password}", password);
        this.userName = userName;
        this.httpClient.post(Constants.EndPoints.MBSLogin.MBSEndPoint,
            data,
            {   
                headers: httpHeaders,
                responseType: 'text' 
            }
            ).subscribe((response: any) => {
                const xmlResponse = new DOMParser().parseFromString(response);
                if ((xmlResponse.getElementsByTagName("MSSLoginResult")[0]).firstChild.nodeValue.toString().toLowerCase() == "pass") {
                    const token = (xmlResponse.getElementsByTagName("token")[0]).firstChild.nodeValue.toString();
                    const roles = (xmlResponse.getElementsByTagName("roles")[0]).firstChild.firstChild.nodeValue.toString();
                    window.sessionStorage.setItem('MotoLocator_token', token);
                    window.sessionStorage.setItem('MotoLocator_roles', roles);
                    authenticateResult.next(true);
                } else {
                    authenticateResult.next(false);
                }                
            }, (error: any) => {
                console.log(error);
                authenticateResult.next(false);
            });

        return authenticateResult.asObservable();
    }

    mbssignOut(): Observable<boolean> {
        const signOutResult = new Subject<boolean>();

        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = MBS.XML.Requests.MbSService.logoutRequest.replace("{token}",window.sessionStorage.getItem('MotoLocator_token'));

        this.httpClient.post(Constants.EndPoints.MBSLogout.MBSEndPoint,
            data,
            {   
                headers: httpHeaders,
                responseType: 'text' 
            }
            ).subscribe((response: any) => {
                const xmlResponse = new DOMParser().parseFromString(response);                 
                const logoutResult = (xmlResponse.getElementsByTagName("MSSLogoutResult")[0]).firstChild.nodeValue.toString().toLowerCase();
                if (logoutResult.indexOf("pass") !== -1 ||  logoutResult === "tokentimeoutexpire") {
                    window.sessionStorage.removeItem('MotoLocator_token');
                    signOutResult.next(true);
                } else {
                    signOutResult.next(false);
                }                
            }, (error: any) => {
                console.log(error);
                signOutResult.next(false);
            });

        return signOutResult.asObservable();
    }

    motolocatorAPIPort(): void {
        const httpHeaders = new HttpHeaders()
                            .set('Content-Type', 'text/xml');

        const data = XML.Requests.Login.getMotolocatorAPIPortRequest;

        this.httpClient.post(Constants.EndPoints.Login.MotoLocatorPortNo, data, {   
                headers: httpHeaders,
                responseType: 'text' 
            }).subscribe((response: any) => {
                const xmlResponse = new DOMParser().parseFromString(response);
                const result = xmlResponse.getElementsByTagName("getMotolocatorAPIPortResult")[0].firstChild.nodeValue.toString();
                window.sessionStorage.setItem('MotoLocator_portNo', result);            
            }, (error: any) => {
                console.log(error);                
            });            
    }
}
