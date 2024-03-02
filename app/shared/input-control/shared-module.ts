import { NgModule } from "@angular/core";
import { InputControlComponent } from "./input-control.component";
import { MsiCommonModule, IconModule, ItemModule, MsiSharedModule, ToastService , ModalService} from "@msi/cobalt";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthTokenInterceptor } from "../../_interceptors/http/AuthTokenInterceptor";
import { environment } from "../../../environments/environment";
import { GroupService } from '../../services/group/group.service';
import { EventTypeService } from 'src/app/services/event-type/event-type.service';
import { EventLogService } from 'src/app/services/event-log/event-log.service';
import { ServerityService } from 'src/app/services/severity/severity.service';
import { BoundaryConditionService } from 'src/app/services/boundary-service/boundary-condition.service';
import { ImwTimePickerComponent} from "./imw-time-picker.component"

@NgModule({
    imports: [
        MsiCommonModule, 
        IconModule,    
        ItemModule,
        MsiSharedModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    declarations: [
        InputControlComponent,
        ImwTimePickerComponent
    ],
    exports: [
        MsiCommonModule,         
        IconModule,    
        ItemModule,
        MsiSharedModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        InputControlComponent,
        ImwTimePickerComponent
    ],
    providers: [
        { provide: 'Core_BaseURL', useValue: environment.CoreBaseUrl },
        { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
        ToastService,
        ModalService,
        GroupService,
        EventTypeService,
        ServerityService,
        BoundaryConditionService
    ]   
    })
export class SharedModule {
}