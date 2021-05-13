import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/_services/common/common.service';
import { MatSnackBar } from '@angular/material';
import { JobScheduleService } from 'src/app/_services/settings/job-schedule.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-add-jobschedule',
  templateUrl: './add-jobschedule.component.html',
  styleUrls: ['./add-jobschedule.component.css']
})
export class AddJobscheduleComponent implements OnInit {

  jobScheduleForm: FormGroup;
  jobTypeList : any = [];
  intervalList: any = [];
  iuList: any = [];
  lgList: any = [];
  ccList: any = [];
  waveList: any = [];
  setStartDate: any = new Date();
  placeHolder: any ='Value *';

  screenMaxHeight:any;
  parameters: any = {
    Wave_Criteria    : '',
    Cycle_Count_name : '',
    IU               : '',
    LG               : ''
  }
  formTitle : any = 'Add Job Schedule:';
  isEdit: any = false;
  jobId: any =null;

  parametersArray: any = [];


  validationMessages = {
    jobName: {
      required: 'job Name is required.'
    },
    jobType: {
      required: 'Job Type is required.'
    },
    schedule: {
      required: 'Interval is required.'
    },
    value: {
      required: 'Value is required.'
    },
    logName: {
      required: 'Log Name is required.'
    },
    date: {
      required: 'Date is required.'
    },
    time: {
      required: 'Time is required.'
    },
    iu: {
      required: 'IU is required.'
    },
    lg: {
      required: 'LG is required.'
    },
    ccName: {
      required: 'Cycle count name is required.'
    },
    waveName: {
      required: 'Wave name is required.'
    }
  };

  jsFormErrors = {
    jobName  : '',
    jobType  : '', 
    schedule : '', 
    value    : '', 
    logName  : '', 
    date     : '', 
    time     : '', 
    iu       : '', 
    lg       : '',
    ccName   : '',
    waveName : ''
  };

  constructor(private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public commonService : CommonService,
    public router: Router,
    private route: ActivatedRoute,
    private jobSchedule :JobScheduleService) { }

  ngOnInit() {
    this.jobScheduleFeedForm();
    this.jobSchedule.defaultIuDataObservable.subscribe((data: any) => {
      if( !this.isEdit){
            this.jobScheduleForm.patchValue({iu:  data});
        }
    });
    this.getInventoryUnitLOV();
    this.getJobTypeLOV();
    this.getIntervalLOV();
    this.commonService.getScreenSize(220);
    this.route.params.subscribe(params => {
      if (params.id) {
        this.formTitle = 'Edit Job Schedule';
        this.isEdit = true;
        this.setStartDate = '';
        this.jobId = params.id;
        this.jobSchedule
          .jobScheduleDetails(params.id)
          .subscribe((data: any) => {
            data = data.result[0];
            data.date = data.startDate;
            data.time = data.startTime.split(' ')[0];
            data.value = data.value;
            this.jobScheduleForm.patchValue(data);
            setTimeout(() => {
              this.setParameters(data);
            }, 1000);
          });
      } else {
        this.formTitle = 'Add Job Schedule:';
      }
    });
  }

  setParameters(data){
      for (const parameterData of data.jobparameter) {
        if( parameterData.jobParameterName === 'Wave_Criteria'){
          this.jobScheduleForm.patchValue({waveName: parameterData.value});
        }
        if(parameterData.jobParameterName === 'LG'){
          this.jobScheduleForm.patchValue({lg: parameterData.value});
        }
        if(parameterData.jobParameterName === 'IU'){
          this.jobScheduleForm.patchValue({iu: parameterData.value});
        }
        if(parameterData.jobParameterName === 'Cycle_Count_name'){
          this.jobScheduleForm.patchValue({ccName: parameterData.value});
        } 
      }
  }

  jobScheduleFeedForm() {
    this.jobScheduleForm = this.fb.group({
      jobName     : ['', Validators.required],
      jobType     : ['', Validators.required], 
      schedule    : ['', Validators.required], 
      value       : ['', Validators.required], 
      logName     : [''], 
      date        : [new Date(), Validators.required], 
      time        : ['', Validators.required], 
      iu          : [(JSON.parse(localStorage.getItem('defaultIU'))).id], 
      lg          : [''],
      ccName      : [''], 
      waveName    : ['']
    });
  }

  jsLogValidationErrors(group: FormGroup = this.jobScheduleForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.jsLogValidationErrors(abstractControl);
      } else {
        this.jsFormErrors[key] = '';
        if (
          abstractControl &&
          !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)
        ) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.jsFormErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }

  valueFocusOut(){
    if( Number(this.jobScheduleForm.value.value) === 0 ){
      this.jobScheduleForm.patchValue({value: ''});
      this.openSnackBar('Please enter value greater then zero','','default-snackbar');
    }
    this.jsLogValidationErrors()
  }

  onDateChange(){
    let date = this.commonService.dateFormat(this.jobScheduleForm.value.date);
    this.jobScheduleForm.patchValue({logName: ''});
    this.jobScheduleForm.patchValue({
      logName : date
    });
    for (const parameterData of this.jobTypeList) {
      if( parameterData.value !== '' && parameterData.value === this.jobScheduleForm.value.jobType){
        this.jobScheduleForm.patchValue({
          logName : (parameterData.label +'_'+ date).split(' ').join('')
        });
      }
    }
   
 }

  jobTypeSelectionChanged(event:any, jobId){
    if (event.source.selected && event.isUserInput === true && jobId && jobId!== '') {
      for (const parameterData of this.jobTypeList) {
        if( parameterData.value !== '' && parameterData.value === jobId){
          this.jobScheduleForm.patchValue({logName: ''});
          this.jobScheduleForm.patchValue({
            logName : (parameterData.label +'_'+ this.commonService.dateFormat(this.jobScheduleForm.value.date)).split(' ').join('')
          });
        }
      }
      this.jobSchedule
        .getJobParameters(jobId)
        .subscribe((data: any) => {
          if(data.result){
              this.parameters = {
              Wave_Criteria    : '',
              Cycle_Count_name : '',
              IU               : '',
              LG               : ''
            }
            // this.jobScheduleForm.patchValue({iu: ''});
                this.jobScheduleForm.patchValue({iu:  (JSON.parse(localStorage.getItem('defaultIU'))).id});

            // this.jobScheduleForm.controls.iu.disable();
            this.jobScheduleForm.controls.lg.disable();
            this.jobScheduleForm.controls.ccName.disable();
            this.jobScheduleForm.controls.waveName.disable();
            for (const parameterData of data.result) {
              if(parameterData.lookupValue === 'Wave_Criteria'){
                this.parameters.Wave_Criteria = parameterData.lookupValue;
                this.jobScheduleForm.controls.waveName.enable();
                this.iuSelectionChanged({source : {selected : true}, isUserInput : true}, (JSON.parse(localStorage.getItem('defaultIU'))).id)
              }
              if(parameterData.lookupValue === 'LG'){
                this.parameters.LG = parameterData.lookupValue;
                // this.jobScheduleForm.controls.iu.enable();
                this.jobScheduleForm.controls.lg.enable();
              }
              if(parameterData.lookupValue === 'IU'){
                this.parameters.IU = parameterData.lookupValue;
                // this.jobScheduleForm.controls.iu.enable();
              }
              if(parameterData.lookupValue === 'Cycle_Count_name'){
                this.parameters.Cycle_Count_name = parameterData.lookupValue;
                this.jobScheduleForm.controls.ccName.enable();
                this.iuSelectionChanged({source : {selected : true}, isUserInput : true}, (JSON.parse(localStorage.getItem('defaultIU'))).id)
              } 
                
            }
  
          }
        },(error: any) => {
          this.openSnackBar(error.error.message,'','error-snackbar');
        });
    }
  }

  iuSelectionChanged(event: any, iuId){
    if (event.source.selected && event.isUserInput === true && iuId && iuId!== '') {
        
      if(this.parameters.LG === "LG"){
        this.lgList = [{
          value: '',
          label: 'Please Select'
        }];
        this.jobScheduleForm.patchValue({lgId : null})
        this.jobSchedule
          .getLgBasedonIU({ iuId: iuId })
          .subscribe((data: any) => {
            if(data.result){
               
              for (const lgData of data.result) {
                this.lgList.push({
                  value: lgData.lgId,
                  label: lgData.lgCode
                });
              }
    
            }
          },(error: any) => {
            this.openSnackBar(error.error.message,'','error-snackbar');
          });
      }else if( this.parameters.Cycle_Count_name === "Cycle_Count_name" ){
        this.ccList = [{
          value: '',
          label: 'Please Select'
        }];
        this.jobScheduleForm.patchValue({lgId : null})
        this.jobSchedule
          .getccBasedonIU( iuId )
          .subscribe((data: any) => {
            if(data.result){
              for (const ccData of data.result) {
                this.ccList.push({
                  value: ccData.cycleCountId,
                  label: ccData.cycleCountName
                });
              }
    
            }
          },(error: any) => {
            this.openSnackBar(error.error.message,'','error-snackbar');
          });
      }else if( this.parameters.Wave_Criteria === 'Wave_Criteria' ){
        this.waveList = [{
          value: '',
          label: 'Please Select'
        }];
        this.jobScheduleForm.patchValue({lgId : null})
        this.jobSchedule
          .getWaveBasedonIU( iuId )
          .subscribe((data: any) => {
            if(data.result){
              for (const ccData of data.result) {
                this.waveList.push({
                  value: ccData.criteriaId,
                  label: ccData.criteriaName
                });
              }
    
            }
          },(error: any) => {
            this.openSnackBar(error.error.message,'','error-snackbar');
          });

      }

     
    }
  }

  intervalChanged(event: any, type){
    if (event.source.selected && event.isUserInput === true ) {
      if(type === 'Once'){
        this.jobScheduleForm.patchValue({ value: '' });
        this.jobScheduleForm.controls.value.disable();
        this.jobScheduleForm.controls.value.setValidators(null);
        this.jobScheduleForm.controls.value.updateValueAndValidity();
        this.placeHolder = 'Value';
      }else{
        this.jobScheduleForm.patchValue({ value: '' });
        this.jobScheduleForm.controls.value.enable();
        this.jobScheduleForm.controls.value.setValidators([
          Validators.required
        ]);
        this.jobScheduleForm.controls.value.updateValueAndValidity();
        this.placeHolder = 'Value *';
      }
    }
  }

  getInventoryUnitLOV() {
    this.iuList = [{
      value: '',
      label: 'Please Select'
    }];
    this.commonService
      .getIULOV()
      .subscribe((data: any) => {
        if(data.result){
          for (const iuData of data.result) {
            this.iuList.push({
              value: iuData.iuId,
              label: iuData.iuCode,
              name: iuData.iuName,
            });
          }

        }
      },(error: any) => {
        this.openSnackBar(error.error.message,'','error-snackbar');
      });
  }

  getJobTypeLOV() {
    this.jobTypeList = [{
      value: '',
      label: 'Please Select'
    }];
    this.commonService
      .getLookupLOV('JOB_SCH_JOB_TYPE')
      .subscribe((data: any) => {
        if(data.result){
          for (const jobTypeData of data.result) {
            this.jobTypeList.push({
              value: jobTypeData.lookupValue,
              label: jobTypeData.lookupValueDesc
            });
          }

        }
      },(error: any) => {
        this.openSnackBar(error.error.message,'','error-snackbar');
      });
  }

  getIntervalLOV() {
    this.intervalList = [{
      value: '',
      label: 'Please Select'
    }];
    this.commonService
      .getLookupLOV('JOB_SCH_INTERVAL_TYPE')
      .subscribe((data: any) => {
        if(data.result){
          for (const intervalData of data.result) {
            this.intervalList.push({
              value: intervalData.lookupValue,
              label: intervalData.lookupValueDesc
            });
          }

        }
      },(error: any) => {
        this.openSnackBar(error.error.message,'','error-snackbar');
      });
  }

  

  onSubmit(event: any, jsForm: any){
    if( Number(this.jobScheduleForm.value.value) === 0 ){
      this.jobScheduleForm.patchValue({value: ''});
      this.openSnackBar('Please enter value greater then zero','','default-snackbar');
      return;
    }
    if(event){
      event.stopImmediatePropagation();
      if(this.jobScheduleForm.valid){
        this.getParameters()
        let  data : any = {
          jobId           : this.jobId ? Number(this.jobId) : null,
          jobName         : this.jobScheduleForm.value.jobName,
          addJobParameter : this.parametersArray,
          jobType         : this.jobScheduleForm.value.jobType,
          logName         : this.jobScheduleForm.value.logName,
          startDate       : this.commonService.dateFormat(this.jobScheduleForm.value.date),
          startTime       : this.jobScheduleForm.value.time + ':00',
          value           : this.jobScheduleForm.value.value ? Number(this.jobScheduleForm.value.value) : null,
          schedule        : this.jobScheduleForm.value.schedule,
          cron            : null
        }

        

        if(!this.isEdit){
          data.createdBy = JSON.parse(localStorage.getItem('userDetails')).userId,
          this.jobSchedule.createJobSchedule(data)
            .subscribe((data: any) => {
              if(data.status === 200){
               this.scheduleJob(data.jobId, data.message)
              }
            },(error: any) => {
              this.openSnackBar(error.error.message,'','error-snackbar');
            });
        }else{
            data.updatedBy = JSON.parse(localStorage.getItem('userDetails')).userId,
            this.jobSchedule.updateJobScehedule(data)
            .subscribe((data: any) => {
              if(data.status === 200){
                this.openSnackBar(data.message,'','success-snackbar');
                this.router.navigate(['jobschedule']);
              }
            },(error: any) => {
              this.openSnackBar(error.error.message,'','error-snackbar');
            });
          }
      }else{
        this.openSnackBar('Please check the required fields','','error-snackbar');
      }
    }
  }

  scheduleJob(jobId,message){
    this.jobSchedule
    .scheduleJob(jobId)
    .subscribe(
        (data: any) => {
            if (data.status === 200) {
              this.openSnackBar(message + ' And ' + data.message,'','success-snackbar');
              this.router.navigate(['jobschedule']);
            } else {
                this.openSnackBar( data.message,'','error-snackbar' );
            }
        },
        (error: any) => {
            this.openSnackBar( error.error.message,'','error-snackbar' );
        }
    );
  }

  getParameters(){
    if( this.parameters.Wave_Criteria === 'Wave_Criteria'){
      this.parametersArray.push({
        createdBy        : JSON.parse(localStorage.getItem('userDetails')).userId,
        jobParameterName : 'Wave_Criteria',
        value            : this.jobScheduleForm.value.waveName
      });
    }
    if(this.parameters.LG === 'LG'){
      this.parametersArray.push({
        createdBy        : JSON.parse(localStorage.getItem('userDetails')).userId,
        jobParameterName : 'LG',
        value            : this.jobScheduleForm.value.lg
      });
    }
    if(this.parameters.IU === 'IU'){
      this.parametersArray.push({
        createdBy        : JSON.parse(localStorage.getItem('userDetails')).userId,
        jobParameterName : 'IU',
        value            : this.jobScheduleForm.value.iu
      });
    }
    if(this.parameters.Cycle_Count_name === 'Cycle_Count_name'){

      this.parametersArray.push({
        createdBy        : JSON.parse(localStorage.getItem('userDetails')).userId,
        jobParameterName : 'Cycle_Count_name',
        value            : this.jobScheduleForm.value.ccName
      });
    } 
  }

  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
         duration: 3500,
        panelClass: [typeClass]
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
      this.commonService.getScreenSize(220);
  }

}
