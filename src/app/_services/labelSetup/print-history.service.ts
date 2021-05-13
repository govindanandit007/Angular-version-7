import { Injectable } from '@angular/core';
import { Constants } from 'src/app/_shared/Constants';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, JsonpInterceptor } from '@angular/common/http';
// import { AutheticationService } from '../authetication.service';

@Injectable({
  providedIn: 'root'
})
export class PrintHistoryService {

  private apiUrlList = Constants.flexiAPIUrl + 'api/Rest/GetHistoryPrint/?AppUserName=admin@visioncorp.com';
  private apiUrlGetPrintManager = Constants.flexiAPIUrl + 'api/Rest/GetPrintManager/?Id=';
  private apiUrlGetPrinter = Constants.flexiAPIUrl + 'api/Rest/GetPrinter/?PrintManagerId=';
  private apiUrlAddPrintManager = Constants.flexiAPIUrl + 'api/Rest/PostPrintManager/?';
  private apiUrlAddPrinter = Constants.flexiAPIUrl + 'api/Rest/PostPrinter/?';
  private apiUrlReprintWithPrinter = Constants.flexiAPIUrl + 'api/Rest/ReprintwithPrinter/?';
  constructor(private http: HttpClient) { }
  
  getPrintHistoryList(): any {
    return this.http.get(this.apiUrlList);
  }
  getPrintManagerById(id): any {
    return this.http.get(this.apiUrlGetPrintManager + id + '&AppUserName=admin@visioncorp.com');
  }
  getPrinterById(id): any {
    return this.http.get(this.apiUrlGetPrinter + id + '&AppUserName=admin@visioncorp.com');
  }
  createPrintManager(data): any {
    return this.http.post(this.apiUrlAddPrintManager + 'Name=' + data.Name +
     '&Port=' + data.Port + '&Server=' + data.Server + '&IsActive=' + data.IsActive + 
     '&AppUserName=' + data.AppUserName, data);
  }
  updatePrintManager(data,id): any {
    return this.http.post(this.apiUrlAddPrintManager + 'id=' + id + '&Name=' + data.Name +
     '&Port=' + data.Port + '&Server=' + data.Server + '&IsActive=' + data.IsActive + 
     '&AppUserName=' + data.AppUserName, data);
  }
  createPrinter(data, id, AppUserName): any {
    return this.http.post(this.apiUrlAddPrinter + 'Name=' + data.name +
      '&Description=' + data.description + '&IPAddress=' + data.ipAddress + '&Port=' + data.port 
      + '&PrintManagerID=' + id + '&Language=' + data.ipAddress  
      + '&Dpi=' + data.DPI + '&IsActive=' + data.enabled + 
     '&AppUserName=' + AppUserName, data);
  }
  updatePrinter(data, printManagerId, AppUserName, printerId): any {
    return this.http.post(this.apiUrlAddPrinter + 'Name=' + data.name +
      '&Description=' + data.description + '&IPAddress=' + data.ipAddress + '&Port=' + data.port 
      + '&PrintManagerID=' + printManagerId + '&Language=' + data.ipAddress  
      + '&Dpi=' + data.DPI + '&IsActive=' + data.enabled + 
     '&AppUserName=' + AppUserName, data);
  }
  reprintWithPrinter(data, AppUserName): any {
    // data =JSON.stringify(data);
    return this.http.post(this.apiUrlReprintWithPrinter + 'ListPrintHistoryId=' + data.id +
      '&Printer=' + data.printerName + '&AppUserName=' + AppUserName, data);
  }
  reprintWithMultiplePrinter(data, printerName, AppUserName): any {
    // data =JSON.stringify(data);
    return this.http.post(this.apiUrlReprintWithPrinter + 'ListPrintHistoryId=' + data +
      '&Printer=' + printerName + '&AppUserName=' + AppUserName, data);
  }
}
