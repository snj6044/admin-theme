import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MastersRoutingModule } from './masters-routing.module';
import { BrandlogoComponent } from './brandlogo/brandlogo.component';
import { CategoryComponent } from './category/category.component';
import { ColorComponent } from './color/color.component';
import { TagComponent } from './tag/tag.component';
import { SizeComponent } from './size/size.component';
import { UsertypeComponent } from './usertype/usertype.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import {NgxDatatableModule  } from '@swimlane/ngx-datatable';
import {CKEditorModule} from 'ngx-ckeditor';

@NgModule({
  declarations: [BrandlogoComponent, CategoryComponent, ColorComponent, TagComponent, SizeComponent, UsertypeComponent],
  imports: [
    CommonModule,
    MastersRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
    NgxDatatableModule,
    CKEditorModule
  ]
})
export class MastersModule { }
