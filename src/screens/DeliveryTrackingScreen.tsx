
import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function DeliveryTrackingScreen({
  navigation,
  route,
}: any) {
  const order = route?.params?.order || {};

  const address =
    route?.params?.address?.fullAddress ||
    route?.params?.address ||
    order?.address ||
    'Мекенжай көрсетілмеген';

  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleString('kk-KZ')
    : 'Күні белгісіз';

  const deliveryDate = order?.deliveryInfo?.date;
  const deliverySlot = order?.deliveryInfo?.slot;

  const status = order?.status || 'Қабылданды';

  const stages = [
    {
      title: 'Тапсырыс қабылданды',
      description: 'Тапсырысыңыз жүйеге сақталды',
      icon: 'receipt-outline',
    },
    {
      title: 'Тапсырыс дайындалуда',
      description: 'Тауарлар жеткізуге дайындалуда',
      icon: 'cube-outline',
    },
    {
      title: 'Жолда',
      description: 'Тапсырыс жеткізуге жіберілді',
      icon: 'bicycle-outline',
    },
    {
      title: 'Жеткізілді',
      description: 'Тапсырыс алушыға тапсырылды',
      icon: 'checkmark-circle-outline',
    },
  ];

  // Бұл оқу жобасындағы демонстрациялық кезең.
  // Нақты курьердің орналасқан жері көрсетілмейді.
  const currentStage = 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#222"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Жеткізуді бақылау
          </Text>
        </View>

        <View style={styles.topCard}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="bicycle-outline"
              size={42}
              color="#53B175"
            />
          </View>

          <Text style={styles.mainTitle}>
            Тапсырысыңыз қабылданды!
          </Text>

          <Text style={styles.mainSubtitle}>
            Тапсырысыңыздың күйін осы жерден бақылай аласыз.
          </Text>

          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />

            <Text style={styles.statusText}>
              {status}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Тапсырыс туралы
          </Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>
                Тапсырыс нөмірі
              </Text>

              <Text style={styles.value}>
                #{String(order?.id || '00000000').slice(-8)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.label}>
                Тапсырыс уақыты
              </Text>

              <Text style={styles.value}>
                {orderDate}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.label}>
                Жалпы төлем
              </Text>

              <Text style={styles.price}>
                {Number(order?.finalPrice || 0).toLocaleString('kk-KZ')} ₸
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Жеткізу мекенжайы
          </Text>

          <View style={styles.addressCard}>
            <View style={styles.locationIcon}>
              <Ionicons
                name="location"
                size={23}
                color="#53B175"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.addressTitle}>
                Жеткізу орны
              </Text>

              <Text style={styles.addressText}>
                {address}
              </Text>

              {deliveryDate && (
                <Text style={styles.deliveryTime}>
                  {deliveryDate} · {deliverySlot || ''}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Жеткізу кезеңдері
          </Text>

          <View style={styles.timelineCard}>
            {stages.map((stage, index) => {
              const completed = index <= currentStage;

              return (
                <View
                  key={index}
                  style={styles.timelineItem}
                >
                  <View style={styles.timelineLeft}>
                    <View
                      style={[
                        styles.stageIcon,
                        completed && styles.completedIcon,
                      ]}
                    >
                      <Ionicons
                        name={stage.icon as any}
                        size={20}
                        color={completed ? '#FFFFFF' : '#AAAAAA'}
                      />
                    </View>

                    {index !== stages.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          index < currentStage && styles.completedLine,
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.stageContent}>
                    <Text
                      style={[
                        styles.stageTitle,
                        completed && styles.activeStageTitle,
                      ]}
                    >
                      {stage.title}
                    </Text>

                    <Text style={styles.stageDescription}>
                      {stage.description}
                    </Text>

                    {index === currentStage && (
                      <Text style={styles.currentStage}>
                        Қазіргі кезең
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.demoNote}>
          <Ionicons
            name="information-circle-outline"
            size={21}
            color="#53B175"
          />

          <Text style={styles.demoNoteText}>
            Бұл демонстрациялық бақылау беті.
            Нақты курьердің GPS орналасуы мен жеткізу
            уақыты әлі қосылмаған.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Orders')}
        >
          <Text style={styles.buttonText}>
            Менің тапсырыстарыма оралу
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.homeButtonText}>
            Басты бет
          </Text>
        </TouchableOpacity>
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
    padding: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 13,
  },

  topCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
  },

  iconCircle: {
    width: 85,
    height: 85,
    borderRadius: 45,
    backgroundColor: '#EDF7EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  mainTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },

  mainSubtitle: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF7EF',
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    marginTop: 17,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#53B175',
    marginRight: 8,
  },

  statusText: {
    fontSize: 12,
    color: '#53B175',
    fontWeight: 'bold',
  },

  section: {
    marginHorizontal: 15,
    marginTop: 23,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
  },

  label: {
    fontSize: 12,
    color: '#999',
    flex: 1,
  },

  value: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
  },

  price: {
    fontSize: 15,
    color: '#53B175',
    fontWeight: 'bold',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },

  addressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#EDF7EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  addressTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },

  addressText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    lineHeight: 18,
  },

  deliveryTime: {
    fontSize: 11,
    color: '#53B175',
    marginTop: 7,
  },

  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
  },

  timelineItem: {
    flexDirection: 'row',
    minHeight: 80,
  },

  timelineLeft: {
    alignItems: 'center',
    width: 42,
  },

  stageIcon: {
    width: 37,
    height: 37,
    borderRadius: 20,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  completedIcon: {
    backgroundColor: '#53B175',
  },

  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 3,
  },

  completedLine: {
    backgroundColor: '#53B175',
  },

  stageContent: {
    flex: 1,
    paddingLeft: 12,
    paddingTop: 3,
  },

  stageTitle: {
    fontSize: 13,
    color: '#999',
    fontWeight: '600',
  },

  activeStageTitle: {
    color: '#333',
  },

  stageDescription: {
    fontSize: 11,
    color: '#AAAAAA',
    marginTop: 5,
  },

  currentStage: {
    fontSize: 10,
    color: '#53B175',
    fontWeight: 'bold',
    marginTop: 6,
  },

  demoNote: {
    flexDirection: 'row',
    backgroundColor: '#EDF7EF',
    marginHorizontal: 15,
    marginTop: 18,
    padding: 13,
    borderRadius: 12,
    alignItems: 'center',
  },

  demoNoteText: {
    flex: 1,
    fontSize: 11,
    color: '#55745C',
    marginLeft: 9,
    lineHeight: 17,
  },

  button: {
    height: 54,
    backgroundColor: '#53B175',
    borderRadius: 13,
    marginHorizontal: 15,
    marginTop: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  homeButton: {
    height: 50,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#53B175',
    marginHorizontal: 15,
    marginTop: 11,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  homeButtonText: {
    color: '#53B175',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
