import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Document } from 'src/app/models/document';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent {

  @Input('document') document: Document;

  isActive = false;

  constructor(private router: Router) { }

  goToPage(id: number) {
    this.router.navigate(['/books/details/', id]);
  }
}
