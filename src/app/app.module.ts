import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './core/header/header.component';
import { SideNavComponent } from './core/side-nav/side-nav.component';
import { SigninComponent } from './core/signin/signin.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { DefaultComponent } from './layouts/default/default.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AccessDeniedComponent } from './core/access-denied/access-denied.component';

import { AuthGuard } from './auth/services/auth.guard';
import { AuthenticationService } from './auth/services/authentication.service';
import { LoaderService } from './auth/services/loader.service';
import { AuthTokenInterceptor } from './auth/services/authToken.service';
import { LoaderInterceptor } from './auth/services/loader.interceptor';
import { RolesComponent } from './components/roles/roles.component';
import { RolesService } from './services/roles.service';
import { RoleCreateComponent } from './components/roles/role-create/role-create.component';
import { UsersComponent } from './components/users/users.component';
import { UserCreateComponent } from './components/users/user-create/user-create.component';
import { AlertsComponent } from './shared/components/alerts/alerts.component';
import { CommonService } from './services/common.service';
import { ProductsComponent } from './components/products/products.component';
import { CustomersComponent } from './components/customers/customers.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { CustomerCreateComponent } from './components/customers/customer-create/customer-create.component';
import { ProductCreateComponent } from './components/products/product-create/product-create.component';
import { from } from 'rxjs';
import { CustomerViewComponent } from './components/customers/customer-view/customer-view.component';
import { OverviewComponent } from './components/customers/overview/overview.component';
import { CustomerVisitsComponent } from './components/customers/customer-visits/customer-visits.component';
import { CustomerOrdersComponent } from './components/customers/customer-orders/customer-orders.component';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderCreateComponent } from './components/orders/order-create/order-create.component';
import { PrescriptionsComponent } from './components/prescriptions/prescriptions.component';
import { PrescriptionCreateComponent } from './components/prescriptions/prescription-create/prescription-create.component';
import { ChatComponent } from './components/chat/chat.component';
import { PrescriptionService } from './services/prescription.service';
import { OrderProductsComponent } from './components/orders/order-products/order-products.component';
import { OrderPlaceComponent } from './components/orders/order-place/order-place.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideNavComponent,
    SigninComponent,
    PageNotFoundComponent,
    DefaultComponent,
    DashboardComponent,
    AccessDeniedComponent,
    RolesComponent,
    RoleCreateComponent,
    UsersComponent,
    UserCreateComponent,
    ProductsComponent,
    CustomersComponent,
    SupplierComponent,
    CustomerCreateComponent,
    ProductCreateComponent,
    CustomerViewComponent,
    OverviewComponent,
    CustomerVisitsComponent,
    CustomerOrdersComponent,
    OrdersComponent,
    OrderCreateComponent,
    PrescriptionsComponent,
    PrescriptionCreateComponent,
    ChatComponent,
    OrderProductsComponent,
    OrderPlaceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    AuthGuard, 
    AuthenticationService,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    RolesService,
    CommonService,
    PrescriptionService,
  ],
  bootstrap: [
    AppComponent,
    // AlertsComponent
  ]
})
export class AppModule { }
