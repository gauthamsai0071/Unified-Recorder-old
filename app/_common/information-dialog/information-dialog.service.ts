import { Injectable } from '@angular/core';
import { ModalService } from '@msi/cobalt';
import { Observable } from 'rxjs';
import { InformationDialogModel,InformationDialogComponent } from './information-dialog.component';

@Injectable()
export class InformationDialogService {
    result: Observable<any> ;
    
    constructor(private modalService: ModalService) { }

    
    public confirmDialog (
        title: string,
        message: string,
        btnOkText: string,
        dialogSize: 'small'|'medium' = 'medium' ): Observable<boolean> {            

            const dialogData = new InformationDialogModel(title, message, btnOkText);

            const dialogRef = this.modalService.open(InformationDialogComponent, {
                size : dialogSize,
                data: dialogData
              });

          return dialogRef.afterClosed();
      }
}