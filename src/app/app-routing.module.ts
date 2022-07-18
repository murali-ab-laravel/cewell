import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './core/signin/signin.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DefaultComponent } from './layouts/default/default.component';
import { AccessDeniedComponent } from './core/access-denied/access-denied.component';
import { RolesComponent } from './components/roles/roles.component';
import { AuthGuard } from './auth/services/auth.guard';
import { UsersComponent } from './components/users/users.component';
import { ProductsComponent } from './components/products/products.component';
import { CustomersComponent } from './components/customers/customers.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { CustomerCreateComponent } from './components/customers/customer-create/customer-create.component';
import { CustomerViewComponent } from './components/customers/customer-view/customer-view.component';
import { OverviewComponent } from './components/customers/overview/overview.component';
import { CustomerVisitsComponent } from './components/customers/customer-visits/customer-visits.component';
import { CustomerOrdersComponent } from './components/customers/customer-orders/customer-orders.component';
import { OrdersComponent } from './components/orders/orders.component';
import { PrescriptionsComponent } from './components/prescriptions/prescriptions.component';
import { ChatComponent } from './components/chat/chat.component';
import { OrderProductsComponent } from './components/orders/order-products/order-products.component';
import { CartComponent } from './shared/components/cart/cart.component';
import { OrderPlaceComponent } from './components/orders/order-place/order-place.component';
import { OrderCreateComponent } from './components/orders/order-create/order-create.component';

// let user_details = JSON.parse(localStorage.getItem('user_details'));

// const USER_ROLE = user_details.role_id;

const routes: Routes = [
  { path:'', pathMatch:'full', redirectTo:'login' },
  { path:'login', component:SigninComponent },
  { path:'dashboard', canActivate: [AuthGuard], component:DashboardComponent },
  { 
    path: 'roles',
    canActivate: [AuthGuard], 
    component: RolesComponent,
    // data: {
    //   allowedRoles: [USER_ROLE],
    // }
 },
  { path: 'users', canActivate: [AuthGuard], component: UsersComponent},
  { path: 'products',canActivate: [AuthGuard], component: ProductsComponent },
  { path: 'orders',canActivate: [AuthGuard], component: OrdersComponent },
  { path: 'prescriptions',canActivate: [AuthGuard], component: PrescriptionsComponent },
  { path: 'customers',canActivate: [AuthGuard], component: CustomersComponent },
  { 
    path: 'customer/:visitId',
    canActivate: [AuthGuard],
    component: CustomerViewComponent,
    children: [
      { path: '', pathMatch:'full', redirectTo:'overview'},
      { path: 'overview', component: OverviewComponent },
      { path: 'visits', component: CustomerVisitsComponent },
      { path: 'orders', component: CustomerOrdersComponent },
    ]
 },
  { path: 'suppliers',canActivate: [AuthGuard], component: SupplierComponent },
  { path: 'admin', canActivate: [AuthGuard], component:DefaultComponent, children: [
    { path: '', component:DashboardComponent },
    { path: 'dashboard', component:DashboardComponent },
  ]},
  { path: 'chat', component:ChatComponent },
  { path: 'cart', component: CartComponent },
  { path: 'order-products', component:OrderProductsComponent },
  { path: 'order-place/:orderId', component: OrderPlaceComponent},
  { path: 'order-view/:orderId', component: OrderCreateComponent },
  { path:'access-denied', component:AccessDeniedComponent },
  { path:'**', component:PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
