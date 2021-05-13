import {
    Component,
    OnInit,
    Renderer2,
    ViewChild,
    ElementRef,
    ViewChildren,
    TemplateRef
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
    MatSnackBar,
    MatTable,
    MatPaginator,
    MatSort,
    MatTableDataSource,
    TooltipPosition,
    MatDialogRef,
    MatDialog
} from '@angular/material';
import { CommonService } from 'src/app/_services/common/common.service';
import { RuleService } from 'src/app/_services/labelSetup/rule.service';
import { PrinterManagerService } from 'src/app/_services/labelSetup/printer-manager.service';
import { ManualPrintService } from 'src/app/_services/labelSetup/manual-print.service';
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

export interface ParameterDataElement {
    sequenceId: string;
    editing: boolean;
    action: string;
    rules: any[];
    addNewRecord?: boolean;
    updatedBy?: string;
    createdBy?: string;
}

export interface NestedParameterDataElement {
    field: string;
    operator: string;
    value: string;
    AndOr: string;
    // // rowSelect: boolean;
    // sequenceId: string;
    // // ruleSequenceId: string;
    // priorityName: string;
    // priorityId: number;
    // condition: string;
    // entity: string;
    // entityValue: string;
    // entityValueType: string;
    // operator: string;
    // policyId: number;
    // // ruleType: string;
    action: string;
    addNewRecord?: boolean;
    // isRoutingValue?: any;
    operatorLov?: any;
    // showHint?: boolean;
    editing: boolean;
    // fieldsDisable?: boolean;
    // entityValueField?: string;
    // valueTypeLOV?: boolean;
    // valueTypeLOVChange?: boolean;
    // leftBracket: string;
    // rightBracket: string;
    originalData?: any;
}

export interface SortParameterDataElement {
    sequenceId: number;
    policyId: number;
    priorityId: number;
    type: string;
    algorithmId: number;
    policyType?: string;
    orderBy: string;
    action: string;
    addNewRecord?: boolean;
    editing?: boolean;
}

@Component({
    selector: 'app-add-rule',
    templateUrl: './add-rule.component.html',
    styleUrls: ['./add-rule.component.css'],
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
export class AddRuleComponent implements OnInit {
    RuleForm: FormGroup;
    isAdd = false;
    isEdit = false;
    ruleId: number;
    formTitle: string;
    ruleTypeLov = [];
    subRuleTypeList = [];
    ruleForTypePlaceholder = 'Printer';
    andOrList: any = [];
    operatorList: any = [];
    filterList: any = [];
    parameterData: ParameterDataElement[] = [];
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
    validationMessages = {
        Name: {
            required: 'Name is required.'
        },
        LabelName: {
            required: 'Label Name is required.'
        }
    };

    ruleFormErrors = {
        Name: '',
        LabelName: ''
    };
    parameterDisplayedColumns: string[] = [
        'prioritySequenceId',
        'filter',
        'operator',
        'value',
        'AndOr',
        // 'condition',
        // 'entityValueType',
        // 'entityValue',
        // 'operator',
        // 'rightBracket',
        'action'
    ];
    nestedParameterDataElement: NestedParameterDataElement[] = [];
    nestedParameterDataSource = new MatTableDataSource<
        NestedParameterDataElement
    >(this.nestedParameterDataElement);
    selectedRowIndex: number;
    @ViewChild(MatTable, { read: ElementRef, static: false })
    matTableRef: ElementRef;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChildren('myDialog', { read: TemplateRef }) myDialogRef: TemplateRef<
        any
    >;
    tooltipPosition: TooltipPosition[] = ['below'];
    policyId: number;
    nestedParameterDisplayedColumns: string[] = [
        'prioritySequenceId',
        'filter',
        'operator',
        'value',
        'AndOr',
        // 'rightBracket',
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
    expandedElement: ParameterDataElement | null;
    columns: any = [
        { field: 'prioritySequenceId', name: '', width: 75, baseWidth: 10 },
        { field: 'filter', name: 'Filter', width: 150, baseWidth: 20 },
        { field: 'operator', name: 'Operator', width: 150, baseWidth: 20 },
        { field: 'value', name: 'Value', width: 150, baseWidth: 20 },
        // {
        //     field: 'description',
        //     name: 'Operation Type',
        //     width: 100,
        //     baseWidth: 14
        // },
        // { field: 'entity', name: 'Entity', width: 100, baseWidth: 13 },
        // { field: 'condition', name: 'Operator', width: 75, baseWidth: 8 },
        // {
        //     field: 'entityValueType',
        //     name: 'Value Type',
        //     width: 75,
        //     baseWidth: 8
        // },
        // {
        //     field: 'entityValue',
        //     name: 'Entity/Value',
        //     width: 100,
        //     baseWidth: 16
        // },
        { field: 'AndOr', name: 'And/OR', width: 80, baseWidth: 20 },
        // { field: 'rightBracket', name: '', width: 80, baseWidth: 3 },
        { field: 'action', name: 'Action', width: 80, baseWidth: 10 }
    ];
    nestedColumns: any = [
        // { field: 'rowSelect', name: '', width: 75, baseWidth: 4 },
        // { field: 'ruleSequenceId', name: 'Sequence', width: 150, baseWidth: 7 },
        // { field: 'leftBracket', name: '', width: 150, baseWidth: 3 },
        // {
        //     field: 'ruleType',
        //     name: 'Operation Type',
        //     width: 100,
        //     baseWidth: 14
        // },
        { field: 'prioritySequenceId', name: '', width: 75, baseWidth: 10 },
        { field: 'filter', name: 'Filter', width: 150, baseWidth: 20 },
        { field: 'operator', name: 'Operator', width: 150, baseWidth: 20 },
        { field: 'value', name: 'Value', width: 150, baseWidth: 20 },
        { field: 'AndOr', name: 'And/OR', width: 80, baseWidth: 20 },
        // { field: 'rightBracket', name: '', width: 80, baseWidth: 3 },
        { field: 'action', name: 'Action', width: 80, baseWidth: 10 }
    ];

    constructor(
        private fb: FormBuilder,
        public router: Router,
        private snackBar: MatSnackBar,
        private render: Renderer2,
        public commonService: CommonService,
        public printerManagerService: PrinterManagerService,
        public manualPrintService: ManualPrintService,
        private ruleService: RuleService,
        private route: ActivatedRoute,
        public dialog: MatDialog
    ) {}

    ngOnInit() {
        this.ruleFeedForm();
        this.getRuleType();
        this.getAndOrLIst();
        this.getOperatorLOV();
        this.getFilterLOV();
        this.route.params.subscribe(params => {
            if (params.id) {
                this.formTitle = 'Edit Rule :';
                this.isEdit = true;
                this.ruleId = params.id;
                this.ruleService
                    .getRuleById(params.id)
                    .subscribe((data: any) => {
                        this.RuleForm.patchValue(data[0]);
                        this.RuleForm.patchValue({
                            Name: data[0].name
                        });
                        this.RuleForm.patchValue({
                            Description: data[0].description
                        });
                        this.RuleForm.patchValue({
                            Type: data[0].labelName === '' ? 'Printer' : 'Label'
                        });
                        this.RuleForm.patchValue({
                            LabelName:
                                data[0].labelName === ''
                                    ? data[0].printerID
                                    : data[0].labelID
                        });
                        this.RuleForm.patchValue({
                            IsActive: data[0].isActive === 1 ? true : false
                        });
                        this.renderFilterTable(JSON.parse(data[0].expression));
                        this.formTitle = 'Edit Rule : ' + data[0].name;
                        // this.printerManagerService
                        //     .getPrinterById(data[0].id)
                        //     .subscribe((data: any) => {
                        //         this.renderEditRoles(data);
                        //     });
                    });
            } else {
                this.formTitle = 'Add Rule :';
                this.isAdd = true;
            }
        });
        this.commonService.getScreenSize(156);
    }

    renderFilterTable(expression) {
        this.parameterData.push(expression);
        this.parameterData[0].rules[0].AndOr = expression.condition;
        // expression.condition !== '' ? this.parameterData[0].rules[0].AndOr : ''
        this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
            this.parameterData
        );
         for (const [
             i,
             pData
         ] of this.parameterData.entries()) {
             for (const [
                 j,
                 rowData
             ] of pData.rules.entries()) {
                 rowData.editing = false;
                 if(rowData.rules){
                     this.parameterData[i + 1] = { editing: true, action: '', sequenceId: '', rules: []};
                     this.parameterData[i + 1].rules = rowData.rules;
                    //  delete this.parameterData[0].rules[j];
                    // delete rowData;
                 }
             }
         }
        //          rules = {
        //              id: '',
        //              field: '',
        //              type: '',
        //              input: '',
        //              operator: '',
        //              value: ''
        //          };
        //          if (rowData.AndOr !== '') {
        //              obj.condition = this.parameterData[0].rules[0].AndOr;
        //          }
        //          rules.id = rowData.field;
        //          rules.field = rowData.field;
        //          rules.type = 'string';
        //          rules.input = 'text';
        //          rules.operator =
        //              rowData.operator;
        //          rules.value = rowData.value;
        //          if (i === 0) {
        //              obj.rules.push(rules);
        //          } else {
        //              nestedObj = {
        //                  condition: '',
        //                  rules: []
        //              };
        //              if (j == 0) {
        //                  nestedObj.condition =
        //                      this.parameterData[i]
        //                          .rules[0].AndOr ===
        //                      undefined
        //                          ? ''
        //                          : this
        //                                .parameterData[
        //                                i
        //                            ].rules[0].AndOr;
        //                  nestedObj.rules.push(
        //                      rules
        //                  );
        //                  obj.rules.push(nestedObj);
        //              } else {
        //                  //  nestedObj.condition =
        //                  //      this.parameterData[i].rules[0].AndOr === undefined
        //                  //          ? ''
        //                  //          : this.parameterData[i].rules[0].AndOr;
        //                  nestedObj.rules.push(
        //                      rules
        //                  );
        //                  obj.rules[
        //                      obj.rules.length - 1
        //                  ].rules.push(
        //                      nestedObj.rules[0]
        //                  );
        //              }
        //          }

        //  }
    }
    // Get Rule Type
    getRuleType() {
        this.ruleTypeLov = [];
        this.ruleTypeLov = [
            { value: 'Label', label: 'Label' },
            { value: 'Printer', label: 'Printer' }
        ];
        this.RuleForm.patchValue({
            Type: this.ruleTypeLov[0].value
        });
    }

    // Rule Type Selection Changed
    ruleTypeSelectionChanged(event: any, name: string) {
        if (event.source.selected) {
            if (name === 'Label') {
                this.getLabelLOV();
            }
            if (name === 'Printer') {
                this.getPrinterLOV();
            }
        }
    }

    // Get Label LOV
    getLabelLOV() {
        this.ruleForTypePlaceholder = 'Label';
        this.ruleForTypePlaceholder = 'Label';
        this.subRuleTypeList = [];
        this.manualPrintService.getLabel().subscribe((data: any) => {
            for (const response of data) {
                this.subRuleTypeList.push({
                    value: response.id,
                    label: response.name,
                    id: response.id
                });
            }
        });
    }

    // Get Printer LOV
    getPrinterLOV() {
        this.ruleForTypePlaceholder = 'Printer';
        this.subRuleTypeList = [];
        this.printerManagerService
            .getPrinterLOV('admin@visioncorp.com')
            .subscribe((data: any) => {
                for (const rowData of data) {
                    this.subRuleTypeList.push({
                        value: rowData.id,
                        label: rowData.name
                    });
                }
            });
    }
    // Form Group
    ruleFeedForm() {
        this.RuleForm = this.fb.group({
            Name: [''],
            Description: [''],
            Type: [''],
            LabelName: [''],
            // PrinterName: [''],
            AppUserName: [''],
            IsActive: [true]
        });
    }

    onSubmit(type: string, fromSort?: string, index?: any) {
        let dataArray: any[] = [];
        const ruleObj: any[] = [];
        if (this.RuleForm.valid) {
            let obj = {
                condition: '',
                rules: [],
                valid: true
            };
            let nestedObj = {
                condition: '',
                rules: []
            };
            let rules = {
                id: '',
                field: '',
                type: '',
                input: '',
                operator: '',
                value: ''
            };
            // if (fromSort === 'sort') {
            //     this.sortingDone(index);
            // }
            // if (this.policyId) {
            //     for (const [
            //         j,
            //         pchildData
            //     ] of this.nestedParameterDataElement.entries()) {
            //         pchildData.editing = true;
            //     }
            // } else {
            //     for (const [
            //         i,
            //         pData
            //     ] of this.nestedParameterDataElement.entries()) {
            //         pData.addNewRecord = true;
            //     }
            // }

            for (const [i, pData] of this.parameterData.entries()) {
                for (const [j, rowData] of pData.rules.entries()) {
                    rules = {
                        id: '',
                        field: '',
                        type: '',
                        input: '',
                        operator: '',
                        value: '',
                    };
                    if (rowData.AndOr !== '') {
                        obj.condition = this.parameterData[0].rules[0].AndOr;
                    }else{
                        obj.condition = 'AND';
                        obj.valid = true;
                    }
                    rules.id = rowData.field;
                    rules.field = rowData.field;
                    rules.type = 'string';
                    rules.input = 'text';
                    rules.operator = rowData.operator;
                    rules.value = rowData.value;
                    if (i === 0) {
                        obj.rules.push(rules);
                    } else {
                        nestedObj = {
                            condition: '',
                            rules: []
                        };
                        if (j === 0) {
                            nestedObj.condition =
                                this.parameterData[i].rules[0].AndOr ===
                                undefined
                                    ? ''
                                    : this.parameterData[i].rules[0].AndOr;
                            nestedObj.rules.push(rules);
                            obj.rules.push(nestedObj);
                        } else {
                            //  nestedObj.condition =
                            //      this.parameterData[i].rules[0].AndOr === undefined
                            //          ? ''
                            //          : this.parameterData[i].rules[0].AndOr;
                            nestedObj.rules.push(rules);
                            obj.rules[obj.rules.length - 1].rules.push(
                                nestedObj.rules[0]
                            );
                        }
                    }
                } 

                // pData.description = this.policyDetailDes;
                // pData.iuId = Number(this.iuId);
                // pData.locatorDimensionCheck =
                //     this.locDimensionCheck === true ? 'Y' : 'N';
                // pData.locatorUnitCheck = this.locUnitCheck === true ? 'Y' : 'N';
                // pData.locatorVolumeCheck = this.locVolumeCheck === true ? 'Y' : 'N';
                // pData.locatorWeightCheck = this.locWeightCheck === true ? 'Y' : 'N';
                // pData.partialPutaway = this.partialPutaway === true ? 'Y' : 'N';
                // pData.allocateLpnOnly = this.allocateLpnOnly === true ? 'Y' : 'N';
                // pData.allocateLpnAndLoose =
                //     this.allocateLpnAndLoose === true ? 'Y' : 'N';
                // pData.allocateLooseOnly =
                //     this.allocateLooseOnly === true ? 'Y' : 'N';

                // pData.policyName = this.policyName;
                // pData.policyId = this.policyId;
                // pData.createdBy = JSON.parse(
                //     localStorage.getItem('userDetails')
                // ).userId;
                // pData.updatedBy = JSON.parse(
                //     localStorage.getItem('userDetails')
                // ).userId;

                //     if (type === 'save') {
                //         if (
                //             this.iuId &&
                //             this.policyName &&
                //             this.policyDetailDes &&
                //             pData.priorityName
                //         ) {
                //             if (pData.addNewRecord === true && pData.rules.length) {
                //                 for (const [
                //                     ruleIndex,
                //                     pchildData
                //                 ] of pData.rules.entries()) {
                //                     const isRuleValidate = this.ruleValidate(
                //                         ruleIndex,
                //                         pchildData
                //                     );
                //                     if (isRuleValidate) {
                //                         pchildData.prioritySequenceId = String(i + 1);
                //                         pchildData.priorityName = pData.priorityName;
                //                         pchildData.policyId = this.policyId
                //                             ? Number(pchildData.policyId)
                //                             : null;
                //                         pchildData.priorityId = pchildData.priorityId
                //                             ? Number(pchildData.priorityId)
                //                             : null;
                //                         pchildData.ruleSequenceId = pchildData.ruleSequenceId
                //                             ? Number(pchildData.ruleSequenceId)
                //                             : null;
                //                         pchildData.prioritySequenceId = pchildData.prioritySequenceId
                //                             ? Number(pchildData.prioritySequenceId)
                //                             : null;
                //                         pchildData.policyType = this.policyType;

                //                         if (pData.rules[0].sort) {
                //                             for (const pchildSortData of pData.rules[0]
                //                                 .sort) {
                //                                 pchildSortData.policyId = this.policyId;
                //                                 pchildSortData.priorityId =
                //                                     pchildData.priorityId;
                //                                 pchildSortData.algorithmId = pchildSortData.algorithmId
                //                                     ? Number(pchildSortData.algorithmId)
                //                                     : null;
                //                                 pchildSortData.priorityId = pchildSortData.priorityId
                //                                     ? Number(pchildSortData.priorityId)
                //                                     : null;
                //                                 pchildSortData.sequenceId = pchildSortData.sequenceId
                //                                     ? Number(pchildSortData.sequenceId)
                //                                     : null;
                //                                 pchildSortData.sortId = pchildSortData.sortId
                //                                     ? Number(pchildSortData.sortId)
                //                                     : null;
                //                                 pchildSortData.policyType = this.policyType;
                //                             }
                //                         }
                //                         ruleObj.push(pchildData);
                //                     } else {
                //                         this.openSnackBar(
                //                             'Please fill required fields in row ' +
                //                                 (ruleIndex + 1),
                //                             '',
                //                             'default-snackbar'
                //                         );
                //                         return;
                //                     }
                //                 }
                //             } else {
                //                 this.openSnackBar(
                //                     'Please add one priority with rules.',
                //                     '',
                //                     'default-snackbar'
                //                 );
                //                 return;
                //             }
                //         } else {
                //             let validationMsg = '';
                //             if (
                //                 !this.iuId &&
                //                 !this.policyName &&
                //                 !this.policyDetailDes &&
                //                 !pData.priorityName
                //             ) {
                //                 validationMsg =
                //                     'Please enter inventory unit, policy name, Description, priority name';
                //             } else {
                //                 !this.iuId
                //                     ? (validationMsg = ' Please Select inventory unit')
                //                     : !this.policyName
                //                     ? (validationMsg = 'Please enter policy name')
                //                     : !this.policyDetailDes
                //                     ? (validationMsg = 'Please enter description')
                //                     : (validationMsg = 'Please enter priority name');
                //             }
                //             this.openSnackBar(validationMsg, '', 'default-snackbar');
                //             return;
                //         }
                //     } else {
                //         if (pData.rules.length === 0) {
                //             this.openSnackBar(
                //                 'Please add priority with rules.',
                //                 '',
                //                 'default-snackbar'
                //             );
                //             return;
                //         }
                //         for (const [j, pchildData] of pData.rules.entries()) {
                //             if (
                //                 this.iuId &&
                //                 this.policyName &&
                //                 this.policyDetailDes &&
                //                 pData.priorityName
                //             ) {
                //                 if (pchildData.editing === true && pData.rules.length) {
                //                     const isRuleValidate = this.ruleValidate(
                //                         j,
                //                         pchildData
                //                     );
                //                     if (isRuleValidate) {
                //                         pchildData.prioritySequenceId = String(i + 1);
                //                         pchildData.priorityName = pData.priorityName;
                //                         pchildData.policyId = this.policyId;
                //                         pchildData.priorityId = pchildData.priorityId
                //                             ? Number(pchildData.priorityId)
                //                             : null;
                //                         pchildData.ruleId = pchildData.ruleId
                //                             ? Number(pchildData.ruleId)
                //                             : null;
                //                         pchildData.ruleSequenceId = pchildData.ruleSequenceId
                //                             ? Number(pchildData.ruleSequenceId)
                //                             : null;

                //                         pchildData.prioritySequenceId = pchildData.prioritySequenceId
                //                             ? Number(pchildData.prioritySequenceId)
                //                             : null;
                //                         pchildData.policyType = this.policyType;

                //                         if (pData.sort) {
                //                             for (const pchildSortData of pData.sort) {
                //                                 pchildSortData.policyId = this.policyId;
                //                                 pchildSortData.priorityId =
                //                                     pchildData.priorityId;
                //                                 pchildSortData.policyId = pchildSortData.policyId
                //                                     ? Number(pchildSortData.policyId)
                //                                     : null;
                //                                 pchildSortData.algorithmId = pchildSortData.algorithmId
                //                                     ? Number(pchildSortData.algorithmId)
                //                                     : null;
                //                                 pchildSortData.priorityId = pchildSortData.priorityId
                //                                     ? Number(pchildSortData.priorityId)
                //                                     : null;
                //                                 pchildSortData.sequenceId = pchildSortData.sequenceId
                //                                     ? Number(pchildSortData.sequenceId)
                //                                     : null;
                //                                 pchildSortData.sortId = pchildSortData.sortId
                //                                     ? Number(pchildSortData.sortId)
                //                                     : null;
                //                                 pchildSortData.policyType = this.policyType;
                //                             }
                //                         }
                //                         ruleObj.push(pchildData);
                //                     } else {
                //                         this.openSnackBar(
                //                             'Please fill required fields in row ' +
                //                                 (j + 1),
                //                             '',
                //                             'default-snackbar'
                //                         );
                //                         return;
                //                     }
                //                 }
                //             } else {
                //                 let validationMsg = '';
                //                 if (
                //                     !this.iuId &&
                //                     !this.policyName &&
                //                     !this.policyDetailDes &&
                //                     !pData.priorityName
                //                 ) {
                //                     validationMsg =
                //                         'Please enter inventory unit, policy name, Description, priority name';
                //                 } else {
                //                     !this.iuId
                //                         ? (validationMsg =
                //                               ' Please Select inventory unit')
                //                         : !this.policyName
                //                         ? (validationMsg = 'Please enter policy name')
                //                         : !this.policyDetailDes
                //                         ? (validationMsg = 'Please enter description')
                //                         : (validationMsg =
                //                               'Please enter priority name');
                //                 }
                //                 this.openSnackBar(
                //                     validationMsg,
                //                     '',
                //                     'default-snackbar'
                //                 );
                //                 return;
                //             }
                //         }
                //     }
                // }

                // if (
                //     this.parameterData.length &&
                //     this.nestedParameterDataElement.length
                // ) {
                //     dataArray = this.parameterData;
                //     if (type === 'save') {
                //         // console.log(dataArray[index]);
                //         dataArray[0].rules = ruleObj;
                //         this.addPutawayPolicy(dataArray[0]);
                //     } else {
                //         // console.log('parameterData: '+JSON.stringify(dataArray));
                //         dataArray[this.selectedRowIndex].rules = ruleObj;
                //         this.updatePutawayPolicy(dataArray[this.selectedRowIndex]);
                //     }
                // } else {
                //     let validationMsg = '';
                //     if (!this.iuId && !this.policyName && !this.policyDetailDes) {
                //         validationMsg =
                //             'Please enter inventory unit, policy name, Description';
                //     } else {
                //         !this.iuId
                //             ? (validationMsg = ' Please Select inventory unit')
                //             : !this.policyName
                //             ? (validationMsg = 'Please enter policy name')
                //             : !this.policyDetailDes
                //             ? (validationMsg = 'Please enter description')
                //             : (validationMsg = 'Please add one priority with rules.');
                //     }
                //     this.openSnackBar(validationMsg, '', 'default-snackbar');
                //     return;
                // }
            }
            this.RuleForm.value.IsActive === true
                ? (this.RuleForm.value.IsActive = 1)
                : (this.RuleForm.value.IsActive = 0);
            this.RuleForm.value.IsActive === true
                ? (this.RuleForm.value.active = 'Yes')
                : (this.RuleForm.value.active = 'No');
            this.ruleService
                .createRule(
                    JSON.stringify(obj),
                    this.RuleForm.value,
                    this.ruleId
                )
                .subscribe(
                    result => {
                         ;
                        //   if (result.status === 200) {
                        //       this.isAdd = false;
                        //       this.fromUpdateCall();
                        //       this.openSnackBar(result.message, '', 'success-snackbar');
                        //       this.cancelAdd();
                        //   } else {
                        //       this.isAdd = true;
                        //       this.openSnackBar(result.message, '', 'error-snackbar');
                        //   }
                    },
                    (error: any) => {
                         ;
                        if (error.status === 200) {
                            // this.isAdd = true;
                            this.isEdit = false;
                            this.openSnackBar(
                                error.error.text,
                                '',
                                'success-snackbar'
                            );
                            this.router.navigate(['rule']);
                        } else {
                            this.openSnackBar(
                                error.error,
                                '',
                                'error-snackbar'
                            );
                        }
                    }
                );
        } else {
            this.ruleLogValidationErrors();
            this.RuleForm.markAllAsTouched();
            this.openSnackBar(
                'Please check mandatory fields',
                '',
                'default-snackbar'
            );
        }
    }
    beginRuleEdit(rowData: any, $event: any) {
         
        if (rowData.editing === false) {
            rowData.editing = true;
            this.isAdd = false;
            this.isEdit = true;
        } else {
        }
    }
    //  Get Value Type
    getAndOrLIst() {
        this.andOrList = [
            { label: ' Please Select', value: '' },
            { label: 'AND', value: 'AND' },
            { label: 'OR', value: 'OR' }
        ];
    }

    // Get Operator List
    getOperatorLOV() {
        this.operatorList = [];
        this.commonService
            .getLookupLOV('RULE_OPERATOR')
            .subscribe((data: any) => {
                for (const rowData of data.result) {
                    this.operatorList.push({
                        value: rowData.lookupValue,
                        label: rowData.lookupValueDesc
                    });
                }
            });
    }

    // Get
    getFilterLOV() {
        this.filterList = [
            { label: '$User', value: '$User' },
            { label: '$LabelType', value: '$LabelType' }
        ];
        let tempArr = [];
        let labelArr = [];
        this.manualPrintService.getLabel().subscribe((data: any) => {
            for (const rowData of data) {
                tempArr.push(rowData.fields.split(','));
            }
            for (const rowData of tempArr) {
                for (const data of rowData) {
                    labelArr.push(data);
                }
            }

            for (const labelData of labelArr) {
                if (!this.filterList.includes(labelData)) {
                    this.filterList.push({
                        value: labelData,
                        label: labelData
                    });
                }
            }
        });
    }
    addRow() {
        let validationMsg = '';
        // if (!this.iuId && !this.policyName && !this.policyDetailDes) {
        //     validationMsg =
        //         'Please enter inventory unit, policy name, Description';
        //     this.openSnackBar(validationMsg, '', 'default-snackbar');
        //     return;
        // } else {
        //     if (!this.iuId) {
        //         validationMsg = ' Please Select inventory unit';
        //         this.openSnackBar(validationMsg, '', 'default-snackbar');
        //         return;
        //     } else if (!this.policyName) {
        //         validationMsg = 'Please enter policy name';
        //         this.openSnackBar(validationMsg, '', 'default-snackbar');
        //         return;
        //     } else if (!this.policyDetailDes) {
        //         validationMsg = 'Please enter description';
        //         this.openSnackBar(validationMsg, '', 'default-snackbar');
        //         return;
        //     } else {
        this.paginator.pageIndex = 0;
        for (const pData of this.parameterData) {
            if (pData.editing === true && pData.addNewRecord === undefined) {
                this.openSnackBar(
                    'Please update your records first.',
                    '',
                    'default-snackbar'
                );
                return;
            }
        }
        // if (this.policyId) {
        //     this.isAdd = false;
        //     this.isEdit = true;
        // }
        this.parameterData.push({
            sequenceId: '',
            createdBy: JSON.parse(localStorage.getItem('userDetails')).userId,
            updatedBy: JSON.parse(localStorage.getItem('userDetails')).userId,
            rules: [],
            action: '',
            editing: true,
            addNewRecord: true
        });

        this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
            this.parameterData
        );
        this.parameterDataSource.paginator = this.paginator;
        //     }
        // }
    }

    // Get All Sites By Passing Tranding Partner ID as Request Paramater
    getNestedChildData(
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
            // for(const ele of element.rules){
            //     if(!ele.condition && ele.condition !== ""){
            //         this.nestedParameterDataElement.push(ele);
            //     }
            // }
            this.nestedParameterDataElement = element.rules;
            this.nestedParameterDataSource = new MatTableDataSource<
                NestedParameterDataElement
            >(this.nestedParameterDataElement); 
        }
        setTimeout(() => {
            this.commonService.setTableResize(
                this.matTableRef.nativeElement.clientWidth,
                this.nestedColumns
            );
        }, 500);
        this.selectedRowIndex = rowIndex;
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

        // if (this.policyId) {
        //     for (const [i, pData] of this.parameterData.entries()) {
        //         for (const [j, pchildData] of pData.rules.entries()) {
        //             pchildData.editing = true;
        //         }
        //     }
        //     this.isEdit = true;
        // } else {
        //     for (const [i, pData] of this.parameterData.entries()) {
        //         pData.addNewRecord = true;
        //     }
        //     this.isAdd = true;
        // }

        this.expandedElement = this.parameterData[event.currentIndex];
        this.getNestedChildData(
            this.expandedElement,
            event.currentIndex,
            'addRule'
        );
    }
    addRules(rowData: any, rowIndex: number) {
        if (this.policyId) {
            this.isEdit = true;
        }
        this.expandedElement = this.parameterData[rowIndex];
        rowData.rules.push({
            field: '',
            operator: '',
            value: '',
            AndOr: '',
            // rowSelect: false,
            // sequenceId: '',
            // priorityName: '',
            // priorityId: '',
            // condition: '',
            // entity: '',
            // entityValue: '',
            // entityValueType: '',
            // operator: '',
            // policyId: '',
            // ruleType: '',
            action: '',
            editing: true,
            addNewRecord: true
            // fieldsDisable: false,
            // valueTypeLOV: true,
            // valueTypeLOVChange: false,
            // entityValueField: '',
            // sort: []
            // leftBracket: '',
            // rightBracket: ''
        });
        this.getNestedChildData( rowData, rowIndex, 'addRule');
    }

    deleteRow(
        rowData: any,
        rowIndex: number,
        type: any
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
        }
        // else {
        //     // if (!this.dialog.openDialogs || !this.dialog.openDialogs.length) {
        //     const dialogRef = this.dialog.open(templateRef, {
        //         width: '20%',
        //         data: [
        //             {
        //                 row: rowData,
        //                 index: rowIndex,
        //                 datatype: type
        //             }
        //         ]
        //     });
        //     dialogRef.afterClosed().subscribe(response => {
        //         if (response) {
        //             this.deleteConfirm(response);
        //         }
        //     });
        //     // }
        // }
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

    disableEdit(rowData: any, index: any, type?: any) {
        // if (type === 'sort') {
        //     if (this.sortParameterData[index].editing === true) {
        //         this.sortParameterData[index].editing = false;
        //         if (rowData.addNewRecord) {
        //             this.sortParameterData.splice(index, 1);
        //             this.sortParameterDataSource = new MatTableDataSource<
        //                 SortParameterDataElement
        //             >(this.sortParameterData);
        //             this.checkIsAddRow(this.sortParameterData);
        //         }
        //     }
        //     if (
        //         this.sortParameterData.find(
        //             ({ editing }) => editing === true
        //         ) === undefined &&
        //         this.policyId
        //     ) {
        //         this.isSortingEdit = false;
        //     }
        // } else {
        if (this.nestedParameterDataElement[index].editing === true) {
            this.nestedParameterDataElement[index].editing = false;
            if (rowData.addNewRecord) {
                this.nestedParameterDataElement.splice(index, 1);
                this.nestedParameterDataSource = new MatTableDataSource<
                    NestedParameterDataElement
                >(this.nestedParameterDataElement);
                this.checkIsAddRow(this.nestedParameterDataElement);
            } else {
                //  
                // this.nestedParameterDataElement[
                //     index
                // ].ruleSequenceId = this.nestedParameterDataElement[
                //     index
                // ].originalData.ruleSequenceId;
                // this.nestedParameterDataElement[
                //     index
                // ].ruleType = this.nestedParameterDataElement[
                //     index
                // ].originalData.ruleType;
                // this.nestedParameterDataElement[
                //     index
                // ].entity = this.nestedParameterDataElement[
                //     index
                // ].originalData.entity;
                // this.nestedParameterDataElement[
                //     index
                // ].condition = this.nestedParameterDataElement[
                //     index
                // ].originalData.condition;
                // this.nestedParameterDataElement[
                //     index
                // ].entityValueType = this.nestedParameterDataElement[
                //     index
                // ].originalData.entityValueType;
                // this.nestedParameterDataElement[
                //     index
                // ].entityValue = this.nestedParameterDataElement[
                //     index
                // ].originalData.entityValue;
                // this.nestedParameterDataElement[
                //     index
                // ].operator = this.nestedParameterDataElement[
                //     index
                // ].originalData.operator;
            }
        }
        if (
            this.nestedParameterDataElement.find(
                ({ editing }) => editing === true
            ) === undefined &&
            !this.policyId
        ) {
            this.isEdit = false;
        }
        // }
    }

    ruleLogValidationErrors(group: FormGroup = this.RuleForm): void {
        Object.keys(group.controls).forEach((key: string) => {
            const abstractControl = group.get(key);
            if (abstractControl instanceof FormGroup) {
                this.ruleLogValidationErrors(abstractControl);
            } else {
                this.ruleFormErrors[key] = '';
                if (
                    abstractControl &&
                    !abstractControl.valid &&
                    (abstractControl.touched || abstractControl.dirty)
                ) {
                    const messages = this.validationMessages[key];
                    for (const errorKey in abstractControl.errors) {
                        if (errorKey) {
                            this.ruleFormErrors[key] +=
                                messages[errorKey] + ' ';
                        }
                    }
                }
            }
        });
    }

    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
            panelClass: [typeClass]
        });
    }
}
