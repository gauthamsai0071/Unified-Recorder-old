import { Component, HostBinding, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { LocationFilters } from '../../models/device/locationFilters';
import { LocationService } from '../../services/device/location.service';
import { TelemetryService } from '../../services/device/telemetry.service';
import { ToastService } from "@msi/cobalt";
import { DropDown } from '../../models/device/dropDown';
import { DeviceEnum } from '../../models/device/DeviceEnum';
import { TelemetryData, TelemetryInfo,TelemetryFilters } from '../../models/device/TelemetryInfo';

@Component({  
  templateUrl: './devicetelemetry.component.html',
  styleUrls: ['./devicetelemetry.component.scss']
})
export class DeviceTelemetryComponent implements OnInit {
  telemetryForm : FormGroup=null;
  telemetryRows: TelemetryInfo[] = [];
  telemetryData: TelemetryData;
  dateModel:string[];
  filterIdModel:string[];
  filterlistModel:string[];
  locFilters:LocationFilters=new LocationFilters();
  showProgress: boolean;  
  formResetting: boolean = true;
  detailsModel:string[];    
  dropdownSettings:IDropdownSettings = {};  
  rgNames:any;
  triggers:any;
  devices:any;      
  filteredOptions:any;
  pageNumber:number = 1;
  pageSize:number = 10;
  currentDate = new Date();
  maxDate: NgbDate = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
  fromMaxDate:NgbDate;
  fromMinDate:NgbDate;
  totalCount:number;
  telemetryFilters: TelemetryFilters;
  id?: number = null;

  constructor(private locationService: LocationService,
    private telemetryService: TelemetryService,
    public router: Router,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef ) { 
      this.showProgress = true;
      if (this.activatedRoute.snapshot.params.id) {
        this.id = Number(this.activatedRoute.snapshot.params.id);
      }
    }
  
  get form() { return this.telemetryForm.controls; }
  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'Key',
      textField: 'Value',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: false
    };       
    this.getLocationFiltersData();
    
    if (this.id !== null){
      this.telemetryFilters = new TelemetryFilters();

      this.telemetryFilters.orderBy = " order by NetworkDeviceIdentifier";
      this.telemetryFilters.identifier = "DeviceID";
      
      this.telemetryFilters.where = `where DeviceID = N'${this.id}'`;
      this.telemetryService.getTelemetryForGroup(this.telemetryFilters)
        .subscribe(response=>{
          if(response !== null && response !== 'Invalid')
          {
            this.getTelemetryList(response);
          }
          else
          {
            this.toastService.error("Records not found for device telemetry", undefined, {autoDismiss: 5000, closeButton: true });
          }
      },
      error=>{
        console.log(error)
        });
    }

    this.buildDeviceLocationForm(); 

    this.telemetryForm.get('filterId').valueChanges.subscribe(val => {
      this.filterChange();      
    });  

  }

  ngAfterViewChecked(){
    this.changeDetectorRef.detectChanges();
  }

  private _filterComplexOptions(value: string): DropDown[] {    
    if (!value) {
      return []; // This prevents dropdown from opening when input is empty
    }    
    //console.log(value);
    return this.devicesFilter(value);    
  }

  getLocationFiltersData()
  {
    this.locationService.getLocationFiltes().subscribe(response => {
      this.locFilters.Options1=response.Options1;
      this.locFilters.DateRange=DeviceEnum.Zero.toString();
      this.locFilters.Options2=response.Options2;
      this.locFilters.FilterId=DeviceEnum.One.toString();
      this.locFilters.Options3=response.Options3;      
      this.locFilters.FilterValue= response.Options3[0].Key;        
      this.showProgress = false;   
    },
    error=>{        
        this.showProgress = false;
      }
    )       
  }

  devicesFilter(filterValue:string):DropDown[]
  {
    this.locationService.getFilterValues(
      this.telemetryForm.controls["filterId"].value,
      filterValue
      )
    .subscribe(response => {
      this.locFilters.Options3 = response;            
      this.showProgress = false;         
    },
    error=>{      
        this.showProgress = false;
      }
    )
    
    return this.locFilters.Options3;   
  }
  

  filterChange():void
  {
    if(this.telemetryForm.controls["filterId"].value == 2){
      this.locFilters.Options3 = [];
      this.telemetryForm.controls.filterValue.setValue(""); 
      this.locFilters.Options3.push({Key :'0', Value : 'All Resource Groups'});
    }

    this.locationService.getFilterValues(
      this.telemetryForm.controls["filterId"].value,
      this.telemetryForm.controls["filterValue"].value
      )
    .subscribe(response => {
      if(response.toString() != "Invalid"){
      this.locFilters.Options3 = response;      
      this.telemetryForm.controls.filterValue.setValue(""); 
      }           
      this.showProgress = false;   
    },
    error=>{      
        this.showProgress = false;
      }
    )   
  }
  

  resetForm()
  {
    this.formResetting = true;
    this.telemetryForm.reset();
        
  }

  private buildDeviceLocationForm() {
    this.telemetryForm = this.formBuilder.group({        
      dateRange:["0"],
      filterId:["0"],
      filterValue:[''] ,
      StartDate:[""],
      EndDate:[""],
      FromTime:[""],
      ToTime:[""]    
    });
    
    this.telemetryForm.get("filterValue").valueChanges.   
    subscribe(            
      (value => {           
          if (value !== null && value.length >= 2) {    
            this.locationService.getFilterValues(this.telemetryForm.controls["filterId"].value,value)
            .subscribe(response => {   
              this.filteredOptions = response;
              if(this.telemetryForm.controls["filterId"].value != 2){
                this.filteredOptions.push({Key :'0', Value : 'All Devices'});
              }                
              else{
                this.filteredOptions.push({Key :'0', Value : 'All Resource Groups'});
              }             
              this.locFilters.Options3 = response;    
              this.filteredOptions = response;
              this.showProgress = false;       
            },
              error => {
                console.log(error),
                  this.showProgress = false;
              }
            )    
          } else if(value.length === 0) {
            this.filteredOptions = [];
          }
      }));
  }

  onSearchClick() : void{
    this.formResetting = false;    
    if (this.telemetryForm.invalid) {
        return;
    }
    this.showProgress = true;

    this.telemetryFilters = new TelemetryFilters();
    if(this.telemetryForm.value.dateRange == "0"){
      if(this.telemetryForm.value.filterId == "0")
      {
        this.telemetryFilters.orderBy = " order by Device";
        this.telemetryFilters.identifier = "DeviceID";
        if(this.telemetryForm.value.filterValue != "0")
          this.telemetryFilters.where =  ` where Device = N'${this.telemetryForm.get('filterValue').value}' `;
        
      }
      if(this.telemetryForm.value.filterId == "1")
      {
        this.telemetryFilters.orderBy = " order by NetworkDeviceIdentifier";
        this.telemetryFilters.identifier = "DeviceID";
        if(this.telemetryForm.value.filterValue != "0"){
          this.telemetryFilters.where = ` where NetworkDeviceIdentifier = N'${ this.telemetryForm.get('filterValue').value }' `;
        }
        
      }

      if(this.telemetryForm.value.filterId == "2")
      {        
        if(this.telemetryForm.value.filterValue != 0)
          this.telemetryFilters.rgName = this.telemetryForm.get('filterValue').value ;

        this.telemetryService.getLatestRGHistoryForGroup(this.telemetryFilters)
          .subscribe(response=>{
            if(response != null && response !== 'Invalid' && response.TotalCount != 0){
              this.getTelemetryList(response);
            }
            else{
              this.toastService.error("Records not found for device telemetry", undefined, { autoDismiss: 5000, closeButton: true });
            }  
            this.showProgress = false;
        },
        error=>{
          console.log(error),
          this.toastService.error("Unexpected Error encountered while retrieving the telemetry information", undefined, { autoDismiss: 5000, closeButton: true });
          this.showProgress = false;
          }
        );
      }
      else{
        this.telemetryService.getTelemetryForGroup(this.telemetryFilters)
          .subscribe(response=>{
            if(response != null && response !== 'Invalid' && response.TotalCount != 0){
              this.getTelemetryList(response);
            }
            else
              this.toastService.error("Records not found for device telemetry", undefined, {autoDismiss: 5000, closeButton: true });
            this.showProgress = false;
        },
        error=>{
          console.log(error);
          this.toastService.error("Unexpected Error encountered while retrieving the telemetry information", undefined, {autoDismiss: 5000, closeButton: true });
          this.showProgress = false;
          });
      }

    }
    
  }

  getTelemetryList(response : TelemetryData)
  {
    this.telemetryData = response;
    this.telemetryRows = this.telemetryData.TelemetryDatas;
    this.totalCount = this.telemetryData.TotalCount;
  }

  getPage(page: number) {  
    this.telemetryFilters.pageNumber =   page;
    this.telemetryRows.splice(0,this.telemetryRows.length);
    this.changeDetectorRef.detectChanges();    
    if(this.telemetryForm.value.filterId == "2")
    { 
      this.telemetryService.getLatestRGHistoryForGroup(this.telemetryFilters)
        .subscribe(response=>{
          if(response != null && response !== 'Invalid'){
            this.getTelemetryList(response);
          }
          else
            this.toastService.error("Records not found for device telemetry", undefined, {autoDismiss: 5000, closeButton: true });
      },
      error=>{
          console.log(error)
          this.toastService.error("Unexpected Error encountered while retrieving the telemetry information", undefined, {autoDismiss: 5000, closeButton: true });
        }
      );
    }
    else{
      this.telemetryService.getTelemetryForGroup(this.telemetryFilters)
        .subscribe(response=>{
          if(response != null && response !== 'Invalid'){
            this.getTelemetryList(response);
          }
          else
            this.toastService.error("Records not found for device telemetry", undefined, {autoDismiss: 5000, closeButton: true });
      },
      error=>{
          console.log(error)
          this.toastService.error("Unexpected Error encountered while retrieving the telemetry information", undefined, {autoDismiss: 5000, closeButton: true });
        });
    }

  }
  

}
