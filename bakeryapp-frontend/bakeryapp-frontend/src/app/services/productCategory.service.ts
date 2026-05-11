import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { productCategory } from '../model/productCategory';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService {
  
  private url = `${environment.HOST}/productCategories`;
  
  private readonly http = inject(HttpClient);
  
  // GET, POST, PUT, DELETE
  findAll() {
    return this.http.get<productCategory[]>(this.url);
  }
}
