import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Document } from 'src/app/models/document';
import { DocumentService } from 'src/app/services/document.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.scss']
})
export class DocumentFormComponent implements OnInit, OnDestroy {

  private formData = new FormData();
  documentForm: FormGroup;
  document: Document = new Document();
  formTitle = 'Add';
  coverImagePath;
  documentId;
  files;
  categoryList: [];
  private unsubscribe$ = new Subject<void>();

  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router) {

    this.documentForm = this.fb.group({
      documentId: 0,
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      content: ['', Validators.required],
      mineType: ['', Validators.required],
      //price: ['', [Validators.required, Validators.min(0)]],
    });

    if (this.route.snapshot.params['id']) {
      this.documentId = this.route.snapshot.paramMap.get('id');
    }
  }

  get title() {
    return this.documentForm.get('title');
  }

  get description() {
    return this.documentForm.get('description');
  }

  get category() {
    return this.documentForm.get('category');
  }

  get content() {
    return this.documentForm.get('content');
  }

  get mineType() {
    return this.documentForm.get('mineType');
  }

  ngOnInit() {
    this.documentService.getCategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (categoryData: []) => {
          this.categoryList = categoryData;
        }, error => {
          console.log('Error ocurred while fetching category List : ', error);
        });

    if (this.documentId) {
      this.formTitle = 'Edit';
      this.documentService.getDocumentById(this.documentId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (result: Document) => {
            this.setDocumentFormData(result);
          }, error => {
            console.log('Error ocurred while fetching Document data : ', error);
          });
    }
  }

  saveDocumentData() {
    if (!this.documentForm.valid) {
      return;
    }
    if (this.files && this.files.length > 0) {
      for (let j = 0; j < this.files.length; j++) {
        this.formData.append('file' + j, this.files[j]);
      }
    }
    this.formData.append('documentFormData', JSON.stringify(this.documentForm.value));
    if (this.documentId) {
      this.documentService.updateDocumentDetails(this.formData)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          () => {
            this.router.navigate(['/admin/documents']);
          }, error => {
            console.log('Error ocurred while updating document data : ', error);
          });
    } else {
      this.documentService.addDocument(this.formData)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          () => {
            this.router.navigate(['/admin/documents']);
          }, error => {
            // reset form and show a toaster
            this.documentForm.reset();
            console.log('Error ocurred while adding document data : ', error);
          });
    }
  }

  cancel() {
    this.router.navigate(['/admin/documents']);
  }

  setDocumentFormData(documentFormData) {
    console.log(documentFormData);
    this.documentForm.setValue({
      documentId: documentFormData.documentId,
      title: documentFormData.title,
      description: documentFormData.description,
      category: documentFormData.category,
      content: documentFormData.content,
      mineType: documentFormData.mineType
    });
    this.coverImagePath = '/Upload/' + documentFormData.coverFileName;
  }

  uploadImage(event) {
    this.files = event.target.files;
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (myevent: ProgressEvent) => {
      this.coverImagePath = (myevent.target as FileReader).result;
    };
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
