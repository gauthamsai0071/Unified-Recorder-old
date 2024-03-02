import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_guards/auth-guard';
import { EventLogListComponent } from './list/event-log-list.component';

const routes: Routes = [    
    { path: '', redirectTo: 'list' },
    { path: 'list', component: EventLogListComponent, canActivate: [ AuthGuard ]  },    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EventLogRoutingModule {
}
