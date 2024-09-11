import {
  HorizontalbarChartLongitudinalityMock,
  HorizontalBarChartMock,
} from '../../../../charts/src/HorizontalBarChart';
import { PieChart } from '../../../../charts/src/PieChart/PieChart';
import type { Meta, StoryObj } from '@storybook/react';
import {
  PieChartMock,
  PieChartOuterMock,
} from '../../../../charts/src/PieChart/PieChartMock';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Charts/PieChart',
  component: PieChart,
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
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    title: 'Pie Chart',
    width: 500,
    height: 325,
    data: PieChartMock,
    showOuterChart: true,
    showInnerChart: true,
    outerChartData: PieChartOuterMock,
    animate: true,
    margin: {
      top: 24,
      right: 24,
      bottom: 24,
      left: 24,
    },
    innerColors: [
      'rgba(59,130,246, 0.7)',
      'rgba(59,130,246, 0.6)',
      'rgba(59,130,246, 0.5)',
      'rgba(59,130,246, 0.4)',
      'rgba(59,130,246, 0.3)',
      'rgba(59,130,246, 0.2)',
      'rgba(59,130,246, 0.1)',
    ],
    outerColors: [
      'rgba(59,130,246,1)',
      'rgba(59,130,246,0.8)',
      'rgba(59,130,246,0.6)',
      'rgba(59,130,246,0.4)',
    ],
    showCard: true,
    legend: true,
  },
};
