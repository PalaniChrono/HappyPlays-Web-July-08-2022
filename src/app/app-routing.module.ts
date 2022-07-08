import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AboutusComponent } from './aboutus/aboutus.component';
import { AddressComponent } from './address/address.component';
import { BlogComponent } from './blog/blog.component';
import { BlogdetailsComponent } from './blogdetails/blogdetails.component';
import { CartComponent } from './cart/cart.component';
import { DetailsComponent } from './details/details.component';
import { HomeComponent } from './home/home.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { OrdersComponent } from './orders/orders.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { ProceedtocheckoutComponent } from './proceedtocheckout/proceedtocheckout.component';
import { ProdsNblogsComponent } from './prods-nblogs/prods-nblogs.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchComponent } from './search/search.component';
import { ViewOrderComponent } from './view-order/view-order.component';



const routes: Routes = [
  {
    path:'aboutus', component: AboutusComponent
  },
  {
      path: '', component: HomeComponent
  },

  {
    path: 'cart', component: CartComponent},
{
  path: 'address', component: AddressComponent
},

{
  path: 'checkout', component: ProceedtocheckoutComponent
},

  {
      path: 'product/:slug', component: DetailsComponent
  },

  {
      path: 'products/:slug',
      loadChildren: () => import('../app/listing/listing.module').then(m => m.ListingModule)

  },
{
    path: 'product-tags/:id/:tag',
    loadChildren: () => import('../app/listing/listing.module').then(m => m.ListingModule)
},

  {
    path: 'cart', component: CartComponent},
{
  path: 'address', component: AddressComponent
},

{
  path: 'checkout', component: ProceedtocheckoutComponent
},

{path:'order-success',component:OrderSuccessComponent},
//  {
//    path:'address',component:AddressComponent
//  },
 {
   path:'view-order/:id',component:ViewOrderComponent
 }
 ,
 {
   path:'profile',component:ProfileComponent
 },
 {
   path:'orders',component:OrdersComponent,
 },
 {
   path:'blog',component:BlogComponent
 },
 {
  path:'blog/:id',component:BlogComponent,
},
{
  path:'blogtags/:id/:tag',component:ProdsNblogsComponent,

},
 {
  path:'blog-details/:id',component:BlogdetailsComponent
},
 {
   path:'policy',component:PrivacypolicyComponent
 },
 {
  path:'search',component:SearchComponent
},

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy:PreloadAllModules, relativeLinkResolution:'legacy',scrollPositionRestoration:'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
