
import React, { useState, useCallback } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const ADDRESS_KEY = '@ush_kiz_delivery_address';

type AddressInfo = {
  street: string;
  houseNumber: string;
  apartment: string;
  entrance: string;
  floor: string;
  houseType: string;
  fullAddress: string;
  date: string;
  slot: string;
  savedAt?: string;
};

const TIME_SLOTS = [
  '09:00 – 12:00',
  '12:00 – 15:00',
  '15:00 – 18:00',
  '18:00 – 21:00',
];

const HOUSE_TYPES = ['Пәтер', 'Жеке үй'];

export default function AddressScreen({ navigation }: any) {
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [apartment, setApartment] = useState('');
  const [entrance, setEntrance] = useState('');
  const [floor, setFloor] = useState('');
  const [houseType, setHouseType] = useState('Пәтер');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState(TIME_SLOTS[0]);
  const [saving, setSaving] = useState(false);

  const loadAddress = async () => {
    try {
      const saved = await AsyncStorage.getItem(ADDRESS_KEY);

      if (saved) {
        const address: AddressInfo = JSON.parse(saved);

        setStreet(address.street || '');
        setHouseNumber(address.houseNumber || '');
        setApartment(address.apartment || '');
        setEntrance(address.entrance || '');
        setFloor(address.floor || '');
        setHouseType(address.houseType || 'Пәтер');
        setDate(address.date || '');
        setSlot(address.slot || TIME_SLOTS[0]);
      }
    } catch (error) {
      console.log('Мекенжайды жүктеу қатесі:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAddress();
    }, [])
  );

  const getAvailableDates = () => {
    const dates: { label: string; value: string }[] = [];

    for (let i = 0; i < 7; i++) {
      const current = new Date();
      current.setDate(current.getDate() + i);

      const value = current.toISOString().split('T')[0];

      const label = current.toLocaleDateString('kk-KZ', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });

      dates.push({ label, value });
    }

    return dates;
  };

  const availableDates = getAvailableDates();

  const saveAddress = async () => {
    if (!street.trim()) {
      Alert.alert('Қате', 'Көше атауын енгізіңіз');
      return;
    }

    if (!houseNumber.trim()) {
      Alert.alert('Қате', 'Үй нөмірін енгізіңіз');
      return;
    }

    if (!date) {
      Alert.alert('Қате', 'Жеткізу күнін таңдаңыз');
      return;
    }

    const fullAddress = [
      street.trim(),
      `үй ${houseNumber.trim()}`,
      apartment.trim() ? `пәтер ${apartment.trim()}` : '',
      entrance.trim() ? `${entrance.trim()}-кіреберіс` : '',
      floor.trim() ? `${floor.trim()}-қабат` : '',
    ]
      .filter(Boolean)
      .join(', ');

    const address: AddressInfo = {
      street: street.trim(),
      houseNumber: houseNumber.trim(),
      apartment: apartment.trim(),
      entrance: entrance.trim(),
      floor: floor.trim(),
      houseType,
      fullAddress,
      date,
      slot,
      savedAt: new Date().toISOString(),
    };

    try {
      setSaving(true);

      await AsyncStorage.setItem(
        ADDRESS_KEY,
        JSON.stringify(address)
      );

      Alert.alert(
        'Сәтті сақталды',
        'Жеткізу мекенжайы сақталды',
        [
          {
            text: 'Жақсы',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Қате', 'Мекенжайды сақтау мүмкін болмады');
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={23} color="#222" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Жеткізу мекенжайы
          </Text>
        </View>

        <View style={styles.locationCard}>
          <Ionicons name="location" size={30} color="#53B175" />

          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>
              Жеткізу мекенжайы
            </Text>

            <Text style={styles.locationSubtitle}>
              Тауар жеткізілетін мекенжайды енгізіңіз
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>
            Мекенжай мәліметтері
          </Text>

          <Text style={styles.label}>Көше атауы *</Text>

          <TextInput
            style={styles.input}
            placeholder="Мысалы: Абай көшесі"
            placeholderTextColor="#AAAAAA"
            value={street}
            onChangeText={setStreet}
          />

          <Text style={styles.label}>Үй нөмірі *</Text>

          <TextInput
            style={styles.input}
            placeholder="Үй нөмірі"
            placeholderTextColor="#AAAAAA"
            value={houseNumber}
            onChangeText={setHouseNumber}
          />

          <Text style={styles.label}>Үй түрі</Text>

          <View style={styles.choiceRow}>
            {HOUSE_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.choiceButton,
                  houseType === type && styles.selectedChoice,
                ]}
                onPress={() => setHouseType(type)}
              >
                <Text
                  style={[
                    styles.choiceText,
                    houseType === type && styles.selectedChoiceText,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {houseType === 'Пәтер' && (
            <>
              <Text style={styles.label}>Пәтер нөмірі</Text>

              <TextInput
                style={styles.input}
                placeholder="Пәтер нөмірі"
                placeholderTextColor="#AAAAAA"
                value={apartment}
                onChangeText={setApartment}
                keyboardType="numeric"
              />

              <View style={styles.twoColumns}>
                <View style={styles.halfColumn}>
                  <Text style={styles.label}>Кіреберіс</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="№"
                    placeholderTextColor="#AAAAAA"
                    value={entrance}
                    onChangeText={setEntrance}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.halfColumn}>
                  <Text style={styles.label}>Қабат</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="№"
                    placeholderTextColor="#AAAAAA"
                    value={floor}
                    onChangeText={setFloor}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </>
          )}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            Жеткізу күнін таңдаңыз
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {availableDates.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.dateButton,
                  date === item.value && styles.selectedDate,
                ]}
                onPress={() => setDate(item.value)}
              >
                <Text
                  style={[
                    styles.dateText,
                    date === item.value && styles.selectedDateText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>
            Жеткізу уақытын таңдаңыз
          </Text>

          <View style={styles.slotsContainer}>
            {TIME_SLOTS.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.slotButton,
                  slot === time && styles.selectedSlot,
                ]}
                onPress={() => setSlot(time)}
              >
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={slot === time ? '#FFFFFF' : '#53B175'}
                />

                <Text
                  style={[
                    styles.slotText,
                    slot === time && styles.selectedSlotText,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              saving && styles.disabledButton,
            ]}
            onPress={saveAddress}
            disabled={saving}
          >
            <Ionicons name="save-outline" size={20} color="#FFFFFF" />

            <Text style={styles.saveButtonText}>
              {saving ? 'Сақталуда...' : 'Мекенжайды сақтау'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            Жеткізу күндері мен уақыттары демонстрациялық үлгі ретінде берілген.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9F8',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 13,
  },

  locationCard: {
    backgroundColor: '#EAF6EC',
    marginHorizontal: 15,
    padding: 17,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationInfo: {
    flex: 1,
    marginLeft: 13,
  },

  locationTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },

  locationSubtitle: {
    fontSize: 11,
    color: '#777',
    marginTop: 5,
  },

  form: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 25,
    marginBottom: 12,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
    marginTop: 15,
  },

  input: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 11,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#222',
  },

  choiceRow: {
    flexDirection: 'row',
    gap: 10,
  },

  choiceButton: {
    flex: 1,
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    alignItems: 'center',
  },

  selectedChoice: {
    backgroundColor: '#53B175',
    borderColor: '#53B175',
  },

  choiceText: {
    color: '#555',
    fontSize: 13,
    fontWeight: '600',
  },

  selectedChoiceText: {
    color: '#FFFFFF',
  },

  twoColumns: {
    flexDirection: 'row',
    gap: 12,
  },

  halfColumn: {
    flex: 1,
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginTop: 25,
  },

  dateButton: {
    paddingHorizontal: 15,
    paddingVertical: 13,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginRight: 8,
  },

  selectedDate: {
    backgroundColor: '#53B175',
    borderColor: '#53B175',
  },

  dateText: {
    color: '#555',
    fontSize: 12,
  },

  selectedDateText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  slotButton: {
    width: '48%',
    padding: 13,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  selectedSlot: {
    backgroundColor: '#53B175',
    borderColor: '#53B175',
  },

  slotText: {
    fontSize: 11,
    color: '#555',
    fontWeight: '600',
  },

  selectedSlotText: {
    color: '#FFFFFF',
  },

  saveButton: {
    height: 55,
    backgroundColor: '#53B175',
    borderRadius: 13,
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  note: {
    color: '#999',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 16,
  },
});
