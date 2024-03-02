import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { EventTypeService } from "../../services/event-type/event-type.service";
import { ServerityService } from "../../services/severity/severity.service";
import { ConfirmationDialogService } from '../../_common/confirmation-dialog/confirmation-dialog.service';
import { DOMParser } from 'xmldom';
import { ToastService } from "@msi/cobalt";
import { forkJoin } from "rxjs";
import { EventType } from "../../models/event-type/event-type-list";
import * as _ from 'lodash';

@Component({  
  templateUrl: './severity-level.component.html',
  styleUrls: ['./severity-level.component.scss']
})
export class SeverityLevelComponent implements OnInit {
  showProgress: boolean;
  severityList: EventType[] = [];
  rowCount: number;
  PageSize: number = 10;
  PageNumber: number = 1;

  constructor(private toastService: ToastService,    
    private serverityService: ServerityService,
    private confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit(): void {
    this.getSeverityLevels();
  }


  private getSeverityLevels(): void {
    this.serverityService.getSeverityLevels().subscribe(
      response =>   {          
        const xmlResponse = new DOMParser().parseFromString(response); 
        const result = xmlResponse.getElementsByTagName("getSeverityLevelsResult")[0];
        this.severityList = [];
        for (let k = 0; k < result.childNodes.length; k++) {
          let item = result.childNodes[k];
          this.severityList.push({  
            Id: item.childNodes[0].firstChild.nodeValue,  
            Name: item.childNodes[1].firstChild.nodeValue,  
            GroupName: item.childNodes[2].firstChild.nodeValue
          });              
        }
        this.rowCount = this.severityList != null ?  this.severityList.length : 0;
        this.showProgress = false;       
      }, 
      error => {
        console.log(error),
        this.showProgress = false;
    });
  }

  removeSeverityLevel(Id: number): void  {
    this.showProgress = true;

    this.confirmationDialogService.confirmDialog("Confirmation",
    "Do you want to delete selected severity", "Confirm", "Dismiss").subscribe(
      response => { 
        if(response)
        {
          this.serverityService.removeSeverity(Id.toString()).subscribe(
            response => {
                const xmlResponse = new DOMParser().parseFromString(response);                 
                const result = (xmlResponse.getElementsByTagName("removeSeverityResponse")[0]).firstChild.firstChild.nodeValue.toString().toLowerCase();
                this.showProgress = false;
                if (result === "ok") {
                    this.toastService.success("Severity Removed Successfully", undefined, { autoDismiss: 5000, closeButton: true });
                    this.getSeverityLevels();
                } else if (result === "objectwiththisnameexists") {
                    this.toastService.error("Unexpected Error encountered while removing Severity", undefined, { autoDismiss: 5000, closeButton: true });
                }
            }, (error) => {
                this.toastService.error("Unexpected Error encountered while removing Severity", undefined, {autoDismiss: 5000, closeButton: true });
                this.showProgress = false;
            }
          );
        }
        else
        {
          this.getSeverityLevels();
          this.showProgress = false;
        }
    });
  }

  getPage(event){
    this.PageNumber =   event;
  }

}
