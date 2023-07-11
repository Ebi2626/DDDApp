import { Component, Input, ViewChild } from '@angular/core';
import { ChartData, ChartConfiguration, ChartType, ChartEvent, Plugin, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { CHART_COLORS, CHART_GRID_COLOR, LegendPaddingPlugin } from '../bar-chart/bar-chart.component';


@Component({
  selector: 'dddapp-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent {
  title = 'ng2-charts-demo';
  private _lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [],
  };

  @Input()
  public set lineChartData(chartData: ChartConfiguration<'line'>['data']) {
    this._lineChartData = {
      labels: chartData.labels,
      datasets: chartData.datasets.map(({data, label}, i) => ({
        data,
        label,
        borderColor: CHART_COLORS[i],
        backgroundColor: CHART_COLORS[i],
      }))
    };
  }
  get lineChartData(): ChartConfiguration<'line'>['data'] {
    return this._lineChartData;
  }
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    color: '#ffffff',
    scales: {
      y: {
        min: 0,
        ticks: {
          color: '#ffffff',
        },
        grid: {
          color: CHART_GRID_COLOR
        }
      },
    x: {
      ticks: {
        color: '#ffffff',
      },
      grid: {
        color: CHART_GRID_COLOR,
      }
    },
  },
    layout: {
      padding: 10,
    }
  };
  public lineChartLegend = true;
  public lineChartPlugins = [
    DataLabelsPlugin,
    LegendPaddingPlugin,
  ];

  constructor() {
  }

  ngOnInit() {
  }
}
