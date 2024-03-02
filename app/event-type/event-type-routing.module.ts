import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_guards/auth-guard';
import { ManageEventTypeComponent } from './manage/manage-event-type.component';
import { EventTypeListComponent } from './list/event-type-list.component';
import { EventEditTemplateComponent } from './edit-template/event-edit-template.component';

const routes: Routes = [    
    { path: '', redirectTo: 'list' },
    { path: 'list', component: EventTypeListComponent, canActivate: [ AuthGuard ]  },    
    { path: 'add', component: ManageEventTypeComponent, canActivate: [ AuthGuard ]  },
    { path: 'manage/:id', component: ManageEventTypeComponent, canActivate: [ AuthGuard ]  },
    { path: 'edit-template/:id', component: EventEditTemplateComponent, canActivate: [ AuthGuard ]  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EventTypeRoutingModule {
}
