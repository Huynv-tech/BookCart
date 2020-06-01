import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { DocumentFormComponent } from '../components/admin/document-form/document-form.component';
import { ManageDocumentsComponent } from '../components/admin/manage-documents/manage-documents.component';
import { NgMaterialModule } from '../ng-material/ng-material.module';
import { DeleteDocumentComponent } from '../components/admin/delete-document/delete-document.component';

import { ManageCategoriesComponent } from '../components/admin/manage-categories/manage-categories.component';
import { CategoryFormComponent } from '../components/admin/category-form/category-form.component';
import { DeleteCategoryComponent } from '../components/admin/delete-category/delete-category.component';
@NgModule({
  declarations: [
    DocumentFormComponent,
    ManageDocumentsComponent,
    DeleteDocumentComponent,
    ManageCategoriesComponent,
    CategoryFormComponent,
    DeleteCategoryComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgMaterialModule
  ],
  entryComponents: [DeleteDocumentComponent]
})
export class AdminModule { }
