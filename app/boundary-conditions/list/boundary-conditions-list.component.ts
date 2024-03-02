import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router } from '@angular/router';
import { DOMParser } from 'xmldom';
import { ToastService } from "@msi/cobalt";
import { BoundaryConditionService } from "../../services/boundary-service/boundary-condition.service";
import { ConfirmationDialogService } from '../../_common/confirmation-dialog/confirmation-dialog.service';
import { BoundaryCondition } from '../../models/boundary-condition/boundary-condition-list';
import { EventTypeService } from "../../services/event-type/event-type.service";
import { ServerityService } from "../../services/severity/severity.service";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ConditionFilters } from '../../models/boundary-condition/boundaryconditionfilters';
import { forkJoin } from "rxjs";
import * as _ from 'lodash';
import { element } from 'protractor';


@Component({  
  templateUrl: './boundary-conditions-list.component.html',
  styleUrls: ['./boundary-conditions-list.component.scss']
})

export class BoundaryConditionsListComponent implements OnInit {
  showProgress: boolean;
  boundaryConditionList: BoundaryCondition[] = [];
  boundaryConditionForm: FormGroup = null;
  formResetting: boolean = true;  
  filtersCriteria:ConditionFilters;
  dropdownSettings:IDropdownSettings = {};

  public filterEventTypes;
  public filterSeverities;
  public filterThresholdTypes;
  public filters;
  
  get form() { return this.boundaryConditionForm.controls; }

  constructor(private formBuilder: FormBuilder,
    private toastService: ToastService,
    private boundaryConditionService: BoundaryConditionService,    
    private confirmationDialogService: ConfirmationDialogService,
    private eventTypeService: EventTypeService,
    private serverityService: ServerityService,
    public router: Router,
    private changeDetectorRef: ChangeDetectorRef) {
      
     }

  ngOnInit(): void {  
    this.showProgress = true;  
    this.getBoundaryConditions();    

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: false
    };

    forkJoin(this.boundaryConditionService.getThersholdType(),
        this.eventTypeService.getEventTypeList(),
        this.serverityService.getSeverityLevels(),
        this.boundaryConditionService.getBoundaryConditions()).subscribe(response => {          
          this.getevenTypes(response[1]);
          this.getSeverityLevels(response[2]);
          this.filterThresholdTypes =response[0];          
          
           
          
          this.filterThresholdTypes.forEach((element,index)=>{
            if(element.Id == 6) this.filterThresholdTypes.splice(index,1);
          });
          this.filterThresholdTypes.forEach((element,index)=>{
            if(element.Id == 7) this.filterThresholdTypes.splice(index,1);
          });

          this.filterThresholdTypes.forEach((element,index)=>{
            if(element.Id == 8){
              this.filterThresholdTypes.splice(index,1);
              
              this.filterThresholdTypes.push({
                Id : 8,
                Name: "Geo Select"
              });
            }
          }); 

          this.boundaryConditionList = response[3];
          this.buildBoundaryConditionForm();
          this.showProgress = false;
          
        });
  }

  ngAfterViewChecked(){
    this.changeDetectorRef.detectChanges();
  }

  private getevenTypes(response: string): void {
    const xmlResponse = new DOMParser().parseFromString(response); 
    const result = xmlResponse.getElementsByTagName("getEventTypesResult")[0];
    this.filterEventTypes = [];
    for (let k = 0; k < result.childNodes.length; k++) {
      let item = result.childNodes[k];
      this.filterEventTypes.push({  
        'Id': item.childNodes[0].firstChild.nodeValue,  
        'Name': item.childNodes[1].firstChild.nodeValue
      });              
    }
  }

  private getSeverityLevels(response: string): void {
    const xmlResponse = new DOMParser().parseFromString(response); 
    const result = xmlResponse.getElementsByTagName("getSeverityLevelsResult")[0];
    this.filterSeverities = [];
    for (let k = 0; k < result.childNodes.length; k++) {
      let item = result.childNodes[k];
      this.filterSeverities.push({  
        'Id': item.childNodes[0].firstChild.nodeValue,  
        'Name': item.childNodes[1].firstChild.nodeValue
      });              
    }
  }

  getBoundaryConditions(): void{
    this.boundaryConditionService.getBoundaryConditions().subscribe(response =>{
      if(response != null)
      this.boundaryConditionList = response;  
      this.showProgress = false; 
    });
  }

  removeBoundaryCondition(Id: number): void  {
    this.showProgress = true;

    this.confirmationDialogService.confirmDialog("Confirmation",
    "Do you want to delete selected boundary condition", "Confirm", "Dismiss").subscribe(
      response => { 
        if(response)
        {
          this.boundaryConditionService.removeBoundaryConditions(Id.toString()).subscribe(
            response => {                
                this.showProgress = false;
                if (response) {
                    this.toastService.success("Boundary Condition Removed Successfully", undefined, { autoDismiss: 5000, closeButton: true });
                    this.boundaryConditionList = [];
                    this.getBoundaryConditions();
                } else if (!response) {
                    this.toastService.error("Kindly verify boundary condition id", undefined, { autoDismiss: 5000,  closeButton: true });
                }
            }, (error) => {
                this.toastService.error("Unexpected error encountered while removing Boundary Condition", undefined, {autoDismiss: 5000, closeButton: true });
                this.showProgress = false;
            }
          );
        }
        else
        {
          this.boundaryConditionList = [];
          this.getBoundaryConditions();
          this.showProgress = false;
        }
    });
  }

  private buildBoundaryConditionForm() {    
    this.boundaryConditionForm = this.formBuilder.group({
        bcName: [''],
        thresholdTypes: [''],
        eventTypes: [''],
        severities: ['']             
    });     
  }

  onSearchClick() : void{
    this.formResetting = false;
    this.filtersCriteria=new ConditionFilters();
    if (this.boundaryConditionForm.invalid) {
        return;
    }
    this.showProgress = true;
    

    if(this.boundaryConditionForm.value.thresholdTypes)
    {
      _.each(this.boundaryConditionForm.value.thresholdTypes, element => {
        
        this.filtersCriteria.ThresholdType.push(element.Name); 
      });          
    }

    if(this.boundaryConditionForm.value.eventTypes){
      _.each(this.boundaryConditionForm.value.eventTypes, element => {
        
        this.filtersCriteria.EventType.push(element.Name); 
      }); 
    }

    if(this.boundaryConditionForm.value.severities){
      _.each(this.boundaryConditionForm.value.severities, element => {
        
        this.filtersCriteria.Severity.push(element.Name); 
      }); 
    }

    if(this.boundaryConditionForm.value.bcName){
      _.each(this.boundaryConditionForm.value.bcName, element => {
        
        this.filtersCriteria.Name.push(element); 
      });  
    }

    
    this.boundaryConditionService.getFilteredConditions(this.filtersCriteria).subscribe(response =>{
      this.boundaryConditionList.splice(0,this.boundaryConditionList.length);
      this.boundaryConditionList = response;  
      this.showProgress = false; 
    });
    
  }

  resetForm()
  {
    this.formResetting = true;
    this.boundaryConditionForm.reset();
    this.getBoundaryConditions();    
  }

}