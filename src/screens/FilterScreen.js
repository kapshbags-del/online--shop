
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const options = [
  'Барлық өнімдер',
  'Жемістер',
  'Көкөністер',
  'Сүт өнімдері',
  'Ет өнімдері',
  'Нан өнімдері',
];

export default function FilterScreen({ navigation }) {
  const [selected, setSelected] = useState('Барлық өнімдер');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Өнімдерді сүзу</Text>

      <Text style={styles.heading}>Санатты таңдаңыз</Text>

      {options.map((item) => (
        <TouchableOpacity
          key={item}
          style={styles.option}
          onPress={() => setSelected(item)}
        >
          <Text style={styles.optionText}>{item}</Text>

          <Text style={styles.check}>
            {selected === item ? '●' : '○'}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Қолдану</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 22,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 25,
  },
  heading: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: '#EEEEEE',
  },
  optionText: {
    fontSize: 16,
  },
  check: {
    fontSize: 20,
    color: '#53B175',
  },
  button: {
    backgroundColor: '#53B175',
    padding: 18,
    borderRadius: 15,
    marginTop: 30,
    marginBottom: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
