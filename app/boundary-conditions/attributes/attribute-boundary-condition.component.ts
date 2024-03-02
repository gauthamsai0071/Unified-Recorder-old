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
import { Attributes } from '../../models/enums/attributes';
import { ActivatedRoute, Router } from '@angular/router';
import { BoundaryCondition } from '../../models/boundary-condition/boundary-condition-list';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { forkJoin } from "rxjs";
import * as _ from 'lodash';
import { AttributesData } from '../../models/boundary-condition/MappingsAttribute';

@Component({
  selector: 'app-attribute-boundary-condition',
  templateUrl: './attribute-boundary-condition.component.html',
  styleUrls: ['./attribute-boundary-condition.component.scss']
})
export class AttributeBoundaryConditionComponent implements OnInit {
  showProgress: boolean; 
  formResetting: boolean = true;
  id?: number = null;
  boundaryConditionForm: FormGroup = null;
  attributes = [];
  dropdownSettings:IDropdownSettings = {};
  selectedItem: any;
  thresholdId: string;

  groups: Group[] = [];
  severityLevels: EventType[] = [];
  eventTypes :EventType[]=[];
  attributesData : AttributesData;
  attributesDataById : AttributesData;
  attributesSelected : AttributesData;

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
      if (this.activatedRoute.snapshot.params.id) {
        this.id = Number(this.activatedRoute.snapshot.params.id);
      }
    }

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: false
    };

    this.showProgress = true;
    this.formResetting = true;
    let boundaryConditionList: BoundaryCondition[] = []; 

    if (this.id !== null){
      forkJoin(this.boundaryConditionService.getAttributes(),
        this.eventTypeService.getEventTypeList(),
        this.serverityService.getSeverityLevels(),
        this.boundaryConditionService.getBoundaryConditionsById(this.id.toString()),
        this.boundaryConditionService.getBoundaryConditionsGroup(this.id.toString()),
        this.boundaryConditionService.getAttributesById(this.id.toString())).subscribe(response =>{            
            this.attributesData = response[0];
            this.getevenTypes(response[1]);
            this.getSeverityLevels(response[2]);
            boundaryConditionList = response[3];
            this.groups = response[4]; 
            this.attributesDataById = response[5];
            this.thresholdId = boundaryConditionList[0].ThresholdType;
            this.getMappingAttributes(boundaryConditionList[0].ThresholdType);
            this.buildBoundaryConditionForm(boundaryConditionList);
            this.showProgress = false;
        });
    }
  }

  private getMappingAttributes(thresholdType: string){
    this.attributes = [];
    if(Number(thresholdType) !== 7){
      this.attributes.push({"Id":Attributes.Devices, "Name": "Devices"},
      {"Id":Attributes.Groups, "Name": "Groups"},
      {"Id":Attributes.ValidityPeriod, "Name": "Validity Period"});

      if(Number(thresholdType) !== 5)
        this.attributes.push({"Id":Attributes.Areas, "Name": "Areas"});
      if(Number(thresholdType) === 3)
        this.attributes.push({"Id":Attributes.Triggers, "Name": "Triggers"});
      if(Number(thresholdType) === 4)
        this.attributes.push({"Id":Attributes.DeviceState, "Name": "Device State"});      
    }
    else{
      this.attributes.push({"Id":Attributes.ValidityPeriod, "Name": "Validity Period"},
      {"Id":Attributes.Cells, "Name": "Cells"});
    }
  }

  private buildBoundaryConditionForm(boundaryConditionList : BoundaryCondition[]){
    this.boundaryConditionForm = this.formBuilder.group({
      bcName: [boundaryConditionList.length != 0 ? boundaryConditionList[0].Name : '', Validators.required], 
      thresholdTypes:[boundaryConditionList.length != 0 ? this.getThreshold(boundaryConditionList[0].ThresholdType) : ''],
      eventType:[boundaryConditionList.length != 0 ? this.getEventType(boundaryConditionList[0].EventType) : ''],
      severities:[boundaryConditionList.length != 0 ? this.getSeverity(boundaryConditionList[0].Severity) : ''],     
      triggers:[this.attributesDataById.triggers],
      timePeriod:[this.attributesDataById.timePeriod],
      areas:[this.attributesDataById.areas],
      groups:[this.attributesDataById.threshold],
      devices:[this.attributesDataById.devices],
      deviceStates:[this.attributesDataById.deviceStates]
      // attributeMapping:[''],
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

  getEventType(eventId : string) : string{
    const event = _.filter(this.eventTypes, item => item.Id === eventId);

    if (event.length > 0) {
        return event[0].Name;
    }
    return null;
  }

  getThreshold(thresholdId : string) : string{
    const thresholdName = _.filter(this.attributesData.threshold, item => item.Id === Number(thresholdId));

    if (thresholdName.length > 0) {
        return thresholdName[0].Name;
    }
    return null;
  }

  getSeverity(severityId : string) : string{
    const severityName = _.filter(this.severityLevels, item => item.Id === severityId);

    if (severityName.length > 0) {
        return severityName[0].Name;
    }
    return null;
  }

  onItemSelect(item: any) {
    this.selectedItem.push({"Name":item.Name.toString()});
  }

  save() : void
  {
    this.formResetting = false;
    this.attributesSelected=new AttributesData();
    if (this.boundaryConditionForm.invalid) {
        return;
    }
    this.showProgress = true;    
    if(this.boundaryConditionForm.value.groups.length !=0)
      this.attributesSelected.threshold.push.apply(this.attributesSelected.threshold,this.boundaryConditionForm.value.groups);
    if(this.boundaryConditionForm.value.devices.length !=0)
      this.attributesSelected.devices.push.apply(this.attributesSelected.devices,this.boundaryConditionForm.value.devices);
    if(this.boundaryConditionForm.value.areas.length !=0)
      this.attributesSelected.areas.push.apply(this.attributesSelected.areas,this.boundaryConditionForm.value.areas);
    if(this.boundaryConditionForm.value.timePeriod.length !=0)
      this.attributesSelected.timePeriod.push.apply(this.attributesSelected.timePeriod,this.boundaryConditionForm.value.timePeriod);
    if(this.boundaryConditionForm.value.deviceStates.length !=0)
      this.attributesSelected.deviceStates.push.apply(this.attributesSelected.deviceStates,this.boundaryConditionForm.value.deviceStates);
    if(this.boundaryConditionForm.value.triggers.length !=0)
      this.attributesSelected.triggers.push.apply(this.attributesSelected.triggers,this.boundaryConditionForm.value.triggers);
    

    this.boundaryConditionService.addBcAttributes(this.attributesSelected, this.id.toString(), this.thresholdId)
    .subscribe(response=>{    
        if (response > 0) {
        this.toastService.success("Boundary Condition attributes added successfully", undefined, { autoDismiss: 5000, closeButton: true });                 
        } else if (response === 0) {
          this.toastService.error("Boundary Condition attributes cannot be added", undefined, {autoDismiss: 5000, closeButton: true });
        }      
        this.showProgress = false; 
      }, () => {
        this.toastService.error("Unexpected error encountered while adding Boundary Condition Attributes", undefined, {autoDismiss: 5000, closeButton: true });        
      }
    );

  }

}
