import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticationService } from '../services/login/authentication-service';

@Component({
    selector: 'navigation-bar',
    templateUrl: './navigation-bar.component.html',
    styleUrls: [ './navigation-bar.component.scss' ]
})
export class NavigationbarComponent {
}