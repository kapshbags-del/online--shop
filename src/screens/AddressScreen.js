
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const ADDRESS_KEY = '@ush_kiz_delivery_address';

const TIME_SLOTS = [
  '07:00 – 09:00',
  '10:00 – 12:00',
  '14:00 – 16:00',
  '18:00 – 20:00',
];

const INITIAL_REGION = {
  latitude: 43.2389,
  longitude: 76.8897,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

const getDeliveryDates = () => {
  const dates = [];

  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    const day = date.toISOString().split('T')[0];

    const label = date.toLocaleDateString('kk-KZ', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });

    dates.push({ day, label });
  }

  return dates;
};

export default function AddressScreen({
  navigation,
  currentAddress = '',
  currentSlot = '',
  onSaveAddress,
}) {
  const deliveryDates = getDeliveryDates();

  const [street, setStreet] = useState(currentAddress);
  const [houseNumber, setHouseNumber] = useState('');
  const [apartment, setApartment] = useState('');
  const [entrance, setEntrance] = useState('');
  const [floor, setFloor] = useState('');

  const [houseType, setHouseType] = useState('Көпқабатты үй');
  const [selectedSlot, setSelectedSlot] = useState(
    currentSlot || TIME_SLOTS[0]
  );

  const [selectedDate, setSelectedDate] = useState(
    deliveryDates[0].day
  );

  const [region, setRegion] = useState(INITIAL_REGION);
  const [marker, setMarker] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);

  // Бұрын сақталған мекенжайды жүктеу
  useEffect(() => {
    loadSavedAddress();
  }, []);

  const loadSavedAddress = async () => {
    try {
      const data = await AsyncStorage.getItem(ADDRESS_KEY);

      if (data) {
        const address = JSON.parse(data);
        setSavedAddress(address);
      }
    } catch (error) {
      console.log('Мекенжайды жүктеу қатесі:', error);
    }
  };

  // Сақталған мекенжайды қолдану
  const useSavedAddress = () => {
    if (!savedAddress) return;

    setStreet(savedAddress.street || '');
    setHouseNumber(savedAddress.houseNumber || '');
    setApartment(savedAddress.apartment || '');
    setEntrance(savedAddress.entrance || '');
    setFloor(savedAddress.floor || '');
    setHouseType(savedAddress.houseType || 'Көпқабатты үй');
    setSelectedSlot(savedAddress.slot || TIME_SLOTS[0]);
    setSelectedDate(savedAddress.date || deliveryDates[0].day);

    if (savedAddress.coordinate) {
      setMarker(savedAddress.coordinate);
    }

    Alert.alert('Дайын', 'Сақталған мекенжай таңдалды.');
  };

  // Картадан орын таңдау
  const handleMapPress = async (event) => {
    const coordinate = event.nativeEvent.coordinate;

    setMarker(coordinate);
    setMapLoading(true);

    try {
      const result = await Location.reverseGeocodeAsync(coordinate);

      if (result && result.length > 0) {
        const place = result[0];

        if (place.street) {
          setStreet(place.street);
        }

        if (place.streetNumber) {
          setHouseNumber(place.streetNumber);
        }
      }
    } catch (error) {
      Alert.alert(
        'Ескерту',
        'Мекенжайды автоматты анықтау мүмкін болмады. Қолмен енгізіңіз.'
      );
    } finally {
      setMapLoading(false);
    }
  };

  // Мекенжайды сақтау
  const handleConfirm = async () => {
    const cleanStreet = street.trim();
    const cleanHouse = houseNumber.trim();

    if (!cleanStreet) {
      Alert.alert('Ескерту', 'Көше атауын енгізіңіз!');
      return;
    }

    if (!cleanHouse) {
      Alert.alert('Ескерту', 'Үй нөмірін енгізіңіз!');
      return;
    }

    let fullAddress = `${cleanStreet}, үй ${cleanHouse}`;

    fullAddress += `, ${houseType}`;

    if (houseType === 'Көпқабатты үй') {
      if (apartment.trim()) {
        fullAddress += `, пәтер ${apartment.trim()}`;
      }

      if (entrance.trim()) {
        fullAddress += `, кіреберіс ${entrance.trim()}`;
      }

      if (floor.trim()) {
        fullAddress += `, қабат ${floor.trim()}`;
      }
    }

    const deliveryInfo = {
      street: cleanStreet,
      houseNumber: cleanHouse,
      apartment: apartment.trim(),
      entrance: entrance.trim(),
      floor: floor.trim(),
      houseType,
      fullAddress,
      slot: selectedSlot,
      date: selectedDate,
      coordinate: marker,
      savedAt: new Date().toISOString(),
    };

    try {
      await AsyncStorage.setItem(
        ADDRESS_KEY,
        JSON.stringify(deliveryInfo)
      );

      setSavedAddress(deliveryInfo);

      if (onSaveAddress) {
        onSaveAddress(fullAddress, selectedSlot, deliveryInfo);
      }

      Alert.alert(
        'Сәтті сақталды',
        `Мекенжай: ${fullAddress}\nКүні: ${selectedDate}\nУақыты: ${selectedSlot}`,
        [
          {
            text: 'Жақсы',
            onPress: () => {
              if (navigation?.canGoBack()) {
                navigation.goBack();
              } else {
                navigation?.navigate('Main');
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Қате', 'Мекенжайды сақтау мүмкін болмады.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Жоғарғы бөлім */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation?.goBack()}
          >
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Жеткізу мекенжайы
          </Text>

          <View style={styles.placeholder} />
        </View>

        {/* Сақталған мекенжай */}
        {savedAddress && (
          <>
            <Text style={styles.sectionLabel}>
              Соңғы сақталған мекенжай
            </Text>

            <TouchableOpacity
              style={styles.savedCard}
              onPress={useSavedAddress}
            >
              <View style={styles.savedInfo}>
                <Text style={styles.savedTag}>Сақталған</Text>
                <Text style={styles.savedAddress}>
                  {savedAddress.fullAddress}
                </Text>
                <Text style={styles.savedSlot}>
                  {savedAddress.slot}
                </Text>
              </View>

              <Text style={styles.chooseText}>Таңдау ›</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Карта */}
        <Text style={styles.sectionLabel}>
          Картадан мекенжай таңдау
        </Text>

        <Text style={styles.hint}>
          Картадағы қажетті орынды басыңыз.
        </Text>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
            onPress={handleMapPress}
          >
            {marker && (
              <Marker
                coordinate={marker}
                title="Жеткізу мекенжайы"
                description="Таңдалған орын"
              />
            )}
          </MapView>
        </View>

        {mapLoading && (
          <Text style={styles.hint}>
            Мекенжай анықталуда...
          </Text>
        )}

        {marker && (
          <Text style={styles.selectedText}>
            ✓ Картадан орын таңдалды
          </Text>
        )}

        {/* Мекенжай */}
        <Text style={styles.sectionLabel}>
          Мекенжай мәліметтері
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Көше атауы"
          placeholderTextColor="#9CA3AF"
          value={street}
          onChangeText={setStreet}
        />

        <TextInput
          style={styles.input}
          placeholder="Үй нөмірі"
          placeholderTextColor="#9CA3AF"
          value={houseNumber}
          onChangeText={setHouseNumber}
        />

        {/* Үй түрі */}
        <Text style={styles.sectionLabel}>
          Үй түрін таңдаңыз
        </Text>

        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              houseType === 'Жеке үй' && styles.typeActive,
            ]}
            onPress={() => setHouseType('Жеке үй')}
          >
            <Text style={styles.typeIcon}>🏠</Text>
            <Text style={[
              styles.typeText,
              houseType === 'Жеке үй' && styles.typeTextActive,
            ]}>
              Жеке үй
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              houseType === 'Көпқабатты үй' && styles.typeActive,
            ]}
            onPress={() => setHouseType('Көпқабатты үй')}
          >
            <Text style={styles.typeIcon}>🏢</Text>
            <Text style={[
              styles.typeText,
              houseType === 'Көпқабатты үй' && styles.typeTextActive,
            ]}>
              Көпқабатты үй
            </Text>
          </TouchableOpacity>
        </View>

        {/* Қосымша мәліметтер */}
        {houseType === 'Көпқабатты үй' && (
          <>
            <Text style={styles.sectionLabel}>
              Қосымша мәліметтер
            </Text>

            <View style={styles.rowInputs}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Пәтер"
                placeholderTextColor="#9CA3AF"
                value={apartment}
                onChangeText={setApartment}
                keyboardType="numeric"
              />

              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Кіреберіс"
                placeholderTextColor="#9CA3AF"
                value={entrance}
                onChangeText={setEntrance}
                keyboardType="numeric"
              />

              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Қабат"
                placeholderTextColor="#9CA3AF"
                value={floor}
                onChangeText={setFloor}
                keyboardType="numeric"
              />
            </View>
          </>
        )}

        {/* Жеткізу күні */}
        <Text style={styles.sectionLabel}>
          Жеткізу күнін таңдаңыз
        </Text>

        <Text style={styles.hint}>
          Алдағы 7 күннің бірін таңдауға болады.
        </Text>

        <View style={styles.dateList}>
          {deliveryDates.map((item) => {
            const active = selectedDate === item.day;

            return (
              <TouchableOpacity
                key={item.day}
                style={[
                  styles.dateChip,
                  active && styles.dateChipActive,
                ]}
                onPress={() => setSelectedDate(item.day)}
              >
                <Text style={[
                  styles.dateText,
                  active && styles.dateTextActive,
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Жеткізу уақыты */}
        <Text style={styles.sectionLabel}>
          Жеткізу уақытын таңдаңыз
        </Text>

        <View style={styles.slotsWrap}>
          {TIME_SLOTS.map((slot) => {
            const active = selectedSlot === slot;

            return (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.slotChip,
                  active && styles.slotChipActive,
                ]}
                onPress={() => setSelectedSlot(slot)}
              >
                <Text style={[
                  styles.slotText,
                  active && styles.slotTextActive,
                ]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Растау */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleConfirm}
        >
          <Text style={styles.saveButtonText}>
            Мекенжайды және жеткізу уақытын сақтау
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  container: {
    padding: 16,
    paddingBottom: 36,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  placeholder: {
    width: 36,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
    marginTop: 16,
  },
  hint: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 10,
  },
  mapContainer: {
    height: 230,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  selectedText: {
    color: '#15803D',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  savedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  savedInfo: {
    flex: 1,
    marginRight: 8,
  },
  savedTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#22A852',
  },
  savedAddress: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  savedSlot: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 5,
  },
  chooseText: {
    color: '#15803D',
    fontWeight: '700',
    fontSize: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
    flex: 1,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  typeActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22A852',
  },
  typeIcon: {
    fontSize: 25,
    marginBottom: 6,
  },
  typeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  typeTextActive: {
    color: '#15803D',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 8,
  },
  halfInput: {
    minWidth: 0,
  },
  dateList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  dateChipActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22A852',
  },
  dateText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  dateTextActive: {
    color: '#15803D',
    fontWeight: '700',
  },
  slotsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  slotChip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  slotChipActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22A852',
  },
  slotText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  slotTextActive: {
    color: '#15803D',
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: '#22A852',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
