import {
    Component,
    OnInit,
    ViewChild,
    Renderer2,
    ElementRef,
    HostListener,
    Inject,
    Optional,
    AfterViewInit
} from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray , FormControl} from '@angular/forms';
import { CommonService } from 'src/app/_services/common/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
    MatTableDataSource,
    MatSnackBar,
    MatPaginator,
    TooltipPosition,
    MatDialogRef,
    MatDialog,
    MatTable,
    MatSort,
    MAT_DIALOG_DATA
} from '@angular/material';
import { MaterialStatusSetupService } from 'src/app/_services/transactions/material-status-setup.service';
import { setTimeout } from 'timers';



@Component({
    selector: 'app-material-status-setup-add',
    templateUrl: './material-status-setup-add.component.html',
    styleUrls: ['./material-status-setup-add.component.css']
})
export class MaterialStatusSetupAddComponent implements OnInit {
    formTitle: string;
    MaterialSetupForm: FormGroup;
    selectedTransactionType: any[];
    isEdit = false;
    materialSetupId: number;
    transactionTypeArray: any = [];
    onBoundTempArr: any = [];
    inBoundTempArr: any = [];
    warehouseTempArr: any = [];
    
    onBoundAllCheck: boolean = false;
    onBoundCheck: boolean = false;

    inBoundAllCheck: boolean = false;
    inBoundCheck: boolean = false;

    wareHouseAllCheck: boolean = false;
    wareHouseCheck: boolean = false;
    

    validationMessages = {
        materialStatusName: {
            required: 'Name is required.'
        }
    };
    
    formErrors = {
        materialStatusName: '',
    };
    
    tooltipPosition: TooltipPosition[] = ['below'];
    listProgress = false;
    screenMaxHeight:any;
    @ViewChild(MatTable, {read: ElementRef, static: false} ) matTableRef: ElementRef;
    columns: any =  [
        {field: 'outbond', name: 'Outbond', width: 75, baseWidth: 30 },
        {field: 'inbound', name: 'Inbound', width: 75, baseWidth: 30 },
        {field: 'warehouse', name: 'Warehouse', width: 75, baseWidth: 40 }
    ];

    constructor(
        private formBuilder: FormBuilder,
        public router: Router,
        private snackBar: MatSnackBar,
        private render: Renderer2,
        public commonService: CommonService,
        private materialStatusSetupService: MaterialStatusSetupService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.materialStatusFeedForm();
        this.getTransactionType();
        
    }

    // Get transaction Type
    getTransactionType() {
        this.transactionTypeArray = [];
        this.listProgress = true;
        this.commonService.getLookupLOV('TXN_TYPE_CODE').subscribe(
            (result: any) => {
                if (result.status === 200) {
                    if (result.result) {
                        this.listProgress = false;
                        const data = result.result;
                        for (const txnType of data) {
                            this.transactionTypeArray.push({
                                description: txnType.lookupValueDesc,
                                name: txnType.lookupValue,
                                enableFlag: false,
                                txnId : null,
                                parentValue : txnType.parentValue
                            });
                        }
                        console.log(this.transactionTypeArray);
                        this.route.params.subscribe(params => {
                            if (params.id) {
                                this.formTitle = 'Edit Material Status Setup :';
                                this.isEdit = true;
                                this.materialSetupId = params.id;
                                this.materialStatusSetupService.getMaterialStatusSetupById(params.id).subscribe((matSetupData: any) => {
                                    this.MaterialSetupForm.patchValue({
                                        materialStatusName: matSetupData.result[0].materialStatusName,
                                        description: matSetupData.result[0].description,
                                        enabledFlag: (matSetupData.result[0].enabledFlag == 'N') ? false : true,                                        
                                        lgEnabled: (matSetupData.result[0].allowReservations == 'N') ? false : true,
                                        locEnabled: (matSetupData.result[0].locEnabled == 'N') ? false : true,
                                        batchEnabled: (matSetupData.result[0].batchEnabled == 'N') ? false : true,
                                        serialEnabled: (matSetupData.result[0].serialEnabled == 'N') ? false : true,
                                        lpnEnabled: (matSetupData.result[0].lpnEnabled == 'N') ? false : true,
                                        allowReservations: (matSetupData.result[0].allowReservations == 'N') ? false : true 
                                    });
                                    for (const [i,matsetupItem] of matSetupData.result[0].MS_Txn_type_Details.entries()) {
                                        for (const [j, txnTypeItem] of this.transactionTypeArray.entries()) {
                                            if(txnTypeItem.name === matsetupItem.materialTxnType){
                                                this.transactionTypeArray[j].enableFlag = (matsetupItem.enabledFlag === 'N') ? false : true;
                                            }
                                        }
                                        this.transactionTypeArray[i].materialStatusTxnTypeId = matsetupItem.materialStatusTxnTypeId;
                                    }
                                    console.log(this.transactionTypeArray);
                                    this.checkAllOnLoad();
                                });
                                
                                
                                
                            } else {
                                this.formTitle = 'Material Status Setup :';
                            }
                        });
                    }
                }else{
                    this.listProgress = false;
                }
            },
            (error: any) => {
                console.log(error.error.message);
            }
        );
    }
    
    checkAllOnLoad(){
        for (const [i, txnType] of this.transactionTypeArray.entries()) {
            if(txnType.parentValue === 'Inbound'){
                this.inBoundTempArr.push(this.transactionTypeArray[i]);
            }
            if(txnType.parentValue === 'Outbound'){
                this.onBoundTempArr.push(this.transactionTypeArray[i]);
            }
            if(txnType.parentValue === 'Warehouse'){
                this.warehouseTempArr.push(this.transactionTypeArray[i]);
            }
        }
        let allInBoundChecked = this.inBoundTempArr.every(function(element){
            return element.enableFlag === true;
        });
        if(allInBoundChecked){
            this.inBoundAllCheck = true;
        }else{
            this.inBoundCheck = true;
        }
        let allOnBoundChecked = this.onBoundTempArr.every(function(element){
            return element.enableFlag === true;
        });
        if(allOnBoundChecked){
            this.onBoundAllCheck = true;
        }else{
            this.onBoundCheck = true;
        }
        let allWarehouseChecked = this.warehouseTempArr.every(function(element){
            return element.enableFlag === true;
        });
        if(allWarehouseChecked){
            this.wareHouseAllCheck = true;
        }else{
            this.wareHouseCheck = true;
        }
    }

    txnTypeChange(event, element, type) {
        this.inBoundTempArr = [];
        this.onBoundTempArr = [];
        this.warehouseTempArr = [];
        if (event.checked) {
            if(type === 'Inbound'){
                this.inBoundCheck = true;
            }
            if(type === 'Outbound'){
                this.onBoundCheck = true;
            }
            if(type === 'Warehouse'){
                this.wareHouseCheck = true;
            }
           
            for (const [i, txnType] of this.transactionTypeArray.entries()) {
                if(txnType.parentValue === type){
                    if(type === 'Inbound'){
                        this.inBoundTempArr.push(this.transactionTypeArray[i]);
                    }
                    if(type === 'Outbound'){
                        this.onBoundTempArr.push(this.transactionTypeArray[i]);
                    }
                    if(type === 'Warehouse'){
                        this.warehouseTempArr.push(this.transactionTypeArray[i]);
                    }
                    
                }
                
            }
            
            if(type === 'Inbound'){
                let allChecked = this.inBoundTempArr.every(function(element){
                    return element.enableFlag === true;
                });
                if(allChecked){
                    this.inBoundCheck = false;
                    this.inBoundAllCheck = true;
                }
            }
            if(type === 'Outbound'){
                let allChecked = this.onBoundTempArr.every(function(element){
                    return element.enableFlag === true;
                });
                if(allChecked){
                    this.onBoundCheck = false;
                    this.onBoundAllCheck = true;
                }
            }
            if(type === 'Warehouse'){
                let allChecked = this.warehouseTempArr.every(function(element){
                    return element.enableFlag === true;
                });
                if(allChecked){
                    this.wareHouseCheck = false;
                    this.wareHouseAllCheck = true;
                }
            }
        }else{
            for (const [i, txnType] of this.transactionTypeArray.entries()) {
                if(txnType.parentValue === type){
                    if(type === 'Inbound'){
                        this.inBoundTempArr.push(this.transactionTypeArray[i]);
                    }
                    if(type === 'Outbound'){
                        this.onBoundTempArr.push(this.transactionTypeArray[i]);
                    }
                    if(type === 'Warehouse'){
                        this.warehouseTempArr.push(this.transactionTypeArray[i]);
                    }
                    
                }
            }
            if(type === 'Inbound'){
                this.inBoundAllCheck = false;
                this.inBoundCheck = true;
                let allChecked = this.inBoundTempArr.every(function(element){
                    return element.enableFlag === false;
                });
                if(allChecked){
                    this.inBoundCheck = false;
                    this.inBoundAllCheck = false;
                }
            }
            if(type === 'Outbound'){
                this.onBoundAllCheck = false;
                this.onBoundCheck = true;
                let allChecked = this.onBoundTempArr.every(function(element){
                    return element.enableFlag === false;
                });
                if(allChecked){
                    this.onBoundCheck = false;
                    this.onBoundAllCheck = false;
                }
            }
            if(type === 'Warehouse'){
                this.wareHouseAllCheck = false;
                this.wareHouseCheck = true;
                let allChecked = this.warehouseTempArr.every(function(element){
                    return element.enableFlag === false;
                });
                if(allChecked){
                    this.wareHouseCheck = false;
                    this.wareHouseAllCheck = false;
                }
            }
            
        }
    }


    setAll(completed: boolean,type) {
        if (completed) {
            if(type === 'Inbound'){
                this.inBoundAllCheck = true;
            }
            if(type === 'Outbound'){
                this.onBoundAllCheck = true;
            }
            if(type === 'Warehouse'){
                this.wareHouseAllCheck = true;
            }
            for (const [i, txnType] of this.transactionTypeArray.entries()) {
                if(txnType.parentValue === type){
                    this.transactionTypeArray[i].enableFlag = true;
                }
            }
        } else{
            if(type === 'Inbound'){
                this.inBoundAllCheck = false;
            }
            if(type === 'Outbound'){
                this.onBoundAllCheck = false;
            }
            if(type === 'Warehouse'){
                this.wareHouseAllCheck = false;
            }
            for (const [i, txnType] of this.transactionTypeArray.entries()) {
                if(txnType.parentValue === type){
                    this.transactionTypeArray[i].enableFlag = false;
                }
            }
        }
    }

    // Form Group
    materialStatusFeedForm() {
        this.MaterialSetupForm = this.formBuilder.group({
            materialStatusName: ['', Validators.required],
            description: [''],
            enabledFlag: [true],
            lgEnabled: [false],
            locEnabled: [false],
            batchEnabled: [false],
            serialEnabled: [false],
            lpnEnabled: [false],
            allowReservations: [false]
        });
    }
    logValidationErrors(group: FormGroup = this.MaterialSetupForm): void {
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

    onSubmit(event: any, formId: any) {
        if (event) {
            event.stopImmediatePropagation();
            if(!this.isEdit){
                if (this.MaterialSetupForm.valid) {
                     this.MaterialSetupForm.value.createdBy = JSON.parse(
                        localStorage.getItem('userDetails')
                    ).userId;

                    if (this.MaterialSetupForm.value.allowReservations === false) {
                    this.MaterialSetupForm.value.allowReservations = 'N';
                    } else {
                    this.MaterialSetupForm.value.allowReservations = 'Y';
                    }

                    if (this.MaterialSetupForm.value.enabledFlag === false) {
                    this.MaterialSetupForm.value.enabledFlag = 'N';
                    } else {
                    this.MaterialSetupForm.value.enabledFlag = 'Y';
                    }

                    if (this.MaterialSetupForm.value.lgEnabled === false) {
                    this.MaterialSetupForm.value.lgEnabled = 'N';
                    } else {
                    this.MaterialSetupForm.value.lgEnabled = 'Y';
                    }

                    if (this.MaterialSetupForm.value.locEnabled === false) {
                    this.MaterialSetupForm.value.locEnabled = 'N';
                    } else {
                    this.MaterialSetupForm.value.locEnabled = 'Y';
                    }

                    if (this.MaterialSetupForm.value.batchEnabled === false) {
                    this.MaterialSetupForm.value.batchEnabled = 'N';
                    } else {
                    this.MaterialSetupForm.value.batchEnabled = 'Y';
                    }

                    if (this.MaterialSetupForm.value.serialEnabled === false) {
                    this.MaterialSetupForm.value.serialEnabled = 'N';
                    } else {
                    this.MaterialSetupForm.value.serialEnabled = 'Y';
                    }

                    if (this.MaterialSetupForm.value.lpnEnabled === false) {
                    this.MaterialSetupForm.value.lpnEnabled = 'N';
                    } else {
                    this.MaterialSetupForm.value.lpnEnabled = 'Y';
                    }

                    const data = this.getMaterialStatusSetupForAdd(this.MaterialSetupForm.value);
                    if (data === 'validateError') {
                        return;
                    }else{
                        this.materialStatusSetupService.createMaterialStatusSetup(data).subscribe(
                        (resultData: any) => {
                            if (resultData.status === 200) {
                                this.openSnackBar(resultData.message, '', 'success-snackbar');
                                this.router.navigate(['materialstatussetup']);
                            } else {
                                this.openSnackBar(
                                    resultData.message,
                                    '',
                                    'error-snackbar'
                                );
                            }
                        },
                        error => {
                            this.openSnackBar(
                                error.error.message,
                                '',
                                'error-snackbar'
                            );
                        }
                    );

                    }
                } else {
                this.openSnackBar('Please enter all required fields', '', 'default-snackbar');
                this.logValidationErrors();
                console.log(this.formErrors);
            }
            console.log(this.transactionTypeArray)
            }else{
                if (this.MaterialSetupForm.valid) {
                    this.MaterialSetupForm.value.createdBy = JSON.parse(
                        localStorage.getItem('userDetails')
                    ).userId;

                    if (this.MaterialSetupForm.value.allowReservations === false) {
                    this.MaterialSetupForm.value.allowReservations = 'N';
                    } else {
                    this.MaterialSetupForm.value.allowReservations = 'Y';
                    }

                    if (this.MaterialSetupForm.value.enabledFlag === false) {
                    this.MaterialSetupForm.value.enabledFlag = 'N';
                    } else {
                    this.MaterialSetupForm.value.enabledFlag = 'Y';
                    }

                    if (this.MaterialSetupForm.value.lgEnabled === false) {
                    this.MaterialSetupForm.value.lgEnabled = 'N';
                    } else {
                    this.MaterialSetupForm.value.lgEnabled = 'Y';
                    }

                    if (this.MaterialSetupForm.value.locEnabled === false) {
                    this.MaterialSetupForm.value.locEnabled = 'N';
                    } else {
                    this.MaterialSetupForm.value.locEnabled = 'Y';
                    }

                    if (this.MaterialSetupForm.value.batchEnabled === false) {
                    this.MaterialSetupForm.value.batchEnabled = 'N';
                    } else {
                    this.MaterialSetupForm.value.batchEnabled = 'Y';
                    }

                    if (this.MaterialSetupForm.value.serialEnabled === false) {
                    this.MaterialSetupForm.value.serialEnabled = 'N';
                    } else {
                    this.MaterialSetupForm.value.serialEnabled = 'Y';
                    }

                    if (this.MaterialSetupForm.value.lpnEnabled === false) {
                    this.MaterialSetupForm.value.lpnEnabled = 'N';
                    } else {
                    this.MaterialSetupForm.value.lpnEnabled = 'Y';
                    }

                    const data = this.getMaterialStatusSetupForAdd(this.MaterialSetupForm.value);
                    if (data === 'validateError') {
                        return;
                    }else{
                        this.materialStatusSetupService.updateMaterialStatusSetup(data,this.materialSetupId).subscribe(
                        (resultData: any) => {
                            if (resultData.status === 200) {
                                let msg = resultData.message.split('-')[0];
                                this.openSnackBar(msg, '', 'success-snackbar');
                                this.router.navigate(['materialstatussetup']);
                            } else {
                                this.openSnackBar(
                                    resultData.message,
                                    '',
                                    'error-snackbar'
                                );
                            }
                        },
                        error => {
                            this.openSnackBar(
                                error.error.message,
                                '',
                                'error-snackbar'
                            );
                        }
                    );

                    }
                }else {
                this.openSnackBar('Please enter all required fields', '', 'default-snackbar');
                this.logValidationErrors();
                console.log(this.formErrors);
            }
            }
        }
    }

    getMaterialStatusSetupForAdd(data) {
        let tempObject = {};
        const materialTxnArray = [];
        let haveTxnTypeEnableFlag = false;
        
        if (this.transactionTypeArray.length) {
            for( const [i, data] of this.transactionTypeArray.entries()){
                if (data.enableFlag === true) {
                    haveTxnTypeEnableFlag = true;
                    break;
                }
            }
            if(haveTxnTypeEnableFlag == false){
                    this.openSnackBar('Please select atleast one transaction Type' ,'','default-snackbar');
                    return 'validateError'
            }

            for (const [i, txnData] of this.transactionTypeArray.entries()) {
                if(this.isEdit){
                    txnData.materialStatusId = Number(this.materialSetupId);
                    
                }
                txnData.materialTxnType = txnData.name;
                txnData.enabledFlag = (txnData.enableFlag === true) ? 'Y' : 'N';
                txnData.createdBy = JSON.parse(
                    localStorage.getItem('userDetails')
                ).userId;
                materialTxnArray.push(txnData);
                tempObject = {};
            }
            if(!this.isEdit){
                data.addMaterialTxnTypes = materialTxnArray;
            }else{
                data.materialStatusId = Number(this.materialSetupId);
                data.updateMaterialTxnTypes = materialTxnArray;
            }
            return data;
        } else {
            if(!this.isEdit){
                data.addMaterialTxnTypes = materialTxnArray;
            }else{
                data.updateMaterialTxnTypes = materialTxnArray;
            }
            return data;
        }
    }
    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
            duration: 3500,
            panelClass: [typeClass]
        });
    }

    
}
