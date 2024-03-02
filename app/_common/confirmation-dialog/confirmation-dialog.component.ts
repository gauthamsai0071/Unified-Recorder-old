import { Component, Input, OnInit,Inject } from '@angular/core';
import { MsiModalRef,MSI_MODAL_DATA } from '@msi/cobalt';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;

  constructor(public dialogRef: MsiModalRef,
    @Inject(MSI_MODAL_DATA) public data: ConfirmDialogModel) { 
      this.title = data.title;
      this.message = data.message;
      this.btnOkText = data.btnOkText;
      this.btnCancelText = data.btnCancelText;
    }

  ngOnInit(): void {
  }

  onConfirm() {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }
 
  onDismiss() {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}

export class ConfirmDialogModel { 
  constructor(public title: string, public message: string, public btnOkText : string , public btnCancelText : string) {
  }
}