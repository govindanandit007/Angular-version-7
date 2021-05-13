import { Component, OnInit, HostBinding, OnDestroy} from '@angular/core';
import { AutheticationService } from './_services/authetication.service';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { CommonService } from 'src/app/_services/common/common.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy  {
    isLogin: boolean;
    isHomePage: boolean = false;
    showSidebarBtn: boolean = true;
    opened = false;
    sidenavWidth = 0;
    sidenavContentMargin = 0;
    // contentWidth = 'calc(100% - 249px)';
    contentWidth52 = 'calc(100%)';
    @HostBinding('@.disabled')
    animationsDisabled = false;


    constructor(private autheticationService: AutheticationService, private router: Router,
    private route:ActivatedRoute, private commonService: CommonService) {
        
        this.autheticationService.isLoggedIn.subscribe(
            isLoggedInValue => {
                this.isLogin = isLoggedInValue
                this.router.events.subscribe((url:any) => {
                   if(url.url === '/' && this.isLogin === true){
                        this.router.navigate(['dashboard']);
                    }
                });
            }
        );
        // this.autheticationService.isLoggedIn.subscribe(isLoggedInValue => this.isLogin = true);
    }

    ngOnInit() {


        this.sidenavWidth = 0;
        console.log("Code Deployed Dated on 11-May-2021 Eve");        
        this.router.events.subscribe(event  => {
            if(event instanceof NavigationEnd) {
                const url = top.location.href.split('#')[1];
                if( url && url != '/' && !url.includes('home')){
                    this.router.navigate(['home']);
                }
            }
            // NavigationEnd
            // NavigationStart
            // NavigationCancel
            // NavigationError
            // RoutesRecognized
          });


    }

  
    onOutletLoaded(component) {
        if(component && component.isHomePage === true){
            this.isHomePage = true;
            this.showSidebarBtn = false;
            this.opened = false;
            this.animationsDisabled = true;
        }else{
            this.isHomePage = false;
            this.showSidebarBtn = true;
            this.opened = true;
            this.animationsDisabled = false;
        }
      
    } 

    notifyAppController(data){
        if(data === "toggleSideNav"){
            this.toggleSideNav();
        }

        if(data === "updateSideBarVariables"){
            this.updateSideBarVariables();
        }
        
    }

    toggleSideNav() {
         

        this.sidenavWidth = this.sidenavWidth;
 
        if (this.sidenavWidth === 0) {
            this.sidenavWidth = 0;
            document.getElementsByTagName('app-side-bar')[0] ?
            document.getElementsByTagName('app-side-bar')[0].classList.add('sidebarClosed') : '';
           
        } else {
            this.sidenavWidth = 0;
            document.getElementsByTagName('app-side-bar')[0] ? 
            document.getElementsByTagName('app-side-bar')[0].classList.remove('sidebarClosed'): '';
           
        }

 
        this.sidenavContentMargin = this.sidenavContentMargin;
        this.sidenavContentMargin === 0 ? (this.sidenavContentMargin = 0) : (this.sidenavContentMargin = 0);
    }

    updateSideBarVariables(){
        this.sidenavWidth = 0;
        this.sidenavContentMargin = 0;
    }

    ngOnDestroy(){
    }
}
