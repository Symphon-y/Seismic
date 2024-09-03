import React, { useState } from 'react';
import Pie, { ProvidedProps, PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { scaleOrdinal } from '@visx/scale';
import { Group } from '@visx/group';
import { animated, useTransition, interpolate } from '@react-spring/web';
import { ChartValue } from '../ChartTypes';
import { PieChartMock } from './PieChartMock';
import { Text } from '@visx/text';

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
const percentColumnWidth = 60;

// accessor functions
const getLabel = (d: ChartValue) => d.Label;
const getValue = (d: ChartValue): number => d.Value as number;
const getAllLabels = (data: ChartValue[]) => data.map(getLabel);
const getAllValues = (data: ChartValue[]) => data.map(getValue);

const innerColors = [
  'rgba(59,130,246, 0.7)',
  'rgba(59,130,246, 0.6)',
  'rgba(59,130,246, 0.5)',
  'rgba(59,130,246, 0.4)',
  'rgba(59,130,246, 0.3)',
  'rgba(59,130,246, 0.2)',
  'rgba(59,130,246, 0.1)',
];

const outerColors = [
  'rgba(59,130,246,1)',
  'rgba(59,130,246,0.8)',
  'rgba(59,130,246,0.6)',
  'rgba(59,130,246,0.4)',
];

const getInnerColor = (
  label: string,
  labels: string[],
  colors: string[] = innerColors
) => {
  const colorScale = scaleOrdinal({
    domain: labels,
    range: colors,
  });
  return colorScale(label);
};

const getOuterColors = (
  label: string,
  labels: string[],
  colors: string[] = outerColors
) => {
  const colorScale = scaleOrdinal({
    domain: labels,
    range: colors,
  });
  return colorScale(label);
};

const defaultMargin = { top: 24, right: 24, bottom: 24, left: 24 };

export type PieProps = {
  title: string;
  width: number;
  height: number;
  data: ChartValue[];
  margin?: typeof defaultMargin;
  animate?: boolean;
  showInnerChart?: boolean;
  showOuterChart?: boolean;
  outerChartData?: ChartValue[];
};

export const PieChart = ({
  title = 'Pie Chart',
  width,
  height,
  data = PieChartMock,
  margin = defaultMargin,
  animate = true,
  showOuterChart = false,
  showInnerChart = true,
  outerChartData = PieChartMock,
}: PieProps) => {
  const [selectedInnerSlice, setSelectedInnerSlice] = useState<string | null>(
    null
  );
  const [selectedOuterSlice, setSelectedOuterSlice] = useState<string | null>(
    null
  );

  const innerLabels = getAllLabels(data) || ([] as ChartValue[]);
  const outerLabels = getAllLabels(outerChartData);

  if (width < 10) return null;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const donutThickness = 50;
  const customPaper = {
    borderRadius: '.5rem',
    boxShadow: `0px 1px 3px rgba(0, 0, 0, 0.2),
                0px 1px 1px rgba(0, 0, 0, 0.14),
                0px 2px 1px rgba(0, 0, 0, 0.12)`,
    backgroundColor: '#fff',
  };
  return (
    <svg
      width={width}
      height={height + titleHeight}
      style={{
        ...customPaper,
      }}>
      <rect
        rx={14}
        width={width}
        height={height + titleHeight}
        fill='white' // Background Fill
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
        {showOuterChart && (
          <Pie
            data={
              selectedOuterSlice
                ? outerChartData.filter(
                    ({ Label }: ChartValue) => Label === selectedOuterSlice
                  )
                : outerChartData
            }
            pieValue={getValue}
            outerRadius={radius}
            innerRadius={radius - donutThickness}
            cornerRadius={3}
            padAngle={0.005}>
            {(pie) => (
              <AnimatedPie<ChartValue>
                {...pie}
                animate={animate}
                getKey={(arc) => arc.data.Label}
                onClickDatum={({ data: { Label } }) =>
                  animate &&
                  setSelectedOuterSlice(
                    selectedOuterSlice && selectedOuterSlice === Label
                      ? null
                      : Label
                  )
                }
                getColor={(arc) => getOuterColors(arc.data.Label, outerLabels)}
              />
            )}
          </Pie>
        )}
        {showInnerChart && (
          <Pie
            data={
              selectedInnerSlice
                ? data.filter(({ Label }) => Label === selectedInnerSlice)
                : data
            }
            pieValue={getValue}
            pieSortValues={() => -1}
            outerRadius={radius - donutThickness * 1.3}>
            {(pie) => (
              <AnimatedPie<ChartValue>
                {...pie}
                animate={animate}
                getKey={({ data: { Label } }) => Label}
                onClickDatum={({ data: { Label } }) =>
                  animate &&
                  setSelectedInnerSlice(
                    selectedInnerSlice && selectedInnerSlice === Label
                      ? null
                      : Label
                  )
                }
                getColor={({ data: { Label } }) =>
                  getInnerColor(Label, innerLabels)
                }
              />
            )}
          </Pie>
        )}
      </Group>
      {animate && (
        <text
          textAnchor='end'
          x={width - 16}
          y={height - 16}
          fill='white'
          fontSize={11}
          fontWeight={300}
          pointerEvents='none'>
          Click segments to update
        </text>
      )}
    </svg>
  );
};

// react-spring transition definitions
type AnimatedStyles = { startAngle: number; endAngle: number; opacity: number };

const fromLeaveTransition = ({ endAngle }: PieArcDatum<any>) => ({
  // enter from 360° if end angle is > 180°
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
};

function AnimatedPie<Datum>({
  animate,
  arcs,
  path,
  getKey,
  getColor,
  onClickDatum,
}: AnimatedPieProps<Datum>) {
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

    return (
      <g key={key}>
        <animated.path
          // compute interpolated path d attribute from intermediate angle values
          d={interpolate(
            [props.startAngle, props.endAngle],
            (startAngle, endAngle) =>
              path({
                ...arc,
                startAngle,
                endAngle,
              })
          )}
          fill={getColor(arc)}
          onClick={() => onClickDatum(arc)}
          onTouchStart={() => onClickDatum(arc)}
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
              {getKey(arc)}
            </text>
          </animated.g>
        )}
      </g>
    );
  });
}
