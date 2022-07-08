import { Component, OnInit } from '@angular/core';
 import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-view-order',
    templateUrl: './view-order.component.html',
    styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit {

    loading = true;
    orderId:any = '';
    orderDetails:any = [];
    constructor(
        private route: ActivatedRoute,
        private apiService: ApiService,
    ) { }

    ngOnInit(): void {
        this.orderId = this.route.snapshot.paramMap.get('id');
        this.viewOrder();
    }

    viewOrder() {
        this.loading = true;
        this.apiService.getData('getOrderDetails', this.orderId).subscribe((data) => {
            this.orderDetails = data.data;
            setTimeout(() => {
                this.loading = false;
            }, 100)
        });
    }

}
