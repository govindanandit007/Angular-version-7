import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from 'src/app/_shared/Constants';
import { AutheticationService } from '../authetication.service';
import { DatePipe } from '@angular/common';
@Injectable({
    providedIn: 'root'
})
export class UsersService {
    // headers: any;
    private apiUrlGetSearch =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/user/search';
    private apiUrlPostUser = Constants.flexiAPIUrl + 'api/Rest/PostUser?';



    constructor(private http: HttpClient, private autheticationService: AutheticationService) {
        // this.headers = this.autheticationService.getHeaders();
    }
    companyId: number = Number(
        JSON.parse(localStorage.getItem('userDetails')).companyId
    );
    getUsers() {
        this.companyId = JSON.parse(localStorage.getItem('userDetails')).companyId;
        return this.http.get(
            Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/user/' + this.companyId
        );
    }
    getUserById(id: number) {
        return this.http.get(
            Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/user/detail/' + id
        );
    }
    updateUser(user): any {
        return this.http.put(
            Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/user/' + user.userId,
            user
        );
    }
    createUser(user): any {
        return this.http.post(Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/user/', user);
    }
    dateFormat(dateData: any) {
        const dp = new DatePipe(navigator.language);
        const p = 'y-MM-dd'; // YYYY-MM-DD
        const dtr = dp.transform(new Date(dateData), p);
        return dtr;
    }
    getUserSearch(userSearchInfo: any): any {
        return this.http.post(this.apiUrlGetSearch, userSearchInfo);
    }

    getDefaultRoles(data: any): any {
        return this.http.post( Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/role/search' , data);
    }
    
    postUser(data): any {
        return this.http.post(
            this.apiUrlPostUser +
                'Name=' +
                data.Name +
                '&Email=' +
                data.Email +
                '&Password=' +
                data.Password +
                '&Company=' +
                data.Company +
                '&Type=' +
                data.Type +
                '&IsActive=' +
                data.IsActive +
                '&AppUserName=admin@visioncorp.com',
            data
        );
    }

}