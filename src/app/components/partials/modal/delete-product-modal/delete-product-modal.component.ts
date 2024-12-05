import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'node-delete-product-modal',
  templateUrl: './delete-product-modal.component.html',
  styleUrls: ['./delete-product-modal.component.css']
})
export class DeleteProductModalComponent implements OnInit {
  faCheck = faCheck;
  @Input() product!: Product;
  userId: string = '';

  constructor(private auth: AuthService,
              private productService: ProductService,
              private router: Router
  ) { }

  ngOnInit(): void {
    this.userId = this.auth.userId;
  }

  deleteProduct(product: Product){
     // verification des permissions avant de procéder
     if (this.product.userId !== this.userId) {
      console.log("You can't delete this product");
      this.router.navigate(['/not-found']);

      return
    }

    this.productService.deleteProduct(product._id as string)
    .then(()=>{
      console.log('Product deleted');
      //this.router.navigate(['/shop']);
    })
    .catch((err)=>{
      console.log(err.message);
      return this.router.navigate(['/shop']);
    })

  }

}
