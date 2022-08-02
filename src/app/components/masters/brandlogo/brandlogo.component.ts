import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DbOperation } from 'src/app/shared/db-operation';
import { DataService } from 'src/app/shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { TextFieldValidator, NoWhitespaceValidator } from 'src/app/Validators/validations.validator';
import { Global } from 'src/app/shared/global';

@Component({
  selector: 'app-brandlogo',
  templateUrl: './brandlogo.component.html',
  styleUrls: ['./brandlogo.component.scss']
})
export class BrandlogoComponent implements OnInit, OnDestroy {
  addForm: FormGroup;
  dbops: DbOperation;
  objRows = [];
  objRow: any;
  buttonText: string;
  fileToUpload: any;

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
  @ViewChild('file') myFile: ElementRef;
  constructor(private _dataService: DataService, private _fb: FormBuilder, private _toastr: ToastrService) { }

  setFormState() {
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
    this.addForm = this._fb.group({
      Id: [0],
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        TextFieldValidator.validTextField,
        NoWhitespaceValidator.notWhiteSpaceValidator
      ])]
    });

    this.addForm.valueChanges.subscribe(fData => this.onValueChanged());
    this.addForm.reset();
  }

  ngOnInit(): void {
    this.setFormState();
    this.getData();
  }

  onValueChanged() {
    if (!this.addForm) {
      return;
    }

    const form = this.addForm;
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
    this._dataService.get(Global.BASE_USER_ENDPOINT + "BrandLogo/getAll").subscribe(res => {
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toastr.error(res.errors[0], "BrandLogo Master");
      }
    });
  }

  upload(files: any) {
    if (files.length === 0) {
      return;
    }
   
    let type = files[0].type;
    let aa = type.match(/images\/*/);

    if (type.match(/image\/*/) == null) {
      this._toastr.error("Only images are supported !!", "BrandLogo Master");
      this.myFile.nativeElement.value = "";
      return;
    }
    this.fileToUpload = files[0];
  }


  onSubmit() {
    if (this.dbops === 1 && !this.fileToUpload) {
      this._toastr.error("Please upload image !!", "BrandLogo Master");
      return;
    }

    let formdata = new FormData();
    formdata.append("Id", this.addForm.controls["Id"].value);
    formdata.append("Name", this.addForm.controls["name"].value);

    if (this.fileToUpload) {
      formdata.append("Image", this.fileToUpload, this.fileToUpload.name);
    }


    switch (this.dbops) {
      case DbOperation.create:
        this.addForm.controls["Id"].setValue(0);
        this._dataService.postImages(Global.BASE_USER_ENDPOINT + "BrandLogo/Save/", formdata).subscribe(res => {
          if (res.isSuccess) {
            this.getData();
            this._toastr.success("Data saved successfully !!", "BrandLogo Master");
            this.elname.select('Viewtab');
            this.cancelForm();
          } else {
            this._toastr.info(res.errors[0], "BrandLogo Master");
          }
        });
        break;
      case DbOperation.update:
        this._dataService.postImages(Global.BASE_USER_ENDPOINT + "BrandLogo/Update/", formdata).subscribe(res => {
          if (res.isSuccess) {
            this.getData();
            this._toastr.success("Data updated successfully !!", "BrandLogo Master");
            this.elname.select('Viewtab');
            this.cancelForm();
          } else {
            this._toastr.info(res.errors[0], "BrandLogo Master");
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
    this.addForm.controls["Id"].setValue(this.objRow.id);
    this.addForm.controls["name"].setValue(this.objRow.name);
  }

  Delete(Id: number) {
    let obj = { id: Id };
    this._dataService.post(Global.BASE_USER_ENDPOINT + "BrandLogo/Delete/", obj).subscribe(res => {
      if (res.isSuccess) {
        this.getData();
        this._toastr.success("Data deleted successfully !!", "BrandLogo Master");
      } else {
        this._toastr.info(res.errors[0], "BrandLogo Master");
      }
    });
  }

  cancelForm() {
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
    this.fileToUpload = null;
    if (this.addForm.value != null) {
      this.setFormState()
    }
  }

  setForm() {
    this.addForm.reset();
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
    this.elname.select('Viewtab');
  }
  ngOnDestroy() {
    this.objRows = null;
    this.objRow = null;
  }
}
