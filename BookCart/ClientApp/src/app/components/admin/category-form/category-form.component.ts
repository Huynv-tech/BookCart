import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, OnDestroy {

  private formData = new FormData();
  categoryForm: FormGroup;
  category: Category = new Category();
  formTitle = 'Add';
  categoryId;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router) {

    this.categoryForm = this.fb.group({
      categoryId: 0,
      categoryName: ['', Validators.required]
    });

    if (this.route.snapshot.params['id']) {
      this.categoryId = this.route.snapshot.paramMap.get('id');
    }
  }

  get categoryName() {
    return this.categoryForm.get('categoryName');
  }

  ngOnInit() {
    if (this.categoryId) {
      this.formTitle = 'Edit';
      this.categoryService.getCategoryById(this.categoryId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (result: Category) => {
            this.setCategoryFormData(result);
          }, error => {
            console.log('Error ocurred while fetching category data : ', error);
          });
    }
  }

  saveCategoryData() {
    if (!this.categoryForm.valid) {
      return;
    }
    
    this.formData.append('categoryFormData', JSON.stringify(this.categoryForm.value));
    if (this.categoryId) {
      this.categoryService.updateCategoryDetails(this.formData)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          () => {
            this.router.navigate(['/admin/categories']);
          }, error => {
            console.log('Error ocurred while updating category data : ', error);
          });
    } else {
      this.categoryService.addCategory(this.formData)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          () => {
            this.router.navigate(['/admin/categories']);
          }, error => {
            // reset form and show a toaster
            this.categoryForm.reset();
            console.log('Error ocurred while adding category data : ', error);
          });
    }
  }

  cancel() {
    this.router.navigate(['/admin/categories']);
  }

  setCategoryFormData(categoryFormData) {
    this.categoryForm.setValue({
      categoryId: categoryFormData.categoryId,
      categoryName: categoryFormData.categoryName
    });
    
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
