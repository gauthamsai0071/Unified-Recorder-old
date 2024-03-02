import { Component } from '@angular/core';
import { AuthenticationService } from '../services/login/authentication-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InformationDialogService } from '../_common/information-dialog/information-dialog.service';


@Component({
   templateUrl: './login.component.html',
   styleUrls: [ './login.component.scss' ]
})
export class LoginComponent {
   private loginSubscription: Subscription;

    loginForm: FormGroup;
    returnUrl: string;
    loginFailed: boolean;
    showLogin: boolean = false;

    formResetting: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private informationDialogService: InformationDialogService,
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService) {
        this.loginFailed = false;
    }

    get form() { return this.loginForm.controls; }

    ngOnInit(): void {
        this.openWarningPopUp();
        this.buildLoginForm();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    openWarningPopUp()
    {
        this.informationDialogService.confirmDialog("Warning",
        "This is a monitored computer system. Illegal and/or unauthorized use of this device and any related service is strictly prohibited and appropriate legal action will be taken, including without limitation civil, criminal and injunctive redress. Your use of this device and any related service constitutes your consent to be bound by all terms, conditions, and notices associated with its use including consent to all monitoring and disclosure provisions.", "Ok").subscribe(
      response => { if(response){
        this.showLogin = true;
      } });
    }

    login(): boolean {
        this.formResetting = false;
        this.loginForm.updateValueAndValidity();
        if (this.loginForm.invalid) {
            return;
        }

        const userName = this.loginForm.value.userName;
        const password = this.loginForm.value.password;
        const rememberme = this.loginForm.value.rememberme;
        this.formResetting = true;
        this.loginForm.reset({});

        this.loginSubscription = this.authenticationService.authenticate(userName, password).subscribe(result => {
                if (result) {
                    this.authenticationService.motolocatorAPIPort();
                    if (rememberme) {
                       this.authenticationService.rememberCredentials(userName, password);                       
                    } else {
                        this.authenticationService.forgetCredentials();
                    }

                    this.router.navigate([this.returnUrl]);
                } else {
                    this.loginFailed = true;
                }
            });
    }

    ngOnDestroy(): void {
        if (this.loginSubscription !== undefined && this.loginSubscription !== null) {
            this.loginSubscription.unsubscribe();
        }
    }

    private buildLoginForm() {
        const credential = this.authenticationService.getCredential();
        this.loginForm = this.formBuilder.group({
            userName: [credential.name, Validators.required],
            password: [credential.password, [Validators.required, Validators.minLength(5)]],
            rememberme: [(credential.name !== '' ? true : false), []]
        });
    }
}