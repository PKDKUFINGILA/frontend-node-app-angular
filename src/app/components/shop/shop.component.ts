import { Component, OnInit } from '@angular/core';
import {faCartShopping} from '@fortawesome/free-solid-svg-icons'
import { BehaviorSubject, Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'node-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  faCartShopping = faCartShopping;
  products: Product[] = [];
  productSub!: Subscription;
  loading: boolean = false;
  userId!: string;
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productSub = this.productService.products$.subscribe(
      (products: Product[])=>{
        this.loading = true;
        this.products = products;
      },
      (err)=>{
        this.loading = false;
        console.log(err);
      }
    );
    this.productService.getProducts();
  }

  ngOnDestroy(): void{
    //Called once, before the instance is destroyed.
    //Add 'implements onDestroy' to the class.
    this.productSub.unsubscribe();
  }

}
