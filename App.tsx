import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { DateTimePickerView, DateTimePicker } from './library/main';
import dayjs from 'dayjs';

export default function App() {
  const [visible, setVisible] = React.useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DateTimePicker>
        <Text style={{ fontSize: 22 }}>Show</Text>
      </DateTimePicker>
      <Text onPress={() => setVisible(!visible)} style={{ fontSize: 22 }}>
        Show2
      </Text>
      <DateTimePicker
        visible={visible}
        onWillChange={setVisible}
        onChange={console.log}
      />
      <Text
        onPress={() => {
          DateTimePicker.show({
            forceDark: true,
            onSelected(e) {
              console.log(e.format('YYYY-MM-DD HH:mm:ss'));
            },
          });
        }}
        style={{ fontSize: 22 }}>
        Show3
      </Text>
      <DateTimePickerView
        minimum={dayjs('1970-01-03 00:00:00')}
        // mode="date"
        mode="custom"
        custom={[
          ['month', 'MM'],
          ['date', 'DD'],
        ]}
        onSelected={(e) => console.log(e.format('YYYY-MM-DD HH:mm:ss'))}
      />
    </SafeAreaView>
  );
}
