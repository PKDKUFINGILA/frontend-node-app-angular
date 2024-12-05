import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Data } from '../models/data';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  api = environment.api;
  products: Product[] = [];
  products$ = new Subject<Product[]>();

  constructor(private http: HttpClient) {}

  emitProduct(){
    this.products$.next(this.products)
  }

  getProducts(){
    this.http.get<Data>(this.api+'/products').subscribe(
      (data: Data)=>{
        if(data.status === 200){
          if (Array.isArray(data.result)) {
            this.products = data.result;
            this.emitProduct();
          }else{
            console.error("la reponse n'est pas un tableau de produits");
          }
        } else{
          console.log(data);
        }
      },
      (err)=>{
        console.log(err);
      }
    )
  }

  getProductById(id: string): Promise<Product>{
    return new Promise((resolve, reject)=>{
      this.http.get<Data>(this.api+'/products/'+id).subscribe(
        (data: Data)=>{
          if(data.status === 200){
            if (typeof data.result === 'object' && !Array.isArray(data.result)) {
              resolve(data.result as Product)
            }
            //resolve(data.result as Product)
            //this.products = data.result;
            //this.emitProduct()
          } else{
            reject(data.message);
          }
        },
        (err)=>{
          reject(err);
        }
      )
    })
  }

  createNewProduct(product: Product, image: File){
    return new Promise((resolve, reject)=>{
      let productData: FormData = new FormData();
      productData.append('product', JSON.stringify(product));
      productData.append('image', image);

      this.http.post<Data>(this.api+'/products', productData).subscribe(
        (data: Data)=>{
          if (data.status === 201) {
            this.getProducts();
            resolve(data)
          }else{
            reject(data.message)
          }
        },
        (err)=>{reject(err)}
      )
    })
  }

  updateProduct(id: string, product: Product, image: File | string){
    return new Promise((resolve, reject)=>{
      let productData: FormData = new FormData();

      if(typeof image === 'string'){
        product.image = image;
      }else{
        productData.append('image', image);
      }
      productData.append('product', JSON.stringify(product));

      this.http.put<Data>(this.api+'/products/'+id, productData).subscribe(
        (data: Data)=>{
          if(data.status === 200){
            resolve(data)
          } else{
            reject(data.message)
          }
        },
        (err)=>{
          console.error('erreur lors de la requête : ', err);
          reject(err)
        }
      )
    })
  }

  deleteProduct(id: string){
    return new Promise((resolve, reject)=>{
      this.http.delete(this.api+'/products/'+id).subscribe(
        ()=>{
          this.getProducts();
          resolve(true);
        },
        (err)=>{
          reject(err)
        }
      )
    })
  }

}
