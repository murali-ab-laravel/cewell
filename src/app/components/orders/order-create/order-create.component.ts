import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css']
})
export class OrderCreateComponent implements OnInit {
  public SERVER_PATH = environment.REST_API_URL;
  public orderId:number;
  public customer:any;
  public orderItems:any[] = [];
  public order:any;
  public total:number = 0;
  
  constructor(private productService: ProductService,
    private router:ActivatedRoute) { }

  ngOnInit(): void {

    this.orderId = +this.router.snapshot.paramMap.get('orderId');
    this.getData();
  }

  getData(){
    this.productService.showOrder(this.orderId).subscribe(
      (res) => {
        console.log(res);
        this.customer = res.data.order.customer;
        this.orderItems = res.data.order.orderitems;
        this.order = res.data.order;
        // this.orderItems.forEach(r => this.total += (r.product.price * r.quantities))
      }
    )
  }

}
