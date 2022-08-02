import { Component, OnInit, OnDestroy } from '@angular/core';
import { DbOperation } from 'src/app/shared/db-operation';
import { DataService } from 'src/app/shared/services/data.service';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Global } from 'src/app/shared/global';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit, OnDestroy {

  objRows = [];
  objRow: any;

  constructor(private _dataService: DataService, private _toastr: ToastrService,
    private navRoute: Router) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this._dataService.get(Global.BASE_USER_ENDPOINT + "UserMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toastr.info(res.errors[0], "User Master");
      }
    });
  }


  Edit(Id: number) {
    this.navRoute.navigate(['/users/create-user'], { queryParams: { userId: Id } });
  }

  Delete(Id: number) {
    let obj = { id: Id };
    this._dataService.post(Global.BASE_USER_ENDPOINT + "UserMaster/Delete/", obj).subscribe(res => {
      if (res.isSuccess) {
        this.getData();
        this._toastr.success("Data deleted successfully !!", "User Master");
      } else {
        this._toastr.info(res.errors[0], "User Master");
      }
    });
  }

  ngOnDestroy() {
    this.objRow = null;
    this.objRows = null;
  }
}
