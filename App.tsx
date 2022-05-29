import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { DateTimePickerView, DateTimePicker } from './library/main';
import dayjs from 'dayjs';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DateTimePicker>
        <Text style={{ fontSize: 22 }}>Show</Text>
      </DateTimePicker>
      <DateTimePickerView
        minimum={dayjs('1970-01-03 00:00:00')}
        // mode="date"
        mode="custom"
        custom={[
          ['month', 'MM'],
          ['date', 'DD'],
        ]}
        onChange={(e) => console.log(e.format('YYYY-MM-DD HH:mm:ss'))}
      />
    </SafeAreaView>
  );
}
