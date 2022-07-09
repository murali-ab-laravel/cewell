import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.css']
})
export class CustomerOrdersComponent implements OnInit {

  public orders:number[] = [1,2,3,4,5,6];
  
  constructor() { }

  ngOnInit(): void {
  }

}
