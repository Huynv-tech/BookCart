import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentFormComponent } from '../components/admin/document-form/document-form.component';
import { ManageDocumentsComponent } from '../components/admin/manage-documents/manage-documents.component';
import { ManageCategoriesComponent } from '../components/admin/manage-categories/manage-categories.component';
import { CategoryFormComponent } from '../components/admin/category-form/category-form.component';

const adminRoutes: Routes = [
  {
    path: 'categories',
    children: [
      { path: 'new', component: CategoryFormComponent },
      { path: ':id', component: CategoryFormComponent },
      { path: '', component: ManageCategoriesComponent },
    ]
  },
  {
    path: 'documents',
    children: [
      { path: 'new', component: DocumentFormComponent },
      { path: ':id', component: DocumentFormComponent },
      { path: '', component: ManageDocumentsComponent },
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
