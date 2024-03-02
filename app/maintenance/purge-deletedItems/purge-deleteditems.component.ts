import { Component, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ToastService } from "@msi/cobalt";
import { PurgeService } from '../../services/maintenance/purge';
import { PurgeDetails } from '../../models/maintenance/purgedetails';
import { ConfirmationDialogService } from '../../_common/confirmation-dialog/confirmation-dialog.service';
import { Mappings } from '../../models/boundary-condition/MappingsAttribute';
import * as _ from 'lodash';

export const objectType = [{ value: '1', type: 'Reader' },
{ value: '2', type: 'Cell' },
{ value: '3', type: 'Cell Network' }]

@Component({ 
  templateUrl: './purge-deleteditems.component.html',
  styleUrls: ['./purge-deleteditems.component.scss']
})
export class PurgeDeleteditemsComponent implements OnInit {  
  purgeDetailsForm : FormGroup=null;
  showProgress: boolean = false;
  purgeTotalRecords:Mappings[]=[];
  rowCount:number = 0;
  PageNumber: number = 1;
  PageSize: number = 10;

  public objTypes;

  get form() { return this.purgeDetailsForm.controls; }

  constructor(private formBuilder: FormBuilder,
    private toastService: ToastService,
    private purgeService: PurgeService,
    private confirmationDialogService: ConfirmationDialogService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.objTypes = objectType;        
    this.buildPurgeObject();
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewChecked(){
    this.changeDetectorRef.detectChanges();
  }

  buildPurgeObject(){
    this.purgeDetailsForm = this.formBuilder.group({     
      objTyps:['1']
    });
  }  

  onOptionSelected(valueSelected: string){
    if(valueSelected != undefined){           
      this.purgeTotalRecords = [];
      this.purgeService.getObjectsForPurge(this.purgeDetailsForm.value.objTyps, this.PageNumber, this.PageSize).subscribe(response =>{
        if(response !=null && response.TotalRecords > 0){
          let records = response;
          this.purgeTotalRecords =  records.purgeData;
          this.rowCount = records.TotalRecords;
        }
        else
        {
          this.toastService.error("Records not found for selected object", undefined, {autoDismiss: 5000, closeButton: true });
        }
      });
    }
  }

  getPage(page: number) {  
    this.PageNumber =   page;
    this.purgeTotalRecords.splice(0,this.purgeTotalRecords.length);
    this.changeDetectorRef.detectChanges();    
    this.purgeService.getObjectsForPurge(this.purgeDetailsForm.value.objTyps, this.PageNumber, this.PageSize).subscribe(response =>{
      if(response !=null){
        let records = response;
        this.purgeTotalRecords =  records.purgeData;
        this.rowCount = records.TotalRecords;
      }
    });
  }

  remove(Id:number): void {
    this.showProgress = true;

    this.confirmationDialogService.confirmDialog("Confirmation",
    "Do you want to delete?", "Confirm", "Dismiss").subscribe(
      response => { 
        if(response)
        {
          this.purgeService.purgeObjects(Id, this.purgeDetailsForm.value.objTyps ).subscribe(
            response => {     
                if (response) {
                    this.toastService.success("Removed object successfully.", undefined, { autoDismiss: 60000, closeButton: true });
                    this.purgeTotalRecords.splice(0,this.purgeTotalRecords.length);
                    this.changeDetectorRef.detectChanges();    
                    this.purgeService.getObjectsForPurge(this.purgeDetailsForm.value.objTyps, this.PageNumber, this.PageSize).subscribe(response =>{
                      if(response !=null){
                        let records = response;
                        this.purgeTotalRecords =  records.purgeData;
                        this.rowCount = records.TotalRecords;
                      }
                      else
                        this.toastService.error("Records not found for selected object", undefined, {autoDismiss: 5000, closeButton: true });

                      this.showProgress = false; 
                    });
                } else {
                    this.toastService.error("Unexpected error encountered while removing the object.", undefined, {autoDismiss: 5000, closeButton: true });
                    this.showProgress = false; 
                }
            }, (error) => {
                this.toastService.error("Unexpected error encountered while deleting object", undefined, {autoDismiss: 5000, closeButton: true });
                this.showProgress = false;
            }
          );
        }
        else
        {
          this.showProgress = false; 
        }
    });
  }

}
