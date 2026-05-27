import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service';
import { ProductService } from '../../../services/product.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Inventory } from '../../../model/inventory';
import { Product } from '../../../model/product';
import { switchMap, tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-inventory-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    RouterLink
  ],
  templateUrl: './inventory-edit.component.html',
  styleUrls: ['./inventory-edit.component.css'],
})
export class InventoryEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly inventoryService = inject(InventoryService);
  private readonly productService = inject(ProductService);

  // Signal para almacenar los productos que se listarán en el selector del formulario
  protected $products = signal<Product[]>([]);

  // Formulario reactivo mapeado con los campos exactos de tu entidad de backend Inventory
  protected $form = signal(new FormGroup({
    idInventory: new FormControl<number | null>(null),
    currentStock: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    lastUpdate: new FormControl<string | Date>(''),
    product: new FormControl<Product | null>(null, [Validators.required]),
  }));

  private readonly $params = toSignal(
    this.route.params,
    { initialValue: {} }
  );

  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  constructor() {
    // Carga la lista de productos disponibles al inicializar el componente para el combobox
    this.productService.findAll()
      .subscribe(data => this.$products.set(data));

    // Efecto reactivo para escuchar cambios en el ID de la ruta y cargar el registro correspondiente
    effect(() => {
      const id = this.$id();
      if (id) {
        this.inventoryService.findById(Number(id))
          .subscribe(data => {
            this.$form().patchValue({
              idInventory: data.idInventory,
              currentStock: data.currentStock,
              // Corta la cadena de fecha a formato ISO local (yyyy-MM-ddThh:mm) requerido por input datetime-local
              lastUpdate: data.lastUpdate ? new Date(data.lastUpdate).toISOString().slice(0, 16) : '',
              product: data.product
            });
          });
      }
    });
  }

  operate() {
    const form = this.$form();
    if (form.invalid) return;

    const isEdit = this.$isEdit();
    const id = Number(this.$id());
    const inventory: Inventory = form.value as Inventory;

    // Determina la operación HTTP correspondiente del servicio (Guardar o Actualizar)
    const operation$ = isEdit
      ? this.inventoryService.update(id, inventory)
      : this.inventoryService.save(inventory);

    operation$
      .pipe(
        switchMap(() => this.inventoryService.findAll()),
        tap(data => this.inventoryService.setInventoryChange(data)),
        tap(() =>
          this.inventoryService.setMessageChange(
            isEdit ? 'UPDATED' : 'CREATED'
          )
        )
      )
      .subscribe(() => {
        this.router.navigate(['/pages/inventory']);
      });
  }

  // Compara las referencias de los objetos de tipo Product para realizar la preselección correcta en modo edición
  compareProducts(product1: Product | null, product2: Product | null) {
    return product1?.idProduct === product2?.idProduct;
  }
}