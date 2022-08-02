import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DbOperation } from 'src/app/shared/db-operation';
import { DataService } from 'src/app/shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { TextFieldValidator, NoWhitespaceValidator } from 'src/app/Validators/validations.validator';
import { Global } from 'src/app/shared/global';

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrls: ['./size.component.scss']
})
export class SizeComponent implements OnInit, OnDestroy {
  sizeForm: FormGroup;
  dbops: DbOperation;
  objRows = [];
  objRow: any;
  buttonText: string;

  formErrors = {
    'name': ''
  };

  validationMessage = {
    'name': {
      'required': 'Name is required',
      'minlength': 'Name cannot be less than 1 characters long',
      'maxlength': 'Name cannot be more than 10 characters long',
      'validTextField': 'Name must contains only numbers and letters',
      'notWhiteSpaceValidator': 'Only white space not allowed'
    }
  };


  @ViewChild('tabset') elname: any;
  constructor(private _dataService: DataService, private _fb: FormBuilder, private _toastr: ToastrService) { }

  setFormState() {
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
    this.sizeForm = this._fb.group({
      Id: [0],
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        TextFieldValidator.validTextField,
        NoWhitespaceValidator.notWhiteSpaceValidator
      ])]
    });

    this.sizeForm.valueChanges.subscribe(fData => this.onValueChanged());
    this.sizeForm.reset();
  }

  ngOnInit(): void {
    this.setFormState();
    this.getData();
  }

  onValueChanged() {
    if (!this.sizeForm) {
      return;
    }

    const form = this.sizeForm;
    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const message = this.validationMessage[field];

        for (const key of Object.keys(control.errors)) {
          if(key != 'required'){
          this.formErrors[field] += message[key] + ' ';
          }
        }
      }
    }
  }

  getData() {
    this._dataService.get(Global.BASE_USER_ENDPOINT + "SizeMaster/getAll").subscribe(res => {
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toastr.error(res.errors[0], "Size Master");
      }
    });
  }

  onSubmit() {
    switch (this.dbops) {
      case DbOperation.create:
        this.sizeForm.controls["Id"].setValue(0);
        this._dataService.post(Global.BASE_USER_ENDPOINT + "SizeMaster/Save/", this.sizeForm.value).subscribe(res => {
          if (res.isSuccess) {
            this.getData();
            this._toastr.success("Data saved successfully !!", "Size Master");
            this.elname.select('Viewtab');
            this.cancelForm();
          } else {
            this._toastr.info(res.errors[0], "Size Master");
          }
        });
        break;
      case DbOperation.update:
        this._dataService.post(Global.BASE_USER_ENDPOINT + "SizeMaster/Update/", this.sizeForm.value).subscribe(res => {
          if (res.isSuccess) {
            this.getData();
            this._toastr.success("Data updated successfully !!", "Size Master");
            this.elname.select('Viewtab');
            this.cancelForm();
          } else {
            this._toastr.info(res.errors[0], "Size Master");
          }
        });
        break;
    }
  }

  Edit(Id: number) {
    this.dbops = DbOperation.update;
    this.elname.select('Addtab');
    this.buttonText = "Update";
    this.objRow = this.objRows.find(x => x.id == Id);
    this.sizeForm.controls["Id"].setValue(this.objRow.id);
    this.sizeForm.controls["name"].setValue(this.objRow.name);
  }

  Delete(Id: number) {
    let obj = { id: Id };
    this._dataService.post(Global.BASE_USER_ENDPOINT + "SizeMaster/Delete/", obj).subscribe(res => {
      if (res.isSuccess) {
        this.getData();
        this._toastr.success("Data deleted successfully !!", "Size Master");
      } else {
        this._toastr.info(res.errors[0], "Size Master");
      }
    });
  }

  cancelForm() {
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
    if (this.sizeForm.value != null) {
      this.setFormState()
    }
  }

  setForm(){
    this.sizeForm.reset();
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
    this.elname.select('Viewtab');
  }
  ngOnDestroy() {
    this.objRows = null;
    this.objRow = null;
  }
}
