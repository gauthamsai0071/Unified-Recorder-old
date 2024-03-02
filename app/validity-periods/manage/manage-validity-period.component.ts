import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { DOMParser } from 'xmldom';
import { ToastService } from "@msi/cobalt";
import { GroupService } from "../../services/group/group.service";
import { Group } from '../../models/group/group';
import { ValidityPeriodService } from '../../services/boundary-service/validity-period.service';
import { ConfirmationDialogService } from '../../_common/confirmation-dialog/confirmation-dialog.service';
import { ValidityPeriods } from '../../models/validity-period/validity-period-list';
import { ActivatedRoute,Router } from '@angular/router';
import * as _ from 'lodash';
import { forkJoin } from "rxjs";
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-manage-validity-period',
  templateUrl: './manage-validity-period.component.html',
  styleUrls: ['./manage-validity-period.component.scss']
})
export class ManageValidityPeriodComponent implements OnInit {
  showProgress: boolean;
  groups: Group[] = [];
  validityPeriodList: ValidityPeriods[] = [];
  formResetting: boolean = true;  
  validityPeriodForm: FormGroup = null;
  id?: number = null;
  ValidFromTime: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  ValidToTime: NgbTimeStruct = { hour: 23, minute: 59, second: 0 };

  get form() { return this.validityPeriodForm.controls; }

  constructor(private formBuilder: FormBuilder,
    private toastService: ToastService,
    private validityPeriodService: ValidityPeriodService,    
    private confirmationDialogService: ConfirmationDialogService,
    private groupService: GroupService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private changeDetectorRef: ChangeDetectorRef) { 
      if (this.activatedRoute.snapshot.params.id) {
        this.id = Number(this.activatedRoute.snapshot.params.id);
      }
    }

  ngOnInit(): void {
    this.showProgress = true;
    this.formResetting = true; 
    this.validityPeriodForm = null;
    this.changeDetectorRef.detectChanges();

    let validityPeriod: ValidityPeriods = null;

    if (this.id !== null){
      forkJoin(
        this.groupService.getGroups(),
        this.validityPeriodService.getValidityPeriods()).subscribe(response =>
          {
            this.groups = response[0];
            validityPeriod = this.getValidityPeriods(response[1]);

            this.buildvalidityPeriodForm(validityPeriod);
            this.showProgress = false;
          }); 
      }
      else{
        this.groupService.getGroups().subscribe(response => {
          this.groups = response;
          validityPeriod = null;
          this.buildvalidityPeriodForm(validityPeriod);
          this.showProgress = false;
        });
      }

      
  }

  ngAfterViewChecked(){
    this.changeDetectorRef.detectChanges();
  }
    
  private getValidityPeriods(response: string): ValidityPeriods {
    const xmlResponse = new DOMParser().parseFromString(response); 
    const result = xmlResponse.getElementsByTagName("GetValidityPeriodsResult")[0];

    let validityPeriod = null;
    for(let index=0; index<result.childNodes.length; index++) {
        if (Number(result.childNodes[index].childNodes[11].firstChild.nodeValue) === this.id) {                
            validityPeriod = new ValidityPeriods();
            validityPeriod.Id = this.id;
            validityPeriod.Name= result.childNodes[index].childNodes[0].firstChild.nodeValue,
            validityPeriod.ValidFrom= result.childNodes[index].childNodes[1].firstChild.nodeValue,  
            validityPeriod.ValidTo=result.childNodes[index].childNodes[2].firstChild.nodeValue,
            validityPeriod.Monday= this.convertToBoolean(result.childNodes[index].childNodes[3].firstChild.nodeValue),
            validityPeriod.Tuesday= this.convertToBoolean(result.childNodes[index].childNodes[4].firstChild.nodeValue),
            validityPeriod.Wednesday= this.convertToBoolean(result.childNodes[index].childNodes[5].firstChild.nodeValue),
            validityPeriod.Thursday= this.convertToBoolean(result.childNodes[index].childNodes[6].firstChild.nodeValue),
            validityPeriod.Friday= this.convertToBoolean(result.childNodes[index].childNodes[7].firstChild.nodeValue),
            validityPeriod.Description= result.childNodes[index].childNodes[8].firstChild != null ? result.childNodes[index].childNodes[8].firstChild.nodeValue : '',         
            validityPeriod.Saturday= this.convertToBoolean(result.childNodes[index].childNodes[9].firstChild.nodeValue),
            validityPeriod.Sunday= this.convertToBoolean(result.childNodes[index].childNodes[10].firstChild.nodeValue),
            validityPeriod.groupId= result.childNodes[index].childNodes[12].firstChild.nodeValue
            validityPeriod.GroupName= result.childNodes[index].childNodes[12].firstChild.nodeValue
            return validityPeriod;
        }
    }

    return null;
  }

  convertToBoolean(input: string): boolean | undefined {
    try {
        return JSON.parse(input);
    }
    catch (e) {
        return undefined;
    }
}

  convertMinutes(time: string): string{
    let timeSplit: string[] = time.toString().split(':');
    const hours: number = parseInt(timeSplit[0]);
    const minutes: number = parseInt(timeSplit[1]);
    return (hours * 60 +  minutes).toString() ;
  }
    

  convertTime(totalMinutes: string) : NgbTimeStruct{
      let minutes = Number(totalMinutes)%60;
      let hours = Number(totalMinutes)/60; 
      
      let timeString : NgbTimeStruct = { hour: Math.floor(hours), minute: Math.floor(minutes), second: 0 };      
      return timeString;
  }

  private buildvalidityPeriodForm(validityPeriod: ValidityPeriods) { 
    let fromTime: NgbTimeStruct;
    let toTime: NgbTimeStruct;

    if(validityPeriod != null){
    fromTime = { hour: this.convertTime(validityPeriod.ValidFrom).hour, 
      minute: this.convertTime(validityPeriod.ValidFrom).minute, second: this.convertTime(validityPeriod.ValidFrom).second };
    toTime = { hour: this.convertTime(validityPeriod.ValidTo).hour, 
      minute: this.convertTime(validityPeriod.ValidTo).minute, second: this.convertTime(validityPeriod.ValidTo).second }
    }
    else
    {
      fromTime = { hour: 0, 
        minute: 0, second: 0 };
      toTime = { hour: 23, 
        minute: 59, second: 0 };
    }




    this.validityPeriodForm = this.formBuilder.group({
      vpName: [validityPeriod  != null ? validityPeriod.Name : '', Validators.required],
      Description:[validityPeriod != null? validityPeriod.Description : ''],   
      groupId:[validityPeriod != null ? this.getGroupName(validityPeriod.GroupName) : '',Validators.required],
      chkMon:[validityPeriod != null ? validityPeriod.Monday : false],
      chkTue:[validityPeriod != null ? validityPeriod.Tuesday : false],
      chkWed:[validityPeriod != null ? validityPeriod.Wednesday : false],        
      chkThu: [validityPeriod != null ? validityPeriod.Thursday : false],
      chkFri:[validityPeriod != null ? validityPeriod.Friday : false],
      chkSat:[validityPeriod != null ? validityPeriod.Saturday : false],
      chkSun:[validityPeriod != null ? validityPeriod.Sunday : false],        
      validFrom:[fromTime],
      validTo:[toTime]       
    });   
  }

  getGroupName(groupName : string) : string{
    const group = _.filter(this.groups, item => item.Id === Number(groupName));

    if (group.length > 0) {
        return group[0].Name;
    }
    return null;
  }

  getGroupId(groupName : string) : number{
    const group = _.filter(this.groups, item => item.Name === groupName);

    if (group.length > 0) {
        return group[0].Id;
    }
    
    return Number(groupName);
  }

  save(): void{
    this.formResetting = false;
    this.validityPeriodForm.updateValueAndValidity();

    if (this.validityPeriodForm.invalid) {
        return;
    }

    if(this.id === null)
    {
        this.addValidityPeriod();
    }
    else
    {
        this.updateValidityPeriod();
    }

  }

  updateValidityPeriod(): void{
    this.formResetting = false;
    this.validityPeriodForm.updateValueAndValidity();

    if (this.validityPeriodForm.invalid) {
      this.toastService.error("Since no changes in form boundary condition cannot be updated", undefined, { autoDismiss: 5000, closeButton: true });
    }

    let vp : ValidityPeriods = {
      Name : this.validityPeriodForm.get('vpName').value,
      Description : this.validityPeriodForm.get('Description').value,
      GroupId : this.getGroupId(this.validityPeriodForm.get('groupId').value),
      Monday : this.validityPeriodForm.get('chkMon').value,
      Tuesday : this.validityPeriodForm.get('chkTue').value,
      Wednesday : this.validityPeriodForm.get('chkWed').value,
      Thursday : this.validityPeriodForm.get('chkThu').value,
      Friday : this.validityPeriodForm.get('chkFri').value,      
      Saturday: this.validityPeriodForm.get('chkSat').value,
      Sunday:this.validityPeriodForm.get('chkSun').value,
      ValidFrom : this.convertMinutes(this.validityPeriodForm.get('validFrom').value),
      ValidTo : this.convertMinutes(this.validityPeriodForm.get('validTo').value),
      Id : this.id      
    };

    this.validityPeriodService.updateValidityPeriod(vp).subscribe(
      response =>{
        if (response > 0) {
          this.toastService.success("Validity period updated successfully", undefined, { autoDismiss: 5000, closeButton: true });
          this.router.navigate(['/validity-periods']);            
        } else if (response === -1) {
            this.toastService.error("Unexpected Error encountered while adding validity period", undefined, { autoDismiss: 5000, closeButton: true });
        }
        else if (response === 0) {
          this.toastService.success("Validity period updated successfully", undefined, { autoDismiss: 5000, closeButton: true });
          this.router.navigate(['/validity-periods']); 
      }
    }, () => {
      this.toastService.error("Unexpected Error encountered while adding validity period", undefined, {autoDismiss: 5000, closeButton: true });        
    });
  }

  addValidityPeriod(): void{    
    let vp : ValidityPeriods = {
      Name : this.validityPeriodForm.get('vpName').value,
      Description : this.validityPeriodForm.get('Description').value,
      GroupId : this.validityPeriodForm.get('groupId').value,
      Monday : this.validityPeriodForm.get('chkMon').value,
      Tuesday : this.validityPeriodForm.get('chkTue').value,
      Wednesday : this.validityPeriodForm.get('chkWed').value,
      Thursday : this.validityPeriodForm.get('chkThu').value,
      Friday : this.validityPeriodForm.get('chkFri').value,      
      Saturday: this.validityPeriodForm.get('chkSat').value,
      Sunday:this.validityPeriodForm.get('chkSun').value,
      ValidFrom : this.convertMinutes(this.validityPeriodForm.get('validFrom').value),
      ValidTo : this.convertMinutes(this.validityPeriodForm.get('validTo').value),
      Id: this.id      
    };

    this.validityPeriodService.addValidityPeriod(vp).subscribe(
      response =>{
        if (response > 0) {
          this.toastService.success("Validity period added successfully", undefined, { autoDismiss: 5000, closeButton: true });
          this.router.navigate(['/validity-periods']);            
        } 
        else if (response === -1) {
          this.toastService.error("Unexpected error encountered while updating validity period", undefined, {autoDismiss: 5000, closeButton: true });
      }
    }, () => {
      this.toastService.error("Unexpected error encountered while updating validity period", undefined, { autoDismiss: 5000, closeButton: true });        
    });
  }
}
