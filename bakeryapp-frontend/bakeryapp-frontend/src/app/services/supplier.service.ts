import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Supplier } from '../model/supplier';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private url = `${environment.HOST}/suppliers`;

  private readonly http = inject(HttpClient);

  private readonly _suppliers = signal<Supplier[]>([]);
  private readonly _message = signal<string>('');

  readonly $supplierChange = this._suppliers.asReadonly();
  readonly $messageChange = this._message.asReadonly();

  // GET, POST, PUT, DELETE

  findAll() {
    return this.http.get<Supplier[]>(this.url);
  }

  findById(id: number) {
    return this.http.get<Supplier>(`${this.url}/${id}`);
  }

  save(supplier: Supplier) {
    return this.http.post(this.url, supplier);
  }

  update(id: number, supplier: Supplier) {
    return this.http.put(`${this.url}/${id}`, supplier);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  ///set///

  setSupplierChange(data: Supplier[]) {
    this._suppliers.set(data);
  }

  setMessageChange(msg: string) {
    this._message.set(msg);
  }
}
