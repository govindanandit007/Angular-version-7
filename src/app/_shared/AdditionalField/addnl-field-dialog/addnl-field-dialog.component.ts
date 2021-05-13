import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-addnl-field-dialog',
  templateUrl: './addnl-field-dialog.component.html',
  styleUrls: ['./addnl-field-dialog.component.css']
})
export class AddnlFieldDialogComponent implements OnInit {

  addtnlFieldForm: FormArray;
  addtnlFieldArray: any = [];
  location: any = '';

  validationMessages = {}
  formErrors = {}
 
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any, 
    private dialogRef: MatDialogRef<AddnlFieldDialogComponent>,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder) {

     }


  messageHeader: string;
  messageBody: string;
  ngOnInit() {
   this.location = this.data.location;
   const addtnlFieldValueArray = this.data.addtnlFieldValueArray;
   const tempArray = this.data.addtnlFieldArray;
   const tempArray1 = [];
   for(const rowData of tempArray) {
      if(rowData.enabledFlag === 'Y'){
        tempArray1.push(rowData);
      }
   }
   this.addtnlFieldArray = tempArray1


   this.addtnlFieldForm = this.formBuilder.array([])
   for(const [i, rowData] of this.addtnlFieldArray.entries()) {
      let formControl: any = this.formBuilder.control('');;

      for(const rowData1 of addtnlFieldValueArray) {
         if(rowData.addlField === rowData1.fieldName){
            formControl = this.formBuilder.control(rowData1.value);
         }
      }
      
      if(rowData.mandatoryFlag === 'Y'){
        formControl.setValidators(Validators.required);
        this.validationMessages[i] = { required : rowData.labelName + ' is required.' }
        this.formErrors[i] = '';
      }
      this.addtnlFieldForm.push(formControl);
   }

    
   

  }


  save(event: any){
    if(event){
      // event.stopImmediatePropagation();
      if (this.addtnlFieldForm.valid) {
        this.data.addtnlFieldValueArray = [];
        const tempArray = this.addtnlFieldForm.value;
        for(const [i,rowData] of this.data.addtnlFieldArray.entries()) {
          this.data.addtnlFieldValueArray.push({
            fieldName : rowData.addlField,
            position  : String(rowData.addlField.split('addl_field')[1]),
            value     : tempArray[i]
          });
        }
        this.dialogRef.close(this.data);
      }else{
        this.addtnlFieldErrors();
        this.openSnackBar('Please check mandatory fields', '', 'default-snackbar');
      }
    }
  }

  close() {
    this.dialogRef.close(this.data);
  }

  addtnlFieldErrors(group: FormArray = this.addtnlFieldForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormArray) {
        this.addtnlFieldErrors(abstractControl);
      } else {
        this.formErrors[key] = ''
        if (abstractControl && !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + ' ';
            }
          };
        }
      }
    })
  }

  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
        duration: 3000,
        panelClass: [typeClass]
    });
  } 
 
}
