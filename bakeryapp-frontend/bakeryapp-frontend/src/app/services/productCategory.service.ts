import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { productCategory } from '../model/productCategory';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService {
  private url = `${environment.HOST}/product-categories`;
  private readonly http = inject(HttpClient);

  private readonly _productCategories = signal<productCategory[]>([]);
  private readonly _message = signal<string>('');

  readonly $productCategoriesChange = this._productCategories.asReadonly();
  readonly $messageChange = this._message.asReadonly();

  findAll() {
    return this.http.get<productCategory[]>(this.url);
  }

  findById(id: number) {
    return this.http.get<productCategory>(`${this.url}/${id}`);
  }

  save(category: productCategory) {
    return this.http.post(this.url, category);
  }

  update(id: number, category: productCategory) {
    return this.http.put(`${this.url}/${id}`, category);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  setProductCategoryChange(data: productCategory[]) {
    this._productCategories.set(data);
  }

  setMessageChange(msg: string) {
    this._message.set(msg);
  }
}
