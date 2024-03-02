import { NgModule } from '@angular/core';
import { MantenanceRoutingModule } from './maintenance-routing.module';
import { SharedModule } from '../shared/input-control/shared-module';
import { ThrottlingService } from '../services/maintenance/throttling';
import { ThrottlingConfigurationComponent } from '../maintenance/throttling-configuration/throttling-configuration.component';
import { PurgeHistoryComponent } from '../maintenance/purge-history/purge-history.component';
import { PurgeService } from '../services/maintenance/purge';
import { PurgeDeleteditemsComponent } from './purge-deletedItems/purge-deleteditems.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
    imports: [
        MantenanceRoutingModule,
        NgxPaginationModule,
        SharedModule
    ],
    declarations: [        
    ThrottlingConfigurationComponent, 
    PurgeHistoryComponent, PurgeDeleteditemsComponent
    ],
    providers: [
        ThrottlingService,
        PurgeService
    ]
})
export class MaintenanceModule {

}
