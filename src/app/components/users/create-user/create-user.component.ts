import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { MustMatchValidator } from 'src/app/Validators/validations.validator';
import { Global } from 'src/app/shared/global';
import { DbOperation } from 'src/app/shared/db-operation';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit, OnDestroy {

  submitted: boolean = false;
  userForm: FormGroup;
  objUserTypes = [];
  buttonText: string;
  dbops: DbOperation;
  userId: number = 0;
  objRow: any;

  constructor(private _dataService: DataService, private _fb: FormBuilder, private _toastr: ToastrService,
    private navRoute: Router, private route: ActivatedRoute) {

    this.route.queryParams.subscribe(params => {
      // this.userId = params.userId;
      this.userId = params['userId'];
    });
  }

  ngOnInit(): void {
    this.SetFromState();
    this.getUserType();
    if (this.userId != null && this.userId > 0) {
      this.dbops = DbOperation.update;
      this.buttonText = "Update";
      this.getUserbyId();
    }
  }

  SetFromState() {
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";

    this.userForm = this._fb.group({
      Id: [0],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userTypeId: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    },
      {
        validator: MustMatchValidator('password', 'confirmPassword')
      }
    );
  }

  get f() {
    return this.userForm.controls;
  }


  getUserType() {
    this._dataService.get(Global.BASE_USER_ENDPOINT + "UserType/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objUserTypes = res.data;
      } else {
        this._toastr.info(res.errors[0], "User Master");
      }
    });
  }

  getUserbyId() {
    this._dataService.get(Global.BASE_USER_ENDPOINT + "UserMaster/GetbyId/" + this.userId).subscribe(res => {
      if (res.isSuccess) {
        this.objRow = res.data;
        this.userForm.controls['Id'].setValue(this.objRow.id);
        this.userForm.controls['firstName'].setValue(this.objRow.firstName);
        this.userForm.controls['lastName'].setValue(this.objRow.lastName);
        this.userForm.controls['email'].setValue(this.objRow.email);
        this.userForm.controls['userTypeId'].setValue(this.objRow.userTypeId);
      } else {
        this._toastr.info(res.errors[0], "User Master");
      }
    });
  }

  onSubmit(formData: any) {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    
    switch (this.dbops) {
      case DbOperation.create:
        this._dataService.post(Global.BASE_USER_ENDPOINT + "UserMaster/Save/", formData.value).subscribe(res => {
          if (res.isSuccess) {
           
            this._toastr.success("Account has been created successfully !!", "User Master");
            this.navRoute.navigate(['/users/list-user']);
          } else {
            this._toastr.info(res.errors[0], "User Master");
          }
        });
        break;

      case DbOperation.update:
        this._dataService.post(Global.BASE_USER_ENDPOINT + "UserMaster/Update/", formData.value).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success("Account has been updated successfully !!", "User Master");
            this.navRoute.navigate(['/users/list-user']);
          } else {
            this._toastr.info(res.errors[0], "User Master");
          }
        });
        break;
    }
  }

  ngOnDestroy() {
    this.objRow = null;
    this.objUserTypes = null;
  }

}
