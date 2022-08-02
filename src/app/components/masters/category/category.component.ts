import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DbOperation } from 'src/app/shared/db-operation';
import { DataService } from 'src/app/shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { TextFieldValidator, NoWhitespaceValidator, NumericFieldValidator } from 'src/app/Validators/validations.validator';
import { Global } from 'src/app/shared/global';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {
  addForm: FormGroup;
  dbops: DbOperation;
  objRows = [];
  objRow: any;
  buttonText: string;
  fileToUpload: any;

  formErrors = {
    'name': '',
    'title': '',
    'isSave': '',
    'link': ''
  };

  validationMessage = {
    'name': {
      'required': 'Name is required',
      'minlength': 'Name cannot be less than 3 characters long',
      'maxlength': 'Name cannot be more than 10 characters long',
      'validTextField': 'Name must contains only numbers and letters',
      'notWhiteSpaceValidator': 'Only white space not allowed'
    },
    'title': {
      'required': 'Title is required',
      'minlength': 'Title cannot be less than 3 characters long',
      'maxlength': 'Title cannot be more than 10 characters long',
      'validTextField': 'Title must contains only numbers and letters',
      'notWhiteSpaceValidator': 'Only white space not allowed'
    },
    'isSave': {
      'required': 'Save value is required',
      'minlength': 'Save value cannot be less than 1 characters long',
      'maxlength': 'Save value cannot be more than 2 characters long',
      'validNumericField': 'Save value must contains only numbers',
      'notWhiteSpaceValidator': 'Only white space not allowed'
    },
    'link': {
      'required': 'Link is required',
      'minlength': 'Link cannot be less than 3 characters long',
      'maxlength': 'Link cannot be more than 255 characters long',
      'validTextField': 'Link must contains only numbers and letters',
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
      ])],
      title: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        TextFieldValidator.validTextField,
        NoWhitespaceValidator.notWhiteSpaceValidator
      ])],
      isSave: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2),
        NumericFieldValidator.validNumericField,
        NoWhitespaceValidator.notWhiteSpaceValidator
      ])],
      link: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
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
    this._dataService.get(Global.BASE_USER_ENDPOINT + "Category/getAll").subscribe(res => {
      debugger;
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toastr.error(res.errors[0], "Category Master");
      }
    });
  }

  upload(files: any) {
    if (files.length === 0) {
      return;
    }
    let type = files[0].type;

    if (type.match(/image\/*/) == null) {
      this._toastr.error("Only images are supported !!", "BrandLogo Master");
      this.myFile.nativeElement.value = "";
      return;
    }

    this.fileToUpload = files[0];
  }


  onSubmit() {
    debugger;
    if (this.dbops === 1 && !this.fileToUpload) {
      this._toastr.error("Please upload image !!", "Category Master");
      return;
    }

    let formdata = new FormData();
    formdata.append("Id", this.addForm.controls["Id"].value);
    formdata.append("Name", this.addForm.controls["name"].value);
    formdata.append("Title", this.addForm.controls["title"].value);
    formdata.append("IsSave", this.addForm.controls["isSave"].value);
    formdata.append("Link", this.addForm.controls["link"].value);

    if (this.fileToUpload) {
      formdata.append("Image", this.fileToUpload, this.fileToUpload.name);
    }


    switch (this.dbops) {
      case DbOperation.create:
        this.addForm.controls["Id"].setValue(0);
        this._dataService.postImages(Global.BASE_USER_ENDPOINT + "Category/Save/", formdata).subscribe(res => {
          debugger;
          if (res.isSuccess) {
            this.getData();
            this._toastr.success("Data saved successfully !!", "Category Master");
            this.elname.select('Viewtab');
            this.cancelForm();
          } else {
            this._toastr.info(res.errors[0], "Category Master");
          }
        });
        break;
      case DbOperation.update:
        this._dataService.postImages(Global.BASE_USER_ENDPOINT + "Category/Update/",formdata).subscribe(res => {
          if (res.isSuccess) {
            this.getData();
            this._toastr.success("Data updated successfully !!", "Category Master");
            this.elname.select('Viewtab');
            this.cancelForm();
          } else {
            this._toastr.info(res.errors[0], "Category Master");
          }
        });
        break;
    }
  }

  Edit(Id: number) {
    debugger;
    this.dbops = DbOperation.update;
    debugger;
    this.elname.select('Addtab');
    this.buttonText = "Update";
    this.objRow = this.objRows.find(x => x.id == Id);
    this.addForm.controls["Id"].setValue(this.objRow.id);
    this.addForm.controls["name"].setValue(this.objRow.name);
    this.addForm.controls["title"].setValue(this.objRow.title);
    this.addForm.controls["link"].setValue(this.objRow.link);

    this.addForm.controls["isSave"].setValue(this.objRow.isSave );
  }

  Delete(Id: number) {
    debugger;
    let obj = { id: Id };
    this._dataService.post(Global.BASE_USER_ENDPOINT + "Category/Delete/", obj).subscribe(res => {
      if (res.isSuccess) {
        this.getData();
        this._toastr.success("Data deleted successfully !!", "Category Master");
      } else {
        this._toastr.info(res.errors[0], "Category Master");
      }
    });
  }

  cancelForm() {
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
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
