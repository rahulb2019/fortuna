import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {Dashboard1Component} from './dashboards/dashboard1/dashboard1.component';
import {Dashboard2Component} from './dashboards/dashboard2/dashboard2.component';
import {AnalyticsComponent} from './dashboards/analytics/analytics.component';
import {WebAnalyticsComponent} from './dashboards/web-analytics/web-analytics.component';
import {TrackingComponent} from './dashboards/tracking/tracking.component';
import {TicketBookingComponent} from './dashboards/ticket-booking/ticket-booking.component';
import { CalendarComponent } from './calendar/calendar.component';
import { PatientComponent } from './dashboards/patient/patient.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: Dashboard1Component
  },
  {
    path: 'dashboard2',
    component: Dashboard2Component
  },
  {
    path: 'analytics',
    component: AnalyticsComponent
  },
  {
    path: 'web-analytics',
    component: WebAnalyticsComponent
  },
  {
    path: 'tracking',
    component: TrackingComponent
  },
  {
    path: 'ticket-booking',
    component: TicketBookingComponent
  },
  {
    path: 'calendar',
    component: CalendarComponent
  },
  {
    path: 'patient',
    component: PatientComponent
  },
  {
    path: 'core',
    children: [
      {
        path: '',
        loadChildren: () => import('../views/core/core.module').then(m => m.CoreModule),
      }
    ]
  },
  {
    path: 'forms',
    children: [
      {
        path: '',
        loadChildren: () => import('../views/forms/forms.module').then(m => m.FormsModule),
      }
    ]
  },
  {
    path: 'table',
    children: [
      {
        path: '',
        loadChildren: () => import('../views/table/table.module').then(m => m.TableModule),
      }
    ]
  },
  {
    path: 'charts',
    children: [
      {
        path: '',
        loadChildren: () => import('../views/charts/charts.module').then(m => m.ChartsModule),
      }
    ]
  },
  {
    path: 'icons',
    children: [
      {
        path: '',
        loadChildren: () => import('../views/icons/icons.module').then(m => m.IconsModule),
      }
    ]
  },
  {
    path: 'extra-pages',
    children: [
      {
        path: '',
        loadChildren: () => import('../views/pages/pages.module').then(m => m.PagesModule),
      }
    ]
  },
  {
    path: 'maps',
    children: [
      {
        path: '',
        loadChildren: () => import('../views/maps/maps.module').then(m => m.MapsModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewsRoutingModule { }
