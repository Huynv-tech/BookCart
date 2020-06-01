import { Component, OnInit } from '@angular/core';
import { Document } from 'src/app/models/document';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from 'src/app/services/document.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public documents: Document[];
  public filteredProducts: Document[];
  category: string;

  constructor(private route: ActivatedRoute, private documentService: DocumentService) { }

  ngOnInit() {
    this.getAllBookData();
  }

  getAllBookData() {
    this.documentService.getAllDocuments().pipe(switchMap(
      (data: Document[]) => {
        this.filteredProducts = data;
        return this.route.queryParams;
      }
    )).subscribe(params => {
      this.category = params['category'];
      this.documents = (this.category) ?
        this.filteredProducts.filter(b => b.category.toLowerCase() === this.category.toLowerCase()) :
        this.filteredProducts;
    });
  }
}
