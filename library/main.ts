import { withPicker, Picker } from 'react-native-repicker';
import { darkly } from 'rn-darkly';
import { DateTimePickerView } from './DateTimePickerView';

export { DateTimePickerView };

const DateTimePickerInternal = withPicker(DateTimePickerView);

export const DateTimePicker = darkly(DateTimePickerInternal, 'tintColor');

DateTimePicker.defaultProps = {
  dark_tintColor: Picker.defaultProps!.dark_tintColor,
};
