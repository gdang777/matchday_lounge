import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';

type ContactItem = { label: string; number: string; description: string };
type PhraseItem = { english: string; spanish: string; french: string };

const EMERGENCY_CONTACTS: ContactItem[] = [
  { label: '🚨 Emergency', number: '911', description: 'Police · Fire · Ambulance (Canada-wide)' },
  { label: '🚔 Vancouver Police', number: '604-717-3321', description: 'Non-emergency line' },
  { label: '🚔 Toronto Police', number: '416-808-2222', description: 'Non-emergency line' },
  { label: '🏥 Poison Control', number: '1-800-567-8911', description: 'BC & Ontario' },
  { label: '🤝 FIFA Fan Helpline', number: '1-800-FIFA-WC', description: 'Visitor assistance (placeholder)' },
];

const PHRASES: PhraseItem[] = [
  { english: 'Help!', spanish: '¡Ayuda!', french: 'Au secours !' },
  { english: 'Call the police!', spanish: '¡Llama a la policía!', french: 'Appelez la police !' },
  { english: 'I need a doctor.', spanish: 'Necesito un médico.', french: "J'ai besoin d'un médecin." },
  { english: "I'm lost.", spanish: 'Estoy perdido.', french: 'Je me suis perdu.' },
  { english: 'Where is the hospital?', spanish: '¿Dónde está el hospital?', french: "Où est l'hôpital ?" },
  { english: 'I need an interpreter.', spanish: 'Necesito un intérprete.', french: "J'ai besoin d'un interprète." },
  { english: 'My passport was stolen.', spanish: 'Me robaron el pasaporte.', french: "On m'a volé mon passeport." },
];

export default function EmergencyScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🛡 Emergency</Text>
      <Text style={styles.subtitle}>Save these contacts before you need them.</Text>

      {/* Emergency contacts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        {EMERGENCY_CONTACTS.map(item => (
          <TouchableOpacity
            key={item.number}
            style={styles.contactCard}
            onPress={() => Linking.openURL(`tel:${item.number.replace(/\D/g, '')}`)}
            activeOpacity={0.7}
          >
            <View style={styles.contactLeft}>
              <Text style={styles.contactLabel}>{item.label}</Text>
              <Text style={styles.contactDesc}>{item.description}</Text>
            </View>
            <View style={styles.callBtn}>
              <Text style={styles.contactNumber}>{item.number}</Text>
              <Text style={styles.callIcon}>📞</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick phrases */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Phrases</Text>
        <Text style={styles.phraseNote}>English · Español · Français</Text>
        {PHRASES.map(p => (
          <View key={p.english} style={styles.phraseCard}>
            <Text style={styles.phraseEn}>{p.english}</Text>
            <Text style={styles.phraseEs}>🇪🇸 {p.spanish}</Text>
            <Text style={styles.phraseFr}>🇫🇷 {p.french}</Text>
          </View>
        ))}
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          In a life-threatening emergency, always call 911 first.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0f0f1a' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', color: '#f0f0f5', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#a0a0b0', marginBottom: 28 },
  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e94560',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactCard: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e2a4a',
  },
  contactLeft: { flex: 1 },
  contactLabel: { fontSize: 15, fontWeight: '700', color: '#f0f0f5', marginBottom: 2 },
  contactDesc: { fontSize: 12, color: '#a0a0b0' },
  callBtn: { alignItems: 'flex-end' },
  contactNumber: { fontSize: 14, fontWeight: '700', color: '#22c55e', marginBottom: 2 },
  callIcon: { fontSize: 18 },
  phraseNote: { fontSize: 12, color: '#6b6b8a', marginBottom: 10 },
  phraseCard: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1e2a4a',
    gap: 6,
  },
  phraseEn: { fontSize: 14, fontWeight: '700', color: '#f0f0f5' },
  phraseEs: { fontSize: 13, color: '#a0a0b0' },
  phraseFr: { fontSize: 13, color: '#a0a0b0' },
  disclaimer: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e94560',
  },
  disclaimerText: { fontSize: 13, color: '#e94560', textAlign: 'center', fontWeight: '600' },
});
