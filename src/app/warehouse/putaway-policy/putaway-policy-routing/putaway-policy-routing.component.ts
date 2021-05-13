import {
    Component, OnInit, ViewChild,AfterViewInit, EventEmitter,TemplateRef,
    Output, Renderer, OnDestroy, HostListener
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { CommonService } from 'src/app/_services/common/common.service';
import { Router } from '@angular/router';
import { PutawayPolicyService } from 'src/app/_services/warehouse/putaway-policy.service';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { MatSort , Sort } from '@angular/material';

export interface ParameterDataElement {
    routingId: string;
    priority: number;
    routingLogicCode: string;
    operator: string;
    routingValue: any;
    routingType: string;
    policyId: string;
    createdBy: number;
    creationDate: string;
    updatedBy: number;
    updatedDate: string;
    action: string;
    editing: boolean;
    addNewRecord?: boolean;
    operatorLov?: any;
    dataType?: any;
    showHint?: boolean;
    isRoutingValue?: any;
    originalData?: any;
    routingQuery: string;
}

@Component({
    selector: 'app-putaway-policy-routing',
    templateUrl: './putaway-policy-routing.component.html',
    styleUrls: ['./putaway-policy-routing.component.css']
})
export class PutawayPolicyRoutingComponent implements OnInit, OnDestroy, AfterViewInit {
    isEditable = false;
    isEdit = false;
    isAdd = false;
    listProgress = false;
    saveInprogress = false;
    // isRoutingValue = '';
    currentDeletedPolicy : any = {};
    parameterData: ParameterDataElement[] = [];
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
    parameterDisplayedColumns: string[] = [
        // 'routingId',
        'priority',
        'routingLogicCode',
        'operator',
        'routingValue',
        'routingQuery',
        'policyId',
        'action',
    ];
    routingTableMessage = '';
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    tooltipPosition: TooltipPosition[] = ['below'];
    iuId = '';
    iuLov = [{ label: ' Please Select', value: '',name: '' }];
    logicLov: any = [{ label: ' Please Select', value: '' }];
    logicLovOrig: any=[];
    operatorLov: any = [{ label: ' Please Select', value: '' }];
    operatorLovOrig: any = [];
    routingValueLov: any = [{ label: ' Please Select', value: '' }];
    routingGoToLov: any = [{ label: ' Please Select', value: '' }];
    selectedRoutingLogicValue = [];
    isNumeric = false;
    screenMaxHeight:any;
    policyTypeLov = [];
    policyType = 'PUTAWAY';
    inputSQLQuery = '';
    selectedRowIndex = null;
    timer: any = '';
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    constructor(
        private render: Renderer,
        private snackBar: MatSnackBar,
        public commonService: CommonService,
        public router: Router,
        public putawayPolicyService: PutawayPolicyService,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.iuId = (JSON.parse(localStorage.getItem('defaultIU'))).id;
        // this.defaultIUSelectionChange(this.iuId)
        //   this.putawayPolicyService.defaultIuDataObservable.subscribe((data: any) => {
        //     console.log(data);
        //     this.defaultIUSelectionChange(data);
        // });
              // timer used for set iu value on change header value
    this.timer = Observable.interval(500)
    .subscribe((val) => { 
      if( (JSON.parse(localStorage.getItem('defaultIU'))).id !== this.iuId){
        this.defaultIUSelectionChange((JSON.parse(localStorage.getItem('defaultIU'))).id);
      }

    });
        this.getIuLovEnabled();
        this.getRoutingLogicLov();
        this.getRoutingOperatorLov();
        // this.getRoutingPolicyLov();
        this.getScreenSize();
        this.getPolicyType();
        setTimeout(() => {
            this.paginator.pageSizeOptions = this.commonService.paginationArray;
            this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
        }, 100);
    }
    openDialog(templateRef: TemplateRef<any>, element: any, event: any, rowIndex: any) {
      this.currentDeletedPolicy['element']  = element;
      this.currentDeletedPolicy['rowIndex'] = rowIndex;
      this.dialog.open(templateRef);
    }

    beginEdit(rowData: any, $event: any) {
        for (const pData of this.parameterData) {
            if (pData.editing === true && pData.addNewRecord === true) {
                this.openSnackBar('Please add your records first.', '', 'error-snackbar');
                return;
            }
        }
        if (rowData.editing === false) {
            rowData.editing = true;
            this.isAdd = false;
            this.isEdit = true;
            //this.render.setElementClass($event.target, 'editIconEnable', true);
        } else {
            // rowData.editing = false;
            // this.isAdd = true;
            // this.isEdit = false;
            // this.render.setElementClass($event.target, 'editIconEnable', false);
        }
    }


    deletePolicyRouting(){
      const rowIndex = this.currentDeletedPolicy.rowIndex;

      const id : any = this.parameterData[rowIndex].routingId;
      this.putawayPolicyService.deletePolicyRounting(id).subscribe((data: any) => {

          if ( data && data.status === 200) {
              this.parameterData.splice(rowIndex, 1);
              this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
                  this.parameterData
              );
              this.parameterDataSource.paginator = this.paginator;
              this.parameterDataSource.sort = this.sort;
              this.dialog.closeAll();
              this.openSnackBar(data.message, '','success-snackbar');
          }else{
            this.openSnackBar(data.message, '','error-snackbar');
          }

        },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            })

  } 
    deleteRow(rowData: any, rowIndex: number) {
        this.selectedRowIndex = null;
        this.parameterData.splice(rowIndex, 1);
        this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
            this.parameterData
        );
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

    onSubmit(type: string) {
        const dataArray: any[] = [];
        this.saveInprogress = true;
        for (const [index, pData] of this.parameterData.entries()) {
            if (pData.routingValue._i !== undefined) {
                const updatedValue = (pData.routingValue._i.year + '-' + (pData.routingValue._i.month + 1) + '-' + pData.routingValue._i.date);
                pData.routingValue = this.putawayPolicyService.dateFormat(updatedValue);
            }
            if (type === 'save') {

                if (pData.addNewRecord === true) {
                     this.selectedRowIndex = null;
                    if (
                        pData.priority &&
                        pData.routingLogicCode &&
                        pData.operator &&
                        pData.routingValue &&
                        pData.policyId
                    ) {
                        if (pData.routingValue._i === undefined) {
                            const isLike = pData.routingValue.includes('%');
                            const isFirstValue = pData.routingValue.charAt(0);
                            const isLastValue = pData.routingValue.slice(-1);
                            if (pData.operator === 'LIKE' && isLike !== true ||
                                ((pData.operator === 'IN' || pData.operator === 'NOT IN') && isFirstValue !== '(' && isLastValue !== ')')) {
                                this.openSnackBar('Please fill valid routing value on row ' + (index + 1) + '.', '', 'error-snackbar');
                                this.saveInprogress = false;
                                return;
                            }
                        }

                        dataArray.push(pData);
                        this.parameterData[index].addNewRecord = false;
                        this.parameterData[index].editing = false;
                        this.parameterData[index]['originalData'] = Object.assign({},pData);
                    } else {
                        this.selectedRowIndex = index;
                        this.saveInprogress = false;
                        this.openSnackBar('Please fill required fields in row ' + (index + 1),'','error-snackbar');
                        return;
                    }
                }
            } else {
                if (pData.editing === true) {
                    if (
                        pData.priority &&
                        pData.routingLogicCode &&
                        pData.operator &&
                        pData.routingValue &&
                        pData.policyId
                    ) {
                        if (pData.routingValue._i === undefined) {
                            const isLike = pData.routingValue.includes('%');
                            const isFirstValue = pData.routingValue.charAt(0);
                            const isLastValue = pData.routingValue.slice(-1);

                            const condition1 = pData.operator === 'LIKE' && isLike !== true;
                            const condition2 = pData.operator === 'IN' || pData.operator === 'NOT IN';
                            const condition3 = isFirstValue !== '(' || isLastValue !== ')'
                            if (condition1 || (condition2 && condition3)) {
                                this.openSnackBar('Please fill valid routing value on row ' + (index + 1) + '.', '', 'error-snackbar');
                                this.saveInprogress = false;
                                return;
                            }
                        }


                        dataArray.push(pData);
                        this.parameterData[index].editing = false;
                        this.parameterData[index].originalData = {};
                        delete pData.originalData;
                        this.parameterData[index]['originalData'] = Object.assign({},pData);
                    } else {
                         this.selectedRowIndex = index;
                         this.saveInprogress = false;
                        this.openSnackBar('Please fill required fields in row ' + (index + 1),'','error-snackbar');
                        return;
                    }
                }
            }
        }
        if (type === 'save') {
            this.addRouting(dataArray);
        } else {
            this.updateRouting(dataArray);
        }
    }

    // add routing policy
    addRouting(data) {
        const body = [];
        data.forEach(dataElement => {
            const obj = {
                iuId: Number(this.iuId),
                priority: dataElement.priority !== null ? Number(dataElement.priority) : null,
                routingLogicCode: dataElement.routingLogicCode,
                operator: dataElement.operator,
                routingValue: dataElement.routingValue,
                routingType: dataElement.routingType,
                policyId: dataElement.policyId !== null ? Number(dataElement.policyId) : null,
                routingQuery: dataElement.routingQuery !== '' ? dataElement.routingQuery : null,
                createdBy: Number(dataElement.createdBy),
                updatedBy: Number(dataElement.updatedBy)
            }
            body.push(obj);
        });

        this.putawayPolicyService.batchInsert(body).subscribe(
            result => {
                if (result.status === 200) {
                    this.isAdd = false;
                    this.openSnackBar(result.message, '', 'success-snackbar');
                    this.searchRouting(this.iuId);
                } else {
                    this.isAdd = true;
                    this.openSnackBar(result.message, '', 'error-snackbar');
                }
                this.saveInprogress = false;
            },
            (error: any) => {
              this.isAdd = true;
              // Apply Changes To edit all unsaved records : 05-02-2020 (By Manoj Kumar)
              for(const putawayPolicy of data) {
                putawayPolicy.editing = true;
                putawayPolicy.addNewRecord = true;
              } 
              this.openSnackBar(error.error.message, '', 'error-snackbar');
              this.saveInprogress = false;
            }
        );
    }

    // update routing policy
    updateRouting(data) {
        const body = [];
        data.forEach(dataElement => {
            const obj = {
                iuId: Number(this.iuId),
                routingId: Number(dataElement.routingId),
                priority: dataElement.priority !== null ? Number(dataElement.priority) : null,
                routingLogicCode: dataElement.routingLogicCode,
                operator: dataElement.operator,
                routingValue: dataElement.routingValue,
                routingType: dataElement.routingType,
                policyId: dataElement.policyId !== null ? Number(dataElement.policyId) : null,
                routingQuery: dataElement.routingQuery !== '' ? dataElement.routingQuery : null,
                createdBy: Number(dataElement.createdBy),
                updatedBy: Number(dataElement.updatedBy)
            }
            body.push(obj);
        });

        this.putawayPolicyService.batchUpdate(body).subscribe(
            result => {
                if (result.status === 200) {
                    this.isEdit = false;
                    this.openSnackBar(result.message, '', 'success-snackbar');
                    this.searchRouting(this.iuId);
                } else {
                    this.isEdit = true;
                    this.openSnackBar(result.message, '', 'error-snackbar');
                }
                this.saveInprogress = false;
            },
            (error: any) => {
              this.isEdit = true;

              for(const PP of data) {
                if(this.parameterData.find(d => d.policyId = PP.policyId)) {
                  const index = this.parameterData.indexOf(PP);
                  this.parameterData[index].editing = true;
                  this.parameterData[index].addNewRecord = false;
                }
              } 
              this.openSnackBar(error.error.message, '', 'error-snackbar');
              this.saveInprogress = false;
            }
        );
    }

    addRow() {
        this.selectedRowIndex = null;
        if (!this.iuId) {
            this.openSnackBar(' Please Select inventory unit first.', '', 'error-snackbar');
            return;
        }
        for (const pData of this.parameterData) {
            if (pData.editing === true && pData.addNewRecord === undefined) {
                this.openSnackBar('Please update your records first.', '', 'error-snackbar');
                return;
            }
        }
        this.isAdd = true;
        this.isEdit = false;
        this.parameterData.unshift({
            routingId: null,
            priority: null,
            routingLogicCode: '',
            operator: '',
            routingValue: '',
            routingType: this.policyType,
            policyId: '',
            createdBy: JSON.parse(localStorage.getItem('userDetails')).userId,
            creationDate: this.putawayPolicyService.dateFormat(new Date()),
            updatedBy: JSON.parse(localStorage.getItem('userDetails')).userId,
            updatedDate: this.putawayPolicyService.dateFormat(new Date()),
            action: '',
            editing: true,
            addNewRecord: true,
            routingQuery:''
        });

        this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
            this.parameterData
        );
        this.parameterDataSource.paginator = this.paginator;
    }

    // get policy list based IU
    // iuChanged(event: any, value: any) {
    //     if (event.source.selected && event.isUserInput === true) {
    //         this.isAdd = false;
    //         this.isEdit = false;
    //         this.searchRouting(value);
    //     }
    // }
    defaultIUSelectionChange(iuId){
            this.isAdd = false;
            this.isEdit = false;
            this.iuId = iuId;
            setTimeout(() =>{
                this.searchRouting(iuId);
            },100) 
    }
    // Get Policy Type
    getPolicyType() {
        this.policyTypeLov = [];
        this.commonService.getLookupLOV('POLICY_TYPE')
        .subscribe((data: any) => {
          for (const rowData of data.result) {
            this.policyTypeLov.push({
              value: rowData.lookupValue,
              label: rowData.lookupValueDesc
            });
          }
        });
    }
    policyTypeChanged(event: any, value: any) {
        if (event.source.selected && event.isUserInput === true && value) {
            // this.iuId = '';
            this.parameterData = [];
            this.parameterDataSource = new MatTableDataSource([]);
            this.parameterDataSource.paginator = this.paginator;
            this.setRoutingLogicLov(value);
            this.defaultIUSelectionChange((JSON.parse(localStorage.getItem('defaultIU'))).id);
        }

    }
    // search for policy routing list
    searchRouting(value) {
        this.parameterData = [];
        this.parameterDataSource = new MatTableDataSource([]);
        this.parameterDataSource.paginator = this.paginator;
        if (value !== '') {
            const body = { iuId: value, routingType: this.policyType }
            this.listProgress = true;
            this.putawayPolicyService.getPolicyRoutingList(body).subscribe(
                (data: any) => {
                    if (data.result) {
                        this.parameterData = [];
                        this.listProgress = false;
                        for (const rowData of data.result) {
                            rowData.editing = false;

                            rowData['originalData'] = Object.assign({}, rowData)
                            this.parameterData.push(rowData);
                        }
                        this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
                        this.parameterDataSource.paginator = this.paginator;
                         // Sorting Start
                                       const sortState: Sort = {active: '', direction: ''};
                                       this.sort.active = sortState.active;
                                       this.sort.direction = sortState.direction;
                                       this.sort.sortChange.emit(sortState);
                        // Sorting End
                        this.parameterDataSource.sort = this.sort;                        
                        this.parameterDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
                    } else {
                        this.routingTableMessage = data.message;
                        this.listProgress = false;
                    }
                },
                (error: any) => {
                    this.listProgress = false;
                    this.openSnackBar(error.error.message, '', 'error-snackbar');
                })
            if (this.policyType === 'PUTAWAY'){
                this.getRoutingPolicyLov('policy-routing','policy-name',value);
            }else{
                this.getRoutingPolicyLov('picking', 'policy-name', value);
            }
        }
    }

    disableEdit(rowData: any, index: any) {

        if (rowData.editing === true) {

            this.parameterData[index].priority         = this.parameterData[index].originalData.priority;
            this.parameterData[index].routingLogicCode = this.parameterData[index].originalData.routingLogicCode;
            this.parameterData[index].operator         = this.parameterData[index].originalData.operator;
            this.parameterData[index].routingValue     = this.parameterData[index].originalData.routingValue;
            this.parameterData[index].policyId         = this.parameterData[index].originalData.policyId;
            this.parameterData[index].editing          = false;
        };
        if (
            this.parameterData.find(({ editing }) => editing === true) ===
            undefined
        ) {
            this.isEdit = false;
        }
    }

    // routing logic change function
    routingLogicChanged(event: any, dataType: string, logicCode: string, source: string, sourceValue: string, index: any) {
        if (event.source.selected && event.isUserInput === true) {
            this.getSelectedOperator(dataType, index);
            // this.parameterData[index].operator='';
            this.parameterData[index].isRoutingValue = '';
            this.selectedRoutingLogicValue = [];
            this.selectedRoutingLogicValue.push({ dataType: dataType, logicCode: logicCode, source: source, sourceValue: sourceValue });
        }
    }

    // routing operator change function
    routingOperatorChanged(event: any, value: string, index) {
        // event is equal to 'manual' when we trigger this from routinglogic selection change
        if (event.source.selected && event.isUserInput === true) {
            const dataType = this.selectedRoutingLogicValue[0].dataType;
            const logicCode = this.selectedRoutingLogicValue[0].logicCode;
            const sourceName = this.selectedRoutingLogicValue[0].source;
            const sourceValue = this.selectedRoutingLogicValue[0].sourceValue;
            if (value === 'LIKE' || value === 'IN' || value === 'NOT IN') {
                if (dataType === 'DATE') {
                    this.parameterData[index].isRoutingValue = dataType;
                } else if (dataType === 'N') {
                    this.parameterData[index].isRoutingValue = 'NONE';
                    this.isNumeric = true;
                    this.parameterData[index].showHint = true;
                } else {
                    this.parameterData[index].isRoutingValue = 'NONE';
                    this.isNumeric = false;
                    this.parameterData[index].showHint = false;
                }
            } else {
                if (sourceName === 'TABLE' || sourceName === 'LOOKUP') {
                    this.parameterData[index].isRoutingValue = sourceName;
                    // this.getSelectedRoutingValue(logicCode, sourceName, sourceValue, index);
                } else {
                    if (dataType === 'DATE') {
                        this.parameterData[index].isRoutingValue = dataType;
                    } else if (dataType === 'N') {
                        this.parameterData[index].isRoutingValue = sourceName;
                        this.isNumeric = true;
                        this.parameterData[index].showHint = true;
                    } else {
                        this.parameterData[index].isRoutingValue = sourceName;
                        this.isNumeric = false;
                        this.parameterData[index].showHint = false;
                    }
                }
            }
        }
    }

    // get enabled IU
    getIuLovEnabled() {
        this.iuLov = [{ label: ' Please Select', value: '' ,name: ''}];
        this.putawayPolicyService.getIuLovAll().subscribe(
            (data: any) => {
                if (data.result) {
                    for (const rowData of data.result) {
                        if (rowData.enabledFlag === 'Y') {
                            this.iuLov.push({
                                label: rowData.code,
                                value: rowData.id,
                                name: rowData.name
                            });
                        }
                    }
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    setRoutingLogicLov(type){
        this.logicLov = [{ label: ' Please Select', value: '' }];
        for(const rowData of this.logicLovOrig){
            if(rowData.routingType === type){
                this.logicLov.push({
                    label: rowData.label,
                    value: rowData.value,
                    dataType: rowData.dataType,
                    source: rowData.source,
                    sourceValue: rowData.sourceValue
                });
            }
        } 
    }

    // get routing logic lov
    getRoutingLogicLov() {
        this.logicLovOrig = [{ label: ' Please Select', value: '' }];
        this.putawayPolicyService.getRoutingLogic().subscribe(
            (data: any) => {
                if (data.result) {
                    for (const rowData of data.result) {
                        this.logicLovOrig.push({
                            label: rowData.logicMeaning,
                            value: rowData.logicCode,
                            dataType: rowData.dataType,
                            source: rowData.source,
                            sourceValue: rowData.sourceValue,
                            routingType: rowData.routingType
                        });
                    }
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    // get routing operator lov
    getRoutingOperatorLov() {
        this.operatorLovOrig = [];
        this.putawayPolicyService.getRoutingOperator().subscribe(
            (data: any) => {
                if (data.result) {
                    for (const rowData of data.result) {
                        this.operatorLovOrig.push({
                            label: rowData.lookupValue,
                            value: rowData.lookupValue
                        });
                    }
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    // get routing operator based on routing logic
    getSelectedOperator(dataType, index) {
        this.parameterData[index].operatorLov = [{ label: ' Please Select', value: '' }];
        for (const lovData of this.operatorLovOrig) {
            if (dataType === 'AN') {
                if (lovData.label === 'NOT IN' || lovData.label === 'LIKE' || lovData.label === '=' || lovData.label === 'IN') {
                    this.parameterData[index].operatorLov.push(lovData);
                }
            }
            if (dataType === 'N') {
                if (lovData.label === 'NOT IN' || lovData.label === '<' || lovData.label === '>'
                    || lovData.label === 'IN' || lovData.label === '<=' || lovData.label === '>=' || lovData.label === '<>') {
                    this.parameterData[index].operatorLov.push(lovData);
                }
            }
            if (dataType === 'DATE') {
                if (lovData.label === '<' || lovData.label === '>' || lovData.label === '<='
                    || lovData.label === '>=' || lovData.label === '<>' || lovData.label === '=') {
                    this.parameterData[index].operatorLov.push(lovData);
                }
            }
        }
    }

    // get selected routing value based on source
    getSelectedRoutingValue(logicCode, source, sourceValue, index) {
        this.routingValueLov = [{ label: ' Please Select', value: '' }];
        if (source === 'TABLE') {
            this.getRoutingValueBasedOnTable(sourceValue, logicCode, index);
        }
        if (source === 'LOOKUP') {
            this.getRoutingValueBasedOnLookup(sourceValue, index);
        }
    }

    dialogForSQL(rowIndex: number, rowData, templateRef?: TemplateRef<any>) {
      if (rowData.routingQuery === '') {
          this.inputSQLQuery = '';
      } else {
          this.inputSQLQuery = rowData.routingQuery;
      }
      const dialogRef = this.dialog.open(templateRef, {
          width: '40%',
          disableClose: true,
          data: [
              {
                  row: rowData,
                  index: rowIndex
              }
          ]
      });
      dialogRef.afterClosed().subscribe(response => {
          if (response) {
              this.updateSQLInRow(response);
          }
      });
  }

  updateSQLInRow(response) {
      if (this.inputSQLQuery) {
          response[0].row.routingQuery = this.inputSQLQuery;
          this.inputSQLQuery = '';
      } else {
          return;
      }
  }

    // get routing policy lov
    getRoutingPolicyLov(basedOn, Show, iuId) {
        this.routingGoToLov = [{ label: ' Please Select', value: '' }];
        this.putawayPolicyService.getRoutingPolicy(basedOn, Show, iuId).subscribe(
            (data: any) => {
                if (data.result) {
                    for (const rowData of data.result) {
                        this.routingGoToLov.push({
                            label: rowData.policyName,
                            value: rowData.policyId
                        });
                    }
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    // get routing value based on Table
    getRoutingValueBasedOnTable(sourceValue, logicCode, index) {
        this.routingValueLov = [{ label: ' Please Select', value: '' }];
        this.putawayPolicyService.getRoutingValueTable(sourceValue, logicCode, this.iuId).subscribe(
            (data: any) => {
                if (data.result) {
                    for (const rowData of data.result) {
                        this.routingValueLov.push({
                            label: rowData.routingValue,
                            value: rowData.routingValue
                        });
                    }
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    // get routing value based on Lookup
    getRoutingValueBasedOnLookup(sourceValue, index) {
        this.routingValueLov = [{ label: ' Please Select', value: '' }];
        this.putawayPolicyService.getRoutingValueLookup(sourceValue).subscribe(
            (data: any) => {
                if (data.result) {
                    for (const rowData of data.result) {
                        this.routingValueLov.push({
                            label: rowData.policyName,
                            value: rowData.policyId
                        });
                    }
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
    ngOnDestroy() {
        this.timer ? this.timer.unsubscribe() : '';
        this.selectedRoutingLogicValue = [];
        window.localStorage.removeItem('taskDtailPage');
    }
   ngAfterViewInit() {        
        // this.parameterDataSource.connect().subscribe(d => {
        //     this.parameterDataSource.sortData(this.parameterDataSource.filteredData, this.parameterDataSource.sort);
        // });
        setTimeout(() => {
            this.parameterDataSource.sort = this.sort;            
             this.parameterDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
            // this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
            this.paginator.pageSizeOptions = this.commonService.paginationArray;
            this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
        }, 100);
    }
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.getScreenSize();
    }
    getScreenSize(event?) {
        const screenHeight = window.innerHeight;
          this.screenMaxHeight = (screenHeight - 298) + 'px'; 
    }
    sortChanged($event){
        // Added for pagination inilitization
        this.paginator.pageIndex = 0;             
        this.parameterData = this.parameterDataSource.sortData(this.parameterDataSource.filteredData, this.parameterDataSource.sort);      
    }
}
