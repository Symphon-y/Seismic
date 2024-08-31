import { ChartValues } from '../ChartTypes';

export const AreaChartMock_YearOnly: ChartValues = [
  { Label: '2017', Value: 1278 },
  { Label: '2018', Value: 2041 },
  { Label: '2019', Value: 2642 },
  { Label: '2020', Value: 2994 },
  { Label: '2021', Value: 3428 },
  { Label: '2022', Value: 3588 },
  { Label: '2023', Value: 3505 },
  { Label: '2024', Value: 2847 },
];

export const AreaChartMock_YearMonth: ChartValues = [
  { Label: '2017-01', Value: 1278 },
  { Label: '2017-02', Value: 1300 },
  { Label: '2017-03', Value: 1250 },
  { Label: '2017-04', Value: 1400 },
  { Label: '2017-05', Value: 1500 },
  { Label: '2017-06', Value: 1600 },
  { Label: '2017-07', Value: 1700 },
  { Label: '2017-08', Value: 1800 },
  { Label: '2017-09', Value: 1900 },
  { Label: '2017-10', Value: 2000 },
  { Label: '2017-11', Value: 2100 },
  { Label: '2017-12', Value: 2200 },
];

export const AreaChartMock_FullDate: ChartValues = [
  { Label: '2017-01-01', Value: 1278 },
  { Label: '2017-01-02', Value: 1280 },
  { Label: '2017-01-03', Value: 1275 },
  { Label: '2017-01-04', Value: 1290 },
  { Label: '2017-01-05', Value: 1300 },
  { Label: '2017-01-06', Value: 1310 },
  { Label: '2017-01-07', Value: 1320 },
  { Label: '2017-01-08', Value: 1330 },
  { Label: '2017-01-09', Value: 1340 },
  { Label: '2017-01-10', Value: 1350 },
];

export const AreaChartMock_ISO8601: ChartValues = [
  { Label: '2017-01-01T00:00:00.000Z', Value: 1278 },
  { Label: '2017-01-02T12:30:45.123Z', Value: 1280 },
  { Label: '2017-01-03T06:15:30.456Z', Value: 1275 },
  { Label: '2017-01-04T18:45:15.789Z', Value: 1290 },
  { Label: '2017-01-05T09:00:00.000Z', Value: 1300 },
  { Label: '2017-01-06T23:59:59.999Z', Value: 1310 },
  { Label: '2017-01-07T08:20:10.500Z', Value: 1320 },
  { Label: '2017-01-08T14:35:25.250Z', Value: 1330 },
  { Label: '2017-01-09T19:50:40.750Z', Value: 1340 },
  { Label: '2017-01-10T03:05:55.375Z', Value: 1350 },
];

export const AreaChartMock_MixedFormats: ChartValues = [
  { Label: '2017', Value: 1278 }, // Year only
  { Label: '2018-02', Value: 2041 }, // Year and month
  { Label: '2019-03-15', Value: 2642 }, // Full date
  { Label: '2020-04-20T10:30:00.000Z', Value: 2994 }, // ISO 8601 datetime
  { Label: '2021-05', Value: 3428 }, // Year and month
  { Label: '2022-06-25', Value: 3588 }, // Full date
  { Label: '2023-07-30T15:45:30.500Z', Value: 3505 }, // ISO 8601 datetime
  { Label: '2024', Value: 2847 }, // Year only
];
