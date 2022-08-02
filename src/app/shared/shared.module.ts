import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from './components/feather-icons/feather-icons.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BreadcrumbComponent, FeatherIconsComponent, FooterComponent, HeaderComponent, SidebarComponent, ContentLayoutComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [FeatherIconsComponent]
})
export class SharedModule { }
