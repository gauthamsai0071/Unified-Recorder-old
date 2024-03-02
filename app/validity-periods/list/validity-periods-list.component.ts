import { Component, OnInit, Testability } from '@angular/core';
import { ValidityPeriodService } from '../../services/boundary-service/validity-period.service';
import { ConfirmationDialogService } from '../../_common/confirmation-dialog/confirmation-dialog.service';
import { DOMParser } from 'xmldom';
import { ToastService } from "@msi/cobalt";
import { Router } from '@angular/router';
import { GroupService } from "../../services/group/group.service";
import { Group } from '../../models/group/group';
import { ValidityPeriods } from '../../models/validity-period/validity-period-list'
import { forkJoin } from "rxjs";
import * as _ from 'lodash';

@Component({
  templateUrl: './validity-periods-list.component.html',
  styleUrls: ['./validity-periods-list.component.scss']
})
export class ValidityPeriodsListComponent implements OnInit {
  showProgress: boolean;
  groups: Group[] = [];
  validityPeriodList: ValidityPeriods[] = [];
  rowCount: number;
  PageSize: number = 10;
  PageNumber: number = 1;

  constructor(private toastService: ToastService,
    private validityPeriodService: ValidityPeriodService,    
    private confirmationDialogService: ConfirmationDialogService,
    private groupService: GroupService,
    public router: Router) { }

  ngOnInit(): void {
    this.showProgress = true;
    forkJoin(
      this.groupService.getGroups(),
      this.validityPeriodService.getValidityPeriods()).subscribe(response =>
        {
          this.groups = response[0];
          this.getValidityPeriods(response[1]);
          this.showProgress = false;
        }); 
  }

  getValidityPeriods(response: string): void{
    const xmlResponse = new DOMParser().parseFromString(response); 
    const result = xmlResponse.getElementsByTagName("GetValidityPeriodsResult")[0];
    if(result != undefined){
      for (let k = 0; k < result.childNodes.length; k++) {
        let item = result.childNodes[k];
        this.validityPeriodList.push({  
            
          Name: item.childNodes[0].firstChild.nodeValue,
          ValidFrom: this.convertTime(item.childNodes[1].firstChild.nodeValue),  
          ValidTo: this.convertTime(item.childNodes[2].firstChild.nodeValue),
          Monday:item.childNodes[3].firstChild.nodeValue,
          Tuesday:item.childNodes[4].firstChild.nodeValue,
          Wednesday:item.childNodes[5].firstChild.nodeValue,
          Thursday:item.childNodes[6].firstChild.nodeValue,
          Friday:item.childNodes[7].firstChild.nodeValue,
          Description:item.childNodes[8].childNodes.length != 0 ? item.childNodes[8].firstChild.nodeValue:'' ,         
          Saturday:item.childNodes[9].firstChild.nodeValue,
          Sunday:item.childNodes[10].firstChild.nodeValue,          
          Id: item.childNodes[11].firstChild.nodeValue,
          GroupId: item.childNodes[12].firstChild.nodeValue,
          GroupName: this.getGroupName(item.childNodes[12].firstChild.nodeValue)
          
        });              
      }
      this.rowCount = this.validityPeriodList != null ?  this.validityPeriodList.length : 0;
    }
  }

  getGroupName(groupName : string) : string{
    const group = _.filter(this.groups, item => item.Id === Number(groupName));

    if (group.length > 0) {
        return group[0].Name;
    }
    return null;
  }

  convertTime(totalMinutes: string) : string{
      let minutes = Number(totalMinutes)%60;
      let hours = Number(totalMinutes)/60; 
      
      return Math.floor(hours) + ":" + Math.floor(minutes);
  }

  getValidityPeriodsList(){
    this.validityPeriodService.getValidityPeriods().subscribe(response =>
      {  
        if(response != null) {
          this.validityPeriodList = [];
          this.getValidityPeriods(response);
        }     
          
      });
  }

  removeValidityPeriods(Id: number): void  {
    this.showProgress = true;

    this.confirmationDialogService.confirmDialog("Confirmation",
    "Do you want to delete selected validity period", "Confirm", "Dismiss").subscribe(
      response => { 
        if(response)
        {
          this.validityPeriodService.removeValidityPeriod(Id.toString()).subscribe(
            response => {                
                this.showProgress = false;
                if (response) {
                    this.toastService.success("Validity period removed successfully", undefined, { autoDismiss: 5000, closeButton: true });
                    this.getValidityPeriodsList();
                } else if (!response) {
                    this.toastService.error("Unexpected Error encountered while removing validity period", undefined, { autoDismiss: 5000, closeButton: true });
                }
            }, () => {
                this.toastService.error("Unexpected Error encountered while removing validity period", undefined, { autoDismiss: 5000, closeButton: true });
                this.showProgress = false;
            }
          );
        }
        else
        {
          this.getValidityPeriodsList();
          this.showProgress = false;
        }
    });
  }

  getPage(event){
    this.PageNumber =   event;
  }

}
