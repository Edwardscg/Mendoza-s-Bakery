import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Supplier } from '../model/supplier';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private url = `${environment.HOST}/suppliers`;

  private readonly http = inject(HttpClient);

  // GET, POST, PUT, DELETE
  findAll() {
    return this.http.get<Supplier[]>(this.url);
  }
}
