import { Directive, Input, OnInit, ViewContainerRef, TemplateRef } from '@angular/core';
import { AuthenticationService } from '../services/login/authentication-service';

@Directive({
    selector: '[appAuthorize]'
})
export class AuthorizationDirective implements OnInit {
    @Input('appAuthorize')
    role: string;

    constructor(private viewContainer: ViewContainerRef,
                private templateRef: TemplateRef<any>,
                private authenticationService: AuthenticationService) {

    }

    ngOnInit(): void {
        if (this.authenticationService.checkPermission(this.role)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}
