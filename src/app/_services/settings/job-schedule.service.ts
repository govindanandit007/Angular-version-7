
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AutheticationService } from '../authetication.service';
import { Constants } from 'src/app/_shared/Constants';
import { CommonService } from 'src/app/_services/common/common.service';


@Injectable({
  providedIn: 'root'
})
export class JobScheduleService {

  private apiUrlLgBasedonIU         = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/job-schedule/lglov';
  private apiUrlccBasedonIU         = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/job-schedule/cclov';
  private apiUrlWaveBasedonIU       = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/job-schedule/WaveLov';
  private apiUrlJobParameters       = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/job-schedule/param/';
  private apiUrlScheduleJob         = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/scheduler/job/';
  private apiUrlStopJob             = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/scheduler/job/stop/';

  private apiUrlCreateJob           = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/job-schedule/create';
  private apiUrlsearchJobSchedule   = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/job-schedule/search';
  private apiUrlJobDetails          = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service//job-schedule/details/';
  private apiUrlUpdateJob           = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service//job-schedule/update';

  private apiUrljobHistorySearch    = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/job-history/search';
  defaultIuDataObservable = this.commonService.defaultIuDataSource.asObservable();
  
  constructor(private http: HttpClient, private autheticationService: AutheticationService, private commonService : CommonService) { }


  jobScheduleDetails(id: any): any {
    return this.http.get(this.apiUrlJobDetails + id);
  }

  updateJobScehedule(data: any): any {
    return this.http.put(this.apiUrlUpdateJob, data);
  }

  getLgBasedonIU(id){
    return this.http.post(this.apiUrlLgBasedonIU, id);
  }

  getccBasedonIU(id){
    return this.http.get(this.apiUrlccBasedonIU + '/' + id);
  }

  getWaveBasedonIU(id){
    return this.http.get(this.apiUrlWaveBasedonIU + '/' + id);
  }

  getJobParameters(jobId){
    return this.http.get(this.apiUrlJobParameters + jobId);
  }

  createJobSchedule(data){
    return this.http.post(this.apiUrlCreateJob, data);
  }

  searchJobSchedule(data){
    return this.http.post(this.apiUrlsearchJobSchedule, data);
  }

  scheduleJob(jobId){
    return this.http.get(this.apiUrlScheduleJob + jobId);
  }

  stopJob(jobId){
    return this.http.get(this.apiUrlStopJob + jobId);
  }

  getTransactionSearch(jobHistorySearchInfo: any): any {
    return this.http.post(this.apiUrljobHistorySearch, jobHistorySearchInfo);
  }







}
