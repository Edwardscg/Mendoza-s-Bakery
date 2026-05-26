import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Customer } from '../../../model/customer';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-customer-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.css',
})
export class CustomerEditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customerService = inject(CustomerService);

  protected $form = signal(
    new FormGroup({
      idCategory: new FormControl<number | null>(null),
      name: new FormControl<string>(''),
      description: new FormControl<string>(''),
      status: new FormControl<boolean | null>(true),
    }),
  );

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id()); //En JS es como decir  !! ¿Existe realmente este dato?, devuelve true o false

  constructor() {
    effect(() => {
      const id = this.$id();
      if (id) {
        this.customerService.findById(id).subscribe((data) => this.$form().patchValue(data));
      }
    });
  }

  /*ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      console.log('ID:', id);
    });
  }*/

  operate() {
    const form = this.$form();
    const isEdit = this.$isEdit();
    const id = this.$id();

    const customer: Customer = form.value as Customer;
    /*const patient: Category = new Category();
    patient.idCategory = form.value.idCategory;
    patient.name = form.value.name;
    patient.description = form.value.description;
    patient.status = form.value.status;*/

    const operation$ = isEdit
      ? this.customerService.update(id, customer)
      : this.customerService.save(customer);

    operation$
      .pipe(
        switchMap(() => this.customerService.findAll()),
        tap((data) => this.customerService.setCustomerChange(data)),
        tap(() => this.customerService.setMessageChange(isEdit ? 'UPDATED' : 'CREATED')),
      )
      .subscribe(() => {
        this.router.navigate(['/pages/category']);
      });
  }
}
