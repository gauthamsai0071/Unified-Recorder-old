import { NgModule } from '@angular/core';
import { EventLogRoutingModule } from './event-log-routing.module';
import { SharedModule } from '../shared/input-control/shared-module';
import { EventLogService } from '../services/event-log/event-log.service';
import { EventLogListComponent } from './list/event-log-list.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
    imports: [
        EventLogRoutingModule,
        NgMultiSelectDropDownModule,
        NgxPaginationModule,
        SharedModule
    ],
    declarations: [          
        EventLogListComponent
    ],
    providers: [
        EventLogService
    ]
})
export class EventLogModule {

}