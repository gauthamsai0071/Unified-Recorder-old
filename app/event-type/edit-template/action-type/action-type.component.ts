import { Component, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { DOMParser } from 'xmldom';
import { ToastService } from "@msi/cobalt";
import { textParameters } from '../../../models/enums/textparameters';
import { EventEmitter } from '@angular/core';
import { EventTypeService } from "../../../services/event-type/event-type.service";
import { Action } from '../../../models/action/action';
import {alertcode} from '../../../models/enums/alertcode';
import { Group } from '../../../models/group/group';
import * as _ from 'lodash';


export const textParametersMapping = [
  { value: textParameters.bcname, type: 'Boundary condition name' },
  { value: textParameters.thresholdtype, type: 'Threshold type' },
  { value: textParameters.areas, type: 'Areas' },
  { value: textParameters.minspeed, type: 'Minimum speed' },
  { value: textParameters.maxspeed, type: 'Maximum speed' },
  { value: textParameters.speedTestType, type: 'Speed test type' },
  { value: textParameters.missingUpdatesTime, type: 'Missing update time' },
  { value: textParameters.deviceSpeed, type: 'Device speed' },
  { value: textParameters.deviceLatitude, type: 'Device latitude' },
  { value: textParameters.deviceLongitude, type: 'Device longitude' },
  { value: textParameters.deviceTrigger, type: 'Device trigger' },
  { value: textParameters.deviceState, type: 'Device state' },
  { value: textParameters.deviceName, type: 'Device name' },
  { value: textParameters.deviceFriendlyName, type: 'Device friendly name' },
  { value: textParameters.networkDeviceID, type: 'Network device id' },
  { value: textParameters.cellName, type: 'Cell name' },
  { value: textParameters.throttlingEventType, type: 'Throttling event type' },
  { value: textParameters.throttlingEventTypeLoc, type: 'Localized throttling event type' }
];

export const alertCodeMapping = [
  { value: alertcode.Critical, type: 'Critical' },
  { value: alertcode.Major, type: 'Major' },
  { value: alertcode.Minor, type: 'Minor' },
  { value: alertcode.Warning, type: 'Warning' },
  { value: alertcode.Info, type: 'Info' }
];

@Component({
  selector: 'app-action-type',
  templateUrl: './action-type.component.html',
  styleUrls: ['./action-type.component.scss']
})
export class ActionTypeComponent {
  formResetting: boolean = true;  
  alertCode = alertcode;
  enumKeys = [];
  actionId: number;
  groups: Group[] = [];  

  @Input() 
  actionType: Action[];  

  @Output()
  saveAction = new EventEmitter();

  public parameters;
  public alertcodes;
  public actionTypeName;
    

  actionTypeForm: FormGroup = null;  

  get form() { return this.actionTypeForm.controls; }

    constructor(private formBuilder: FormBuilder,
      private toastService: ToastService,
      private eventTypeService: EventTypeService,
      private changeDetectorRef: ChangeDetectorRef) {
      this.parameters = textParametersMapping;
      this.alertcodes = alertCodeMapping;      
    }

    ngOnChanges() {      
      this.formResetting = true; 
      this.actionTypeForm = null;
      this.changeDetectorRef.detectChanges();

      if (this.actionType === null) {
        return;
      }

      if(this.actionType[0].Id > 0){
        this.actionId =  this.actionType[0].Id;
        this.actionTypeName = this.actionType[0].ActionType;
        this.eventTypeService.getActionAvailableGroups(this.actionId.toString())
              .subscribe(response => {
                this.setGroups(response)            
                const group = _.filter(this.groups, item => item.Id === this.actionType[0].GroupID);

                    if (group.length > 0) {
                      this.actionType[0].GroupID = group[0].Id;
                    }
              });
        this.buildActionTypeForm();
      }
      else{
        this.actionId =  0;
        this.actionTypeName = this.actionType[0].ActionType;
        this.buildActionTypeForm();
      }
    }

    save(): void {
      this.formResetting = false;
      this.actionTypeForm.updateValueAndValidity();

      if (this.actionTypeForm.invalid) {
          return;
      }

      if(this.actionType[0].Id > 0){
        let action : Action = {
          MaxUpdateTime : Number(this.actionTypeForm.get('maxUpdate').value),
          MinUpdateTime : Number(this.actionTypeForm.get('minUpdate').value),
          Triggers :  this.actionTypeForm.get('triggers').value,
          Distance : Number(this.actionTypeForm.get('distance').value),
          Name : this.actionTypeForm.get('actionName').value,
          ActionType: this.actionType[0].ActionType,
          URL : this.actionTypeForm.get('URL').value,
          GroupID : Number(this.actionType[0].GroupID),
          FaultDescription : this.actionTypeForm.get('faultDescription').value,
          ExePath : this.actionTypeForm.get('executablePath').value,
          Message : this.actionTypeForm.get('messageTemplate').value,
          AlertCode : Number(this.alertCode[this.actionTypeForm.get('alertCode').value]),
          DeviceName : this.actionTypeForm.get('destinationAddress').value,
          Send2EvtOrg : this.actionTypeForm.get('chkSendOrg').value
        };
        this.saveAction.emit(action);
      }else{
        let action : Action = {
          Name : this.actionTypeForm.get('actionName').value,
          ActionType: this.actionTypeName,
          MaxUpdateTime : Number(this.actionTypeForm.get('maxUpdate').value),
          MinUpdateTime : Number(this.actionTypeForm.get('minUpdate').value),
          Triggers : this.actionTypeForm.get('triggers').value,
          Distance : Number(this.actionTypeForm.get('distance').value),
          URL : this.actionTypeForm.get('URL').value,          
          FaultDescription : this.actionTypeForm.get('faultDescription').value,
          ExePath : this.actionTypeForm.get('executablePath').value,
          Message : this.actionTypeForm.get('messageTemplate').value,
          AlertCode : Number(this.alertCode[this.actionTypeForm.get('alertCode').value]),
          DeviceName : this.actionTypeForm.get('destinationAddress').value,
          Send2EvtOrg : this.actionTypeForm.get('chkSendOrg').value
        };
        this.saveAction.emit(action);
      }
    }

    addParameter(messageTemplate): void {
      if(this.actionTypeForm.get('textParameter').value !== undefined && 
          this.actionTypeForm.get('textParameter').value !== null && this.actionTypeForm.get('textParameter').value !== ""){
      const parameterSelected = this.actionTypeForm.get('textParameter').value.value;      
      // get current text of the input
      const value = messageTemplate.value;

      // save selection start and end position
      const start = messageTemplate.selectionStart;
      const end = messageTemplate.selectionEnd;

      // update the value with our text inserted
      messageTemplate.value = value.slice(0, start) + `%${textParameters[parameterSelected]}%` + value.slice(end);

      // update cursor to be at the end of insertion
      messageTemplate.selectionStart = messageTemplate.selectionEnd = start + `%${textParameters[parameterSelected]}%`.length;
      this.actionTypeForm.get('messageTemplate').setValue(messageTemplate.value);
      }
      else{
        this.toastService.error("Kindly select any text parameter to add", undefined, {autoDismiss: 5000, closeButton: true });
      }
    }

    buildActionTypeForm() {    
      this.actionTypeForm = this.formBuilder.group({
        actionName:[this.actionType[0].Name != null ? this.actionType[0].Name : '', Validators.required],
        textParameter: [''],
        messageTemplate: [this.actionType[0].Message != null ? this.actionType[0].Message : ''],
        minUpdate: [this.actionType[0].MinUpdateTime != null ? this.actionType[0].MinUpdateTime : 0],
        maxUpdate: [this.actionType[0].MaxUpdateTime != null ? this.actionType[0].MaxUpdateTime : 0],
        distance: [this.actionType[0].Distance != null ? this.actionType[0].Distance : 0],
        triggers: [this.actionType[0].Triggers != null ? this.actionType[0].Triggers : ''],
        URL: [this.actionType[0].URL != null ? this.actionType[0].URL : ''],
        faultDescription: [this.actionType[0].FaultDescription != null ? this.actionType[0].FaultDescription : ''],
        executablePath: [this.actionType[0].ExePath != null ? this.actionType[0].ExePath : ''],
        destinationAddress: [this.actionType[0].DeviceName != null ? this.actionType[0].DeviceName : ''],
        alertCode: [alertcode[this.actionType[0].AlertCode != null ? this.actionType[0].AlertCode : 1028]],
        chkSendOrg: [this.actionType[0].Send2EvtOrg == 'true' ? true : false],
        groupId:['']
      });
    }    

    isEnable():void{
      this.actionTypeForm.get('chkSendOrg').valueChanges.subscribe((value) => {
        value == true ? this.actionTypeForm.get('destinationAddress').disable() : this.actionTypeForm.get('destinationAddress').enable()
      })
    }

    private setGroups(response: string) : void {
      const xmlResponse = new DOMParser().parseFromString(response); 
      const result = xmlResponse.getElementsByTagName("getActionAvailableGroupsResult")[0];

      _.each(result.childNodes, element => {
          const group = new Group();
          this.groups = [];
          group.Id = element.childNodes[0].firstChild.nodeValue;
          group.Name = element.childNodes[1].firstChild.nodeValue;
          this.groups.push(group); 
      });         
  }
}
