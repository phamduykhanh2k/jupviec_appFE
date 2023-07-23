import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard, AuthGuard, CartGuard, authGuard } from './guards/auth.guard';
import { AboutComponent } from './main/about/about.component';
import { UserAuthComponent } from './main/user-auth/user-auth.component';
import { ShopComponent } from './main/shop/shop.component';
import { HomeComponent } from './main/home/home.component';
import { ProductDetailsComponent } from './main/product-details/product-details.component';
import { PageNotFoundComponent } from './main/page-not-found/page-not-found.component';
import { CartPageComponent } from './main/cart-page/cart-page.component';
import { CheckoutComponent } from './main/checkout/checkout.component';
import { ContactComponent } from './main/contact/contact.component';
import { ManagerComponent } from './main/manager/manager.component';
import { ProductManagerComponent } from './main/manager/product-manager/product-manager.component';
import { UserManagerComponent } from './main/manager/user-manager/user-manager.component';
import { SettingsComponent } from './main/settings/settings.component';
import { AccountComponent } from './main/settings/account/account.component';
import { OrdersComponent } from './main/settings/orders/orders.component';
import { OrderDetailsComponent } from './main/settings/order-details/order-details.component';
import { StaffDetailsComponent } from './main/staff-details/staff-details.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'authentication', component: UserAuthComponent },
  { path: 'about', component: AboutComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'details/:id', component: ProductDetailsComponent },
  { path: 'cart', component: CartPageComponent, canActivate: [AuthGuard, CartGuard] },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'contact', component: ContactComponent },
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: '/settings/account', pathMatch: 'full' },
      { path: 'account', component: AccountComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'order-details', component: OrderDetailsComponent },
    ]
  },
  { path: 'staff-details', component: StaffDetailsComponent },
  {
    path: 'manager',
    component: ManagerComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: '/manager/products', pathMatch: 'full' },
      { path: 'products', component: ProductManagerComponent },
      { path: 'products/:id', component: ProductManagerComponent },
      { path: 'users', component: UserManagerComponent }
    ]
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
