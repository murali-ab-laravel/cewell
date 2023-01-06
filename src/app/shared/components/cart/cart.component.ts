import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { PrescriptionService } from '../../../services/prescription.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

  public cartList:any = [];
  public prescriptionList:any = [];
  public TotalCartItem:number;

  public total:number = 0;
  public subtotal:number = 0;
  public discount:number = 0;
  public coupon:string;
  public userDetails = this.authenticationService.getUserDetails();
  public customerId:string = this.authenticationService.getCustomerId();;
  constructor(private productService:ProductService,
    private authenticationService: AuthenticationService,
    private prescriptionService: PrescriptionService,
    private _router: Router) { }

  ngOnInit(): void {
    
    this.getCartItems();
    this.getPrescriptoins();
  }

  getCartItems():void{
    let params = new HttpParams();
    params = params.set('current_page', '1');
    params = params.set('per_page', '100');
    params = params.set('customerId', this.customerId);

    this.productService.getCarts(params)
    .subscribe((response: any) =>{
      this.cartList = response.data;
      this.TotalCartItem = response.total;
      this.total = 0;
      this.discount = 0;
      this.subtotal = 0;

      this.cartList.map(cart => {
        this.subtotal += cart.product.price * cart.quantities;
        this.discount += +cart.discount;
      });

      this.total = this.subtotal - this.discount;
      this.authenticationService.setTotalCartItems(this.TotalCartItem);


    })
  }

  getPrescriptoins():void{
    let params = new HttpParams();
    params = params.set('customerId', this.customerId);

    this.prescriptionService.getPrescriptions(params)
    .subscribe((response: any) =>{
      this.prescriptionList = response.data;
    })
  }

  cartUpdate(event){
    this.getCartItems();
  }

  navigateToPlaceOrder(){

    if(this.cartList.length > 0){
      let params = { customerId: this.customerId, userId: this.userDetails.user_id };
      this.productService.storeOrder(params).subscribe(
        (res:any) => {
          this._router.navigate(['/order-place',res.data.id]);
        },
        err => console.log(err)
      );
    }
  }

  
  ngOnDestroy() {
    this.authenticationService.setTotalCartItems(0);
  }

}
