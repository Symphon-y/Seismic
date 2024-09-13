import React, { useEffect, useState } from 'react';
import Pie, { ProvidedProps, PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { scaleOrdinal } from '@visx/scale';
import { Group } from '@visx/group';
import { animated, useTransition, interpolate } from '@react-spring/web';
import { ChartValue } from '../ChartTypes';
import { PieChartMock } from './PieChartMock';
import { Text } from '@visx/text';
import { Tooltip, useTooltip, TooltipWithBounds } from '@visx/tooltip';

const font =
  'Inter,ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji';
const fontSize = '.875rem';
const lineHeight = '1.25rem';
const titleFontSize = '1.125rem';
const titleLineHeight = '1.5rem';
const titleFontWeight = '500';
const titleHeight = 2 * 16;
const margin = 24;
const legendSpacing = 16;

// accessor functions
const getLabel = (d: ChartValue) => d.Label;
const getValue = (d: ChartValue): number => d.Value as number;
const getAllLabels = (data: ChartValue[]) => data.map(getLabel);

interface ExtendedDatum {
  Label: string;
  Value: number;
}

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

const coloredSquareStyle = (color: string) => ({
  display: 'inline-block',
  width: '11px',
  height: '11px',
  marginRight: '8px',
  background: color,
  borderRadius: '4px',
});

const pColors = [
  'rgba(59,130,246, 0.7)',
  'rgba(59,130,246, 0.6)',
  'rgba(59,130,246, 0.5)',
  'rgba(59,130,246, 0.4)',
  'rgba(59,130,246, 0.3)',
  'rgba(59,130,246, 0.2)',
  'rgba(59,130,246, 0.1)',
];

const dColors = [
  'rgba(59,130,246,1)',
  'rgba(59,130,246,0.8)',
  'rgba(59,130,246,0.6)',
  'rgba(59,130,246,0.4)',
];

const defaultMargin = { top: 24, right: 24, bottom: 24, left: 24 };

export type PieProps = {
  title: string;
  width: number;
  height: number;
  data: ChartValue[];
  margin?: typeof defaultMargin;
  animate?: boolean;
  showPieChart?: boolean;
  showDonutChart?: boolean;
  donutChartData?: ChartValue[];
  showCard?: boolean;
  pieColors?: string[];
  donutColors?: string[];
  legend?: boolean;
  showValues?: boolean;
  formatValue?: (value: number) => string;
};

export const PieChart = ({
  title = 'Pie Chart',
  width,
  height,
  data = PieChartMock,
  margin = defaultMargin,
  animate = true,
  showDonutChart = false,
  showPieChart = true,
  donutChartData = PieChartMock,
  showCard = true,
  pieColors = pColors,
  donutColors = dColors,
  legend = true,
  showValues = true,
  formatValue = (value: number) => value.toString(),
}: PieProps) => {
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<{ label: string; value: number; index: number }>();

  const [selectedPieSlice, setSelectedPieSlice] = useState<string | null>(null);
  const [selectedDonutSlice, setSelectedDonutSlice] = useState<string | null>(
    null
  );

  const getPieColor = (
    label: string,
    labels: string[],
    colors: string[] = pieColors
  ) => {
    const colorScale = scaleOrdinal({
      domain: labels,
      range: colors,
    });
    console.log(colorScale(label));
    return colorScale(label);
  };

  const getDonutColors = (
    label: string,
    labels: string[],
    colors: string[] = donutColors
  ) => {
    const colorScale = scaleOrdinal({
      domain: labels,
      range: colors,
    });
    return colorScale(label);
  };

  const PieLabels = getAllLabels(data);
  const DonutLabels = getAllLabels(donutChartData);

  if (width < 10) return null;

  const PieWidth = width - margin.left - margin.right;
  const PieHeight = height - margin.top - margin.bottom;
  const radius = Math.min(PieWidth, PieHeight) / 2;
  const centerY = PieHeight / 2;
  const centerX = PieWidth / 2;
  const DonutChartThickness = 50;

  const customPaper = {
    borderRadius: '.5rem',
    boxShadow: `0px 1px 3px rgba(0, 0, 0, 0.2),
                0px 1px 1px rgba(0, 0, 0, 0.14),
                0px 2px 1px rgba(0, 0, 0, 0.12)`,
    backgroundColor: '#fff',
  };

  return (
    <div style={{ position: 'relative' }}>
      <svg
        width={width}
        height={height + titleHeight}
        style={showCard ? { ...customPaper } : {}}>
        <rect
          rx={14}
          width={width}
          height={height + titleHeight}
          fill='white'
        />
        <Group left={margin.left} top={margin.right}>
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
        </Group>
        <Group
          top={centerY + margin.top + titleHeight}
          left={centerX + margin.left}>
          {showDonutChart && (
            <Pie
              data={
                selectedDonutSlice
                  ? donutChartData.filter(
                      ({ Label }) => Label === selectedDonutSlice
                    )
                  : donutChartData
              }
              pieValue={getValue}
              outerRadius={radius}
              innerRadius={radius - DonutChartThickness}
              cornerRadius={3}
              padAngle={0.005}>
              {(pie) => (
                <AnimatedPie<ChartValue>
                  {...pie}
                  tooltipData={tooltipData}
                  tooltipLeft={tooltipLeft}
                  tooltipTop={tooltipTop}
                  tooltipOpen={tooltipOpen}
                  showTooltip={showTooltip}
                  hideTooltip={hideTooltip}
                  height={height}
                  width={width}
                  animate={animate}
                  getKey={(arc) => arc.data.Label}
                  onClickDatum={({ data: { Label } }) =>
                    animate &&
                    setSelectedDonutSlice(
                      selectedDonutSlice && selectedDonutSlice === Label
                        ? null
                        : Label
                    )
                  }
                  getColor={(arc) =>
                    getDonutColors(arc.data.Label, DonutLabels)
                  }
                  selectedSlice={selectedDonutSlice}
                />
              )}
            </Pie>
          )}
          {showPieChart && (
            <Pie
              data={
                selectedPieSlice
                  ? data.filter(({ Label }) => Label === selectedPieSlice)
                  : data
              }
              pieValue={getValue}
              pieSortValues={() => -1}
              outerRadius={
                showDonutChart ? radius - DonutChartThickness * 1.3 : radius
              }>
              {(pie) => (
                <AnimatedPie<ChartValue>
                  {...pie}
                  tooltipData={tooltipData}
                  tooltipLeft={tooltipLeft}
                  tooltipTop={tooltipTop}
                  tooltipOpen={tooltipOpen}
                  showTooltip={showTooltip}
                  hideTooltip={hideTooltip}
                  height={height}
                  width={width}
                  animate={animate}
                  getKey={({ data: { Label } }) => Label}
                  onClickDatum={({ data: { Label } }) =>
                    animate &&
                    setSelectedPieSlice(
                      selectedPieSlice && selectedPieSlice === Label
                        ? null
                        : Label
                    )
                  }
                  getColor={({ data: { Label } }) =>
                    getPieColor(Label, PieLabels)
                  }
                  showValues={showValues}
                  formatValue={formatValue}
                  selectedSlice={selectedPieSlice}
                />
              )}
            </Pie>
          )}
        </Group>

        {/* Legend */}
        {legend && (
          <Group top={height - margin.bottom - 55} left={18}>
            {PieLabels.map((label, i) => (
              <g
                key={`legend-${label}`}
                transform={`translate(0, ${i * legendSpacing})`}>
                <rect
                  width={16}
                  height={16}
                  fill={getPieColor(label, PieLabels)}
                />
                <Text
                  x={20}
                  y={12}
                  fontFamily={font}
                  fontSize={fontSize}
                  fill='#374151'>
                  {label}
                </Text>
              </g>
            ))}
          </Group>
        )}
      </svg>
      {/* Tooltip */}
      {!showValues && tooltipData && (
        <TooltipWithBounds
          top={tooltipTop ? tooltipTop + height / 2 : 0}
          left={tooltipLeft ? tooltipLeft + width / 2 : 0}>
          <div style={tooltipContainerStyle}>
            {tooltipData && (
              <>
                <div style={dateStyle}>{tooltipData.label}</div>
                <div style={valueStyle}>
                  <div
                    style={coloredSquareStyle(
                      getPieColor(tooltipData.label, PieLabels)
                    )}
                  />
                  {formatValue
                    ? formatValue(tooltipData.value)
                    : tooltipData.value}
                </div>
              </>
            )}
          </div>
        </TooltipWithBounds>
      )}
    </div>
  );
};

// react-spring transition definitions
type AnimatedStyles = { startAngle: number; endAngle: number; opacity: number };

const fromLeaveTransition = ({ endAngle }: PieArcDatum<any>) => ({
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});
const enterUpdateTransition = ({ startAngle, endAngle }: PieArcDatum<any>) => ({
  startAngle,
  endAngle,
  opacity: 1,
});

type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
  animate?: boolean;
  getKey: (d: PieArcDatum<Datum>) => string;
  getColor: (d: PieArcDatum<Datum>) => string;
  onClickDatum: (d: PieArcDatum<Datum>) => void;
  delay?: number;
  height: number;
  width: number;
  tooltipData: { label: string; value: number } | undefined;
  tooltipLeft: number | undefined;
  tooltipTop: number | undefined;
  tooltipOpen: boolean;
  showTooltip: (args: {
    tooltipData: { label: string; value: number; index: number };
    tooltipLeft: number;
    tooltipTop: number;
  }) => void;
  hideTooltip: () => void;
};

function AnimatedPie<Datum extends ExtendedDatum>({
  animate,
  arcs,
  path,
  getKey,
  getColor,
  onClickDatum,
  showValues,
  formatValue,
  height,
  width,
  tooltipData,
  tooltipLeft,
  tooltipTop,
  tooltipOpen,
  showTooltip,
  hideTooltip,
  selectedSlice,
}: AnimatedPieProps<Datum> & {
  showValues?: boolean;
  formatValue?: (value: number) => string;
  selectedSlice: string | null;
}) {
  const transitions = useTransition<PieArcDatum<Datum>, AnimatedStyles>(arcs, {
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    keys: getKey,
  });

  return transitions((props, arc, { key }) => {
    const [centroidX, centroidY] = path.centroid(arc);
    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;
    const isSelected = arc.data.Label === selectedSlice;

    return (
      <>
        <g key={key}>
          <animated.path
            d={interpolate(
              [props.startAngle, props.endAngle],
              (startAngle, endAngle) => path({ ...arc, startAngle, endAngle })
            )}
            fill={getColor(arc)}
            onClick={() => onClickDatum(arc)}
            onTouchStart={() => onClickDatum(arc)}
            onMouseEnter={() => {
              console.log({ arc });
              showTooltip({
                tooltipData: {
                  label: arc.data.Label,
                  value: arc.data.Value,
                  index: arc.index,
                },
                tooltipTop: centroidY,
                tooltipLeft: centroidX,
              });
            }}
            onMouseLeave={hideTooltip}
          />
          {hasSpaceForLabel && (
            <animated.g style={{ opacity: props.opacity }}>
              <text
                fill='white'
                x={centroidX}
                y={centroidY}
                dy='.33em'
                fontSize={9}
                textAnchor='middle'
                pointerEvents='none'>
                {showValues
                  ? formatValue
                    ? `${arc.data.Label} (${formatValue(arc.data.Value as number)})`
                    : `${arc.data.Label} (${arc.data.Value})`
                  : arc.data.Label}
                {isSelected
                  ? `${arc.data.Label}: (${formatValue ? formatValue(arc.data.Value) : arc.data.Value})`
                  : showValues
                    ? arc.data.Label
                    : ''}
              </text>
            </animated.g>
          )}
        </g>
      </>
    );
  });
}
