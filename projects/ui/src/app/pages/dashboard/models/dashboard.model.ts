import { ChartConfiguration, ChartData } from "chart.js";

export const EmptyTargetDatasetsPerState: ChartData<'bar'> = {
  labels: [ 'Cele' ],
  datasets: [
    { data: [ 0 ], label: 'Zrealizowane'},
    { data: [ 0 ], label: 'W trakcie'},
    { data: [ 0 ], label: 'Nie zrealizowane'},
  ]
}

export const EmptyTargetDatasetsProgress: ChartData<'bar'> = {
  labels: [ 'Realizacja celów' ],
  datasets: []
}

export const EmptyTasksDatasetsPerState: ChartData<'bar'> = {
  labels: [ 'Zadania' ],
  datasets: EmptyTargetDatasetsPerState.datasets,
}

export const EmptyTasksDatasetsPerType: ChartData<'bar'> = {
  labels: [ 'Zadania' ],
  datasets:
  [
    { data: [ 0 ], label: 'Jednorazowe' },
    { data: [ 0 ], label: 'W trakcie'},
    { data: [ 0 ], label: 'Nie zrealizowane '}
  ],
}

export const EmptyTargetsProgress: ChartConfiguration<'line'>['data'] = {
  labels: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July'
  ],
  datasets: [
    {
      data: [ 65, 59, 80, 81, 56, 55, 40 ],
      label: 'Series A',
      fill: false,
      tension: 0.5,
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)'
    }
  ]
};

export const BaseLineDatasetContent = {
  fill: false,
  tension: 0.5,
}
