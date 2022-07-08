import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    cartQuantity:any;

    loading = true;
    customerId = localStorage.getItem('customer_id');
    userName = localStorage.getItem('customer_name');
    customerDetails:any = [];
    customerGender:any = '';
    profileForm = new FormGroup({
        name: new FormControl(''),
        mobile: new FormControl(''),
        email: new FormControl('')
    });

    constructor(
        private shared:SharedService,
        private apiService: ApiService,
        private router: Router,
    ) {

        this.shared.cartCount.subscribe( value => {this.cartQuantity = value;});

    }

    ngOnInit(): void {
        this.getCustomerDetails();
    }

    getCustomerDetails() {
        this.loading = true;
        this.apiService.getData('getCustomerDetails',this.customerId).subscribe((data) => {
            this.customerDetails = data.data;
            if(this.customerDetails[0].customer_name !== 'User') {
                this.profileForm.patchValue({name: this.customerDetails[0].customer_name});
            }
            this.profileForm.patchValue({mobile: this.customerDetails[0].customer_mobile});
            this.profileForm.patchValue({email: this.customerDetails[0].customer_email});
            if(this.customerDetails[0].customer_gender != 'null') {
                this.customerGender = this.customerDetails[0].customer_gender;
            }
            setTimeout(() => {
                this.loading = false;
            }, 100)
        })
    }

    closePopUp() {
        setTimeout(() => {
            const close: HTMLElement = document.getElementById('close-popup') as HTMLElement;
            close.click();
        });
    }

    editCustomerDetails() {
        if(!this.profileForm.value.name || !this.profileForm.value.email) {
            this.apiService.notify(true, 'Missing Mandatory Field');
            return false;
        }
        else if(this.profileForm.value.email.search("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$")){
            this.apiService.notify(true, 'Enter Vaild Email');
            return false;
        }else if(this.profileForm.value.mobile.length !== 10){
            this.apiService.notify(true, 'Enter Vaild Mobile Number');
            return false;
        }
            
        // if(!this.customerGender) {
        //     this.apiService.notify(true, 'Please Choose Gender');
        //     return false;
        // }
        const values = {
            'customer_id' : this.customerId,
            'customer_name' : this.profileForm.value.name,
            'customer_email' : this.profileForm.value.email,
            'customer_mobile' : this.profileForm.value.mobile,
            // 'customer_gender' : this.customerGender
        };
        this.apiService.postData(values, 'editCustomerDetails').subscribe((data) => {
            localStorage.setItem('customer_name', this.profileForm.value.name)
            this.userName = localStorage.getItem('customer_name');
            this.apiService.notify(data.error, data.message);
            this.closePopUp();
            this.getCustomerDetails();
        });
    }

    updateGender(type: any) {
        this.customerGender = type;
    }


    logout() {
      this.apiService.getData('logout', this.customerId).subscribe((data) => {
          this.apiService.notify(data.error, data.message);
          this.resetAuth();
          this.pageload();
      });
  }
  resetAuth() {
    localStorage.clear();
    // this.userName = localStorage.getItem('customer_name');
    // this.customerId = localStorage.getItem('customer_id');
   // this.shared.cartCount.next(0);
    // localStorage.clear();
  //  localStorage.setItem('totalCartQuantity', JSON.stringify(null));
    window.localStorage.removeItem('customer_id')
 }

pageload(){
  this.router.navigate(['/'])
  .then(() => {
    window.location.reload();
  });
}

}
