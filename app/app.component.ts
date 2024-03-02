import { Component } from '@angular/core';
import { AuthenticationService } from './services/login/authentication-service';
import { Router, NavigationEnd } from '@angular/router';
import { Constants } from './_common/constants.page.titles';
import * as _ from 'lodash';
import { ToastService } from '@msi/cobalt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  pageHeader: string;

  constructor(private router: Router,
              public authenticationService: AuthenticationService,
              private toastService: ToastService) {
      this.pageHeader = '';
      this.router.events
            .subscribe(event => {
                if (event instanceof NavigationEnd) {
                  this.setPageHeader(event.url);
                } 
              });

      this.toastService.updateContainerConfig({ position: 'bottom-right' });
  }

  signOut(): void {
    this.authenticationService.signOut()
        .subscribe((result) => {
            if (result) {
                this.router.navigate(['/login']);
            }
        });
  }

  private setPageHeader(url: string): any {
    let computeUrl;

    if (url.indexOf('?') === -1) {
      computeUrl = url.replace(/[0-9]/g, '');
    } else {
      computeUrl = url.substring(0, url.indexOf('?'));
    }

    for(let key in Constants.Page.titles) {
      if (key.indexOf(computeUrl) !== -1) {
        this.pageHeader = Constants.Page.titles[computeUrl];
        break;
      } else {
        this.pageHeader = '';
      }      
    }
  }
}
