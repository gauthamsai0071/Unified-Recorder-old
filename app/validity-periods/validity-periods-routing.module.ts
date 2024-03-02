import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_guards/auth-guard';
import { ValidityPeriodsListComponent } from './list/validity-periods-list.component';
import { ManageValidityPeriodComponent } from './manage/manage-validity-period.component';



const routes: Routes = [  
    { path: '', redirectTo: 'list' },       
    { path: 'list', component: ValidityPeriodsListComponent, canActivate: [ AuthGuard ]  },   
    { path: 'add', component: ManageValidityPeriodComponent, canActivate: [ AuthGuard ]  },
    { path: 'manage/:id', component: ManageValidityPeriodComponent, canActivate: [ AuthGuard ]  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ValidityPeriodsRoutingModule {
}