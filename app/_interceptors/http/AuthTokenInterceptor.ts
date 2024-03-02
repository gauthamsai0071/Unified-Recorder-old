import { Injectable, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import {ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../services/login/authentication-service';
import { catchError } from 'rxjs/operators';
import { ToastService } from "@msi/cobalt";
import { Credential } from '../../models/login/credential';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private router: Router,
              private route: ActivatedRoute,
              private toastService: ToastService,
              private authenticationService: AuthenticationService,    
              @Inject('Core_BaseURL') private coreBaseUrl: string) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let interceptedRequest: HttpRequest<any>;
    let url = request.url;
    
                            

    if (this.coreBaseUrl !== '' && (request.url.indexOf('MES') !== -1 || request.url.indexOf('MBS') !== -1 || request.url.indexOf('MAW') !== -1)) {
        url = `${this.coreBaseUrl}${request.url}`;
        if (this.authenticationService.isAuthenticated()) {
          interceptedRequest = request.clone({ url: url, 
            body: request.body.replace('{token}', this.authenticationService.getAuthenticationToken()) });
        } else {
          interceptedRequest = request.clone( { url: url, body: request.body, headers: request.headers, responseType: 'text' });
        }
        //return next.handle(request).pipe(catchError(this.handleError()));
    }      
    else if(this.coreBaseUrl !== '' && request.url.indexOf('api/') !== -1 )
    {     
      if (this.authenticationService.isAuthenticated()){
        const portno  = Number(this.authenticationService.getMotolocatorAPIPort());        

        let apiurl = `${this.coreBaseUrl}:${portno}`;        
          url = `${apiurl}/${request.url}`;
          interceptedRequest = request.clone({
            url: url,
            setHeaders: {
            'Authorization':  
                    this.authenticationService.getAuthenticationToken()
                  }
          });
      }
    }      
    else {
      if (this.authenticationService.isAuthenticated()) {
          interceptedRequest = request.clone({
                                    url: url,
                                    setHeaders: {
                                    'Authorization': 'Token ' + 
                                            this.authenticationService.getAuthenticationToken()
                                }});
      } 
    }
    
    return next.handle(interceptedRequest).pipe(catchError(this.handleError()));
  }

  private handleError () {
    return (error: any): Observable<any> => {
      if (error.status === 401 || 
          (error.status === 500 && error.error.indexOf("<faultstring>TokenTimeoutExpire</faultstring>") !== -1)) {

        this.authenticationService.removeAuthenticationToken();
        if (this.router.url.indexOf('login') !== -1) {
          return;
        }

        if (this.router.url.toString().trim() !== '/') {
          this.router.navigate(['login'], { queryParams: { returnUrl: this.router.url.toString().trim() } });
        } else {
          this.authenticationService.removeSessionStorage();
          this.router.navigate(['login']);
        }

        return new Observable();
      } else {
        if(error.status === 0){
          this.toastService.error("Unable to connect Motolocator webservice. please contact your administrator.", undefined, {autoDismiss: 5000, closeButton: true });
          let returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl]);
        }
        else{
          this.authenticationService.removeSessionStorage();
          this.router.navigate(['login']);
        }
        //console.error(error);
        //throw error;
      }
    };
  }
}
