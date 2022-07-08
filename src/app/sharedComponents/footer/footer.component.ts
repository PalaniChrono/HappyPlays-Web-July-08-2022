import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  desktopfooter : boolean  = true

  constructor() { }

  ngOnInit(): void {
    if(window.screen.width >=450){
      this.desktopfooter = true
    }
    else{
      this.desktopfooter= false
    }

  }

  pagetop(){
    window.scrollTo(0,0)
  }

}
