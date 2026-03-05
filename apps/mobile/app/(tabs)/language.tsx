import { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';

type Lang = 'es' | 'fr' | 'pt' | 'ar';
type Category = 'greetings' | 'directions' | 'food' | 'matchday' | 'emergency';

type Phrase = {
  english: string;
  es: string;
  fr: string;
  pt: string;
  ar: string;
};

const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'greetings',  label: 'Greetings',      icon: '👋' },
  { id: 'directions', label: 'Directions',      icon: '🗺' },
  { id: 'food',       label: 'Food & Drink',    icon: '🍺' },
  { id: 'matchday',   label: 'Match Day',       icon: '⚽' },
  { id: 'emergency',  label: 'Emergency',       icon: '🚨' },
];

const LANGUAGES: { id: Lang; label: string; flag: string }[] = [
  { id: 'es', label: 'Español',   flag: '🇪🇸' },
  { id: 'fr', label: 'Français',  flag: '🇫🇷' },
  { id: 'pt', label: 'Português', flag: '🇧🇷' },
  { id: 'ar', label: 'العربية',   flag: '🇸🇦' },
];

const PHRASES: Record<Category, Phrase[]> = {
  greetings: [
    { english: 'Hello / Hi',               es: 'Hola',                    fr: 'Bonjour',              pt: 'Olá',                ar: 'مرحبا' },
    { english: 'How are you?',             es: '¿Cómo estás?',            fr: 'Comment allez-vous ?', pt: 'Como vai você?',     ar: 'كيف حالك؟' },
    { english: 'Thank you',               es: 'Gracias',                  fr: 'Merci',                pt: 'Obrigado',           ar: 'شكرا' },
    { english: 'You\'re welcome',          es: 'De nada',                  fr: 'De rien',              pt: 'De nada',            ar: 'عفوا' },
    { english: 'Excuse me',               es: 'Perdón',                   fr: 'Excusez-moi',          pt: 'Com licença',        ar: 'عفوا' },
    { english: 'Do you speak English?',    es: '¿Hablas inglés?',          fr: 'Parlez-vous anglais ?',pt: 'Fala inglês?',       ar: 'هل تتحدث الإنجليزية؟' },
  ],
  directions: [
    { english: 'Where is the stadium?',    es: '¿Dónde está el estadio?',  fr: 'Où est le stade ?',    pt: 'Onde fica o estádio?', ar: 'أين الملعب؟' },
    { english: 'How do I get to…?',       es: '¿Cómo llego a…?',          fr: 'Comment aller à… ?',   pt: 'Como chegar a…?',    ar: 'كيف أصل إلى...؟' },
    { english: 'Left / Right / Straight', es: 'Izquierda / Derecha / Recto', fr: 'Gauche / Droite / Tout droit', pt: 'Esquerda / Direita / Em frente', ar: 'يسار / يمين / مستقيم' },
    { english: 'Train / Bus / Taxi',      es: 'Tren / Autobús / Taxi',    fr: 'Train / Bus / Taxi',   pt: 'Trem / Ônibus / Táxi', ar: 'قطار / حافلة / تاكسي' },
    { english: 'How far is it?',          es: '¿Qué tan lejos está?',     fr: 'C\'est loin ?',         pt: 'Qual a distância?',  ar: 'كم يبعد؟' },
  ],
  food: [
    { english: 'A beer, please',          es: 'Una cerveza, por favor',   fr: 'Une bière, s\'il vous plaît', pt: 'Uma cerveja, por favor', ar: 'بيرة من فضلك' },
    { english: 'The menu, please',        es: 'El menú, por favor',       fr: 'Le menu, s\'il vous plaît',   pt: 'O cardápio, por favor',  ar: 'القائمة من فضلك' },
    { english: 'I am vegetarian',         es: 'Soy vegetariano',          fr: 'Je suis végétarien',          pt: 'Sou vegetariano',        ar: 'أنا نباتي' },
    { english: 'The bill, please',        es: 'La cuenta, por favor',     fr: 'L\'addition, s\'il vous plaît', pt: 'A conta, por favor',   ar: 'الحساب من فضلك' },
    { english: 'Happy hour',              es: 'Hora feliz',               fr: 'Heure heureuse',              pt: 'Happy hour',             ar: 'ساعة سعيدة' },
    { english: 'Cheers!',                 es: '¡Salud!',                  fr: 'Santé !',                     pt: 'Saúde!',                 ar: 'في صحتك!' },
  ],
  matchday: [
    { english: 'Where is my seat?',       es: '¿Dónde está mi asiento?',  fr: 'Où est mon siège ?',   pt: 'Onde é meu lugar?',  ar: 'أين مقعدي؟' },
    { english: 'Go! / Score!',            es: '¡Vamos! / ¡Gol!',          fr: 'Allez ! / But !',      pt: 'Vai! / Gol!',        ar: 'يلا! / هدف!' },
    { english: 'That was offside!',       es: '¡Era offside!',            fr: 'C\'était hors-jeu !',  pt: 'Era impedimento!',   ar: 'كان تسللاً!' },
    { english: 'What a save!',            es: '¡Qué atajada!',            fr: 'Quelle parade !',      pt: 'Que defesa!',        ar: 'يا له من إنقاذ!' },
    { english: 'Fan zone',                es: 'Zona de fanáticos',        fr: 'Zone des supporters',  pt: 'Área dos fãs',       ar: 'منطقة المشجعين' },
  ],
  emergency: [
    { english: 'Help!',                   es: '¡Ayuda!',                  fr: 'Au secours !',         pt: 'Socorro!',           ar: 'النجدة!' },
    { english: 'Call the police!',        es: '¡Llama a la policía!',     fr: 'Appelez la police !',  pt: 'Chame a polícia!',   ar: 'اتصل بالشرطة!' },
    { english: 'I need a doctor',         es: 'Necesito un médico',       fr: "J'ai besoin d'un médecin", pt: 'Preciso de um médico', ar: 'أحتاج طبيباً' },
    { english: 'I am lost',               es: 'Estoy perdido',            fr: 'Je me suis perdu',     pt: 'Estou perdido',      ar: 'أنا ضائع' },
    { english: 'Emergency number is 911', es: 'El número de emergencias es 911', fr: 'Le numéro d\'urgence est le 911', pt: 'O número de emergência é 911', ar: 'رقم الطوارئ هو 911' },
  ],
};

export default function LanguageScreen() {
  const [lang,     setLang]     = useState<Lang>('es');
  const [category, setCategory] = useState<Category>('greetings');
  const [copied,   setCopied]   = useState<string | null>(null);

  async function copyPhrase(text: string) {
    await Clipboard.setStringAsync(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  }

  const phrases = PHRASES[category];

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🌐 Language</Text>
        <Text style={styles.subtitle}>Tap a phrase to copy it.</Text>
      </View>

      {/* Language selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.langRow} contentContainerStyle={styles.langContent}>
        {LANGUAGES.map(l => (
          <TouchableOpacity
            key={l.id}
            style={[styles.langBtn, lang === l.id && styles.langBtnActive]}
            onPress={() => setLang(l.id)}
          >
            <Text style={styles.langFlag}>{l.flag}</Text>
            <Text style={[styles.langLabel, lang === l.id && styles.langLabelActive]}>{l.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Category selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow} contentContainerStyle={styles.catContent}>
        {CATEGORIES.map(c => (
          <TouchableOpacity
            key={c.id}
            style={[styles.catBtn, category === c.id && styles.catBtnActive]}
            onPress={() => setCategory(c.id)}
          >
            <Text style={styles.catIcon}>{c.icon}</Text>
            <Text style={[styles.catLabel, category === c.id && styles.catLabelActive]}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Phrases */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {phrases.map(p => {
          const translation = p[lang];
          const isCopied    = copied === translation;
          return (
            <TouchableOpacity
              key={p.english}
              style={[styles.phraseCard, isCopied && styles.phraseCardCopied]}
              onPress={() => copyPhrase(translation)}
              activeOpacity={0.7}
            >
              <Text style={styles.phraseEn}>{p.english}</Text>
              <Text style={styles.phraseTranslation}>{translation}</Text>
              {isCopied && <Text style={styles.copiedLabel}>Copied!</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0f0f1a' },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 8 },
  title:    { fontSize: 22, fontWeight: '800', color: '#f0f0f5', marginBottom: 2 },
  subtitle: { fontSize: 13, color: '#a0a0b0' },
  langRow:     { maxHeight: 60, marginTop: 12 },
  langContent: { paddingHorizontal: 16, gap: 8, flexDirection: 'row', alignItems: 'center' },
  langBtn: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               6,
    paddingHorizontal: 12,
    paddingVertical:   8,
    borderRadius:      20,
    backgroundColor:   '#1a1a2e',
    borderWidth:       1,
    borderColor:       '#2a2a4a',
  },
  langBtnActive:   { borderColor: '#e94560', backgroundColor: '#e9456015' },
  langFlag:        { fontSize: 18 },
  langLabel:       { fontSize: 13, fontWeight: '600', color: '#a0a0b0' },
  langLabelActive: { color: '#e94560' },
  catRow:     { maxHeight: 52, marginBottom: 4 },
  catContent: { paddingHorizontal: 16, gap: 8, flexDirection: 'row', alignItems: 'center' },
  catBtn: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               5,
    paddingHorizontal: 12,
    paddingVertical:   7,
    borderRadius:      16,
    backgroundColor:   '#1a1a2e',
    borderWidth:       1,
    borderColor:       '#2a2a4a',
  },
  catBtnActive:   { backgroundColor: '#16213e', borderColor: '#3b82f6' },
  catIcon:        { fontSize: 14 },
  catLabel:       { fontSize: 12, fontWeight: '600', color: '#a0a0b0' },
  catLabelActive: { color: '#3b82f6' },
  list:        { flex: 1 },
  listContent: { padding: 16 },
  phraseCard: {
    backgroundColor: '#16213e',
    borderRadius:    10,
    padding:         14,
    marginBottom:    10,
    borderWidth:     1,
    borderColor:     '#1e2a4a',
  },
  phraseCardCopied: { borderColor: '#22c55e' },
  phraseEn:          { fontSize: 13, color: '#a0a0b0', marginBottom: 4 },
  phraseTranslation: { fontSize: 17, fontWeight: '700', color: '#f0f0f5' },
  copiedLabel:       { fontSize: 11, color: '#22c55e', fontWeight: '700', marginTop: 4 },
});
