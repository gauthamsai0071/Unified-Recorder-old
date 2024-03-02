import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { DOMParser } from 'xmldom';
import { ToastService } from "@msi/cobalt";
import { GroupService } from "../../services/group/group.service";
import { BoundaryConditionService } from "../../services/boundary-service/boundary-condition.service";
import { EventTypeService } from "../../services/event-type/event-type.service";
import { ServerityService } from "../../services/severity/severity.service";
import { Group } from '../../models/group/group';
import { EventType } from '../../models/event-type/event-type-list';
import { Mappings } from '../../models/boundary-condition/MappingsAttribute';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from "rxjs";
import * as _ from 'lodash';
import { BoundaryCondition } from '../../models/boundary-condition/boundary-condition-list';
import { NgbDate, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
const _moment = moment;


export const SpeedTestType = [
  { value: 1, type: 'Inside' },
  { value: 2, type: 'Outside' }
];

export function ngbDateFromMoment(m: moment.Moment): NgbDate {
  return new NgbDate(m.get('y'), m.get('M') + 1, m.get('D'));
}

@Component({  
  templateUrl: './manage-boundary-condition.component.html',
  styleUrls: ['./manage-boundary-condition.component.scss'],
})

export class ManageBoundaryConditionComponent implements OnInit { 
  showProgress: boolean; 
  formResetting: boolean = true;
  mytime: Date = new Date();
  boundaryConditionForm: FormGroup = null;
  id?: number = null;
  dateModel: Date = new Date();
  speedTest =[];
  isTalkGroup: boolean = false;
  isMessage: boolean = false;
  listBoundaryCondition: BoundaryCondition[] = [];

  groups: Group[] = [];
  severityLevels: EventType[] = [];
  eventTypes :EventType[]=[];
  threshold: Mappings[] = [];

  showReraise: boolean = true;
  isAutoResetChecked: boolean = false;
  public thresholdType;
  formGroup : FormGroup;
  currentDate = new Date();
  maxDate: NgbDate = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
  fromMinDate:NgbDate = ngbDateFromMoment(moment());
  fromMaxDate:NgbDate = ngbDateFromMoment(moment().endOf('year'));  

  get form() { return this.boundaryConditionForm.controls; }

  constructor(private formBuilder: FormBuilder,
    private toastService: ToastService,    
    private boundaryConditionService: BoundaryConditionService,
    private eventTypeService: EventTypeService,
    private serverityService: ServerityService,
    private groupService: GroupService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef) { 
      this.speedTest = SpeedTestType;     
      if (this.activatedRoute.snapshot.params.id) {
        this.id = Number(this.activatedRoute.snapshot.params.id);
    }
  }

    
  ngOnInit() {
    this.showProgress = true;
    this.formResetting = true; 
    this.boundaryConditionForm = null;
    this.changeDetectorRef.detectChanges();
    let boundaryConditionList: BoundaryCondition[] = [];

   

    if (this.id !== null){
      forkJoin(this.groupService.getGroups(),
        this.boundaryConditionService.getThersholdType(),
        this.eventTypeService.getEventTypeList(),
        this.serverityService.getSeverityLevels(),
        this.boundaryConditionService.getBoundaryConditionsById(this.id.toString())).subscribe(response =>{
            this.groups = response[0]; 
            this.threshold = response[1];
            this.getevenTypes(response[2]);
            this.getSeverityLevels(response[3]);
            boundaryConditionList = response[4];
            this.listBoundaryCondition = response[4];
            this.thresholdType = boundaryConditionList.length != 0 ? Number(boundaryConditionList[0].ThresholdType) : '';
            

            if(boundaryConditionList[0].ThresholdType != "8")
            {
              this.threshold.forEach((element,index)=>{
                if(element.Id == 6) this.threshold.splice(index,1);
              });
              this.threshold.forEach((element,index)=>{
                if(element.Id == 7) this.threshold.splice(index,1);
              });
              this.threshold.forEach((element,index)=>{
                if(element.Id == 8) this.threshold.splice(index,1);
              });
            }
            else
            {
              this.threshold.forEach((element,index)=>{
                if(element.Id == 6) this.threshold.splice(index,1);
              });
              this.threshold.forEach((element,index)=>{
                if(element.Id == 7) this.threshold.splice(index,1);
              });
              
              this.threshold.forEach((element,index)=>{
                if(element.Id == 8){
                  this.threshold.splice(index,1);
                  
                  this.threshold.push({
                    Id : 8,
                    Name: "Geo Select"
                  });
                }
              });

            }

            this.buildBoundaryConditionForm(boundaryConditionList);
            this.showProgress = false;
        });
    }else{
      forkJoin(this.groupService.getGroups(),
        this.boundaryConditionService.getThersholdType(),
        this.eventTypeService.getEventTypeList(),
        this.serverityService.getSeverityLevels()).subscribe(response =>{
            this.groups = response[0]; 
            this.threshold = response[1];
            this.getevenTypes(response[2]);
            this.getSeverityLevels(response[3]);

            boundaryConditionList = [];
            this.listBoundaryCondition = [];
            

            this.threshold.forEach((element,index)=>{
              if(element.Id == 6) this.threshold.splice(index,1);
            });
            this.threshold.forEach((element,index)=>{
              if(element.Id == 7) this.threshold.splice(index,1);
            }); 

            this.threshold.forEach((element,index)=>{
              if(element.Id == 8){
                this.threshold.splice(index,1);
                
                this.threshold.push({
                  Id : 8,
                  Name: "Geo Select"
                });
              }
            });            

            this.buildBoundaryConditionForm(boundaryConditionList);
            this.showProgress = false;
        });
    }
  } 
  
  ngAfterViewChecked(){
    this.changeDetectorRef.detectChanges();
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

  private buildBoundaryConditionForm(boundaryConditionList : BoundaryCondition[]) {
    let ReraiseOverride: boolean = false;
    let ReraisePeriodTime: NgbTimeStruct;

    let missingUpdate: NgbTimeStruct;
    
    let minimumSpeed : any;
    let maximumSpeed : any;

    if(boundaryConditionList.length != 0 )
    {
      if(!boundaryConditionList[0].ReraiseOverride){
        ReraiseOverride = true;
        this.showReraise = true;
      }
      else{
        this.showReraise = false;
      }
      
      minimumSpeed = boundaryConditionList[0].MinSpeed != null ? (Number(boundaryConditionList[0].MinSpeed).toFixed(2)).toString() : '00.00';
      maximumSpeed = boundaryConditionList[0].MaxSpeed != null ? (Number(boundaryConditionList[0].MaxSpeed).toFixed(2)).toString() : '00.00';
      
      if(boundaryConditionList[0].AckReraisePeriod != null && JSON.parse(boundaryConditionList[0].AckReraisePeriod)  == true)
      {
        this.isAutoResetChecked = true;
      }
      else
      {
        this.isAutoResetChecked = false;
      }
    }
    else
    {
      ReraiseOverride = true;
    }
    
    if(boundaryConditionList.length != 0 && boundaryConditionList[0].ReraisePeriod.replace(/\s/g, "") != '')
    {
      let timeSplit: string[] = boundaryConditionList[0].ReraisePeriod.replace(/\s/g, "").split(':');
      ReraisePeriodTime = { hour: parseInt(timeSplit[0]), 
        minute: parseInt(timeSplit[1]), second: parseInt(timeSplit[2]) };        
    }
    else{
      ReraisePeriodTime = null; 
    }

    if(boundaryConditionList.length != 0 && boundaryConditionList[0].MissingUpdateTime.replace(/\s/g, "") != '' && boundaryConditionList[0].MissingUpdateTime.replace(/\s/g, "") != '00:00:00')
    {
      let timeSplit: string[] = boundaryConditionList[0].MissingUpdateTime.replace(/\s/g, "").split(':');
      missingUpdate = { hour: parseInt(timeSplit[0]), 
        minute: parseInt(timeSplit[1]), second: parseInt(timeSplit[2]) };        
    }
    else{
      missingUpdate = null; 
    }

    this.boundaryConditionForm = this.formBuilder.group({
        bcName: [boundaryConditionList.length != 0 ? boundaryConditionList[0].Name : '', [Validators.required, Validators.maxLength(200)]],
        Description:[boundaryConditionList.length != 0 ? boundaryConditionList[0].Description : '',Validators.maxLength(400)],        
        chkReraisePeriod:[ReraiseOverride],
        groupId:[boundaryConditionList.length != 0 ? this.getGroupName(boundaryConditionList[0].GroupName) : '',Validators.required],
        thresholdTypes:[boundaryConditionList.length != 0 ? this.getThreshold(boundaryConditionList[0].ThresholdType) : '',Validators.required],
        eventType:[boundaryConditionList.length != 0 ? boundaryConditionList[0].EventType : '',Validators.required],
        severities:[boundaryConditionList.length != 0 ? boundaryConditionList[0].Severity : '',Validators.required],        
        minSpeed: [minimumSpeed],
        maxSpeed:[maximumSpeed],
        missingUpdateTime:[missingUpdate],
        priorityValue:[boundaryConditionList.length != 0 ? boundaryConditionList[0].Priority : ''],
        talkGroup:[boundaryConditionList.length != 0 ? boundaryConditionList[0].TalkgroupId : ''],
        messageTemplate: [boundaryConditionList.length != 0 ? boundaryConditionList[0].Message : '', Validators.maxLength(200)],
        testType: [(boundaryConditionList.length != 0 && boundaryConditionList[0].SpeedTestType.length !=0 )? this.getSpeedTest(boundaryConditionList[0].SpeedTestType): ''],
        chkAutoReset:[this.isAutoResetChecked],        
        reraisePeriod :[ReraisePeriodTime != null ? ReraisePeriodTime : ''],
        validFrom:[boundaryConditionList.length != 0 ? this.ConvertDate(boundaryConditionList[0].ValidFrom): ''],
        validTo:[boundaryConditionList.length != 0 ? this.ConvertDate(boundaryConditionList[0].ValidTo): '']       
    });     
  }

  isEnable():void{
    this.boundaryConditionForm.get('chkReraisePeriod').valueChanges.subscribe((value) => {
      value == true ? this.showReraise = true : this.showReraise = false
      if (value == true){
        this.isAutoResetChecked = false;
      }
    });
  }  

  save(): void{
    this.formResetting = false;
    this.boundaryConditionForm.updateValueAndValidity();

    if (this.boundaryConditionForm.invalid) {
        return;
    }

    if(this.id === null)
    {
        this.addBoundaryCondition();
    }
    else
    {
        this.updateBoundaryCondition();
    }

  }

  getGroupName(groupName : string) : string{
    const group = _.filter(this.groups, item => item.Id === Number(groupName));

    if (group.length > 0) {
        return group[0].Name;
    }
    return null;
  }

  getGroupId(groupName : string) : string{
    const group = _.filter(this.groups, item => item.Name === groupName);

    if (group.length > 0) {
        return group[0].Id;
    }
    return null;
  }

  getThreshold(thresholdId : string) : string{
    const thresholdName = _.filter(this.threshold, item => item.Id === Number(thresholdId));

    if (thresholdName.length > 0) {
        return thresholdName[0].Name;
    }
    return null;
  }

  getThresholdId(thresholdId : string) : string{
    const thresholdName = _.filter(this.threshold, item => item.Name === thresholdId);

    if (thresholdName.length > 0) {
        return thresholdName[0].Id;
    }
    return thresholdId;
  }

  addBoundaryCondition(): void{ 
    let fromdate: any =    new Date(this.boundaryConditionForm.value.validFrom.year,
      this.boundaryConditionForm.value.validFrom.month-1,
      this.boundaryConditionForm.value.validFrom.day + 1);

    let todate:any = new Date(this.boundaryConditionForm.value.validTo.year,
      this.boundaryConditionForm.value.validTo.month-1,
      this.boundaryConditionForm.value.validTo.day+1);
   
    
    if(fromdate!= null &&todate != null){
      if(fromdate > todate)
      {
        this.toastService.error("Please ensure that the ValidTo Date is greater than or equal to the ValidFrom Date", undefined, { autoDismiss: 50000, closeButton: true });
        return;
      }
    }

    let bc : BoundaryCondition = {
      Name : this.boundaryConditionForm.get('bcName').value,
      Description : this.boundaryConditionForm.get('Description').value,
      GroupName : this.boundaryConditionForm.get('groupId').value,
      ThresholdType : this.boundaryConditionForm.get('thresholdTypes').value,
      EventType : this.boundaryConditionForm.get('eventType').value,
      Severity : this.boundaryConditionForm.get('severities').value,
      ReraisePeriod : this.boundaryConditionForm.get('chkReraisePeriod').value == true ? this.convertSeconds(this.boundaryConditionForm.get('reraisePeriod').value) : "0",
      ReraiseOverride : this.boundaryConditionForm.get('chkReraisePeriod').value == true ? 'false' : 'true',
      ValidFrom : (Object.prototype.toString.call(fromdate) == "[object Date]" && this.boundaryConditionForm.value.validFrom != "") ? fromdate.toISOString() : null,
      ValidTo : (Object.prototype.toString.call(todate) == "[object Date]" && this.boundaryConditionForm.value.validTo != "") ? todate.toISOString(): null,
      MinSpeed: this.boundaryConditionForm.get('minSpeed').value,
      MaxSpeed:this.boundaryConditionForm.get('maxSpeed').value,
      MissingUpdateTime:(this.boundaryConditionForm.get('missingUpdateTime').value != "") ? this.convertSeconds(this.boundaryConditionForm.get('missingUpdateTime').value): "0",
      Priority:this.boundaryConditionForm.get('priorityValue').value,
      TalkgroupId:this.boundaryConditionForm.get('talkGroup').value,
      Message: this.boundaryConditionForm.get('messageTemplate').value,
      SpeedTestType: this.boundaryConditionForm.get('testType').value,
      AckReraisePeriod: this.boundaryConditionForm.get('chkAutoReset').value == true ? 'true' : 'false',
    };   

    if(Number(bc.ThresholdType) == 8)
    {
      if(bc.Priority === "0" ){
        this.toastService.error("Kindly provide the valid priority Id", undefined, { autoDismiss: 5000, closeButton: true });
      }
      else if(bc.TalkgroupId === "0") {
        this.toastService.error("Kindly provide the valid Talkgroup Id", undefined, { autoDismiss: 5000, closeButton: true });
      }
      else
      {
        this.boundaryConditionService.addBoundaryConditions(bc).subscribe(
          response =>{
              if (response > 0) {
                this.toastService.success("Boundary Condition Added Successfully", undefined, { autoDismiss: 5000, closeButton: true });
                this.router.navigate(['/boundary-conditions']);            
              } else if (response === 0) {
                  this.toastService.error("Unexpected Error encountered while adding Boundary Condition", undefined, { autoDismiss: 5000, closeButton: true });
              }
              else if(response === -1){
                this.toastService.error("Boundary Condition with same name already exists", undefined, { autoDismiss: 5000, closeButton: true });
              }
          }, () => {
            this.toastService.error("Unexpected Error encountered while adding Boundary Condition", undefined, { autoDismiss: 5000, closeButton: true });        
          }
        );
      }
    }
    else{
      this.boundaryConditionService.addBoundaryConditions(bc).subscribe(
        response =>{
            if (response > 0) {
              this.toastService.success("Boundary Condition Added Successfully", undefined, { autoDismiss: 5000, closeButton: true });
              this.router.navigate(['/boundary-conditions']);            
            } else if (response === 0) {
                this.toastService.error("Unexpected Error encountered while adding Boundary Condition", undefined, { autoDismiss: 5000, closeButton: true });
            }
            else if(response === -1){
              this.toastService.error("Boundary Condition with same name already exists", undefined, { autoDismiss: 5000, closeButton: true });
            }
        }, () => {
          this.toastService.error("Unexpected Error encountered while adding Boundary Condition", undefined, { autoDismiss: 5000, closeButton: true });        
        }
      );
    }
    
  }

  validateNumber(event) {
    const keyCode = event.keyCode;

    const excludedKeys = [8, 37, 39, 46, 190];

    if (!((keyCode >= 48 && keyCode <= 57) ||
      (keyCode >= 96 && keyCode <= 105) ||
      (excludedKeys.includes(keyCode)))) {
      event.preventDefault();
    }
  }

  onNumberValidation(enteredValue)
  {
    let regexp = new RegExp('^\d+(\.\d{1,2})?$');    
    if(enteredValue != null && regexp.test(enteredValue)){
      this.toastService.error("Kindly enter valid input format", undefined, {autoDismiss: 5000, closeButton: true }); 
    }    
  }

  onOptionSelected(valueSelected){
    let regexp = new RegExp('^[0-9]$');    
    if(valueSelected != null && regexp.test(valueSelected)){
      this.thresholdType = valueSelected; 
    }
    else
    {
      this.thresholdType = this.listBoundaryCondition.length != 0 ? Number(this.listBoundaryCondition[0].ThresholdType) : '';
    }   
  }
  
  convertSeconds(time: string): string{
    if(time !== undefined && time !== null && time !== ""){
      let timeSplit: string[] = time.toString().split(':');
      const hours: number = parseInt(timeSplit[0]);
      const minutes: number = parseInt(timeSplit[1]);
      const seconds: number = parseInt(timeSplit[2]);
      return (hours * 3600 +  minutes * 60 + seconds).toString() ;
    }
  }

  ConvertDate(date: string): NgbDate{
    if(date != ''){
      let dateSplit: string[] = date.toString().split('/');
      let setDate: NgbDate = new NgbDate( Number(dateSplit[2]), Number(dateSplit[0]), Number(dateSplit[1]));
      return setDate; 
    }
    let defaultDate : NgbDate; 
    return defaultDate;
    
  }

  convertTime(totalMinutes: string) : NgbTimeStruct{
    let minutes = Number(totalMinutes)%60;
    let hours = Number(totalMinutes)/60; 
    
    let timeString : NgbTimeStruct = { hour: Math.floor(hours), minute: Math.floor(minutes), second: 0 };      
    return timeString;
}

  convertSpeedTest(speed: string){
    let regexp = new RegExp('^[0-9][0-9]*$');
    if(!regexp.test(speed)){
      const testType = _.filter(this.speedTest, item => item.type === speed);
      if (testType.length > 0) {
        return testType[0].value;
    }
      return this.speedTest[speed];
    }
    else
        return speed;    
  }

  getSpeedTest(speed: string){
    let regexp = new RegExp('^[0-9][0-9]*$');
    if(!regexp.test(speed)){
      const testType = _.filter(this.speedTest, item => item.type === speed);
      if (testType.length > 0) {
        return testType[0].value;
    }
      return this.speedTest[speed];
    }
    else{
      if(this.id !=null)
      {
        const testType = _.filter(this.speedTest, item => item.value === Number(speed));
        if (testType.length > 0) {
          return testType[0].type;
        }        
      }
      else
        return speed;
    }
  }
  

  updateBoundaryCondition(): void{

    this.formResetting = false;
    this.boundaryConditionForm.updateValueAndValidity();

    if (this.boundaryConditionForm.invalid) {
      this.toastService.error("Since no changes in form boundary condition is not updated", undefined, { autoDismiss: 5000, closeButton: true });
    }

    let fromdate :any;
    let todate :any

    let validFromdate :any;
    let validTodate :any


    if(this.boundaryConditionForm.value.validFrom != null){
    fromdate   =    new Date(
      this.boundaryConditionForm.value.validFrom != null ? this.boundaryConditionForm.value.validFrom.year : null,
      this.boundaryConditionForm.value.validFrom != null ? this.boundaryConditionForm.value.validFrom.month-1 :null,
      this.boundaryConditionForm.value.validFrom != null ? this.boundaryConditionForm.value.validFrom.day + 1: null);

        validFromdate = (Object.prototype.toString.call(fromdate) !== "[object Date]" || fromdate !='' || fromdate !=null) ? fromdate.toISOString() : null;
    }
    else{
      validFromdate = null;
    }

    if(this.boundaryConditionForm.value.validTo != null){
    todate  = new Date(this.boundaryConditionForm.value.validTo != null ? this.boundaryConditionForm.value.validTo.year : null,
      this.boundaryConditionForm.value.validTo != null ? this.boundaryConditionForm.value.validTo.month-1 : null,
      this.boundaryConditionForm.value.validTo != null ? this.boundaryConditionForm.value.validTo.day + 1: null);

      validTodate = (Object.prototype.toString.call(todate) !== "[object Date]" || todate != ''|| todate !=null) ? todate.toISOString(): null;
    }
    else{      
      validTodate = null;
    }

    if(fromdate!= null &&todate != null){
      if(fromdate > todate)
      {
        this.toastService.error("Please ensure that the ValidTo Date is greater than or equal to the ValidFrom Date", undefined, { autoDismiss: 50000, closeButton: true });
        return;
      }
    }

    let testSpeed = this.boundaryConditionForm.get('testType').value != null ? this.convertSpeedTest(this.boundaryConditionForm.get('testType').value) : "";
    let bc : BoundaryCondition = {
      Id : this.id,
      Name : this.boundaryConditionForm.get('bcName').value,
      Description : this.boundaryConditionForm.get('Description').value,
      GroupName : this.getGroupId(this.boundaryConditionForm.get('groupId').value),
      ThresholdType : this.getThresholdId(this.boundaryConditionForm.get('thresholdTypes').value),
      EventType : this.boundaryConditionForm.get('eventType').value,
      Severity : this.boundaryConditionForm.get('severities').value,
      ReraisePeriod : (this.boundaryConditionForm.get('reraisePeriod').value != "" && this.boundaryConditionForm.get('chkReraisePeriod').value == true ) ? this.convertSeconds(this.boundaryConditionForm.get('reraisePeriod').value): "0",
      ReraiseOverride : this.boundaryConditionForm.get('chkReraisePeriod').value == true ? 'false' : 'true',
      ValidFrom : validFromdate,
      ValidTo : validTodate,
      MinSpeed: this.boundaryConditionForm.get('minSpeed').value,
      MaxSpeed:this.boundaryConditionForm.get('maxSpeed').value,
      MissingUpdateTime: (this.boundaryConditionForm.get('missingUpdateTime').value != undefined && this.boundaryConditionForm.get('missingUpdateTime').value != "") ? this.convertSeconds(this.boundaryConditionForm.get('missingUpdateTime').value):"0",
      Priority:(this.boundaryConditionForm.get('priorityValue').value != null && this.boundaryConditionForm.get('priorityValue').value != '')? this.boundaryConditionForm.get('priorityValue').value : "0",
      TalkgroupId:(this.boundaryConditionForm.get('talkGroup').value != null && this.boundaryConditionForm.get('talkGroup').value != '')  ? this.boundaryConditionForm.get('talkGroup').value : "0",
      Message: this.boundaryConditionForm.get('messageTemplate').value != null ? this.boundaryConditionForm.get('messageTemplate').value: "",
      SpeedTestType: testSpeed,
      AckReraisePeriod: this.boundaryConditionForm.get('chkAutoReset').value == true ? 'true' : 'false'
    };

    if(bc.SpeedTestType == undefined || bc.SpeedTestType == "")
      bc.SpeedTestType = '0';

    if(Number(bc.ThresholdType) === 8)
    {
      if(bc.Priority === "0" ){
        this.toastService.error("Kindly provide the valid priority Id", undefined, { autoDismiss: 10000, closeButton: true });
      }
      else if(bc.TalkgroupId === "0") {
        this.toastService.error("Kindly provide the valid Talkgroup Id", undefined, { autoDismiss: 10000, closeButton: true });
      }
      else
      {
        this.boundaryConditionService.updateBoundaryConditions(bc).subscribe(
          response =>{
              if (response > 0) {
                this.toastService.success("Boundary Condition Updated Successfully", undefined, { autoDismiss: 5000, closeButton: true });
                this.router.navigate(['/boundary-conditions']);            
              } else if (response === 0) {
                  this.toastService.success("Boundary Condition Updated Successfully", undefined, { autoDismiss: 5000, closeButton: true });
                  this.router.navigate(['/boundary-conditions']); 
              }
              else if(response === -2){
                this.toastService.error("Unexpected Error encountered while updating Boundary Condition", undefined, { autoDismiss: 5000, closeButton: true });
              }
          }, () => {
            this.toastService.error("Unexpected Error encountered while updating Boundary Condition", undefined, { autoDismiss: 5000, closeButton: true });        
          }
        );
      }
    }
    else{
        this.boundaryConditionService.updateBoundaryConditions(bc).subscribe(
        response =>{
            if (response > 0) {
              this.toastService.success("Boundary Condition Updated Successfully", undefined, { autoDismiss: 5000, closeButton: true });
              this.router.navigate(['/boundary-conditions']);            
            } else if (response === 0) {
              this.toastService.success("Boundary Condition Updated Successfully", undefined, { autoDismiss: 5000, closeButton: true });
              this.router.navigate(['/boundary-conditions']); 
            }
            else if(response === -2){
              this.toastService.error("Unexpected Error encountered while updating Boundary Condition", undefined, { autoDismiss: 5000, closeButton: true });
            }
        }, () => {
          this.toastService.error("Unexpected Error encountered while updating Boundary Condition", undefined, { autoDismiss: 5000, closeButton: true });        
        }
      )
    }
  }
}