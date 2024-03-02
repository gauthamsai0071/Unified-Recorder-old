import { NgModule } from '@angular/core';
import { LogsComponent } from './logs.component';
import { AuditlogsRoutingModule } from './auditlogs-routing.module';
import { AuditLogService } from '../services/audit/audit-log.service';
import { SharedModule } from '../shared/input-control/shared-module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NpUiTimePickerModule } from "np-ui-time-picker";
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [LogsComponent],
  imports: [    
    SharedModule,
    AuditlogsRoutingModule,
    NgMultiSelectDropDownModule,
    NpUiTimePickerModule,
    NgxPaginationModule
  ],
  providers:[AuditLogService]
})
export class AuditlogsModule { }
