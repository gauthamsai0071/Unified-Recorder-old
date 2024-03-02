import { Pipe, PipeTransform } from '@angular/core';
import { AuthenticationService } from '../services/login/authentication-service';

@Pipe({
    name: 'authorize'
})
export class AuthorizePipe implements PipeTransform {
    constructor(private authenticationService: AuthenticationService) {

    }

    transform(value: string, claim: string, alternateText: string, findText: string = null) {
        // if (this.authenticationService.checkPermission(claim)) {
        //     return value;
        // } else if (findText === null) {
        //     return alternateText;
        // } else {
        //     return value.replace(new RegExp(findText, 'g'), alternateText);
        // }
    }
}
