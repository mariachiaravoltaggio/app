import { Routes } from "@angular/router";
import { CreaConvivenza } from "./gestionaleCN/crea.convivevenza";
import { CreaViaggio } from "./gestionaleCN/crea.viaggio";


 export default [
     { path: 'crea-convivenza', component: CreaConvivenza, data: { breadcrumb: 'Gestionale Convivenza' } },
      { path: 'crea-viaggio', component: CreaViaggio, data: { breadcrumb: 'Viaggio' } }
     //     { path: 'empty', component: Empty },
     //     { path: 'invoice', component: Invoice, data: { breadcrumb: 'Invoice' } },
     //     { path: 'aboutus', component: AboutUs },
     //     { path: 'help', component: Help, data: { breadcrumb: 'Help' } },
     //     { path: 'contact', component: ContactUs },
     //     { path: '**', redirectTo: '/notfound' }
 ] as Routes;
