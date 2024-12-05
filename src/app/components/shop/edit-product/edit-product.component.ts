import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'node-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  productForm!: FormGroup;
  errorMessage: string = '';
  imagePreview: string = '';
  loading: boolean = false;
  userId!: string;
  product!: Product;

  constructor(private formBuilder: FormBuilder,
              private productService: ProductService,
              private auth: AuthService,
              private route: ActivatedRoute,
              private router: Router,
  ) { }

  ngOnInit(): void {
    this.userId = this.auth.userId;
    this.loading = true;
    this.route.params.subscribe(
      (params: Params)=>{
        const id = params['id'];
        this.productService.getProductById(id)
        .then((product: Product)=>{
          this.product = product;
          //vérification pour savoir si le produit appartient à l'utilisateur
          if (this.product.userId !== this.userId) {
            console.log("You can't edit this product");
            return this.router.navigate(['/not-found']);
          }
          this.productForm = this.formBuilder.group({
            name: [this.product.name, Validators.required],
            description: [this.product.description, Validators.required],
            stock: [this.product.stock, Validators.required],
            price: [this.product.price/100, Validators.required],
            image: [this.product.image, Validators.required]
          });
          this.imagePreview = product.image;
          this.loading = false;
          console.log('Initialisation :'+this.productForm.get('image')?.value);

          return
        })
        .catch((err)=>{
          console.log(err.message);
          return this.router.navigate(['/shop']);
        })
      }
    )
  }

  onSubmit() {
    this.loading = true;

    // verification des permissions avant de procéder
    if (this.product.userId !== this.userId) {
      console.log("You can't edit this product");
      this.router.navigate(['/not-found']);

      return
    }
    const imageFile = this.productForm.get('image')?.value; // Peut être un fichier ou une URL

    const product = new Product(
      this.productForm.get('name')?.value,
      this.productForm.get('description')?.value,
      this.productForm.get('price')?.value * 100,
      this.productForm.get('stock')?.value,
      typeof imageFile === 'string' ? imageFile : '', // On utilise l'URL si ce n'est pas un fichier
      this.product.userId,
      new Date(),
      this.product._id
    );

    // Appel de la méthode updateProduct avec l'image
    this.productService.updateProduct(product._id as string, product, imageFile)
      .then(() => {
        this.productForm.reset();
        this.loading = false;
        this.router.navigate(['/shop']);
      })
      .catch(err => {
        this.loading = false;
        this.errorMessage = err.message;
      });
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
          this.imagePreview = reader.result as string;
          console.log('chargement : '+this.imagePreview);

          //if (this.productForm.get('image')?.valid) {
          //} else{
          //  this.imagePreview = '';
          //}
        }
        //lecture du fichier
        //console.log(reader.readAsDataURL(file));
        console.log('Lecture du fichier : '+reader.readAsDataURL(file));
        reader.readAsDataURL(file);

      } else{
        console.error("Aucun fichier selectionné");
      }
    } else{
      console.error("Aucun fichier selectionner ou l'élément est null");
    }
  }

}
