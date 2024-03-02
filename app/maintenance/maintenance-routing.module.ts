import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_guards/auth-guard';
import { ThrottlingConfigurationComponent} from '../maintenance/throttling-configuration/throttling-configuration.component';
import { PurgeHistoryComponent } from '../maintenance/purge-history/purge-history.component';
import {PurgeDeleteditemsComponent} from '../maintenance/purge-deletedItems/purge-deleteditems.component';

const routes: Routes = [    
    { path: '', redirectTo: 'purge-history' },   
    { path: 'throttling-configuration', component: ThrottlingConfigurationComponent, canActivate: [ AuthGuard ]  },
    { path: 'purge-history', component: PurgeHistoryComponent, canActivate: [ AuthGuard ]  }, 
    { path: 'purge-deleteditems', component: PurgeDeleteditemsComponent, canActivate: [ AuthGuard ]  },   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MantenanceRoutingModule {
}