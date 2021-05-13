import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  breadcrumbConfig: object = {
    bgColor: '#f2f2f4',
    fontSize: '12px',
    fontColor: '#0275d8',
    lastLinkColor: '#a4a4a4',
    symbol: ' > ',
    padding: 0
  };

  constructor(public router: Router) { }

  ngOnInit() {
  }

  goToDashboard(){
    this.router.navigate(['/dashboard']);
  }

}
