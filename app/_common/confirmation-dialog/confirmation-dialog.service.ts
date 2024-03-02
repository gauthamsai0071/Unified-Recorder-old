import { Injectable } from '@angular/core';
import { ModalService } from '@msi/cobalt';
import { Observable } from 'rxjs';
import { ConfirmDialogModel,ConfirmationDialogComponent } from './confirmation-dialog.component';

@Injectable()
export class ConfirmationDialogService {
    result: Observable<any> ;
    
    constructor(private modalService: ModalService) { }

    
    public confirmDialog (
        title: string,
        message: string,
        btnOkText: string,
        btnCancelText: string,
        dialogSize: 'small'|'medium' = 'medium' ): Observable<boolean> {            

            const dialogData = new ConfirmDialogModel(title, message, btnOkText, btnCancelText);

            const dialogRef = this.modalService.open(ConfirmationDialogComponent, {
                size : dialogSize,
                data: dialogData
              });

          return dialogRef.afterClosed();
      }
}