import React from 'react';
import {
  AnimatedAreaSeries,
  AnimatedAxis,
  AnimatedGrid,
  Tooltip,
  XYChart,
  GlyphSeries,
} from '@visx/xychart';
import { curveMonotoneX } from '@visx/curve';
import { Text } from '@visx/text';

const font =
  'Inter,ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji';
const fontSize = '.875rem';
const titleFontSize = '1.125rem';
const titleLineHeight = '1.5rem';
const titleFontWeight = '500';
const titleHeight = 2 * 16;
const tickLabelOffset = 10;

import { AreaChartMock_CurveBug as AreaChartMock } from './AreaChartMock';
import { Curve } from '@visx/visx';
import { ChartValue, ChartValues } from '../ChartTypes';

type AreaChartProps = {
  width?: number;
  height?: number;
  title?: string;
  events?: boolean;
  data?: ChartValues;
  curve?: boolean;
  showLabels?: boolean;
  showCard?: boolean;
  formatValue?: (value: number) => string;
};

const customPaper = {
  paddingTop: '1rem',
  borderRadius: '.5rem',
  boxShadow: `0px 1px 3px rgba(0, 0, 0, 0.2),
                0px 1px 1px rgba(0, 0, 0, 0.14),
                0px 2px 1px rgba(0, 0, 0, 0.12)`,
  backgroundColor: '#fff',
};

const chartContainerStyle = {
  fontFamily: 'Untitled Sans, sans-serif',
};

const axisTickStyle = {
  fontSize: '12px',
  fontWeight: 400,
  fill: '#666666',
};

const coloredSquareStyle = (color: string) => ({
  display: 'inline-block',
  width: '11px',
  height: '11px',
  marginRight: '8px',
  background: color,
  borderRadius: '4px',
});

const tooltipContainerStyle = {
  padding: '8px 16px',
  fontSize: '12px',
  borderRadius: '4px',
  color: '#222222',
  zIndex: 1000,
};

const dateStyle = {
  fontSize: '12px',
  marginBottom: '8px',
  color: '#222222',
  fontWeight: 600,
};

const valueStyle = {
  display: 'flex',
  alignItems: 'center',
  fontWeight: 400,
  color: '#000000',
};

export const AreaChart = ({
  title = 'Area Chart',
  data = AreaChartMock,
  width = 800,
  height = 300,
  curve = true,
  showLabels = false,
  showCard = true,
  formatValue,
}: AreaChartProps) => {
  // Data Accessors
  const accessors = {
    xAccessor: (d: ChartValue) => {
      const label = d.Label;

      let result;

      // Regex patterns to match different date formats
      const yearPattern = /^\d{4}$/;
      const yearMonthPattern = /^\d{4}-\d{2}$/;
      const fullDatePattern = /^\d{4}-\d{2}-\d{2}$/;
      const iso8601Pattern =
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;

      if (yearPattern.test(label)) {
        // Handle year only, e.g., "2024"
        result = new Date(parseInt(label), 0, 1);
      } else if (yearMonthPattern.test(label)) {
        // Handle year and month, e.g., "2024-08"
        const [year, month] = label.split('-').map(Number);
        result = new Date(year, month - 1, 1);
      } else if (fullDatePattern.test(label)) {
        // Handle full date, e.g., "2024-08-14"
        result = new Date(label);
      } else if (iso8601Pattern.test(label)) {
        // Handle ISO 8601 datetime formats, e.g., "2024-08-14T06:35:24.069331+00:00"
        result = new Date(label);
      } else {
        // Fallback: attempt to parse any other formats
        result = new Date(label);
      }

      // Check if the parsed date is valid
      if (isNaN(result.getTime())) {
        throw new Error(`Invalid date format: ${label}`);
      }

      return result;
    },
    yAccessor: (d: ChartValue) => d.Value,
  };

  // Extract unique Y-values
  const uniqueYValues = [...new Set(data.map(accessors.yAccessor))];

  // Data Formatters

  // Date Formatter for Chart Labels
  const dateFormatter = (date: Date) => {
    const options: {
      year: 'numeric' | '2-digit' | undefined;
      month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow' | undefined;
      day?: 'numeric' | '2-digit' | undefined;
    } = { year: 'numeric' };
    if (date.getMonth() > 0) {
      options.month = 'short';
    }
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  // Tooltip Date Formatter for Detailed Information
  const tooltipDateFormatter = (date: Date) => {
    const options: {
      year: 'numeric' | '2-digit' | undefined;
      month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow' | undefined;
      day?: 'numeric' | '2-digit' | undefined;
    } = {
      year: 'numeric',
      month: 'short',
    };

    if (date.getDate() > 1) {
      options.day = 'numeric';
    }
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const style = showCard
    ? { ...customPaper, ...chartContainerStyle, width, height }
    : { ...chartContainerStyle, width, height };

  return (
    <div style={{ ...style }}>
      <XYChart
        height={270}
        margin={{ left: 60, top: 35, bottom: 35, right: showLabels ? 50 : 35 }}
        xScale={{ type: 'time' }}
        yScale={{
          type: 'linear',
          nice: true,
          zero: false,
        }}>
        <Text
          x={24}
          y={titleHeight / 2}
          fill='#374151'
          fontFamily={font}
          fontSize={titleFontSize}
          fontWeight={titleFontWeight}
          lineHeight={titleLineHeight}>
          {title}
        </Text>
        {/* Define the gradient */}
        <svg>
          <defs>
            <linearGradient
              id='line-gradient'
              x1='0%'
              y1='0%'
              x2='0%'
              y2='100%'>
              <stop offset='0%' stopColor='#3b82f6' stopOpacity={0.8} />
              <stop offset='100%' stopColor='#3b82f6' stopOpacity={0} />
            </linearGradient>
          </defs>
        </svg>
        {/* Horizontal Grid Lines */}
        <AnimatedGrid
          columns={false}
          numTicks={uniqueYValues.length}
          lineStyle={{
            stroke: 'rgba(29,29,29, .1)',
            strokeLinecap: 'round',
            strokeWidth: 1,
          }}
          strokeDasharray='0'
        />
        {/* Bottom Labels */}
        <AnimatedAxis
          hideAxisLine
          hideTicks
          orientation='bottom'
          numTicks={4}
          tickFormat={(d) => dateFormatter(new Date(d))}
          tickLabelProps={() => ({
            dy: tickLabelOffset,
            style: axisTickStyle,
          })}
        />
        {/* Left Labels */}
        <AnimatedAxis
          hideAxisLine
          hideTicks
          orientation='left'
          numTicks={4}
          tickLabelProps={() => ({
            dx: -10,
            style: axisTickStyle,
          })}
        />

        <AnimatedAreaSeries
          dataKey='primary_line'
          data={data}
          {...accessors}
          curve={curve ? curveMonotoneX : Curve.curveLinear}
          lineProps={{ stroke: '#3b82f6' }}
          fill='url(#line-gradient)'
          strokeWidth={2}
        />
        {/* Add GlyphSeries for Dots */}
        {showLabels ? (
          <GlyphSeries
            dataKey='glyphs'
            data={data}
            {...accessors}
            renderGlyph={(props) => (
              <>
                <circle
                  r={4}
                  fill='#3b82f6'
                  stroke='#ffffff'
                  strokeWidth={2}
                  cx={props.x}
                  cy={props.y}
                />
                <Text
                  key={props.x}
                  x={props.x + 25}
                  y={props.y + 5}
                  fill='#292929'
                  fontFamily={font}
                  fontSize={12}
                  textAnchor='middle'>
                  {formatValue
                    ? formatValue(accessors.yAccessor(props.datum))
                    : accessors.yAccessor(props.datum)}
                </Text>
              </>
            )}
          />
        ) : (
          <Tooltip
            snapTooltipToDatumX
            snapTooltipToDatumY
            showSeriesGlyphs
            glyphStyle={{
              fill: '#3b82f6',
              strokeWidth: 0,
            }}
            renderTooltip={({ tooltipData }) => {
              return (
                <div style={tooltipContainerStyle}>
                  {tooltipData &&
                    Object.entries(tooltipData.datumByKey).map(
                      (lineDataArray) => {
                        const [key, value] = lineDataArray;
                        const datum = value.datum as ChartValue;

                        return (
                          <div className='row' key={key}>
                            <div style={dateStyle}>
                              {tooltipDateFormatter(accessors.xAccessor(datum))}
                            </div>
                            <div style={valueStyle}>
                              <div style={coloredSquareStyle('#3b82f6')} />
                              {formatValue
                                ? formatValue(accessors.yAccessor(datum))
                                : accessors.yAccessor(datum)}
                            </div>
                          </div>
                        );
                      }
                    )}
                </div>
              );
            }}
          />
        )}
      </XYChart>
    </div>
  );
};
