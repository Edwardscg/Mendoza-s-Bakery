import { ProductCategory } from "./productCategory";

export class Product {

    idProduct: number;

    name: string;

    description: string;

    salePrice: number;

    productionCost: number;

    type: string;

    unitMeasure: string;

    status: boolean;

    category: ProductCategory;

}
