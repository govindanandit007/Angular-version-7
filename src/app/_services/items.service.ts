import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../_shared/Constants';
import { AutheticationService } from './authetication.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ItemsService {
    private companyId = Number(
        JSON.parse(localStorage.getItem('userDetails')).companyId
    );

    private apiUrlGetItemById =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/item/details/';
    private apiUrlGetItems =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/item';
    private apiUrlGetSearch =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/item/search';
    private apiUrlGetCategory =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lovs/CATEGORY/001'; // no need to add company id dynamically, only pass anything
    private apiUrlGetUom =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lovs/UOM/001'; // no need to add company id dynamically, only pass anything

    // Services URLs for Item cross references
    private apiUrlGetXRefSearch =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/item-xref/search';

    private apiUrlAddXref =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/item-xref/batchInsert';

    private apiUrlUpdateXRef =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/item-xref/batchUpdate';

    private apiUrlGetItemRevision =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/item-revision';

    // Services URLs for Item Revision
    private apiUrlGetItemRevisionSearch =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/item-revision/search';

    private apiUrlRevision =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/item-revision';
    private apiUrlUOMByItemId =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/uom/lov/byitemclass';
    private apiUrlGetItemRevisionLOV =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/item/lov/itemType/REVISION/Y';

    private apiUrlGetWeightUomLOV     =  Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov/item/weight';
    private apiUrlGetVolumeUomLOV     =  Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov/item/volume';
    private apiUrlGetContainerTypeLOV =  Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov/item/container-type';



    showSearchComponentSubject = new BehaviorSubject<boolean>(true);
    showSearchComponent = this.showSearchComponentSubject.asObservable();

    searchIcon = new BehaviorSubject<boolean>(true);
    searchIconValue = this.searchIcon.asObservable();

    constructor(
        private http: HttpClient,
        private autheticationService: AutheticationService
    ) {}

    // Services Hitting for Item Starts.

    displaySearchComponent(bValue: boolean) {
        this.showSearchComponentSubject.next(bValue);
    }

    getItemSearch(searchInfo: any): any {
        return this.http.post(this.apiUrlGetSearch, searchInfo);
    }

    // get categories
    getCategories() {
        return this.http.get(this.apiUrlGetCategory);
    }

    // get categories
    getUOM() {
        return this.http.get(this.apiUrlGetUom);
    }

    // create item
    createItem(itemData: any): any {
        return this.http.post(this.apiUrlGetItems, itemData);
    }
    // create item
    UOMByItemId(itemId: any): any {
        return this.http.get(this.apiUrlUOMByItemId +'/' + itemId);
    }

    // update item
    updateItem(id: number, itemData: any): any {
        return this.http.put(this.apiUrlGetItems + '/' + id, itemData);
    }
    // Services Hitting for Item Ends.

    // Services Hitting for Item cross references Starts
    getItemXrefSearch(searchInfo: any): any {
        return this.http.post(this.apiUrlGetXRefSearch, searchInfo);
    }

    getItemsForXref() {
        return this.http.get(this.apiUrlGetItems);
    }

    getItemReVision() {
        return this.http.get(this.apiUrlGetItemRevision);
    }

    createXRefs(XRefArray: any): any {
        return this.http.post(this.apiUrlAddXref, XRefArray);
    }

    updateXRefs(XRefArray: any): any {
        return this.http.put(this.apiUrlUpdateXRef, XRefArray);
    }
    // Services Hitting for Item cross references Ends

    // Services Hitting for Item Revision Starts

    getItemRevisionSearch(searchInfo: any): any {
        return this.http.post(this.apiUrlGetItemRevisionSearch, searchInfo);
    }

    createItemRevision(itemData: any): any {
        return this.http.post(this.apiUrlRevision, itemData);
    }

    // update item
    updateItemRevision(id: number, itemData: any): any {
        return this.http.put(this.apiUrlRevision + '/' + id, itemData);
    }

    getItemLOVForRevesion() {
        return this.http.get(this.apiUrlGetItemRevisionLOV);
    }

    searchCrossIconClicked(value: boolean) {
        this.searchIcon.next(value);
    }

    getWeightUomLov() {
        return this.http.get(this.apiUrlGetWeightUomLOV);
    }

    getVolumeUomLov() {
        return this.http.get(this.apiUrlGetVolumeUomLOV);
    }

    getContainerTypeLov() {
        return this.http.get(this.apiUrlGetContainerTypeLOV);
    }
    getItemDetails(id) {
        return this.http.get(this.apiUrlGetItemById + id);
    }




    // Services Hitting for Item Revision Ends
}
