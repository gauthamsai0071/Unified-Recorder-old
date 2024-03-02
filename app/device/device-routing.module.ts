import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards/auth-guard';
import { DeviceLocationComponent } from './location/devicelocation.component';
import { DeviceTelemetryComponent } from './telemetry/devicetelemetry.component';

const routes: Routes = [
  { path: '', redirectTo: 'location'},
  { path: 'location', component: DeviceLocationComponent, canActivate: [AuthGuard]},
  { path: 'locationInfo/:id', component: DeviceLocationComponent, canActivate: [AuthGuard]},
  { path: 'telemetry', component: DeviceTelemetryComponent, canActivate: [ AuthGuard ]  },
  { path: 'telemetryInfo/:id', component: DeviceTelemetryComponent, canActivate: [ AuthGuard ]  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceRoutingModule { }
