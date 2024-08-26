import {
    AnimatedAreaSeries,
    AnimatedAxis,
    AnimatedGrid,
    Tooltip,
    XYChart,
    GlyphSeries
} from '@visx/xychart';
import { curveMonotoneX } from '@visx/curve';
import { Text } from '@visx/text';
import styled from '@emotion/styled';

const font =
    'Inter,ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji';
const fontSize = '.875rem';
const titleFontSize = '1.125rem';
const titleLineHeight = '1.5rem';
const titleFontWeight = '500';
const titleHeight = 2 * 16;
const tickLabelOffset = 10;

import React from 'react';
import { AreaChartMock } from './AreaChartMock';
import { Curve } from '@visx/visx';
import { ChartValue, ChartValues } from '../ChartTypes';

export type BarsProps = {
    width?: number;
    height?: number;
    title?: string;
    events?: boolean;
    data?: ChartValues;
    curve?: boolean;
    showLabels: boolean;
};

const customPaper = {
    paddingTop: '1rem',
    borderRadius: '.5rem',
    boxShadow: `0px 1px 3px rgba(0, 0, 0, 0.2),
                0px 1px 1px rgba(0, 0, 0, 0.14),
                0px 2px 1px rgba(0, 0, 0, 0.12)`,
    backgroundColor: '#fff',
};

const AreaChart = ({
    title = 'Area Chart',
    data = AreaChartMock,
    width = 800,
    height = 300,
    curve = true,
    showLabels = false,
}: BarsProps) => {
    // Data Accessors
    const accessors = {
        xAccessor: (d: ChartValue) => new Date(parseInt(d.Label), 0, 1), // Convert year string to Date
        yAccessor: (d: ChartValue) => d.Value,
    };

    // Extract unique Y-values
    const uniqueYValues = [...new Set(data.map(accessors.yAccessor))];
    console.log({ uniqueYValues })
    // Data Formatters
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
    });

    const tooltipDateFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
    });
    console.log({ data });
    return (
        <ChartContainer style={{ ...customPaper, width, height }}>
            <XYChart
                height={270}
                margin={{ left: 60, top: 35, bottom: 35, right: showLabels ? 50 : 35  }}
                xScale={{ type: 'time' }}
                yScale={{ type: 'linear' }}>
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
                    // numTicks={4}
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
                    // tickValues={uniqueYValues}
                    tickFormat={(d) => dateFormatter.format(new Date(d))}
                    // tickFormat={(d) => format(d, `MMM yy`)}
                    tickLabelProps={() => ({
                        dy: tickLabelOffset,
                        style: {
                            fill: 'rgba(29,29,29, 0.5)',
                            fontFamily: font,
                            fontSize: fontSize,
                        },
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
                        style: {
                            fill: 'rgba(29,29,29, 0.5)',
                            fontFamily: font,
                            fontSize: fontSize,
                        },
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
                {showLabels ? <GlyphSeries
                    dataKey="glyphs"
                    data={data}
                    {...accessors}
                    renderGlyph={(props) => (
                        <>
                            <circle
                                r={4}
                                fill="#3b82f6"
                                stroke="#ffffff"
                                strokeWidth={2}
                                cx={props.x}
                                cy={props.y}
                            />
                            <Text
                                key={props.x}
                                x={props.x + 25}
                                y={props.y + 5} 
                                fill="#292929"
                                fontFamily={font}
                                fontSize={12}
                                textAnchor="middle">
                                {accessors.yAccessor(props.datum)}
                            </Text>
                        </>

                    )}
                /> :
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
                            <TooltipContainer>
                                {tooltipData &&
                                    Object.entries(tooltipData.datumByKey).map(
                                        (lineDataArray) => {
                                            const [key, value] = lineDataArray;
                                            const datum = value.datum as ChartValue;

                                            return (
                                                <div className='row' key={key}>
                                                    <div className='date'>
                                                        {tooltipDateFormatter.format(
                                                            accessors.xAccessor(datum)
                                                        )}
                                                    </div>
                                                    <div className='value'>
                                                        <ColoredSquare color='#3b82f6' />
                                                        {accessors.yAccessor(datum)}
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                            </TooltipContainer>
                        );
                    }}
                />}
            </XYChart>
        </ChartContainer>
    );
};

export default AreaChart;

const ChartContainer = styled.div`
    text {
      font-family: 'Untitled Sans', sans-serif;
    }
  
    .visx-axis-tick {
      text {
        font-size: 12px;
        font-weight: 400;
        fill: #666666;
      }
    }
  `;

const ColoredSquare = styled.div`
    display: inline-block;
    width: 11px;
    height: 11px;
    margin-right: 8px;
    background: ${({ color }) => color};
    border-radius: 4px;
  `;

const TooltipContainer = styled.div`
    padding: 8px 16px;
    font-size: 12px;
    border-radius: 4px;
    color: #222222;
  
    .date {
      font-size: 12px;
      margin-bottom: 8px;
      color: #222222;
      font-weight: 600;
    }
    .value {
      display: flex;
      align-items: center;
      font-weight: 400;
      color: #000000;
    }
  `;
