import { Component, OnInit, Inject } from '@angular/core';
import { Document } from 'src/app/models/document';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-delete-document',
  templateUrl: './delete-document.component.html',
  styleUrls: ['./delete-document.component.scss']
})
export class DeleteDocumentComponent implements OnInit {

  public documentData = new Document();

  constructor(
    public dialogRef: MatDialogRef<DeleteDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) public documentid: number,
    private documentService: DocumentService) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.documentService.deleteDocument(this.documentid).subscribe(
      () => {
      }, error => {
        console.log('Error ocurred while fetching document data : ', error);
      });
  }

  ngOnInit() {
    this.documentService.getDocumentById(this.documentid).subscribe(
      (result: Document) => {
        this.documentData = result;
      }, error => {
        console.log('Error ocurred while fetching document data : ', error);
      });
  }
}
