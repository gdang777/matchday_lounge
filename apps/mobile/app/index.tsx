import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MatchDay Lounge</Text>
      <Text style={styles.subtitle}>FIFA World Cup 2026</Text>
      <Text style={styles.cities}>Vancouver · Toronto</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#e94560',
    marginBottom: 4,
  },
  cities: {
    fontSize: 14,
    color: '#a0a0b0',
  },
});
