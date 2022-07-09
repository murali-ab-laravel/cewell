import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { PAGE_SIZE_OPTIONS, PAGE_LENGTH, ITEMS_PER_PAGE, CURRENT_PAGE } from '../../../shared/constants/pagination.contacts';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from '../../../services/common.service';
import { ProductService } from '../../../services/product.service';
import { HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-order-products',
  templateUrl: './order-products.component.html',
  styleUrls: ['./order-products.component.css']
})
export class OrderProductsComponent implements OnInit {

  @Output() productAdded = new EventEmitter();
  
  @ViewChild('paginator', {static: true}) paginator: MatPaginator;

  public PAGE_SIZE_OPTIONS_DATA:number[] = PAGE_SIZE_OPTIONS;

  public page_length:number = PAGE_LENGTH;

  public items_per_page:number = ITEMS_PER_PAGE;

  public current_page:number = CURRENT_PAGE;

  public products:any = [];
  
  public dataSource = new MatTableDataSource<any>();

  public cartProductList = [];

  public customerId:string|number = this.authenticationService.getCustomerId();

  public toggle = new FormControl(false);
  public showView:boolean = false;

  
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private commonService:CommonService,
    private productService:ProductService,
    private authenticationService:AuthenticationService
  ) { 
    matIconRegistry.addSvgIcon(
      "filter",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/SVG/filter.svg")
      );
      
  }
  
  ngOnInit(): void {
    console.log(this.customerId)
    // if(this.customerId == undefined || this.customerId == null){
      this.authenticationService.getCustomerSubject().subscribe(
        (input) => {
          this.customerId = input;
          console.log(this.customerId)
        }
      )
    // }
    this.getData(this.current_page, this.page_length);

   this.toggle.valueChanges.subscribe(e => {
      this.showView = e;
   })
  }

  ngAfterViewInit(){
    // this.dataSource.paginator = this.paginator;
  }

 

  getData(currentPage, perPage):void{
    let params = new HttpParams();
    params = params.set('current_page', currentPage);
    params = params.set('per_page', perPage);

    this.productService.getProducts(params)
    .subscribe((response: any) =>{

      this.products = response.data;
      this.products.length = response.total;

      this.dataSource = new MatTableDataSource<any[]>(this.products);
      this.dataSource.paginator = this.paginator;

    })
  }

  getNextData(currentSize, currentPage, perPage):void{
    let params = new HttpParams();
    params = params.set('current_page', currentPage);
    params = params.set('per_page', perPage);

    this.productService.getProducts(params).subscribe(
      (response: any) =>{

        this.products.length = currentSize;
        this.products.push(...response.data);

        this.products.length = response.total;

        this.dataSource = new MatTableDataSource<any[]>(this.products);
        this.dataSource._updateChangeSubscription();

        this.dataSource.paginator = this.paginator;
    })
  }

  pageChanged(event):void{

    let pageIndex = event.pageIndex + 1;
    let pageSize = event.pageSize;

    let previousIndex = event.previousPageIndex;

    let previousSize = pageSize * pageIndex;

    this.getNextData(previousSize, (pageIndex).toString(), pageSize.toString());
  }

  addProductToCart(id:any) {
    let params = { productId: id, customerId: this.customerId };
    this.productService.productAddToCart(params).subscribe(
      (response:any) =>{
        let data = response.data;
        this.commonService.openAlert(response.message); 
        console.log(data);
      }
    )
  }


}
