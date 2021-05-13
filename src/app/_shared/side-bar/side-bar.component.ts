import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { CommonService } from 'src/app/_services/common/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material';


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
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})

export class SideBarComponent implements OnInit {

  sideNav = '#sideNav';
  treeControl = new NestedTreeControl<LeftMenu>(node => node.children);
  dataSource = new MatTreeNestedDataSource<LeftMenu>();
  logoImgURL = '';
  iconImgURL = '';
  screenCategoryArray = [];
  isExpressEnabled: any = false;
  isOpen : any = true

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
    Manufacturing: 'Outbound.svg',
    Settings: 'Settings.svg',
    Transactions: 'Transactions.svg',
    Warehouse: 'Warehouse.svg',
    LabelSetup: 'LabelSetup.svg',
    ReportViewer: 'Reports.svg'
  }
  previousDataNodes:LeftMenu[] = [];

  @ViewChild('navigationMenuTrigger',{static:true}) navigationMenuTrigger: MatMenuTrigger;
  // @ViewChild('navigationMenuTrigger',{static:true}) trigger: MatMenuTrigger;

  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  constructor(
    public commonService: CommonService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) {
     
  }
  hasChild = (_: number, node: LeftMenu) => !!node.children && node.children.length > 0;
  ngOnInit() {
    this.isExpressEnabled = JSON.parse(localStorage.getItem('userDetails')).expressLabelFlag === 'Y' ? true : false;
    const logoString = JSON.parse(localStorage.getItem('userDetails')).companyLogo;
    if(logoString !==null){
      this.logoImgURL = logoString.slice(1, -1);
    }else{
      this.logoImgURL = '';
    }
    const iconString = JSON.parse(localStorage.getItem('userDetails')).companyIcon;
    if (iconString !== null) {
      this.iconImgURL = iconString.slice(1, -1);
    } else {
      this.iconImgURL = '';
    }
    setTimeout(() => {
      // this.updateSideBarVariables();
      // this.getScreenTypesByUserId()
    }, 200);
    this.treeControl.dataNodes = [];

    

  }

  closeNavbar(){
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
    // this.notify.emit('toggleSideNav');
    

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
                        {name: userRoles.result[i].screenName, level: 2,icon: userRoles.result[i].screenIcon,
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
                        { name: userRoles.result[i].screenName, isTitle: false, url: userRoles.result[i].screenUrl, level:2 , icon: userRoles.result[i].screenIcon}
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
                      { name: userRoles.result[i].screenName, isTitle: false, url: userRoles.result[i].screenUrl, level: 2, icon: userRoles.result[i].screenIcon }
                    );
                  }
                

              }
            }
          }
          for (let i = 0; i < this.screenCategoryArray.length; i++) {
            this.TREE_DATA = this.TREE_DATA.concat(this.finalArray[this.screenCategoryArray[i]])
          }
          
          const sequenceArray = ['Dashboard',localStorage.getItem('currentModule')];
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

  gotoHomePage() {
    window.localStorage.removeItem('taskDtailPage');
    this.router.navigate(['homepage']);
  }

  gotoDashboard() {
    this.router.navigate(['dashboard']);
  }

  goToLink(url: string){
    window.open('//' + url, '_blank');
  }

}
