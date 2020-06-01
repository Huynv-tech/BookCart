import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  baseURL: string;

  constructor(private http: HttpClient) {
    this.baseURL = '/api/document/';
  }

  getAllDocuments() {
    return this.http.get(this.baseURL)
      .pipe(map(response => {
        return response;
      }));
  }

  getCategories() {
    return this.http.get(this.baseURL + 'GetCategoriesList')
      .pipe(map(response => {
        return response;
      }));
  }

  addDocument(document) {
    return this.http.post(this.baseURL, document)
      .pipe(map(response => {
        return response;
      }));
  }

  getDocumentById(id: number) {
    return this.http.get(this.baseURL + id)
      .pipe(map(response => {
        return response;
      }));
  }

  getsimilarDocuments(documentId: number) {
    return this.http.get(this.baseURL + 'GetSimilarDocuments/' + documentId)
      .pipe(map(response => {
        return response;
      }));
  }

  updateDocumentDetails(document) {
    return this.http.put(this.baseURL, document)
      .pipe(map(response => {
        return response;
      }));
  }

  deleteDocument(id) {
    return this.http.delete(this.baseURL + id)
      .pipe(map(response => {
        return response;
      }));
  }
}
