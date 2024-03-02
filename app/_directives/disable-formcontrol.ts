import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appDisableFormControl]'
})
export class DisableFormControlDirective {
    @Input('appDisableFormControl')
    set disableFormControl(condition: boolean) {
        const action = condition ? 'disable' : 'enable';
        this.control.control[action]();
      }

    constructor(private control: NgControl) {
    }
}
