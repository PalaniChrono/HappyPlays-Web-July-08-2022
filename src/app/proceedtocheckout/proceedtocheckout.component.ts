import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';
import { WindowRefService,ICustomWindow } from '../window-ref.service';



declare var Razorpay: any;




@Component({
  selector: 'app-proceedtocheckout',
  templateUrl: './proceedtocheckout.component.html',
  styleUrls: ['./proceedtocheckout.component.css']
})
export class ProceedtocheckoutComponent implements OnInit {
  customerId = localStorage.getItem('customer_id');
  customerEmail = localStorage.getItem('customer_email');
  cartDetails:any = [];
  addressDetails:any = [];
  emptyCart = true;
  choosedAddress = '';
  choosedMobile = '';
  choosedName = '';
  setting:any = [];
  cgstValue:any = '';
  sgstValue:any = '';
  totalValue:any = '';
  paymentMode = 'online';
  promoCode:any = '';
  promoCodeUpdated = false;
  promoValue:any = 0;
  promoPercentage = '';
  popUpHeading = '';

  addressType = 'Home';
  defaultAddress = 0;
  pincodeDetails:any = '';
  showAddress = false;
  chechoutEmail:any;

// RazorPay :any
showAddressPopUp = false;

  private _window: ICustomWindow;
  public rzp: any;
  public options: any = {
      // key: 'rzp_test_5MVZAQA95cQk9h',
      key:'rzp_live_QNLZO1YIFKw1ld',
      name: 'MY Happyplays',
      description: 'Shopping',
      prefill: {
          name: 'MY Happyplays',
          email: '',
      },
      // "readonly": { 'email': false },
      notes: {},
      theme: {
          color: '#f27360'
      },
      handler: this.paymentHandler.bind(this),
      modal: {
          ondismiss: (() => {
              this.zone.run(() => {
                  this.apiService.notify(true, 'Payment Couldnt be Completed. Please Try Again')
                  this.router.navigate(['/user/checkout'])
              });
          })
      }
  };
  cashondelivery: any;
  onlinepayment: any;
  selectedAddress: any;
  addressData: any;
  cartQuantity: any;
  constructor(
    private apiService: ApiService,
    public router: Router,
    private zone: NgZone,
    private shared:SharedService,
    private winRef: WindowRefService
) {
  this._window = this.winRef.nativeWindow;
}
addressForm = new FormGroup({
  billingName: new FormControl(''),
  billingMobile: new FormControl(''),
  fullAddress: new FormControl(''),
  locality: new FormControl(''),
  city: new FormControl(''),
  state: new FormControl(''),
  pincode: new FormControl('')
});
ngOnInit(): void {
  this.shared.currentSelectedAddress.subscribe(address => (this.selectedAddress= address));
  this.shared.cartCount.subscribe( value => {this.cartQuantity = value;});

  this.selectedAddress = 10;
  this.customerCart();
  this.listAllAddress();
  this.getCustomerDetails();

  this.getPrimaryAddress();
}

pagetop(){
  window.scrollTo(0,0)
}
getCustomerDetails() {
  this.apiService.getData('getCustomerDetails', this.customerId).subscribe((data) => {
    const value = data.data;
    this.chechoutEmail = value[0].customer_email;
  });
}
getPrimaryAddress() {
  this.apiService.getData('getPrimaryAddress', this.customerId).subscribe((data) => {
      this.choosedAddress = data.data.default_address_id;
  });
}
listAllAddress() {
  this.apiService.getData('listAllAddress', this.customerId).subscribe((data) => {
      this.addressDetails = data.data;
  })
}

customerCart() {
  this.apiService.getData('customerCart', this.customerId).subscribe((data) => {
      this.cartDetails = data.data;
      this.getSettings();
      if(this.cartDetails.details.length != 0) {
          this.emptyCart = false;
      } else {
          this.emptyCart = true;
      }
  })
}

updateSizeCart(value:any, cartId:any) {
  this.apiService.getData('updateSizeCart', `${cartId}/${value}`).subscribe((data) => {
      this.apiService.notify(data.error, data.message);
      this.customerCart();
  })
}

updateQuantityCart(value:any, cartId:any) {
  this.apiService.getData('updateQuantityCart', `${cartId}/${value}`).subscribe((data) => {
      this.apiService.notify(data.error, data.message);
      this.customerCart();
  })
}

removeFromCart(cartId:any) {
  this.apiService.getData('removeFromCart', cartId).subscribe((data) => {
      this.apiService.notify(data.error, data.message);
      this.customerCart();
  })
}



addressUpdated(id:any, name:any, mobile:any) {
  this.choosedAddress = id;
  this.choosedName = name;
  this.choosedMobile = mobile;
  this.options.prefill = {
      'contact' : mobile,
      'email' : this.customerEmail,
  }
  this.apiService.notify(false, 'Billing Address Updated');
}

paymentTypeUpdate(type :any) {
  this.paymentMode = type
}

getSettings() {
  this.apiService.getData('getSettings').subscribe((data) => {
      this.setting = data.data;
      this.updateTaxAndTotal();
  });
}

paymentHandler(res: any) {

  this.zone.run(() => {
    var values: any;
       values = this.updateOrderValues();
       console.log(values);
      values['payment_mode'] = 'Online Payment';
      values['razorpay_payment_id'] = res.razorpay_payment_id;
      console.log(values);
      this.apiService.postData(values, 'submitOrder').subscribe((data) => {
          if (data.error === false) {
              this.apiService.notify(data.error, data.message);
              this.manageCartCountInLocal(data.data.cart_count);
              this.router.navigate(['view-order', data.data.order_id]);
              //this.router.navigate(['order-success', data.data]);
              this.pagetop();
          } else {
              this.apiService.notify(data.error, data.message);
          }
      });

  });
}

updateTaxAndTotal() {
  this.cgstValue = ((+this.cartDetails.total/100) * +this.setting.cgst_tax).toFixed(2);
  this.sgstValue = ((+this.cartDetails.total/100) * +this.setting.sgst_tax).toFixed(2);
  this.totalValue = this.cartDetails.total ;
  //  this.totalValue = (+this.cartDetails.total + +this.cgstValue + +this.sgstValue + +this.setting.delivery_charge).toFixed(2);
  this.updatePromoCode();
}

updatePromoCode() {
  if(this.promoCode) {
      this.apiService.getData('checkPromo', this.promoCode).subscribe((data) => {
          if(!data.error) {
              const promo = data.data;
              if(this.cartDetails.total >= promo.min_value) {
                  this.promoValue = (this.totalValue/100 * promo.discount).toFixed(2);
                  this.totalValue -= this.promoValue;
                  this.promoPercentage = promo.discount;
                  this.promoCodeUpdated = true;
              } else {
                  this.apiService.notify(true, 'Your Amount is Low to apply this Promo');
                  this.promoCodeUpdated = false;
                  // return false;
              }
              this.apiService.notify(data.error, data.message);
          }
      })
  }
}

removePromoCode() {
  this.totalValue += +this.promoValue;
  this.promoCodeUpdated = false;
  this.promoPercentage = this.promoCode = '';
  this.promoValue = 0;
}

updateOrderValues() {
 return {
      'billing_name' : this.choosedName,
      'billing_mobile_number' : this.choosedMobile,
      'customer_address_id' : this.choosedAddress,
      'customer_id' : this.customerId,
      'customer_email' : this.chechoutEmail,
      'order_sub_total' : this.cartDetails.total,
      'deliver_fee' : this.setting.delivery_charge,
      'cgst_tax' : this.setting.cgst_tax,
      'cgst_value' : this.cgstValue,
      'sgst_tax' : this.setting.sgst_tax,
      'sgst_value' : this.sgstValue,
      'promo_code' : this.promoCode,
      'promo_code_value' : this.promoValue,
      'order_overall_totall' : this.totalValue,
      'payment_mode' : this.cashondelivery,
      'razorpay_payment_id' : this.onlinepayment

  }
}

updateNameAndMobile(name :any, mobile :any) {
  this.choosedName = name;
  this.choosedMobile = mobile;
}


manageCartCountInLocal(cartCount: number) {
   localStorage.setItem('totalCartQuantity', JSON.stringify(cartCount));
  this.shared.cartCount.next(cartCount);
 }

submitOrder() {
  if(!this.choosedAddress) {
      this.apiService.notify(true, 'Please Choose Your Billing Address');
      return false;
  }
 if(this.chechoutEmail == "" || this.chechoutEmail == null || this.chechoutEmail.search(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
    this.apiService.notify(true, 'Please Enter A Valid Email');
    return false;
  }
  if(this.paymentMode === 'cash') {
      var values = this.updateOrderValues();
      values['payment_mode'] = 'Cash On Delivery';
      this.apiService.postData(values ,'submitOrder').subscribe((data) => {
          this.apiService.notify(data.error, data.message);
          // this.router.navigate(['/user/order', data.data]);
          this.router.navigate(['view-order/:id']);
      })
  } 
  else if(this.paymentMode === 'online') {
      this.options.amount = (this.totalValue * 100).toFixed(2);
      this.rzp = new this.winRef.nativeWindow.Razorpay(this.options);
      this.rzp.open();
      // this.router.navigate(['order-success']);


  }
}


showPopUp(type:any) {
  if(type === 'add') {
      this.popUpHeading = "Add";
      this.showAddressPopUp = true;
  } else if(type === 'edit') {
      this.popUpHeading = "Edit";
      this.showAddressPopUp = true;
  }
}
updateAddressType(type:any) {
  this.addressType = type;
}


updateDefaultAddress() {
  this.defaultAddress = this.defaultAddress === 0 ? 1 : 0;
}

getPincodeDetails(event :any) {
  if(event) {
      if (event.which == 13) {
          event.preventDefault();
      }
  }
  const pincode = this.addressForm.value.pincode;
  if(pincode) {
      this.apiService.getData('getPincodeDetails', pincode).subscribe((data) => {
          this.pincodeDetails = data.data;
          this.addressForm.controls['city'].setValue(this.pincodeDetails.District);
          this.addressForm.controls['state'].setValue(this.pincodeDetails.State);
          this.showAddress = true;
      })
  } else {
      this.apiService.notify(false, "Please Enter Pincode To Continue");
  }

}

closePopUp() {
  this.showAddressPopUp = false;
  this.addressForm.reset();
  this.addressType = 'Home';
}

createAddress() {
     if(this.addressForm.value.billingMobile.length !== 10){
         this.apiService.notify(true, 'Enter Vaild Mobile Number');
           return false;
       }
  const values = {
      'customer_id' : this.customerId,
      'billing_name' : this.addressForm.value.billingName,
      'billing_mobile' : this.addressForm.value.billingMobile,
      'address_pincode' : this.addressForm.value.pincode,
      'address_details' : this.addressForm.value.fullAddress,
      'address_locality_town' : this.addressForm.value.locality,
      'address_city_district' : this.addressForm.value.city,
      'address_state' : this.addressForm.value.state,
      'address_type' : this.addressType,
      'default_address' : this.defaultAddress,
  }
  this.apiService.postData(values, 'createAddress').subscribe((data) => {
      this.addressForm.reset();
      this.apiService.notify(data.error, data.message);
      this.closePopUp();
      this.listAllAddress();

  })
}

editAddress(addressId:any) {
  const values = {
      'customer_address_id' : addressId,
      'billing_name' : this.addressForm.value.billingName,
      'billing_mobile' : this.addressForm.value.billingMobile,
      'address_pincode' : this.addressForm.value.pincode,
      'address_details' : this.addressForm.value.fullAddress,
      'address_locality_town' : this.addressForm.value.locality,
      'address_city_district' : this.addressForm.value.city,
      'address_state' : this.addressForm.value.state,
      'address_type' : this.addressType,
  }
  this.apiService.postData(values, 'editAddress').subscribe((data) => {
      this.addressForm.reset();
      this.apiService.notify(data.error, data.message);
      this.listAllAddress();
      this.closePopUp();
  })
}

getAddressDetails(id:any) {
  this.apiService.getData('getAddressDetails',id).subscribe((data) => {
      this.addressData = data.data;
      this.addressForm.patchValue({billingName: this.addressData.billing_name});
      this.addressForm.patchValue({billingMobile: this.addressData.billing_mobile});
      this.addressForm.patchValue({fullAddress: this.addressData.address_details});
      this.addressForm.patchValue({locality: this.addressData.address_locality_town});
      this.addressForm.patchValue({city: this.addressData.address_city_district});
      this.addressForm.patchValue({state: this.addressData.address_state});
      this.addressForm.patchValue({pincode: this.addressData.address_pincode});
      this.addressType = this.addressData.address_type;
      this.showPopUp('edit');
  });
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


