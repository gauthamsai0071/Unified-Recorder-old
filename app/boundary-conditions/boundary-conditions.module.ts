import { NgModule } from '@angular/core';
import { BoundaryConditionsRoutingModule } from './boundary-conditions-routing.module';
import { SharedModule } from '../shared/input-control/shared-module';
import { BoundaryConditionService } from '../services/boundary-service/boundary-condition.service';
import { ManageBoundaryConditionComponent } from './manage/manage-boundary-condition.component';
import { BoundaryConditionsListComponent } from './list/boundary-conditions-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AttributeBoundaryConditionComponent } from './attributes/attribute-boundary-condition.component';

@NgModule({
    imports: [
        BoundaryConditionsRoutingModule,
        NgMultiSelectDropDownModule,
        SharedModule,
        NgbModule
    ],
    declarations: [
        BoundaryConditionsListComponent,
        ManageBoundaryConditionComponent,
        AttributeBoundaryConditionComponent
        
    ],
    providers: [
        BoundaryConditionService
    ]
})
export class BoundaryConditionsModule {

}