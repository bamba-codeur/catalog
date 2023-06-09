export interface  ProductModel{

  id: string;
  name:string;
  price:number;
  promotion:boolean;

}


export interface ProductPage{

  products:ProductModel[];
  page:number;
  size:number;
  totalPages:number
}
