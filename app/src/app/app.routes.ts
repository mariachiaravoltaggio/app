import { Routes } from '@angular/router';
import { AppLayout } from './layout/components/app.layout';

export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: '',
                loadComponent: () => import('@/features/dashboards/dashboard').then((c) => c.Dashboard),
                data: { breadcrumb: 'Gestione Viaggi e Incontri' }
            },
            {
                path: 'dashboard',
                loadComponent: () => import('@/features/dashboards/dashboard').then((c) => c.Dashboard),
                data: { breadcrumb: 'Banking Dashboard' }
            },
            {
                path: 'gestionale-cn',
                loadChildren: () => import('@/features/features.routes'),
                data: { breadcrumb: 'Gestionale' }
            },
            {
                path: 'profile',
                loadChildren: () => import('@/features//gestionaleCN/gestionale.routes'),
                data: { breadcrumb: 'Gestione Partecipanti' }
            }
        ]
    }
];

        /*  
            {
                path: 'uikit',
                data: { breadcrumb: 'UI Kit' },
                loadChildren: () => import('@/pages/uikit/uikit.routes')
            },
            {
                path: 'documentation',
                data: { breadcrumb: 'Documentation' },
                loadComponent: () => import('@/pages/documentation/documentation').then((c) => c.Documentation)
            },
            {
                path: 'pages',
                loadChildren: () => import('@/pages/pages.routes'),
                data: { breadcrumb: 'Pages' }
            },
            {
                path: 'apps',
                loadChildren: () => import('@/apps/apps.routes'),
                data: { breadcrumb: 'Apps' }
            },

            {
                path: 'blocks',
                data: { breadcrumb: 'Free Blocks' },
                loadComponent: () => import('@/pages/blocks/blocks').then((c) => c.Blocks)
            },
            {
                path: 'ecommerce',
                loadChildren: () => import('@/pages/ecommerce/ecommerce.routes'),
                data: { breadcrumb: 'E-Commerce' }
            },
            {
                path: 'profile',
                loadChildren: () => import('@/pages/usermanagement/usermanagement.routes'),
                data: { breadcrumb: 'User Management' }
            }
        ]
    },
    { path: 'landing', loadComponent: () => import('@/pages/landing/landing').then((c) => c.Landing) },
    { path: 'notfound', loadComponent: () => import('@/pages/notfound/notfound').then((c) => c.Notfound) },
    { path: 'notfound2', loadComponent: () => import('@/pages/notfound/notfound2').then((c) => c.Notfound2) },
    {
        path: 'auth',
        loadChildren: () => import ('@/pages/auth/auth.routes')
    },
    { path: '**', redirectTo: '/notfound' }*/
