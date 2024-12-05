import { Component, OnInit } from '@angular/core';
import {faCartShopping} from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'node-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  faCartShopping = faCartShopping;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  products: Product[] = [];
  productSub!: Subscription;
  loading: boolean = false;
  userId!: string;
  constructor(private productService: ProductService,
              private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.userId = this.auth.userId;
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
