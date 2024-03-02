import { ManageEventTypeComponent } from './manage/manage-event-type.component';
import { NgModule } from '@angular/core';
import { EventTypeRoutingModule } from './event-type-routing.module';
import { SharedModule } from '../shared/input-control/shared-module';
import { EventTypeService } from '../services/event-type/event-type.service';
import { EventTypeListComponent } from './list/event-type-list.component';
import { EventEditTemplateComponent } from './edit-template/event-edit-template.component';
import { ActionTypeComponent } from './edit-template/action-type/action-type.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
    imports: [
        EventTypeRoutingModule,
        NgxPaginationModule,
        SharedModule
    ],
    declarations: [
        ManageEventTypeComponent,        
        EventTypeListComponent, EventEditTemplateComponent, ActionTypeComponent
    ],
    providers: [
        EventTypeService
    ]
})
export class EventTypeModule {

}
