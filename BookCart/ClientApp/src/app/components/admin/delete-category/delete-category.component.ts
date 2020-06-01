import { Component, OnInit, Inject } from '@angular/core';
import { Category } from 'src/app/models/category';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-delete-category',
  templateUrl: './delete-category.component.html',
  styleUrls: ['./delete-category.component.scss']
})
export class DeleteCategoryComponent implements OnInit {

  public categoryData = new Category();

  constructor(
    public dialogRef: MatDialogRef<DeleteCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public categoryid: number,
    private categoryService: CategoryService) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.categoryService.deleteCategory(this.categoryid).subscribe(
      () => {
      }, error => {
        console.log('Error ocurred while fetching category data : ', error);
      });
  }

  ngOnInit() {
    console.log('categoryId', this.categoryid);
    this.categoryService.getCategoryById(this.categoryid).subscribe(
      (result: Category) => {
        this.categoryData = result;
      }, error => {
        console.log('Error ocurred while fetching category data : ', error);
      });
  }
}
