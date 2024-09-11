import {
  HorizontalbarChartLongitudinalityMock,
  HorizontalBarChartMock,
} from '../../../../charts/src/HorizontalBarChart';
import { HorizontalBarChart } from './../../../../charts/src/HorizontalBarChart/HorizontalBarChart';
import type { Meta, StoryObj } from '@storybook/react';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Charts/HorizontalBarChart',
  component: HorizontalBarChart,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
} satisfies Meta<typeof HorizontalBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    width: 500,
    height: 300,
    title: 'Age',
    data: HorizontalBarChartMock,
    header: 'Range',
    columnTwo: true,
    columnTwoHeader: 'Percentage',
    columnTwoDataType: 'PercentageOfTotal',
    showValues: true,
    events: false,
    showCard: true,
    sort: null,
  },
};

export const Longitudinality: Story = {
  args: {
    width: 500,
    height: 300,
    title: 'Longitudinality',
    data: HorizontalbarChartLongitudinalityMock,
    header: 'Range',
    columnTwo: true,
    columnTwoHeader: 'Percentage',
    columnTwoDataType: 'PercentageOfMax',
    showValues: true,
    events: false,
    showCard: true,
  },
};
