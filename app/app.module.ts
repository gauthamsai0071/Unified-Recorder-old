import { MsiCommonModule, MsiSharedModule, IconModule, SidenavModule, ItemModule, DataTableModule, ModalModule, ModalService } from '@msi/cobalt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationbarComponent } from './navigation-bar/navigation-bar.component'
import { LoginComponent } from './login/login.component';
import { MessageService } from './services/common/message.service';
import { SharedModule } from './shared/input-control/shared-module';
import { ConfirmationDialogComponent } from './_common/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './_common/confirmation-dialog/confirmation-dialog.service';
import { InformationDialogComponent } from './_common/information-dialog/information-dialog.component';
import { InformationDialogService } from './_common/information-dialog/information-dialog.service';


@NgModule({
  declarations: [
    AppComponent,
    NavigationbarComponent,
    LoginComponent,
    ConfirmationDialogComponent,
    InformationDialogComponent,    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    SidenavModule,   
    ReactiveFormsModule    
  ],
  providers: [
    ModalService,
    MessageService,
    ConfirmationDialogService,
    InformationDialogService
  ],
  entryComponents: [ConfirmationDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
