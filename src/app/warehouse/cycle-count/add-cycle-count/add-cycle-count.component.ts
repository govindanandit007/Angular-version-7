import { Component, OnInit, ViewChild, HostListener, TemplateRef, ElementRef } from '@angular/core';
import { MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, FormsModule } from '@angular/forms';
import { CommonService } from 'src/app/_services/common/common.service';
import { CycleCountService } from 'src/app/_services/warehouse/cycle-count.service';
import { TooltipPosition } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import {cloneDeep} from 'lodash';
import { dataLoader } from '@amcharts/amcharts4/core';
import { JsonExporterService } from 'mat-table-exporter';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { Observable } from 'rxjs';



export interface LgList {
  lgcode: string;
  lgId: number;
  select: any;
  cycleCountLgId?: any;
}

export interface ClassList {
  classname: string;
  id: string
  select: any;
  datasource?: any;
  action: any;
}

export interface ParameterDataElementClassItem {
  sno : string;
  item: string;
  itemId : any;
  description: any;
  include: any; 
  cycleCountItemId?: any;
  tempCycleCountItemId?: any;
  classId?: any;
}


@Component({
  selector: 'app-add-cycle-count',
  templateUrl: './add-cycle-count.component.html',
  styleUrls: ['./add-cycle-count.component.css']
})
export class AddCycleCountComponent implements OnInit {
  formTitle = 'Create Cycle Count :';
  cycleCountForm     : any; 
  selectToggle = false;
  approvalRequired: any = 'N';
  tolerancePercentage: any = null;
  lgSelectAll : any = false;
  recurrencePattern = 'D';
  rangeofRecurrence = 'NED';
  recur: any = '';
  recurEndDate: any = ''
  isEdit: any = false;
  onDate: any = '';
  onMonthName: any = '';
  startDate: any = '';
  endByDate: any = '';
  weekdays: any = {
    mon: '',
    tue: '',
    wed: '',
    thu: '',
    fri: '',
    sat: '',
    sun: '',
  }
  currentTab = 'LG'
  listProgress = false;
  classItemTableMessage = 'No Data Found';
  editData: any = '';
  previousLGlist: any = [];
  paramId: any = '';
  tempItemObjectArray: any = [];
  finalLGlist: any = [];
  cycleCountItemList: any = [];
  currentCycleCountName: any = "";
  currentClass: any = "";
  setStartDate: any = new Date();
  isEndDateDisabled: any = true;
  setSelectAll: any = true;
  saveInProgress = false;
  updateInProgress = false;
  timer: any = '';


  manualCountAllowedList: any = [{label:'Yes', value:'Y'},{label:'No', value:'N'}];
  // serialAllowedList: any = [{label:'Yes', value:'Y'},{label:'No', value:'N'}];
  IUList: any = [];
  dayList: any = [];
  listOfApprovalRequired: any = [];
  monthList: any = [
    {label:'January',value:'January'},
    {label:'February',value:'February'},
    {label:'March',value:'March'},
    {label:'April',value:'April'},
    {label:'May',value:'May'},
    {label:'June',value:'June'},
    {label:'July',value:'July'},
    {label:'August',value:'August'},
    {label:'September',value:'September'},
    {label:'October',value:'October'},
    {label:'November',value:'November'},
    {label:'December',value:'December'}
  ];
  allLocatorGroupList: any = [];
  currentClassindex: any = '';
  currentClassItemData : any = [];
  
  LGlist: LgList[] = [];  
  ClassList: ClassList[] = [];  
 
  displayedColumns: string[] = ['lgcode', 'select'];
  lgdataSource = new MatTableDataSource<LgList>(this.LGlist);

  displayedColumns1: string[] = ['select', 'classname', 'action'];
  classdataSource = new MatTableDataSource<ClassList>(this.ClassList);

  parameterDisplayedColumnsCLassItems: string[] = ['sno','item','description','include'];
  parameterDataClassItem: ParameterDataElementClassItem[] = [];
  parameterDataSourceClassItem = new MatTableDataSource<ParameterDataElementClassItem>(this.parameterDataClassItem);
  selectAllValue:boolean = true;
  tooltipPosition: TooltipPosition[] = ['below'];
  @ViewChild('ccForm', { static: false }) ccForm: FormGroupDirective;
  @ViewChild('toleranceQty', { static: false }) input:ElementRef;
  isNoClassSelected: boolean = false;
  isLgChanged: boolean = false;
  isNoLgSelected: boolean = false;
  itemSelectAll: boolean = false;

  constructor(private fb: FormBuilder,
    public commonService: CommonService,
    public cycleCountService: CycleCountService,
    private dialog: MatDialog,
    public router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar, ) {
      this.cycleCountFeedForm();
   }
   
  validationMessages = {
    ccname: {
      required: 'Cycle count name is required'
    },
    ccDescription: {
      required: 'Manual Count is required'
    },
    ccIU: {
      required: 'IU is required'
    },
    manualCountAllowed: {
      required: 'Manual Count is required'
    }
    // ,
    // serialAllowed: {
    //   required: 'Serial Allowed is required.'
    // }
  };

  ccFormErrors = {
    ccname  : '',
    ccDescription: '',
    ccIU: '',
    manualCountAllowed: '',
    // serialAllowed: '',
    frequencyRequired: ''
  };

  cycleCountFeedForm() {
    this.cycleCountForm = this.fb.group({
      ccname  : ['',Validators.required],
      ccDescription: ['',Validators.required],
      ccIU: [(JSON.parse(localStorage.getItem('defaultIU'))).id,Validators.required],
      manualCountAllowed: ['',Validators.required],
      // serialAllowed: ['', Validators.required],
      frequencyRequired: [false]
    })
  }

  ngOnInit() {
      // this.cycleCountService.defaultIuDataObservable.subscribe((data: any) => {
      //       console.log(data);
      //       if( !this.isEdit && data!== ''){
      //       this.cycleCountForm.patchValue({ccIU:  data});
      //       }
      //   });
    this.commonService.getScreenSize(200);
    this.getInventoryOrgLov();
    this.getAllLoctorGroupsLov();
    this.getClassList();
    this.getAllApprovalRequired();
    this.route.params.subscribe(params => {
      this.paramId = params.id
    });

   
    this.timer = Observable.interval(500)
    .subscribe((val) => { 
      let IU = JSON.parse(localStorage.getItem('defaultIU'));
      if( this.cycleCountForm.value.ccIU !== IU.id ){
        this.iuchanged({ source : { selected: true }, isUserInput : true }, IU.id)
        this.cycleCountForm.patchValue({ccIU:  IU.id});
      }
    });
   
  
  }

  ccLogValidationErrors(group: FormGroup = this.cycleCountForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.ccLogValidationErrors(abstractControl);
      } else {
        this.ccFormErrors[key] = '';
        if (
          abstractControl &&
          !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)
        ) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.ccFormErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }


  
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.lgdataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterforItem(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.parameterDataSourceClassItem.filter = filterValue.trim().toLowerCase();
  }

  frequencyRequiredChange(){
     
    this.cycleCountForm.patchValue({
      frequencyRequired : this.ccForm.value.frequencyRequired
    })
    this.currentTab = 'LG';
  } 
    
    

  baseFlagSelectionChanged(value, element:any){
    this.isLgChanged = true; 
    if( value === 'fromHeader'){
        this.finalLGlist = [];
        for (const [i,rowData] of this.lgdataSource.data.entries()) {
          this.lgdataSource.data[i].select = this.lgSelectAll ? this.lgSelectAll  : false;
        }
       
        if(this.lgSelectAll){
           for (const [i,rowData] of this.lgdataSource.data.entries()) {
              if(!rowData.cycleCountLgId){
                this.finalLGlist.push(rowData)
              }
           }
        }else{
          for (const [i,rowData] of this.lgdataSource.data.entries()) {
            if(rowData.cycleCountLgId){
              this.finalLGlist.push(rowData)
            }
         }
        }
        //this.selectToggle = !this.selectToggle;

    }else{
      let isSelectAll = true
      for (const [i,rowData] of this.LGlist.entries()) {
        if(rowData.select === false){
          isSelectAll = false;
        }
      }
      this.lgSelectAll = isSelectAll === false ? false : true;
      if( (element.cycleCountLgId && element.select === false) || (element.cycleCountLgId === null && element.select === true)){
        this.finalLGlist.push(element)
      }
      if( element.cycleCountLgId && element.select === true){
        let index: any = '';
        for (const [i,rowData] of this.finalLGlist.entries()) {
          if(element.lgId === rowData.lgId){
            index = i;
          }
        }
        this.finalLGlist.splice(index,1);
      } 
    }
  }
 // select / unselect all wave line checkbox
 selectAll(ele?: any){
  let selectedCount =0;
   if(!ele){
    for (const [i,rowData] of this.parameterDataSourceClassItem.data.entries()) {     
      rowData.include = this.selectAllValue;     
    }
  } 
  else{
    for (const [i,rowData] of this.parameterDataSourceClassItem.data.entries()) {     
      if(rowData.include){
        selectedCount++;
      }      
   }
   if(selectedCount === this.parameterDataSourceClassItem.data.length){
     this.selectAllValue = true;
   }else{
     this.selectAllValue = false;     
   }
  }
}
  classSelectionChanged(element,templateRef: TemplateRef<any>, index, value){
    let count = this.ClassList.length;
   if( value === 'fromHeader'){
      for (const [i,rowData] of this.classdataSource.data.entries()) {
        this.classdataSource.data[i].select = this.itemSelectAll ? this.itemSelectAll  : false;
      }
      if(this.itemSelectAll){
        this.addAllClassItems();
      }
      else {
        for (const [i, rowData1] of this.ClassList.entries()){          
          for (const [j,rowData] of rowData1.datasource.entries()){             
            if(rowData.include === true && !rowData.cycleCountItemId){
              this.ClassList[i].datasource[j].include = false;
            }      
          }
        }
      }
    }
    else {
      let isSelectAll = true;
      for (const [i,rowData] of this.ClassList.entries()) {
        if(rowData.select === false){
          isSelectAll = false;
        }
      }
      this.itemSelectAll = isSelectAll === false ? false : true;
      if(element.select === true){
      this.getItemListPerClass(element,index).then(val => {
        if(this.isEdit){
          for (const [i,rowData] of element.datasource.entries()) {
            this.ClassList[index].datasource[i].include = true;
          }
        }    
      });  
      }else{
        if(element.datasource.length !== 0){
        for (const [i,rowData] of element.datasource.entries()) {
          this.ClassList[index].datasource[i].include = false;
        }
      }else{
        this.getItemListPerClass(element, index).then(val => {
       for (const [i,rowData] of element.datasource.entries()) {
            this.ClassList[index].datasource[i].include = false;
          }
        });
      }
      }
   }
   for (const [i,rowData] of this.classdataSource.data.entries()) {
    if(this.ClassList[i].select === false){
      count --;
    }
   }
   if(count === 0){
     this.isNoClassSelected = true;
   }
   else{
     this.isNoClassSelected = false;
   }
  }
  addAllClassItems() {
    for (const [k,rowData] of this.classdataSource.data.entries()) {
    this.getItemListPerClass(rowData, k).then((val) => {
     });
    }
  }
  async getItemListPerClass(element, index){
    return await this.commonService.getItemLovByScreen1('item','item-class',null,element.id).then(
      (data: any) => {
          this.currentClassindex = index;
          this.currentCycleCountName = !this.isEdit ? this.cycleCountForm.value.ccname : this.currentCycleCountName;
          this.currentClass = element.classname
          this.parameterDataClassItem = [];
          if (data.result) {
            if(!this.isEdit){
              this.parameterDataClassItem = [];
              for (const rowData of data.result) {
                this.parameterDataClassItem.push({
                  sno               : '',
                  item              : rowData.itemName, 
                  description       : rowData.itemDescription, 
                  itemId            : rowData.itemId,
                  include           : true,
                  cycleCountItemId  : null,
                  classId           : element.id
                });
              }
               
              this.ClassList[this.currentClassindex].datasource = this.parameterDataClassItem;
              this.parameterDataSourceClassItem = new MatTableDataSource<ParameterDataElementClassItem>(this.parameterDataClassItem);
           
            }else{
               
              const tempItemObjectArray = this.getParentClassData()
              let itemArray: any = [];
              for (const classData of tempItemObjectArray) {
                if(classData.classCode === element.id){
                  itemArray = classData.itemArray
                }
              }
              this.parameterDataClassItem = [];
             
              for (const rowData of data.result) {
                let cycleCountId: any = null;
                for (const rowData1 of itemArray) {
                  if(rowData1.itemId === rowData.itemId){
                    cycleCountId = rowData1.cycleCountItemId
                  }
                }
                this.parameterDataClassItem.push({
                  sno               : '',
                  item              : rowData.itemName, 
                  description       : rowData.itemDescription, 
                  itemId            : rowData.itemId,
                  include           : true,
                  cycleCountItemId  : cycleCountId,
                  classId           : element.id
                });
              }

              this.ClassList[this.currentClassindex].datasource = this.parameterDataClassItem;
              this.parameterDataSourceClassItem = new MatTableDataSource<ParameterDataElementClassItem>(this.parameterDataClassItem);
           
       
            }
          }


          return data.result;
      });
  }
    getItemList(element,templateRef: TemplateRef<any>, index, call?: any){
    this.currentClassindex = index;
    this.currentCycleCountName = !this.isEdit ? this.cycleCountForm.value.ccname : this.currentCycleCountName;
    this.currentClass = element.classname
    this.parameterDataClassItem = [];
    //if(!this.isEdit) { this.selectAllValue = true;}
    
     
    if(!this.ClassList[this.currentClassindex].datasource.length &&  call === 'manualEvent'){
        this.commonService.getItemLovByScreen('item','item-class',null,element.id).subscribe(
          (data: any) => {
               
              if (data.result) {
                if(!this.isEdit){
                  this.parameterDataClassItem = [];
                  for (const rowData of data.result) {
                    this.parameterDataClassItem.push({
                      sno               : '',
                      item              : rowData.itemName, 
                      description       : rowData.itemDescription, 
                      itemId            : rowData.itemId,
                      include           : true,
                      cycleCountItemId  : null,
                      classId           : element.id
                    });
                  }
                  
                  this.ClassList[this.currentClassindex].datasource = this.parameterDataClassItem;
                  this.parameterDataSourceClassItem = new MatTableDataSource<ParameterDataElementClassItem>(this.parameterDataClassItem);
               
                }else{
                   
                  const tempItemObjectArray = this.getParentClassData()
                  let itemArray: any = [];
                  for (const classData of tempItemObjectArray) {
                    if(classData.classCode === element.id){
                      itemArray = classData.itemArray
                    }
                  }


                  this.parameterDataClassItem = [];
                 
                  for (const rowData of data.result) {
                    let cycleCountId: any = null;
                    for (const rowData1 of itemArray) {
                      if(rowData1.itemId === rowData.itemId){
                        cycleCountId = rowData1.cycleCountItemId
                      }
                    }
                    this.parameterDataClassItem.push({
                      sno               : '',
                      item              : rowData.itemName, 
                      description       : rowData.itemDescription, 
                      itemId            : rowData.itemId,
                      include           : true,
                      cycleCountItemId  : cycleCountId,
                      classId           : element.id
                    });
                  }

                  this.ClassList[this.currentClassindex].datasource = this.parameterDataClassItem;
                  this.parameterDataSourceClassItem = new MatTableDataSource<ParameterDataElementClassItem>(this.parameterDataClassItem);     
           
                }
              }
          },
          (error: any) => {
               //this.openSnackBar(error.error.message, '', 'error-snackbar');
          }
        )
        
    }else{       
      this.parameterDataSourceClassItem = new MatTableDataSource<ParameterDataElementClassItem>(this.ClassList[index].datasource);
      this.selectAll('check');
      if(templateRef != null){
        this.dialog.open(templateRef, {
          autoFocus: false,          
          minWidth:'60vw'
        });
      }
    }
    
  }

  saveClassItems(){
    let noItemSelected: boolean = true;
    let classid: any = '';
    for(const [i, rowData] of this.parameterDataSourceClassItem.data.entries()) {
      if(rowData.include === true){
        noItemSelected = false;
      }
      classid = rowData.classId;
    }
    if(noItemSelected){
      this.ClassList.find( x => {
         if(x.id === classid)
         {
           x.select = false;
         }    
      });
      if(this.itemSelectAll){
        this.itemSelectAll = false;
      }
    }
     this.dialog.closeAll();
  }

  // Get the lov for Inventory Orgarnization
  getInventoryOrgLov() {
    //this.IUList = [{ label: ' Please Select', value: '' }];
    this.IUList = [];
    this.commonService.getIULOV().subscribe(
        (data: any) => {
            if (data.result) {
                for (const rowData of data.result) {
                    if (rowData.iuEnabledFlag === 'Y') {
                        this.IUList.push({
                            label: rowData.iuCode,
                            value: rowData.iuId
                        });
                    }
                }
                this.IUList     =  this.IUList.sort((a, b) =>  a.label ? a.label.localeCompare(b.label) :  a.label)

            }
        },
        (error: any) => {
            // this.openSnackBar(error.error.message, '', 'error-snackbar');
        }
    );
  }

  renderEdit(){
    
      if (this.paramId) {
        this.formTitle = 'Edit Cycle Count :';
        this.isEdit = true;
        this.cycleCountService
          .getDetails(this.paramId)
          .subscribe((data: any) => { 
            if(data.status === 200){
              data = data.result[0];
              this.editData = data;
              this.previousLGlist = data.ccLgDetails;
              this.setSelectAll = false;
              this.cycleCountForm.setValue({
                ccname  : data.cycleCountName,
                ccDescription: data.description ,
                ccIU: data.iuId,
                manualCountAllowed: data.newCountAllowed,
                // serialAllowed: data.serialCountAllowed,
                frequencyRequired: false
              });
              this.currentCycleCountName = data.cycleCountName;
          
              // this.cycleCountForm.controls.ccname.disable();
              // this.cycleCountForm.controls.ccDescription.disable();
              // this.cycleCountForm.controls.ccIU.disable();
              // this.cycleCountForm.controls.manualCountAllowed.disable();
              // this.cycleCountForm.controls.serialAllowed.disable();

              this.approvalRequired = data.approvalRequired;
              this.tolerancePercentage = data.tolerancePercentage === null ? '' : data.tolerancePercentage;
              this.iuchanged({ source : { selected: true }, isUserInput : true }, this.cycleCountForm.value.ccIU)
              this.setValues(data)
            

            }else{

            }
          });
      } else {
        this.formTitle = 'Create Cycle Count :';
        this.isEdit = false;
        this.setSelectAll = false;
      }
      
  }


  setValues(data){
    // this.cycleCountForm.value.frequencyRequired = data.frequencyRequired === 'Y' ? true : false;
    this.cycleCountForm.patchValue({
        frequencyRequired: data.frequencyRequired === 'Y' ? true : false
    });
    if(data.ccFrequencyDetails.length && this.cycleCountForm.value.frequencyRequired === true){
      const frequencyData = data.ccFrequencyDetails[0]
      if(frequencyData.frequencyType === 'D'){
        this.recurrencePattern = 'D';
        this.recur = frequencyData.recurInterval;
      }
      if(frequencyData.frequencyType === 'W'){
        this.recurrencePattern = 'W';
        this.weekdays.sun = frequencyData.sundaySchedule    === 'Y' ? true : false;
        this.weekdays.mon = frequencyData.mondaySchedule    === 'Y' ? true : false;
        this.weekdays.tue = frequencyData.tuesdaySchedule   === 'Y' ? true : false;
        this.weekdays.wed = frequencyData.wednesdaySchedule === 'Y' ? true : false;
        this.weekdays.thu = frequencyData.thursdaySchedule  === 'Y' ? true : false;
        this.weekdays.fri = frequencyData.fridaySchedule    === 'Y' ? true : false;
        this.weekdays.sat = frequencyData.saturdaySchedule  === 'Y' ? true : false;
        this.recur = frequencyData.recurInterval;
       
      }
      if(frequencyData.frequencyType === 'M'){
        this.recurrencePattern = 'M';
        this.recur  = frequencyData.recurInterval;
        this.onDate = frequencyData.onDate;
        
      }
      if(frequencyData.frequencyType === 'Y'){
        this.recurrencePattern = 'Y';
        this.recur = frequencyData.recurInterval;
        this.onDate = frequencyData.onDate;
        this.onMonthName = frequencyData.onMonthName;
      }

      this.startDate = frequencyData.startDate
      if(frequencyData.noEndDateFlag){
        this.rangeofRecurrence = 'NED';
      }else if(frequencyData.endByDate){
        this.rangeofRecurrence = 'EB';
        this.endByDate = frequencyData.endByDate;
      }else{
        this.rangeofRecurrence = 'EAO'
        this.recurEndDate = frequencyData.endAfterInterval;
      }
    }

    if(data.ccItemDetails.length){
      let classArray: any = []
      for (const rowData of data.ccItemDetails) {
        classArray.push(rowData.abcClassCode) 
      }

      // getting all classes
      classArray = new Set(classArray);
      classArray = [...classArray]

      for (const [i,rowData] of this.ClassList.entries()) {
        for (const rowData1 of classArray) {
          if(rowData1 === rowData.id){
            this.ClassList[i].select = true;
          }
        }
      }

      // getting all items according to class
      let tempItemArray = []
      this.tempItemObjectArray = []
      for (const rowData of classArray)  {
        for (const rowData1 of  data.ccItemDetails){
          if(rowData1.abcClassCode === rowData){
            tempItemArray.push(rowData1)
          }
        }
        this.tempItemObjectArray.push({
          classCode         : rowData,
          itemArray         : tempItemArray
        })
        tempItemArray = [];
      }
       
      if(this.tempItemObjectArray.length === this.ClassList.length){
        this.itemSelectAll = true;
      }
      this.setDataSourceInClassList()
    }

  }

 
  setDataSourceInClassList(){
    
    for (const rowData1 of this.tempItemObjectArray){
      
      this.commonService.getItemLovByScreen('item','item-class',null,rowData1.classCode).subscribe(
        (data: any) => {
            if (data.result) {
                const datasource = [];
                for (const rowData of data.result) {
                  let flag = false;
                  let cycleCountItemIdValue = null;
                  for (const itemData of rowData1.itemArray) {
                    if(itemData.itemId === rowData.itemId){
                      flag = true;
                      cycleCountItemIdValue = itemData.cycleCountItemId;
                    }
                  }
                
                    datasource.push({
                      sno               : '',
                      item              : rowData.itemName, 
                      description       : rowData.itemDescription, 
                      itemId            : rowData.itemId,
                      include           : flag,
                      cycleCountItemId  : cycleCountItemIdValue,
                      classId           : rowData1.classCode
                    });
                  
                } 
                for (const [i,rowData] of this.ClassList.entries()) {
                  if(rowData.id === rowData1.classCode){
                    this.ClassList[i].datasource = datasource;
                  }
                }
                
            }
        },
        (error: any) => {
            this.openSnackBar(error.error.message, '', 'error-snackbar');
        }
      );

    } 


    
    }
  

   // Get the Locator Groups List
   getAllLoctorGroupsLov() {
    this.allLocatorGroupList = [];
    this.commonService.getLocatorGroupList().subscribe(
        (data: any) => {
            const locatorGroupLov = data.result;
            if(!data.message){
                for (const rowData of locatorGroupLov) {
                    this.allLocatorGroupList.push({
                        value: rowData.lgId,
                        label: rowData.lgCode,
                        lgType: rowData.lgType,
                        lgTypeName: rowData.lgTypeName,
                        lgIuId: rowData.lgIuId,
                        lgEnabledFlag: rowData.lgEnabledFlag
                    });
                }
                this.cycleCountForm.patchValue({ccIU:  JSON.parse(localStorage.getItem('defaultIU')).id});
                this.iuchanged({ source : { selected: true }, isUserInput : true }, this.cycleCountForm.value.ccIU)
            }
            this.renderEdit();
        },
        error => {
            this.openSnackBar(error , '', 'error-snackbar');
        }
    );
  }

  iuchanged(event: any, value){
    
    if (event.source.selected === true && event.isUserInput === true) {
      this.LGlist = [];
      for (const rowData of this.allLocatorGroupList) {
        if(rowData.lgIuId === value && rowData.lgType === 'STORAGE' ){
           
          this.LGlist.push({
            lgcode: rowData.label,
            lgId: rowData.value,
            select: false,
            cycleCountLgId : null,
          });
        }
      }

      if(this.previousLGlist.length){
        for (const rowData of this.previousLGlist) {
          for (const rowData1 of this.LGlist) {
            if(rowData1.lgId === rowData.lgId){
              rowData1.select = true;
              rowData1.cycleCountLgId =  rowData.cycleCountLgId ? rowData.cycleCountLgId : null;
            }
          }
        }
        this.previousLGlist.length = []
      }

      this.lgdataSource = new MatTableDataSource<LgList>(this.LGlist);
      this.lgSelectAll = false;
      for (const rowData of this.LGlist) {
        if(rowData.select === false){
          this.lgSelectAll = false;
          break;
        }else{
          this.lgSelectAll = true;
        }
      }
    }
  }

  getDayList(event:any, value:any){
    if (event.source.selected === true && event.isUserInput === true) {
      let dateLength = 31
      this.dayList = []
      if( value === 2 ){
        dateLength = 29
      }
      if( value === 4 || value === 6 || value === 9 || value === 11 ){
        dateLength = 30
      }
      for (let i=1; i<=dateLength; i++) {
        this.dayList.push({label:i, value:i})
      }
    }
  }

  getClassList() {
    this.ClassList = [];
    this.commonService.getLookupLOV('CYCLE_COUNT_CLASS').subscribe(
        (data: any) => {
            if (data.result) {
                for (const rowData of data.result) {
                        this.ClassList.push({
                            classname: rowData.lookupValueDesc,
                            id: rowData.lookupValue,
                            select: false,
                            action: '',
                            datasource: []
                        });
                }
                this.classdataSource = new MatTableDataSource<ClassList>(this.ClassList);
            }
        },
        (error: any) => {
            // this.openSnackBar(error.error.message, '', 'error-snackbar');
        }
    );
  }

  getAllApprovalRequired(){
    this.commonService.getLookupLOV('APPVL_REQ').subscribe(
      (data: any) => {
          if (data.result) {
              for (const rowData of data.result) {
                      this.listOfApprovalRequired.push({
                          label: rowData.lookupValueDesc,
                          value: rowData.lookupValue
                      });
              }
              this.classdataSource = new MatTableDataSource<ClassList>(this.ClassList);
          }
      },
      (error: any) => {
          // this.openSnackBar(error.error.message, '', 'error-snackbar');
      }
  );
  }


  getParentClassData(){
    return this.tempItemObjectArray;
  }

  optionchanged(){
    this.recur = '';
  }
  approvalRequiredchanged(){
    this.tolerancePercentage = '';
  }

  onStartDateChanged(event: any){
     
    this.isEndDateDisabled = false;
  }
   


  
  onSubmit(event: any){
     
    if(event){
      event.stopImmediatePropagation();
      if (this.cycleCountForm.valid) {
          this.createAndUpdateCycleCount();
      } else {
        this.openSnackBar('Please check mandatory fields', '', 'error-snackbar');
      }
    }
   
  }

  createAndUpdateCycleCount(){
    // const data: any = {
    //   approvalRequired:this.approvalRequired,
    //   cycleCountName: !this.isEdit ?  this.cycleCountForm.value.ccname : this.editData.cycleCountName,
    //   description: !this.isEdit ? this.cycleCountForm.value.ccDescription : this.editData.description,
    //   iuId: !this.isEdit ? this.cycleCountForm.value.ccIU : this.editData.iuId,
    //   newCountAllowed: !this.isEdit ? this.cycleCountForm.value.manualCountAllowed : this.editData.newCountAllowed,
    //   serialCountAllowed: !this.isEdit ? this.cycleCountForm.value.serialAllowed : this.editData.serialCountAllowed,
    // }

    // **** to Update cycle count name and others when cc is not yet generated ///
    const data: any = {
      approvalRequired:this.approvalRequired,
      cycleCountName:  this.cycleCountForm.value.ccname,
      description: this.cycleCountForm.value.ccDescription ,
      // iuId:this.cycleCountForm.value.ccIU,
      newCountAllowed:this.cycleCountForm.value.manualCountAllowed,
      // serialCountAllowed: this.cycleCountForm.value.serialAllowed,
    }

    data.frequencyRequired = this.cycleCountForm.value.frequencyRequired === true ? 'Y' : 'N';

    if(!this.isEdit){
      data.iuId = (JSON.parse(localStorage.getItem('defaultIU'))).id;
      data.createdBy = JSON.parse(localStorage.getItem('userDetails')).userId;
      data.addCycleCountFrequencies = [];
      data.addCycleCountItems = [];
      data.addCycleCountLgs = [];
    }else{
      data.iuId = this.cycleCountForm.value.ccIU;
      data.updatedBy = JSON.parse(localStorage.getItem('userDetails')).userId;
      data.updateCycleCountFrequencies = [];
      data.updateCycleCountItems       = [];
      data.updateCycleCountLgs         = [];
    }
    
    if(data.approvalRequired === 'T' ){
      if(this.tolerancePercentage){
        data.tolerancePercentage = Number(this.tolerancePercentage);
      }else{ 
        this.openSnackBar('Please enter the tolerance quantity', '', 'error-snackbar');
        return;
      }
    }


    if(this.LGlist){
      let tempArray = [];
      let count = 1;
       
      count = this.LGlist.length;
    
      for (const [i,rowData] of this.finalLGlist.entries()) {
          if(!this.isEdit){
            this.finalLGlist[i].createdBy = JSON.parse(localStorage.getItem('userDetails')).userId;
          }else{
            this.finalLGlist[i].updatedBy = JSON.parse(localStorage.getItem('userDetails')).userId;
          }
           
          if(this.finalLGlist[i].select === true || this.finalLGlist[i].cycleCountLgId){
            tempArray.push(this.finalLGlist[i]);
          }
        }
      for (const [i,rowData] of this.LGlist.entries()) {
          if(this.LGlist[i].select === false){
            count--;
        } }
      if( count === 0 && this.LGlist.length !== 0){
        this.isNoLgSelected = true;
        }
      if(!this.isEdit){
        data.addCycleCountLgs = tempArray;
      }else{
        data.updateCycleCountLgs = tempArray;
      }
    }

    

    // cycle count items
    if(!this.isEdit){
      let tempObjHolder:any = {};
      this.cycleCountItemList = new Array();
       
      for (const rowData1 of this.ClassList){
        for (const rowData of rowData1.datasource){
          if(rowData.include === true){
            tempObjHolder.abcClassCode     = rowData1.id;
            tempObjHolder.itemId           = rowData.itemId;
            tempObjHolder.cycleCountItemId = rowData.cycleCountItemId;
            tempObjHolder.createdBy        = JSON.parse(localStorage.getItem('userDetails')).userId;
            tempObjHolder.qtyTlrPct        = null;
            this.cycleCountItemList.push(tempObjHolder)
            tempObjHolder = {}
          }
        } 
      }
      data.addCycleCountItems    = this.cycleCountItemList; 
    }else{
      let tempObjHolder:any = {};
        
      for (const rowData1 of this.ClassList){
        for (const rowData of rowData1.datasource){
          if(rowData.include === true && !rowData.cycleCountItemId){
            tempObjHolder.abcClassCode     = rowData1.id;
            tempObjHolder.itemId           = rowData.itemId;
            tempObjHolder.cycleCountItemId = rowData.cycleCountItemId;
            tempObjHolder.updatedBy        = JSON.parse(localStorage.getItem('userDetails')).userId;
            tempObjHolder.qtyTlrPct        = null;
            this.cycleCountItemList.push(tempObjHolder)
            tempObjHolder = {}
          }

          if(rowData.include === false && rowData.cycleCountItemId){
            tempObjHolder.abcClassCode     = rowData1.id;
            tempObjHolder.itemId           = rowData.itemId;
            tempObjHolder.cycleCountItemId = rowData.cycleCountItemId;
            tempObjHolder.updatedBy        = JSON.parse(localStorage.getItem('userDetails')).userId;
            tempObjHolder.qtyTlrPct        = null;
            this.cycleCountItemList.push(tempObjHolder)
            tempObjHolder = {}
          }
        } 
      }      
      data.updateCycleCountItems    = this.cycleCountItemList; 
    }
    
     
    if(this.cycleCountForm.value.frequencyRequired){
      const tempObj : any = {};
      if(!this.recur){
        this.openSnackBar('Please enter the recurring value in frequency', '', 'error-snackbar');
        return;
      }
      tempObj.recurInterval = Number(this.recur);  
      if(!this.isEdit){
        tempObj.createdBy = JSON.parse(localStorage.getItem('userDetails')).userId;
      }else{
        tempObj.updatedBy = JSON.parse(localStorage.getItem('userDetails')).userId;
      }
      
  
      if(this.recurrencePattern === 'M' || this.recurrencePattern === 'Y'){
        const temp = this.recurrencePattern === 'M' ? 'month' : 'day';
        if(this.onDate === ''){
          this.openSnackBar('Please enter the '+ temp +' in monthly recurrence pattern in frequency', '', 'error-snackbar');
          return;
        }
      }
  
      if(this.recurrencePattern === 'D'){
        tempObj.frequencyType = 'D';
      }
  
      if(this.recurrencePattern === 'W'){
        tempObj.frequencyType = 'W';
        tempObj.sundaySchedule    = this.weekdays.sun === true ? 'Y' : 'N';
        tempObj.mondaySchedule    = this.weekdays.mon === true ? 'Y' : 'N';
        tempObj.tuesdaySchedule   = this.weekdays.tue === true ? 'Y' : 'N';
        tempObj.wednesdaySchedule = this.weekdays.wed === true ? 'Y' : 'N';
        tempObj.thursdaySchedule  = this.weekdays.thu === true ? 'Y' : 'N';
        tempObj.fridaySchedule    = this.weekdays.fri === true ? 'Y' : 'N';
        tempObj.saturdaySchedule  = this.weekdays.sat === true ? 'Y' : 'N';
      }
      if(this.recurrencePattern === 'M'){
        tempObj.onDate = Number(this.onDate);
        tempObj.frequencyType = 'M';
      }
      if(this.recurrencePattern === 'Y'){
        tempObj.frequencyType = 'Y';
        tempObj.onDate      = Number(this.onDate);
        tempObj.onMonthName = this.onMonthName;
      }
  
      if(this.startDate === ''){
        this.openSnackBar('Please enter the start date', '', 'error-snackbar');
        this.currentTab = 'Frequency';
        return;
      }
      tempObj.startDate = this.commonService.dateFormat(this.startDate);
      
      if(this.rangeofRecurrence === 'EB'){
        if(this.endByDate === ''){
          this.openSnackBar('Please enter the end date', '', 'error-snackbar');
          this.currentTab = 'Frequency';
          return;
        }
        tempObj.endByDate = this.commonService.dateFormat(this.endByDate);
      }
      if(this.rangeofRecurrence === 'EAO'){
        tempObj.endAfterInterval = Number(this.recurEndDate);
      }
  
       
      tempObj.cycleCountFrequencyId = this.isEdit ?
      (this.editData.ccFrequencyDetails.length ? this.editData.ccFrequencyDetails[0].frequencyId : null) : null;
  
      if(!this.isEdit){
        data.addCycleCountFrequencies.push(tempObj);
      }else{
        data.updateCycleCountFrequencies.push(tempObj);
      }
    }


    
    if( this.LGlist.length !== 0 && data.addCycleCountLgs && data.addCycleCountLgs.length === 0){
      this.openSnackBar('Please select LG', '', 'error-snackbar');
      return;
    }
    if(data.addCycleCountItems && data.addCycleCountItems.length === 0){
      this.openSnackBar('Please select class', '', 'error-snackbar');
      return;
    }
     
    if(this.isEdit){  
           
      if(this.isLgChanged && this.isNoLgSelected){
        this.isNoLgSelected = false;
        this.openSnackBar('Please select LG', '', 'error-snackbar');
         return;
         }
      if((this.isNoClassSelected)){
        this.isNoClassSelected = false;
           this.openSnackBar('Please select class', '', 'error-snackbar');
           return;
         }
    }

    if(!this.isEdit){
      this.saveInProgress = true;
      this.cycleCountService
      .createCycleCount(data)
      .subscribe(
        data => {
          if (data.status === 200) {
            this.saveInProgress = false;
            this.openSnackBar(data.message, '', 'success-snackbar');
            this.router.navigate(['cyclecount/cyclecountlist']);
          } else {
            this.openSnackBar(data.message, '', 'error-snackbar');
          }
        },
        error => {
          this.saveInProgress = false;
          this.openSnackBar(error.error.message, '', 'error-snackbar');
        }
      );
    }else{
      this.updateInProgress = true;
      data.cycleCountId = this.editData.cycleCountId;
      this.cycleCountService
      .updateCycleCount(data)
      .subscribe( (data: any) =>
         {
          if (data.status === 200) {
            this.updateInProgress = false;
            this.openSnackBar(data.message, '', 'success-snackbar');
            this.router.navigate(['cyclecount/cyclecountlist']);
          } else {
            this.openSnackBar(data.message, '', 'error-snackbar');
          }
        },
        error => {
          this.updateInProgress = false;
          this.openSnackBar(error.error.message, '', 'error-snackbar');
        }
      );
    }

    
  }

  toggleTab(value){
     
    if(this.cycleCountForm.value.frequencyRequired === false && value === 'LG'){
      this.openSnackBar('Please enable the frequency required field', '', 'error-snackbar');
      return;
    }
    this.currentTab = (value === 'LG') ? 'Frequency': 'LG';
    }

  backToUserList() {
    this.router.navigate(['cyclecount/cyclecountlist']);
  }

  ngOnDestroy(){
    this.timer ? this.timer.unsubscribe() : '';
  }

 
  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
         duration: 3500,
        panelClass: [typeClass]
    });
  }


 
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.commonService.getScreenSize(200);
  }

}
