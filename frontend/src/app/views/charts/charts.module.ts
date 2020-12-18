import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SofboxModule} from '../../components/sofbox/sofbox.module';
import { ChartsRoutingModule } from './charts-routing.module';
import { MorrisChartComponent } from './morris-chart/morris-chart.component';
import { ChartHighComponent } from './chart-high/chart-high.component';
import { ChartAmComponent } from './chart-am/chart-am.component';
import { ChartApexComponent } from './chart-apex/chart-apex.component';


@NgModule({
  declarations: [MorrisChartComponent, ChartHighComponent, ChartAmComponent, ChartApexComponent],
  imports: [
    CommonModule,
    ChartsRoutingModule,
    SofboxModule
  ],
  exports: [MorrisChartComponent, ChartHighComponent, ChartAmComponent, ChartApexComponent]
})
export class ChartsModule { }
