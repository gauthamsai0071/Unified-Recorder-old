import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guards/auth-guard';
import { HomeComponent } from '../app/home/home.component';


const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] }, 
  { path: 'login', component: LoginComponent },
  {
    path: 'event-log', canActivate: [AuthGuard],
    loadChildren: () => import('./event-log/event-log.module').then(event => event.EventLogModule)
  },
  {
    path: 'event-types', canActivate: [AuthGuard],
    loadChildren: () => import('./event-type/event-type.module').then(event => event.EventTypeModule)
  },
  {
    path: 'severity', canActivate: [AuthGuard],
    loadChildren: () => import('./severity/severity.module').then(severity => severity.SeverityModule)
  },
  {
    path: 'boundary-conditions', canActivate: [AuthGuard],
    loadChildren: () => import('./boundary-conditions/boundary-conditions.module').then(boundaryService => boundaryService.BoundaryConditionsModule)
  },
  {
    path: 'validity-periods', canActivate: [AuthGuard],
    loadChildren: () => import('./validity-periods/validity-periods.module').then(validityperiod => validityperiod.ValidityPeriodsModule)
  },
  {
    path: 'auditlogs', canActivate: [AuthGuard],
    loadChildren: () => import('./audit-logs/auditlogs.module').then(auditLogsServie => auditLogsServie.AuditlogsModule)
  },
  {
    path: 'devices', canActivate: [AuthGuard],
    loadChildren: () => import('./device/device.module').then(locationService => locationService.DeviceModule)
  },
  {
    path: 'telemetry', canActivate: [AuthGuard],
    loadChildren: () => import('./device/device.module').then(telemetryService => telemetryService.DeviceModule)
  },
  {
    path: 'maintenance', canActivate: [AuthGuard],
    loadChildren: () => import('./maintenance/maintenance.module').then(throttlingService => throttlingService.MaintenanceModule)
  },
  {
    path: 'purge-history', canActivate: [AuthGuard],
    loadChildren: () => import('./maintenance/maintenance.module').then(purgeService => purgeService.MaintenanceModule)
  },
  {
    path: 'purge-deleteditems', canActivate: [AuthGuard],
    loadChildren: () => import('./maintenance/maintenance.module').then(purgeService => purgeService.MaintenanceModule)
  },
  // { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
