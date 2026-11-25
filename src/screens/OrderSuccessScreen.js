
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function OrderSuccessScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✅</Text>

      <Text style={styles.title}>
        Тапсырысыңыз қабылданды!
      </Text>

      <Text style={styles.description}>
        Сатып алғаныңызға рақмет!
        Тапсырысыңыз жақын арада жеткізіледі.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Main')}
      >
        <Text style={styles.buttonText}>
          Басты бетке оралу
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondButton}
        onPress={() =>
          navigation.navigate('Main', {
            screen: 'Products',
          })
        }
      >
        <Text style={styles.secondButtonText}>
          Тауарларды қарау
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  icon: {
    fontSize: 100,
    marginBottom: 25,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111827',
  },
  description: {
    color: '#7C7C7C',
    textAlign: 'center',
    lineHeight: 25,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#53B175',
    padding: 18,
    borderRadius: 15,
    width: '100%',
    marginTop: 35,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
  },
  secondButton: {
    backgroundColor: '#F2F3F2',
    padding: 18,
    borderRadius: 15,
    width: '100%',
    marginTop: 15,
  },
  secondButtonText: {
    color: '#53B175',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
