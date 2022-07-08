import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
// import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
// import { ToastrService } from 'ngx-toastr';
//  import { HttpClientModule } from '@angular/common/http';
 import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './sharedComponents/header/header.component';
import { FooterComponent } from './sharedComponents/footer/footer.component';
import { DetailsComponent } from './details/details.component';
import { CartComponent } from './cart/cart.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { BlogComponent } from './blog/blog.component';
import { AddressComponent } from './address/address.component';
import { ToastrModule } from 'ngx-toastr';
import { ProceedtocheckoutComponent } from './proceedtocheckout/proceedtocheckout.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { OrdersComponent } from './orders/orders.component';
import { ProfileComponent } from './profile/profile.component';
import { ViewOrderComponent } from './view-order/view-order.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { TermsandconditionsComponent } from './termsandconditions/termsandconditions.component';
import { ShippingpolicyComponent } from './shippingpolicy/shippingpolicy.component';
import { SearchComponent } from './search/search.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { CommonModule } from '@angular/common';

// firbase
import {AngularFireModule} from '@angular/fire/compat'
import { FirebaseService } from './services/firebase.service';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule} from '@angular/fire/compat/firestore/'
import { environment } from 'src/environments/environment';
import firebase from 'firebase/compat/app';
import { BlogdetailsComponent } from './blogdetails/blogdetails.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ProdsNblogsComponent } from './prods-nblogs/prods-nblogs.component';

// export const firebaseConfig = environment.firebase
firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    DetailsComponent,
    CartComponent,
    AboutusComponent,
    BlogComponent,
    ProceedtocheckoutComponent,
    AddressComponent,
    OrderSuccessComponent,
    OrdersComponent,
    ProfileComponent,
    ViewOrderComponent,
    PrivacypolicyComponent,
    TermsandconditionsComponent,
    ShippingpolicyComponent,
    SearchComponent,
    BlogdetailsComponent,
    ProdsNblogsComponent,
    
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    CarouselModule,
    FormsModule,
    HttpClientModule,
    NgOtpInputModule,
    // ToastrService,
    // HttpClient,
    ReactiveFormsModule,
    ToastrModule.forRoot(), // ToastrModule added
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,


  ],
  providers: [FirebaseService,{provide: LocationStrategy, useClass: HashLocationStrategy}],

  bootstrap: [AppComponent]
})
export class AppModule {

}
