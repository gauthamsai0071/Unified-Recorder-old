import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ToastService } from "@msi/cobalt";
import { PurgeService } from '../../services/maintenance/purge';
import { PurgeDetails } from '../../models/maintenance/purgedetails';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogService } from '../../_common/confirmation-dialog/confirmation-dialog.service';


export const events = [{ value: 'Ack', type: 'Acknowledged Events' },
{ value: 'Unack', type: 'Unacknowledged Events' },
{ value: 'Audit', type: 'Audit Logs' }]

@Component({
  templateUrl: './purge-history.component.html',
  styleUrls: ['./purge-history.component.scss']
})
export class PurgeHistoryComponent implements OnInit {
  purgeHistoryForm : FormGroup=null;
  formResetting: boolean = true;
  showProgress: boolean = false;
  currentDate = new Date();
  maxDate: NgbDate = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, this.currentDate.getDate());
  fromMaxDate:NgbDate;
  fromMinDate:NgbDate;
  purgeTotalRecords:PurgeDetails[]=[];
  count:number = 0;

  public eventPurge;

  get form() { return this.purgeHistoryForm.controls; }
  constructor(private formBuilder: FormBuilder,
    private toastService: ToastService,
    private purgeService: PurgeService,
    private confirmationDialogService: ConfirmationDialogService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.eventPurge = events;
    this.formResetting = true;    
    this.buildPurgeEvents();    
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewChecked(){
    this.changeDetectorRef.detectChanges();
  }

  buildPurgeEvents(){
    this.purgeHistoryForm = this.formBuilder.group({     
      eventstatus:["Ack"],
      FromDate: ['', Validators.required],
      FromTime:[''] 
    });
  }

  getRecords():void{
    this.showProgress = true;
    let status: string;
    
    if(this.purgeHistoryForm.value.eventstatus !== '' && this.purgeHistoryForm.value.eventstatus != undefined){      
       status = this.purgeHistoryForm.get('eventstatus').value;
    }

    if(status == "Ack")
    {
      this.purgeService.getAckEventsPurgeHistory().subscribe(response=>{
        if(response !== null){
          this.bindPurgeRecords(response);
        }
        else
          this.toastService.error("Records not found for acknowledged event", undefined, {autoDismiss: 5000, closeButton: true });
          
        this.showProgress = false;
      },(error) => {
        this.toastService.error("Unexpected error encountered while reteriving the records", undefined, {autoDismiss: 5000, closeButton: true });
        this.showProgress = false;
      });
    }

    if(status == "Unack")
    {
      this.purgeService.getUnAckEventsPurgeHistory().subscribe(response=>{
        if(response !== null){
          this.bindPurgeRecords(response);
        }
        else
          this.toastService.error("Records not found for unacknowledged event", undefined, {autoDismiss: 5000, closeButton: true });

        this.showProgress = false;
      },(error) => {
        this.toastService.error("Unexpected error encountered while reteriving the records", undefined, {autoDismiss: 5000, closeButton: true });
        this.showProgress = false;
      });
    }

    if(status == "Audit")
    {
      this.purgeService.getAuditLogsPurgeHistory().subscribe(response=>{
        if(response !== null){
          this.bindPurgeRecords(response);
        }
        else
          this.toastService.error("Records not found for aduit logs", undefined, {autoDismiss: 5000,  closeButton: true });

        this.showProgress = false;
      },(error) => {
        this.toastService.error("Unexpected error encountered while reteriving the records", undefined, {autoDismiss: 5000, closeButton: true });
        this.showProgress = false;
      });
    }

       
  }  
  
  bindPurgeRecords(response: any){
    this.purgeTotalRecords = [];
    this.purgeTotalRecords.push({
      TotalRecords: response.TotalRecords,
      Oldest: response.PurgeData.Oldest,
      Newest: response.PurgeData.Newest
    });

    this.count = this.purgeTotalRecords.length; 
  }

  purgeRecords(){
    this.formResetting = false;
    this.showProgress = true;
    let dateSelected: Date;
    let status: string;
    
    
    this.purgeHistoryForm.updateValueAndValidity();

    if (this.purgeHistoryForm.invalid) {
      this.showProgress = false;
        return;
    }

    if(this.purgeHistoryForm.value.eventstatus !== '' && this.purgeHistoryForm.value.eventstatus != undefined){      
       status = this.purgeHistoryForm.get('eventstatus').value;
    }

    if(this.purgeHistoryForm.value.FromDate)
    dateSelected=new Date(this.purgeHistoryForm.value.FromDate.year ,
      this.purgeHistoryForm.value.FromDate.month-1,
      this.purgeHistoryForm.value.FromDate.day);
    
    if(this.purgeHistoryForm.value.FromTime)  
    {
      dateSelected.setHours(
      this.purgeHistoryForm.value.FromTime.hour,
      this.purgeHistoryForm.value.FromTime.minute,
      this.purgeHistoryForm.value.FromTime.second);      
    }

    if(dateSelected == null || dateSelected.toString() == '')
    {
      this.toastService.error("Kindly select date to purge the records", undefined, {autoDismiss: 5000, closeButton: true });
      this.showProgress = false;
      return;
    }

    

    if(status == "Ack")
    {
      this.confirmationDialogService.confirmDialog("Confirmation",
      "Do you want to purge acknowledged events?", "Confirm", "Dismiss").subscribe(response =>{
        if(response){
          this.purgeService.purgeEvents(dateSelected, '1').subscribe(response=> {
            if(response >= 0)
            {
              this.toastService.success("Purged acknowledged events", undefined, {autoDismiss: 5000, closeButton: true });
              this.showProgress = false; 
            }
            else if(response == -1){
              this.toastService.error("Unexpected error encountered while removing the acknowledged events.", undefined, {autoDismiss: 5000, closeButton: true });
              this.showProgress = false; 
            }
          })
        }
        else
        {
          this.showProgress = false; 
        }
      });
      
    }

    if(status == "Unack")
    {
      this.confirmationDialogService.confirmDialog("Confirmation",
      "Do you want to purge unacknowledged events?", "Confirm", "Dismiss").subscribe(response =>{
        if(response){
          this.purgeService.purgeEvents(dateSelected, "0").subscribe(response=> {
            if(response >= 0)
            {
              this.toastService.success("Purged unacknowledged events", undefined, {autoDismiss: 5000, closeButton: true });
              this.showProgress = false; 
            }
            else if(response == -1){
              this.toastService.error("Unexpected error encountered while removing the unacknowledged events.", undefined, {autoDismiss: 5000, closeButton: true });
              this.showProgress = false; 
            }
          })
        }
        else
        {
          this.showProgress = false; 
        }
      });
    }

    if(status == "Audit")
    {
      this.confirmationDialogService.confirmDialog("Confirmation",
      "Do you want to purge audti log events?", "Confirm", "Dismiss").subscribe(response =>{
        if(response){
          this.purgeService.purgeAuditLogs(dateSelected).subscribe(response=> {
            if(response >= 0)
            {
              this.toastService.success("Purged audit log events", undefined, {autoDismiss: 5000, closeButton: true });
              this.showProgress = false; 
            }
            else if(response == -1){
              this.toastService.error("Unexpected error encountered while removing the audti log events.", undefined, {autoDismiss: 5000, closeButton: true });
              this.showProgress = false; 
            }
          })
        }
        else
        {
          this.showProgress = false; 
        }
      });
    }

  }
}
