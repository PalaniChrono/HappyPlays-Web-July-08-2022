import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { SharedService } from 'src/app/shared.service';


export interface Employee {
  customer_id: number;
  product_id: number;
  product_quantity: number;
  product_size_id: number;
  product_color_id: number;
  product_price: number;
  product_discount_price: number;




}





@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  card1 : boolean = true;
  card2 : boolean = true;
  card3 : boolean = true;
  showmodal : boolean = false;
  customerId = localStorage.getItem('customer_id');
  cartDetails: any;
  cartEmpty: boolean = false;
  cartCount: any;
  overAll: any;
  cartCounts:any;
  cartTotal:number = 0.00;
  http: any;
  localcartDetails: any;
  cartQuantity: any;
  qty: any;
  constructor(
   private shared:SharedService,

     private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private deviceService: DeviceDetectorService) {

      this.shared.cartCount.subscribe( value => {this.cartQuantity = value;});

     }

  ngOnInit(): void {
    if(this.customerId){
      this.customerCart();
    }else{
      this.apiService.notify(true, 'Please Log-in to view cart.');
      // this.customerCart2();
    }

    this.cartQuantity = localStorage.getItem('totalCartQuantity');


  }

  customerCart() {
      this.apiService.getData('customerCart',this.customerId).subscribe((data) => {
          this.cartDetails = data.data.details;
          this.calculateCartTotal();
          if(this.cartDetails.length == 0){
              this.cartEmpty = true;
          }else{
              this.cartEmpty = false;
              this.cartCount =  this.cartDetails.length == 1 ? this.cartDetails.length+" Item" : this.cartDetails.length+" Items";
              this.overAll= data.data.overall;
              this.cartCounts= data.data.cartCount;
              // alert(this.cartCounts);
              this.manageCartCountInLocal(this.cartCounts);
              localStorage.setItem('totalCartQuantity', this.cartDetails.length);
          }

      })
  }
  manageCartCountInLocal(cartCount: number) {
    // alert(cartCount);
    // alert(this.cartCounts);
     console.log("cartCount ==="+ cartCount);
     localStorage.setItem('totalCartQuantity', JSON.stringify(cartCount));       
    this.shared.cartCount.next(cartCount);
   }

  remove1(){
    this.card1= false;
    this.openpopup();
  }

  remove2(){
    this.card2= false;
    this.openpopup();
  }
  remove3(){

    this.openpopup();
  }
  openpopup(){
    this.showmodal = true;
  }
  closepopup(){
    this.showmodal = false;

  }
  calculateCartTotal(){
    this.cartTotal = 0;

    this.cartDetails.forEach((x:any)=> {
        this.cartTotal = +this.cartTotal + (+x.product_discount_price * +x.product_quantity);
    });


}
removeFromCart(cartId:any) {
  this.apiService.getData('removeFromCart', `${cartId}/${this.customerId}`).subscribe((data) => {
      let cartCount =  data.data.cart_count;
      this.apiService.notify(data.error, data.message);
      localStorage.setItem('totalCartQuantity',cartCount);
      this.shared.cartCount.next(cartCount);
      this.customerCart();
      this.openpopup();
      this.closepopup();
  })
}

updateSizeCart(value: any, cartId: any, productId: any) {
  this.apiService.getData('updateSizeCart', `${this.customerId}/${productId}/${cartId}/${value}`).subscribe((data) => {
      this.apiService.notify(data.error, data.message);
      this.customerCart();
  })
}

updateQuantityCart(value: any, cartId: any) {
  this.apiService.getData('updateQuantityCart', `${cartId}/${value}`).subscribe((data) => {
      this.apiService.notify(data.error, data.message);
      this.customerCart();
  })
}

minus(qty:number, id:number){
  if(qty > 1){
    qty = +qty - 1;
    this.updateQuantityCart(qty,id);
  }

}
plus(qty:number, id:number){
  qty = +qty + 1;
  this.updateQuantityCart(qty,id);
}






}
