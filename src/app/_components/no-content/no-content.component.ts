import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-content',
  templateUrl: './no-content.component.html',
  styleUrls: ['./no-content.component.css']
})
export class NoContentComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  // go to dashboard
  goToDashboard() {
    this.router.navigate(['dashboard']);
  }

}
