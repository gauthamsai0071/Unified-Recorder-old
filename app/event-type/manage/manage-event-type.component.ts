import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { EventTypeService } from "../../services/event-type/event-type.service";
import { GroupService } from "../../services/group/group.service";
import { DOMParser } from 'xmldom';
import { ToastService } from "@msi/cobalt";
import { Group } from '../../models/group/group';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from "rxjs";
import { EventType } from "../../models/event-type/event-type-list";
import * as _ from 'lodash';

@Component({
    templateUrl: './manage-event-type.component.html',
    styleUrls: [ './manage-event-type.component.scss' ]
})
export class ManageEventTypeComponent implements OnInit {
    eventTypeForm: FormGroup = null;
    formResetting: boolean = true;
    showProgress: boolean; 
    
    groups: Group[] = [];
    id?: number = null;       

    get form() { return this.eventTypeForm.controls; }

    constructor(private formBuilder: FormBuilder,
                private toastService: ToastService,
                private eventTypeService: EventTypeService,
                private groupService: GroupService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private changeDetectorRef: ChangeDetectorRef) {
        this.showProgress = true;
        if (this.activatedRoute.snapshot.params.id) {
            this.id = Number(this.activatedRoute.snapshot.params.id);
        }
    }
    
    ngOnInit(): void {
        let eventType: EventType = null;

        if (this.id !== null) {
            forkJoin(
                this.eventTypeService.getEventTypeList(),
                this.eventTypeService.getEventTypeAvailableGroups(this.id.toString())
                ).subscribe(response => {
                    eventType = this.getEventType(response[0])                
                    this.setGroups(response[1])            
                    const group = _.filter(this.groups, item => item.Name.trim().toUpperCase() === eventType.GroupName.toUpperCase().trim());

                    if (group.length > 0) {
                        eventType.GroupId = group[0].Id;
                    }

                    this.buildEventTypeForm(eventType);
                    this.showProgress = false;
                    this.changeDetectorRef.detectChanges();
                }, error => {

                });
        } else {
            this.groupService.getGroups().subscribe(response => {
                this.groups = response;
                eventType = new EventType();
                this.buildEventTypeForm(eventType);
                this.showProgress = false;
            })            
        }        
    }

    save(): void {
        this.formResetting = false;
        this.eventTypeForm.updateValueAndValidity();

        if (this.eventTypeForm.invalid) {
            return;
        }

        this.showProgress = true;

        if(this.id === null)
        {
            this.addEventType();
        }
        else
        {
            this.updateEventType();
        }
              
    }

    addEventType(): void    {
        this.eventTypeService.addEventType(this.eventTypeForm.value.eventType, this.eventTypeForm.value.groupId).subscribe(
            response => {
                const xmlResponse = new DOMParser().parseFromString(response);                 
                const result = (xmlResponse.getElementsByTagName("addEventTypeResponse")[0]).firstChild.firstChild.nodeValue.toString().toLowerCase();
                this.showProgress = false;
                if (result === "ok") {
                    this.toastService.success("Event Type Added Successfully", undefined, 
                                            { autoDismiss: 60000, closeButton: true });
                    this.router.navigate(['/event-types']);
                } else if (result === "objectwiththisnameexists") {
                    this.toastService.error("Event Type with same name already exists", undefined, {autoDismiss: 5000, closeButton: true });
                }
            }, (error) => {
                this.toastService.error("Unexpected Error encountered while adding Event Type", undefined, {autoDismiss: 5000, closeButton: true });
                this.showProgress = false;
            }
        )  
    }

    updateEventType() : void  {
        this.eventTypeService.updateEventType(this.id, 
            this.eventTypeForm.value.eventType,this.eventTypeForm.value.groupId).subscribe(
            response => {
                const xmlResponse = new DOMParser().parseFromString(response);                 
                const result = (xmlResponse.getElementsByTagName("updateEventTypeResponse")[0]).firstChild.firstChild.nodeValue.toString().toLowerCase();
                this.showProgress = false;
                if (result === "ok") {
                    this.toastService.success("Event Type Updated Successfully", undefined, 
                                            { autoDismiss: 5000, closeButton: true });
                    this.changeDetectorRef.detectChanges();
                    this.router.navigate(['/event-types']);
                } else if (result === "objectwiththisnameexists") {
                    this.toastService.error("Event Type with same name already exists", undefined, {autoDismiss: 5000, closeButton: true });
                }
            }, (error) => {
                this.toastService.error("Unexpected Error encountered while adding Event Type", undefined, {autoDismiss: 5000, closeButton: true });
                this.showProgress = false;
            }
        )
    }

    private setGroups(response: string) : void {
        const xmlResponse = new DOMParser().parseFromString(response); 
        const result = xmlResponse.getElementsByTagName("getEventTypeAvailableGroupsResult")[0];

        _.each(result.childNodes, element => {
            const group = new Group();

            group.Id = element.childNodes[0].firstChild.nodeValue;
            group.Name = element.childNodes[1].firstChild.nodeValue;
            this.groups.push(group); 
        });         
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

    private buildEventTypeForm(eventType: EventType) {
        this.eventTypeForm = this.formBuilder.group({
            eventType: [eventType.Name, Validators.required],
            groupId:[eventType.GroupId, Validators.required]
        }); 
    }
}