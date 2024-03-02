import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_guards/auth-guard';
import { ManageSeverityLevelComponent } from './manage/manage-severity-level.component';
import { SeverityLevelComponent } from './list/severity-level.component';

const routes: Routes = [    
    { path: '', redirectTo: 'list' },
    { path: 'list', component: SeverityLevelComponent, canActivate: [ AuthGuard ]  },    
    { path: 'add', component: ManageSeverityLevelComponent, canActivate: [ AuthGuard ]  },
    { path: 'manage/:id', component: ManageSeverityLevelComponent, canActivate: [ AuthGuard ]  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SeverityRoutingModule {
}
