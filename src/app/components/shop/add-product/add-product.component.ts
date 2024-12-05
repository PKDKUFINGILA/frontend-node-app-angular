import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'node-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  errorMessage: string = '';
  imagePreview: string = '';
  loading: boolean = false;
  userId!: string;

  constructor(private formBuilder: FormBuilder,
              private auth: AuthService,
              private productService: ProductService,
              private route: Router
  ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      stock: [2, Validators.required],
      price: [0, Validators.required],
      image: [null, Validators.required]
    });
    this.userId = this.auth.userId as string;
  }

  onSubmit(){
    this.loading = true;
    const product = new Product(
      this.productForm.get('name')?.value,
      this.productForm.get('description')?.value,
      this.productForm.get('price')?.value * 100,
      this.productForm.get('stock')?.value,
      '',
      this.userId,
      new Date()
    );
    //product.name = this.productForm.get('name')?.value;
    //product.description = this.productForm.get('description')?.value;
    //product.price = this.productForm.get('price')?.value;
    //product.stock = this.productForm.get('stock')?.value;
    //product.image = '';
    //product.userId = this.userId;

    //save product
    this.productService.createNewProduct(product, this.productForm.get('image')?.value)
    .then(()=>{
      this.productForm.reset();
      this.loading = false;
      this.route.navigate(['/shop']);
    })
    .catch((err)=>{
      this.loading = false;
      this.errorMessage = err.message;
    })
  }

  onImagePick(event: Event){
    const fileInput = (event.target as HTMLInputElement);
    if (fileInput && fileInput.files) {
      const file = fileInput.files[0];

      if (file) {
        this.productForm.get('image')?.patchValue(file);
        this.productForm.get('image')?.updateValueAndValidity();

        const reader = new FileReader();
        reader.onload = ()=>{
          if (this.productForm.get('image')?.valid) {
            this.imagePreview = reader.result as string;
          } else{
            this.imagePreview = '';
          }
        }
        //lecture du fichier
        reader.readAsDataURL(file);
      } else{
        console.error("Aucun fichier selectionné");
      }
    } else{
      console.error("Aucun fichier selectionner ou l'élément est null");
    }
  }

}
