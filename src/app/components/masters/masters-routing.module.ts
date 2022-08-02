import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { ColorComponent } from './color/color.component';
import { TagComponent } from './tag/tag.component';
import { SizeComponent } from './size/size.component';
import { BrandlogoComponent } from './brandlogo/brandlogo.component';
import { UsertypeComponent } from './usertype/usertype.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: 'category', component: CategoryComponent },
      { path: 'color', component: ColorComponent },
      { path: 'tag', component: TagComponent },
      { path: 'size', component: SizeComponent },
      { path: 'brandlogo', component: BrandlogoComponent },
      { path: 'usertype', component: UsertypeComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
