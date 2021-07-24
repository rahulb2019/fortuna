import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CumulativeReportComponent } from './cumulative_report/cumulative_report.component';
import { SummaryReportComponent } from './summary_report/summary_report.component';



const routes: Routes = [
  {
    path: 'cumulative_reports',
    component: CumulativeReportComponent
  },
  {
    path: 'summary_reports',
    component: SummaryReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
