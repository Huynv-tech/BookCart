import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Document } from 'src/app/models/document';
import { DocumentService } from 'src/app/services/document.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-similarbooks',
  templateUrl: './similarbooks.component.html',
  styleUrls: ['./similarbooks.component.scss']
})
export class SimilarbooksComponent implements OnInit, OnDestroy {

  @Input('documentId') documentId;

  public documents: Document[];
  private unsubscribe$ = new Subject<void>();

  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      this.route.params.subscribe(
        params => {
          this.documentId = +params['id'];
          this.getSimilarBookData();
        }
      );
    });
  }

  getSimilarBookData() {
    this.documentService.getsimilarDocuments(this.documentId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Document[]) => {
        this.documents = Object.values(data);
      }, error => {
        console.log('Error ocurred while fetching book details : ', error);
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
