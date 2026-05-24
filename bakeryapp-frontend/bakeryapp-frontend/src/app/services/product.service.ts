import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model/product';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private url = `${environment.HOST}/products`;

  private readonly http = inject(HttpClient);

  findAll() {
    return this.http.get<Product[]>(this.url);
  }

}