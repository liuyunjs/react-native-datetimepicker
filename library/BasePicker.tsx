import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { PickerView } from 'react-native-repicker';
import { useReactCallback } from '@liuyunjs/hooks/lib/useReactCallback';
import dayjs from 'dayjs';

const date = dayjs('1970-01-01 00:00:00:000');

export type Mode =
  | 'year'
  | 'month'
  | 'date'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond';

export type Props = Omit<
  React.ComponentProps<typeof PickerView>,
  'onSelected' | 'data' | 'selected'
> & {
  start: number;
  end: number;
  current: number;
  mode: Mode;
  format: string;
  onSelected: (
    mode: Mode,
    selected: { value: number; label: string | number },
  ) => void;
};

let BasePicker: React.FC<Props> = ({
  start,
  current,
  end,
  mode,
  format,
  onSelected,
  ...rest
}) => {
  const data = React.useMemo(() => {
    const arr = [];
    for (let i = start; i <= end; i++) {
      arr.push({
        value: i,
        label: date.set(mode, i).format(format),
      });
    }
    return arr;
  }, [start, end, mode, format]);

  const onSelectedCallback = useReactCallback((selected: number) => {
    onSelected(mode, data[selected]);
  });

  return (
    <View style={styles.container}>
      <PickerView
        {...rest}
        onSelected={onSelectedCallback}
        selected={current - start}
        data={data}
      />
    </View>
  );
};

BasePicker = React.memo(BasePicker);
export { BasePicker };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
