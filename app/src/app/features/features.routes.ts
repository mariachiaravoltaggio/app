import { Routes } from "@angular/router";
import { CreaConvivenza } from "./gestionaleCN/crea.convivevenza";
import { CreaViaggio } from "./gestionaleCN/crea.viaggio";


 export default [
         {
        path: 'kanban',
        loadComponent: () => import('./gestionaleCN/kanban').then((c) => c.Kanban),
        data: { breadcrumb: 'Kanban' }
    },
      { path: 'crea-viaggio', component: CreaViaggio, data: { breadcrumb: 'Viaggio' } }
     //     { path: 'empty', component: Empty },
     //     { path: 'invoice', component: Invoice, data: { breadcrumb: 'Invoice' } },
     //     { path: 'aboutus', component: AboutUs },
     //     { path: 'help', component: Help, data: { breadcrumb: 'Help' } },
     //     { path: 'contact', component: ContactUs },
     //     { path: '**', redirectTo: '/notfound' }
 ] as Routes;
