import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_guards/auth-guard';
import { BoundaryConditionsListComponent } from './list/boundary-conditions-list.component';
import { ManageBoundaryConditionComponent } from './manage/manage-boundary-condition.component';
import { AttributeBoundaryConditionComponent } from './attributes/attribute-boundary-condition.component';


const routes: Routes = [ 
    { path: '', redirectTo: 'list' },       
    { path: 'list', component: BoundaryConditionsListComponent, canActivate: [ AuthGuard ]  },   
    { path: 'add', component: ManageBoundaryConditionComponent, canActivate: [ AuthGuard ]  },
    { path: 'manage/:id', component: ManageBoundaryConditionComponent, canActivate: [ AuthGuard ]  },
    { path: 'attributes/:id', component: AttributeBoundaryConditionComponent, canActivate: [ AuthGuard ]  }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BoundaryConditionsRoutingModule {
}