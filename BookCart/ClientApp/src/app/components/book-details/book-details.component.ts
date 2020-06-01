import { Component, OnInit, OnDestroy } from '@angular/core';
import { Document } from 'src/app/models/document';
import { DocumentService } from 'src/app/services/document.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, Observable, combineLatest } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit, OnDestroy {

  public document: Document;
  documentId;
  private unsubscribe$ = new Subject<void>();

  constructor(private documentService: DocumentService, private route: ActivatedRoute, private router: Router) {
    this.documentId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      this.route.params.subscribe(
        params => {
          this.documentId = +params['id'];
          this.getBookDetails();
        }
      );
    });
  }

  getBookDetails() {
    this.documentService.getDocumentById(this.documentId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (result: Document) => {
          this.document = result;
        }, error => {
          console.log('Error ocurred while fetching book data : ', error);
        });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
