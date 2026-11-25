import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const GROCERY_IMAGE_URI =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600';

export default function WelcomeScreen({ navigation, onGetStarted }) {
  const handleStart = () => {
    if (onGetStarted) {
      onGetStarted();
    } else if (navigation) {
      // Егер алдымен кіру бетіне апарғыңыз келсе 'Login' деп жазыңыз
      navigation.replace('Main');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageCard}>
          <Image
            source={{ uri: GROCERY_IMAGE_URI }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.title}>Онлайн Азық-түлік</Text>
        <Text style={styles.subtitle}>
          Балғын азық-түлік үйіңізге дейін жеткізіледі
        </Text>
      </View>

      <TouchableOpacity
        style={styles.startButton}
        activeOpacity={0.8}
        onPress={handleStart}
      >
        <Text style={styles.startButtonText}>Бастау</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCard: {
    width: 190,
    height: 190,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#F0FDF4',
    marginBottom: 28,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#22A852',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  startButton: {
    backgroundColor: '#22A852',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
