import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DbOperation } from 'src/app/shared/db-operation';
import { DataService } from 'src/app/shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { TextFieldValidator, NoWhitespaceValidator } from 'src/app/Validators/validations.validator';
import { Global } from 'src/app/shared/global';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit, OnDestroy {
  tagForm: FormGroup;
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
      'minlength': 'Name cannot be less than 3 characters long',
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
    this.tagForm = this._fb.group({
      Id: [0],
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        TextFieldValidator.validTextField,
        NoWhitespaceValidator.notWhiteSpaceValidator
      ])]
    });

    this.tagForm.valueChanges.subscribe(fData => this.onValueChanged());
    this.tagForm.reset();
  }

  ngOnInit(): void {
    this.setFormState();
    this.getData();
  }

  onValueChanged() {
    if (!this.tagForm) {
      return;
    }

    const form = this.tagForm;
    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const message = this.validationMessage[field];

        for (const key of Object.keys(control.errors)) {
          this.formErrors[field] += message[key] + ' ';
        }

      }

    }
  }


  getData() {
    this._dataService.get(Global.BASE_USER_ENDPOINT + "TagMaster/getAll").subscribe(res => {
      debugger;
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toastr.error(res.errors[0], "Tag Master");
      }
    });
  }

  onSubmit() {
    debugger;
    switch (this.dbops) {
      case DbOperation.create:
        this.tagForm.controls["Id"].setValue(0);
        this._dataService.post(Global.BASE_USER_ENDPOINT + "TagMaster/Save/", this.tagForm.value).subscribe(res => {
          debugger;
          if (res.isSuccess) {
            this.getData();
            this._toastr.success("Data saved successfully !!", "Tag Master");
            this.elname.select('Viewtab');
            this.cancelForm();
          } else {
            this._toastr.info(res.errors[0], "Tag Master");
          }
        });
        break;
      case DbOperation.update:
        this._dataService.post(Global.BASE_USER_ENDPOINT + "TagMaster/Update/", this.tagForm.value).subscribe(res => {
          if (res.isSuccess) {
            this.getData();
            this._toastr.success("Data updated successfully !!", "Tag Master");
            this.elname.select('Viewtab');
            this.cancelForm();
          } else {
            this._toastr.info(res.errors[0], "Tag Master");
          }
        });
        break;
    }
  }

  Edit(Id: number) {
    debugger;
    this.dbops = DbOperation.update;
    this.elname.select('Addtab');
    this.buttonText = "Update";
    this.objRow = this.objRows.find(x => x.id == Id);
    this.tagForm.controls["Id"].setValue(this.objRow.id);
    this.tagForm.controls["name"].setValue(this.objRow.name);
  }

  Delete(Id: number) {
    debugger;
    let obj = { id: Id };
    this._dataService.post(Global.BASE_USER_ENDPOINT + "TagMaster/Delete/", obj).subscribe(res => {
      if (res.isSuccess) {
        this.getData();
        this._toastr.success("Data deleted successfully !!", "Tag Master");
      } else {
        this._toastr.info(res.errors[0], "Tag Master");
      }
    });
  }

  cancelForm() {
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
    if (this.tagForm.value != null) {
      this.setFormState()
    }
  }

  setForm(){
    this.tagForm.reset();
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
    this.elname.select('Viewtab');
  }
  ngOnDestroy() {
    this.objRows = null;
    this.objRow = null;
  }
}
