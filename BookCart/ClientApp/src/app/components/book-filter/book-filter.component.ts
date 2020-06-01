import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { DocumentService } from 'src/app/services/document.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { User } from 'src/app/models/user';
import { UserType } from 'src/app/models/usertype';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-book-filter',
  templateUrl: './book-filter.component.html',
  styleUrls: ['./book-filter.component.scss']
})
export class BookFilterComponent implements OnInit {

  displayedColumns: string[] = ['title', 'description', 'coverFileName', 'category', 'content', 'mineType'];

  dataSource = new MatTableDataSource<Document>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private unsubscribe$ = new Subject<void>();
  @Input('category')
  category;

  categoryList: [];
  userId;
  userDataSubscription: any;
  userData = new User();
  userType = UserType;

  constructor(private documentService: DocumentService,
    private snackBarService: SnackbarService,
    private subscriptionService: SubscriptionService) {

    this.userDataSubscription = this.subscriptionService.userData.asObservable().subscribe(data => {
      this.userData = data;
    });

    this.userId = localStorage.getItem('userId');
    
  }
   getAllDocumentData() {
      this.documentService.getAllDocuments()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((data: Document[]) => {
          this.dataSource.data = Object.values(data);
        }, error => {
          console.log('Error ocurred while fetching Document details : ', error);
        });
   }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

    ngOnInit() {
      this.documentService.getCategories().subscribe(
        (categoryData: []) => {
          this.categoryList = categoryData;
        }, error => {
          console.log('Error ocurred while fetching category List : ', error);
        });
      this.getAllDocumentData();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    ngOnDestroy() {
      if (this.userDataSubscription) {
        this.userDataSubscription.unsubscribe();
      }
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }

}
