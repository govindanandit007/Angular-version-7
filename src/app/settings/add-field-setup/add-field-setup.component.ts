import { AfterViewInit, Component, ElementRef, HostListener, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSnackBar, MatSort, MatTable, MatTableDataSource, TooltipPosition } from '@angular/material';
import { CommonService } from 'src/app/_services/common/common.service';
import { AddFieldSetupService } from 'src/app/_services/settings/add-field-setup.service';
import { Observable } from 'rxjs';

export interface ParameterDataElement {
  addlField: any;
  addlFieldSetupId: any;
  context: any;
  enabledFlag: any;
  entity: any;
  labelName: any;
  mandatoryFlag: any;
}


@Component({
  selector: 'app-add-field-setup',
  templateUrl: './add-field-setup.component.html',
  styleUrls: ['./add-field-setup.component.css']
})
export class AddFieldSetupComponent implements OnInit, AfterViewInit, OnDestroy  {

  screenNameList: any = [];
  iuList: any = [];
  screenName: any = '';
  iuId: any = null;
  isIuRequired: any = false;
  screenId: any = null;

  addlFieldSetup: FormGroup;
  serialTableMessage = 'Please select the screen name';
  selectedRowIndex = null;
  screenNameArray = [];
  saveInprogress = false;
  timer: any = '';

  fieldData: any = [
    {addlField: 'addl_field1',  addlFieldSetupId :null, context : null, enabledFlag: 'N', entity: '',  labelName: '',  mandatoryFlag: 'N'},
    {addlField: 'addl_field2',  addlFieldSetupId :null, context : null, enabledFlag: 'N', entity: '',  labelName: '',  mandatoryFlag: 'N'},
    {addlField: 'addl_field3',  addlFieldSetupId :null, context : null, enabledFlag: 'N', entity: '',  labelName: '',  mandatoryFlag: 'N'},
    {addlField: 'addl_field4',  addlFieldSetupId :null, context : null, enabledFlag: 'N', entity: '',  labelName: '',  mandatoryFlag: 'N'},
    {addlField: 'addl_field5',  addlFieldSetupId :null, context : null, enabledFlag: 'N', entity: '',  labelName: '',  mandatoryFlag: 'N'},
    {addlField: 'addl_field6',  addlFieldSetupId :null, context : null, enabledFlag: 'N', entity: '',  labelName: '',  mandatoryFlag: 'N'},
    {addlField: 'addl_field7',  addlFieldSetupId :null, context : null, enabledFlag: 'N', entity: '',  labelName: '',  mandatoryFlag: 'N'},
    {addlField: 'addl_field8',  addlFieldSetupId :null, context : null, enabledFlag: 'N', entity: '',  labelName: '',  mandatoryFlag: 'N'},
    {addlField: 'addl_field9',  addlFieldSetupId :null, context : null, enabledFlag: 'N', entity: '',  labelName: '',  mandatoryFlag: 'N'},
    {addlField: 'addl_field10', addlFieldSetupId :null, context : null, enabledFlag: 'N', entity: '',  labelName: '',  mandatoryFlag: 'N'},
    {addlField: 'addl_field11', addlFieldSetupId :null, context : null, enabledFlag: 'N', entity: '',  labelName: '',  mandatoryFlag: 'N'},
    {addlField: 'addl_field12', addlFieldSetupId :null, context : null, enabledFlag: 'N', entity: '',  labelName: '',  mandatoryFlag: 'N'},
    {addlField: 'addl_field13', addlFieldSetupId :null, context : null, enabledFlag: 'N', entity: '',  labelName: '',  mandatoryFlag: 'N'},
    {addlField: 'addl_field14', addlFieldSetupId :null, context : null, enabledFlag: 'N', entity: '',  labelName: '',  mandatoryFlag: 'N'},
    {addlField: 'addl_field15', addlFieldSetupId :null, context : null, enabledFlag: 'N', entity: '',  labelName: '',  mandatoryFlag: 'N'}
  ];

  constructor(private fb: FormBuilder, 
    public addFieldSetupService: AddFieldSetupService,
    public commonService: CommonService,
    private snackBar: MatSnackBar) { }

  @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;

  tooltipPosition: TooltipPosition[] = ['below'];

  listProgress = false;
  parameterData: ParameterDataElement[] = [];
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
  
  parameterDisplayedColumns: string[] = [
    'addtlFieldNo',
    'labelName',
    'enabledFlag',
    'mandatoryFlag',
    'addlField'
  ];

  columns: any = [
      { field: 'addtlFieldNo', name: '#', width: 75, baseWidth: 5 },
      { field: 'labelName', name: 'Additional Field Name', width: 75, baseWidth: 25 },
      { field: 'enabledFlag', name: 'Enable Flag', width: 75, baseWidth: 15 },
      { field: 'mandatoryFlag', name: 'Is Mandotory', width: 75, baseWidth: 15 },
      { field: 'addlField', name: 'Additional Column Field', width: 75, baseWidth: 20 }
  ]

 

  validationMessages = {
    iuId: {
      required: 'IU is required.'
    },
    screenId: {
      required: 'Screen name is required.'
    }
  };

  addlFieldSetupFormErrors = {
    iuId: null,
    screenId: null
  };



  ngOnInit() {
    this.addlFieldSetupForm();

        // timer used for set iu value on change header value
    this.timer = Observable.interval(500)
    .subscribe((val) => { 
      if( (JSON.parse(localStorage.getItem('defaultIU'))).id !==  this.iuId){
        this.defaultIUSelectionChange((JSON.parse(localStorage.getItem('defaultIU'))).id);
        
      }

    });
    this.getScreenNames();
    this.getInventoryUnitLOV();
    this.commonService.getScreenSize(150);
  }

    // Form Group
  addlFieldSetupForm() {
    this.addlFieldSetup = this.fb.group({
      screenId: [null, Validators.required],
      iuId: [null, Validators.required]
    });
  }

  checkIfDuplicateExists(data){
    const tempArray = [];
    for (const item in data) {
      if(item !== ''){
        tempArray.push(item)
      }
    }
    return new Set(tempArray).size !== tempArray.length 
  }

 

  addlFieldSetupLogValidationErrors(group: FormGroup = this.addlFieldSetup): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.addlFieldSetupLogValidationErrors(abstractControl);
      } else {
        this.addlFieldSetupFormErrors[key] = '';
        if (
          abstractControl &&
          !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)
        ) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.addlFieldSetupFormErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }

  
  getScreenNames(){
    this.screenNameList = [];
    this.addFieldSetupService.getScreenNames()
    .subscribe((data: any) => {
      if(data.result && data.result.length){
        for (const rowData of data.result) {
          this.screenNameList.push({
            value: rowData.screenId,
            label: rowData.screenName,
            isIuRequired : rowData.lookupValueEnabledFlag
          });
        }
      }
    
    });
  }

  screenNameChanged(event: any, element: any){
    if (event.source.selected && event.isUserInput === true && element.value) {
      this.iuId         = (JSON.parse(localStorage.getItem('defaultIU'))).id;
      this.addlFieldSetup.patchValue({iuId:  this.iuId});
      this.screenName   = element.label;
      this.screenId     = element.value;
      this.isIuRequired = element.isIuRequired === 'Y' ? true : false;
      for (const rowData of this.parameterData) {
        rowData.addlFieldSetupId  = null;
        rowData.context           = null;
        rowData.enabledFlag       = false;
        rowData.entity            = this.screenName;
        rowData.labelName         = '';
        rowData.mandatoryFlag     = false;
      }

      // if(!this.isIuRequired){
        this.getAddtlFieldList(element.value);
      // }
    }

    
  }

defaultIUSelectionChange(iuId){
     for (const rowData of this.parameterData) {
        rowData.context  = iuId;
      }
      this.addlFieldSetup.patchValue({iuId:  iuId});
      this.iuId = iuId;
      if(this.isIuRequired){
        this.getAddtlFieldList(this.screenId);
      }
  }
  getAddtlFieldList(screenID){
    this.parameterData = [];
    this.parameterDataSource = new MatTableDataSource<any>(this.parameterData);

    this.listProgress = true;
    this.customTable.nativeElement.scrollLeft = 0;

    const data = {
        screenId    : screenID,
        screenCode  : null,
        iuId        : this.iuId ? this.iuId : null,
        enabledFlag : 'ALL'
    }
    this.addFieldSetupService
        .getScreenDetails(data)
        .subscribe(
            (data: any) => {
                this.listProgress = false;
                this.parameterData = this.fieldData;
                for (const rowData of this.parameterData) {
                  rowData.addlFieldSetupId = null;
                  rowData.context          = this.addlFieldSetup.value.iuId
                  rowData.enabledFlag      = false;
                  rowData.entity           = this.screenName;
                  rowData.labelName        = '';
                  rowData.mandatoryFlag    = false;
                }
                this.selectedRowIndex = null;

                if (data.status === 200) {
                    if (!data.message) {
                        for (const rowData of data.result) {
                          for (const rowData1 of this.parameterData) {
                            if(rowData.addlField === rowData1.addlField){
                              rowData1.addlFieldSetupId = rowData.addlFieldSetupId;
                              rowData1.context          = rowData.context
                              rowData1.enabledFlag      = rowData.enabledFlag === 'Y' ? true : false;
                              rowData1.entity           = rowData.entity
                              rowData1.labelName        = rowData.labelName
                              rowData1.mandatoryFlag    = rowData.mandatoryFlag === 'Y' ? true : false;
                            }
                          }
                        }
                        this.parameterDataSource = new MatTableDataSource<any>(this.parameterData);
                        this.parameterDataSource.sort = this.sort;
                    } else {
                      this.parameterData = this.fieldData;
                      this.parameterDataSource = new MatTableDataSource<any>(this.parameterData);
                      this.parameterDataSource.sort = this.sort;
                    }
                } else {
                    this.openSnackBar(data.message,'','error-snackbar');
                }
            },
            (error: any) => {
                this.listProgress = false;
                this.openSnackBar(error.error.message,'','error-snackbar');
            }
        );
  }

  // Get Inventory Unit LOV
  getInventoryUnitLOV() {
    this.iuList = [];
    this.commonService
      .getIULOV()
      .subscribe((data: any) => {
        for (const iuData of data.result) {
          this.iuList.push({
            value: iuData.iuId,
            label: iuData.iuCode
          });
        }
      });
  }

  cancelAddtnlField(event: any){
    this.parameterData = [];
    this.parameterDataSource = new MatTableDataSource<any>(this.parameterData);
    this.parameterDataSource.sort = this.sort;
    this.addlFieldSetup.patchValue({screenId:  ''});

  }

  submit(event: any){
    if(event){
        event.stopImmediatePropagation();
        this.saveInprogress = true;
        let data: any = [];
        for (const [i,rowData] of this.parameterData.entries()){
          if(rowData.labelName.trim() !== ''){
            this.screenNameArray.push(rowData.labelName);
            data.push({
              addlField         : rowData.addlField,
              addlFieldSetupId  : rowData.addlFieldSetupId,
              context           : rowData.context,
              enabledFlag       : rowData.enabledFlag === true ? 'Y' : 'N',
              entity            : rowData.entity,
              labelName         : rowData.labelName,
              mandatoryFlag     : rowData.mandatoryFlag === true ? 'Y' : 'N'
            });
          }else{
            if(rowData.labelName.trim() === '' && (rowData.mandatoryFlag === true || rowData.enabledFlag === true )){
              this.openSnackBar('Please enter the Attribute Name at row ' + (i+1),'','error-snackbar');
              this.selectedRowIndex = i;
              this.saveInprogress = false;
              return;
            }
            if(rowData.labelName.trim() === '' && rowData.mandatoryFlag === false 
            && rowData.enabledFlag === false && rowData.addlFieldSetupId ){
              this.screenNameArray.push(rowData.labelName);
              data.push({
                addlField         : rowData.addlField,
                addlFieldSetupId  : rowData.addlFieldSetupId,
                context           : rowData.context,
                enabledFlag       : rowData.enabledFlag === true ? 'Y' : 'N',
                entity            : rowData.entity,
                labelName         : rowData.labelName,
                mandatoryFlag     : rowData.mandatoryFlag === true ? 'Y' : 'N'
              });
            }
          }
        }
         
        if(data.length){
           
            if(this.checkIfDuplicateExists(this.screenNameArray)){
              this.openSnackBar('Duplicate Additional field name','','error-snackbar');
              this.screenNameArray = [];
              return;
            }
            this.screenNameArray = [];
            data = {
              addUpAdditionalSetups : data
            }
            this.addFieldSetupService
            .createAddtionalField(data)
            .subscribe(
                (data: any) => {
                   
                    if (data.status === 200) {
                          this.addlFieldSetup.patchValue({ screenId : null });
                          this.addlFieldSetup.patchValue({ iuId : null });
                          this.isIuRequired = false;
                          this.iuId = null;
                          this.screenId = null;
                          this.screenNameArray = [];
                          this.parameterData = [];
                          this.parameterDataSource = new MatTableDataSource<any>(this.parameterData);
                          this.parameterDataSource.sort = this.sort;
                          this.openSnackBar(data.message,'','success-snackbar');

                    } else {
                          this.openSnackBar(data.message,'','error-snackbar');
                    }
                    this.saveInprogress = false;
                },
                (error: any) => {
                    this.listProgress = false;
                    this.saveInprogress = false;
                    this.openSnackBar(error.error.message,'','error-snackbar');
                }
            );
        }else{
          this.openSnackBar('Please add any Attribute','','default-snackbar');
          this.saveInprogress = false;
        }
     
    }
  }

  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
        duration: 3500,
        panelClass: [typeClass]
    });
  }

  ngOnDestroy() {
    this.timer ? this.timer.unsubscribe() : '';
  }
  ngAfterViewInit() {
    this.parameterDataSource.sort = this.sort;
    setTimeout(() => {
        this.commonService.setTableResize(
            this.matTableRef.nativeElement.clientWidth,
            this.columns
        );
       
    }, 100);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.commonService.setTableResize(
            this.matTableRef.nativeElement.clientWidth,
            this.columns
        );
        this.commonService.getScreenSize(150);
    }

}
