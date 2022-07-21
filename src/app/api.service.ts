import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';



// let headers = new HttpHeaders();
let head = new HttpHeaders();
let headers = head.set('Accept', 'application/json');
@Injectable({
    providedIn: 'root'
})
export class ApiService {
    token = localStorage.getItem('token');
    constructor(
        private http: HttpClient,
        private toastr: ToastrService,

    ) { }


    apiURL = 'http://192.168.0.22:8001/api'

//    apiURL = 'https://myhappyplaysapi.chronoinfotech.com/api';
    //  apiURL = 'http://localhost:8001/api'

    private getToken() {
      headers = head.set('Authorization', `Bearer ${localStorage.getItem('user_token')}`);
  }

    public getData(url:any, params:any = '') {
        headers = headers.set('Accept', 'application/json').set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        if (params) {
            return this.http.get<any>(`${this.apiURL}/` + url + `/` + params, { headers });
        }
        return this.http.get<any>(`${this.apiURL}/` + url, { headers });
    }

    public postData(data:any, url:any) {
        headers = headers.set('Accept', 'application/json').set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        return this.http.post<any>(`${this.apiURL}/` + url, data, { headers });
    }

    public searchData(url:any, params: any = '') {
        params = params === '' ? null : params;
        headers = headers.set('Accept', 'application/json').set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        return this.http.get<any>(`${this.apiURL}/` + url + `/` + params, { headers });
    }

    public speech(message:any) {
        if(localStorage.getItem('voice') === 'on') {
            let utter = new SpeechSynthesisUtterance();
            utter.lang = 'en-US';
            utter.text = message;
            utter.volume = 0.5;
            utter.rate = 0.8;
            window.speechSynthesis.speak(utter);
        }
    }

    public notify(errorType : any, message:any) {
        if(errorType === false) {
            this.toastr.success(message);
            this.speech(message);
        } else if(errorType === true) {
            this.toastr.warning(message);
            this.speech(message);
        }
    }

    // public checkWishList(product_id) {
    //     if(product_id) {
    //         return localStorage.getItem('wishlist-'.concat(product_id)) === 'true' ? true : false;
    //     }
    // }

    // public updateWishList(product_id, type) {
    //     if(product_id) {
    //         const id = 'wishlist-'.concat(product_id);
    //         type === 'add' ? localStorage.setItem(id, 'true')
    //         : localStorage.removeItem(id);
    //         ;
    //     }
    // }

    // public wishlist(product_id, from = '') {
    //     const value = {
    //         customer_id : localStorage.getItem('customer_id'),
    //         product_id : product_id,
    //         type : 'remove'
    //     }
    //     if(this.checkWishList(product_id)) {
    //         value.type = 'remove';
    //     } else {
    //         if(from !== 'wishlistpage') {
    //             value.type = 'add';
    //         }
    //     }

    //     this.postData(value, 'wishlist').subscribe((data) => {
    //         this.notify(data.error, data.message);
    //         this.updateWishList(product_id, value.type);
    //     });
    // }

    public authCheck() {
        this.token = localStorage.getItem('token');
        if (this.token && this.token !== undefined) {
            return true;
        } else {
            return false;
        }
    }
    public index(params:any) {
      this.getToken();
      return this.http.get<any>(`${this.apiURL}/` + params, { headers });
  }


}
