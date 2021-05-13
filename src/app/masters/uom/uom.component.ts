import { Component, OnInit, ViewChild } from '@angular/core';
import { TooltipPosition } from '@angular/material';
// import { UnitOfMeasureComponent } from './unit-of-measure/unit-of-measure.component';
// import { UomConversionComponent } from './uom-conversion/uom-conversion.component';

@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.css']
})
export class UomComponent implements OnInit {
  selectedIndex:number = 0;
  tooltipPosition: TooltipPosition[] = ['below'];
  // @ViewChild(UnitOfMeasureComponent, {static: false}) private unitOfMeasure: UnitOfMeasureComponent;
  // @ViewChild(UomConversionComponent, {static: false}) private uomConversion: UomConversionComponent;
  constructor() { }

  ngOnInit() {
  }

  // AddButtonText = "Add UOM"
  tabChanged(event){
     
    // this.AddButtonText = event.index == 1 ? "Add UOM Conversion" : "Add UOM"; 
    // if(this.AddButtonText != "Add UOM Conversion" ){
    //   this.selectedIndex = 0;
    // }
  }

  addRow() {
    // this.AddButtonText == "Add UOM Conversion" ?  this.uomConversion.addRow() :  this.unitOfMeasure.addRow(); 
  }

  switchTab(data){
     
    // this.selectedIndex = 1;
    // this.uomConversion.populateItemList(data)
  }

}
