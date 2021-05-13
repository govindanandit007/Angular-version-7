import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatStepper } from '@angular/material';
import { TradingPartnersComponent } from '../trading-partners.component';
import { TradingPartnerService } from '../../../_services/masters/trading-partner.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-trading-partner',
  templateUrl: './add-trading-partner.component.html',
  styleUrls: ['./add-trading-partner.component.css']
})
export class AddTradingPartnerComponent implements OnInit {
  tradingPartnerForm: FormGroup;
  tradingPartnerSiteForm: FormGroup;
  countryList: any[] = [];
  cityFilterList: any[] = [];
  stateFilterList: any[] = [];
  formTitle: string;
  isEdit = false;
  tpSiteIsEdit = false;
  tpId: number;
  tpSiteId: number;
  showTPName: string;
  showTPSiteName: string;
  tpCodeDisabled = false;
  is3plCompany = false;
  buttonLabel = '';

  @ViewChild('stepper', { static: true }) stepper: MatStepper;
  // @ViewChild('stepper') stepper: MatStepper;
  // Trading Partner Types
  TradingPartnerTypes: [];
  TradingPartnerName: any = []
  EnabledTradingPartnerName: any = []
  // Trading Partner Site Types
  TradingPartnerSiteTypes: [];
  tpTypeforTab : string
  validationMessages = {
    tpType: {
      required: 'Trading Partner Type is required.'
    },
    tpName: {
      required: 'Trading Partner Name is required.'
    },
    tpCode: {
      required: 'Trading Partner Code is required.'
    },
    tpDescription: {
      required: 'Trading Partner Description is required.'
    },
    tpAddress1: {
      required: 'Address 1 is required.'
    },
    tpCountry: {
      required: 'Country is required.'
    },
    tpStateCounty: {
      required: 'State/County is required.'
    },
    tpCity: {
      required: 'City is required.'
    },
    tpPincode: {
      required: 'Postal Code is required.',
      pattern: 'Please Enter Numeric value.',
      maxlength: 'Maximum 10 character allowed'
    },
    tpPhone: {
      required: 'Phone Number is required.',
      pattern: 'Please Enter Numeric value.',
      maxlength: 'Maximum 15 character allowed'
    },
    // tpPersonName: {
    //   required: 'Person Name is required.'
    // },
    // tpPersonPhoneNum: {
    //   // required: 'Phone Number is required.',
    //   pattern: 'Please Enter Numeric value.',
    //   maxlength: 'Maximum 15 character allowed'
    // },
    tpPersonEmail: {
      // required: 'Email is required.',
      pattern: 'Please enter a valid email address'
    },
    tpSiteCode: {
      required: 'Trading Partner Site Code is required.'
    },
    tpSiteName: {
      required: 'Trading Partner Site Name is required.'
    },
    tpId: {
      required: 'Trading Partner Code is required.'
    },
    tpSiteDescription: {
      required: 'Trading Partner Site Description is required.'
    },
    tpSiteAddress1: {
      required: 'Address 1 is required.'
    },
    tpSiteCountry: {
      required: 'Country is required.'
    },
    tpSiteStateCounty: {
      required: 'State/County is required.'
    },
    tpSiteCity: {
      required: 'City is required.'
    },
    tpSitePincode: {
      required: 'Postal Code is required.',
      pattern: 'Please Enter Numeric value.',
      maxlength: 'Maximum 10 character allowed'
    },
    tpSitePhone: {
      required: 'Phone Number is required.',
      pattern: 'Please Enter Numeric value.',
      maxlength: 'Maximum 15 character allowed'
    },
    // tpSitePersonName: {
    //   required: 'Person Name is required.'
    // },
    // tpSitePersonPhoneNum: {
    //   // required: 'Phone Number is required.',
    //   pattern: 'Please Enter Numeric value.',
    //   maxlength: 'Maximum 15 character allowed'
    // },
    tpSitePersonEmail: {
      // required: 'Email is required.',
      pattern: 'Please enter a valid email address'
    },
  };

  tpFormErrors = {
    tpType: '',
    tpName: '',
    tpCode: '',
    tpDescription: '',
    tpAddress1: '',
    tpCountry: '',
    tpStateCounty: '',
    tpCity: '',
    tpPincode: '',
    tpPhone: '',
    // tpPersonName: '',
    // tpPersonPhoneNum: '',
    tpPersonEmail: '',
    tpSiteCode: '',
    tpSiteName: '',
    tpId: '',
    tpSiteDescription: '',
    tpSiteAddress1: '',
    tpSiteCountry: '',
    tpSiteStateCounty: '',
    tpSiteCity: '',
    tpSitePincode: '',
    tpSitePhone: '',
    // tpSitePersonName: '',
    // tpSitePersonPhoneNum: '',
    tpSitePersonEmail: '',
  };
  saveInprogress: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private tradingPartnerService: TradingPartnerService,
    private trandingPartnerComponent: TradingPartnersComponent,
    public commonService: CommonService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar

  ) { }

  ngOnInit() {
    this.tradingPartnerFeedForm();
    this.tradingPartnerSiteFeedForm();
    this.is3plCompany = JSON.parse(localStorage.getItem('userDetails')).activityBillingFlag === 'Y' ? true : false;
    this.getTradingPartnerTypes();
    this.getCountryList();
    this.getTradingPartnerName();
    this.route.params.subscribe(params => {
      if (params.tpId) {
        // this.formTitle = 'Edit Trading partner';
        this.isEdit = true;
        this.buttonLabel = 'Update'
        this.tradingPartnerService
          .getTpDetailsById(params.tpId)
          .subscribe((data: any) => {
            this.showTPName = 'Edit Trading Partner : ' + data.result[0].tpName;
            this.tpId = data.result[0].tpId;
            this.tpTypeforTab = params.tpType;
            // this.tradingPartnerForm.setValue(data.result[0]);
            this.tradingPartnerForm.patchValue(data.result[0]);
            this.tradingPartnerSiteForm.patchValue({
              tpId: data.result[0].tpId
            });
            
            this.tradingPartnerForm.value.tpEnabledFlag === 'Y' ? this.tradingPartnerForm.patchValue({tpEnabledFlag: true}) 
            : this.tradingPartnerForm.patchValue({tpEnabledFlag: false});
            this.tradingPartnerForm.value.activityBillingFlag === 'Y' ? this.tradingPartnerForm.patchValue({activityBillingFlag: true}) 
            : this.tradingPartnerForm.patchValue({activityBillingFlag: false});

          });
      } else if (params.tpSiteId) {
        this.stepper.selectedIndex = 1;
        // this.formTitle = 'Edit Trading Partner Site';
        this.tpTypeforTab = params.tpType;
        this.buttonLabel = 'Update'
        this.tpSiteIsEdit = true;
        this.tpCodeDisabled = true;
        this.tradingPartnerService
          .getTpSiteDetailsById(params.tpSiteId)
          .subscribe((data: any) => {
            this.showTPSiteName = 'Edit Trading Partner Site : ' + data.result[0].tpSiteName;
            this.tpSiteId = data.result[0].tpSiteId;
            // this.tradingPartnerForm.setValue(data.result[0]);
            this.tradingPartnerSiteForm.patchValue(data.result[0]);
            if (this.tradingPartnerSiteForm.value.tpSiteEnabledFlag === 'Y') {
              this.tradingPartnerSiteForm.patchValue({
                tpSiteEnabledFlag: true
              });
            }
            if (this.tradingPartnerSiteForm.value.tpSiteEnabledFlag === 'N') {
              this.tradingPartnerSiteForm.patchValue({
                tpSiteEnabledFlag: false
              });
            }
          });
        // this.stepper.selected.interacted = false;
        // this.addTradingPartnerSite('stepper')
      } else if(params.tpIdForAddSite){
        this.stepper.selectedIndex = 1;
        this.tpTypeforTab = params.tpType;
        this.tpSiteIsEdit = false;
        this.tpCodeDisabled = true;
        // this.tpId = params.tpIdForAddSite;
        console.log(params.tpIdForAddSite);
        this.tradingPartnerSiteForm.patchValue({
          tpId: Number(params.tpIdForAddSite)
        });

      }else {
        this.formTitle = 'Add Trading partner :';
        this.buttonLabel = 'Save'
        this.tpTypeforTab = params.tpType;
      }
    });
  }

  // Get Trading Partner Types
  getTradingPartnerTypes() {
    this.tradingPartnerService.getTradingPartnerTypes().subscribe((types: any) => {
      this.TradingPartnerTypes = types.result;
    });
  }
  getTradingPartnerName() {

    this.commonService.getSearchLOV('TP').subscribe((types: any) => {
      this.TradingPartnerName = [];
      this.EnabledTradingPartnerName = [];
      for (const rowData of types.result) {
        if (rowData.enabledFlag === 'Y') {
          this.EnabledTradingPartnerName.push(rowData);
        }
        this.TradingPartnerName.push(rowData);
      }
    });
  }

  tradingPartnerFeedForm() {
    this.tradingPartnerForm = this.fb.group({
      tpType: ['', Validators.required],
      tpName: ['', Validators.required],
      tpCode: ['', Validators.required],
      tpDescription: ['', Validators.required],
      tpEnabledFlag: [true],
      activityBillingFlag: [false],
      tpAddress1: ['', Validators.required],
      tpAddress2: [''],
      tpAddress3: [''],
      tpCountry: ['', Validators.required],
      tpStateCounty: ['', Validators.required],
      tpCity: ['', Validators.required],
      tpPincode: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(10)]],
      tpPhone: ['', [Validators.required, Validators.pattern('^[0-9-+()s]*$'), Validators.maxLength(15)]],
      tpPersonName: [''],
      tpPersonPhoneNum: [''],
      tpPersonEmail: ['', [ Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      tpCompanyId: [
        Number(
          JSON.parse(localStorage.getItem('userDetails')).companyId
        )
      ],
      tpDisableDate: [],
      createdBy: [
        Number(
          JSON.parse(localStorage.getItem('userDetails')).userId
        )
      ],
      // creationDate:[this.companycomponent.dateFormat(new Date())],
      updatedBy: [Number(
        JSON.parse(localStorage.getItem('userDetails')).userId
      )],
      // updatedDate:[this.companycomponent.dateFormat(new Date())]
    });
  }
  onSubmit() {
    console.log('on submit-'+ this.saveInprogress);
    this.saveInprogress = true;
    this.tradingPartnerForm.value.tpEnabledFlag = this.tradingPartnerForm.value.tpEnabledFlag === true ? 'Y' : 'N';
    this.tradingPartnerForm.value.activityBillingFlag = this.tradingPartnerForm.value.activityBillingFlag === true ? 'Y' : 'N';


    if (this.isEdit) {
      this.tradingPartnerForm.value.tpId = this.tpId;


      this.tradingPartnerForm.value.updatedBy = Number(JSON.parse(localStorage.getItem('userDetails')).userId);
      if (this.tradingPartnerForm.valid) {
        this.tradingPartnerService
          .updateTradingPartner(this.tradingPartnerForm.value)

          // .pipe(first())
          .subscribe(
            (data: any) => {
              if (data.status === 200) {
                // this.trandingPartnerComponent.openDialog(
                //   'Success',
                //   data.message
                // );
                this.openSnackBar(data.message, '', 'success-snackbar');
                // this.router.navigate(['tradingpartners']);
                if (this.tpTypeforTab) {
                  this.router.navigate(['tradingpartners/' + this.tpTypeforTab]);
                } else {
                  this.router.navigate(['tradingpartners']);
                }
              } else {
                // alert(data.message);
                this.openSnackBar(data.message, '', 'error-snackbar');
              }
              this.saveInprogress = false;
            },
            error => {
              // alert(error);
              this.openSnackBar(error.error.message, '', 'error-snackbar');
              this.saveInprogress = false;
            }
          );
      } else {
        this.tpLogValidationErrors();
        this.openSnackBar('Please check mandatory fields', '', 'default-snackbar');
        this.saveInprogress = false;
        console.log(this.tpFormErrors);
      }
    }
    else {
      if (this.tradingPartnerForm.valid) {
        // Assign Flag Value
        if (this.tradingPartnerForm.value.tpEnabledFlag === false) {
          this.tradingPartnerForm.value.tpEnabledFlag = 'N';
          this.tradingPartnerForm.value.tpDisableDate = this.trandingPartnerComponent.dateFormat(new Date());
        } else {
          this.tradingPartnerForm.value.tpEnabledFlag = 'Y';
        }

        // Save Trading Partner Values
        this.tradingPartnerService.addTradingPartner(this.tradingPartnerForm.value).subscribe((response: any) => {
          if (response.status === 200) {
            // this.trandingPartnerComponent.openDialog(
            //   'Success',
            //   response.message
            // );
            this.openSnackBar(response.message, '', 'success-snackbar');
            // this.router.navigate(['tradingpartners']);
            if (this.tpTypeforTab) {
              this.router.navigate(['tradingpartners/' + this.tpTypeforTab]);
            } else {
              this.router.navigate(['tradingpartners']);
            }
            this.saveInprogress = false;
          } else {
            // alert(response.message);
            this.openSnackBar(response.message, '', 'error-snackbar');
            this.saveInprogress = false;
          }
        }, (error: any) => {
          // alert(error.error.message);
          this.openSnackBar(error.error.message, '', 'error-snackbar');
          this.saveInprogress = false;
        });
      } else {
        this.tpLogValidationErrors();
        this.openSnackBar('Please check mandatory fields', '', 'default-snackbar');
        this.saveInprogress = false;
        console.log(this.tpFormErrors);
      }
    }
  }


  // Switch To Trading Partner Site
  addTradingPartnerSite(stepper: MatStepper) {

    stepper.next();
    // Get Trading Partner Site Type
    this.getTradingPartnerSiteTypes();
    this.stepper.selected.interacted = false;

  }

  // Get Trading Partner Site Types
  getTradingPartnerSiteTypes() {
    this.tradingPartnerService.getTradingPartnerSiteTypes().subscribe((types: any) => {
      this.TradingPartnerSiteTypes = types.result;
    });
  }

  // Trading partner site form
  tradingPartnerSiteFeedForm() {
    this.tradingPartnerSiteForm = this.fb.group({
      tpSiteName: ['', Validators.required],
      tpSiteCode: ['', Validators.required],
      tpId: [null],
      tpSiteDescription: [''],
      tpSiteEnabledFlag: [true],
      tpSiteAddress1: ['', Validators.required],
      tpSiteAddress2: [''],
      tpSiteAddress3: [''],
      tpSiteCountry: ['', Validators.required],
      tpSiteStateCounty: ['', Validators.required],
      tpSiteCity: ['', Validators.required],
      tpSitePincode: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(10)]],
      tpSitePhone: ['', [Validators.required, Validators.pattern('^[0-9-+()s]*$'), Validators.maxLength(15)]],
      tpSitePersonName: [''],
      tpSitePersonPhoneNum: [''],
      tpSitePersonEmail: ['', [Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      tpSiteCompanyId: [
        Number(
          JSON.parse(localStorage.getItem('userDetails')).companyId
        )
      ],
      tpSiteDisableDate: [],
      createdBy: [
        Number(
          JSON.parse(localStorage.getItem('userDetails')).userId
        )
      ],
    });
  }

  onTradingSiteSubmit() {
    this.saveInprogress = true;
    console.log('inside click');
    if (this.tradingPartnerSiteForm.value.tpSiteEnabledFlag === true) {
      this.tradingPartnerSiteForm.value.tpSiteEnabledFlag = 'Y';
    } else {
      this.tradingPartnerSiteForm.value.tpSiteEnabledFlag = 'N';
    }
    if (this.tpSiteIsEdit) {
      this.tradingPartnerSiteForm.value.tpSiteId = this.tpSiteId;
      this.tradingPartnerSiteForm.value.updatedBy = Number(JSON.parse(localStorage.getItem('userDetails')).userId);
      if (this.tradingPartnerSiteForm.valid) {
        this.tradingPartnerService
          .updateTradingPartnerSite(this.tradingPartnerSiteForm.value)

          // .pipe(first())
          .subscribe(
            (data: any) => {
              if (data.status === 200) {
                // this.trandingPartnerComponent.openDialog(
                //   'Success',
                //   data.message
                // );
                this.openSnackBar(data.message, '', 'success-snackbar');
                this.router.navigate(['tradingpartners/' + this.tpTypeforTab]);
            } else {
                // alert(data.message);
                this.openSnackBar(data.message, '', 'error-snackbar');
              }
              this.saveInprogress = false;
            },
            error => {
              // alert(error);
              this.openSnackBar(error.error.message, '', 'error-snackbar');
              this.saveInprogress = false;
            }
          );
      } else {
        this.tpSiteLogValidationErrors();
        this.openSnackBar('Please check mandatory fields', '', 'default-snackbar');
        console.log(this.tpFormErrors);
      }
    } else {
      if (this.tradingPartnerSiteForm.valid) {
        // Assign Flag Value
        if (this.tradingPartnerSiteForm.value.tpEnabledFlag === false) {
          this.tradingPartnerSiteForm.value.tpSiteEnabledFlag = 'N';
          this.tradingPartnerSiteForm.value.tpDisableDate = this.trandingPartnerComponent.dateFormat(new Date());
        } else {
          this.tradingPartnerSiteForm.value.tpSiteEnabledFlag = 'Y';
        }

        // Save Trading Partner Values
        this.tradingPartnerService.addTradingPartnerSite(this.tradingPartnerSiteForm.value).subscribe((response: any) => {
          // this.trandingPartnerComponent.openDialog(
          //   'Success',
          //   response.message
          // );
          this.openSnackBar(response.message, '', 'success-snackbar');
          this.saveInprogress = false;
          this.router.navigate(['tradingpartners/' + this.tpTypeforTab]);
        }, (error: any) => {
          // alert(error.error.message);
          this.openSnackBar(error.error.message, '', 'error-snackbar');
          this.saveInprogress = false;
          // this.trandingPartnerComponent.openDialog(
          //   'Error',
          //   error.message
          // );
        });
      } else {
        this.tpSiteLogValidationErrors();
        this.openSnackBar('Please check mandatory fields', '', 'default-snackbar');
        console.log(this.tpFormErrors);
      }
    }
  }
  getCountryList() {
    this.commonService.getCountryLov().subscribe((data: any) => {
      this.countryList = [];

      for (const items of data.countries) {
        this.countryList.push({
          value: items.name,
          id: items.id,
          label: items.name
        });
      }
    });
  }
  selectionChanged(event: any) {
    this.stepper.selected.interacted = false;
  }
  resetCountryValues(element: any){

    if( this.tradingPartnerForm.value.tpCountry !== ''
        && this.tradingPartnerForm.value.tpCountry !== element.value){
      this.tradingPartnerForm.patchValue({
        tpStateCounty: ''
      });
      this.tradingPartnerForm.patchValue({
        tpCity: ''
      });
    }

    if( this.tradingPartnerSiteForm.value.tpSiteCountry !== ''
        && this.tradingPartnerSiteForm.value.tpSiteCountry !== element.value){
      this.tradingPartnerSiteForm.patchValue({
        tpSiteStateCounty: ''
      });
      this.tradingPartnerSiteForm.patchValue({
        tpSiteCity: ''
      });
    }


  }

  resetCityValues(element: any){

    if( this.tradingPartnerForm.value.tpStateCounty !== ''
        && this.tradingPartnerForm.value.tpStateCounty !== element.name){
      this.tradingPartnerForm.patchValue({
        tpCity: ''
      });
    }

    if( this.tradingPartnerSiteForm.value.tpSiteStateCounty !== ''
        && this.tradingPartnerSiteForm.value.tpSiteStateCounty !== element.name){
      this.tradingPartnerSiteForm.patchValue({
        tpSiteCity: ''
      });
    }
  }

  // handle on change events
  LOVSelectionChanged(event: any, lovType: string, Id: number, element: any) {
    this.cityFilterList = [];
    if (lovType === 'State' && event.source.selected) {
      this.resetCountryValues(element);
      this.stateFilterList = [];
      this.commonService.getStateList().subscribe((stateData: any) => {
        const stateList = stateData.states;
        stateList.filter(item => {
          if (item.country_id === String(Id)) {
            this.stateFilterList.push(item);
          }
        });
      });
    }
    if (lovType === 'City' && event.source.selected) {
      this.resetCityValues(element);
      this.commonService.getCityList().subscribe((cityData: any) => {
        const cityList = cityData.cities;
        cityList.filter(item => {
          if (item.state_id === String(Id)) {
            this.cityFilterList.push(item);
          }
        });
      });
    }
  }
  CancelButton() {

    if (this.tpTypeforTab){
      this.router.navigate(['tradingpartners/' + this.tpTypeforTab]);
    }else{
      this.router.navigate(['tradingpartners']);
    }
  }

  tpLogValidationErrors(group: FormGroup = this.tradingPartnerForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.tpLogValidationErrors(abstractControl);
      } else {
        this.tpFormErrors[key] = '';
        if ((abstractControl && !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)) ||
          (abstractControl && !abstractControl.valid && abstractControl.untouched)
        ) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.tpFormErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }
  tpSiteLogValidationErrors(group: FormGroup = this.tradingPartnerSiteForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.tpSiteLogValidationErrors(abstractControl);
      } else {
        this.tpFormErrors[key] = '';
        if ((abstractControl && !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)) ||
          (abstractControl && !abstractControl.valid && abstractControl.untouched)
        )  {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.tpFormErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
    this.saveInprogress = false;
  }
  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
       duration: 3500,
      panelClass: [typeClass]
    });
  }
}
