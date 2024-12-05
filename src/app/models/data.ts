import {Product} from './product';

export class Data {
  status!: number; // Indique que la propriété sera initialisée plus tard
  message!: string;
  result!: Product[] | Product;
}
