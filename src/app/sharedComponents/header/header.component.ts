import { Component, OnInit,NgZone } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ViewChild,ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import firebase from 'firebase/compat/app';

import 'firebase/compat/auth'
import 'firebase/compat/firestore'

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { SharedService } from 'src/app/shared.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  desktopstickyheader:boolean = false;
  mobilepstickyheader:boolean = false;

  cartCount:number = 0;
  totalCart: any;
  cartQuantity:any;
  cartProducts:any = [];
    cartTotal:number = 0;


  showloginBox:boolean = false
  phoneNumber : string = '';

  showotpbox : boolean = true
  showlogin : boolean = false
  otpElement!: ElementRef;
  @ViewChild('closeBtn')
  closeBtn!: ElementRef;
  search : any = ''
  show:boolean = false
  // otpElement : any
  showOtpBox : boolean = true
 loading : boolean = false;
  @ViewChild('otp')

  userName = localStorage.getItem('customer_name');
    customerId = localStorage.getItem('customer_id');
  loggedIn: boolean = true;

  otpForm = new FormGroup({
    mobileNumber: new FormControl('', Validators.maxLength(13)),
    mobileOtp: new FormControl(''),

});
  menuList: any = "";
  subcategory: any;
  subCategoryList: any;
  showLoginpopup: boolean = false;
  hideOtp: boolean = false;
  hideLogin: boolean = false;
  showModalBox: boolean = false;
  submenus: any;
reCaptchaVerifier! : any
  mobileNumber: any
  otp!: string;
  verify: any;
  header:any;
  appVerificationDisabledForTesting :boolean = false
  confirmationResult: any;
  constructor(
    private shared:SharedService,
    public router: Router, 
     private apiService: ApiService,
     private ngZone:NgZone) 
     {

      this.shared.cartCount.subscribe( value => {this.cartQuantity = value;});


      }
    config = {
      allowNumbersOnly: true,
      length: 6,
      isPasswordInput: false,
      disableAutoFocus: false,
      placeholder: '',
      inputStyles: {
        // width: '50px',
        // height: '50px',
      },
    };

  ngOnInit(): void {
    if (window.screen.width<450) { // 768px portrait
      this.mobilepstickyheader = true;
      this.desktopstickyheader=false
    }
    else{
      this.mobilepstickyheader = false;
      this.desktopstickyheader=true

    }
  
    this.getHeaderMenus();
    this.getAllCategory();
    this.getStickyHeader();

    this.verify = JSON.parse(localStorage.getItem('verificationId') || '{}');
     this.cartQuantity = localStorage.getItem('totalCartQuantity');
  }


  pagetop(){
    window.scrollTo({
      top:0,
      behavior:'smooth'
    })
  }




  sendOTP() {
    this.apiService.getData('sendOTP', this.otpForm.value.mobileNumber).subscribe((data) => {
        this.apiService.notify(data.error, data.message);
        this.showOtpBox = true;
        alert(data.data)
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
      const value =data.data;
      this.setCustomerData(data.data);
      this.otpForm.reset();
      this.closeModal(); 
      // this.manageCartCountInLocal(data.cartCount);
      // console.log("cartCount ==="+ data.cartCount);

      // window.location.reload();
  });
}




getOTP() {
  this.reCaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    'sign-in-button',
    {
      size: 'invisible',
    }
  );
  // var conutrycode = "+91"
  // const mobilenumber = + (+conutrycode) + this.phoneNumber
  this.phoneNumber = "+91" + this.phoneNumber


  firebase
  .auth().settings.appVerificationDisabledForTesting = true
  firebase
    .auth()
    .signInWithPhoneNumber(this.phoneNumber,this.reCaptchaVerifier)
    .then((confirmationResult) => {
        this.confirmationResult = confirmationResult;
      localStorage.setItem(
        'verificationId',
        JSON.stringify(confirmationResult.verificationId)
      );

      this.ngZone.run(() => {
        this.showloginBox = true;
        this.showotpbox = false;

      });
    })

    .catch((error) => {
      console.log(error.message);
      alert(error.message);
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    });

}



onOtpChange(otp: any) {
  this.otp = otp;
}

handleClick() {
//   console.log(this.otp);
console.log(localStorage.getItem('verificationId'));
  var credential = firebase.auth.PhoneAuthProvider.credential(
    this.verify,
    this.otp
  );

//   console.log();
//   console.log("this is recaptcha",firebase.auth.PhoneAuthProvider.credential);
    this.confirmationResult
        .confirm(this.otp)
        .then((result: any) => {
        console.log('result', result);
        localStorage.setItem('user_data', JSON.stringify(result));
        this.ngZone.run(() => {
            this.verifyOTPFirebase();
        });
    }).catch((error: any) => {
        console.log(error);
        alert(error.message);
    });

//   firebase
//     .auth()
//     .signInWithCredential(credential)
//     .then((response) => {
//       console.log(response);
//       localStorage.setItem('user_data', JSON.stringify(response));
//       this.ngZone.run(() => {
//        this.verifyOTPFirebase();


//       });
//     })
//     .catch((error) => {
//       console.log(error);
//       alert(error.message);
//     });
}
verifyOTPFirebase() {
  this.phoneNumber = this.phoneNumber.substring(3);
  this.apiService.getData('verifyOTPFirebase',`${this.phoneNumber}`).subscribe((data: any) => {
      this.apiService.notify(data.error, data.message);
      this.setCustomerData(data.data);
      this.otpForm.reset();
      this.closeModal();
      this.router.navigate(['/profile']);
      this.manageCartCountInLocal(data.data.cartCount);
  });
}


manageCartCountInLocal(cartCount: number) {
 // alert(cartCount);
  console.log("cartCount ==="+ cartCount);
  localStorage.setItem('totalCartQuantity', JSON.stringify(cartCount));       
 this.shared.cartCount.next(cartCount);
}






setCustomerData(value:any) {
  this.userName = value.customer_name;
      this.customerId = value.customer_id;

      console.log(this.customerId)
      localStorage.setItem('customer_id', value.customer_id);
      localStorage.setItem('customer_name', value.customer_name);
      localStorage.setItem('customer_mobile', value.customer_mobile);
      localStorage.setItem('customer_email', value.customer_email);
    //  localStorage.setItem('totalCartQuantity', value.cartCount);       
      localStorage.setItem('token', value.token);
      value.wishlist.forEach((element: { product_id: string; }) => {
          localStorage.setItem('wishlist-'.concat(element.product_id), 'true');
      });
}

getStickyHeader() {
  this.loading = false;
  this.apiService.getData('getStickyHeader').subscribe((data) => {
    this.header = data.data[0].header; 
      this.loading = true;
  });


  }


getHeaderMenus() {
  this.loading = false;
  this.apiService.getData('getHeaderMenus').subscribe((data) => {
    const value = data.data
      this.menuList =   data.data
      this.subcategory = value.sub_categories
      this.loading = true;
  });
}

getAllCategory() {
  this.loading = false;
  this.apiService.getData('getAllCategory').subscribe((data) => {
      this.subCategoryList = data.data;
      this.submenus = data.data[0].sub_categories_four;
      console.log("SC",this.submenus)
      this.loading = true;
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
      // this.showRegister = false;
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

















}
