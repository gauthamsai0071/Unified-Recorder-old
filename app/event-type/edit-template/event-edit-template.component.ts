import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { EventTypeService } from "../../services/event-type/event-type.service";
import { ConfirmationDialogService } from '../../_common/confirmation-dialog/confirmation-dialog.service';
import { DOMParser } from 'xmldom';
import { ToastService } from "@msi/cobalt";
import { Action } from '../../models/action/action';
import { ActionTypes } from '../../models/enums/actiontype';
import { FormGroup, Validators, FormBuilder, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from "rxjs";
import { EventType } from "../../models/event-type/event-type-list";
import * as _ from 'lodash';
import {ActionTypeComponent} from '../edit-template/action-type/action-type.component'

@Component({  
  templateUrl: './event-edit-template.component.html',
  styleUrls: ['./event-edit-template.component.scss']
})
export class EventEditTemplateComponent implements OnInit {
    actionForm: FormGroup = null;    
    hideAction: boolean;
    hideActionType: boolean;           
    showProgress: boolean;
    
    selectedName:string;    
    lblevent: string = '';
    id?: number = null;
    
    ///Severity variables
    severityId:string;    
    severityList: EventType[] = [];
    severityLevels: EventType[] = [];
    severityActionType: number;
    
    ///Action Variables
    actionId: number; 
    actionList: Action[] = [];
    actionSelected: Action[] = [];
    actionTypes  : any;
    selectedActionName: string;

    // Pagination
    PageSize: number = 4;
    severityRowCount: number;    
    severityPageNumber: number = 1;
    actionRowCount: number;    
    actionPageNumber: number = 1;
    
  get form() { return this.actionForm.controls; }

  constructor(private formBuilder: FormBuilder,
              private toastService: ToastService,
              private eventTypeService: EventTypeService,
              private confirmationDialogService: ConfirmationDialogService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private changeDetectorRef: ChangeDetectorRef) { 
                this.showProgress = true;
                this.actionSelected = null;
                if (this.activatedRoute.snapshot.params.id) {
                  this.id = Number(this.activatedRoute.snapshot.params.id);
                }
              }

    ngOnInit(): void {
      let eventType: EventType = null;
      this.hideAction = false;
      this.hideActionType= false;

      if (this.id !== null) {
        forkJoin(
            this.eventTypeService.getEventTypeList(),
            this.eventTypeService.getTemplateSeverities(this.id.toString()),
            this.eventTypeService.getSeveritiesForEventType(this.id.toString())
            ).subscribe(response => {
                eventType = this.getEventType(response[0])
                this.lblevent = eventType.Name;
                this.getSeverityList(response[1]);
                this.getSeverityLevels(response[2]);
                this.showProgress = false;
                
            }, error => {

            });
     }
  }
  
  ngAfterViewChecked(){
    this.changeDetectorRef.detectChanges();
  }
  
  private getEventType(response: string): EventType {
      const xmlResponse = new DOMParser().parseFromString(response); 
      const result = xmlResponse.getElementsByTagName("getEventTypesResult")[0];

      let eventType = null;
      for(let index=0; index<result.childNodes.length; index++) {
          if (Number(result.childNodes[index].childNodes[0].firstChild.nodeValue) === this.id) {                
              eventType = new EventType();
              eventType.Id = this.id;
              eventType.Name = result.childNodes[index].childNodes[1].firstChild.nodeValue;
              eventType.GroupName = result.childNodes[index].childNodes[2].firstChild.nodeValue;
              return eventType;
          }
      }
      return null;
  }

  private getSeverityList(response: string) {
      const xmlResponse = new DOMParser().parseFromString(response); 
      const result = xmlResponse.getElementsByTagName("getTemplateSeveritiesResult")[0];
      this.severityList = [];
      for (let k = 0; k < result.childNodes.length; k++) {
        let item = result.childNodes[k];
        this.severityList.push({  
          Id: item.childNodes[0].firstChild.nodeValue,  
          Name: item.childNodes[1].firstChild.nodeValue,  
          GroupName: item.childNodes[2].firstChild.nodeValue
        });             
      }
      this.severityRowCount = this.severityList != null ?  this.severityList.length : 0;

      return null;
  }
  
  private getSeverityLevels(response: string): void {
    const xmlResponse = new DOMParser().parseFromString(response); 
        const result = xmlResponse.getElementsByTagName("getSeveritiesForEventTypeResult")[0];
        this.severityLevels = [];
        for (let k = 0; k < result.childNodes.length; k++) {
          let item = result.childNodes[k];
          this.severityLevels.push({  
            Id: item.childNodes[0].firstChild.nodeValue,  
            Name: item.childNodes[1].firstChild.nodeValue,  
            GroupName: item.childNodes[2].firstChild.nodeValue
          });              
        }
  }

  removeSeverityfromTemplate(Id: number): void  {
    this.showProgress = true;

    this.confirmationDialogService.confirmDialog("Confirmation",
    "Do you want to delete selected severity level", "Confirm", "Dismiss").subscribe(
      response => { 
        if(response)
        {
          this.eventTypeService.getSeverityActions(this.id.toString(),Id.toString()).subscribe(response => {
            const xmlResponse = new DOMParser().parseFromString(response); 
            const result = xmlResponse.getElementsByTagName("getSeverityActionsResult")[0];
            if(result.childNodes.length > 0)
            {
              this.toastService.error("Kindly delete severity actions before deleting severity level", undefined, {autoDismiss:5000, closeButton: true });
              this.showProgress = false;
            }
            else{
              this.eventTypeService.removeSeverityFromTemplate(this.id.toString(),Id.toString()).subscribe(
                response => {
                    const xmlResponse = new DOMParser().parseFromString(response);
                    this.getTemplateSeveritiesList();
                    if(this.hideAction)
                      this.hideAction = false;

                    this.showProgress = false;                
                }, (error) => {
                    this.toastService.error("Unexpected Error encountered while removing severity level", undefined, {autoDismiss:5000, closeButton: true });
                    this.showProgress = false;
                }
              );
            }
          });
                         
             
          
        }
        else
        {
          this.getTemplateSeveritiesList();
          this.showProgress = false;    
        }
    });
  }
  

  addSeverityfromTemplate(Id: number): void  {
    this.showProgress = true;

    if(Id !== undefined){
      this.eventTypeService.addSeverityToTemplate(this.id.toString(),Id.toString()).subscribe(
        response => {
            const xmlResponse = new DOMParser().parseFromString(response);
            this.getTemplateSeveritiesList();
            this.showProgress = false;                
        }, (error) => {
            this.toastService.error("Unexpected Error encountered while adding Event Type", undefined, {autoDismiss:5000, closeButton: true });
            this.showProgress = false;
        }
      );
    }
    else{
      this.toastService.error("Select the severity level", undefined, {autoDismiss:5000, closeButton: true });
      this.showProgress = false;
    }
  }
  
  private getTemplateSeveritiesList() {
        this.eventTypeService.getTemplateSeverities(this.id.toString())
                .subscribe(response => {
        const xmlResponse = new DOMParser().parseFromString(response); 
        const result = xmlResponse.getElementsByTagName("getTemplateSeveritiesResult")[0];
        this.severityList = [];
        for (let k = 0; k < result.childNodes.length; k++) {
          let item = result.childNodes[k];
          this.severityList.push({  
            Id: item.childNodes[0].firstChild.nodeValue,  
            Name: item.childNodes[1].firstChild.nodeValue,  
            GroupName: item.childNodes[2].firstChild.nodeValue
          });             
        }        
      });
  }
  
  public selectedSeverityRow(severitySelected) {
    //this.hideAction = true;
    this.actionTypes = [      
      { value: ActionTypes.CallaURL, type: 'Call URL' },
      { value: ActionTypes.CallMotoMapping, type: 'Call MotoMapping' },
      { value: ActionTypes.CallMLSAPI, type: 'Command Device' },
      { value: ActionTypes.CallMLSThrottling, type: 'Call MLS throttling' },
      { value: ActionTypes.SendSNMPTrap, type: 'Send SNMP trap' },
      { value: ActionTypes.RunExe, type: 'Launch an executable file' },
      { value: ActionTypes.SendTextMessage, type: 'Send Text Message' }
    ];
       
    this.actionForm = null;
    this.changeDetectorRef.detectChanges();
    
    this.selectedName = severitySelected.Name;    
    this.severityId = severitySelected.Id.toString();
    this.buildActionForm(this.actionTypes);
    this.bindSeverityActions(severitySelected.Id.toString());
    this.severityActionType = 1;
    this.actionSelected = null;
  }
  
  private bindSeverityActions(Id:string){
    this.eventTypeService.getSeverityActions(this.id.toString(), Id.toString())
                .subscribe(response => {
        const xmlResponse = new DOMParser().parseFromString(response); 
        const result = xmlResponse.getElementsByTagName("getSeverityActionsResult")[0];
        this.selectedActionName = '';        
        this.actionList = [];        
        for (let k = 0; k < result.childNodes.length; k++) {
          let item = result.childNodes[k];          
          this.actionList.push({              
            DeviceName: item.childNodes[0].firstChild != null ?  item.childNodes[0].firstChild.nodeValue : null,  
            Send2EvtOrg: item.childNodes[1].firstChild != null ? item.childNodes[1].firstChild.nodeValue : null,  
            GroupID: item.childNodes[2].firstChild != null ? item.childNodes[2].firstChild.nodeValue : null,
            GroupName: item.childNodes[3].firstChild != null ? item.childNodes[3].firstChild.nodeValue : null,
            Id: item.childNodes[4].firstChild != null ? item.childNodes[4].firstChild.nodeValue : null,               
            URL: item.childNodes[5].firstChild != null ? item.childNodes[5].firstChild.nodeValue : null,
            Message: item.childNodes[6].firstChild != null ? item.childNodes[6].firstChild.nodeValue : null,  
            Parameters: item.childNodes[7].firstChild !=null ? item.childNodes[7].firstChild.nodeValue : null,              
            Name: item.childNodes[8].firstChild != null ? item.childNodes[8].firstChild.nodeValue : null,
            Distance: item.childNodes[9].firstChild != null ? item.childNodes[9].firstChild.nodeValue : null,  
            MinUpdateTime: item.childNodes[10].firstChild != null ? item.childNodes[10].firstChild.nodeValue : null,  
            MaxUpdateTime: item.childNodes[11].firstChild != null ? item.childNodes[11].firstChild.nodeValue : null,
            Triggers: item.childNodes[12].firstChild != null ? item.childNodes[12].firstChild.nodeValue : null,  
            ActionType: this.actionTypes[item.childNodes[13].firstChild.nodeValue].type,  
            AlertCode: item.childNodes[14].firstChild != null ? item.childNodes[14].firstChild.nodeValue : null,
            FaultDescription: item.childNodes[15].firstChild != null ? item.childNodes[15].firstChild.nodeValue : null,  
            ExePath: item.childNodes[16].firstChild != null ? item.childNodes[16].firstChild.nodeValue : null
          });             
        } 
        this.actionRowCount = this.actionList != null ?  this.actionList.length : 0;       
        this.hideAction = true;
      });
  }

  private buildActionForm(actiontype: any) {
    this.actionForm = this.formBuilder.group({
        actionTypes:['', Validators.required]
    }); 
  }

  onOptionSelected(valueSelected: string){  
    if(this.severityActionType === 1 && valueSelected != undefined){
      //this.resetAll();
      this.hideActionType = true;      
      this.actionSelected = [];
      this.actionSelected.push({
        ActionType: valueSelected,
        Id:0
      });
    }
    else
    {
      this.hideActionType = false;      
      this.actionSelected = [];
    }
  }

  saveAction(action){
    if(this.actionSelected[0].Id == 0){
        let actionSave : Action = {
          Id :  Number(this.severityId),
          Name : action.Name,
          ActionType: this.actionForm.get('actionTypes').value.value,
          MaxUpdateTime : action.MaxUpdateTime,
          MinUpdateTime : action.MinUpdateTime,
          Triggers : action.Triggers,
          Distance : action.Distance,
          URL : action.URL,
          FaultDescription : action.FaultDescription,
          ExePath : action.ExePath,
          Message : action.Message,
          AlertCode : action.AlertCode,
          Parameters : '',
          DeviceName :  action.DeviceName,
          Send2EvtOrg : action.Send2EvtOrg        
      }
      this.eventTypeService.createAction(actionSave).subscribe(
        response => {
        const xmlResponse = new DOMParser().parseFromString(response);                 
        const result = (xmlResponse.getElementsByTagName("createActionResult")[0]).firstChild.nodeValue.toString().toLowerCase();
        //this.showProgress = false;
        if (result === "ok") {
            this.actionId = (xmlResponse.getElementsByTagName("id")[0]).firstChild.nodeValue;
            const severityActionCount = this.severityList.length;
            this.eventTypeService.addActionToSeverity(this.id.toString(), this.severityId.toString(), this.actionId.toString(), (severityActionCount + 1).toString())
            .subscribe(response => {
              const xmlResponse = new DOMParser().parseFromString(response);
              const result = (xmlResponse.getElementsByTagName("addActionToSeverityResponse")[0]);
              this.toastService.success("Action Added Successfully", undefined, 
                                    { autoDismiss: 60000, closeButton: true });
              this.bindSeverityActions(this.severityId.toString());
              this.hideActionType = false; 
            });                     
        } else if (result === "objectwiththisnameexists") {
            this.toastService.error("Action with same name already exists", undefined, {autoDismiss:5000, closeButton: true });
        }
    }, (error) => {
        this.toastService.error("Unexpected Error encountered while adding Action", undefined, {autoDismiss:5000, closeButton: true });
      });
    }else{

          let actionTypeId = _.filter(this.actionTypes , function(o) { return o.type == action.ActionType; });
          let actionSave : Action = {
            Id :  Number(this.actionId),
            Name : action.Name,
            ActionType: actionTypeId[0].value,
            MaxUpdateTime : action.MaxUpdateTime,
            MinUpdateTime : action.MinUpdateTime,
            Triggers : action.Triggers,
            Distance : action.Distance,
            URL : action.URL,
            GroupID : action.GroupID,
            FaultDescription : action.FaultDescription,
            ExePath : action.ExePath,
            Message : action.Message,
            AlertCode : action.AlertCode,
            Parameters : '',
            DeviceName :  action.DeviceName,
            Send2EvtOrg : action.Send2EvtOrg     
        }
        this.eventTypeService.updateAction(actionSave).subscribe(
          response => {
          const xmlResponse = new DOMParser().parseFromString(response);                 
          const result = (xmlResponse.getElementsByTagName("updateActionResult")[0]).firstChild.nodeValue.toString().toLowerCase();
          //this.showProgress = false;
          if (result === "ok") {
                this.toastService.success("Action updated Successfully", undefined, 
                                      { autoDismiss: 60000, closeButton: true });
                this.bindSeverityActions(this.severityId.toString());
                this.hideActionType = false;                                  
          } else if (result === "objectwiththisnameexists") {
              this.toastService.error("Unexpected Error encountered while updating Action", undefined, {autoDismiss:5000, closeButton: true });
          }
      }, (error) => {
          this.toastService.error("Unexpected Error encountered while updating Action", undefined, {autoDismiss:5000, closeButton: true });
        });
    }
  } 

  selectedActionRow(SelectedAction){
    this.selectedActionName = SelectedAction.Name;
    this.hideActionType = true;
    this.actionSelected = [];
    this.actionId = SelectedAction.Id;
    this.actionSelected = _.filter(this.actionList, function(o) { return o.Id == SelectedAction.Id; });    
  }

  removeAction(actId: number): void  {
    this.showProgress = true;

    this.confirmationDialogService.confirmDialog("Confirmation",
    "Do you want to delete selected action", "Confirm", "Dismiss").subscribe(
      response => { 
        if(response)
        {
          this.eventTypeService.removeActionFromSeverity(this.id.toString(), this.severityId, actId.toString()).subscribe(
            response => {
                const xmlResponse = new DOMParser().parseFromString(response);
                this.bindSeverityActions(this.severityId);
                this.hideActionType = false;                
                this.showProgress = false;                
            }, (error) => {
                this.toastService.error("Unexpected Error encountered while removing action", undefined, {autoDismiss:5000, closeButton: true });
                this.showProgress = false;
            }
          );
        }
        else
        {
          this.bindSeverityActions(this.severityId);
          this.showProgress = false; 
        }
    });
  }

  getSeverityPage(event){
    this.severityPageNumber = event;
  }

  getActionPage(event){
    this.actionPageNumber = event;
  }

}
