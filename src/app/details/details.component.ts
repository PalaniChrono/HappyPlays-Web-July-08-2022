import { Component, OnInit,ViewChild,ElementRef, ɵresetJitOptions, ChangeDetectorRef } from '@angular/core';
import { RouterModule,Router,ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
import { elementAt, Subject } from 'rxjs';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared.service';
import { __values } from 'tslib';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  prodselectQty:any
  customerId:any
  showcart : boolean = false;
  testProdQTY2: any;
  showmodal : boolean = false;
  loading = true;
  productSlug:any;
  productDetails:any = '';
  productImages:any;
  productCategory:any = '';
  DiscountPercentage:any;
  linkedProducts:any;
  relatedProducts:any;
  mainImage: any = '';
  choosedSize:any ;
  // customerId = localStorage.getItem('customer_id');
  goToCart = false;
  productInCart = false;
  productInWishList = false;
  device = 'web';
  weight: any;
  qty: number = 1;
  colors: any;
  choosedColor: any;
  weighttest: any;
  product_price: any;
  product_discount_price: any;
  rawprice: any;
  requiredDiscountPrice: any;
  requiredActualPrice: any;
  price: any;
  discountPrice: any;
  showLoginpopup: boolean = false;
  hideOtp: boolean = false;
  hideLogin: boolean = false;
  showModalBox: boolean = false;
  selectedqty:any
  cartCount:number = 0;
  totalCart: any;
  cartQuantity:any;
options:number[]=Array(30)
selectoptions=this.options.length
testProdQTY:any
  showotpbox : boolean = true
  showlogin : boolean = false
  otpElement!: ElementRef;
  @ViewChild('closeBtn')
  closeBtn!: ElementRef;
  search : any = ''
  show:boolean = false
  // otpElement : any
  showOtpBox : boolean = true

  @ViewChild('otp')

  userName = localStorage.getItem('customer_name');

  loggedIn: boolean = true;

  otpForm = new FormGroup({
    mobileNumber: new FormControl('', Validators.maxLength(10)),
    mobileOtp: new FormControl(''),

});








  constructor(
    private shared:SharedService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private deviceService: DeviceDetectorService,
    private cdREF:ChangeDetectorRef
) {

  this.shared.cartCount.subscribe( value => {this.cartQuantity = value;});

 }

  ngOnInit(): void {
    this.productSlug = this.route.snapshot.paramMap.get('slug');
    this.customerId = localStorage.getItem('customer_id');
        this.getProductDetails();

  }


  getProductDetails() {
    this.apiService.getData('getProductDetails',`${this.productSlug}/${this.customerId}`).subscribe((data) => {
        this.productDetails = data.data;
        this.productImages = this.productDetails.images;
         this.mainImage = this.convertImage(this.productDetails.images[0].product_image) ;
        this.productCategory = this.productDetails.sub_category;
        this.DiscountPercentage = Math.round(100 - ((this.productDetails.product_discount_price /
        this.productDetails.product_price) * 100));
        this.colors = this.productDetails.color;
        this.relatedProducts = this.productDetails.related;
        this.weight = this.productDetails.product_sizes;
        this.weighttest = this.productDetails.price.weightName
        this.product_price =  this.productDetails.product_price
        this.price = this.productDetails.price[0].price;
        this.discountPrice = this.productDetails.price[0].discount_price
        this.rawprice = this.productDetails.price;
        this.product_discount_price = this.productDetails.product_discount_price
        if(this.customerId){
          this.prodselectQty = this.productDetails.cart_product_quantity == null ? 1 : this.productDetails.cart_product_quantity;

        }
        else{
          this.prodselectQty = 1
        }

        if(this.weight[0].itemName){
          this.choosedSize = this.weight[0].id;
        }
        if(this.colors[0].itemName){
          this.choosedColor = this.colors[0].id;
        }
        if(this.customerId) {
            // this.checkWishAndCart();
        }
        setTimeout(() => {
            this.loading = false;
        }, 100)
    });

}

sizeChoosed(size:any) {
  this.choosedSize = size.id;
  this.rawprice.forEach((elt: { id: any; price: any; discount_price:any }) => {
    if(elt.id == size.id){
      this.price = elt.price;
      this.discountPrice = elt.discount_price;
    }
});

}
colorChoosed(color: any) {
  this.choosedColor = color.id;
}
weightbasedprice(price:any){
  this.requiredDiscountPrice = []
  this.requiredActualPrice = []
  price.requiredDiscountPrice.forEach((element:{dicountPrice: any})=>{
    this.requiredDiscountPrice
  })


  this.requiredDiscountPrice = this.rawprice.discount_price;
  this.requiredActualPrice = this.rawprice.price;
  console

}

authCheck() {
  if(!this.apiService.authCheck()) {
      this.apiService.notify(false, 'Please Login To Proceed');
      setTimeout(() => {
          const openLoginModal: HTMLElement = document.getElementById('loginbtn') as HTMLElement;
          openLoginModal.click();
      }, 100);
  } else {
      this.customerId = localStorage.getItem('customer_id');
      return true;
  }
}

addToCart1(type = '') {
  if(this.authCheck()) {
      if(!this.choosedSize ) {
          this.apiService.notify(true, 'Choose Size to Continue');
          return false;
      }
      if(!this.choosedColor) {
        this.apiService.notify(true, 'Choose Color to Continue');
        return false;
    }

      const value = {
          customer_id : this.customerId,
          product_id : this.productDetails.id,
          product_quantity : this.prodselectQty,
          product_size_id : this.choosedSize,
          product_color_id : this.choosedColor,
          product_price : this.price,
          product_discount_price : this.discountPrice,


      };

      this.apiService.postData(value, 'addToCart').subscribe((data) => {

          if(type === 'buynow') {
              this.router.navigate(['user/checkout']);
          } else {
              this.apiService.notify(data.error, data.message);
              this.getProductDetails();
              this.goToCart = true;

          }
          this.manageCartCountInLocal(data.data.cart_count);

      })
  }
}
manageCartCountInLocal(cartCount: number) {
  localStorage.setItem('totalCartQuantity', JSON.stringify(cartCount));
 this.shared.cartCount.next(cartCount);
}

firstViewImage(url:any) {
  if(this.deviceService.isDesktop()) {
      return url.replace("/upload/", "/upload/c_scale,h_677,w_508/");
  } else if(this.deviceService.isMobile()) {
      return url.replace("/upload/", "/upload/c_scale,h_443,w_345/");
  }
}

convertImage(url:any) {
  return url.replace("/upload/", "/upload/h_800,w_800/");
}
  opencart(){

    this.openpopup();
  }
  openpopup(){
    this.showmodal = true;
  }
  closepopup(){
    this.showmodal= false;
    this.showcart = true;
  }
  minus(qty:number){
    if(qty > 1){
      this.qty = +qty - 1;
    }

  }
  plus(qty:number){
    this.qty = +qty + 1;
  }

  changeMainImage(url: any) {
    this.mainImage = url;

}
sendOTP() {
      this.apiService.getData('sendOTP', this.otpForm.value.mobileNumber).subscribe((data) => {
          this.apiService.notify(data.error, data.message);
          this.showOtpBox = true;
          setTimeout(() => {
              this.otpElement.nativeElement.focus();
          })
          this.showotpbox = false;
          this.showlogin = true;
      });
  }
  verifyOTP() {
    this.apiService.getData('verifyOTP', `${this.otpForm.value.mobileNumber}/${this.otpForm.value.mobileOtp}`).subscribe((data) => {
        this.apiService.notify(data.error, data.message);
        this.setCustomerData(data.data);
        this.otpForm.reset();
        this.closeModal();
        window.location.reload();

    });
  }
  setCustomerData(value:any) {
    this.userName = value.customer_name;
        this.customerId = value.customer_id;
        localStorage.setItem('customer_id', value.customer_id);
        localStorage.setItem('customer_name', value.customer_name);
        localStorage.setItem('customer_mobile', value.customer_mobile);
        localStorage.setItem('customer_email', value.customer_email);
        localStorage.setItem('token', value.token);
        value.wishlist.forEach((element: { product_id: string; }) => {
            localStorage.setItem('wishlist-'.concat(element.product_id), 'true');
        });
  }
  private closeModal(): void {
    this.closeBtn.nativeElement.click();

}
checkLoggedIn(){
  if(this.customerId  != null ){
      this.router.navigate(['/user/profile']);
 }
  else{
      this.showLoginpopup = true;

      this.hideOtp = true;
      this.hideLogin = false;
      if(0){
          // Dont open the modal
          this.showModalBox = false;
        } else {
           // Open the modal
           this.showModalBox = true;
        }
        const openLoginPopUp: HTMLElement = document.getElementById('openLoginPopUp') as HTMLElement;
        openLoginPopUp.click();
  }
}
pagereload(){
  window.location.reload();
}


onOptionsSelected(value:any){
this.selectedqty=value
}











}
function value(value: any) {
  throw new Error('Function not implemented.');
}

