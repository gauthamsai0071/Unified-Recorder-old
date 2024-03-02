import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuditLogsData } from '../models/audit/auditlogs';
import { AuditLogs } from '../models/audit/auditlogs';
import { AuditLogService } from "../services/audit/audit-log.service";
import { Router } from '@angular/router';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { FilterDataStruct } from '../models/audit/AuditLogFilters';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from "@msi/cobalt";

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})


export class LogsComponent implements OnInit {
  auditLogForm : FormGroup=null;
  auditLogs: AuditLogs[]=[];
  auditLogsdata: AuditLogsData;
  showProgress: boolean;  
  formResetting: boolean = true;
  detailsModel:string[];  
  filterData:FilterDataStruct;
  filtersCriteria:FilterDataStruct;
  dropdownSettings:IDropdownSettings = {};
  currentDate = new Date();
  maxDate: NgbDate = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
  fromMaxDate:NgbDate;
  fromMinDate:NgbDate;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalCount: number;
  isFiltered: boolean = false;
  constructor(private auditLogService: AuditLogService,
    public router: Router,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
    )
  { 
    this.showProgress = true;     
    this.filtersCriteria=new FilterDataStruct();
  }

  get form() { return this.auditLogForm.controls; }

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: false
    };

    this.buildAuditLogForm();
    this.getAuditFiltersData();
    this.getAuditLogsList();     
  }
  
  ngAfterViewChecked(){
    this.changeDetectorRef.detectChanges();
  }
  
  onSearchClick() : void
  {
    this.formResetting = false;
    this.filtersCriteria=new FilterDataStruct();
    if (this.auditLogForm.invalid) {
        return;
    }
    this.showProgress = true;    
    if(this.auditLogForm.value.Actions)
      this.filtersCriteria.Actions.push.apply(this.filtersCriteria.Actions,this.auditLogForm.value.Actions);
    if(this.auditLogForm.value.Classifications)
      this.filtersCriteria.ObjectTypes.push.apply(this.filtersCriteria.ObjectTypes,this.auditLogForm.value.Classifications);
    if(this.auditLogForm.value.Components)
      this.filtersCriteria.Sources.push.apply(this.filtersCriteria.Sources,this.auditLogForm.value.Components);
    if(this.auditLogForm.value.Agencies)
      this.filtersCriteria.Dispatchers.push.apply(this.filtersCriteria.Dispatchers,this.auditLogForm.value.Agencies);
    if(this.auditLogForm.value.DetailsText)
      this.filtersCriteria.Messages.push.apply(this.filtersCriteria.Messages,this.auditLogForm.value.DetailsText);
    if(this.auditLogForm.value.FromDate)
      this.filtersCriteria.FromDate=new Date(this.auditLogForm.value.FromDate.year ,
      this.auditLogForm.value.FromDate.month-1,
      this.auditLogForm.value.FromDate.day);
    
    if(this.auditLogForm.value.FromTime)  
    {
      this.filtersCriteria.FromDate.setHours(
      this.auditLogForm.value.FromTime.hour,
      this.auditLogForm.value.FromTime.minute,
      this.auditLogForm.value.FromTime.second
      )      
    }

    if(this.auditLogForm.value.ToDate)
      this.filtersCriteria.ToDate=new Date(this.auditLogForm.value.ToDate.year ,
      this.auditLogForm.value.ToDate.month-1,
      this.auditLogForm.value.ToDate.day)
              
    if(this.auditLogForm.value.ToTime)
    {
    this.filtersCriteria.ToDate.setHours(
      this.auditLogForm.value.ToTime.hour,
      this.auditLogForm.value.ToTime.minute,
      this.auditLogForm.value.ToTime.second
    )    
    }

    this.pageNumber = 1;
    this.auditLogService.searchAuditLogs(this.filtersCriteria, this.pageSize.toString(), this.pageNumber.toString())
    .subscribe(response=>{
      this.isFiltered = true;
      if(response != null && response != 'Invalid'){      
      this.auditLogsdata = response; 
      if(this.auditLogsdata.TotalCount > 0){
        this.auditLogs = this.auditLogsdata.AuditLog;
        this.totalCount = this.auditLogsdata.TotalCount; 
      }
      else
        this.toastService.error("Records not found", undefined, {autoDismiss: 5000, closeButton: true });
      }
      else if(response == null){
        this.toastService.error("Records not found for applied filters", undefined, {autoDismiss: 5000, closeButton: true });
      }
      else
        this.toastService.error("Exception occured while retrieving the information", undefined, {autoDismiss: 5000, closeButton: true });     
      this.showProgress = false; 
    },
    error => console.log(error)
    );

  }  

  getAuditLogsList() {
    if(this.isFiltered)
    {
      this.auditLogService.searchAuditLogs(this.filtersCriteria, this.pageSize.toString(), this.pageNumber.toString())
      .subscribe(response=>{
        this.isFiltered = true; 
        if(response !== null && response !== 'Invalid'){
          this.auditLogsdata = response; 
          this.auditLogs = this.auditLogsdata.AuditLog;
          this.totalCount = this.auditLogsdata.TotalCount;
        }
        else
          this.toastService.error("Records not found for filtered values", undefined, {autoDismiss: 5000, closeButton: true });    
              
        this.showProgress = false; 
      },
      error => {console.log(error);
        this.toastService.error("Exception occured while retrieving the information", undefined, {autoDismiss: 5000, closeButton: true });
      });
    }
    else
    {
      this.auditLogService.getAuditLogs(this.pageSize.toString(), this.pageNumber.toString()).subscribe(response => {
        if(response !== null){
          this.auditLogsdata = response; 
          this.auditLogs = this.auditLogsdata.AuditLog;
          this.totalCount = this.auditLogsdata.TotalCount;
        }
        else
          this.toastService.error("Records not found", undefined, {autoDismiss: 5000, closeButton: true });              
        this.showProgress = false;   
      },
      error=>{
        console.log(error);
        this.toastService.error("Exception occured while retrieving the information", undefined, {autoDismiss: 5000, closeButton: true });
        this.showProgress = false;
      }
      );
    }   
  }

  getPage(page: number) {  
    this.pageNumber =   page;
    this.auditLogs.splice(0,this.auditLogs.length);
    this.changeDetectorRef.detectChanges();    
    this.getAuditLogsList();
  }

  getAuditFiltersData(){
    this.auditLogService.getAuditFilersData().subscribe(response=>{
      if(response != null)
        this.filterData=response;
      else
        this.toastService.error("Filter value not found", undefined, {autoDismiss: 5000, closeButton: true });

      this.showProgress=false;
    },
    error=>{
      console.log(error);
      this.toastService.error("Exception occured while retrieving the information", undefined, {autoDismiss: 5000, closeButton: true });
      this.showProgress = false;
    }
    );    
  }

  resetForm()
  {
    this.isFiltered = false;
    this.formResetting = true;
    this.auditLogForm.reset();
    this.pageNumber = 1;
    this.getAuditLogsList();    
  }

  private buildAuditLogForm() {
    this.auditLogForm = this.formBuilder.group({
        Actions: [""],
        Classifications:[""],
        Components: [""],
        Agencies:[""],
        DetailsText:[""],
        FromDate: [""],
        ToDate:[""],       
        FromTime:[""],
        ToTime:[""]
    }); 
  }
}


