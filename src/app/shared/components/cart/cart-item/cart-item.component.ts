import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PrescriptionService } from '../../../../services/prescription.service';
import { ProductService } from '../../../../services/product.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { CommonService } from '../../../../services/common.service';

const dialogConfig= new MatDialogConfig();
dialogConfig.disableClose = true;
dialogConfig.autoFocus = true;

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit {

  public SERVER_PATH = environment.REST_API_URL;
  @Input() cart:any;
  @Input() prescriptions:any;

  @Output() newEvent = new EventEmitter();

  public prescription:any;
  public prescriptionForm:FormGroup;

  public selected:number = 0;
  public lensForm:FormGroup;
  public measurementsForm:FormGroup;
  
  public life_styles:string[] = [];
  public lens_recommendeds:string[] = [];
  public tint_types:string[] = [];
  public mirror_coatings:string[] = [];
  public colours:string[] = [];
  public gradients:string[] = [];

  public diameters:string[] = [];
  public base_curves:string[] = [];
  public vertex_distances:string[] = [];
  public pantascopic_angles:string[] = [];
  public frame_wrap_angles:string[] = [];
  public reading_distances:string[] = [];
  public shapes:string[] = [];

  public productDiscount:number = 0;
  public productTotal:number = 0;
  public productQuantity:number = 0;
  public productPrice:number = 0;

  constructor(private fb:FormBuilder,
    private dialog:MatDialog,
    private commonService: CommonService,
    private prescriptionService: PrescriptionService,
    private productService:ProductService) { }

  ngOnInit(): void {
    this.createForm();
    this.createLensForm();
    this.createMeasurementsForm();
    this.getDetails();
    this.getCart();
    this.setupProductDetails();
    this.prescriptionForm.get('prescriptionId').valueChanges.subscribe(id => {
      this.prescription = this.prescriptions.find(p => p.id === id);
    })
  }

  getDetails():void{
    this.prescriptionService.createPrescription().subscribe(
      (res:any) => {
      
         this.life_styles = res.data.life_styles;
         this.lens_recommendeds = res.data.lens_recommendeds;
         this.tint_types = res.data.tint_types;
         this.mirror_coatings = res.data.mirror_coatings;
         this.colours = res.data.tint_colors;
         this.gradients = res.data.tint_gradients;

         this.diameters = res.data.diameters;
         this.base_curves = res.data.base_curves;
         this.vertex_distances = res.data.vertex_distances;
         this.pantascopic_angles = res.data.pantascopic_angles;
         this.frame_wrap_angles = res.data.frame_wrap_angles;
         this.reading_distances = res.data.reading_distances;
         this.shapes = res.data.shapes;

      },
      (err) => {
        console.log(err);
      }
    )
  }

  getCart(){
    this.productService.showCart(this.cart.id).subscribe(
      (response:any) => {
        if(response.data.cart.prescription != undefined){
          this.prescription = response.data.cart.prescription;
          this.prescriptionForm.patchValue({
            prescriptionId: response.data.cart.prescription.id
          });
        }
        if(response.data.cart.lens != undefined){
          this.lensForm.patchValue({
            life_style: +response.data.cart.lens.life_style,
            lens_recommended: +response.data.cart.lens.lens_recommended,
            tint_type: response.data.cart.lens.tint_type,
            mirror_coating: +response.data.cart.lens.mirror_coating,
            colour: +response.data.cart.lens.tint_value,
            gradient: +response.data.cart.lens.tint_value,
          });
        }
          
        if( 
          response.data.cart.measurements != undefined && 
          response.data.cart.measurements.precalvalues.length >= 2  &&
          response.data.cart.measurements.thickness.length >= 3
          ){
          this.measurementsForm.patchValue({
              diameter: +response.data.cart.measurements.diameter,
              base_curve: +response.data.cart.measurements.base_curve,
              vertex_distance: +response.data.cart.measurements.vertex_distance,
              pantascopic_angle: +response.data.cart.measurements.pantascopic_angle,
              frame_wrap_angle: +response.data.cart.measurements.frame_wrap_angle,
              reading_distance: +response.data.cart.measurements.reading_distance,
              shapes: response.data.cart.measurements.shape,
              precal_values: {
                right_value: {
                  pd: response.data.cart.measurements.precalvalues[0].pd,
                  ph: response.data.cart.measurements.precalvalues[0].ph,
                },
                left_value: {
                  pd: response.data.cart.measurements.precalvalues[1].pd,
                  ph: response.data.cart.measurements.precalvalues[1].ph,
                },
              },
              thickness: {
                center_thickness: {
                  right: response.data.cart.measurements.thickness[0].right,
                  left:  response.data.cart.measurements.thickness[0].left
                },
                nose_edge_thickness: {
                  right: response.data.cart.measurements.thickness[1].right,
                  left:  response.data.cart.measurements.thickness[1].left
                },
                temple_edge_thickness: {
                  right: response.data.cart.measurements.thickness[2].right,
                  left:  response.data.cart.measurements.thickness[2].left
                },
              },
              lens_size:{
                lens_width: response.data.cart.measurements.lens_width,
                bridge_distance: response.data.cart.measurements.bridge_distance,
                lens_height: response.data.cart.measurements.lens_height,
                temple: response.data.cart.measurements.temple,
                total_width: response.data.cart.measurements.total_width,
              }
          });

        }
      }
    );
  }

  createForm(){
    this.prescriptionForm = this.fb.group({
      prescriptionId:["",[Validators.required]]
    })
  }
   
  createLensForm():void{
    this.lensForm = this.fb.group({
        life_style: ["",[Validators.required]],
        lens_recommended: ["",[Validators.required]],
        tint_type: ["",[Validators.required]],
        mirror_coating: ["",[Validators.required]],
        colour: ["",[Validators.required]],
        gradient: ["",[Validators.required]],
    });
  }

  get lensFormValidate(){ return this.lensForm.controls; }

  
  get precalRightValuesValidate(){ return this.measurementsFormValidate.precal_values.get("right_value")["controls"]; }
  get precalLeftValuesValidate(){ return this.measurementsFormValidate.precal_values.get("left_value")["controls"]; }

  get centerThicknessValidate(){ return this.measurementsFormValidate.thickness.get("center_thickness")["controls"]; }
  get noseEdgeThicknessValidate(){ return this.measurementsFormValidate.thickness.get("nose_edge_thickness")["controls"]; }
  get templeEdgeThicknessValidate(){ return this.measurementsFormValidate.thickness.get("temple_edge_thickness")["controls"]; }

  get lensSizeValidate(){ return this.measurementsFormValidate.lens_size["controls"]; }

  
  createMeasurementsForm():void{
    this.measurementsForm = this.fb.group({
      diameter: ["",[Validators.required]],
      base_curve: ["",[Validators.required]],
      precal_values: this.fb.group({
        right_value: this.fb.group({
          pd: ["",[Validators.required]],
          ph: ["",[Validators.required]],
        }),
        left_value: this.fb.group({
          pd: ["",[Validators.required]],
          ph: ["",[Validators.required]],
        }),
      }),
      vertex_distance: ["",[Validators.required]],
      pantascopic_angle: ["",[Validators.required]],
      frame_wrap_angle: ["",[Validators.required]],
      reading_distance: ["",[Validators.required]],
      thickness: this.fb.group({
        center_thickness: this.fb.group({
          right: ["",[Validators.required]],
          left: ["",[Validators.required]],
        }),
        nose_edge_thickness: this.fb.group({
          right: ["",[Validators.required]],
          left: ["",[Validators.required]],
        }),
        temple_edge_thickness: this.fb.group({
          right: ["",[Validators.required]],
          left: ["",[Validators.required]],

          
        }),
      }),
      shapes: ["",[Validators.required]],
      lens_size: this.fb.group({
        lens_width: ["",[Validators.required]],
        bridge_distance: ["",[Validators.required]],
        lens_height: ["",[Validators.required]],
        temple: ["",[Validators.required]],
        total_width: ["",[Validators.required]],
      }) 
    });
  }

  get measurementsFormValidate(){ return this.measurementsForm.controls; }
  
  tintTypeChange(type:string){
    if(type === "Colour"){
      this.lensFormValidate.colour.setValidators([Validators.required]);
      this.lensFormValidate.gradient.setValidators(null);
    }else{
      this.lensFormValidate.colour.setValidators(null);
      this.lensFormValidate.gradient.setValidators([Validators.required]);
    }

    this.lensFormValidate.colour.updateValueAndValidity();
    this.lensFormValidate.gradient.updateValueAndValidity();
  }

  tabChange(input:number = 0){

    if(input === 1){
      this.prescriptionFormSubmit()
    }else if (input === 2){
      this.lensFormSubmit();
    }

    this.selected = input;
  }

  setupProductDetails(){
    this.productPrice = +this.cart.product.price;
    this.productQuantity = +this.cart.quantities;
    this.calculateTotal();
  }

  calculateTotal(){
    this.productTotal  = this.productPrice * this.productQuantity;
  }

  increment(){
    this.productQuantity++;
    this.cartUpdate();
  }

  decrement(){
    if(this.productQuantity > 0){
      this.productQuantity--;
      this.cartUpdate();
    }
  }
  
  remove():void{
    dialogConfig.width ="20%";
    dialogConfig.height ="30%";
    dialogConfig.data = {
      title: "Remove Item",
      message : "Are you sure you want to remove this item?",
      id: "",
   };
   
   dialogConfig.panelClass = "delelteModel";
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(
      (res) => {
          if(res.status){
            this.deleteCart();
          }
      }
    );

  }

  deleteCart(){
    let params = { prescriptionId: this.cart.prescriptionId, quantities: this.productQuantity, status: "0" };
    this.productService.updateCart(this.cart.id, params).subscribe(
      (response:any)=>{
         console.log(response);
         this.newEvent.emit("Delete card")
      },
      (err)=> console.log(err)
    )
   }

  cartUpdate(){
   let params = { prescriptionId: this.cart.prescriptionId,price: this.cart.price, quantities: this.productQuantity, status: this.cart.status };
   this.productService.updateCart(this.cart.id, params).subscribe(
     (response:any)=>{
        this.newEvent.emit("update card")
     },
     (err)=> console.log(err)
   )
  }

  prescriptionFormSubmit(){
    if(this.prescriptionForm.invalid){
      return;
    }

    let params = { 
      prescriptionId: this.prescriptionForm.get('prescriptionId').value,
      quantities: this.productQuantity,
      status: this.cart.status
     };

    this.productService.updateCart(this.cart.id, params).subscribe(
      (response:any)=>{
         this.commonService.openAlert(response.message); 
      },
      (err)=> console.log(err)
    )

  }

  lensFormSubmit(){

    if(this.lensForm.invalid){
      return;
    }

    this.lensForm.addControl("cartId", new FormControl(this.cart.id));

    this.productService.addLensToCart(this.lensForm.value).subscribe(
      (response:any)=>{
         this.commonService.openAlert(response.message); 
      },
      (err)=> console.log(err)
    )

  }

  measurementFormSubmit(){

    if(this.measurementsForm.invalid){
      return;
    }

    this.measurementsForm.addControl("cartId", new FormControl(this.cart.id));

    this.productService.addMeasurementsToCart(this.measurementsForm.value).subscribe(
      (response:any)=>{
         this.commonService.openAlert(response.message); 
      },
      (err)=> console.log(err)
    )

  }
}
