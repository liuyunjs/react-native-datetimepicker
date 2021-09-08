import React from 'react';
import { darkly } from 'react-native-repicker/dist/darkly';
import { withPicker } from 'react-native-repicker/dist/withPicker';
import { DateTimePickerView as DV, Props } from './DateTimePickerView';
// export { DateTimePicker } from './DateTimePicker';
// export type { Props as DateTimePickerProps } from './DateTimePicker';

export const DateTimePickerView = darkly(DV);
export const DateTimePicker = withPicker(DV);
