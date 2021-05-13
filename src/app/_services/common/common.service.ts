import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse,
    HttpParameterCodec 
} from '@angular/common/http';
import { from, throwError, BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Constants } from 'src/app/_shared/Constants';
import { ConfirmationDialogComponent } from 'src/app/_shared/confirmation-dialog/confirmation-dialog.component';
// import { ConfirmationIuDialogComponent } from 'src/app/_shared/confirmation-iu-dialog/confirmation-iu-dialog.component';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { DatePipe} from '@angular/common';
import { eventTarget } from '@amcharts/amcharts4/.internal/core/utils/DOM';

 

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    confirmationDialogRef: MatDialogRef<ConfirmationDialogComponent>;
    // confirmationIUDialogRef: MatDialogRef<ConfirmationIuDialogComponent>;
    private renderer: Renderer2;
    pressed = false;
    currentResizeIndex: number;
    startX: number;
    startWidth: number;
    isResizingRight: boolean;
    resizableMousemove: () => void;
    resizableMouseup: () => void;
    screenMaxHeight:any;
    paginationArray: any = [10,20,30,40,50,100];
    searchInitTextLenght = 0;
    searchInputTextMinLenght = 0;
    searchValidationMessage = 'Please enter minimum 3 characters for all input search fields in search panel';
    currentDashboardData: any = null;

    
    private companyId = Number(
        JSON.parse(localStorage.getItem('userDetails')) ? JSON.parse(localStorage.getItem('userDetails')).companyId : ''
    );

    private searchDataSource = new BehaviorSubject('');
     
    searchdataArray = this.searchDataSource.asObservable();

    private getSearchInfoDataSource = new BehaviorSubject('');
    searchInfoArray = this.getSearchInfoDataSource.asObservable();

    private showSearchBar = new BehaviorSubject('');
    searchBarEnable = this.showSearchBar.asObservable();

    public unsubscribePing = new BehaviorSubject('');
    logoutArray = this.unsubscribePing.asObservable();

    public defaultIuDataSource = new BehaviorSubject('');
    // defaultIuDataObservable = this.defaultIuDataSource.asObservable();

    private apiUrlGetLOVSearch =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lovs/';
    private apiUrlGetUOMCONLOVSearch =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lovs/search';

    private apiUrlDependentLOVSearch =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lovs/search';

    private apiUrlLocatorGroups =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/location-group/';

    private apiUrlGetScreenTypeByUserId =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/screenTypes/assignToUser';
    private apiUrlGetOULOV =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/opr-unit/lov';
    private apiUrlGetIULOV =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/inv-unit/lov';
    private apiUrlGetUserAssignIULOV =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/user/iuDetails';
    private apiUrlGetShipmentStatusLOV =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lovs/SHIP';
    private apiUrlGetStockLocatorLOV =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lovs/SL';
    private apiUrlGetLocatorGroupLOV =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lovs/LG';
    private apiUrlGetSupplierLOV =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/partner/lov';
    private apiUrlGetSupplierSiteLOV =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/site/lov';
    private apiUrlGetItemLOV =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/item/lov';
    private apiUrlGetItemLOVWithRevision =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov/item/%20';
    private apiUrlGetUOMLOV =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/uom/lov';
    private apiUrlGetCategoryLOV =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/category/lov';
    private apiUrlLOVFromLookup =
        Constants.apiBaseUrl +
        Constants.apiMasterUrl + 'service/lookup/enabled?lookupName';
    private apiUrlGetItemLovByScreen =  Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based/search';
    private apiUrlGetItemLovBySerial =  Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based/search';
    private apiUrlGetCommonLovBasedOn =  Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based/search';
    private apiUrlGetRevisionLov = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based/search?show=revision&basedOn=item&column=';
    private apiUrlScreenDetails = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/Addlsetup/details';
    private apiIUBasedLOv = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/workorder/searchlov/?iuId=';
    private apiUrlGetMaterialStatusLov = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/material/getlov';
    private apiUrlGetItemLovBy3PLCustomer =  Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based/search';
    private apiUrlChangePassword =  Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/user/change-password';
    private apiUrl_getIOBYId = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/inv-unit/details';
   

    constructor(private http: HttpClient,
        public dialog: MatDialog,
        private router: Router,
        rendererFactory: RendererFactory2
        ) {
            this.renderer = rendererFactory.createRenderer(null, null);
           // window.localStorage.setItem('paginationSize', '10' );
        }

    getCountryLov(): Observable<any> {
        return this.http.get('./assets/LOV/countries.json');
    }

    getStateList(): Observable<any> {
        return this.http.get('./assets/LOV/states.json');
    }

    getCityList(): Observable<any> {
        return this.http.get('./assets/LOV/cities.json');
    }

    getLookupByLookupName(lookupName: string, lookupId: number) {
        return this.http.get(
            Constants.apiBaseUrl + Constants.apiMasterUrl +
                '/service/lookup/enabled?lookupName=' +
                lookupName +
                '&parentLookup=' +
                lookupId
        );
    }

    getStateLov(parentLookup: string) {
        return this.http.get(
            Constants.apiBaseUrl +
                '/service/lookup/enabled/?lookupName=State&parentLookup=' +
                parentLookup
        );
    }

    getCityLov(parentLookup: string) {
        return this.http.get(
            Constants.apiBaseUrl +
                '/service/lookup/enabled?lookupName=City&parentLookup=' +
                parentLookup
        );
    }
    getOULOV() {
        return this.http.get(
            this.apiUrlGetOULOV +
                '/' +
                JSON.parse(localStorage.getItem('userDetails')).companyId
        );
    }
    getIUBasedOnOULOV(ouId) {
        return this.http.get(
            this.apiUrlGetIULOV +
                '/' +
                JSON.parse(localStorage.getItem('userDetails')).companyId +
                '/?ouId=' +
                ouId
        );
    }
    getIULOV() {
        return this.http.get(
            this.apiUrlGetIULOV +
                '/' +
                JSON.parse(localStorage.getItem('userDetails')).companyId +
                '?ouId='
        );
    }
    getUserAssignIULOV() {
        return this.http.get(
            this.apiUrlGetUserAssignIULOV +
                '/' +
                JSON.parse(localStorage.getItem('userDetails')).userId
        );
    }
    getShipmentStatusLOV() {
        return this.http.get(
            this.apiUrlGetShipmentStatusLOV +
                '/' +
                JSON.parse(localStorage.getItem('userDetails')).companyId
        );
    }
     getStockLocatorLOV() {
        return this.http.get(
            this.apiUrlGetStockLocatorLOV +
                '/' +
                JSON.parse(localStorage.getItem('userDetails')).companyId
        );
    }
     getLocatorGroupLOV() {
        return this.http.get(
            this.apiUrlGetLocatorGroupLOV +
                '/' +
                JSON.parse(localStorage.getItem('userDetails')).companyId
        );
    }
    getSupplierLOV() {
        return this.http.get(
            this.apiUrlGetSupplierLOV +
                '/SUPP/' +
                JSON.parse(localStorage.getItem('userDetails')).companyId
        );
    }
    getCustomerLOV() {
        return this.http.get(
            this.apiUrlGetSupplierLOV +
                '/CUST/' +
                JSON.parse(localStorage.getItem('userDetails')).companyId
        );
    }
    getSupplierSiteLOV(tpId: number) {
        return this.http.get(
            this.apiUrlGetSupplierSiteLOV +
                '/' +
                JSON.parse(localStorage.getItem('userDetails')).companyId +
                '/?tpId=' +
                tpId
        );
    }
    getItemLOV() {
        return this.http.get(this.apiUrlGetItemLOV);
    }
    getItemLOVWithRevision() {
        return this.http.get(this.apiUrlGetItemLOVWithRevision);
    }
    getUOMLOV() {
        return this.http.get(this.apiUrlGetUOMLOV);
    }
    getCategoryLOV() {
        return this.http.get(this.apiUrlGetCategoryLOV);
    }
    getLookupLOV(lookupname: string) {
        return this.http.get(this.apiUrlLOVFromLookup + '=' + lookupname);
    }
    getScreenTypesByUserId() {
        const uId = Number(
            JSON.parse(localStorage.getItem('userDetails')).userId
        );
        return this.http.get(this.apiUrlGetScreenTypeByUserId + '/' + uId);
    }

    private handleError(ex: HttpErrorResponse) {
        return throwError('something went wrong');
    }

    getSearchLOV(searchType: string) {
        this.companyId = JSON.parse(
            localStorage.getItem('userDetails')
        ).companyId;
        return this.http.get(
            this.apiUrlGetLOVSearch + searchType + '/' + this.companyId
        );
    }
    getMaterialStatusLOV() {
        return this.http.get(this.apiUrlGetMaterialStatusLov );
    }
    getSearchUOMCONLOV(searchType: any) {

        return this.http.post(
            this.apiUrlGetUOMCONLOVSearch, searchType
        );
    }

    searhForMasters(data: any) {
         
         if(data.type != 'TASK' && data.type != undefined){
             window.localStorage.removeItem('taskDtailPage');
         }
        this.searchDataSource.next(data);
    }

    getsearhForMasters(data: any) {
        this.getSearchInfoDataSource.next(data);
    }

    getSearchBarEnable(data: string) {
        this.showSearchBar.next(data);
    }

    unsubscribePingAPI(data: any) {
        this.unsubscribePing.next(data);
    }

    setDefaultIU(data: any){
        this.defaultIuDataSource.next(data);
    }

    changePassword(oldPassword, newPassword) {
        const data ={
            newUserPassword :newPassword,
            userId          : JSON.parse(localStorage.getItem('userDetails')).userId,
            userPassword    : oldPassword
        }
        return this.http.put(
            this.apiUrlChangePassword, data
        );
    }

    getLocatorGroupList() {
        this.companyId = JSON.parse(
            localStorage.getItem('userDetails')
        ).companyId;
        return this.http.get(this.apiUrlLocatorGroups + this.companyId);
    }

    async getItemLovByScreen1( show, basedOn, column, text) {
        show    = show    ? 'show='     + show    : '';
        basedOn = basedOn ? '&basedOn=' + basedOn : '';
        column  = column  ? '&column='  + column  : '';
        text    = text    ? '&text='    + encodeURIComponent(text)    : '';

        return await this.http.get(
            this.apiUrlGetItemLovByScreen +'/?' + show + basedOn + column + text
            ).toPromise();
    }
    getItemLovByScreen( show, basedOn, column, text) {
        show    = show    ? 'show='     + show    : '';
        basedOn = basedOn ? '&basedOn=' + basedOn : '';
        column  = column  ? '&column='  + column  : '';
        text    = text    ? '&text='    + encodeURIComponent(text)    : '';

        return  this.http.get(
            this.apiUrlGetItemLovByScreen +'/?' + show + basedOn + column + text
            );
    }
    

    getItemLovBySerial( show, basedOn) {
        show    = show    ? 'show='     + show    : '';
        basedOn = basedOn ? '&basedOn=' + basedOn : '';

        return  this.http.get(
            this.apiUrlGetItemLovBySerial +'/?' + show + basedOn
            );
    }
    getItemLovBy3PLCustomer( show, basedOn) {
        show    = show    ? 'show='     + show    : '';
        basedOn = basedOn ? '&basedOn=' + basedOn : '';

        return  this.http.get(
            this.apiUrlGetItemLovBy3PLCustomer +'/?' + show + basedOn
            );
    }
    getCommonLovBasedOn( show, basedOn, column) {
        show    = show    ? 'show='     + show    : '';
        basedOn = basedOn ? '&basedOn=' + basedOn : '';
        column  = column  ? '&column='  + column  : '';

        return  this.http.get(
            this.apiUrlGetCommonLovBasedOn +'/?' + show + basedOn + column
            );
    }

    getItemLovByItemAndDesc( show, basedOn, column, text) {
        show    = show    ? 'show='     + show    : '';
        basedOn = basedOn ? '&basedOn=' + basedOn : '';
        column  = column  ? '&column='  + column  : '';
        text    = text    ? '&text='    + encodeURIComponent(text)    : '';

        return this.http.get(
            this.apiUrlGetItemLovByScreen +'/?' + show + basedOn + column + text
            );
    }

    getRevisionLovByItem(itemId:number){
        return this.http.get(this.apiUrlGetRevisionLov + itemId);
      }

    getIUBasedLOV(iuId:number){
        return this.http.get(this.apiIUBasedLOv + iuId);
      }

    // This Function accepts value greater than zero and also accecpt decimal values like 0.01, 1.22, 35.....
    isDecimal(evt) {
        var charCode = evt.which ? evt.which : evt.keyCode;
        var element = evt.currentTarget.value;
        if (charCode === 46 && element.length === 0) return false;
        
        if (element.indexOf('.') > -1 && charCode === 46) return false;

        if (element === '' && charCode === 48) return false;

        if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
            return false;

        return true;
    }
    isDecimalAndNegative(evt) {
        var charCode = evt.which ? evt.which : evt.keyCode;
        var element = evt.currentTarget.value;
        
        if (element.indexOf('.') > -1 && charCode === 46) return false;

        if (element === '' && charCode === 48) return false;

        if (element !== '' && element.indexOf('-') > -1 && charCode === 45)
            return false;

        if (
            charCode != 46 &&
            charCode != 45 &&
            charCode > 31 &&
            (charCode < 48 || charCode > 57)
        )
            return false;

        return true;
    }

    onlyDecimalNotAccept(evt){
        var charCode = evt.which ? evt.which : evt.keyCode;
        var element = evt.currentTarget.value;
        debugger
        
    }

    // This Function accepts natural numbers like 1, 2, 3, 4.......
    isNaturalNumber(evt) {
        var charCode = evt.which ? evt.which : evt.keyCode;
        var element = evt.currentTarget.value;

        if (charCode === 46) return false;

        if (element === '' && charCode === 48) return false;

        if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
            return false;

        return true;
    }

    // This Function accepts whole numbers like 0, 1, 2, 3, 4.......
    isWholeNumber(evt) {
        var charCode = evt.which ? evt.which : evt.keyCode;
        var element = evt.currentTarget.value;

        if (charCode === 46) return false;

        if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
            return false;

        return true;
    }
    isSpaceonFirstPosition(evt) {
        const charCode = evt.which ? evt.which : evt.keyCode;
        const element = evt.currentTarget.value;

        if (charCode === 32 && element === '') {
            return false;
        } else {
            return true;
        }
    }
    // Accept only number and integer i.e Alphanumeric
    isAlphanumeric(evt) {
        const charCode = evt.which ? evt.which : evt.keyCode;
        const element = evt.currentTarget.value;

        if (charCode >= 48 && charCode <= 57) {
            return true;
        }
        if (
            (charCode >= 65 && charCode <= 90) ||
            (charCode >= 97 && charCode <= 122)
        ) {
            return true;
        }
        return false;
    }

    // Not accept double quote ("") and backslash (/)
    checkLoginField(evt) {
        const charCode = evt.which ? evt.which : evt.keyCode;
        const element = evt.currentTarget.value;

        if (charCode === 34 || charCode === 47) {
            return false;
        }
        return true;
    }
    isValidInputText(inputval){
        if(inputval.length > 0 && inputval.length < this.searchInputTextMinLenght) {
            return false;
        }
        return true;
    }
    // checkInputValidity( searchInfo : any){
    //     let returnType: any = true;
    //     let searchTypeVal : string = searchInfo.searchType;
    //     let inputval = '';
    //     let inputval2 = '';
    //     let inputval3 = '';
    //     let inputval4 = '';
    //     let inputval5 = '';
    //     let inputval6 = '';
    //     let inputval7 = '';
    //     let inputval8 = '';
    //     let inputval9 = '';
    //     let inputval10 = '';

    //     // return returnType;
    // }
    phoneNumberValidation(evt) {
        const charCode = evt.which ? evt.which : evt.keyCode;
        const element = evt.currentTarget.value;

        if (charCode === 46) {
            return false;
        }
        if (
            charCode !== 46 &&
            charCode !== 32 &&
            charCode !== 43 &&
            charCode > 31 &&
            (charCode < 48 || charCode > 57)
        ) {
            return false;
        }

        return true;
    }

    // Accept only number and integer i.e Alphanumeric
    isAlphanumericWithDot(evt) {
        const charCode = evt.which ? evt.which : evt.keyCode;
        const element = evt.currentTarget.value;
        const consecutiveDots = new RegExp('^[a-zA-Z0-9]+([._][a-zA-Z0-9]+)*$');

        if (
            element === '' &&
            charCode === 46
        ) {
            return false;
        };

        if (charCode === 46) {
            const dotCount = element.match(/\./g) ? element.match(/\./g).length : '';
            if (element.match(consecutiveDots) !== null && dotCount <= 1) {
                return true;
            }else{
                return false;
            }
        }

        if (charCode >= 48 && charCode <= 57) {
            return true;
        }
        if (
            (charCode >= 65 && charCode <= 90) ||
            (charCode >= 97 && charCode <= 122)
        ) {
            return true;
        }


        // let value = evt.currentTarget.value;
        // let tempArray = value.split(".");
        // for (const pData of tempArray) {
        //     if (pData !== '' && pData.length > 4) {
        //         alert('enter less than 20');
        //         return false;
        //     }
        // }
        //  return true;

    }

    // This Function accepts whole numbers like 0, 1, 2, 3, 4.......
    isCharacterNumberOnly(evt) {
        var charCode = evt.which ? evt.which : evt.keyCode;

        if (  charCode > 47 && charCode < 58 ){
            return true;
        }else{
            return false;
        }
    }

    openConfirmationDialog(pageName: string, url: any) {
        this.confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                pageName: pageName,
                url: url
            },
            width: '30vw'
        });
    }

    // openIuConfirmationDialog(pageName: string, data: any) {
    //     this.confirmationIUDialogRef = this.dialog.open(ConfirmationIuDialogComponent, {
    //         data: {
    //             pageName: pageName,
    //             data: data,
    //         },
    //         width: '30vw',
    //         disableClose: true
    //     });

    // }

    // --------- resizing functionality -------------------
    setTableResize(tableWidth: number, columns) {
        let totWidth = 0;
        columns.forEach((column, index, array) => {
        if(index ===  array.length - 1){
            column.width = tableWidth - (totWidth + 3);
        } else{
            column.width =  Math.floor( (column.baseWidth / 100) * tableWidth);
            totWidth += column.width;
        }
        this.setColumnWidth(column);
        });
    }

    onResizeColumn(event: any, index: number, columns, matTableRef) {
        this.checkResizing(event, index, columns, matTableRef);
        this.currentResizeIndex = index;
        this.pressed = true;
        this.startX = event.pageX;
        this.startWidth = event.target.clientWidth;
        event.preventDefault();
        this.mouseMove(index, columns);
    }

    private checkResizing(event, index, columns, matTableRef) {
        const cellData = this.getCellData(index, matTableRef);
        if ( ( index === 0 ) || ( Math.abs(event.pageX - cellData.right) < cellData.width / 2 &&  index !== columns.length - 1 ) ) {
          this.isResizingRight = true;
        } else {
          this.isResizingRight = false;
        }
    }

    private getCellData(index: number, matTableRef) {
        const headerRow = matTableRef.nativeElement.children[0].children[0];
        const cell = headerRow.children[index];
        return cell.getBoundingClientRect();
    }

    mouseMove(index: number, columns) {
        this.resizableMousemove = this.renderer.listen('document', 'mousemove', (event) => {
          if (this.pressed && event.buttons ) {;
            const dx = (this.isResizingRight) ? (event.pageX - this.startX) : (-event.pageX + this.startX);
            const width = this.startWidth + dx;
            if ( this.currentResizeIndex === index && width > 50 ) {
              this.setColumnWidthChanges(index, width, columns);
            } 
          }
        });
        this.resizableMouseup = this.renderer.listen('document', 'mouseup', (event) => {
          if (this.pressed) {
            this.pressed = false;
            this.currentResizeIndex = -1;
            this.resizableMousemove();
            this.resizableMouseup();
             
          }
        });
    }

    setColumnWidthChanges(index: number, width: number, columns) {
        const orgWidth = columns[index].width;
        const dx = width - orgWidth;
        if ( dx !== 0 ) {
          const j = ( this.isResizingRight ) ? index + 1 : index - 1;
          const newWidth = columns[j].width - dx;
          if ( newWidth > 75 ) {
            //   width -> orgWidth
            columns[index].width = width; 
              this.setColumnWidth(columns[index]);
            //   newWidth to -> orgWidth
              columns[j].width = newWidth;
              this.setColumnWidth(columns[j]);
            }
        }
    }

    setColumnWidth(column: any) {
        const columnEls = Array.from( document.getElementsByClassName('mat-header-column-' + column.field) );
        columnEls.forEach(( el: HTMLDivElement ) => {
        el.style.width = column.width > 60 ? column.width + 'px' : '60px';
        });
    }
    // --------- end resizing functionality -------------------

    // get screen max height
    getScreenSize(extraHeight?:any) {
        const screenHeight = window.innerHeight;
        if(extraHeight){
          this.screenMaxHeight = (screenHeight - (249 + extraHeight)) + 'px';
        }
        else{
          this.screenMaxHeight = (screenHeight - 249) + 'px';
        }
    }

    // get custom table height
    getTableHeight(){
        return Number(this.screenMaxHeight.split('px')[0]);
    }

    // get tooltip from lov
    getToolTip(data:any, dataValue){
        if(data && data.length){
            let msg='';
            data.forEach(res=>{
                if(res.value === dataValue){
                    msg+=res.label + ' ';
                }
            })
            return msg;
          }else{
            return ' Please Select';
          }
    }

    disableInput(event:any){
        if(event){
        event.target.disabled = true
        }
    }

    dateFormat(dateData: any) {
        const dp = new DatePipe(navigator.language);
        const p = 'y-MM-dd'; // YYYY-MM-DD
        const dtr = dp.transform(new Date(dateData), p);
        return dtr;
    }

    setPaginationSize(event: any){
        const pageSize = event && event.pageSize ? String(event.pageSize) : '10'
        window.localStorage.setItem('paginationSize', pageSize );
        let scrollTop = document.getElementsByTagName('table')[0];
        scrollTop.scrollIntoView({behavior: "smooth", block: "start", inline: "start"});
    }

    getScreenDetails(data){
        return this.http.post( this.apiUrlScreenDetails, data);
    }

    // This function is use for checking the length of input field and triggred on keydown event.
    // It's accept two parameter-
    // event - for get the input field value
    // length - limit of input field.
    inputLengthCheck(event,length){
        if(event.target.value !== '' && event.keyCode !== 8){
            if(event.target.value.length > length){
                return false;
            }
        }
    }
    getInventoryOrgById(id: any) {
        return this.http.get(this.apiUrl_getIOBYId + '/' + id)
      }
    
  
}
