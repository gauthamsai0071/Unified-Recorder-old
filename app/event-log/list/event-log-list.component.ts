import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder,FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DOMParser } from 'xmldom';
import { ToastService } from "@msi/cobalt";
import { ConfirmationDialogService } from '../../_common/confirmation-dialog/confirmation-dialog.service';
import { EventTypeService } from "../../services/event-type/event-type.service";
import { ServerityService } from "../../services/severity/severity.service";
import { EventLogService } from "../../services/event-log/event-log.service";
import { LogEventFilter } from '../../models/event-log/event-log-filter';
import { LogEvent } from '../../models/event-log/event-log-list';
import { EventParameter } from '../../models/event-log/event-log-list';
import { EventType } from '../../models/event-type/event-type-list';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { forkJoin, interval, Subscription } from "rxjs";
import {AcknowledgeStatus} from '../../models/enums/AcknowledgeStatus';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

export const acknowledgeStatus = [
  { value: 0, type: 'Unacknowledged' },
  { value: 1, type: 'Acknowledged' },  
  { value: 2, type: 'Both' }];

@Component({
  templateUrl: './event-log-list.component.html',
  styleUrls: ['./event-log-list.component.scss']
})
export class EventLogListComponent implements OnInit {  
  eventLogForm : FormGroup=null;     
  showProgress: boolean;
  eventLogList: LogEvent[] = [];
  dropdownSettings:IDropdownSettings = {};    
  formResetting: boolean = true;
  logEventFilter : LogEventFilter;
  severityLevels: EventType[] = [];
  eventTypes :EventType[]=[];
  currentDate = new Date();
  maxDate: NgbDate = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
  fromMaxDate:NgbDate;
  fromMinDate:NgbDate;
  rowCount: number;
  eventLogParameters: EventParameter[] = [];
  showParameters: boolean = false;
  
  public filterData;
  private updateSubscription: Subscription;

  get form() { return this.eventLogForm.controls; }
  constructor( private formBuilder: FormBuilder,   
    private toastService: ToastService,
    private eventLogService: EventLogService,
    private eventTypeService: EventTypeService,
    private serverityService: ServerityService,
    private confirmationDialogService: ConfirmationDialogService,
    public router: Router,
    private changeDetectorRef: ChangeDetectorRef ) { 
      this.showProgress = true; 
    }

  ngOnInit(): void {
    this.showProgress = true;
    this.changeDetectorRef.detectChanges();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: false
    };
    this.filterData = acknowledgeStatus;
    this.logEventFilter = new LogEventFilter();
    forkJoin(this.eventTypeService.getEventTypeList(),
    this.serverityService.getSeverityLevels(),
    this.eventLogService.getEventLogs(this.logEventFilter)).subscribe(response =>{
      this.getevenTypes(response[0]);
      this.getSeverityLevels(response[1]);
      this.getEventLogList(response[2]);
      this.showProgress = false;
    });
      
    this.buildAuditLogForm();
  }

  ngAfterViewChecked(){
    this.changeDetectorRef.detectChanges();
  }

  private buildAuditLogForm() {
    this.eventLogForm = this.formBuilder.group({     
      txtOriginator:[""],
      eventType:[""],
      severities: [""],
      FromDate:[""],       
      ToDate:[""],
      acknowledgementStatus:[""],
      FromTime:[""],
      ToTime:[''],
      chkAutoRefresh:false
    }); 
  }

  getPage(page: number) {  
    this.logEventFilter.PageNumber =   page;
    this.eventLogList.splice(0,this.eventLogList.length);
    this.changeDetectorRef.detectChanges();    
    this.eventLogService.getEventLogs(this.logEventFilter).subscribe(response =>{
      this.getEventLogList(response);      
    });
  }

  resetForm()
  {
    this.formResetting = true;
    this.eventLogForm.reset();
    this.logEventFilter = new LogEventFilter();
    this.logEventFilter.PageNumber =   1;
    this.eventLogList.splice(0,this.eventLogList.length);
    this.changeDetectorRef.detectChanges();    
    this.eventLogService.getEventLogs(this.logEventFilter).subscribe(response =>{
      this.getEventLogList(response);      
    });   
  }

  onSearchClick() : void
  {
    this.formResetting = false;
    this.logEventFilter=new LogEventFilter();
    if (this.eventLogForm.invalid) {
        return;
    }
    this.showProgress = true;    
    if(this.eventLogForm.value.txtOriginator != ''){
      this.logEventFilter.IsOrigFilterApplied = true;
      this.logEventFilter.Originators = this.eventLogForm.value.txtOriginator;
    }

    if(this.eventLogForm.value.eventType !== '' && this.eventLogForm.value.eventType != undefined){
      this.logEventFilter.IsETFilterApplied = true;
      this.logEventFilter.EventTypes = this.eventLogForm.get('eventType').value.Name;
    }

    if(this.eventLogForm.value.severities !== '' && this.eventLogForm.value.severities != undefined){
      this.logEventFilter.IsSevFilterApplied = true;
      this.logEventFilter.Severities = this.eventLogForm.get('severities').value.Name;
    }

    if(this.eventLogForm.value.acknowledgementStatus !== '' && this.eventLogForm.value.acknowledgementStatus !== undefined){      
      this.logEventFilter.Ack = this.eventLogForm.get('acknowledgementStatus').value.type;
    }

    if(this.eventLogForm.value.FromDate)
      this.logEventFilter.StartDate=new Date(this.eventLogForm.value.FromDate.year ,
      this.eventLogForm.value.FromDate.month-1,
      this.eventLogForm.value.FromDate.day);
    
    if(this.eventLogForm.value.FromTime)  
    {
      this.logEventFilter.StartDate.setHours(
      this.eventLogForm.value.FromTime.hour,
      this.eventLogForm.value.FromTime.minute,
      this.eventLogForm.value.FromTime.second
      )      
    }

    if(this.eventLogForm.value.ToDate)
      this.logEventFilter.EndDate=new Date(this.eventLogForm.value.ToDate.year ,
      this.eventLogForm.value.ToDate.month-1,
      this.eventLogForm.value.ToDate.day)
              
    if(this.eventLogForm.value.ToTime)
    {
      this.logEventFilter.EndDate.setHours(
        this.eventLogForm.value.ToTime.hour,
        this.eventLogForm.value.ToTime.minute,
        this.eventLogForm.value.ToTime.second
      )    
    }

    if(this.eventLogForm.value.txtOriginator == '' && this.eventLogForm.value.eventType == '' 
      && this.eventLogForm.value.severities == '' && this.eventLogForm.value.acknowledgementStatus == ''
      && this.eventLogForm.value.ToDate == undefined && this.eventLogForm.value.ToTime == undefined)
      {
        this.toastService.error("Event Log records are not found", undefined, {autoDismiss: 5000, closeButton: true });
        this.showProgress = false; 
        return;
      }

    this.logEventFilter.PageNumber = 1;
    this.eventLogList.splice(0,this.eventLogList.length);
    this.changeDetectorRef.detectChanges();    
    this.eventLogService.getEventLogs(this.logEventFilter).subscribe(response =>{
      this.getEventLogList(response);
      this.showProgress = false;      
    });

  }

  isEnable() : void{
    this.eventLogForm.get('chkAutoRefresh').valueChanges.subscribe((value) => {
      if( value == true){
        this.updateSubscription = interval(5000).subscribe(
          (val) => { 
            this.logEventFilter = new LogEventFilter();
            this.logEventFilter.PageNumber =   1;
            this.eventLogList.splice(0,this.eventLogList.length);
            this.changeDetectorRef.detectChanges();    
            this.eventLogService.getEventLogs(this.logEventFilter).subscribe(response =>{
              this.getEventLogList(response);      
            });
        });
      }
      else
      {
        this.updateSubscription.unsubscribe();
      }
    });
    
  }

  private getevenTypes(response: string): void {
    const xmlResponse = new DOMParser().parseFromString(response); 
    const result = xmlResponse.documentElement.childNodes[0].childNodes[0].childNodes[0].getElementsByTagName("getEventTypesResult");    
    for (let k = 0; k < result._node.childNodes.length; k++) {
      let item = result._node.childNodes[k];
      this.eventTypes.push({  
        Id: item.childNodes[0].firstChild.nodeValue,  
        Name: item.childNodes[1].firstChild.nodeValue,  
        GroupName: item.childNodes[2].firstChild.nodeValue
      });              
    }
  }

  private getSeverityLevels(response: string): void {
    const xmlResponse = new DOMParser().parseFromString(response); 
    const result = xmlResponse.documentElement.childNodes[0].childNodes[0].childNodes[0].getElementsByTagName("getSeverityLevelsResult");
    this.severityLevels = [];
    for (let k = 0; k < result._node.childNodes.length; k++) {
      let item = result._node.childNodes[k];
      this.severityLevels.push({  
        Id: item.childNodes[0].firstChild.nodeValue,  
        Name: item.childNodes[1].firstChild.nodeValue,  
        GroupName: item.childNodes[2].firstChild.nodeValue
      });              
    }
  }

  getEventLogList(response: string): void {
    const xmlResponse = new DOMParser().parseFromString(response); 
        const result = xmlResponse.getElementsByTagName("getEventListResult")[0];
        for (let k = 0; k < result.childNodes.length; k++) {
          let item = result.childNodes[k];
          let eventParameter = item.childNodes[8];
          let parameterList : EventParameter[] = []
          for(let i = 0; i < eventParameter.childNodes.length; i++){            
            parameterList.push({
              ParamName: eventParameter.childNodes[i].childNodes[0].firstChild != null ?  eventParameter.childNodes[i].childNodes[0].firstChild.nodeValue : null,
              ParamValue: eventParameter.childNodes[i].childNodes[1].firstChild != null ?  eventParameter.childNodes[i].childNodes[1].firstChild.nodeValue : null,
              ParamDescription: eventParameter.childNodes[i].childNodes[2].firstChild != null ?  eventParameter.childNodes[i].childNodes[2].firstChild.nodeValue : null
            })
          }
          this.eventLogList.push({  
            Id: item.childNodes[0].firstChild != null ?  item.childNodes[0].firstChild.nodeValue : null,
            EventType: item.childNodes[1].firstChild != null ?  item.childNodes[1].firstChild.nodeValue : '',
            Severity: item.childNodes[2].firstChild != null ?  item.childNodes[2].firstChild.nodeValue : '',
            Originator: item.childNodes[3].firstChild != null ?  item.childNodes[3].firstChild.nodeValue : null,
            OccurrenceTime: item.childNodes[4].firstChild != null ?  item.childNodes[4].firstChild.nodeValue : '',
            IsAcknowledge: item.childNodes[5].firstChild != null ?  item.childNodes[5].firstChild.nodeValue : '',
            AckUrl: item.childNodes[6].firstChild != null ?  item.childNodes[6].firstChild.nodeValue : null,
            CanAck: item.childNodes[7].firstChild != null ?  item.childNodes[7].firstChild.nodeValue : '',
            Parameters: parameterList, 
          });              
        }
        const totalCount = xmlResponse.getElementsByTagName("rowCount")[0];
        this.rowCount = totalCount.childNodes[0] != null ?  totalCount.childNodes[0].nodeValue : 0;   
        
        if(this.rowCount == 0)
        {
          this.toastService.error("Event Log records are not found", undefined, {autoDismiss: 5000, closeButton: true });
        }
        
  }
  
  getEventParamters(Id : number){
    const parameters = _.filter(this.eventLogList, item => item.Id.toString() === Id.toString());
    this.eventLogParameters = [];
    if (parameters.length > 0) {
      let param = parameters[0].Parameters;
      for(let i =0; i < parameters[0].Parameters.length; i++){
        this.eventLogParameters.push({
          ParamName: param[i].ParamName,
          ParamValue: param[i].ParamValue,
          ParamDescription: param[i].ParamDescription
        });
      }
      this.showParameters = true;
    }

  }

  removeEventLog(Id: number): void  {
    this.showProgress = true;

    this.confirmationDialogService.confirmDialog("Confirmation",
    "Do you want to delete selected event log?", "Confirm", "Dismiss").subscribe(
      response => { 
        if(response)
        {
          this.eventLogService.removeEventLog(Id.toString()).subscribe(
            response => {
                const xmlResponse = new DOMParser().parseFromString(response);                 
                const result = xmlResponse.getElementsByTagName("removeEventResult")[0];                
                if (result) {
                    this.toastService.success("Event log removed successfully.", undefined, { autoDismiss: 5000, closeButton: true });
                    this.eventLogList.splice(0,this.eventLogList.length);
                    this.eventLogService.getEventLogs(this.logEventFilter).subscribe(response =>{
                      this.getEventLogList(response);
                      this.showProgress = false;      
                    });
                } else {
                    this.toastService.error("Error in removing the event log.", undefined, {autoDismiss: 5000, closeButton: true });
                    this.showProgress = false; 
                }
            }, (error) => {
                this.toastService.error("Unexpected error encountered while deleting event log", undefined, {autoDismiss: 5000, closeButton: true });
                this.showProgress = false;
            }
          );
        }
    });
  }  

  acknowledgeEventLog(Id: number): void  {
    this.showProgress = true;

    this.eventLogService.acknowledgeEventLog(Id.toString()).subscribe(
      response => {       
          const xmlResponse = new DOMParser().parseFromString(response); 
          const result = (xmlResponse.getElementsByTagName("acknowledgeEventResult")[0]);                    
          if (result) { 
            this.toastService.success("Event log acknowledged successfully.", undefined, { autoDismiss: 5000, closeButton: true });                       
            this.eventLogList.splice(0,this.eventLogList.length);
            this.eventLogService.getEventLogs(this.logEventFilter).subscribe(response =>{
              this.getEventLogList(response);
              this.showProgress = false;      
            });
              
          } else {
              this.toastService.error("Error in acknowledging the event log.", undefined, {autoDismiss: 5000, closeButton: true });
              this.showProgress = false;
          }
    },(error) => {
      this.toastService.error("Unexpected error encountered while acknowledging event log", undefined, {autoDismiss: 5000, closeButton: true }); 
      this.showProgress = false;
    });
  }
}