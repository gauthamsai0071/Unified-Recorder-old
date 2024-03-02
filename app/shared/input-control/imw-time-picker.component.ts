import { Component, EventEmitter, forwardRef, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DefaultTimeSetGenerator, formatTime, ngbTimeFromMoment } from '../../_common/time-control/util';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import * as _moment from 'moment';
import { TimeSet, TimeSetGenerator } from '../../models/time/time-set';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
const moment = _moment;

let nextUniqueId: number = 0;
const DEFAULT_TIME_SET = new DefaultTimeSetGenerator().generate();

@Component({
  selector: 'app-imw-time-picker',
  templateUrl: './imw-time-picker.component.html',
  styleUrls: ['./imw-time-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImwTimePickerComponent),
      multi: true,
    },
  ],
})
export class ImwTimePickerComponent implements  ControlValueAccessor, OnChanges, OnInit {
  public timeTextModel: string;
  public timeFormat: string = 'HH:mm:ss';

  @Input() time?: NgbTimeStruct;
  @Input() timeSet?: TimeSet;
  @Input() timeSetGenerator?: TimeSetGenerator;
  @Input() defaultValue?: NgbTimeStruct;
  @Input() allowEmpty?: boolean = true;
  @Input() extraValidation?: boolean = true;
  @Input() conditionalErrorState?: boolean = false;

  @ViewChild('wrapper') wrapper: any;
  dropdownWidth: number | null = null;

  private _disabled: boolean = false;
  @Input() set disabled(val: any) {
    this._disabled = coerceBooleanProperty(val);
  }
  get disabled() {
    return this._disabled;
  }

  private _dropdown: boolean = true;
  @HostBinding('class.has-dropdown')
  @Input() set dropdown(val: any) {
    this._dropdown = coerceBooleanProperty(val);
  }
  get dropdown() {
    return this._dropdown;
  }

  @Output() blur: EventEmitter<void> = new EventEmitter<void>();
  @Output() focus: EventEmitter<void> = new EventEmitter<void>();
  @Output() timeChange: EventEmitter<NgbTimeStruct> = new EventEmitter<NgbTimeStruct>();
  @Output() validationChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  // Unique ID
  private _uniqueId: string = `msi-time-picker-${++nextUniqueId}`;
  @Input() id: string = this._uniqueId;
  get inputId(): string { return `${this.id || this._uniqueId}-native`; }

  private _valid: boolean;
  public get isValid(): boolean { return this._valid; }

  timeControl: FormControl = new FormControl('', {
    validators: [this.timeValidator.bind(this)]
  });

  @HostBinding('class.msi-time-picker-control') readonly hostClass: boolean = true;

  // From ControlValueAccessor interface private data
  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (_: any) => void = () => {};

  ngOnInit() {
    if (!this.time) {
      this.setValue(this.defaultValue);
      this.setIsValid(this.allowEmpty || this.time !== undefined);
    }

    if (this.dropdown) {
      this.ensureTimeSet();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.time && changes.time.currentValue !== changes.time.previousValue) {
      this.setValue(changes.time.currentValue);
      this.setIsValid(this.allowEmpty || this.time !== undefined);
    }

    if (changes.extraValidation && changes.extraValidation.currentValue !== changes.extraValidation.previousValue) {
      this.setIsValid(this.allowEmpty || this.time !== undefined);
    }

    if (changes.timeSet && changes.timeSet.currentValue !== changes.timeSet.previousValue) {
      this.ensureTimeSet();
    } else if (changes.timeSetGenerator && changes.timeSetGenerator.currentValue !== changes.timeSetGenerator.previousValue) {
      this.ensureTimeSet(true);
    }
  }

  onTimeSelectedFromDropdown(time: NgbTimeStruct) {
    this.setValue(time);
    this.setIsValid(true);
  }

  setIsValid(isValid: boolean) {
    if (!this.extraValidation) {
      isValid = false;
    }

    if (this._valid !== isValid) {
      this._valid = isValid;
      this.validationChange.emit(this._valid);
    }
  }

  setValue(value?: NgbTimeStruct, fromInput: boolean = false) {
    this.time = value;
    if (this.onChangeCallback !== undefined) {
      this.onChangeCallback(value);
    }
    this.timeChange.emit(this.time);

    if (!fromInput) {
      this.timeTextModel = this.time ? formatTime(this.time, this.timeFormat) : '';
    }
  }

  private parseTime(time: string): _moment.Moment {
    return moment(time, this.timeFormat, true);
  }

  private ensureTimeSet(forceRegenerate: boolean = false) {
    if (!this.timeSet || forceRegenerate) {
      this.timeSet = this.timeSetGenerator ? this.timeSetGenerator.generate() : DEFAULT_TIME_SET;
    }
  }

  onBlur() {
    this.blur.emit();
    this.onTouchedCallback();
  }

  onFocus() {
    this.focus.emit();
  }

  /*
   * From ControlValueAccessor interface methods
   */

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  writeValue(value?: NgbTimeStruct) {
    this.setValue(value);
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  setDropdownWidth() {
    this.dropdownWidth = this.wrapper.nativeElement.clientWidth;
  }

  timeValidator(control: AbstractControl) {
    if (control.value === 0) {
      this.setValue(undefined, true);
      this.setIsValid(this.allowEmpty);
      return this.allowEmpty ? null : { invalidTime: true };
    } else {
      const timeMoment = this.parseTime(control.value);
      if (timeMoment.isValid()) {
        this.setValue(ngbTimeFromMoment(timeMoment), true);
        this.setIsValid(true);
        return null;
      } else {
        this.setValue(undefined, true);
        this.setIsValid(false);
        return { invalidTime: true };
      }
    }
  }

}
