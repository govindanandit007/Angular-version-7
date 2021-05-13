import { Component, OnInit, ViewChild } from '@angular/core';
import { TelerikReportViewerComponent } from '@progress/telerik-angular-report-viewer';
import { StringResources } from 'src/app/_services/stringResources';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  // reportArray: any = ['Pick Slip','Wave Inquiry Report', 'PO Receiving Report', 'ASN Receiving Report'];
  reportArray: any = ['Wave Inquiry Report'];
  reportList: any = true;

  title = 'Report Viewer';
  viewerContainerStyle = {
      position: 'absolute',
      left: '0px',
      right: '0px',
      top: '0px',
      bottom: '0px',
      width: '100%',
      // height: '100%',
      overflow: 'scroll',
      clear: 'both',
      ['font-family']: 'ms sans serif'
  };

  reportSource: any = '';
  @ViewChild('viewer1', { static: false }) viewer: TelerikReportViewerComponent;


  constructor() { }

  ngOnInit() {
    document.cookie = 'username' + '=' + JSON.parse(localStorage.getItem('userDetails')).userEmail + ';path=/';
  }

  ready(){ 
  }

  viewerToolTipOpening(e: any, args: any){
      
  }

  loadReport(reportName){
    this.reportList = false;
    setTimeout(() => {
      const language = navigator.language;
      let resources = StringResources.english; // Default.
      if (language === 'ja-JP') { resources = StringResources.japanese;}
      this.viewer.viewerObject.stringResources = Object.assign(this.viewer.viewerObject.stringResources, resources);
      if( reportName === 'Wave Inquiry Report'){
        this.reportSource = {
          report: 'Wave Inquiry Report.trdp',
          parameters: {}
        };
      }
      if( reportName === 'Pick Slip'){
          this.reportSource = {
            report: 'PackingSlipBackup.trdp',
            parameters: {PickSlip:1619}
          };
      }
      if( reportName === 'PO Receiving Report'){
        this.reportSource = {
          report: 'PO_Receiving_Report.trdp',
          parameters: {PickSlip:1619}
        };
      }
      if( reportName === 'ASN Receiving Report'){
        this.reportSource = {
          report: 'ASN_Receiving_Report.trdp',
          parameters: {PickSlip:1619}
        };
      }
      this.viewer.setReportSource(this.reportSource)
      this.viewer.refreshReport()
    }, 2000);
    
  }

  backToReports(){
    this.reportList = true;
  }


}
