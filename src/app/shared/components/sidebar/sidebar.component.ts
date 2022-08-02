import { Component, OnInit } from '@angular/core';
import { NavService, Menu } from '../../services/nav.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  menuItems: Menu[];
  fullName: string;
  userType: string;

  constructor(public _navService: NavService) {
    this.menuItems = _navService.MENUITEMS;
  }

  ngOnInit(): void {
    this.fullName = "Ajeet Kumar Singh";
    this.userType = "Admin";
  }


  // Click toggle menu
  toggleNavActive(item: any) {
    item.active = !item.active;
  }


}
