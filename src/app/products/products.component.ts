import { Component, OnInit } from '@angular/core';
import {ProductService} from "../services/product.service";
import {ProductModel, ProductPage} from "../model/product.model";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products!: Array<ProductModel>;
  errorsMsg!: string;
  searchFormGroups !: FormGroup;
  currentPage:number=0;
  pageSize:number=5;
totalPages:number=0;
  private currentAction: string="all";

  constructor(private productService: ProductService, private fb:FormBuilder) {

  }

  ngOnInit(): void {

    this.searchFormGroups=this.fb.group({
      "keyword":this.fb.control(null)
    })
    this.handleGetPageProducts();
  }

  handleGetAllProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data: any) => {
        this.products = data;
      },
      error: (err) => {
        this.errorsMsg = err;
      }

    });
  }
  handleGetPageProducts() {
    this.productService.getPageProducts(this.currentPage,this.pageSize).subscribe({
      next: (data:ProductPage) => {
        this.products = data.products;
        this.totalPages=data.totalPages;
      },
      error: (err) => {
        this.errorsMsg = err;
      }

    });
  }

  handleDeleteProducts(p: any) {

    let conf=confirm("Etes-vous sur de vouloir supprimer ?");
    if(conf==false)return;
    this.productService.deleteProducts(p.id).subscribe({

      next: (data: boolean) => {
        //this.handleGetAllProducts();
        let index=this.products.indexOf(p);
        this.products.splice(index,1);
      }
    })

  }

  HandleSetPromotion(p:ProductModel) {
    let promo=p.promotion;
      this.productService.setPromotion(p.id).subscribe({
        next: (data=> {
          console.log("ok");
            p.promotion=!promo;

        }),
        error:(err=>{
          this.errorsMsg=err;
        })
      })

  }

  HandleSearchProducts() {
    this.currentAction="search";
    this.currentPage=0;
    
    let keyword=this.searchFormGroups.value.keyword;
      this.productService.searchProducts(keyword,this.currentPage,this.pageSize).subscribe({
        next: (data) =>{
          this.products=data.products;
          this.totalPages=data.totalPages;
        },

      });
  }

  gotoPage(i: number) {
    this.currentPage=i;

    if(this.currentAction=="all")
      this.handleGetPageProducts()
    else
      this.HandleSearchProducts();
  }
}
