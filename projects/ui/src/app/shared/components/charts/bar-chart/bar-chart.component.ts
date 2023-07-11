import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType, Plugin } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import * as R from 'ramda';
export const CHART_GRID_COLOR = '#28afb044';
export const CHART_COLORS = [
  '#7692ff66',
  '#fc004b66',
  '#78e3aa66',
  '#EE964B66',
  '#bc2cc166',
  '#F4D35E66',
  '#938BA166',
  '#4b819e66',
  '#F886A866',
  '#606c3866',
  '#FF4A1C66',
  '#5C5D8D66',
  '#fff44f66',
  '#7e655166',
  '#2C073566',
  '#fecef166',
  '#ABCB5266',
  '#611c3566',
  '#06514366',
  '#8C1C1366',
  '#b26e6366'
];

export const LegendPaddingPlugin: Plugin = {
  beforeInit(chart: any) {
    // Get a reference to the original fit function
    const originalFit = chart.legend.fit;

    // Override the fit function
    chart.legend.fit = function fit() {
      // Call the original function and bind scope in order to use `this` correctly inside it
      originalFit.bind(chart.legend)();
      // Change the height as suggested in other answers
      this.height += 25;
    };
  },
  id: 'legend_padding_plugin'
}

@Component({
  selector: 'dddapp-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  private _barChartData: ChartData<'bar'> = {
    labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
    datasets: [
      { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
      { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
    ]
  };
  @Input()
  set barChartData(chartData: ChartData<'bar'>){
    this._barChartData = {
      labels: chartData.labels,
      datasets: chartData.datasets.map(({data, label}, i) => {
        return {
          data,
          label,
          backgroundColor: CHART_COLORS[i],
          hoverBackgroundColor: CHART_COLORS[i].substring(0, CHART_COLORS[i].length - 2)
        }
      })
    };
  }
  get barChartData(): ChartData<'bar'> {
    return this._barChartData;
  }

  private _isPercentage: boolean = false;

  @Input()
  set isPercentage(is: boolean){
    this._isPercentage = is;
    this._barChartOptions = {
      ...this.barChartOptions,
      plugins: {
        ...this.barChartOptions?.plugins,
        datalabels: {
          ...this.barChartOptions?.plugins?.datalabels,
          formatter(value) {
            return `${value}%`;
          },
        },
      },
      scales: {
        ...(this.barChartOptions && this.barChartOptions.scales ? this.barChartOptions.scales : {}),
        y: {
          ticks: {
            color: '#ffffff',
          },
          min: 0,
          ...(this.barChartOptions && this.barChartOptions.scales ? this.barChartOptions.scales['y'] : {}),
          ...(this.barChartOptions?.scales?['y'] && this.barChartOptions?.scales['y']?.type !== 'logarithmic' ? {
            grace: 1,
            suggestedMin: 0,
            ...(is ? {
              max: 100,
              ticks: {
                color: '#ffffff',
                callback(tickValue, index, ticks) {
                return `${tickValue}%`;
              },
            }
            } : {}),
          } : {} : {}),
        },
        x: {
          ticks: {
            color: '#ffffff',
          },
          grid: {
            display: true,
            color: CHART_GRID_COLOR
          },
        }
      }
    };
  }
  get isPercentage(): boolean {
    return this._isPercentage;
  }

  private _barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    color: '#ffffff',
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          textAlign: 'center',
          padding: 20
        }
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#ffffff',
      }
    },
    scales: {
      y: {
        ticks: {
          color: '#ffffff',
        },
        grid: {
          display: true,
          color: CHART_GRID_COLOR
        },
      },
      x: {
        ticks: {
          color: '#ffffff',
        },
        grid: {
          display: true,
          color: CHART_GRID_COLOR
        },
      }
    },
    layout: {
      padding: 10,
    },
  };

  @Input()
  public set barChartOptions(newOptions: ChartConfiguration<'bar'>['options']) {
    this._barChartOptions = { ...this._barChartOptions, ...newOptions};
  }
  public get barChartOptions(): ChartConfiguration<'bar'>['options'] {
    return this._barChartOptions;
  }
  public barChartPlugins = [
    DataLabelsPlugin,
    LegendPaddingPlugin,
  ];

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }

  // public randomize(): void {
  //   // Only Change 3 values
  //   this.barChartData.datasets[0].data = [
  //     Math.round(Math.random() * 100),
  //     59,
  //     80,
  //     Math.round(Math.random() * 100),
  //     56,
  //     Math.round(Math.random() * 100),
  //     40 ];

  //   this.chart?.update();
  // }
}
