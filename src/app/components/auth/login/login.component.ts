import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { DataService } from 'src/app/shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { MustMatchValidator } from 'src/app/Validators/validations.validator';
import { Global } from 'src/app/shared/global';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  submitted: boolean = false;
  loginForm: FormGroup;
  registerForm: FormGroup;
  strMsg: string;

  @ViewChild('tabset') elname: any;

  constructor(private _authService: AuthService, private _dataService: DataService, private _fb: FormBuilder, private _toastr: ToastrService) {
    this.strMsg = "";
    this._authService.logout();
  }

  ngOnInit(): void {
    this.createLoginForm();
    this.createRegisterFrom();
  }

  createLoginForm() {
    this.loginForm = this._fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  createRegisterFrom() {
    this.registerForm = this._fb.group({
      Id: [0],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userTypeId: [1],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    },
      {
        validator: MustMatchValidator('password', 'confirmPassword')
      }
    );
  }

  get f() {
    return this.registerForm.controls;
  }

  onLogin() {
    if (this.loginForm.valid) {
      this._dataService.post(Global.BASE_USER_ENDPOINT + "UserMaster/Login/", this.loginForm.value).subscribe(res => {
        if (res.isSuccess) {
          this._authService.login(res.data);
          this.strMsg = this._authService.getMessage();
          if (this.strMsg != "") {
            this._toastr.error(this.strMsg, "Login");
            this.reset();
          }
        } else {
          this._toastr.error("Invalid Username and Password", "Login");
        }
      });
    } else {
      this._toastr.error("Invalid Username and Password", "Login");
    }

  }

  reset() {
    this.loginForm.controls['userName'].setValue('');
    this.loginForm.controls['password'].setValue('');
  }

  onRegisterSubmit(formData: any) {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this._dataService.post(Global.BASE_USER_ENDPOINT + "UserMaster/Save/", formData.value).subscribe(res => {
      if (res.isSuccess) {
        this._toastr.success("Account has been created successfully !!", "User Master");
        this.elname.select('logintab');
      } else {
        this._toastr.info(res.errors[0], "User Master");
      }
    });
  }

}
