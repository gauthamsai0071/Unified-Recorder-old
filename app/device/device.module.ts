import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceRoutingModule } from './device-routing.module';
import { DeviceLocationComponent } from './location/devicelocation.component';
import { LocationService } from '../services/device/location.service';
import { TelemetryService } from '../services/device/telemetry.service';
import { SharedModule } from '../shared/input-control/shared-module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DeviceTelemetryComponent } from './telemetry/devicetelemetry.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [DeviceLocationComponent, DeviceTelemetryComponent],
  imports: [
    CommonModule,
    DeviceRoutingModule,
    SharedModule,    
    NgMultiSelectDropDownModule,
    NgxPaginationModule    
  ],
  providers:[LocationService, TelemetryService],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class DeviceModule { }
