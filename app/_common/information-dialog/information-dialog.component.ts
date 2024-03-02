import { Component, Input, OnInit,Inject } from '@angular/core';
import { MsiModalRef,MSI_MODAL_DATA } from '@msi/cobalt';

@Component({  
  templateUrl: './information-dialog.component.html',
  styleUrls: ['./information-dialog.component.scss']
})
export class InformationDialogComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;

  constructor(public dialogRef: MsiModalRef,
    @Inject(MSI_MODAL_DATA) public data: InformationDialogModel) { 
      this.title = data.title;
      this.message = data.message;
      this.btnOkText = data.btnOkText;      
    }

  ngOnInit(): void {
  }

  onConfirm() {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }
}

export class InformationDialogModel { 
  constructor(public title: string, public message: string, public btnOkText : string) {
  }

}
