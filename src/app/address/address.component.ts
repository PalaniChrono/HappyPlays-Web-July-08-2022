import { Component, OnInit, HostListener } from '@angular/core';
// import { ApiService } from '../api.service';
import { ApiService } from '../api.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-address',
    templateUrl: './address.component.html',
    styles: [
    ]
})
export class AddressComponent implements OnInit {
    selectedAddress: any;
    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.closePopUp();
    }
    loading = true;
    public addressDetailsForm!: FormGroup;
    customerId = localStorage.getItem('customer_id');
    userName = localStorage.getItem('customer_name');
    showAddress = false;
    defaultAddress = 0;
    addressDetails:any = '';
    pincodeDetails:any = '';
    addressType = 'Home';
    addressForm = new FormGroup({
        billingName: new FormControl(''),
        billingMobile: new FormControl(''),
        fullAddress: new FormControl(''),
        locality: new FormControl(''),
        city: new FormControl(''),
        state: new FormControl(''),
        pincode: new FormControl('')
    });
    showAddressPopUp = false;
    popUpHeading = '';
    addressData:any = [];
    primaryAddressId:any = '';

    constructor(
        private apiService: ApiService,
        private shared:SharedService,
        public router: Router,
    ) { }

    ngOnInit() {
        this.getPrimaryAddress();
        this.listAllAddress();
        this.addressDetailsForm = new FormGroup({
            addressName: new FormControl(''),
            pincode: new FormControl(''),
        });
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

    createAddress() {
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
            this.listAllAddress();
            this.closePopUp();
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
          console.log("update address details",values)
          alert()
            this.addressForm.reset();
            this.apiService.notify(data.error, data.message);
            this.listAllAddress();
            this.closePopUp();
        })
    }

    updateAddressType(type:any) {
        this.addressType = type;
    }

    updateDefaultAddress() {
        this.defaultAddress = this.defaultAddress === 0 ? 1 : 0;
    }

    listAllAddress() {
        this.loading = true;
        this.apiService.getData('listAllAddress',this.customerId).subscribe((data) => {
            this.addressDetails = data.data;
            setTimeout(() => {
                this.loading = false;
            }, 100)
        })
    }

    deleteAddress(id:any) {
        this.apiService.getData('deleteAddress', id).subscribe((data) => {
            this.apiService.notify(data.error, data.message);
            this.listAllAddress();
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

    getPrimaryAddress() {
        this.apiService.getData('getPrimaryAddress', this.customerId).subscribe((data) => {
            this.primaryAddressId = data.data.default_address_id;
        });
    }

    updatePrimaryAddress(addressId:any) {
        const value = `${this.customerId}/${addressId}`;
        this.apiService.getData('updatePrimaryAddress', value).subscribe((data) => {
            this.apiService.notify(data.error, data.message);
            this.primaryAddressId = addressId;
            this.listAllAddress();
        });
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

    closePopUp() {
        this.showAddressPopUp = false;
        this.addressForm.reset();
        this.addressType = 'Home';
    }
    choosedAddress(address:any){
        this.selectedAddress = address.customer_address_id;
        this.shared.changeSelectedAddress(this.selectedAddress);
        this.router.navigate(['checkout'])
    }


    logout() {
      this.apiService.getData('logout', this.customerId).subscribe((data) => {
          this.apiService.notify(data.error, data.message);
          this.resetAuth();
          this.router.navigate(['/']);
      });
  }
  resetAuth() {
    localStorage.clear();
    this.userName = localStorage.getItem('customer_name');
    this.customerId = localStorage.getItem('customer_id');
    // this.loggedIn = this.showOtpBox = false;
    // this.router.navigate(['/']);
    // window.location.reload();
}
}
