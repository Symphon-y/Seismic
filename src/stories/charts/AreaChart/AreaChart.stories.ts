import type { Meta, StoryObj } from '@storybook/react';
import { AreaChart } from '../../../../charts/src/AreaChart/AreaChart';
import { AreaChartMock_MixedFormats } from '../../../../charts/src/AreaChart/AreaChartMock';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Charts/AreaChart',
  component: AreaChart,
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
} satisfies Meta<typeof AreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    title: 'Newly Eligible Patients by Year',
    data: AreaChartMock_MixedFormats,
    width: 800,
    height: 280,
    curve: true,
    showLabels: false,
    events: false,
    showCard: true,
  },
};
