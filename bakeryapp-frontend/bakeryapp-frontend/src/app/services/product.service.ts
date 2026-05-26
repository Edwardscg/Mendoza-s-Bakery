import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model/product';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private url = `${environment.HOST}/products`;

  private readonly http = inject(HttpClient);
  private readonly _products = signal<Product[]>([]);
  private readonly _message = signal<string>('');

  readonly $productsChange = this._products.asReadonly();
  readonly $messageChange = this._message.asReadonly();

  findAll() {
    return this.http.get<Product[]>(this.url);
  }

  findById(id: number) {
    return this.http.get<Product>(`${this.url}/${id}`);
  }

  save(product: Product) {
    return this.http.post(this.url, product);
  }

  update(id: number, product: Product) {
    return this.http.put(`${this.url}/${id}`, product);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  setProductChange(data: Product[]) {
    this._products.set(data);
  }

  setMessageChange(msg: string) {
    this._message.set(msg);
  }

}
