import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

    loading = true;
    customerId = localStorage.getItem('customer_id');
    orderList:any = '';
    constructor(
        private apiService: ApiService,
    ) { }

    ngOnInit(): void {
        this.listCustomerOrders();

    }

    listCustomerOrders() {
        this.loading = true;
        this.apiService.getData('listCustomerOrders',this.customerId).subscribe((data) => {
            this.orderList = data.data;
            setTimeout(() => {
                this.loading = false;
            }, 100)
        })
        console.table("order detailssssss",this.orderList)

    }

    popUpClose(){

}

pagetop(){
  window.scrollTo(0,0)
}

}
