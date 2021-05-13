import { Component, OnInit, Renderer2, ViewChild, ElementRef,HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatTable, MatPaginator, MatSort, MatTableDataSource, TooltipPosition, MatDialogRef, MatDialog } from '@angular/material';
import { CommonService } from 'src/app/_services/common/common.service';
import { PrinterManagerService } from 'src/app/_services/labelSetup/printer-manager.service';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
export interface ParameterDataElement {
  No?: number,
  id?: number,
  name?: string,
  description: string,
  ipAddress: string,
  port: number,
  language: string,
  DPI: number,
  enabled?: any,
  printerId?: number,
  action?: string,
  editing?: boolean,
  addNewRecord?: boolean,
  isDefault?: boolean,
  originalData?: any,
  createdBy?: any[];
  updatedBy?: any[];
  addLineContent?: any;
  updateLineContent?: any;
  deleteLineContent?: any;
}
@Component({
  selector: 'app-create-printer-manager',
  templateUrl: './create-printer-manager.component.html',
  styleUrls: ['./create-printer-manager.component.css']
})
export class CreatePrinterManagerComponent implements OnInit {
  PrinterManagerForm: FormGroup;
  parameterData: ParameterDataElement[] = [];
  printerManagerDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
  isEditRoles = false;
  isAdd = false;
  isEdit = false;
  formTitle: string;
  printManagerId: number;
  tooltipPosition: TooltipPosition[] = ['below'];
  @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  saveInprogress = false;
  messageDialogRef: MatDialogRef<MessageDialogComponent>;
  selectedRowIndex = null;
  asnLineDisplayedColumns: string[] = [
    'No',
    'name',
    'description',
    'ipAddress',
    'port',
    'language',
    'DPI',
    'enabled',
    'action'
  ];
  columns: any = [
    { field: 'No', name: 'No', width: 75, baseWidth: 2 },
    { field: 'name', name: 'Name', width: 75, baseWidth: 19 },
    { field: 'description', name: 'Description', width: 75, baseWidth: 24 },
    { field: 'ipAddress', name: 'Ip Address', width: 75, baseWidth: 15 },
    { field: 'port', name: 'Port', width: 75, baseWidth: 7 },
    { field: 'language', name: 'Language', width: 75, baseWidth: 10 },
    { field: 'DPI', name: 'DPI', width: 75, baseWidth: 8 },
    { field: 'enabled', name: 'Enabled', width: 75, baseWidth: 10 },
    { field: 'action', name: 'Action', width: 75, baseWidth: 5 }
  ]

   validationMessages = {
        Name: {
            required: 'Name is required.'
        },
        Server: {
            required: 'Server is required.'
        },
        Port: {
            required: 'Port is required.'
        }
    };

    formErrors = {
        Name: '',
        Server: '',
        Port: ''
    };

  constructor(private fb: FormBuilder,
    public router: Router,
    private snackBar: MatSnackBar,
    private render: Renderer2,
    public commonService: CommonService,
    private printerManagerService: PrinterManagerService,
    private route: ActivatedRoute,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.printerManagerFeedForm();
    this.route.params.subscribe(params => {
      if (params.id) {
        this.formTitle = 'Edit Print Manager :';
        this.isEdit = true;
        this.printManagerId = params.id;
        // this.PrinterManagerForm.controls.searchValue.disable();
        this.printerManagerService
          .getPrintManagerById(params.id)
          .subscribe((data: any) => {
            this.PrinterManagerForm.patchValue(data[0]);
            this.PrinterManagerForm.patchValue({ Name: data[0].name });
            this.PrinterManagerForm.patchValue({ Server: data[0].server });
            this.PrinterManagerForm.patchValue({ Port: data[0].port });
            this.PrinterManagerForm.patchValue({ Name: data[0].name });
            this.PrinterManagerForm.patchValue({ IsActive: data[0].isActive ===0 ? false : true });
            this.formTitle = 'Edit Printer Manager : ' + data[0].name;
            this.printerManagerService
              .getPrinterById(data[0].id)
              .subscribe((data: any) => {
                this.renderEditRoles(data);
              });
          });
      } else {
        this.formTitle = 'Add Print Manager :';
        // this.PrinterManagerForm.patchValue({poType: 'SPO'});
      }
    });
    this.commonService.getScreenSize(156);
  }
  renderEditRoles(data) {
    for (const [index, pData] of data.entries()) {
      const obj = {
        name: pData.name,
        description: pData.description,
        ipAddress: pData.ipAddress,
        port: pData.port,
        language: pData.language,
        DPI: pData.dpi,
        enabled: pData.isActive === 1 ? true : false,
        id: pData.id,
        action: '',
        editing: false,
        addNewRecord: false,
        isDefault: true,
      }
      obj['originalData'] = Object.assign({}, obj);
      this.parameterData.push(obj);
      // this.getUOMList(pData.poItemId, index);
    }

    this.printerManagerDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
    this.printerManagerDataSource.paginator = this.paginator;
    setTimeout(() => {
      this.paginator.pageSizeOptions = this.commonService.paginationArray;
      this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 )
  }, 100);
    }
  addRow() {
    this.selectedRowIndex = null;
    this.paginator.pageIndex = 0;
    if (this.matTableRef.nativeElement.clientHeight > 240) {
      const elem = document.getElementById('customTable');
      elem.scrollTop = 0;
    }
    for (const pData of this.parameterData) {
      if (pData.editing === true && pData.addNewRecord === false) {
        this.openSnackBar('Please update your records first.', '', 'default-snackbar');
        return;
      }
    }
    // let MaxLineNumber = 0;
    // if (this.parameterData.length) {
    //   MaxLineNumber = Math.max.apply(Math, this.parameterData.map(function (key) { return key.lineNumber; }))
    // }
    this.isAdd = true;
    this.isEditRoles = false;
  
    this.parameterData.unshift({
      No: null,
      name: '',
      description: '',
      ipAddress: '',
      port: null,
      language: '',
      DPI: null,
      enabled: false,
      printerId: null,
      action: '',
      editing: true,
      addNewRecord: true,
      isDefault: false,
    });

    this.printerManagerDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
    this.printerManagerDataSource.paginator = this.paginator;
    this.printerManagerDataSource.sort = this.sort;
    this.printerManagerDataSource.connect().subscribe(d => {
      this.printerManagerDataSource.sortData(this.printerManagerDataSource.filteredData, this.printerManagerDataSource.sort);
    });
  }

  deleteRow(rowData: any, rowIndex: number) {
      this.selectedRowIndex = null;
    this.parameterData.splice(rowIndex, 1);
    this.printerManagerDataSource = new MatTableDataSource<
      ParameterDataElement
    >(this.parameterData);
    this.printerManagerDataSource.paginator = this.paginator;
    this.checkIsAddRow();
    // let count = this.parameterData.length + 1;
    // for (const pData of this.parameterData) {
    //   pData.lineNumber = --count;
    // }
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

  beginEdit(rowData: any, $event: any) {
    for (const pData of this.parameterData) {
      if (pData.addNewRecord === true) {
        this.openSnackBar('Please add your records first.', '', 'default-snackbar');
        return;
      }
    }
    if (rowData.editing === false) {
      rowData.editing = true;
      this.isAdd = false;
      this.isEditRoles = true;
      rowData.showLov = 'hide';
      rowData.inlineSearchLoader = 'hide';
      rowData.searchValue = rowData.itemName;
      // this.getItemLovByScreen(this.parameterData[index].searchValue, index, '')
      // this.render.setStyle($event.target, 'editIconEnable', true);
    } else {
      // rowData.editing = false;
      // this.isAdd = true;
      //   this.isEditRoles = false;
      // this.render.setStyle($event.target, 'editIconEnable', false);
    }
  }
  disableEdit(rowData: any, index: any) {
    if (this.parameterData[index].editing === true) {
      this.parameterData[index].isDefault = this.parameterData[index].originalData.isDefault;
      this.parameterData[index].name = this.parameterData[index].originalData.name;
      this.parameterData[index].description = this.parameterData[index].originalData.description;
      this.parameterData[index].ipAddress = this.parameterData[index].originalData.ipAddress;
      this.parameterData[index].port = this.parameterData[index].originalData.port;
      this.parameterData[index].language = this.parameterData[index].originalData.language;
      this.parameterData[index].DPI = this.parameterData[index].originalData.DPI;
      // this.parameterData[index].poItemRevision = this.parameterData[index].originalData.poItemRevision;
      // this.parameterData[index].poIuId = this.parameterData[index].originalData.poIuId;
      // this.parameterData[index].poLineAmount = this.parameterData[index].originalData.poLineAmount;
      // this.parameterData[index].poLineId = this.parameterData[index].originalData.poLineId;
      // this.parameterData[index].poLineNumber = this.parameterData[index].originalData.poLineNumber;
      // this.parameterData[index].poLineReceiptQty = this.parameterData[index].originalData.poLineReceiptQty;
      // this.parameterData[index].poPlannedReceiptDate = this.parameterData[index].originalData.poPlannedReceiptDate;
      // this.parameterData[index].poPrice = this.parameterData[index].originalData.poPrice;
      // this.parameterData[index].poQuantity = this.parameterData[index].originalData.poQuantity;
      // this.parameterData[index].poReceiptRouting = this.parameterData[index].originalData.poReceiptRouting;
      // this.parameterData[index].poUomCode = this.parameterData[index].originalData.poUomCode;
      this.parameterData[index].editing = false;
      this.isEditRoles = false;

    };
    // if (
    //     this.parameterData.find(({ editing }) => editing === true) ===
    //     undefined
    // ) {
    //     this.isEdit = false;
    // }
    // this.calculatePoAmount();
  }
  onSubmit(event: any, formId: any) {
    if (event) {
      // event.stopImmediatePropagation();

      if (this.PrinterManagerForm.valid) {
        // this.PrinterManagerForm.patchValue({ poAmount: Number(this.PrinterManagerForm.value.poAmount) })
        if (this.isEdit) {
          this.PrinterManagerForm.value.AppUserName = 'admin@visioncorp.com';

          this.PrinterManagerForm.value.IsActive === true ? this.PrinterManagerForm.value.IsActive = 1 :
            this.PrinterManagerForm.value.IsActive = 0;
          const obj = {
            Name: this.PrinterManagerForm.value.Name,
            Port: this.PrinterManagerForm.value.Port,
            Server: this.PrinterManagerForm.value.Server,
            IsActive: this.PrinterManagerForm.value.IsActive,
            AppUserName: this.PrinterManagerForm.value.AppUserName
          }
          this.saveInprogress = true;

              if (this.parameterData.length) {
          this.selectedRowIndex = null;
            for (const [i, pData] of this.parameterData.entries()) {
            if (
                pData.name === '' ||
                pData.description === '' ||
                pData.ipAddress === '' ||
                pData.port === null ||
                pData.language === '' ||
                pData.DPI === null
            ) {
              this.selectedRowIndex = i;
                this.openSnackBar(
                    'Please enter all required fields in row ' + (i+1),
                    '',
                    'default-snackbar'
                );
                  this.saveInprogress = false;
                return 'validateError';
            }
  
    }
       }
       
          this.printerManagerService
            .updatePrintManager(obj, this.printManagerId)
            .subscribe(
              (resultData: any) => {
                 
                if (resultData.id) {
                  this.saveInprogress = false;
                  const printerObj = this.getPrintersForAdd(resultData.id);
                  if (this.parameterData.length) {
                    this.printerManagerService
                      .createPrinter(printerObj)
                      .subscribe(
                        (data: any) => {
                          // this.router.navigate(['printmanager']);
                        },
                        printerError => {
                          // if (printerError.status === 200) {
                          //   this.openSnackBar(printerError.error.text, '', 'success-snackbar');
                          // } else {
                          //   this.openSnackBar(printerError.error, '', 'error-snackbar');
                          // }
                        })
                    
                  }else{
                    this.openSnackBar('Print Manager has been saved', '', 'success-snackbar');
                     this.saveInprogress = false;
                    this.router.navigate(['printermanager']);
                  }
                } else {
                  this.saveInprogress = false;
                  this.openSnackBar(resultData.message, '', 'error-snackbar');

                }
              },
              error => {
               
                if (error.status === 200) {
                  // this.getPrintersForAdd();
                  this.openSnackBar(error.error.text, '', 'success-snackbar');
                  const printerObj = this.getPrintersForAdd(this.printManagerId);
                  if (this.parameterData.length) {
                    this.printerManagerService
                      .createPrinter(printerObj)
                      .subscribe(
                        (data: any) => {
                          // this.openSnackBar(printerError.error.text, '', 'success-snackbar');
                          this.isEdit = false;
                          this.router.navigate(['printermanager']);
                        },
                        printerError => {
                          if (printerError.status === 200) {
                            this.isEdit = false;
                            this.openSnackBar(printerError.error.text, '', 'success-snackbar');
                            this.router.navigate(['printermanager']);
                          } else {
                              this.openSnackBar(printerError.error, '', 'error-snackbar');
                          }
                        })
                  }else{
                    this.openSnackBar('Print Manager has been saved', '', 'success-snackbar');
                    this.router.navigate(['printermanager']);
                  }
                  this.saveInprogress = false;
                } else {
                  this.openSnackBar(error.error, '', 'error-snackbar');
                  this.saveInprogress = false;
                }
              }
            );
        
        } 
        else {
        this.PrinterManagerForm.value.AppUserName = 'admin@visioncorp.com';
        
        this.PrinterManagerForm.value.IsActive === true ? this.PrinterManagerForm.value.IsActive = 1 :
         this.PrinterManagerForm.value.IsActive = 0;
        // const data = this.getPrintersForAdd(this.PrinterManagerForm.value);
          // if (data === 'validateError') {
          //   return
          // }
          // if (!this.parameterData.length) {
          //   this.openSnackBar('Please enter purchase order line', '', 'default-snackbar');
          //   return
          // }
         const obj={
           Name: this.PrinterManagerForm.value.Name,
           Port: this.PrinterManagerForm.value.Port,
           Server: this.PrinterManagerForm.value.Server,
           IsActive: this.PrinterManagerForm.value.IsActive,
           AppUserName: this.PrinterManagerForm.value.AppUserName
          }
          this.saveInprogress = true;
       if (this.parameterData.length) {
          this.selectedRowIndex = null;
      for (const [i, pData] of this.parameterData.entries()) {
            for (const [i, pData] of this.parameterData.entries()) {
            if (
                pData.name === '' ||
                pData.description === '' ||
                pData.ipAddress === '' ||
                pData.port === null ||
                pData.language === '' ||
                pData.DPI === null
            ) {
              this.selectedRowIndex = i;
                this.openSnackBar(
                    'Please enter all required fields in row ' + (i+1),
                    '',
                    'default-snackbar'
                );
                  this.saveInprogress = false;
                return 'validateError';
            }
        }
  
    }
       }
          this.printerManagerService
            .createPrintManager(obj)
            .subscribe(
              (resultData: any) => {
                 
                if (resultData.id) {
                  this.saveInprogress = false;
                  const printerObj = this.getPrintersForAdd(resultData.id);
                   if (printerObj === 'validateError') {
                        return;
                    }
                  if (this.parameterData.length) {
                    this.printerManagerService
                    .createPrinter(printerObj)
                    .subscribe(
                      (data: any) => {
                        // this.openSnackBar(printerError.error.text, '', 'success-snackbar');
                        this.router.navigate(['printermanager']);
                      },
                      printerError => {
                        if (printerError.status === 200) {
                          this.openSnackBar(printerError.error.text, '', 'success-snackbar');
                          this.router.navigate(['printermanager']);
                        }else{

                          this.openSnackBar(printerError.error, '', 'error-snackbar');
                        }
                      })
                  }else{
                    this.openSnackBar('Print Manager has been saved', '', 'success-snackbar');
                    this.router.navigate(['printermanager']);
                  }
                 
                  // this.router.navigate(['printmanager']);
                } else {
                  this.saveInprogress = false;
                  this.openSnackBar(resultData.message, '', 'error-snackbar');

                }
              },
              error => {
                this.saveInprogress = false;
                if(error.status === 200){
                  // this.getPrintersForAdd();
                        this.router.navigate(['printermanager']);
                  this.openSnackBar(error.error.text, '', 'success-snackbar');
                }else{
                  this.openSnackBar(error.error, '', 'error-snackbar');
                }
              }
            );
        }
      } else {
        this.logValidationErrors();
         this.openSnackBar('Please check mandatory fields', '', 'error-snackbar');
         for (const [i, pData] of this.parameterData.entries()) {
          if (
              pData.name === '' ||
              pData.description === '' ||
              pData.ipAddress === '' ||
              pData.port === null ||
              pData.language === '' ||
              pData.DPI === null
          ) {
            this.selectedRowIndex = i;
             break;
          }
        }

      }
    }
  }
   logValidationErrors(group: FormGroup = this.PrinterManagerForm): void {
        Object.keys(group.controls).forEach((key: string) => {
            const abstractControl = group.get(key);
            if (abstractControl instanceof FormGroup) {
                this.logValidationErrors(abstractControl);
            } else {
                this.formErrors[key] = '';
                if (
                    (abstractControl &&
                        !abstractControl.valid &&
                        (abstractControl.touched || abstractControl.dirty)) ||
                    (abstractControl &&
                        !abstractControl.valid &&
                        abstractControl.untouched)
                ) {
                    const messages = this.validationMessages[key];
                    for (const errorKey in abstractControl.errors) {
                        if (errorKey) {
                            this.formErrors[key] += messages[errorKey] + ' ';
                        }
                    }
                }
            }
        });
    }
  getPrintersForAdd(printManagerId) {
    const printerArray = [];
    if (this.parameterData.length) {
          this.selectedRowIndex = null;
      for (const [i, pData] of this.parameterData.entries()) {
        let tempObject: any = {};


            for (const [i, pData] of this.parameterData.entries()) {
            if (
                pData.name === '' ||
                pData.description === '' ||
                pData.ipAddress === '' ||
                pData.port === null ||
                pData.language === '' ||
                pData.DPI === null
            ) {
              this.selectedRowIndex = i;
                this.openSnackBar(
                    'Please enter all required fields in row ' + (i+1),
                    '',
                    'default-snackbar'
                );
                return 'validateError';
            }
        }
      if (pData.editing || this.isEdit){
        tempObject.id = pData.id;
        tempObject.Name = pData.name;
        tempObject.Description = pData.description;
        tempObject.IPAddress = pData.ipAddress;
        tempObject.Port = pData.port !== null ? Number(pData.port) : null;
        tempObject.PrintManagerID = printManagerId;
        tempObject.Language = pData.language;
        tempObject.Dpi = pData.DPI !== null ? Number(pData.DPI) : null;
        tempObject.IsActive = pData.enabled === true ? 1 : 0;
        // pData.port = pData.port !== null ? Number(pData.port) : null;
        // pData.DPI = pData.DPI !== null ? Number(pData.DPI) : null;
        // pData.enabled = pData.enabled === true ? 1 : 0;
        delete pData.action;
        // delete pData.editing;
        delete pData.addNewRecord;
        delete pData.isDefault;
         
        // pData.poLineAmount = pData.poLineAmount !== null ? Number(pData.poLineAmount) : null;
        // pData.poPlannedReceiptDate = this.purchaseOrderService.dateFormat(pData.poPlannedReceiptDate);
        printerArray.push(tempObject);
      }
      }
      let dataObj = { printers: [], AppUserName: '' };
      dataObj = { printers: printerArray, AppUserName: 'admin@visioncorp.com' };
      // data.addPoLines = printerArray;
      return dataObj;
    } else {
      // data.addPoLines = printerArray;
      return printerArray;

    }
  }
  // Form Group
  printerManagerFeedForm() {
    this.PrinterManagerForm = this.fb.group({
      Name: ['', Validators.required],
      Server: ['', Validators.required],
      Port: [null, Validators.required],
      AppUserName: [''],
      IsActive: [false]
    });
  }

  // open dialog
  openDialog(dialogType: string, dialogMessage: any) {
    this.messageDialogRef = this.dialog.open(MessageDialogComponent, {
      data: {
        type: dialogType,
        message: dialogMessage
      }
    });
  }

  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
       duration: 3500,
      panelClass: [typeClass]
    });
  }

  ngAfterViewInit() {
    this.printerManagerDataSource.sort = this.sort;
    setTimeout(() => {
        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
        this.paginator.pageSizeOptions = this.commonService.paginationArray;
        this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 )
    }, 100);
}
@HostListener('window:resize', ['$event'])
      onResize(event) {
      this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
      this.commonService.getScreenSize(45);
  }

}
