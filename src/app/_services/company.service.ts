import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../_shared/Constants';
import { map } from 'rxjs/operators';
import { Company } from '../masters/_models/company.model';
import { AutheticationService } from './authetication.service';
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private apiUrlGetCompany =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/company/adminDetails';
    private apiUrlUpdateCompany =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/company/';
    private defineCompanyUserURL =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/companyAndUser';
    private apiUrlGetSearch =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/company/search';
    private apiUrlUpdateCompanyAndUser =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/companyAndUser';

    private apiUrlPostCompany = Constants.flexiAPIUrl + 'api/Rest/PostCompany?';


    companyId = Number(
        JSON.parse(localStorage.getItem('userDetails')).companyId
    );
    showSearchComponentSubject = new BehaviorSubject<boolean>(true);
    showSearchComponent = this.showSearchComponentSubject.asObservable();

    searchIcon = new BehaviorSubject<boolean>(true);
    searchIconValue = this.searchIcon.asObservable();

    constructor(
        private http: HttpClient,
        private autheticationService: AutheticationService
    ) { }

    public getCompanyList(): any {
        this.companyId = JSON.parse(localStorage.getItem('userDetails')).companyId;
        return this.http.get(this.apiUrlGetCompany + '/' + this.companyId).pipe(
            map(company => {
                return company;
            })
        );
    }
    getCompanyById(id: number) {
        return this.http.get(this.apiUrlGetCompany + '/' + id);
    }
    updateCompanyList(company: Company) {
        this.companyId = JSON.parse(localStorage.getItem('userDetails')).companyId;
        return this.http
            .put(this.apiUrlUpdateCompany + this.companyId, company)
            .pipe(
                // tslint:disable-next-line: no-shadowed-variable
                map(company => {
                    return company;
                })
            );
    }
    updateCompanyAndUserList(company: Company) {
        return this.http
            .put(this.apiUrlUpdateCompanyAndUser, company)
            .pipe(
                // tslint:disable-next-line: no-shadowed-variable
                map(company => {
                    return company;
                })
            );
    }

    defineCompany(company: Company) {
        return this.http.post(this.defineCompanyUserURL, company);
    }
    getCompanySearch(CompanySearchInfo: any): any {
        return this.http.post(this.apiUrlGetSearch, CompanySearchInfo);
    }

    dateFormat(dateData: any) {
        const dp = new DatePipe(navigator.language);
        const p = 'y-MM-dd'; // YYYY-MM-DD
        const dtr = dp.transform(new Date(dateData), p);
        return dtr;
    }
    displaySearchComponent(bValue: boolean) {
        this.showSearchComponentSubject.next(bValue);
    }

    searchCrossIconClicked(value: boolean) {
         
        this.searchIcon.next(value);
    }

    postCompany(data): any {
        return this.http.post(
            this.apiUrlPostCompany +
                'Name=' +
                data.Name +
                '&Address=' +
                data.Address +
                '&IsActive=' +
                data.IsActive +
                '&AppUserName=admin@visioncorp.com',
            data
        );
    }

}
