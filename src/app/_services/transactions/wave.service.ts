import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AutheticationService } from '../authetication.service';
import { Constants } from 'src/app/_shared/Constants';
import { CommonService } from 'src/app/_services/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class WaveService {
  private apiUrlSearch = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/wave/search';
  private apiUrlCreateWave = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/wave';
  private apiUrlById = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/wave/details';
  private apiUrlSOPriority = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lookup/enabled?lookupName=SO_PRIORITY';
  private apiUrlAddWaveCriteria = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/wave-criteria';
  private apiUrlWaveCriteriaById = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/wave-criteria/details';
  private apiUrlWaveCriteriaShowLines = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/wave-criteria/showLines';
  private apiUrlWaveCriteriaLOV = 
  Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based/search?show=wave-criteria&basedOn=wave-criteria';
  private apiUrlWavePolicyLOV = 
    Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based/search?basedOn=wave&show=policy';
  private apiUrlWaveAllotaions = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/allocation/getLine';
  private apiUrlReleaseWave = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/wave/release';
  private apiUrlGetStagingLocatorLov = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based/search';
  private apiUrlUndoWave = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/wave/undo';
   defaultIuDataObservable = this.commonService.defaultIuDataSource.asObservable();

  constructor(private http: HttpClient, private autheticationService: AutheticationService, private commonService : CommonService) { }
  getWaveSearch(waveSearchInfo: any): any {
    return this.http.post(this.apiUrlSearch, waveSearchInfo);
  }
  createWave(data): any {
    return this.http.post(this.apiUrlCreateWave, data);
  }

  getWaveById(id: number) {
    return this.http.get(this.apiUrlById+'/' + id);
  }

  getSOPriorityLOV() {
    return this.http.get(this.apiUrlSOPriority);
  }
  getWaveCriteriaLOV() {
    return this.http.get(this.apiUrlWaveCriteriaLOV);
  }
  getWavePolicyLOV(iuId) {
    return this.http.get(this.apiUrlWavePolicyLOV + '&column='+ iuId);
  }
  getWaveCriteriaById(id: number) {
    return this.http.get(
      this.apiUrlWaveCriteriaById + '/' + id
    );
  }
  createWaveCriteria(data): any {
    return this.http.post(this.apiUrlAddWaveCriteria, data);
  }

  updateWaveCriteria(data, id): any {
    return this.http.put(this.apiUrlAddWaveCriteria + '/' + id, data);
  }
  waveCriteriaShowLines(data): any {
    return this.http.post(this.apiUrlWaveCriteriaShowLines, data);
  }
  getAllocations(data):any{
    return this.http.post(this.apiUrlWaveAllotaions, data);
  }

  releaseWave(data):any{
    return this.http.post(this.apiUrlReleaseWave, data);
  }

  undoWave(data):any{
    return this.http.post(this.apiUrlUndoWave, data);
  }


  getLocatorLov( basedOn, column, show, text) {
     
    show    = show    ? '&show='     + show    : '';
    basedOn = basedOn ? 'basedOn=' + basedOn : '';
    column  = column ? '&column=' + encodeURIComponent(column) : '';
    text    = text    ? '&text='    + text   : '';
    return this.http.get(this.apiUrlGetStagingLocatorLov +'?' + basedOn + column + show + text );
}


}
