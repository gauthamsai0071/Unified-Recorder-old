import { Component, OnInit, Testability } from '@angular/core';
import { EventTypeService } from "../../services/event-type/event-type.service";
import { ConfirmationDialogService } from '../../_common/confirmation-dialog/confirmation-dialog.service';
import { DOMParser } from 'xmldom';
import { ToastService } from "@msi/cobalt";
import { EventType } from '../../models/event-type/event-type-list';
import { Router } from '@angular/router';

@Component({
  templateUrl: './event-type-list.component.html',
  styleUrls: ['./event-type-list.component.scss']
})
export class EventTypeListComponent implements OnInit {       
    showProgress: boolean;
    eventTypeList: EventType[] = [];
    rowCount: number;
    PageSize: number = 10;
    PageNumber: number = 1;

  constructor(    
    private toastService: ToastService,
    private eventTypeService: EventTypeService,
    private confirmationDialogService: ConfirmationDialogService,
    public router: Router ) { 
      this.showProgress = true;     
    }

  ngOnInit(): void {
      this.getEventTypeList();
  }

  getEventTypeList(): void {
    this.eventTypeList = [];
    this.eventTypeService.getEventTypeList().subscribe(
      response =>   {          
        const xmlResponse = new DOMParser().parseFromString(response); 
        const result = xmlResponse.getElementsByTagName("getEventTypesResult")[0];
        for (let k = 0; k < result.childNodes.length; k++) {
          let item = result.childNodes[k];
          this.eventTypeList.push({  
            Id: item.childNodes[0].firstChild.nodeValue,  
            Name: item.childNodes[1].firstChild.nodeValue,  
            GroupName: item.childNodes[2].firstChild.nodeValue
          });              
        }
        this.rowCount = this.eventTypeList != null ?  this.eventTypeList.length : 0;
        this.showProgress = false;       
      }, 
      error => {
        console.log(error),
        this.showProgress = false;
    });
  }   

  removeEventType(Id: number): void  {
    this.showProgress = true;

    this.confirmationDialogService.confirmDialog("Confirmation",
    "Do you want to delete selected event type", "Confirm", "Dismiss").subscribe(
      response => { 
        if(response)
        {
          this.eventTypeService.removeEventType(Id.toString()).subscribe(
            response => {
                const xmlResponse = new DOMParser().parseFromString(response);                 
                const result = (xmlResponse.getElementsByTagName("removeEventTypeResponse")[0]).firstChild.firstChild.nodeValue.toString().toLowerCase();
                this.showProgress = false;
                if (result === "ok") {
                    this.toastService.success("Event Type Removed Successfully", undefined, { autoDismiss: 5000, closeButton: true });
                    this.getEventTypeList();
                } else if (result === "objectwiththisnameexists") {
                    this.toastService.error("Event Type cannot be removed", undefined, {autoDismiss: 5000, closeButton: true });
                }
            }, (error) => {
                this.toastService.error("Unexpected Error encountered while adding Event Type", undefined, {autoDismiss: 5000, closeButton: true });
                this.showProgress = false;
            }
          );
        }
        else
        {
          this.getEventTypeList();
          this.showProgress = false;
        }
    });
  }

  getPage(event){
    this.PageNumber =   event;
  }
}
