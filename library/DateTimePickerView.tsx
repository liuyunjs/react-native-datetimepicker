import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import dayjs, { Dayjs } from 'dayjs';
import { useReactCallback } from '@liuyunjs/hooks/lib/useReactCallback';
import { useReactionState } from '@liuyunjs/hooks/lib/useReactionState';
import { PickerView } from 'react-native-repicker';
import { BasePicker, Mode } from './BasePicker';

export type DateTimePickerViewProps = Omit<
  React.ComponentProps<typeof PickerView>,
  'onChange' | 'data' | 'selected'
> & {
  maximum?: Dayjs;
  minimum?: Dayjs;
  date?: Dayjs;
  onChange?: (date: Dayjs) => void;
} & (
    | {
        mode?: Mode;
      }
    | {
        mode: 'custom';
        custom: [Mode, string][];
      }
  );

const unitAndFormats = [
  ['year', 'YYYY'],
  ['month', 'MM'],
  ['date', 'DD'],
  ['hour', 'HH'],
  ['minute', 'mm'],
  ['second', 'ss'],
  ['millisecond', 'SSS'],
] as [Mode, string][];

const unitMap: Record<Mode, number> = unitAndFormats.reduce(
  (previousValue, currentValue, index) => {
    previousValue[currentValue[0]] = index;
    return previousValue;
  },
  {} as any,
);

const createRange = (
  date: Dayjs,
  maximum: Dayjs,
  minimum: Dayjs,
  getUnit: Mode,
) => {
  let start: number;
  let end: number;

  const unitIndex = unitMap[getUnit];

  const sameUnit =
    unitAndFormats[unitIndex - 1] && unitAndFormats[unitIndex - 1][0];

  if (unitIndex) {
    const unit = unitAndFormats[unitIndex][0];
    start = date.startOf(sameUnit).get(unit);
    end = date.endOf(sameUnit).get(unit);
  }

  if (!unitIndex || !sameUnit || date.isSame(minimum, sameUnit)) {
    start = minimum.get(getUnit);
  }

  if (!unitIndex || !sameUnit || date.isSame(maximum, sameUnit)) {
    end = maximum.get(getUnit);
  }

  return { start: start!, end: end! };
};

const clamp = (minimum: Dayjs, maximum: Dayjs, unit: Mode, date?: Dayjs) => {
  if (!date) return minimum;
  return date.isBefore(minimum, unit)
    ? minimum
    : date.isAfter(maximum, unit)
    ? maximum
    : date;
};

const getUnit = (custom: [Mode, string][]) => {
  return custom.reduce((previousValue: Mode, currentValue) => {
    if (process.env.NODE_ENV !== 'production') {
      // @ts-ignore
      if (!Array.isArray(currentValue) && currentValue.length !== 2) {
        throw new TypeError('custom props error');
      }
      if (!(currentValue[0] in unitMap)) {
        throw new TypeError('custom props error');
      }
    }
    return unitAndFormats[
      Math.max(unitMap[previousValue], unitMap[currentValue[0]])
    ][0];
  }, unitAndFormats[0][0]);
};

const preparse = (
  mode: Mode | 'custom',
  custom?: [Mode, string][],
): [[Mode, string][], Mode] => {
  const unitIndex = unitMap[mode as Mode];
  if (unitIndex != null) {
    custom = unitAndFormats.slice(0, unitIndex + 1);
    return [custom, getUnit(custom)];
  }

  if (mode === 'custom') {
    if (!custom) throw new Error('custom mode 必须右 custom prop');

    return [custom, getUnit(custom)];
  }
  throw new Error('unknown mode');
};

export const DateTimePickerView: React.FC<DateTimePickerViewProps> = ({
  onChange,
  maximum,
  minimum,
  date,
  // @ts-ignore
  custom,
  mode,
  ...rest
}) => {
  const [list, unit] = preparse(mode!, custom);

  // @ts-ignore
  const [clipDate, setClipDate] = useReactionState(
    clamp(minimum!, maximum!, unit, date),
  );

  const onChangeCallback = useReactCallback(
    (m: Mode, { value }: { value: number; label: number | string }) => {
      if (clipDate.get(m) === value) return;
      const unitIndex = unitMap[m];
      const len = unitAndFormats.length;

      let d = clipDate.set(m, value);
      for (let i = unitIndex; i < len; i++) {
        const currentUnit = unitAndFormats[i][0];
        if (d.isBefore(minimum, currentUnit)) {
          d = d.set(currentUnit, minimum!.get(currentUnit));
        } else if (d.isAfter(maximum, currentUnit)) {
          d = d.set(currentUnit, maximum!.get(currentUnit));
        }
      }

      setClipDate(d);
      onChange?.(d);
    },
  );

  return (
    <View style={styles.container}>
      {list.map((item) => {
        const { start, end } = createRange(
          clipDate,
          maximum!,
          minimum!,
          item[0],
        );
        const current = Math.min(Math.max(clipDate.get(item[0]), start), end);

        return (
          <BasePicker
            {...rest}
            current={current}
            start={start}
            end={end}
            key={item[0]}
            mode={item[0]}
            onChange={onChangeCallback}
            format={item[1]}
          />
        );
      })}
    </View>
  );
};

DateTimePickerView.defaultProps = {
  maximum: dayjs('2100-12-08 00:00:00:000'),
  minimum: dayjs('1970-01-01 00:00:00:000'),
  mode: unitAndFormats[2][0],
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
