import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnDestroy, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MatMenuTrigger, MatSnackBar, MatTreeNestedDataSource } from '@angular/material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AutheticationService } from 'src/app/_services/authetication.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { PurchaseOrderService } from 'src/app/_services/purchase-order.service';
import { ChngPassDialogComponent } from 'src/app/_shared/chng-pass-dialog/chng-pass-dialog.component';
import { ConfirmationIuDialogComponent } from 'src/app/_shared/confirmation-iu-dialog/confirmation-iu-dialog.component';
import { Constants } from 'src/app/_shared/Constants';


interface LeftMenu {
  name: string;
  children?: LeftMenu[];
  icon?: string;
  url?: string;
  isTitle?: boolean;
  level: number;
  index: any;
}

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit, OnDestroy {
  
  isHomePage: any = true;
  currentIndex : any = 0;
  isLogin: boolean;
  timer: any = '';
  confirmationIUDialogRef: MatDialogRef<ConfirmationIuDialogComponent>;
  ChngPassDialogRef: MatDialogRef<ChngPassDialogComponent>;
  iuId: any;
  iuCode: any;
  inventoryUnitList: any[] = [];
  userName: string;
  userImgURL = '';
  logoImgURL = '';
  screenArray = ['Dashboard']
  openTabs = [];

  sideNav = '#sideNav';
  treeControl = new NestedTreeControl<LeftMenu>(node => node.children);
  dataSource = new MatTreeNestedDataSource<LeftMenu>();

  isExpressEnabled: any = false;
  isOpen : any = true;
  screenCategoryArray = [];
  tempArray = [];
  tempArray1 = [];

  TREE_DATA: LeftMenu[] = [
    {
      name: 'Dashboard',
      children: [],
      icon: 'dashboard.svg',
      url: 'dashboard',
      isTitle: false,
      level: 1,
      index: null
    },
  ];
  finalArray = [];
  moduleIcons = {
    Inbound: 'Inbound.svg',
    Master: 'Master.png',
    Outbound: 'Outbound.svg',
    Manufacturing: 'manufacturing.svg',
    Settings: 'Settings.svg',
    Transactions: 'Transactions.svg',
    Warehouse: 'Warehouse.svg',
    LabelSetup: 'LabelSetup.svg',
    ReportViewer: 'Reports.svg',
    threePL: '3PL.svg'
  }
  previousDataNodes:LeftMenu[] = [];

  @ViewChild('navigationMenuTrigger',{static:true}) navigationMenuTrigger: MatMenuTrigger;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  url = window.location.href.indexOf("localhost:4200") >= 0 ? 'http://localhost:4200'  
        : Constants.serverUrl;

  tabs : any =  [{
    title: 'Dashboard',
    index: 0, 
    isActive: true,
    url: this.sanitizer.bypassSecurityTrustResourceUrl(this.url)
  }

  ];

    constructor(public sanitizer: DomSanitizer, 
      public authService: AutheticationService,
      public commonService: CommonService,
      private purchaseOrderService: PurchaseOrderService,
      public dialog: MatDialog,
      private snackBar: MatSnackBar,
      private router: Router){
        this.openTabs.push('Dashboard');
    }


  hasChild = (_: number, node: LeftMenu) => !!node.children && node.children.length > 0;
  ngOnInit() {

    this.authService.isLoggedIn.subscribe(
      isLoggedInValue => (this.isLogin = isLoggedInValue)
    );

    this.purchaseOrderService.defaultIuDataObservable.subscribe((data: any) => {
          this.iuId = JSON.parse(localStorage.getItem('defaultIU')).id;
          this.iuCode = JSON.parse(localStorage.getItem('defaultIU')).code;
    });
    this.getIuLov();

    this.userName = JSON.parse(localStorage.getItem('userDetails')).userName;
    const imgString = JSON.parse(localStorage.getItem('userDetails')).userImage;
    if (imgString === undefined || imgString === null) {
        this.userImgURL = 'assets/images/avatar_24px_2x.png';
    } else {
        this.userImgURL =
            imgString.slice(1, -1) === ''
                ? 'assets/images/avatar_24px_2x.png'
                : imgString.slice(1, -1);
    }
    const logoString = JSON.parse(localStorage.getItem('userDetails')).companyLogo;
    if(logoString !==null){
      this.logoImgURL = logoString.slice(1, -1);
    }else{
      this.logoImgURL = '';
    }

    this.isExpressEnabled = JSON.parse(localStorage.getItem('userDetails')).expressLabelFlag === 'Y' ? true : false;
    setTimeout(() => {
      this.updateSideBarVariables();
      this.getScreenTypesByUserId()
    }, 500);
    this.treeControl.dataNodes = [];

    // timer used for logout all tabs
    localStorage.setItem('isLoggedIn', 'true');
    this.timer = Observable.interval(500)
    .subscribe((val) => { 
      if( localStorage.getItem('isLoggedIn') === 'false'){
        this.authService.logout();
      }

      // Code for opening tabs for graphs Starts
      const data = JSON.parse(localStorage.getItem('graphRouting'))      
      if(data){
        if(this.openTabs.includes(data.routeTitle)){
          let index = this.currentIndex;
          for(let i=0; i<this.tabs.length; i++){
            if(this.tabs[i].title === data.routeTitle){
              index = i;
              break
            }
          }
          this.tabChanged(index);
          this.reloadIframe(index);
        }else{
          this.addTab({name:data.routeTitle ,url: data.routeKey  })
        }
        localStorage.removeItem('graphRouting')
      }
      // Code for opening tabs for graphs Ends
   
    });



  }

  reloadIframe(index){
    var iframe = document.getElementById(this.tabs[index].title) as HTMLIFrameElement;
    iframe.contentWindow.location.reload(true);
    localStorage.removeItem('graphRouting')
    return;
  }

  closeTab(index){
     
    if(this.tabs.length === 1){
      return
    }
    this.tabs.splice(index, 1)
    this.openTabs.splice(index, 1)
    this.currentIndex = 0;
    this.tabs[this.currentIndex].isActive = true;

   
  }

  addTab(node){
    
    if(this.openTabs.includes(node.name)){
      let index = this.currentIndex;
      for(let i=0; i<this.tabs.length; i++){
        if(this.tabs[i].title === node.name){
          index = i;
          break
        }
      }
       this.tabChanged(index);
       return;
    }
    this.openTabs.unshift(node.name);

    const newTab = new Object({
        title: node.name,
        isActive: true,
        url: this.sanitizer.bypassSecurityTrustResourceUrl(this.url + '/#/' + node.url)
    });

    for(let i=0; i<this.tabs.length; i++){
      this.tabs[i].isActive = false
    }
    this.tabs.unshift(newTab)

    this.tabs[this.currentIndex].isActive = false;
    this.currentIndex = 0;
    this.tabs[this.currentIndex].isActive = true;


  }

  tabChanged(index){
    for(let i=0; i<this.tabs.length; i++){
      this.tabs[i].isActive = false
    }
    this.tabs[this.currentIndex].isActive = false;
    this.currentIndex = index;
    this.tabs[index].isActive = true;
    
  }

  iframeLoadedCallBack(id){
    // document.getElementById('loaderBackdrop'+id).style.display = 'none';
    // document.getElementById('loader'+id).style.display = 'none';
  }

  logout(){
    this.authService.logout()
  }

  // Get IU LOV
  getIuLov() {
    this.commonService.getUserAssignIULOV().subscribe(
        (data: any) => {
            this.inventoryUnitList = [];
            if (data.status === 200) {
                for (const iuData of data.result) {
                    this.inventoryUnitList.push({
                        value: iuData.iuId,
                        label: iuData.iuCode,
                        name: iuData.iuName
                    });
                    if (iuData.defaultFlag == 'Y') {
                        let defaultIU = {
                            id: iuData.iuId,
                            code: iuData.iuCode
                        };
                        window.localStorage.setItem(
                            'defaultIU',
                            JSON.stringify(defaultIU)
                        );
                        this.iuId = JSON.parse(
                            localStorage.getItem('defaultIU')
                        ).id;
                        this.iuCode = JSON.parse(
                            localStorage.getItem('defaultIU')
                        ).code;
                    }
                }
                if (localStorage.getItem('defaultIU') != undefined) {
                    this.iuId = Number(
                        JSON.parse(localStorage.getItem('defaultIU')).id
                    );
                    this.iuCode = JSON.parse(
                        localStorage.getItem('defaultIU')
                    ).code;
                }
            } else {
                this.openSnackBar(data.error.message, '', 'error-snackbar');
            }
        },
        (error: any) => {             
            this.openSnackBar(error.error.message, '', 'error-snackbar');
        }
    );
  }
  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
      duration: 3500,
      panelClass: [typeClass]
    });
  }
  defaultIUChanged(event: any, value: any, label: any) {
      if (event.source.selected && event.isUserInput === true) {
          let defaultIU = {
              id: value,
              code: label
          };
          if (JSON.parse(localStorage.getItem('defaultIU')).id !== value) {
              this.openIuConfirmationDialog(
                  'iu Id',
                  defaultIU
              );
          } 
      }
  }

  openIuConfirmationDialog(pageName: string, data: any) {
      this.confirmationIUDialogRef = this.dialog.open(ConfirmationIuDialogComponent, {
          data: {
              pageName: pageName,
              data: data,
          },
          width: '30vw',
          disableClose: true
      });

  }


  closeNavbar(node){
    this.addTab(node)
    this.navigationMenuTrigger.closeMenu();
  }

  toggleNodes(node){
    if(node.level === 1){
      this.dataSource.data.find(data => {
        if(data.name === node.name){
          if(!this.previousDataNodes.length){
            this.previousDataNodes.push(data);
          }
          if(this.treeControl.dataNodes.length){
            if(this.previousDataNodes[0].name === node.name){
              this.treeControl.collapse(this.previousDataNodes[0]);
              this.treeControl.dataNodes = [];
              this.previousDataNodes = [];
            } else {
              // this.treeControl.collapse(this.previousDataNodes[0]);
              this.treeControl.collapseAll();
              this.previousDataNodes = [data];
              // this.previousDataNodes.push(data);
              this.treeControl.dataNodes.push(data);
              this.treeControl.expand(data);
            }
          } else{
            this.treeControl.dataNodes.push(data);
            this.treeControl.expand(data);
          }
        }
      }) 
    }
    if(node.level === 2){
      this.dataSource.data.find(data => {
        const isExtendedData = this.treeControl.isExpanded(data);
        if(isExtendedData){
          // console.log('opened');
          data.children.find(childData => {
            if(childData.name === node.name){
              this.treeControl.toggleDescendants(childData);
            } else{
              this.treeControl.collapse(childData);
            }
          });
        }
      })
    }
  }


  toggleSideNav(event, node){
    event.stopPropagation();
    event.preventdefault()
    if( node.name !== 'Dashboard' && 
      node.name !== 'Master' && 
      node.name !== 'Transactions' && 
      node.name !== 'Warehouse' && 
      node.name !== 'Settings' &&
      node.name !== 'LabelSetup' ){
      return;
    }
    

    this.treeControl.dataNodes = this.dataSource.data;
    this.treeControl.collapseAll();

    for(let i=0; i<this.dataSource.data.length; i++){
      if(node.name === this.dataSource.data[i].name){
        this.previousDataNodes = []
        this.previousDataNodes.push(this.dataSource.data[i]);
        this.treeControl.dataNodes = [];
        this.treeControl.dataNodes.push(this.dataSource.data[i])
        this.treeControl.expand(this.dataSource.data[i]);
        break;
      }
    }
  }

  getScreenTypesByUserId(){
    this.commonService.getScreenTypesByUserId().subscribe((userRoles: any) => {
     
      if (userRoles.status === 200) {
         
        // console.log(userRoles.result);
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


          for (const rowData of userRoles.result) {
            if(rowData.screenUrl === 'company' || rowData.screenUrl === 'items'){
              this.tempArray.push(rowData);
            }else{
              this.tempArray1.push(rowData);
            }
          }

          userRoles.result = this.tempArray.concat(this.tempArray1);

          // popuplate side bar
          for (let i = 0; i < userRoles.result.length; i++) {
            if (userRoles.result[i].screenTypes === 'Web' && userRoles.result[i].screenName !== 'Dashboard') {
              if (!this.screenCategoryArray.includes(userRoles.result[i].screenCategory)) {
                this.screenCategoryArray.push(userRoles.result[i].screenCategory);
                this.finalArray[userRoles.result[i].screenCategory] = [];
                if(userRoles.result[i].screenUrl === 'company'){
                  this.finalArray[userRoles.result[i].screenCategory].push(
                    {
                      name: userRoles.result[i].screenCategory, icon: this.moduleIcons[userRoles.result[i].screenCategory], level:1,
                      children: [
                        {name: userRoles.result[i].screenName, level: 2,icon: userRoles.result[i].screenIcon, screenCategory: userRoles.result[i].screenCategory,
                        children: [
                          { name: userRoles.result[i].screenName, 
                            isTitle: false, 
                            url: userRoles.result[i].screenUrl, 
                            level: 3, 
                            icon: userRoles.result[i].screenIcon,
                            index: 1
                          }
                        ]}
                      ]
                    }
                  )
                } else{
                  this.finalArray[userRoles.result[i].screenCategory].push(
                    {
                      name: userRoles.result[i].screenCategory, icon: this.moduleIcons[userRoles.result[i].screenCategory], level: 1,
                      children: [
                        { name: userRoles.result[i].screenName, isTitle: false, url: userRoles.result[i].screenUrl, level:2 , 
                          icon: userRoles.result[i].screenIcon, screenCategory: userRoles.result[i].screenCategory,}
                      ]
                    }
                  )
                }
              } else {
                
                  if(userRoles.result[i].screenUrl.includes('company')){
                    this.finalArray[userRoles.result[i].screenCategory][0].children[0].children.push({
                      name: userRoles.result[i].screenName, 
                      isTitle: false, 
                      url: userRoles.result[i].screenUrl, 
                      level: 3, 
                      icon: userRoles.result[i].screenIcon,
                      index: 1
                  });
                  } else if(userRoles.result[i].screenUrl === 'items'){
                    this.finalArray[userRoles.result[i].screenCategory][0].children.push(
                      {name: userRoles.result[i].screenName, level: 2, icon: userRoles.result[i].screenIcon,
                        screenCategory: userRoles.result[i].screenCategory,
                        children: [
                          { name: userRoles.result[i].screenName, 
                            isTitle: false, 
                            url: userRoles.result[i].screenUrl, 
                            level: 3, 
                            icon: userRoles.result[i].screenIcon,
                            index: i
                          }
                        ]
                      }
                    );
                  } else if(userRoles.result[i].screenUrl.includes('items')){
                      this.finalArray[userRoles.result[i].screenCategory][0].children[1].children.push({
                        name: userRoles.result[i].screenName, isTitle: false, url: userRoles.result[i].screenUrl, level: 3, icon: userRoles.result[i].screenIcon,index: i
                    });
                  }
                   else{
                    this.finalArray[userRoles.result[i].screenCategory][0].children.push(
                      { name: userRoles.result[i].screenName, isTitle: false, url: userRoles.result[i].screenUrl, level: 2, 
                        screenCategory: userRoles.result[i].screenCategory,icon: userRoles.result[i].screenIcon }
                    );
                  }
                

              }
            }
          }
          for (let i = 0; i < this.screenCategoryArray.length; i++) {
            this.TREE_DATA = this.TREE_DATA.concat(this.finalArray[this.screenCategoryArray[i]])
          }
           
          // Adding side bar screens
          const sequenceArray = this.screenArray;
          let tempArray = [];
          for (let i = 0; i < sequenceArray.length; i++) {
            for (let j = 0; j < this.TREE_DATA.length; j++) {
              if(sequenceArray[i] === this.TREE_DATA[j].name){
                tempArray.push(this.TREE_DATA[j]);
              }
            }
          }

          this.TREE_DATA = tempArray;
          this.dataSource.data = this.TREE_DATA;

        }
      }
    })
  }

  updateSideBarVariables() {
    this.notify.emit('updateSideBarVariables');
  }

  toggleSideNavWithBtn() {
    setTimeout(() => {
      this.isOpen = !this.isOpen;
    }, 100);
    this.notify.emit('toggleSideNav');
  }

  

  changePassword() {
      this.ChngPassDialogRef = this.dialog.open(ChngPassDialogComponent, {
          data: {
              
          },
          width: '45vw',
          disableClose: true
      });
  }

  ngOnDestroy(){
    this.timer ? this.timer.unsubscribe() : '';
  }

}
