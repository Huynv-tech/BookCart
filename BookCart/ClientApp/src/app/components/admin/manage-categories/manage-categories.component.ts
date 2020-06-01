import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { DeleteCategoryComponent } from '../delete-category/delete-category.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.scss']
})
export class ManageCategoriesComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['id', 'categoryName', 'operation'];

  dataSource = new MatTableDataSource<Category>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private unsubscribe$ = new Subject<void>();
  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private snackBarService: SnackbarService) {
  }

  ngOnInit() {
    this.getAllCategoryData();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllCategoryData() {
    this.categoryService.getAllCategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Category[]) => {
        this.dataSource.data = Object.values(data);
      }, error => {
        console.log('Error ocurred while fetching Category details : ', error);
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteConfirm(id: number): void {
    console.log('deleteConfirm', id);
    this.categoryService.deleteCategory(id).subscribe(
      () => {
        this.getAllCategoryData();
      }, error => {
        console.log('Error ocurred while fetching category data : ', error);
      });
    //const dialogRef = this.dialog.open(DeleteCategoryComponent, {
    //  data: id
    //});

    //dialogRef.afterClosed()
    //  .pipe(takeUntil(this.unsubscribe$))
    //  .subscribe(result => {
    //    if (result === 1) {
    //      this.getAllCategoryData();
    //      this.snackBarService.showSnackBar('Data deleted successfully');
    //    } else {
    //      this.snackBarService.showSnackBar('Error occurred!! Try again');
    //    }
    //  });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
