import { Routes } from "@angular/router";

export const content: Routes = [
    { path: 'dashboard', loadChildren: () => import('../../components/dashboard/dashboard.module').then(m => m.DashboardModule) },
    { path: 'products', loadChildren: () => import('../../components/products/products.module').then(m => m.ProductsModule) },
    { path: 'sales', loadChildren: () => import('../../components/sales/sales.module').then(m => m.SalesModule) },
    { path: 'masters', loadChildren: () => import('../../components/masters/masters.module').then(m => m.MastersModule) },
    { path: 'users', loadChildren: () => import('../../components/users/users.module').then(m => m.UsersModule) },
    { path: 'reports', loadChildren: () => import('../../components/reports/reports.module').then(m => m.ReportsModule) },
    { path: 'settings', loadChildren: () => import('../../components/settings/settings.module').then(m => m.SettingsModule) },
    { path: 'invoice', loadChildren: () => import('../../components/invoice/invoice.module').then(m => m.InvoiceModule) },
];