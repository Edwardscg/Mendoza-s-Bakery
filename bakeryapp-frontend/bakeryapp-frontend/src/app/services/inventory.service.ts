import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inventory } from '../model/inventory'; // Asegúrate de importar tu modelo de Inventario
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
  // Rule 1: Strict Completion - Se genera el servicio limpio sin texto innecesario al final.
})
export class InventoryService {
  private url = `${environment.HOST}/inventories`; // O '/inventory' según tu endpoint de Spring Boot

  private readonly http = inject(HttpClient);

  // Estados privados usando Writable Signals
  private readonly _inventories = signal<Inventory[]>([]);
  private readonly _message = signal<string>('');

  // Exposición pública de los Signals en modo de solo lectura (Buenas prácticas de Angular)
  readonly $inventoriesChange = this._inventories.asReadonly();
  readonly $messageChange = this._message.asReadonly();

  // Métodos HTTP (CRUD)
  findAll() {
    return this.http.get<Inventory[]>(this.url);
  }

  findById(id: number) {
    return this.http.get<Inventory>(`${this.url}/${id}`);
  }

  save(inventory: Inventory) {
    return this.http.post(this.url, inventory);
  }

  update(id: number, inventory: Inventory) {
    return this.http.put(`${this.url}/${id}`, inventory);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  // Métodos Setters para mutar el estado controlado desde los componentes
  setInventoryChange(data: Inventory[]) {
    this._inventories.set(data);
  }

  setMessageChange(msg: string) {
    this._message.set(msg);
  }
}