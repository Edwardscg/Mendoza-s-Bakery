import { Product } from './product'; // Asegúrate de importar el modelo Product de tu panadería

export class Inventory {
    idInventory: number;
    currentStock: number;
    lastUpdate: string | Date; // En Angular se maneja como string (formato ISO) o tipo Date
    product: Product;          // Mapeo de la relación 1 a 1 de tu Backend
}