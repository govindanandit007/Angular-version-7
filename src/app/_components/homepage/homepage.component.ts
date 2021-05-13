import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/_services/common/common.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
 
  isHomePage: any = true;
  screenArray: any = [];
  screeApiData: any = null;
  
  constructor(private router: Router, private commonService: CommonService) { 
  }

  ngOnInit() {
    if(!localStorage.getItem('navModules')){
      this.getScreens();
    }else{
      this.screenArray = localStorage.getItem('navModules').split(',');
       
      if(!this.screenArray.includes('ReportViewer')){
        this.screenArray.push('ReportViewer');
      }
    }

    this.commonService.currentDashboardData = null;
  }

  
  gotoDashboard(event:any,screenModule){
    localStorage.setItem('currentModule',screenModule);
    this.router.navigate(['dashboard']);
  }

  getScreens(){
    this.commonService.getScreenTypesByUserId().subscribe((userRoles: any) => {
      
      if (userRoles.status === 200) {
        if (userRoles.result.length) {
         for (const rowData of userRoles.result) {
           if(rowData.screenTypes === 'Web' && rowData.screenCategory === 'Master'){
             if(!this.screenArray.includes('Master')){
              this.screenArray.push('Master');
             }
           }
           if(rowData.screenTypes === 'Web' && rowData.screenCategory === 'Transactions'){
            if(!this.screenArray.includes('Transactions')){
             this.screenArray.push('Transactions');
            }
           }
           if(rowData.screenTypes === 'Web' && rowData.screenCategory === 'Warehouse'){
              if(!this.screenArray.includes('Warehouse')){
              this.screenArray.push('Warehouse');
              }
           }
           if(rowData.screenTypes === 'Web' && rowData.screenCategory === 'Settings'){
            if(!this.screenArray.includes('Settings')){
             this.screenArray.push('Settings');
            }
           }
           if(rowData.screenTypes === 'Web' && rowData.screenCategory === 'Outbound'){
            if(!this.screenArray.includes('Outbound')){
             this.screenArray.push('Outbound');
            }
           }
           if(rowData.screenTypes === 'Web' && rowData.screenCategory === 'LabelSetup'){
            if(!this.screenArray.includes('LabelSetup')){
             this.screenArray.push('LabelSetup');
            }
           }
           if(rowData.screenTypes === 'Web' && rowData.screenCategory === 'Dashboard'){
            if(!this.screenArray.includes('Dashboard')){
             this.screenArray.push('Dashboard');
            }
           }

           if(rowData.screenTypes === 'Web' && rowData.screenCategory === 'Inbound'){
            if(!this.screenArray.includes('Inbound')){
             this.screenArray.push('Inbound');
            }
           }

           if(rowData.screenTypes === 'Web' && rowData.screenCategory === 'Manufacturing'){
            if(!this.screenArray.includes('Manufacturing')){
             this.screenArray.push('Manufacturing');
            }
           }

           if(rowData.screenTypes === 'Web' && rowData.screenCategory === 'threePL'){
            if(!this.screenArray.includes('threePL')){
             this.screenArray.push('threePL');
            }
           }
   
         }
          
         if(!this.screenArray.includes('ReportViewer')){
           this.screenArray.push('ReportViewer');
         }
         localStorage.setItem('navModules',this.screenArray)
        }
      }
    });
  }

}
