import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastService } from "@msi/cobalt";
import { LocationFilters, ResultSets } from '../../models/device/locationFilters';
import { LocationService } from '../../services/device/location.service';
import { DOMParser } from 'xmldom';
import { DropDown } from '../../models/device/dropDown';
import { LocationInfo } from '../../models/device/LocationInfo';
import { DeviceEnum } from '../../models/device/DeviceEnum';
import { ConvertToCSV } from '../../_common/uttilities/CSVGeneration';
import { ConvertLatitudeToDMS, ConvertLongitudeToDMS } from '../../_common/uttilities/LatLongConversion';


@Component({
  selector: 'app-devicelocation',
  templateUrl: './devicelocation.component.html',
  styleUrls: ['./devicelocation.component.scss']
})
export class DeviceLocationComponent implements OnInit {

  locationForm: FormGroup = null;
  locationRows: LocationInfo[] = [];
  dateModel: string[];
  filterIdModel: string[];
  filterlistModel: string[];
  locFilters: LocationFilters = new LocationFilters();
  showProgress: boolean;
  formResetting: boolean = true;
  detailsModel: string[];
  dropdownSettings: IDropdownSettings = {};
  currentDate = new Date();
  maxDate: NgbDate = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
  fromMaxDate: NgbDate;
  fromMinDate: NgbDate;
  rgNames: any;
  triggers: any;
  devices: any;
  filteredOptions: DropDown[];
  maxRows: number = 10000;
  historicalRows: LocationInfo[] ;
  options:DropDown[];
  id?: number = null; 

  constructor(private locationService: LocationService,
    private toastService: ToastService,
    public router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef:ChangeDetectorRef) {
    this.showProgress = true;
    if (this.activatedRoute.snapshot.params.id) {
      this.id = Number(this.activatedRoute.snapshot.params.id);
    }
  }

  get form() { return this.locationForm.controls; }

  ngOnInit(): void {

    this.buildDeviceLocationForm(),
    this.getLocationFiltersData()
    

    this.getMappingData();

    this.locationForm.get('filterId').valueChanges.subscribe(val => {
      this.filterChange();
    });
    
          
  }

  ngAfterViewChecked(){
    this.changeDetectorRef.detectChanges();
  }

  onKeyupEvent(event: any) {
    this.locationForm.controls["deviceValue"].patchValue(event.target.value);
  }

  private _filterComplexOptions(value: string): DropDown[] {
    if (!value) {
      return []; // This prevents dropdown from opening when input is empty      
    }
    this.devicesFilter(value);
    return this.locFilters.Options3.filter((opt) =>
          opt.Value.toLowerCase().includes(value.toLowerCase()),
    );    
  }

  getMappingData() {
    this.locationService.GetArchivedMappingData()
      .subscribe(response => {
        this.rgNames = response[0];
        this.triggers = response[1];
        this.devices = response[2];
      },
        error => {
          console.log(error);
        }
      )
  }

  getLocationFiltersData() {
    this.locationService.getLocationFiltes().subscribe(response => {
      this.locFilters.Options1 = response.Options1;
      this.locFilters.DateRange = DeviceEnum.Zero.toString();
      this.locFilters.Options2 = response.Options2;
      this.locFilters.FilterId = DeviceEnum.Zero.toString();
      this.locFilters.Options3 = response.Options3;
      if(this.id == null || Number.isNaN(this.id))      
        this.locFilters.FilterValue = response.Options3[0].Key;
      else
      {
        this.locFilters.FilterValue = this.id.toString();
        this.locFilters.FilterId = DeviceEnum.One.toString();
      }
        

      this.getLocationList();
      this.showProgress = false;   
    },
      error => {
          //console.log(error),
          this.toastService.error("Unexpected Error encountered while retrieving the device information", undefined, { autoDismiss: 5000, closeButton: true });
          this.showProgress = false;
      }
    )
  }

  devicesFilter(filterValue: string): DropDown[] {        

    this.locationService.getFilterValues(
      this.locationForm.controls["filterId"].value,
      filterValue
    )
      .subscribe(response => {                
        this.locFilters.Options3 = response;    
           
        this.showProgress = false;       
      },
        error => {
          //console.log(error),
          this.toastService.error("Unexpected Error encountered while retrieving the information", undefined, { autoDismiss: 5000, closeButton: true });
            this.showProgress = false;
        }
      )    
      return  this.locFilters.Options3;
  }


  filterChange(): void {

    this.locationService.getFilterValues(
      this.locationForm.controls["filterId"].value,
      this.locationForm.controls["deviceValue"].value
    )
      .subscribe(response => {
        if(response.toString() != "Invalid"){
          //this.locationForm.controls.deviceValue.setValue(""); 
          this.locFilters.Options3 = response;
          if(this.locFilters.Options3.length !=0){
            this.locationForm.controls.deviceValue.setValue(this.locFilters.Options3[0].Value);
          }
          else
          {
            this.locationForm.controls.deviceValue.setValue('');
          }
        }        
        this.showProgress = false;
      },
        error => {
          //console.log(error),
          this.toastService.error("Unexpected Error encountered while retrieving the device information", undefined, { autoDismiss: 5000, closeButton: true });
            this.showProgress = false;
        }
      )
  }

  onSearchClick(): void {
    this.formResetting = false;
    if (this.locationForm.invalid) {
      return;
    }
    this.showProgress = true;
    this.locFilters.PageNumber = 1;
    this.locFilters.RowCount = 0;
    this.locationRows = this.locationRows.slice(0, this.locationRows.length);

    if (this.locationForm.value.dateRange)
      this.locFilters.DateRange = this.locationForm.value.dateRange;
    if (this.locationForm.value.filterId)
      this.locFilters.FilterId = this.locationForm.value.filterId;
    if (this.locationForm.value.deviceValue) {
      this.locFilters.FilterValue =
        this.locationForm.controls["deviceValue"].value.toLowerCase().startsWith("all") ?
          DeviceEnum.Zero : this.locationForm.value.deviceValue;
    }

    if (this.locationForm.value.dateRange == DeviceEnum.Zero.toString()) {
      this.getLocationList();
      
      if(this.locationRows.length === 0) {
        this.toastService.error("Records not found for device location", undefined, {autoDismiss:5000, closeButton: true });
      }
    }
    else {
      this.getHistoricalData();
    }
  }


  onExportClick(): void {

    this.formResetting = false;
    if (this.locationForm.invalid) {
      return;
    }
    this.showProgress = true;
    if (this.locationForm.value.dateRange)
      this.locFilters.DateRange = this.locationForm.value.dateRange;
    if (this.locationForm.value.filterId)
      this.locFilters.FilterId = this.locationForm.value.filterId;
    if (this.locationForm.value.deviceValue) {
      this.locFilters.FilterValue =
        this.locationForm.controls["deviceValue"].value.toLowerCase().startsWith("all") ?
          DeviceEnum.Zero : this.locationForm.value.deviceValue;
    }
    this.locFilters.IsExport = true;

    if (this.locationForm.value.dateRange == DeviceEnum.Zero.toString()) {

      this.locationService.getLocationList(this.locFilters).subscribe(response => {
        this.ExportToCSV(response.toString());
        this.locFilters.IsExport = false;
      },
        error => {
          //console.log(error),
          this.toastService.error("Unexpected Error encountered while retrieving the device information", undefined, { autoDismiss: 5000, closeButton: true });
            this.showProgress = false;
          this.locFilters.IsExport = false;
        }
      )
    }
    else {
      this.getHistoricalData();
      var data = ConvertToCSV(this.historicalRows.map(x => {
        return {
          'Device': x.Device, 'Device Identifier': x.DeviceId, 'ResourceGroupName': x.ResourceGroupName,
          'Update Time': x.UpdateTime, 'GPS Time': x.GpsTime, 'Cell': x.Cell, 'Direction': x.Direction,
          'Speed': x.Speed, 'Age Bit': x.AgeBit, 'Device State': x.DeviceStat, 'Latest Trigger': x.LatTrigger,
          'Latitude': x.LatDouble, 'Longitude': x.LongDouble, 'Altitude': x.Alt,
          'LatitudeFmt': x.Lat, 'LongitudeFmt': x.Long
        }
      }));
      this.ExportToCSV(data);
      this.showProgress = false;
      this.locFilters.IsExport = false;
    }
  }


  private ExportToCSV(response: any) {
    var csvData = new Blob([response], { type: 'text/csv;charset=utf-8;' });
    var csvURL = window.URL.createObjectURL(csvData);
    var tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'DeviceHistory.csv');
    tempLink.click();
    this.showProgress = false;
  }

  getHistoricalData() {
    let data: string;
    var ids: Array<DropDown> = [];
    var deviceIds = new String();
    this.GetHistoricalFilters(ids);
  }

  private invokeArchiveService(deviceIds: String) {
    if (deviceIds == null || deviceIds == undefined || deviceIds.length == 0) {
      this.getAllDevicesData();
    }
    else {
      this.getDevicesData(deviceIds);
    }
  }

  getDeviceDataByPage(deviceIds: String) {
    this.locationService.getDevicesDataByPage(
      deviceIds.toString(),
      this.locFilters.StartDate.toISOString(),
      this.locFilters.EndDate.toISOString(),
      this.locFilters.PageSize.toString(),
      this.locFilters.PageNumber.toString()
    ).subscribe(response => {
      this.bindLocationGrid(response, ResultSets.DEVICES_BYPAGE_RESULTSET);
    },
      error => {
        //console.log(error),
        this.toastService.error("Unexpected Error encountered while retrieving the device information", undefined, { autoDismiss: 5000, closeButton: true });
          this.showProgress = false;
      }
    );
  }

  getAllDeviceDataByPage() {
    this.locationService.getAllDevicesDataByPage(
      this.locFilters.StartDate.toISOString(),
      this.locFilters.EndDate.toISOString(),
      this.locFilters.PageSize.toString(),
      this.locFilters.PageNumber.toString()
    ).subscribe(response => {
      this.bindLocationGrid(response, ResultSets.ALL_DEVICES_BYPAGE_RESULTSET);
    },
      error => {
        //console.log(error),
        this.toastService.error("Unexpected Error encountered while retrieving the device information", undefined, { autoDismiss: 5000, closeButton: true });
          this.showProgress = false;
      }
    );
  }

  private getDevicesData(deviceIds: String) {
    this.locationService.getDevicesData(
      deviceIds.toString(),
      this.locFilters.StartDate.toISOString(),
      this.locFilters.EndDate.toISOString(),
      this.locFilters.PageSize.toString()
    ).subscribe(response => {
      this.bindLocationGrid(response, ResultSets.DEVICES_RESULTSET);
    },
      error => {
        //console.log(error),
        this.toastService.error("Unexpected Error encountered while retrieving the device information", undefined, { autoDismiss: 5000, closeButton: true });
          this.showProgress = false;
      }
    );
  }

  private getAllDevicesData() {
    this.locationService.getAllDevicesData(
      this.locFilters.StartDate.toISOString(),
      this.locFilters.EndDate.toISOString(),
      this.maxRows.toString()
    ).subscribe(response => {
      if(response != null || response !== 'Invalid'){        
        this.bindLocationGrid(response, ResultSets.ALL_DEVICES_RESULTSET);
      }
      else
        this.toastService.error("Unexpected Error encountered while retrieving the device information", undefined, { autoDismiss: 5000, closeButton: true });
    },
      error => {
        //console.log(error),
        this.toastService.error("Unexpected Error encountered while retrieving all devices information", undefined, { autoDismiss: 5000, closeButton: true });
          this.showProgress = false;
      }
    );
  }

  private GetHistoricalFilters(ids: DropDown[]): String {
    var deviceIds = new String();
    if (this.locFilters.FilterValue != "0") {
      ids.push(this.locFilters.Options3.filter(f => f.Value == this.locationForm.value.deviceValue)[0]);
    }

    //Gettting Dates
    if (this.locationForm.value.StartDate)
      this.locFilters.StartDate = new Date(this.locationForm.value.StartDate.year,
        this.locationForm.value.StartDate.month - 1,
        this.locationForm.value.StartDate.day);

    if (this.locationForm.value.FromTime) {
      this.locFilters.StartDate.setHours(
        this.locationForm.value.FromTime.hour,
        this.locationForm.value.FromTime.minute,
        this.locationForm.value.FromTime.second
      );
    }

    if (this.locationForm.value.EndDate)
      this.locFilters.EndDate = new Date(this.locationForm.value.EndDate.year,
        this.locationForm.value.EndDate.month - 1,
        this.locationForm.value.EndDate.day);

    if (this.locationForm.value.ToTime) {
      this.locFilters.EndDate.setHours(
        this.locationForm.value.ToTime.hour,
        this.locationForm.value.ToTime.minute,
        this.locationForm.value.ToTime.second
      );
    }

    if (this.locationForm.value.filterId == DeviceEnum.Two.toString()) {
      if (ids.length == 0) {
        this.locationService.getDeviceIdsForAllRgs().subscribe(response => {
          response.forEach(element => {
            deviceIds = deviceIds.concat('<int>', element, '</int>');
          });
          this.invokeArchiveService(deviceIds);
        });
      }

      else {
        this.locationService.getDeviceIds4Rg(+ids[0].Key).subscribe(response => {
          response.forEach(element => {
            deviceIds = deviceIds.concat('<int>', element, '</int>');
          });
          this.invokeArchiveService(deviceIds);
        });
      }
    }
    else {
      ids.forEach(function (row) {
        if (row.Key != DeviceEnum.Zero.toString())
          deviceIds = deviceIds.concat('<int>', row.Key, '</int>');
      });
      this.invokeArchiveService(deviceIds);
    }

    return deviceIds;
  }

  bindLocationGrid(response: string, resultName: string) {
    const xmlResponse = new DOMParser().parseFromString(response);
    const result = xmlResponse.getElementsByTagName(resultName)[0];
    this.historicalRows = [];
    for (let k = 0; k < result.childNodes.length; k++) {
      let item = result.childNodes[k];
      let loc: LocationInfo = new LocationInfo();
      if (item.getElementsByTagName("DeviceId")[0].childNodes.length == 1)
        loc.DeviceId = item.getElementsByTagName("DeviceId")[0].childNodes[0].nodeValue;
      if (item.getElementsByTagName("GpsTime")[0].childNodes.length == 1)
        loc.GpsTime = item.getElementsByTagName("GpsTime")[0].childNodes[0].nodeValue.toUt;
      if (item.getElementsByTagName("LatestTrigger")[0].childNodes.length == 1)
        loc.LatTrigger = item.getElementsByTagName("LatestTrigger")[0].childNodes[0].nodeValue;
      if (item.getElementsByTagName("UpdateTime")[0].childNodes.length == 1)
        loc.UpdateTime = item.getElementsByTagName("UpdateTime")[0].childNodes[0].nodeValue;
      if (item.getElementsByTagName("Latitude")[0].childNodes.length == 1) {
        loc.LatDouble = item.getElementsByTagName("Latitude")[0].childNodes[0].nodeValue;
        var latformt = ConvertLatitudeToDMS(+loc.LatDouble);
        loc.Lat = latformt;
      }
      if (item.getElementsByTagName("Longitude")[0].childNodes.length == 1) {
        loc.LongDouble = item.getElementsByTagName("Longitude")[0].childNodes[0].nodeValue;
        var longformt = ConvertLongitudeToDMS(+loc.LongDouble);
        loc.Long = longformt;
      }
      if (item.getElementsByTagName("Altitude")[0].childNodes.length == 1)
        loc.Alt = item.getElementsByTagName("Altitude")[0].childNodes[0].nodeValue;
      if (item.getElementsByTagName("CellName")[0].childNodes.length == 1)
        loc.Cell = item.getElementsByTagName("CellName")[0].childNodes[0].nodeValue;
      if (item.getElementsByTagName("Bearing")[0].childNodes.length == 1)
        loc.Direction = item.getElementsByTagName("Bearing")[0].childNodes[0].nodeValue;
      if (item.getElementsByTagName("Speed")[0].childNodes.length == 1)
        loc.Speed = item.getElementsByTagName("Speed")[0].childNodes[0].nodeValue;
      if (item.getElementsByTagName("AgeBit")[0].childNodes.length == 1)
        loc.AgeBit = item.getElementsByTagName("AgeBit")[0].childNodes[0].nodeValue;
      let rgName = this.rgNames.filter(f => f.Id == item.getElementsByTagName("DeviceId")[0].childNodes[0].nodeValue);
      if (rgName.length >= 1)
        loc.ResourceGroupName = rgName[0].Name;
      let triggerName = this.triggers.filter(f => f.Id == item.getElementsByTagName("LatestTrigger")[0].childNodes[0].nodeValue);
      if (triggerName.length >= 1)
        loc.LatTrigger = triggerName[0].Name;
      let devinceName = this.devices.filter(f => f.Id == item.getElementsByTagName("DeviceId")[0].childNodes[0].nodeValue);
      if (devinceName.length >= 1) {
        loc.Device = devinceName[0].Name;
        loc.NetworkDeviceIdentifier = devinceName[0].NetworkDeviceIdentifier;
      }
      this.historicalRows.push(loc);
    }
    let startIndex = 0;
    this.locationRows = this.historicalRows.slice(startIndex, this.locFilters.PageSize);
    this.locFilters.RowCount = this.historicalRows.length;
    this.showProgress = false;
  }


  getLocationList() {
    this.locationService.getLocationList(this.locFilters).subscribe(response => {
      if(response != null && response !== undefined && response !== 'Invalid' && response.length !== 0){
        this.locationRows = response;
        this.locFilters.RowCount = response !== null ? response.length : 0;
      }
      else{
        this.locationRows = [];
        this.locFilters.RowCount = 0;        
      }

      
      this.showProgress = false;
    },
      error => {
        //console.log(error),
        this.toastService.error("Unexpected Error encountered while retrieving the device information", undefined, { autoDismiss: 5000,  closeButton: true });
          this.showProgress = false;
      }
    )
  }

  getPage(page: number) {
    this.locFilters.PageNumber = page;
    if (this.locFilters.DateRange == DeviceEnum.Zero.toString())
      this.getLocationList();
    else
      this.getPagigRecords();
  }
  getPagigRecords() {
    let startIndex = (this.locFilters.PageNumber * this.locFilters.PageSize);
    this.locationRows = this.historicalRows.slice(startIndex + 1, startIndex + this.locFilters.PageSize - 1);
  }

  resetForm() {
    this.formResetting = true;
    this.locationForm.reset();
    this.getLocationList();
  }

  private buildDeviceLocationForm() {
    this.locationForm = this.formBuilder.group({
      dateRange: ["0"],
      filterId: ["0"],
      deviceValue: [""],
      StartDate: [""],
      EndDate: [""],
      FromTime: [""],
      ToTime: [""]     
    });

    this.locationForm.get("deviceValue").valueChanges.subscribe(            
      (value => {           
          if (value !== null && value.length >= 2) {    
            this.locationService.getFilterValues(this.locationForm.controls["filterId"].value,value)
            .subscribe(response => {              
              this.filteredOptions = response;
              if(this.locationForm.controls["filterId"].value != 2){
                this.filteredOptions.push({Key :'0', Value : 'All Devices'});
              }                
              else{
                this.filteredOptions.push({Key :'0', Value : 'All Resource Groups'});
              }                                   
            },
              error => {
                console.log(error)                  
              }
            )
          } else if(value.length === 0) {
              this.filteredOptions = [];
          }
      })); 

  }
}

