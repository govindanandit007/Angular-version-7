import {
    Component,
    OnInit,
    ViewChild,
    EventEmitter,
    Output,
    Renderer,
    OnDestroy,
    TemplateRef,
    HostListener,
    ElementRef,
    AfterViewInit,
    ViewChildren

} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { CommonService } from 'src/app/_services/common/common.service';
import { Router } from '@angular/router';
import { PutawayPolicyService } from 'src/app/_services/warehouse/putaway-policy.service';
import { ConfirmationDialogComponent } from 'src/app/_shared/confirmation-dialog/confirmation-dialog.component';
import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem,
    CdkDragHandle
} from '@angular/cdk/drag-drop';
import {
    animate,
    state,
    style,
    transition,
    trigger
} from '@angular/animations';
import { MatDialog ,MatDialogRef} from '@angular/material';
import { Observable } from 'rxjs';

export interface ParameterDataElement {
    sequenceId: string;
    prioritySequenceId?: number;
    priorityName: string;
    priorityId: string;
    condition: string;
    entity: string;
    entityValue: string;
    entityValueType: string;
    operator: string;
    policyId: number;
    ruleType: string;
    description: string;
    iuId: number;
    locatorDimensionCheck: string;
    locatorUnitCheck: string;
    locatorVolumeCheck: string;
    locatorWeightCheck: string;
    partialPutaway: string;
    allocateLpnOnly:string;
    allocateLpnAndLoose:string;
    allocateLooseOnly:string;
    policyName: string;
    editing: boolean;
    action: string;
    rules: any[];
    sort?: any[];
    addNewRecord?: boolean;
    updatedBy: string;
    createdBy: string;
    leftBracket: string;
    rightBracket: string;
}

export interface NestedParameterDataElement {
    rowSelect: boolean;
    sequenceId: string;
    ruleSequenceId: string;
    priorityName: string;
    priorityId: number;
    condition: string;
    entity: string;
    entityValue: string;
    entityValueType: string;
    operator: string;
    policyId: number;
    ruleType: string;
    action: string;
    addNewRecord?: boolean;
    isRoutingValue?: any;
    operatorLov?: any;
    showHint?: boolean;
    editing: boolean;
    fieldsDisable?: boolean;
    entityValueField?: string;
    valueTypeLOV?: boolean;
    valueTypeLOVChange?: boolean;
    leftBracket: string;
    rightBracket: string;
    originalData?: any;
}

export interface SortParameterDataElement {
    sequenceId: number;
    policyId: number;
    priorityId: number;
    type: string;
    algorithmId: number;
    policyType? : string;
    orderBy: string;
    action: string;
    addNewRecord?: boolean;
    editing?: boolean;
}



@Component({
    selector: 'app-putaway-business-rules',
    templateUrl: './putaway-business-rules.component.html',
    styleUrls: ['./putaway-business-rules.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition(
                'expanded <=> collapsed',
                animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
            )
        ])
    ]
})
export class PutawayBusinessRulesComponent implements OnInit, AfterViewInit,OnDestroy {
    isEditable = false;
    isEdit = false;
    isAdd = false;
    isSortingAdd = false;
    isSortingEdit = false;
    isCancel = false;
    listProgress = false;
    isRoutingValue = '';
    parameterData: ParameterDataElement[] = [];
    policyType = 'PUTAWAY';
    saveInprogress = false;

    parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
    parameterDisplayedColumns: string[] = [
        'prioritySequenceId',
        'priorityName',
        'leftBracket',
        'description',
        'entity',
        'condition',
        'entityValueType',
        'entityValue',
        'operator',
        'rightBracket',
        'action'
    ];
    nestedParameterDataElement: NestedParameterDataElement[] = [];
    nestedParameterDataSource = new MatTableDataSource<
        NestedParameterDataElement
    >(this.nestedParameterDataElement);

    nestedParameterDisplayedColumns: string[] = [
        'rowSelect',
        'ruleSequenceId',
        'leftBracket',
        'ruleType',
        'entity',
        'condition',
        'entityValueType',
        'entityValue',
        'operator',
        'rightBracket',
        'action'
    ];

    sortParameterData: SortParameterDataElement[] = [];
    sortParameterDataSource = new MatTableDataSource<SortParameterDataElement>(
        this.sortParameterData
    );
    sortParameterDisplayedColumns: string[] = [
        'sequenceId',
        'algorithmId',
        'orderBy',
        'action'
    ];
    routingTableMessage = '';
    columns: any =  [
        {field: 'prioritySequenceId', name: '', width: 75, baseWidth: 3 },
        {field: 'priorityName', name: 'Sequence', width: 150, baseWidth: 10 },
        {field: 'leftBracket', name: '', width: 150, baseWidth: 3 },
        {field: 'description', name: 'Operation Type', width: 100, baseWidth: 14 },
        {field: 'entity', name: 'Entity', width: 100, baseWidth: 13 },
        {field: 'condition', name: 'Operator', width: 75, baseWidth: 8 },
        {field: 'entityValueType', name: 'Value Type', width: 75, baseWidth: 10 },
        {field: 'entityValue', name: 'Entity/Value', width: 100, baseWidth: 14 },
        {field: 'operator', name: 'And/OR', width: 80, baseWidth: 9 },
        {field: 'rightBracket', name: '', width: 80, baseWidth: 3 },
        {field: 'action', name: 'Action', width: 80, baseWidth: 13 },
    ]
    nestedColumns: any =  [
        {field: 'rowSelect', name: '', width: 75, baseWidth: 3 },
        {field: 'ruleSequenceId', name: 'Sequence', width: 150, baseWidth: 10 },
        {field: 'leftBracket', name: '', width: 150, baseWidth: 3 },
        {field: 'ruleType', name: 'Operation Type', width: 100, baseWidth: 14 },
        {field: 'entity', name: 'Entity', width: 100, baseWidth: 13 },
        {field: 'condition', name: 'Operator', width: 75, baseWidth: 8 },
        {field: 'entityValueType', name: 'Value Type', width: 75, baseWidth: 10 },
        {field: 'entityValue', name: 'Entity/Value', width: 100, baseWidth: 14 },
        {field: 'operator', name: 'And/OR', width: 80, baseWidth: 9 },
        {field: 'rightBracket', name: '', width: 80, baseWidth: 3 },
        {field: 'action', name: 'Action', width: 80, baseWidth: 13 },
    ]
    @ViewChild(MatTable, {read: ElementRef, static: false} ) matTableRef: ElementRef;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChildren('myDialog', {read: TemplateRef}) myDialogRef:TemplateRef<any>;
    tooltipPosition: TooltipPosition[] = ['below'];

    iuLov = [{ label: ' Please Select', value: '',name: '' }];
    routingGoToLov: any = [{ label: ' Please Select', value: '' }];
    expandedElement: ParameterDataElement | null;
    policyDetailDes = '';
    locWeightCheck: boolean;
    locVolumeCheck: boolean;
    locUnitCheck: boolean;
    locDimensionCheck: boolean;
    partialPutaway: boolean;
    allocateLpnOnly: boolean;
    allocateLpnAndLoose: boolean;
    allocateLooseOnly: boolean;
    sortDialogTitle = '';
    allPriority = [];
    copyPriority: NestedParameterDataElement[] = [];
    newRowIndex: number;
    iuId: number;
    policyName = '';
    policyNameSelectShow = true;
    readonlyEnable = true;
    ruleTypeList = [];
    valueTypeList = [];
    entityLov = [];
    policyTypeLov = [];
    selectedRoutingLogicValue = [];
    isNumeric = false;
    routingValueLov: any = [{ label: ' Please Select', value: '' }];
    operatorLovOrig: any = [];
    andOrList: any = [];
    sortingValueList: any = [];
    sortingOrderList: any = [
        { label: 'ASC', value: 'ASC' },
        { label: 'DESC', value: 'DESC' }
    ];
    policyId: number;
    priorityId: number;
    algorithmList: any = [];
    rowCount = 0;
    rowDisabled = false;
    inputSQLQuery = '';
    selectedItem: any;
    selectedRowIndex: number;
    selectedExtendRowIndex : number;
    confirmationDialogRef: MatDialogRef<ConfirmationDialogComponent>;
    timer: any = '';

    constructor(
        private render: Renderer,
        private snackBar: MatSnackBar,
        public commonService: CommonService,
        public router: Router,
        public putawayPolicyService: PutawayPolicyService,
        private dialog: MatDialog
    ) {}

    ngOnInit() {

        this.iuId = (JSON.parse(localStorage.getItem('defaultIU'))).id;
        this.defaultIUSelectionChange(this.iuId);
        //   this.putawayPolicyService.defaultIuDataObservable.subscribe((data: any) => {
        //       if(data != '' && this.iuId !== data){
        //     this.defaultIUSelectionChange(data);
        //       }
        // });
    // timer used for set iu value on change header value
        this.timer = Observable.interval(500)
        .subscribe((val) => { 
            if( (JSON.parse(localStorage.getItem('defaultIU'))).id !== this.iuId){
            this.defaultIUSelectionChange((JSON.parse(localStorage.getItem('defaultIU'))).id);
            }
        });
        this.getIuLovEnabled();
        this.getPolicyType();
        this.getRuleTypeLIst();
        // this.getRoutingLogicLov();
        this.getRoutingOperatorLov();
        this.getValueTypeLIst();
        // this.getAlgorithmList();
        this.getAndOrLIst();
        // this.getSortingValueList();
    }

    // get enabled IU
    getIuLovEnabled() {
        this.iuLov = [{ label: ' Please Select', value: '',name: '' }];
        this.putawayPolicyService.getIuLovAll().subscribe(
            (data: any) => {
                if (data.result) {
                    for (const rowData of data.result) {
                        if (rowData.enabledFlag === 'Y') {
                            this.iuLov.push({
                                label: rowData.code,
                                value: rowData.id,
                                name: rowData.name,
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

    // get enabled IU
    getAllPutawayPriority() {
        this.putawayPolicyService.getAllPutawayPolicyPriority().subscribe(
            (data: any) => {
                if (data.result) {
                    this.allPriority = [];
                    for (const rowData of data.result[0].rules) { 
                        rowData.action = '';
                        rowData.editing = false;
                        this.allPriority.push(rowData);
                    }
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    // get rule type list
    getRuleTypeLIst() {
        this.ruleTypeList = [
            { label: ' Please Select', value: '' },
            { label: 'Algorithm', value: 'ALGORITHM' },
            { label: 'Expression', value: 'EXPRESSION' },
            { label: 'SQL', value: 'SQL' }
        ];
    }

    //  Get Value Type
    getValueTypeLIst() {
        this.valueTypeList = [
            { label: ' Please Select', value: '' },
            { label: 'Value', value: 'VALUE' },
            { label: 'Entity', value: 'ENTITY' }
        ];
    }

    getAlgorithmList(policyType) {
        const pType = policyType.toLowerCase();
        this.algorithmList = [{ label: ' Please Select', value: '', description: ' Please Select' }];
        this.putawayPolicyService.getAllAlgorithmList(pType).subscribe(
            (data: any) => {
                if (data.result) {
                    for (const rowData of data.result) {
                        this.algorithmList.push({
                            label: rowData.algorithmName,
                            value: rowData.algorithmId,
                            description: 'Algorithm Description'
                        });
                    }
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    //  Get Value Type
    getAndOrLIst() {
        this.andOrList = [
            { label: ' Please Select', value: '' },
            { label: 'AND', value: 'AND' },
            { label: 'OR', value: 'OR' }
        ];
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

    // get sorting value lov
    getSortingValueList(sortType) {
      const sort = sortType === 'PUTAWAY' ? 'sort' : 'picking_sort';
        this.sortingValueList = [
            {
                label: ' Please Select',
                value: 0
            }
        ];
        this.putawayPolicyService.getSortingValueLov(sort).subscribe(
            (data: any) => {
                if (data.result) {
                    for (const rowData of data.result) {
                        this.sortingValueList.push({
                            label: rowData.algorithmName,
                            value: rowData.algorithmId
                        });
                    }
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    // get routing logic lov
    getRoutingLogicLov(value) {
        const pType = value === 'PUTAWAY' ? 'logic-list' : 'logic-list-picking'
        this.entityLov = [{ label: ' Please Select', value: '' }];
        this.putawayPolicyService.getAllPutawayPolicyLogicList(pType).subscribe(
            (data: any) => {
                if (data.result) {
                    for (const rowData of data.result) {
                        this.entityLov.push({
                            label: rowData.logicName,
                            value: rowData.logicColumn,
                            dataType: rowData.dataType
                            // source: rowData.source,
                            // sourceValue: rowData.sourceValue
                        });
                    }
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    // routing logic change function
    routingLogicChanged(
        event: any,
        dataType: string,
        logicCode: string,
        index: any
    ) {
        if (event.source.selected && event.isUserInput === true) {
            this.getSelectedOperator(dataType, index);
            // this.parameterData[index].operator='';
            this.nestedParameterDataElement[index].isRoutingValue = dataType;
            this.selectedRoutingLogicValue = [];
            this.selectedRoutingLogicValue.push({
                dataType,
                logicCode
                // source: source,
                // sourceValue: sourceValue
            });
        }
    }

    // get routing operator based on routing logic
    getSelectedOperator(dataType, index) {
        this.nestedParameterDataElement[index].operatorLov = [
            { label: ' Please Select', value: '' }
        ];
        for (const lovData of this.operatorLovOrig) {
            if (dataType === 'AN') {
                if (
                    lovData.label === 'NOT IN' ||
                    lovData.label === 'LIKE' ||
                    lovData.label === '=' ||
                    lovData.label === 'IN'
                ) {
                    this.nestedParameterDataElement[index].operatorLov.push(
                        lovData
                    );
                }
            } else if (dataType === 'N') {
                if (
                    lovData.label === 'NOT IN' ||
                    lovData.label === '<' ||
                    lovData.label === '>' ||
                    lovData.label === 'IN' ||
                    lovData.label === '<=' ||
                    lovData.label === '>=' ||
                    lovData.label === '<>'
                ) {
                    this.nestedParameterDataElement[index].operatorLov.push(lovData);
                }
            } else if (dataType === 'DATE') {
                if (
                    lovData.label === '<' ||
                    lovData.label === '>' ||
                    lovData.label === '<=' ||
                    lovData.label === '>=' ||
                    lovData.label === '<>' ||
                    lovData.label === '='
                ) {
                    this.nestedParameterDataElement[index].operatorLov.push(lovData);
                }
            } else{
              this.nestedParameterDataElement[index].operatorLov.push(lovData);
            }
            // this.nestedParameterDataElement[index].condition = this.nestedParameterDataElement[index].operatorLov[0].value;
        }
    }

    // routing operator change function
    routingOperatorChanged(event: any, value: string, index, rowData) {
        // event is equal to 'manual' when we trigger this from routinglogic selection change

        if (event.source.selected && event.isUserInput === true && value !=='') {
            const dataType = this.selectedRoutingLogicValue[0].dataType;
            // const logicCode = this.selectedRoutingLogicValue[0].logicCode;
            // const sourceName = this.selectedRoutingLogicValue[0].source;
            // const sourceValue = this.selectedRoutingLogicValue[0].sourceValue;
            if (value === '=' || value === '<>' || value === '' || value === '<' || value === '<=' || value === '>' || value === '>=') {
                rowData.valueTypeLOV = true;
                // Managing Value Type LOV for update
                // if(rowData.editing === false) {
                //   rowData.entityValueType = '';
                // }

            } else {
                rowData.valueTypeLOV = false;
                rowData.entityValueType = 'VALUE';
                this.valueTypeChange(event, index, rowData.entityValueType, rowData);
            }
            if (value === 'LIKE' || value === 'IN' || value === 'NOT IN') {
                if (dataType === 'DATE') {
                    this.nestedParameterDataElement[
                        index
                    ].isRoutingValue = dataType;
                } else if (dataType === 'N') {
                    this.nestedParameterDataElement[index].isRoutingValue =
                        'NONE';
                    this.isNumeric = true;
                    this.nestedParameterDataElement[index].showHint = false;
                } else {
                    this.nestedParameterDataElement[index].isRoutingValue =
                        'NONE';
                    this.isNumeric = false;
                    this.nestedParameterDataElement[index].showHint = true;
                }
            } else {
                if (dataType === 'DATE') {
                    this.nestedParameterDataElement[
                        index
                    ].isRoutingValue = dataType;
                } else if (dataType === 'N') {
                    this.nestedParameterDataElement[index].isRoutingValue =
                        'NONE';
                    this.isNumeric = true;
                    this.nestedParameterDataElement[index].showHint = false;
                } else {
                    this.nestedParameterDataElement[index].isRoutingValue =
                        'NONE';
                    this.isNumeric = false;
                    this.nestedParameterDataElement[index].showHint = true;
                }
            }
        }
    }

    // Rule Type change handler
    ruleTypeChange(event: any, index, value: string, rowData: any) {
        if (event.source.selected && event.isUserInput === true && value !== '') {
            if (value === 'EXPRESSION' || value === 'ALGORITHM') {
                rowData.fieldsDisable = true;
                // rowData.condition = '';
                // rowData.entity = '';
                // rowData.entityValue = '';
                // rowData.entityValueType = '';
            } else {
                rowData.fieldsDisable = false;
            }
            rowData.entityValueField = value;

        }
    }

    valueTypeChange(event: any, index, value: string, rowData: any) {

        if (event.source.selected && event.isUserInput === true && value !=='' ) {
            // if (rowData.addNewRecord === true) {
            //     rowData.entityValue = '';
            // }
            if (rowData.condition === '=' || rowData.condition === '<>' || rowData.condition === '' || rowData.condition === '<'
            || rowData.condition === '<=' || rowData.condition === '>' || rowData.condition === '>=') {
                if (value === 'VALUE') {
                    rowData.valueTypeLOVChange = false;
                } else {
                    rowData.valueTypeLOVChange = true;
                }
            } else {
                if (value === 'VALUE') {
                    rowData.valueTypeLOVChange = false;
                }
            }
        }
    }

    // get selected routing value based on source
    // getSelectedRoutingValue(logicCode, source, sourceValue, index) {
    //     this.routingValueLov = [{ label: ' Please Select', value: '' }];
    //     if (source === 'TABLE') {
    //         this.getRoutingValueBasedOnTable(sourceValue, logicCode, index);
    //     }
    //     if (source === 'LOOKUP') {
    //         this.getRoutingValueBasedOnLookup(sourceValue, index);
    //     }
    // }

    // get routing value based on Table
    // getRoutingValueBasedOnTable(sourceValue, logicCode, index) {
    //     this.routingValueLov = [{ label: ' Please Select', value: '' }];
    //     this.putawayPolicyService
    //         .getRoutingValueTable(sourceValue, logicCode, this.iuId)
    //         .subscribe(
    //             (data: any) => {
    //                 if (data.result) {
    //                     for (const rowData of data.result) {
    //                         this.routingValueLov.push({
    //                             label: rowData.routingValue,
    //                             value: rowData.routingValue
    //                         });
    //                     }
    //                 }
    //             },
    //             (error: any) => {
    //                 this.openSnackBar(error.error.message, '', 'error-snackbar');
    //             }
    //         );
    // }

    // get routing value based on Lookup
    // getRoutingValueBasedOnLookup(sourceValue, index) {
    //     this.routingValueLov = [{ label: ' Please Select', value: '' }];
    //     this.putawayPolicyService.getRoutingValueLookup(sourceValue).subscribe(
    //         (data: any) => {
    //             if (data.result) {
    //                 for (const rowData of data.result) {
    //                     this.routingValueLov.push({
    //                         label: rowData.policyName,
    //                         value: rowData.policyId
    //                     });
    //                 }
    //             }
    //         },
    //         (error: any) => {
    //             this.openSnackBar(error.error.message, '', 'error-snackbar');
    //         }
    //     );
    // }

    // iuChanged(event: any, value: any) {
    //     if (event.source.selected && event.isUserInput === true && value) {
    //         if (this.policyType === 'PUTAWAY'){
    //             this.getRoutingPolicyLov('policy-routing','policy-name',value);
    //         }else{
    //             this.getRoutingPolicyLov('picking', 'policy-name', value);
    //         }

    //         this.policyDetailDes = '';
    //         this.locWeightCheck = false;
    //         this.locVolumeCheck = false;
    //         this.locUnitCheck = false;
    //         this.locDimensionCheck = false;
    //         this.partialPutaway = false;
    //         this.allocateLpnOnly = false;
    //         this.allocateLpnAndLoose = false;
    //         this.allocateLooseOnly = false;
    //         this.parameterData = [];
    //         this.parameterDataSource = new MatTableDataSource([]);
    //         this.parameterDataSource.paginator = this.paginator;
    //     }
    // }

      defaultIUSelectionChange(iuId){
                if(this.iuId !== iuId){
                    this.iuId = iuId;
                    }
             if (this.policyType === 'PUTAWAY'){
                this.getRoutingPolicyLov('policy-routing','policy-name',iuId);
            }else{
                this.getRoutingPolicyLov('picking', 'policy-name', iuId);
            }
            this.policyDetailDes = '';
            this.locWeightCheck = false;
            this.locVolumeCheck = false;
            this.locUnitCheck = false;
            this.locDimensionCheck = false;
            this.partialPutaway = false;
            this.allocateLpnOnly = false;
            this.allocateLpnAndLoose = false;
            this.allocateLooseOnly = false;
            this.parameterData = [];
            this.parameterDataSource = new MatTableDataSource([]);
            this.parameterDataSource.paginator = this.paginator;
            this.isEdit = false;
    }

    policyTypeChanged(event: any, value: any) {

        if (event.source.selected && event.isUserInput === true && value) {
            // this.iuId = (JSON.parse(localStorage.getItem('defaultIU'))).id;
            //   if (this.policyType === 'PUTAWAY'){
            //     this.getRoutingPolicyLov('policy-routing','policy-name',(JSON.parse(localStorage.getItem('defaultIU'))).id);
            // }else{
            //     this.getRoutingPolicyLov('picking', 'policy-name', (JSON.parse(localStorage.getItem('defaultIU'))).id);
            // }
            this.policyType = value;
            this.defaultIUSelectionChange((JSON.parse(localStorage.getItem('defaultIU'))).id);
            this.policyId = null;
            this.policyName = '';
            this.policyDetailDes = '';
            this.routingGoToLov =[]
            this.parameterData = [];
            this.parameterDataSource = new MatTableDataSource([]);
            this.parameterDataSource.paginator = this.paginator;
            this.locWeightCheck = false;
            this.locVolumeCheck = false;
            this.locUnitCheck = false;
            this.locDimensionCheck = false;
            this.partialPutaway = false;
            this.allocateLpnOnly = false;
            this.allocateLpnAndLoose = false;
            this.allocateLooseOnly = false;
            this.getAlgorithmList(value);
            this.getSortingValueList(value);
            this.getRoutingLogicLov(value);
             
        }
    }

    dropTable(event: CdkDragDrop<ParameterDataElement[]>) {
        const prevIndex = this.parameterData.findIndex(
            d => d === event.item.data
        );
        moveItemInArray(this.parameterData, prevIndex, event.currentIndex);
        this.parameterData = [...this.parameterData];
        this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
            this.parameterData
        );

        if (this.policyId) {
            for (const [i, pData] of this.parameterData.entries()) {
                for (const [j, pchildData] of pData.rules.entries()) {
                    pchildData.editing = true;
                }
            }
            this.isEdit = true;
        } else {
            for (const [i, pData] of this.parameterData.entries()) {
                pData.addNewRecord = true;
            }
            this.isAdd = true;
        }

        this.expandedElement = this.parameterData[event.currentIndex];
        this.getNestedChildData(this.myDialogRef, this.expandedElement, event.currentIndex, 'addRule');
    }

    // Get All Sites By Passing Tranding Partner ID as Request Paramater
    getNestedChildData(
        templateRef: TemplateRef<any>,
        element,
        rowIndex: any,
        actionType
    ) {
        if (this.expandedElement != null) {
            if (actionType === 'copyRule') {
                this.nestedParameterDataElement = [];
                this.nestedParameterDataSource = new MatTableDataSource<
                    NestedParameterDataElement
                >(this.nestedParameterDataElement);
                this.sortParameterData = [];
                this.sortParameterDataSource = new MatTableDataSource(
                    this.sortParameterData
                );
            }
             
            for (const rowData of element.rules) {
                rowData.entityValue = (rowData.entityValue.includes(":")) ? this.commonService.dateFormat(new Date(rowData.entityValue.split('T')[0])) : rowData.entityValue;
            }
            this.nestedParameterDataElement = element.rules;
            this.nestedParameterDataSource = new MatTableDataSource<
                NestedParameterDataElement
            >(this.nestedParameterDataElement); 
        }
        setTimeout(() => {
            this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.nestedColumns);
        }, 500);
        this.selectedRowIndex = rowIndex;
    }

    openSortDialog(
        templateRef: TemplateRef<any>,
        element,
        rowIndex: any,
        actionType
    ) {
        this.getNestedChildData(templateRef, element, rowIndex, 'addRule');
        if (this.nestedParameterDataElement.length) {
            this.sortDialogTitle = element.priorityName;
            this.sortParameterData = [];
            this.priorityId = element.priorityId;
            for (const rowData of element.sort) {
                rowData.action = '';
                rowData.editing = false;
                this.sortParameterData.push(rowData);
            }

            this.sortParameterDataSource = new MatTableDataSource<
                SortParameterDataElement
            >(this.sortParameterData);



            if (!this.dialog.openDialogs || !this.dialog.openDialogs.length) {
                this.dialog.open(templateRef, {
                    hasBackdrop: false,
                    position: {
                        bottom: '20px'
                    },
                    width: '30%',
                    autoFocus: false,
                    data: rowIndex
                });
            }
        } else {
            this.openSnackBar(
                'Please add atleast one rule.',
                '',
                'error-snackbar'
            );
            return;
        }
    }

    // get routing policy lov
    getRoutingPolicyLov(basedOn,Show,iuId) {
        this.routingGoToLov = [{ label: ' Please Select', value: '' }];
        this.putawayPolicyService.getRoutingPolicy(basedOn,Show,iuId).subscribe(
            (data: any) => {
                if (data.result) {
                    data.result = data.result.sort((a, b) =>  a.policyName ? a.policyName.localeCompare(b.policyName)
                    :  a.policyName);
                    for (const rowData of data.result) {
                        this.routingGoToLov.push({
                            label: rowData.policyName,
                            value: Number(rowData.policyId)
                        });
                    }
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    // search for policy routing list
    searchPutawayPolicyRules(event: any, policyId: any) {
        if (
            (event &&
                event !== 'fromUpdate' &&
                event.source.selected &&
                event.isUserInput === true) ||
            event === 'fromUpdate'
        ) {
            this.parameterData = [];
            this.parameterDataSource = new MatTableDataSource([]);
            this.listProgress = true;
            const policyTypeData = this.policyType === 'PUTAWAY' ? 'putaway-policy' : 'outbound-policy'
            if (policyId) {
                this.putawayPolicyService
                    .getPutwayPolicyDetails(policyTypeData, policyId)
                    .subscribe(
                        (data: any) => {
                            if (data.result) {
                                const policyDetailsData =
                                    data.result[0].putawaypolicyDetails[0];
                                this.policyDetailDes =
                                    policyDetailsData.description;
                                this.locWeightCheck =
                                    policyDetailsData.locatorWeightCheck === 'Y'
                                        ? true
                                        : false;
                                this.locVolumeCheck =
                                    policyDetailsData.locatorVolumeCheck === 'Y'
                                        ? true
                                        : false;
                                this.locUnitCheck =
                                    policyDetailsData.locatorUnitCheck === 'Y'
                                        ? true
                                        : false;
                                this.locDimensionCheck =
                                    policyDetailsData.locatorDimensionCheck === 'Y'
                                        ? true : false;
                                this.partialPutaway =
                                    policyDetailsData.partialPutaway === 'Y'
                                        ? true : false;
                                this.allocateLpnOnly =
                                    policyDetailsData.allocateLpnOnly === 'Y'
                                        ? true : false;
                                this.allocateLpnAndLoose =
                                    policyDetailsData.allocateLpnAndLoose === 'Y'
                                        ? true : false;
                                this.allocateLooseOnly =
                                    policyDetailsData.allocateLooseOnly === 'Y'
                                        ? true : false;

                                this.policyId = Number(
                                    policyDetailsData.policyId
                                );
                                this.iuId = Number(policyDetailsData.iuId);
                                this.policyName = policyDetailsData.policyName;
                                for (const [
                                    i,
                                    rowData
                                ] of policyDetailsData.rules.entries()) {
                                    rowData.condition = '';
                                    rowData.entity = '';
                                    rowData.entityValue = '';
                                    rowData.entityValueType = '';
                                    rowData.operator = '';
                                    rowData.policyId = '';
                                    rowData.ruleType = '';
                                    rowData.sequenceId = '';
                                    rowData.action = '';
                                    rowData.editing = false;
                                    for (const childRowData of policyDetailsData
                                        .rules[i].rules) {
                                        childRowData.rowSelect = false;
                                        childRowData.action = '';
                                        childRowData.action = '';
                                        childRowData.editing = false;
                                        childRowData.fieldsDisable = false;
                                        childRowData.valueTypeLOV = false;
                                        childRowData.valueTypeLOVChange = false;
                                        childRowData.entityValueField = '';
                                        childRowData.leftBracket = childRowData.leftBracket === null ? '' : childRowData.leftBracket;
                                        childRowData.rightBracket = childRowData.rightBracket === null ? '' : childRowData.rightBracket;
                                        childRowData.originalData = Object.assign({}, childRowData);

                                    }
                                    this.parameterData.push(rowData);
                                } 
                                this.parameterDataSource = new MatTableDataSource<
                                    ParameterDataElement
                                >(this.parameterData);
                                this.parameterDataSource.paginator = this.paginator;
                                this.isEdit = true;
                            }
                        },
                        (error: any) => {
                            this.openSnackBar(error.error.message, '', 'error-snackbar');
                        }
                    );
            }
        }
    }

    deleteRow(
        rowData: any,
        rowIndex: number,
        type: any,
        templateRef?: TemplateRef<any>
    ) {
        if (rowData.addNewRecord) {
            if (type === 'priority') {
                this.parameterData.splice(rowIndex, 1);
                this.parameterDataSource = new MatTableDataSource<
                    ParameterDataElement
                >(this.parameterData);
                this.checkIsAddRow(this.parameterData);
            }
            if (type === 'rule') {
                this.nestedParameterDataElement.splice(rowIndex, 1);
                this.nestedParameterDataSource = new MatTableDataSource<
                    NestedParameterDataElement
                >(this.nestedParameterDataElement);
                this.checkIsAddRow(this.nestedParameterDataElement);
            }
            if (type === 'sort') {
                this.sortParameterData.splice(rowIndex, 1);
                this.sortParameterDataSource = new MatTableDataSource<
                    SortParameterDataElement
                >(this.sortParameterData);
                this.checkIsAddRow(this.sortParameterData);
            }
        } else {
            // if (!this.dialog.openDialogs || !this.dialog.openDialogs.length) {
            const dialogRef = this.dialog.open(templateRef, {
                width: '20%',
                data: [
                    {
                        row: rowData,
                        index: rowIndex,
                        datatype: type
                    }
                ]
            });
            dialogRef.afterClosed().subscribe(response => {
                if (response) {
                    this.deleteConfirm(response);
                }
            });
            // }
        }
        this.parameterDataSource = new MatTableDataSource<
            ParameterDataElement
        >(this.parameterData);
        this.parameterDataSource.paginator = this.paginator;
    }

    deleteConfirm(deleteData) {
        if (deleteData[0].datatype === 'priority') {
            this.parameterData.splice(deleteData[0].index, 1);
            this.parameterDataSource = new MatTableDataSource<
                ParameterDataElement
            >(this.parameterData);
            this.checkIsAddRow(this.parameterData);
            this.deletePriorityRow(Number(deleteData[0].row.priorityId));
        }
        if (deleteData[0].datatype === 'rule') {
            if(deleteData[0].row.leftBracket || deleteData[0].row.rightBracket) {
              this.openSnackBar('You need to ungroup this rule before deleting', '', 'error-snackbar');
              return;
            } else {
              this.nestedParameterDataElement.splice(deleteData[0].index, 1);
              this.nestedParameterDataSource = new MatTableDataSource<
                  NestedParameterDataElement
              >(this.nestedParameterDataElement);
              this.checkIsAddRow(this.nestedParameterDataElement);
              this.deleteRuleRow(Number(deleteData[0].row.ruleId));
            }
        }
        if (deleteData[0].datatype === 'sort') {
            this.sortParameterData.splice(deleteData[0].index, 1);
            this.sortParameterDataSource = new MatTableDataSource<
                SortParameterDataElement
            >(this.sortParameterData);
            this.checkIsAddRow(this.sortParameterData);
            this.deleteSortRow(Number(deleteData[0].row.sortId));
        }
    }

    deletePriorityRow(priorityId) {
        this.putawayPolicyService.deletePriority(priorityId).subscribe(
            (data: any) => {
                this.openSnackBar(data.message, '', 'success-snackbar');
                this.fromUpdateCall();
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    deleteRuleRow(ruleId) {
        this.putawayPolicyService.deleteRules(ruleId).subscribe(
            (data: any) => {
                this.openSnackBar(data.message, '', 'success-snackbar');
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    deleteSortRow(sortId) {
        this.putawayPolicyService.deleteSort(sortId).subscribe(
            (data: any) => {
                this.openSnackBar(data.message, '', 'success-snackbar');
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    checkIsAddRow(dataArray: any) {
        let cnt = 0;
        const pLength = dataArray.length;
        for (const pdata of dataArray) {
            if (pdata.addNewRecord === true) {
                return;
            } else {
                cnt++;
            }
        }
        if (cnt === pLength) {
            // this.isAdd = false;
            // this.isSortingAdd = false;
        }
    }

    addRow() {
        let validationMsg = '';
        if (!this.iuId && !this.policyName && !this.policyDetailDes) {
            validationMsg =
                'Please enter inventory unit, policy name, Description';
            this.openSnackBar(validationMsg, '', 'error-snackbar');
            return;
        } else {
            if (!this.iuId) {
                validationMsg = ' Please Select inventory unit';
                this.openSnackBar(validationMsg, '', 'error-snackbar');
                return;
            } else if (!this.policyName) {
                validationMsg = 'Please enter policy name';
                this.openSnackBar(validationMsg, '', 'error-snackbar');
                return;
            } else if (!this.policyDetailDes) {
                validationMsg = 'Please enter description';
                this.openSnackBar(validationMsg, '', 'error-snackbar');
                return;
            } else {
                this.paginator.pageIndex = 0;
                for (const pData of this.parameterData) {
                    if (
                        pData.editing === true &&
                        pData.addNewRecord === undefined
                    ) {
                        this.openSnackBar(
                            'Please update your records first.',
                            '',
                            'error-snackbar'
                        );
                        return;
                    }
                }
                if (this.policyId) {
                    this.isAdd = false;
                    this.isEdit = true;
                }
                this.parameterData.push({
                    sequenceId: '',
                    prioritySequenceId: null,
                    priorityName: '',
                    priorityId: '',
                    condition: '',
                    entity: '',
                    entityValue: '',
                    entityValueType: '',
                    operator: '',
                    policyId: null,
                    ruleType: '',
                    description: '',
                    iuId: null,
                    locatorDimensionCheck: '',
                    locatorUnitCheck: '',
                    locatorVolumeCheck: '',
                    locatorWeightCheck: '',
                    partialPutaway: '',
                    allocateLpnOnly:'',
                    allocateLpnAndLoose:'',
                    allocateLooseOnly:'',
                    policyName: '',
                    rules: [],
                    sort: [],
                    createdBy: JSON.parse(localStorage.getItem('userDetails'))
                        .userId,
                    updatedBy: JSON.parse(localStorage.getItem('userDetails'))
                        .userId,
                    action: '',
                    editing: true,
                    addNewRecord: true,
                    leftBracket: '',
                    rightBracket: ''
                });

                this.parameterDataSource = new MatTableDataSource<
                    ParameterDataElement
                >(this.parameterData);
                this.parameterDataSource.paginator = this.paginator;
            }
        }
    }

    // add sorting row
    addSortingRow() {
        for (const pData of this.sortParameterData) {
            if (pData.editing === true && pData.addNewRecord === undefined) {
                this.openSnackBar(
                    'Please update your records first.',
                    '',
                    'error-snackbar'
                );
                return;
            }
        }
        // this.isSortingAdd = true;
        if(this.policyId){
            this.isEdit = true;
        }else{
            this.isAdd = true;
        }
        this.sortParameterData.push({
            policyId: this.policyId,
            priorityId: Number(this.priorityId),
            sequenceId: null,
            type: '',
            // algorithmId: null,
            algorithmId: 0,
            orderBy: 'ASC',
            action: '',
            editing: true,
            addNewRecord: true
        });

        this.sortParameterDataSource = new MatTableDataSource<
            SortParameterDataElement
        >(this.sortParameterData);
    }

    addPolicyDetails() {
        // this.isAdd = true;
        this.isCancel = true;
        this.isAdd = true;
        this.isEdit = false;
        this.iuId = (JSON.parse(localStorage.getItem('defaultIU'))).id;
        this.policyNameSelectShow = false;
        this.policyDetailDes = '';
        this.readonlyEnable = false;
        this.locWeightCheck = false;
        this.locVolumeCheck = false;
        this.locUnitCheck = false;
        this.locDimensionCheck = false;
        this.partialPutaway = false;
        this.allocateLpnOnly = false;
        this.allocateLpnAndLoose = false;
        this.allocateLooseOnly = false;

        this.policyName = '';
        this.policyId = null;
        this.priorityId = null;
        this.selectedRowIndex = null;
        this.parameterData = [];
        this.parameterDataSource = new MatTableDataSource([]);
        this.parameterDataSource.paginator = this.paginator;
        this.nestedParameterDataSource = new MatTableDataSource([]);
        this.nestedParameterDataSource.paginator = this.paginator;
    }

    openConfirmationDialog(pageName: string, url: any) {
        const confirmationDialogRef = this.dialog.open(
            ConfirmationDialogComponent,
            {
                data: {
                    pageName: pageName,
                    url: url
                },
                width: '30vw'
            }
        );
        confirmationDialogRef.afterClosed().subscribe(response => {
            if (
                response !== undefined &&
                response.url === 'policyCancel'
            ) {
                this.cancelAdd();
            }
        });
    }

    cancelAdd() {
        this.isAdd = false;
        this.iuId = (JSON.parse(localStorage.getItem('defaultIU'))).id;
        if (this.policyType === 'PUTAWAY'){
                this.getRoutingPolicyLov('policy-routing','policy-name',this.iuId);
        }else{
            this.getRoutingPolicyLov('picking', 'policy-name', this.iuId);
        }
        this.isCancel = false;
        this.policyNameSelectShow = true;
        this.policyDetailDes = '';
        this.readonlyEnable = true;
        this.locWeightCheck = false;
        this.locVolumeCheck = false;
        this.locUnitCheck = false;
        this.locDimensionCheck = false;
        this.partialPutaway = false;
        this.allocateLpnOnly = false;
        this.allocateLpnAndLoose = false;
        this.allocateLooseOnly = false;
        this.policyName = '';
        this.policyId = null;
        this.priorityId = null
        this.selectedRowIndex = null
        this.parameterDataSource = new MatTableDataSource([]);
        this.parameterDataSource.paginator = this.paginator;
        this.nestedParameterDataSource = new MatTableDataSource([]);
        this.nestedParameterDataSource.paginator = this.paginator;
    }

    addRules(templateRef: TemplateRef<any>, rowData: any, rowIndex: number) {
        if (this.policyId) {
            this.isEdit = true;
        }
        this.expandedElement = this.parameterData[rowIndex];
        rowData.rules.push({
            rowSelect: false,
            sequenceId: '',
            priorityName: '',
            priorityId: '',
            condition: '',
            entity: '',
            entityValue: '',
            entityValueType: '',
            operator: '',
            policyId: '',
            ruleType: '',
            action: '',
            editing: true,
            addNewRecord: true,
            fieldsDisable: false,
            valueTypeLOV: true,
            valueTypeLOVChange: false,
            entityValueField: '',
            sort: [],
            leftBracket: '',
            rightBracket: ''
        });
        this.getNestedChildData(templateRef, rowData, rowIndex, 'addRule');
    }

    onSubmit(type: string,fromSort?:string, index?:any) {
        let dataArray: any[] = [];
        const ruleObj: any[] = [];
        if (fromSort === 'sort') {
            this.sortingDone(index);
        }
        if (this.policyId) {
            for (const [j,pchildData] of this.nestedParameterDataElement.entries()) {
                pchildData.editing = true;
            }
        } else {
            for (const [i,pData] of this.nestedParameterDataElement.entries()) {
                pData.addNewRecord = true;
            }
        }

        for (const [i, pData] of this.parameterData.entries()) {
            pData.description = this.policyDetailDes;
            pData.iuId = Number(this.iuId);
            pData.locatorDimensionCheck =
            this.locDimensionCheck === true ? 'Y' : 'N';
            pData.locatorUnitCheck = this.locUnitCheck === true ? 'Y' : 'N';
            pData.locatorVolumeCheck = this.locVolumeCheck === true ? 'Y' : 'N';
            pData.locatorWeightCheck = this.locWeightCheck === true ? 'Y' : 'N';
            pData.partialPutaway = this.partialPutaway === true ? 'Y' : 'N';
            pData.allocateLpnOnly = this.allocateLpnOnly === true ? 'Y' : 'N';
            pData.allocateLpnAndLoose = this.allocateLpnAndLoose === true ? 'Y' : 'N';
            pData.allocateLooseOnly = this.allocateLooseOnly === true ? 'Y' : 'N';

            pData.policyName = this.policyName;
            pData.policyId = this.policyId;
            pData.createdBy = JSON.parse(localStorage.getItem('userDetails')).userId;
            pData.updatedBy = JSON.parse(localStorage.getItem('userDetails')).userId;
            this.selectedExtendRowIndex = null;
            if (type === 'save') {
                if (this.iuId && this.policyName && this.policyDetailDes && pData.priorityName) {
                    if (pData.addNewRecord === true && pData.rules.length) {
                        for (const [ruleIndex, pchildData] of pData.rules.entries()) {
                            const isRuleValidate = this.ruleValidate(ruleIndex, pchildData);
                            if(isRuleValidate){
                                pchildData.prioritySequenceId = String(i + 1);
                                pchildData.priorityName = pData.priorityName;
                                pchildData.policyId = this.policyId ? Number(pchildData.policyId) : null;
                                pchildData.priorityId = pchildData.priorityId ? Number(pchildData.priorityId) : null;
                                pchildData.ruleSequenceId = pchildData.ruleSequenceId ? Number(pchildData.ruleSequenceId) : null;
                                pchildData.prioritySequenceId = pchildData.prioritySequenceId ? Number(pchildData.prioritySequenceId) : null;
                                pchildData.policyType = this.policyType;

                                if (pData.rules[0].sort) {
                                    for (const pchildSortData of pData.rules[0].sort) {
                                        pchildSortData.policyId = this.policyId;
                                        pchildSortData.priorityId = pchildData.priorityId;
                                        pchildSortData.algorithmId = pchildSortData.algorithmId ? Number(pchildSortData.algorithmId) : null;
                                        pchildSortData.priorityId = pchildSortData.priorityId ? Number(pchildSortData.priorityId) : null;
                                        pchildSortData.sequenceId = pchildSortData.sequenceId ? Number(pchildSortData.sequenceId) : null;
                                        pchildSortData.sortId = pchildSortData.sortId ? Number(pchildSortData.sortId) : null;
                                        pchildSortData.policyType = this.policyType;

                                    }
                                }
                                ruleObj.push(pchildData);
                            } else{
                                this.selectedExtendRowIndex = ruleIndex+1;
                                this.openSnackBar('Please fill required fields in row ' + (ruleIndex+1), '', 'error-snackbar');
                                return;
                            }
                        }
                    } else {
                        this.openSnackBar('Please add one priority with rules.','','error-snackbar');
                        return;
                    }
                } else {
                    let validationMsg = '';
                    if (!this.iuId && !this.policyName && !this.policyDetailDes && !pData.priorityName) {
                        validationMsg =
                            'Please enter inventory unit, policy name, Description, priority name';
                    } else {
                        !this.iuId
                            ? (validationMsg = ' Please Select inventory unit')
                            : !this.policyName
                            ? (validationMsg = 'Please enter policy name')
                            : !this.policyDetailDes
                            ? (validationMsg = 'Please enter description')
                            : (validationMsg = 'Please enter priority name');
                    }
                    this.openSnackBar(validationMsg, '', 'error-snackbar');
                    return;
                }
            } else {
                if(pData.rules.length === 0){
                    this.openSnackBar('Please add priority with rules.','','error-snackbar');
                    return;
                }
                for (const [j, pchildData] of pData.rules.entries()) {
                    if (this.iuId && this.policyName && this.policyDetailDes && pData.priorityName) {
                        pchildData.editing = true;
                        if (pchildData.editing === true && pData.rules.length) {
                            const isRuleValidate = this.ruleValidate(j, pchildData);
                            if(isRuleValidate){
                                pchildData.prioritySequenceId = String(i + 1);
                                pchildData.priorityName = pData.priorityName;
                                pchildData.policyId = this.policyId;
                                pchildData.priorityId = pchildData.priorityId ? Number(pchildData.priorityId) : null;
                                pchildData.ruleId = pchildData.ruleId ? Number(pchildData.ruleId) : null;
                                pchildData.ruleSequenceId = pchildData.ruleSequenceId ? Number(pchildData.ruleSequenceId) : null;

                                pchildData.prioritySequenceId = pchildData.prioritySequenceId ? Number(pchildData.prioritySequenceId) : null;
                                pchildData.policyType = this.policyType;


                                if (pData.sort) {
                                    for (const pchildSortData of pData.sort) {
                                        pchildSortData.policyId = this.policyId;
                                        pchildSortData.priorityId = pchildData.priorityId;
                                        pchildSortData.policyId = pchildSortData.policyId ? Number(pchildSortData.policyId) : null;
                                        pchildSortData.algorithmId = pchildSortData.algorithmId ? Number(pchildSortData.algorithmId) : null;
                                        pchildSortData.priorityId = pchildSortData.priorityId ? Number(pchildSortData.priorityId) : null;
                                        pchildSortData.sequenceId = pchildSortData.sequenceId ? Number(pchildSortData.sequenceId) : null;
                                        pchildSortData.sortId = pchildSortData.sortId ? Number(pchildSortData.sortId) : null;
                                        pchildSortData.policyType = this.policyType;
                                    }
                                }
                                ruleObj.push(pchildData);
                            }else{
                                this.selectedExtendRowIndex = j+1;
                                this.openSnackBar('Please fill required fields in row ' + (j+1), '', 'error-snackbar');
                                return;
                            }
                        }
                    } else {
                        let validationMsg = '';
                        if (!this.iuId && !this.policyName && !this.policyDetailDes && !pData.priorityName) {
                            validationMsg =
                                'Please enter inventory unit, policy name, Description, priority name';
                        } else {
                            !this.iuId
                                ? (validationMsg =
                                      ' Please Select inventory unit')
                                : !this.policyName
                                ? (validationMsg = 'Please enter policy name')
                                : !this.policyDetailDes
                                ? (validationMsg = 'Please enter description')
                                : (validationMsg =
                                      'Please enter priority name');
                        }
                        this.openSnackBar(validationMsg,'','error-snackbar');
                        return;
                    }
                }
            }
        }

        if (this.parameterData.length) {
            dataArray = this.parameterData;
            if (type === 'save') {
                dataArray[0].rules = ruleObj;
                if(this.nestedParameterDataElement.length){
                    this.addPutawayPolicy(dataArray[0]);
                }else{
                    this.validationFunction(type);
                }
            } else {
                if(dataArray[this.selectedRowIndex]){
                    dataArray[this.selectedRowIndex].rules = ruleObj;
                    this.updatePutawayPolicy(dataArray[this.selectedRowIndex]);
                }else{
                    const rowIndex = 0;
                    this.selectedRowIndex = rowIndex;
                    dataArray[this.selectedRowIndex].rules = ruleObj;
                    this.updatePutawayPolicy(dataArray[this.selectedRowIndex]);
                }
            }
        } else {
            this.validationFunction(type);
        }

    }

    validationFunction(type:any){
        let validationMsg = '';
            if (!this.iuId && !this.policyName && !this.policyDetailDes) {
                validationMsg =
                    'Please enter inventory unit, policy name, Description';
            } else {
                !this.iuId
                    ? (validationMsg = ' Please Select inventory unit')
                    : !this.policyName
                    ? (validationMsg = 'Please enter policy name')
                    : !this.policyDetailDes
                    ? (validationMsg = 'Please enter description')
                    : (type === 'save' || type === 'update' ) 
                    ? (validationMsg = 'Please add one priority with rules.')
                    : '';
            }
            if(validationMsg !== ''){
                this.openSnackBar(validationMsg,'','error-snackbar');
                return;
            }
    }

    ruleValidate(index, data){
        if(data.ruleSequenceId && data.ruleType){
            if(data.ruleType === 'ALGORITHM' || data.ruleType === 'SQL'){
                if(data.entityValue === ''){
                    return false;
                }
            }
            if(data.ruleType === 'EXPRESSION'){
                if(data.entity === '' || data.condition === '' || data.entityValue === '' || data.entityValueType === '' ){
                    return false;
                }
            }
            const isLastIndex = (this.nestedParameterDataElement.length - 1 === index) ? true : false;
            if(this.nestedParameterDataElement.length > 1 && !isLastIndex && data.operator === ''){
                return false;
            }
            return true;
        } else{
            return false;
        }
    }

    sortingDone(index:any) {
        const tempSortArray = []
        for (const [j, sortData] of this.sortParameterData.entries()) {
            if (sortData.editing === true) {
                sortData.sequenceId = Number(sortData.sequenceId);
                sortData.algorithmId = Number(sortData.algorithmId);
                // sortData.policyType = this.policyType;
                tempSortArray.push(sortData);
            }
        }
        this.parameterData[index].sort = tempSortArray;
    }

    addPutawayPolicy(dataArray) {
        const policyTypeData = this.policyType === 'PUTAWAY' ? 'putaway-policy' :'outbound-policy';
        this.saveInprogress = true;
        this.putawayPolicyService.putawayPolicyInsert(policyTypeData,dataArray).subscribe(
            result => {
                this.saveInprogress = false;
                if (result.status === 200) {
                    this.isAdd = false;
                    this.fromUpdateCall();
                    this.openSnackBar(result.message, '', 'success-snackbar');
                    this.cancelAdd();
                } else {
                    this.isAdd = true;
                    this.openSnackBar(result.message, '', 'error-snackbar');
                }
            },
            (error: any) => {
                this.isAdd = true;
                this.saveInprogress = false;
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    fromUpdateCall() {
        this.searchPutawayPolicyRules('fromUpdate', this.policyId);
    }
    updatePutawayPolicy(dataArray) { 
        const policyTypeData = this.policyType === 'PUTAWAY' ? 'putaway-policy' : 'outbound-policy'
        this.saveInprogress = true;
        this.putawayPolicyService
            .putawayPolicyUpdate(policyTypeData, dataArray, this.policyId)
            .subscribe(
                result => {
                    this.saveInprogress = false;
                    if (result.status === 200) {
                        this.isEdit = false;
                        this.fromUpdateCall();
                        this.openSnackBar(
                            result.message,
                            '',
                            'success-snackbar'
                        );
                        this.cancelAdd();
                    } else {
                        this.isEdit = true;
                        this.openSnackBar(result.message, '', 'error-snackbar');
                    }
                },
                (error: any) => {
                    this.isEdit = true;
                    this.saveInprogress = false;
                    this.openSnackBar(
                        error.error.message,
                        '',
                        'error-snackbar'
                    );
                }
            );
    }

    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
             duration: 3500,
            panelClass: [typeClass]
        });
    }

    copyFrom(templateRef: TemplateRef<any>, rowIndex) {
        this.getAllPutawayPriority();
        this.newRowIndex = rowIndex;
        if (!this.dialog.openDialogs || !this.dialog.openDialogs.length) {
            const dialogRef = this.dialog.open(templateRef, {
                autoFocus: false,
                panelClass: 'copyFromDialog',
                minWidth: 260
            });
        }
    }

    copyFromSelection(event: any, element) {
        this.selectedItem = element;
        this.copyPriority = [];
        this.copyPriority = element;
        this.parameterData[this.newRowIndex].rules = element.rules;
        for (const [i, pData] of element.rules.entries()) {
            this.parameterData[this.newRowIndex].rules[i].action = '';
            this.parameterData[this.newRowIndex].rules[i].editing = false;
            this.parameterData[this.newRowIndex].rules[i].sort = element.sort;
        }
    }

    copyPriorityDone(templateRef: TemplateRef<any>) { 
        this.expandedElement = this.parameterData[this.newRowIndex];
        this.getNestedChildData(
            templateRef,
            this.copyPriority,
            this.newRowIndex,
            'copyRule'
        );
    }

    beginRuleEdit(rowData: any, $event: any) {
        if (rowData.editing === false) {
            rowData.editing = true;
            this.isAdd = false;
            this.isEdit = true;
        } else {
        }
    }

    beginSortEdit(rowData: any, $event: any) {
        for (const pData of this.sortParameterData) {
            if (pData.addNewRecord === true) {
                this.openSnackBar(
                    'Please add your records first.',
                    '',
                    'error-snackbar'
                );
                return;
            }
        }
        if (rowData.editing === false) {
            rowData.editing = true;
            this.isSortingAdd = true;
            this.isEdit = true;
        } else {
        }
    }

    disableEdit(rowData: any, index: any, type?: any) {
        if (type === 'sort') {
            if (this.sortParameterData[index].editing === true) {
                this.sortParameterData[index].editing = false;
                if (rowData.addNewRecord) {
                    this.sortParameterData.splice(index, 1);
                    this.sortParameterDataSource = new MatTableDataSource<
                        SortParameterDataElement
                    >(this.sortParameterData);
                    this.checkIsAddRow(this.sortParameterData);
                }
            }
            if (
                this.sortParameterData.find(
                    ({ editing }) => editing === true
                ) === undefined &&
                this.policyId
            ) {
                this.isSortingEdit = false;
            }
        } else {
            if (this.nestedParameterDataElement[index].editing === true ) {
                this.nestedParameterDataElement[index].editing = false;
                if (rowData.addNewRecord) {
                    this.nestedParameterDataElement.splice(index, 1);
                    this.nestedParameterDataSource = new MatTableDataSource<
                        NestedParameterDataElement
                    >(this.nestedParameterDataElement);
                    this.checkIsAddRow(this.nestedParameterDataElement);
                } else{
                  this.nestedParameterDataElement[index].ruleSequenceId = this.nestedParameterDataElement[index].originalData.ruleSequenceId;
                  this.nestedParameterDataElement[index].ruleType = this.nestedParameterDataElement[index].originalData.ruleType;
                  this.nestedParameterDataElement[index].entity = this.nestedParameterDataElement[index].originalData.entity;
                  this.nestedParameterDataElement[index].condition = this.nestedParameterDataElement[index].originalData.condition;
                  this.nestedParameterDataElement[index].entityValueType = this.nestedParameterDataElement[index].originalData.entityValueType;
                  this.nestedParameterDataElement[index].entityValue = this.nestedParameterDataElement[index].originalData.entityValue;
                  this.nestedParameterDataElement[index].operator = this.nestedParameterDataElement[index].originalData.operator;
                }
            }
            if ( this.nestedParameterDataElement.find( ({ editing }) => editing === true ) === undefined && !this.policyId ) {
                this.isEdit = false;
            }
        }
    }

    rowSelectChange() {
        // $event.stopPropagation();
        // this.rowCount++;
        const count = this.getSelectedRowCount();
        if(count === 2){
            this.rowDisabled = true;

        } else{
            this.rowDisabled = false;
        }

    }

    getSelectedRowCount(){
        let selectRowCount = 0;
        for(const data of this.nestedParameterDataElement){
            if(data.rowSelect){
                selectRowCount ++;
            }
        }
        return selectRowCount;
    }

    groupUngroupRules(rowData: any, action) {
        this.rowDisabled = false;
        this.rowCount = 0;
        let firstIndex = null;
        let lastIndex = null;
        this.isEdit = true;
        let checkSelection = rowData.rules.every(function(element){
            return element.rowSelect === false;
        });
        if(checkSelection){
            this.openSnackBar(
                ' Please select the rows first.',
                '',
                'error-snackbar'
            );
            return;
        }
        if (action === 'GROUP') {
            for (const [i, item] of rowData.rules.entries()) {

                if (item.rowSelect === true) {
                    if (firstIndex === null) {
                        firstIndex = i;
                        item.leftBracket = item.leftBracket + '(';
                        item.rowSelect = false;
                        // item.editing = true;
                    } else {
                        lastIndex = i;
                        item.rightBracket = item.rightBracket + ')';
                        item.rowSelect = false;
                        // item.editing = true;
                    }
                }
            }
            if (lastIndex === null) {
                rowData.rules[firstIndex].rightBracket =
                    rowData.rules[firstIndex].rightBracket + ')';
                rowData.rules[firstIndex].rowSelect = false;
            } 
        } else {
            for (const [i, item] of rowData.rules.entries()) {
                if (item.rowSelect === true) {
                    if (firstIndex === null) {
                        firstIndex = i;
                    } else {
                        lastIndex = i;
                    }
                }
            }
            if (lastIndex === null) {
                lastIndex = firstIndex;
            }
            if(rowData.rules[firstIndex].leftBracket !=='' && rowData.rules[lastIndex].rightBracket !==''){
                rowData.rules[firstIndex].leftBracket = rowData.rules[firstIndex].leftBracket.slice(0, -1);
                rowData.rules[firstIndex].rowSelect = false;
                // rowData.rules[firstIndex].editing = true;
                rowData.rules[lastIndex].rightBracket = rowData.rules[lastIndex].rightBracket.slice(0, -1);
                rowData.rules[lastIndex].rowSelect = false;
                // rowData.rules[lastIndex].editing = true;
            } else{
                this.rowSelectChange();
                this.openSnackBar('You can not ungroup the rows','','error-snackbar');
            } 
        }

    }

    dialogForSQL(
        event,
        rowIndex: number,
        rowData,
        templateRef?: TemplateRef<any>
    ) {
        if (rowData.entityValue === '') {
            this.inputSQLQuery = '';
        } else {
            this.inputSQLQuery = rowData.entityValue;
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
            response[0].row.entityValue = this.inputSQLQuery;
            this.inputSQLQuery = '';
        } else {
            return;
        }
    }

    // tslint:disable-next-line: use-lifecycle-interface
    ngOnDestroy() {
      this.timer ? this.timer.unsubscribe() : '';
      this.dialog.closeAll();
      window.localStorage.removeItem('taskDtailPage');
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
            this.paginator.pageSizeOptions = this.commonService.paginationArray;
            this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
        }, 100);
    }
    @HostListener('window:resize', ['$event'])
    onResize(event) {
    this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
    this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.nestedColumns);
    }
}
