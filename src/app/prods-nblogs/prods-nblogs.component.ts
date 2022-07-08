import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SharedService } from 'src/app/shared.service';
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-prods-nblogs',
  templateUrl: './prods-nblogs.component.html',
  styleUrls: ['./prods-nblogs.component.css']
})
export class ProdsNblogsComponent implements OnInit {
  tagname: any;
  reqName: any;
  tagblog: any;

  Blogtagproduct: any;
  constructor(private apiservice:ApiService,private route:ActivatedRoute,private deviceService:DeviceDetectorService) { }
  bloginfo: any;
  tagproduct: any;
  tagproductID: any;
  apiService: any;
  Blogtagdetails: any;
  productweight: any;
  loading: boolean =false;
  tagproductdetails: any;
  subCategorySlug: any;
  productSlug: any;
  ngOnInit(): void {
    this.tagproductID = this.route.snapshot.paramMap.get('id');
    this.gettagProducts();
    this.getBlogTagProducts();
  }
  getBlogTagProducts(){
    // this.tagproduct = this.route.snapshot.paramMap.get('');
    this.Blogtagproduct = this.route.snapshot.paramMap.get('tag');
    this.apiservice.getData('getBlogTagProducts',this.tagproductID).subscribe(data=>{
      this.Blogtagdetails = data.data;
      if(this.Blogtagdetails.length==0){
        // alert("empty blog")

      }
      this.Blogtagdetails.forEach((element: { tag_name: any; }) => {
        this.reqName=element.tag_name
      });
      this.tagname=this.reqName[0].itemName
          setTimeout(() => {
              this.loading = false;
          }, 100);
      }, (error: any) => {
          this.loading = false;
    });

  }
  gettagProducts(){
    this.tagproduct = this.route.snapshot.paramMap.get('tag');
    this.tagproductID = this.route.snapshot.paramMap.get('id');
    this.apiservice.getData('getTagProducts',this.tagproductID).subscribe(data =>{
      this.tagproductdetails = data.data;
      setTimeout(() => {
          this.loading = false;
      }, 100);
  }, (error: any) => {
      this.loading = false;

    })


  }




  convertImage(url:any) {
    if(this.deviceService.isDesktop()) {
        return url.replace("/upload/", "/upload/c_scale,h_300,w_300/");
    } else if(this.deviceService.isMobile()) {
        return url.replace("/upload/", "/upload/c_scale,h_760,w_760/");
    }
  }
  pagetop(){
  window.scrollTo(0,0)
  }
}
