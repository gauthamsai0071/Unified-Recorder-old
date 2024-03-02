import { NgModule } from '@angular/core';
import { ValidityPeriodsRoutingModule } from './validity-periods-routing.module';
import { SharedModule } from '../shared/input-control/shared-module';
import { ValidityPeriodService } from '../services/boundary-service/validity-period.service';
import { ValidityPeriodsListComponent } from './list/validity-periods-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ManageValidityPeriodComponent } from './manage/manage-validity-period.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
    imports: [
        ValidityPeriodsRoutingModule,
        NgxPaginationModule,
        SharedModule,
        NgbModule
    ],
    declarations: [
        ValidityPeriodsListComponent,        
        ManageValidityPeriodComponent        
    ],
    providers: [
        ValidityPeriodService
    ]
})
export class ValidityPeriodsModule {

}