import { Injectable } from '@angular/core';

// Menu
export interface Menu {
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  active?: boolean;
  children?: Menu[];
}

@Injectable({
  providedIn: 'root'
})
export class NavService {

  collapseSidebar: boolean = false;
  constructor() { }

  MENUITEMS: Menu[] = [
    { path: '/dashboard/default', title: 'Dashboard', icon: 'home', type: 'link', active: true },
    {
      title: 'Products', icon: 'box', type: 'sub', active: false, children: [
        {
          title: 'Physical', type: 'sub', children: [
            { path: '/products/physical/product-list', title: 'Product List', type: 'link' },
            { path: '/products/physical/add-product', title: 'Add Product', type: 'link' }
          ]
        }
      ]
    },
    {
      title: 'Sales', icon: 'dollar-sign', type: 'sub', active: false, children: [
        { path: '/sales/orders', title: 'Orders', type: 'link' },
        { path: '/sales/transactions', title: 'Transactions', type: 'link' }
      ]
    },
    {
      title: 'Masters', icon: 'clipboard', type: 'sub', active: false, children: [
        { path: '/masters/brandlogo', title: 'Brand Logo', type: 'link' },
        { path: '/masters/category', title: 'Category', type: 'link' },
        { path: '/masters/color', title: 'Color', type: 'link' },
        { path: '/masters/size', title: 'Size', type: 'link' },
        { path: '/masters/tag', title: 'Tag', type: 'link' },
        { path: '/masters/usertype', title: 'User Type', type: 'link' }
      ]
    },
    {
      title: 'Users', icon: 'user-plus', type: 'sub', active: false, children: [
        { path: '/users/list-user', title: 'User List', type: 'link' },
        { path: '/users/create-user', title: 'Create User', type: 'link' }
      ]
    },
    { path: '/reports', title: 'Reports', icon: 'bar-chart', type: 'link', active: false },
    {
      title: 'Settings', icon: 'settings', type: 'sub', active: false, children: [
        { path: '/settings/profile', title: 'Profile', type: 'link' }
      ]
    },
    { path: '/invoice', title: 'Invoice', icon: 'archive', type: 'link', active: false },
    { path: '/auth/login', title: 'Logout', icon: 'log-in', type: 'link', active: false }
  ];

}
