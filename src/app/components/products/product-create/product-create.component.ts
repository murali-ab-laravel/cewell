import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Role } from '../../../auth/models/roles';
import { GET_ALL, CURRENT_PAGE } from '../../../shared/constants/pagination.contacts';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RolesService } from '../../../services/roles.service';
import { CommonService } from '../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {

  public uploadType:string ="products";
  /** USING THIS TO RESET FORM  WITH OUT SHOWING FORMVALIDAITON ERRORS**/
  @ViewChild('myForm', {static: false}) myForm: NgForm;
 public productForm:FormGroup;

 public roles:Role[];
 public item_types:any[];
 public rim_types:any[];
 public brands:any[];
 public shapes:any[];
 public collection_types:any[];
 public materials:any[];
 public prescription_types:any[];
 public glass_colors:any[];
 public frame_widths:any[];
 public page_length:number = GET_ALL;
 public current_page:number = CURRENT_PAGE;

 public productId:number = undefined;
 public buttonText:string = "Create";


  constructor(private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb:FormBuilder,
    private commonService: CommonService,
    private rolesService:RolesService,
    private productService:ProductService) { 
     this.productId = data.id;
    }

  ngOnInit(): void {
    this.createproductForm();
    this.getCustomerData();
  }

  getCustomerData():void{

    if(this.productId == undefined){
      this.productService.createProduct().subscribe(
        (res:any)=>{
            this.item_types = res.data.item_types;
            this.rim_types = res.data.rim_types;
            this.brands = res.data.brands;
            this.shapes = res.data.shapes;
            this.collection_types = res.data.collection_types;
            this.materials = res.data.materials;
            this.prescription_types = res.data.prescription_types;
            this.glass_colors = res.data.glass_colors;
            this.frame_widths = res.data.frame_widths;
        }
      )
    }else{
      this.buttonText = "Update";
      this.productService.showProduct(this.productId).subscribe(
        (res:any)=>{

          this.item_types = res.data.item_types;
          this.rim_types = res.data.rim_types;
          this.brands = res.data.brands;
          this.shapes = res.data.shapes;
          this.collection_types = res.data.collection_types;
          this.materials = res.data.materials;
          this.prescription_types = res.data.prescription_types;
          this.glass_colors = res.data.glass_colors;
          this.frame_widths = res.data.frame_widths;

            let product = res.data.customer;

            this.productForm.patchValue({
              name: product.name,
              item_type: product.item_type,
              item_code: product.item_code,
              item_description: product.item_description,
              price: product.price,
              brand: +product.brand,
              model: product.model,
              color: product.color,
              size: product.size,
              rim_type: product.rim_type,
              collection_type: +product.collection_type,
              material: +product.material,
              prescription_type: +product.prescription_type,
              glass_color: +product.glass_color,
              frame_width: +product.frame_width,
              catalog_no: product.catalog_no,
              images: product.images,
            });
        }
      )
    }
   
  }

  createproductForm(){
    this.productForm = this.fb.group({
      name: ['',[Validators.required]],
      item_type: ['',[Validators.required]],
      item_code: ['',[Validators.required]],
      item_description: ['',[Validators.required]],
      price: ['',[Validators.required]],
      brand: ['',[Validators.required]],
      model: ['',[Validators.required]],
      color: ['',[Validators.required]],
      size: ['',[Validators.required]],
      rim_type: ['',[Validators.required]],
      collection_type: ['',[Validators.required]],
      material: ['',[Validators.required]],
      prescription_type: ['',[Validators.required]],
      glass_color: ['',[Validators.required]],
      frame_width: ['',[Validators.required]],
      catalog_no: ['',[Validators.required]],
      images: [''],
    })
  }

  get formValidate(){
    return this.productForm.controls;
  }

  addAttachment(fileName:any){
    this.productForm.patchValue({images: fileName})
  }



  productFormSubmit(){

    if(this.productForm.invalid){
      return;
    }

    if(this.productId == undefined){
      this.productService.storeProduct(this.productForm.value).subscribe(
        (response)=>{
            this.productForm.reset();
            this.myForm.resetForm();
            this.commonService.openAlert(response.message); 
            this.createproductForm();
        },
        (err)=>{ 

            if (err instanceof HttpErrorResponse) {
              if(err.status === 422) {
                const validatonErrors = err.error.errors;
                Object.keys(validatonErrors).forEach( prop => {
                  const formControl = this.productForm.get(prop);
                  if(formControl){
                    formControl.setErrors({
                      serverError: validatonErrors[prop]
                    });
                  }
                });
              }
            }
        }
      )

    }else{
      this.productService.updateProduct(this.productId,this.productForm.value).subscribe(
        (response)=>{
            this.commonService.openAlert(response.message); 
            this.cancel();
        },
        (err)=>{ 
            if (err instanceof HttpErrorResponse) {
              if(err.status === 422) {
                const validatonErrors = err.error.errors;
                Object.keys(validatonErrors).forEach( prop => {
                  const formControl = this.productForm.get(prop);
                  if(formControl){
                    formControl.setErrors({
                      serverError: validatonErrors[prop]
                    });
                  }
                });
              }
            }
        }
      )
    }
  }

  cancel():void{
    this.dialog.closeAll();
  }

 


}
