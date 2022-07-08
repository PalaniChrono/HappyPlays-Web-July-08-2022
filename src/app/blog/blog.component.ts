import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SharedService } from 'src/app/shared.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
    bloginfo: any;
    tagproduct: any;
    tagproductID: any;
    apiService: any;
    Blogtagdetails: any;
    productweight: any;
    loading: boolean =false;
    tagproductdetails: any;
    subCategorySlug: any;
  reversedata: any;

  constructor(private apiservice:ApiService,private route:ActivatedRoute,private deviceService:DeviceDetectorService) { }

  ngOnInit(): void {
    // this.tagproduct = this.route.snapshot.paramMap.get('tag');
    this.tagproductID = this.route.snapshot.paramMap.get('id');
    this.getblog();
  }
getblog(){
  this.apiservice.index('blogdetails').subscribe(data=>{
    const value = data.data
    this.bloginfo = value.recent_post;
    console.table(this.bloginfo)
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
