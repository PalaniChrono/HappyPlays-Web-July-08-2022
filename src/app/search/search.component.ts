import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

    searchField: FormControl = new FormControl();
    keyword: any = '';
    productList: any = '';
    Products: any = '';
  subCategorySlug: any
  subCategoryName: any;
  allTags: any;
  productweight: any;
  loading: boolean = true;

    constructor(
        private apiService: ApiService,private route: ActivatedRoute, private deviceService: DeviceDetectorService
    ) {

    }

    ngOnInit() {
        this.search();
    }

    search() {
        this.searchField.valueChanges.pipe(debounceTime(150), distinctUntilChanged(), switchMap((query) =>
            this.apiService.searchData('webSearch', query)
        )).subscribe((result) => {
            this.productList = result.data;














        });
    }

    convertImage(url:any) {
      if(this.deviceService.isDesktop()) {
          return url.replace("/upload/", "/upload/c_scale,h_300,w_300/");
      } else if(this.deviceService.isMobile()) {
          return url.replace("/upload/", "/upload/c_scale,h_760,w_760/");
      }
  }


  getProducts() {
    this.subCategorySlug = this.route.snapshot.paramMap.get('slug');

    // alert(this.categorySlug);

    this.apiService.getData('getProducts', this.subCategorySlug).subscribe((data) => {
        const value = data.data[0];
        this.Products = value.products;
        this.subCategoryName = value.sub_category_name;
        this.allTags = value.tags[0].sub_category_tags;
        this.productweight = value.product_sizes.
        this.productweight.style.cursor="pointer"
        setTimeout(() => {
            this.loading = false;
        }, 100);
    }, error => {
        this.loading = false;
    });
}























}
