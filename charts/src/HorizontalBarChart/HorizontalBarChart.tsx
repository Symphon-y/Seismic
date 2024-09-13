import React, { useMemo, useState } from 'react';
import { Text } from '@visx/text';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { HorizontalBarDataColumnType } from './HorizontalBarChartTypes';
import { HorizontalBarChartMock } from './HorizontalBarChartMock';
import { ChartValue, ChartValues } from '../ChartTypes';

const font =
  'Inter,ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji';
const fontSize = '.875rem';
const lineHeight = '1.25rem';
const titleFontSize = '1.125rem';
const titleLineHeight = '1.5rem';
const titleFontWeight = '500';
const titleHeight = 2 * 16;
const margin = 24;
const barHeight = 32;
const gapHeight = 4;
const borderRadius = 4;
const headerHeight = 32;

type HorizontalBarChartProps = {
  width: number;
  height: number;
  title?: string;
  data?: ChartValues;
  header?: string;
  columnTwo?: boolean;
  columnTwoHeader?: string;
  columnTwoDataType?: HorizontalBarDataColumnType;
  showValues?: boolean;
  showCard?: boolean;
  sort?: 'Ascending' | 'Descending' | null;
  formatValue?: (value: number) => string;
  events?: boolean;
};

const customPaper = {
  borderRadius: '.5rem',
  boxShadow: `0px 1px 3px rgba(0, 0, 0, 0.2),
              0px 1px 1px rgba(0, 0, 0, 0.14),
              0px 2px 1px rgba(0, 0, 0, 0.12)`,
  backgroundColor: '#fff',
};

export const HorizontalBarChart = ({
  title = 'Website Analytics',
  width,
  height,
  events = false,
  data = HorizontalBarChartMock,
  columnTwo = false,
  header = 'Source',
  columnTwoHeader = 'Percentage',
  columnTwoDataType = 'PercentageOfTotal',
  showValues = false,
  showCard = true,
  sort = null,
  formatValue,
}: HorizontalBarChartProps) => {
  let percentColumnWidth = 32;
  if (columnTwoDataType !== 'Count') {
    percentColumnWidth = 64;
  }

  const additionalHeightFactor = data.length > 5 ? data.length - 5 : 0;
  const actualHeight =
    height + additionalHeightFactor * (barHeight + gapHeight);
  // accessors
  const getLabel = (d: ChartValue) => d.Label;
  const getValue = (d: ChartValue) => Number(d.Value);
  const totalValue = data.reduce((acc, d) => acc + getValue(d), 0);

  // Get the width of the longest label in the right column
  const longestLabelWidth = Math.max(...data.map((d) => getLabel(d).length));

  // Adjust bounds to accommodate the percentage column
  const xMax = columnTwo
    ? width - 2 * margin - percentColumnWidth
    : width - 2 * margin;

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [0, xMax - percentColumnWidth - longestLabelWidth],
        round: true,
        domain: [0, Math.max(...data.map(getValue))],
      }),
    [xMax]
  );

  // Sort data
  if (sort === 'Ascending') {
    data.sort((a, b) => getValue(a) - getValue(b));
  } else if (sort === 'Descending') {
    data.sort((a, b) => getValue(b) - getValue(a));
  }

  return width < 10 ? null : (
    <svg
      width={width}
      height={actualHeight}
      style={
        showCard
          ? {
              ...customPaper,
            }
          : {}
      }>
      <rect
        x={margin}
        y={margin}
        width={width - 2 * margin}
        height={height - 2 * margin}
        fill='white'
        rx={14}
      />
      <Group left={margin} top={margin}>
        <Text
          x={0}
          y={titleHeight / 2}
          fill='#374151'
          fontFamily={font}
          fontSize={titleFontSize}
          fontWeight={titleFontWeight}
          lineHeight={titleLineHeight}>
          {title}
        </Text>
        <Text
          x={0}
          y={titleHeight + headerHeight / 2}
          dy='.35em'
          fill='#374151'
          fontFamily={font}
          fontSize={fontSize}
          fontWeight='regular'
          lineHeight={lineHeight}>
          {header}
        </Text>
        {columnTwo && (
          <Text
            x={xMax + percentColumnWidth}
            y={titleHeight + headerHeight / 2}
            dy='.35em'
            fill='#374151'
            fontFamily={font}
            fontSize={fontSize}
            fontWeight='regular'
            lineHeight={lineHeight}
            textAnchor='end'>
            {columnTwoHeader}
          </Text>
        )}
        {data.map((d, i) => {
          const label = getLabel(d);
          const barWidth = xScale(getValue(d)) ?? 0;
          const barY = titleHeight + headerHeight + i * (barHeight + gapHeight);

          let columnTwoValue: string | number = '';
          // Check if the columnTwoDataType is 'Count'
          if (columnTwoDataType === 'Count') {
            // If true, set columnTwoValue to the raw value of the data point (d)
            columnTwoValue = formatValue
              ? formatValue(getValue(d))
              : getValue(d);
            // Check if the columnTwoDataType is 'PercentageOfTotal'
          } else if (columnTwoDataType === 'PercentageOfTotal') {
            // If true, calculate the percentage of the data point's value (d) as part of the total value.
            // The calculation is: (value of d / total value of all data points) * 100
            // .toFixed(2) rounds the result to 2 decimal places, and '%' is appended to indicate it's a percentage
            columnTwoValue =
              ((getValue(d) / totalValue) * 100).toFixed(2) + '%';

            // Check if the columnTwoDataType is PercentageOfMax'
          } else if (columnTwoDataType === 'PercentageOfMax') {
            // If true, calculate the percentage of the data point's value (d) relative to the maximum value in the dataset.
            // The calculation is: (value of d / maximum value in the dataset) * 100
            // .toFixed(2) rounds the result to 2 decimal places, and '%' is appended to indicate it's a percentage
            columnTwoValue =
              ((getValue(d) / Math.max(...data.map(getValue))) * 100).toFixed(
                2
              ) + '%';
          }

          // If showValues is true, display raw value with percentage
          if (columnTwoDataType !== 'Count' && showValues) {
            columnTwoValue = formatValue
              ? `${formatValue(getValue(d))} (${columnTwoValue})`
              : `${getValue(d)} (${columnTwoValue})`;
          }

          return (
            <Group key={`bar-${label}`}>
              <rect
                x={0}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill='#c1dbfd'
                rx={borderRadius}
                ry={borderRadius}
                onClick={() => {
                  if (events)
                    alert(`clicked: ${JSON.stringify(Object.values(d))}`);
                }}
              />
              <Text
                x={8}
                y={barY + barHeight / 2}
                dy='.35em'
                fill='#374151'
                fontFamily={font}
                fontSize={fontSize}
                fontWeight='regular'
                lineHeight={lineHeight}>
                {label}
              </Text>
              {columnTwo && columnTwoValue && (
                <Text
                  x={xMax + percentColumnWidth}
                  y={barY + barHeight / 2}
                  dy='.35em'
                  fill='#374151'
                  fontFamily={font}
                  fontSize={fontSize}
                  fontWeight='regular'
                  lineHeight={lineHeight}
                  textAnchor='end'>
                  {typeof columnTwoValue === 'number'
                    ? formatValue
                      ? formatValue(columnTwoValue)
                      : columnTwoValue
                    : columnTwoValue}
                </Text>
              )}
            </Group>
          );
        })}
      </Group>
    </svg>
  );
};
