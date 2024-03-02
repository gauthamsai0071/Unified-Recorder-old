import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards/auth-guard';
import { LogsComponent } from './logs.component';


const routes: Routes = [  
  { path: '', redirectTo: 'list', canActivate:[AuthGuard] },
  {  path: 'list', component:LogsComponent, canActivate:[AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditlogsRoutingModule { }
