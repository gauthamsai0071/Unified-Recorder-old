import { ManageSeverityLevelComponent } from './manage/manage-severity-level.component';
import { NgModule } from '@angular/core';
import { SeverityRoutingModule } from './severity-routing.module';
import { SharedModule } from '../shared/input-control/shared-module';
import { SeverityLevelComponent } from './list/severity-level.component';
import { ServerityService } from '../services/severity/severity.service';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
    imports: [
        SeverityRoutingModule,
        NgxPaginationModule,
        SharedModule
    ],
    declarations: [
        ManageSeverityLevelComponent,        
        SeverityLevelComponent
    ],
    providers: [
        ServerityService
    ]
})
export class SeverityModule {

}
