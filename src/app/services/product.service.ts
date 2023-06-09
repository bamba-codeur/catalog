import { Injectable } from '@angular/core';
import {Observable,of,throwError} from "rxjs";
import {ProductModel, ProductPage} from "../model/product.model";
import {UUID} from "angular2-uuid";






@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products!: Array<ProductModel>;

  constructor() {
    this.products=[
      {id: UUID.UUID() ,name:"Computer", price:2500,promotion:true},
      {id:UUID.UUID() ,name:"Printer", price:7500,promotion:false},
      {id:UUID.UUID() ,name:"Smartphone", price:8500,promotion:true},
      {id:UUID.UUID() ,name:"Smartphone", price:8500,promotion:true},
    ]
    for(let i=0; i<10;i++){
      this.products.push({id: UUID.UUID() ,name:"Computer", price:2500,promotion:true})
      this.products.push({id: UUID.UUID() ,name:"Computer", price:2500,promotion:true})
      this.products.push(  {id:UUID.UUID() ,name:"Printer", price:7500,promotion:false})
    }
  }

  public getPageProducts(page:number,size:number):Observable<ProductPage>{
    let index=page*size;
    let totalPages= ~~(this.products.length/size);

    if((this.products.length % size) !=0)
      totalPages++;
    let pageProducts=this.products.slice(index,index+size);
    return of({page :page,size:size,totalPages:totalPages,products:pageProducts});

  }


  public getAllProducts(): Observable<ProductModel[]>{
    let rnd=Math.random();
    if(rnd<0.1) return throwError( ()=> new Error("Internet connexion error"));
    else return of(this.products);
  }

  public deleteProducts(id:string):Observable<boolean>{
    this.products=this.products.filter(p=>p.id!=id);
    return of(true);

  }
  public setPromotion(id:string):Observable<boolean>{
    let product = this.products.find(p => p.id == id);
    if (product != undefined) {
      product.promotion = !product.promotion;
      return of(true);
    } else return throwError(() => {
      new Error("Product not found !")
    })
  }

  public searchProducts(keyword:string,page:number,size:number):Observable<ProductPage>{

    let result= this.products.filter(p=>p.name.includes(keyword));
    let index=page*size;
    let totalPages= ~~(this.products.length/size);

    if((this.products.length % size) !=0)
      totalPages++;

    let pageProducts=result.slice(index,index+size);
    return of({page :page,size:size,totalPages:totalPages,products:pageProducts});


  }
}
