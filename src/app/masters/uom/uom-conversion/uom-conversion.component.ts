import { Component, OnInit, ViewChild, Renderer, EventEmitter,
  Output, OnDestroy, TemplateRef, Input, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router, ActivatedRoute } from '@angular/router';
import { UnitOfMeasureService } from 'src/app/_services/uom/unit-of-measure.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatSort } from '@angular/material';


export interface ParameterDataElement {
  uom_Sno                    : string,
  uom_conversion_item        : string,
  itemName                   : string,
  itemLov?                   : any,
  showLov?                   : string,
  searchValue?               : string,
  inlineSearchLoader?        : string,
  uom_conversion_itemDes     : string,
  uom_conversion_unit        : string,
  uom_conversion_unit_id     : number,
  uom_conversion_class       : string,
  uom_conversion             : string,
  uom_conversion_baseUnit    : string,
  uom_conversion_baseUnit_id : number,
  uom_conversion_Date        : string,
  enabled_flag               : boolean,
  action                     : string,
  editing                    : boolean,
  addNewRecord?              : boolean,
  originalData?              : any;
}

@Component({
  selector: 'app-uom-conversion',
  templateUrl: './uom-conversion.component.html',
  styleUrls: ['./uom-conversion.component.css'],
  providers: [UnitOfMeasureService]
})
export class UomConversionComponent implements OnInit, AfterViewInit, OnDestroy {
  isEditable = false;
    isEdit = false;
    isAdd = false;
    listProgress = false;
    itemLov = [];
    itemLovAll = [];
    refreshSearchLov : any = '';
    selectedRowIndex = null;


    textUOM         = "";
    textConversion  = "";
    textBaseUnit    = "";
    UomDetail   :any    = "";
    uomTableMessage = '';
    @ViewChild('noItemDialogTemplate', { static: true }) noItemDialogTemplate: TemplateRef<any>;
    @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;


    // uomTableMessage = 'No Unit Of Measure defined.';
    @Output() searchComponentToggle = new EventEmitter<boolean>();
    searchEnable: boolean;
    showSearch = true;
    private searchInfoArrayunsubscribe: any;

  dataForSearch: any = '';
  searchJson: any = this.http.get('./assets/search-jsons/uom-conversion-search.json');
  parameterData: ParameterDataElement[] = [];
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
  parameterDisplayedColumns: string[] = [
    'uom_Sno',
    'uom_conversion_item',
    'uom_conversion_itemDes',
    'uom_conversion_unit',
    'uom_conversion_class',
    'uom_conversion',
    'uom_conversion_baseUnit',
    'uom_conversion_Date',
    'enabled_flag',
    'action'
  ];

  columns: any =  [
    {field: 'uom_Sno', name: '#', width: 75, baseWidth: 4 },
    {field: 'uom_conversion_item', name: 'Item', width: 150, baseWidth: 14 },
    {field: 'uom_conversion_itemDes', name: 'Item Description', width: 150, baseWidth: 16 },
    {field: 'uom_conversion_unit', name: 'UOM', width: 100, baseWidth: 8 },
    {field: 'uom_conversion_class', name: 'Class', width: 75, baseWidth: 8 },
    {field: 'uom_conversion', name: 'Conversion', width: 150, baseWidth: 11 },
    {field: 'uom_conversion_baseUnit', name: 'Base UOM', width: 150, baseWidth: 10 },
    {field: 'uom_conversion_Date', name: 'Disable Date', width: 100, baseWidth: 12 },
    {field: 'enabled_flag', name: 'Enable Flag', width: 100, baseWidth: 8 },
    {field: 'action', name: 'Action', width: 75, baseWidth: 7 }
  ];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  tooltipPosition: TooltipPosition[] = ['below'];
  @ViewChild(MatTable, {read: ElementRef, static: false} ) matTableRef: ElementRef;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private uomService: UnitOfMeasureService,
    private render: Renderer,
    private http: HttpClient,
    public commonService: CommonService,
    private dialog: MatDialog
  ) {
    this.searchEnable = true;
   }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.getUomDetail(params.id);
    })
    this.getItemLovAll(); 
    this.commonService.getScreenSize(99);
  }

  checkSearch(){
      let returnType : any = '';
      if(this.refreshSearchLov === 'refresh' ){
          returnType = true;
          this.refreshSearchLov = '';
      }else{
          returnType = false;
      }
      return returnType;
  }

  searchUomItems() {
    this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe((searchInfo: any) => {


     // This code is used for updating the search module lovs when we update or add data
     const checksearchSource = this.checkSearch();
     if(checksearchSource === true){
        return;
     }

     // This code is used for not loading the search result when module loads
     if(searchInfo.fromSearchBtnClick === true){
      this.customTable.nativeElement.scrollLeft = 0;
        // searchInfo.fromSearchBtnClick = false;
        // this.commonService.getsearhForMasters(searchInfo);
        this.isEdit = false;
        this.parameterData = [];
        this.parameterDataSource = new MatTableDataSource([]);
        this.parameterDataSource.paginator = this.paginator;
        this.parameterDataSource.sort = this.sort;
        this.uomTableMessage = '';
        if (searchInfo.searchType === 'uomCon') {
          this.selectedRowIndex = null;
          searchInfo.searchArray.fromUomId = this.UomDetail.uomId.toString()  // used for only UOM conversion
          this.listProgress = true;
          this.uomService
            .getUomConversionSearch(searchInfo.searchArray)
            .subscribe(data => {
              this.listProgress = false;
              if (data.status === 200) {

                if (!data.message) {
                  for (const rData of data.result) {
                     const obj = {
                          uom_Sno                     : '',
                          uom_conversion_item         : rData.itemId,
                          itemName                    : rData.itemName,
                          uom_conversion_itemDes      : rData.itemDescription,
                          uom_conversion_unit         : rData.fromUomCode,
                          uom_conversion_unit_id      : rData.fromUomId,
                          uom_conversion_class        : rData.uomClass,
                          uom_conversion              : rData.conversionRate,
                          uom_conversion_baseUnit     : rData.toUomCode,
                          uom_conversion_baseUnit_id  : rData.toUomId,
                          uom_conversion_Date         : rData.disableDate,
                          enabled_flag                : rData.uomEnabledFlag === 'Y' ? true : false,
                          action                      : '',
                          editing                     : false,
                          addNewRecord                : false
                      }
                      obj['originalData'] = Object.assign({}, obj);
                      this.parameterData.push(obj)
                  }

                  this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
                  this.parameterDataSource.paginator = this.paginator;
                  this.parameterDataSource.sort = this.sort;
                  // this.parameterDataSource.connect().subscribe(d => {
                  //     this.parameterDataSource.sortData(this.parameterDataSource.filteredData,this.parameterDataSource.sort);
                  // });
                } else {
                  this.uomTableMessage = data.message;
                }
              } else {
                this.openSnackBar(data.message, '', 'error-snackbar');
              }
            },
            (error: any) => {
              this.listProgress = false;
              this.openSnackBar(error.error.message, '', 'error-snackbar');
            });
        }
     }else{
       return;
     }


    // this.uomTableMessage = "No Unit Of Measure Item defined.";

    });
  }

  fetchNewSearchList(event: any, index: any, searchFlag: any, value: any){
    let charCode = event.which ? event.which : event.keyCode;
    if(charCode === 9){
       event.preventDefault();
       charCode = 13;
    }

    if ( !searchFlag && charCode !== 13 ){
      return;
    }

    // if( this.parameterData[index].showLov === 'hide' &&
    // (value === undefined || value === '' || ( value && value.trim() ==='' ) )){
    //   this.openSnackBar('Please enter the search value', '','default-snackbar');
    //   return;
    // }

     if(this.parameterData[index].showLov === 'hide'){
      this.parameterData[index].inlineSearchLoader = 'show';
      this.getItemLovByScreen(this.parameterData[index].searchValue, index, event)
    }else{
        this.parameterData[index].showLov = 'hide';
        this.parameterData[index].searchValue = '';
        this.parameterData[index].uom_conversion_item    = '';
        this.parameterData[index].uom_conversion_itemDes = '';
    }
  }

  searchForUomItems() {
    this.commonService.searhForMasters(this.dataForSearch);
    this.searchComponentToggle.emit(this.showSearch);
    this.searchEnable = true;
  }
  searchComponentOpen() {
    this.searchComponentToggle.emit(this.showSearch);
    this.searchEnable = true;
  }
  // show / hide search section
  getSearchToggle(searchToggle: boolean) {
    console.log('searchToggle');
    if (searchToggle === true) {
      this.searchEnable = searchToggle;
    } else {
      this.searchEnable = searchToggle;
    }
  }

  beginEdit(rowData: any, $event: any) {
    for (const pData of this.parameterData) {
        if (pData.addNewRecord === true) {
            this.openSnackBar('Please add your records first.', '','default-snackbar');
            return;
        }
    }
    if (rowData.editing === false) {
        rowData.editing = true;
        this.isAdd = false;
        this.isEdit = true;
        // this.render.setElementClass($event.target, 'editIconEnable', true);
    } else {
        // rowData.editing = false;
        // this.isEdit = false;
        // this.render.setElementClass($event.target, 'editIconEnable', false);
    }
}

disableEdit(rowData: any, index: any) {
  if (this.parameterData[index].editing === true) {
      this.parameterData[index].uom_Sno                    = this.parameterData[index].originalData.uom_Sno;
      this.parameterData[index].uom_conversion             = this.parameterData[index].originalData.uom_conversion;
      this.parameterData[index].uom_conversion_Date        = this.parameterData[index].originalData.uom_conversion_Date;
      this.parameterData[index].uom_conversion_baseUnit    = this.parameterData[index].originalData.uom_conversion_baseUnit;
      this.parameterData[index].uom_conversion_baseUnit_id = this.parameterData[index].originalData.uom_conversion_baseUnit_id;
      this.parameterData[index].uom_conversion_class       = this.parameterData[index].originalData.uom_conversion_class;
      this.parameterData[index].uom_conversion_item        = this.parameterData[index].originalData.uom_conversion_item;
      this.parameterData[index].uom_conversion_itemDes     = this.parameterData[index].originalData.uom_conversion_itemDes;
      this.parameterData[index].uom_conversion_unit        = this.parameterData[index].originalData.uom_conversion_unit;
      this.parameterData[index].uom_conversion_unit_id     = this.parameterData[index].originalData.uom_conversion_unit_id;
      this.parameterData[index].enabled_flag               = this.parameterData[index].originalData.enabled_flag;
      this.parameterData[index].inlineSearchLoader         = this.parameterData[index].originalData.inlineSearchLoader;
      this.parameterData[index].showLov                    = this.parameterData[index].originalData.showLov;
      this.parameterData[index].editing                    = false;

  };
  if (
      this.parameterData.find(({ editing }) => editing === true) ===
      undefined
  ) {
      this.isEdit = false;
  }
}

deleteRow(rowData: any, rowIndex: number) {
    this.selectedRowIndex = null;
    this.parameterData.splice(rowIndex, 1);
    this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
    this.parameterDataSource.paginator = this.paginator;
    this.parameterDataSource.sort = this.sort;
    this.checkIsAddRow();
}

checkIsAddRow() {
    let cnt = 0;
    const pLength = this.parameterData.length;
    for (const pdata of this.parameterData) {
        if (pdata.addNewRecord === true) {
            return;
        } else {
            cnt++;
        }
    }
    if (cnt === pLength) {
        this.isAdd = false;
    }
}

addRow() {
    this.selectedRowIndex = null;
    for (const pData of this.parameterData) {
        if (pData.editing === true && pData.addNewRecord === false) {
            this.openSnackBar('Please update your records first.', '','default-snackbar');
            return;
        }
    }
    this.isAdd = true;
    this.isEdit = false;

    this.parameterData.unshift({
        uom_Sno                     : '',
        uom_conversion_item         : '',
        itemName                    : '',
        showLov                     : 'hide',
        inlineSearchLoader          : 'hide',
        uom_conversion_itemDes      : '',
        uom_conversion_unit         : this.UomDetail.uomCode,
        uom_conversion_unit_id      : this.UomDetail.uomId,
        uom_conversion_class        : this.UomDetail.uomClass,
        uom_conversion              : '',
        uom_conversion_baseUnit     : this.UomDetail.baseUom,
        uom_conversion_baseUnit_id  : this.UomDetail.baseUomId,
        uom_conversion_Date         : '',
        enabled_flag                : true,
        action                      : '',
        editing                     : true,
        addNewRecord                : true
    });

    this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
    this.parameterDataSource.paginator = this.paginator;
    this.parameterDataSource.sort = this.sort;
}


openSnackBar(message: string, action: string, typeClass:string) {
  this.snackBar.open(message, action, {
       duration: 3500,
      panelClass: [typeClass]
  });
}

setUOMitemDescription(event,index, element){
  if (event.source.selected) {
    this.parameterData[index].uom_conversion_itemDes = element.itemDescription;

    this.parameterData[index].itemName = element.itemName;
  }
}

getItemLovByScreen(itemName, index, event){
  this.commonService.getItemLovByScreen( 'item', 'uom-conversion', this.UomDetail.uomClass, itemName).subscribe((data: any) => {
      this.parameterData[index].itemLov = [{
        key   : '',
        viewValue : ' Please Select',
        itemDescription : ''
      }];

      if( data.result && data.result.length){
        data =  data.result;
        this.parameterData[index].itemLov = [];
          for(let i=0; i<data.length; i++){
            this.parameterData[index].itemLov.push({
                key   : data[i].itemId,
                viewValue : data[i].itemName,
                data : data[i]

            })
          }
          this.parameterData[index].inlineSearchLoader = 'hide';
          this.parameterData[index].showLov = 'show';
          this.parameterData[index].searchValue = '';

          // Set the first element of the search
          this.parameterData[index].uom_conversion_item    = data[0].itemId;
          this.parameterData[index].uom_conversion_itemDes = data[0].itemDescription
      }else{
        this.parameterData[index].inlineSearchLoader = 'hide';
        this.openSnackBar('No match found', '','default-snackbar');
      }
  },
  (error: any) => {
    this.openSnackBar(error.error.message, '', 'error-snackbar');
  })
}

// getItemLovEnabled(){
//   this.uomService.getItemLovByUOMClass(this.UomDetail.uomClass).subscribe((data: any) => {
//   // this.uomService.getItemLov().subscribe((data: any) => {
//     let result  =  data.result;
//     data = data.result;
//     if(result && data.length){
//           for(var i=0; i<data.length; i++){
//               this.itemLov.push({
//                   key   : data[i].itemId,
//                   viewValue : data[i].itemName,
//                   itemDescription : data[i].itemDescription
//               })
//           }
//     } else{
//         this.noItemDialog(this.noItemDialogTemplate);
//     }
//   },
//   (error: any) => {
//     this.openSnackBar(error.error.message, '', 'error-snackbar');
//   })
// }

noItemDialog(templateRef){
  const dialogRef = this.dialog.open(templateRef, {
    width: '20%',
    data: 'items/itemUOM'
  });
  dialogRef.afterClosed().subscribe(response => {
      if (response) {
          this.router.navigate([response]);
      }
  });
}

closeDialog(url?: string){
  if(url){
    this.dialog.closeAll();
    this.router.navigate([url]);
  } else{
    this.dialog.closeAll();
  }
}

getItemLovAll(){
  this.uomService.getItemLovAll().subscribe((data: any) => {
      let result  =  data.result;
      data = data.result;
      if(result && data.length){
          for(var i=0; i<data.length; i++){
              this.itemLovAll.push({
                  key   : data[i].id,
                  viewValue : data[i].name
              })
          }
      }
  },
  (error: any) => {
    this.openSnackBar(error.error.message, '', 'error-snackbar');
  })
}

getUomDetail(id){
  this.uomService.getUomDetail(id).subscribe((data: any) => {
    if (data.status === 200 && data.result !== undefined) {
      this.textUOM = data.result[0].unitOfMeasure;
      this.textConversion = data.result[0].uomConversionRate;
      this.textBaseUnit = data.result[0].baseUom;
      this.UomDetail = data.result[0];
      this.getUomItems(id);
      //this.getItemLovEnabled(); // delete this for R&D
      this.searchJson.subscribe((resultData: any) => {
        resultData.UOMClass = this.UomDetail.uomClass;
        this.dataForSearch = resultData;
        this.searchUomItems();
        this.searchForUomItems();
      })
    }else{
      this.searchJson.subscribe((resultData: any) => {
        // resultData.UOMClass = this.UomDetail.uomClass;
        this.dataForSearch = resultData;
        this.searchUomItems();
        this.searchForUomItems();
      })
    }

    

  },
  (error: any) => {
    this.openSnackBar(error.error.message, '', 'error-snackbar');
  })
}

getUomItems(id){
  this.listProgress = true;
  this.uomService.getUomItems(id).subscribe((data: any) => {
    this.listProgress = false;
    this.parameterData = [];
    const message = data.message;
    data = data.result
    if(data && data.length){
        for(var i=0; i<data.length; i++){
            const obj = {
              uom_Sno                    : '',
              uom_conversion_item        : data[i].itemId,
              itemName                   : data[i].itemName,
              uom_conversion_itemDes     : data[i].itemDescription,
              uom_conversion_unit        : data[i].fromUomCode,
              uom_conversion_unit_id     : data[i].uom_conversion_unit,
              uom_conversion_class       : data[i].uomClass,
              uom_conversion             : data[i].conversionRate,
              uom_conversion_baseUnit    : data[i].toUomCode,
              uom_conversion_baseUnit_id : data[i].uom_conversion_baseUnit_id,
              uom_conversion_Date        : data[i].disableDate,
              enabled_flag               : true,
              action                     : '',
              editing                    : false,
              addNewRecord               : false
            }
            obj['originalData'] = Object.assign({}, obj);
            this.parameterData.push(obj);
        }
    }else{
      this.uomTableMessage = message;
    }

    this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
    this.parameterDataSource.paginator = this.paginator;
    this.parameterDataSource.sort = this.sort;
  })
}

onSubmit(type: string){
  const dataArray: any[] = [];

      for (const [i, pData] of this.parameterData.entries()) {
          if (type === 'save') {
              
              if (pData.addNewRecord === true) {
                  this.selectedRowIndex = null;
                  if (pData.uom_conversion_item != "" && pData.uom_conversion != "") {
                      dataArray.push(pData);
                      this.parameterData[i].addNewRecord = false;
                      this.parameterData[i].editing = false;
                      this.parameterData[i]['originalData'] = Object.assign({},pData);
                  } else {
                      this.selectedRowIndex = i;
                      this.openSnackBar('Please fill required fields.', '','default-snackbar');
                      return;
                  }
              }
          } else {
              if (pData.editing === true) {
                  if (pData.uom_conversion_item != "" && pData.uom_conversion != "") {
                    this.selectedRowIndex = null;
                      dataArray.push(pData);
                      this.parameterData[i].editing = false;
                      this.parameterData[i].originalData = {};
                      delete pData.originalData;
                      this.parameterData[i]['originalData'] = Object.assign({},pData);
                  } else {
                      this.selectedRowIndex = i;
                      this.openSnackBar('Please fill required fields.', '','default-snackbar');
                      return;
                  }
              }
          }
      }
      if (type === 'save') {
          this.addUomItem(dataArray);
      } else {
          this.updateUomItem(dataArray);
      }

  }

  addUomItem(data){
      let tempObect = {};
      const uomArray  = [];

      if(this.parameterData.length){
        for(var i=0; i<data.length; i++){
          // delete data[i].action;
          // delete data[i].editing;
          // delete data[i].addNewRecord;
          tempObect['createdBy'] = Number(JSON.parse(localStorage.getItem('userDetails')).userId);
          tempObect['conversionRate'] = Number(data[i].uom_conversion);
          tempObect['disableDate'] = data[i].uom_conversion_Date !== '' ? this.uomService.dateFormat( data[i].uom_conversion_Date ) : null;
          tempObect['fromUomId'] = data[i].uom_conversion_unit_id;
          tempObect['itemId'] = data[i].uom_conversion_item;
          tempObect['toUomId'] = data[i].uom_conversion_baseUnit_id;
          tempObect['uomClass'] = data[i].uom_conversion_class;
          tempObect['uomEnabledFlag'] = data[i].enabled_flag == true ? 'Y' : 'N';
          tempObect['updatedBy'] = Number(JSON.parse(localStorage.getItem('userDetails')).userId);
          uomArray.push(tempObect)
          tempObect = {};
        }
      }

      this.uomService.insertUomCon(uomArray).subscribe(result => {
          if (result.status === 200) {
            this.isAdd = false;
            this.openSnackBar(result.message, '','success-snackbar');
            this.refreshSearchLov = 'refresh';
            this.dataForSearch['lovSearchFromAdd_update'] = true;
            this.searchForUomItems();
            for (const pData of this.parameterData) {
              pData.addNewRecord = false;
              pData.editing =false;
            }
          } else {
              this.isAdd = false;
              this.openSnackBar(result.message, '','error-snackbar');
          }
      },
      (error: any) => {
        this.isAdd = true;
        // for (let i = 0; i < error.error.index.length; i++) {
        //   this.parameterData[error.error.index[i] - 1].editing = true;
        //   this.parameterData[error.error.index[i] - 1].addNewRecord = true;
        // }
        // Apply Changes To edit all unsaved records : 05-02-2020 (By Manoj Kumar)
        for(const uom of data) {
          uom.editing = true;
          uom.addNewRecord = true;
        }
        this.openSnackBar(error.error.message, '', 'error-snackbar');

      })
  }

  updateUomItem(data){
      let tempObect = {};
      const uomArray  = [];

      if(this.parameterData.length){
        for(var i=0; i<data.length; i++){

          tempObect['createdBy'] = Number(JSON.parse(localStorage.getItem('userDetails')).userId);
          tempObect['conversionRate'] = Number(data[i].uom_conversion);
          tempObect['disableDate'] = data[i].uom_conversion_Date !=='' ? this.uomService.dateFormat( data[i].uom_conversion_Date ) : null;
          tempObect['fromUomId'] = data[i].uom_conversion_unit_id;
          tempObect['itemId'] = data[i].uom_conversion_item;
          tempObect['toUomId'] = data[i].uom_conversion_baseUnit_id;
          tempObect['uomClass'] = data[i].uom_conversion_class;
          tempObect['uomEnabledFlag'] = data[i].enabled_flag == true ? 'Y' : 'N';
          tempObect['updatedBy'] = Number(JSON.parse(localStorage.getItem('userDetails')).userId);

          uomArray.push(tempObect)
          tempObect = {};
        }
      }

      this.uomService.updateUomConUom(uomArray).subscribe(result => {
          if (result.status === 200) {
            this.refreshSearchLov = 'refresh';
            this.dataForSearch['lovSearchFromAdd_update'] = true;
            this.searchForUomItems();
            for (const pData of this.parameterData) {
              pData.addNewRecord = false;
              pData.editing = false;
            }
            this.isEdit = false;
            this.openSnackBar(result.message, '','success-snackbar');
          } else {
              this.openSnackBar(result.message, '','error-snackbar');
              this.isEdit = false;
          }
      },
      (error: any) => {
        // for (let i = 0; i < error.error.index.length; i++) {
        //   this.parameterData[error.error.index[i] - 1].editing = true;
        //   this.parameterData[error.error.index[i] - 1].addNewRecord = true;
        // }
          // this.openSnackBar(error.error.message, '', 'error-snackbar');
          // uom_conversion_unit_id
          this.isEdit = true;
          // this.openSnackBar(error.error.message, '', 'error-snackbar');
          for(const m of data) {
            if(this.parameterData.find(d => d.uom_conversion_item = m.uom_conversion_item)) {
              const index = this.parameterData.indexOf(m);
              this.parameterData[index].editing = true;
              this.parameterData[index].addNewRecord = true;
            }
          }
        this.openSnackBar(error.error.message, '', 'error-snackbar');

      });

  }

  cancelItem(){
    this.router.navigate(['uom']);
  }

  ngOnDestroy() {
      this.searchInfoArrayunsubscribe
          ? this.searchInfoArrayunsubscribe.unsubscribe()
          : '';
      this.commonService.getsearhForMasters([]);
  }

  ngAfterViewInit() {
    this.parameterDataSource.paginator = this.paginator;
    this.parameterDataSource.sort = this.sort;
    // this.parameterDataSource.connect().subscribe(d => {
    //     this.parameterDataSource.sortData(this.parameterDataSource.filteredData,this.parameterDataSource.sort);
    // });
    setTimeout(() => {
      this.commonService.setTableResize(
          this.matTableRef.nativeElement.clientWidth,
          this.columns
      );
      this.paginator.pageSizeOptions = this.commonService.paginationArray;
      this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 )
  }, 100);
}
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
    this.commonService.getScreenSize(99);
  }

}
