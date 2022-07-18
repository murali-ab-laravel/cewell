import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-order-place',
  templateUrl: './order-place.component.html',
  styleUrls: ['./order-place.component.css']
})
export class OrderPlaceComponent implements OnInit {

  public orderId: number;
  public orderItem:any;
  public isOrderShow:boolean = true;
  public orderForm: FormGroup;

  public paymentTypeOptions: any[] = [
    { id: 1, name: 'CASH' },
    { id: 2, name: 'UPI'},
    { id: 3, name: 'ONLINE'}
  ];

  public paymentSettlementOptions: any[] = [
    { id: 1, name: 'Full Amount' },
    { id: 2, name: 'Advance Amount' }
  ];

  public orderStatusOptions: any[] = [
    { id: 1, name: 'Progress' },
    { id: 2, name: 'Compleate'}
  ];

  public isError:boolean = false;

  constructor(
    private productService:ProductService,
    private route: ActivatedRoute,
    private fb:FormBuilder) { }

  ngOnInit(): void {
    this.orderId = +this.route.snapshot.paramMap.get('orderId');
    this.createOrderForm();
    this.getOrders();
    this.formEvents();
  }

  formEvents(){
    this.orderForm.get('paymentSettlement').valueChanges.subscribe(
      (val) =>{
        if(val.id === 1){
          this.orderForm.get('amount').setValue(this.orderItem.order.amount);
          this.orderForm.get('amount').disable();
        }else{
          this.orderForm.get('amount').setValue('');
          this.orderForm.get('amount').enable();
        }
      }
    );

    // this.orderForm.get('amount').valueChanges.subscribe((v) => {
    //   const enterAmount = +v;
    //   const orderAmount = +this.orderItem.order.amount;
    //   console.log(`${enterAmount} - ${orderAmount}`);
    //   debugger
    //     if(enterAmount > orderAmount){
    //       this.isError = true;
    //     }else{
    //       this.isError = false;
    //     }
    // });
  }

  createOrderForm(){
    this.orderForm = this.fb.group({
      paymentType: ['',[Validators.required]],
      paymentSettlement: ['',[Validators.required]], 
      amount: ['',[Validators.required]],
      // orderStatus: ['',[Validators.required]]
    });
  }

  get formValidate(){ return this.orderForm.controls; }

  getOrders(){
    this.productService.showOrder(this.orderId).subscribe( (res:any) => {
      this.orderItem = res.data;
      if(this.orderItem.order.order_status == 0){
        this.isOrderShow = true;
      }else{
        this.isOrderShow = false;
      }
    });
  }

  orderFormSubmit(){
    if(this.orderForm.invalid){
      return;
    }
    this.orderForm.get('amount').enable();

    const params = {
      paymentType: this.orderForm.value.paymentType.id.toString(),
      paymentSettlement: this.orderForm.value.paymentSettlement.id.toString(), 
      amount: this.orderForm.value.amount,
      // orderStatus: this.orderForm.value.orderStatus.id.toString(),   
     };

    this.productService.updateOrder(this.orderId,params).subscribe( (res:any) => {
      this.orderItem = res.data;
      this.isOrderShow = false;
      console.log(res);
    });
  }
}
