import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public REST_API_SERVER:string = `${environment.REST_API_URL}/api/${environment.version}`;

  constructor(private http:HttpClient,
      private router:Router) { }

  public getProducts(params:any = ""):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/productslist?${params.toString()}`,{ params: ""});
  }

  public storeProduct(params):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/product-store`,params);
  }

  public createProduct():Observable<any>{
    return this.http.get(`${this.REST_API_SERVER}/product-create`);
  }

  public showProduct(id:number):Observable<any>{
    return this.http.put(`${this.REST_API_SERVER}/product-show/${id}`,id);
  }

  public updateProduct(id:number,params):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/product-update/${id}`,params);
  }

  public deleteProduct(params):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/product/delete`,params);
  } 

  public productAddToCart(params):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/cart-store`,params)
  }
 
  public getCarts(params:any = ""):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/cartslist?${params.toString()}`,{ params: ""});
  }

  public updateCart(id:number,params):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/cart-update/${id}`,params);
  }

  public addLensToCart(params):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/lenscart-store`,params);
  }  

  public addMeasurementsToCart(params):Observable<any>{
    return this.http.post(`${this.REST_API_SERVER}/lensmeasurementscart-store`,params);
  }  

  public showCart(id:number):Observable<any>{
    return this.http.put(`${this.REST_API_SERVER}/cart-show/${id}`,id);
  }
}
