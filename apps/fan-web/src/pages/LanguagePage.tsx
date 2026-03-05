import { useState } from 'react';

type Lang     = 'es' | 'fr' | 'pt' | 'ar';
type Category = 'greetings' | 'directions' | 'food' | 'matchday' | 'emergency';
type Phrase   = { english: string; es: string; fr: string; pt: string; ar: string };

const LANGUAGES: { id: Lang; flag: string; label: string }[] = [
  { id: 'es', flag: '🇪🇸', label: 'Español'   },
  { id: 'fr', flag: '🇫🇷', label: 'Français'  },
  { id: 'pt', flag: '🇧🇷', label: 'Português' },
  { id: 'ar', flag: '🇸🇦', label: 'العربية'   },
];

const CATEGORIES: { id: Category; icon: string; label: string }[] = [
  { id: 'greetings',  icon: '👋', label: 'Greetings'   },
  { id: 'directions', icon: '🗺', label: 'Directions'  },
  { id: 'food',       icon: '🍺', label: 'Food & Drink' },
  { id: 'matchday',   icon: '⚽', label: 'Match Day'   },
  { id: 'emergency',  icon: '🚨', label: 'Emergency'   },
];

const PHRASES: Record<Category, Phrase[]> = {
  greetings: [
    { english: 'Hello / Hi',            es: 'Hola',                    fr: 'Bonjour',              pt: 'Olá',                ar: 'مرحبا' },
    { english: 'Thank you',             es: 'Gracias',                  fr: 'Merci',                pt: 'Obrigado',           ar: 'شكرا' },
    { english: "You're welcome",        es: 'De nada',                  fr: 'De rien',              pt: 'De nada',            ar: 'عفوا' },
    { english: 'Excuse me',             es: 'Perdón',                   fr: 'Excusez-moi',          pt: 'Com licença',        ar: 'عفوا' },
    { english: 'Do you speak English?', es: '¿Hablas inglés?',          fr: 'Parlez-vous anglais?', pt: 'Fala inglês?',       ar: 'هل تتحدث الإنجليزية؟' },
  ],
  directions: [
    { english: 'Where is the stadium?', es: '¿Dónde está el estadio?',  fr: 'Où est le stade?',     pt: 'Onde fica o estádio?', ar: 'أين الملعب؟' },
    { english: 'How do I get to…?',    es: '¿Cómo llego a…?',          fr: 'Comment aller à…?',    pt: 'Como chegar a…?',    ar: 'كيف أصل إلى...؟' },
    { english: 'Left / Right',         es: 'Izquierda / Derecha',      fr: 'Gauche / Droite',      pt: 'Esquerda / Direita', ar: 'يسار / يمين' },
    { english: 'Train / Bus / Taxi',   es: 'Tren / Autobús / Taxi',    fr: 'Train / Bus / Taxi',   pt: 'Trem / Ônibus / Táxi', ar: 'قطار / حافلة / تاكسي' },
  ],
  food: [
    { english: 'A beer, please',       es: 'Una cerveza, por favor',   fr: "Une bière, s'il vous plaît", pt: 'Uma cerveja, por favor', ar: 'بيرة من فضلك' },
    { english: 'The menu, please',     es: 'El menú, por favor',       fr: "Le menu, s'il vous plaît",   pt: 'O cardápio, por favor',  ar: 'القائمة من فضلك' },
    { english: 'I am vegetarian',      es: 'Soy vegetariano',          fr: 'Je suis végétarien',          pt: 'Sou vegetariano',        ar: 'أنا نباتي' },
    { english: 'The bill, please',     es: 'La cuenta, por favor',     fr: "L'addition, s'il vous plaît", pt: 'A conta, por favor',     ar: 'الحساب من فضلك' },
    { english: 'Cheers!',              es: '¡Salud!',                  fr: 'Santé!',                      pt: 'Saúde!',                 ar: 'في صحتك!' },
  ],
  matchday: [
    { english: 'Where is my seat?',    es: '¿Dónde está mi asiento?',  fr: 'Où est mon siège?',    pt: 'Onde é meu lugar?',  ar: 'أين مقعدي؟' },
    { english: 'Go! / Score!',         es: '¡Vamos! / ¡Gol!',          fr: 'Allez! / But!',        pt: 'Vai! / Gol!',        ar: 'يلا! / هدف!' },
    { english: 'That was offside!',    es: '¡Era offside!',            fr: "C'était hors-jeu!",    pt: 'Era impedimento!',   ar: 'كان تسللاً!' },
    { english: 'Fan zone',             es: 'Zona de fanáticos',        fr: 'Zone des supporters',  pt: 'Área dos fãs',       ar: 'منطقة المشجعين' },
  ],
  emergency: [
    { english: 'Help!',                es: '¡Ayuda!',                  fr: 'Au secours!',          pt: 'Socorro!',           ar: 'النجدة!' },
    { english: 'Call the police!',     es: '¡Llama a la policía!',     fr: 'Appelez la police!',   pt: 'Chame a polícia!',   ar: 'اتصل بالشرطة!' },
    { english: 'I need a doctor',      es: 'Necesito un médico',       fr: "J'ai besoin d'un médecin", pt: 'Preciso de um médico', ar: 'أحتاج طبيباً' },
    { english: 'Emergency: call 911',  es: 'Emergencia: llama al 911', fr: 'Urgence: appelez le 911', pt: 'Emergência: ligue 911', ar: 'طوارئ: اتصل بـ 911' },
  ],
};

export default function LanguagePage() {
  const [lang,     setLang]     = useState<Lang>('es');
  const [category, setCategory] = useState<Category>('greetings');
  const [copied,   setCopied]   = useState<string | null>(null);

  function copyPhrase(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">🌐 Language</h1>
          <p className="page-subtitle">Tap a phrase to copy it to your clipboard.</p>
        </div>
      </div>

      {/* Language selector */}
      <div className="lang-selector">
        {LANGUAGES.map(l => (
          <button key={l.id} className={`lang-btn${lang === l.id ? ' active' : ''}`} onClick={() => setLang(l.id)}>
            <span>{l.flag}</span>
            <span>{l.label}</span>
          </button>
        ))}
      </div>

      {/* Category tabs */}
      <div className="filter-bar" style={{ marginBottom: 20 }}>
        {CATEGORIES.map(c => (
          <button key={c.id} className={`filter-chip${category === c.id ? ' active' : ''}`} onClick={() => setCategory(c.id)}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Phrases */}
      {PHRASES[category].map(p => {
        const translation = p[lang];
        const isCopied    = copied === translation;
        return (
          <div key={p.english} className={`phrase-card${isCopied ? ' copied' : ''}`} onClick={() => copyPhrase(translation)}>
            <div className="phrase-en">{p.english}</div>
            <div className="phrase-translation">{translation}</div>
            {isCopied && <div className="copied-label">✓ Copied!</div>}
          </div>
        );
      })}
    </div>
  );
}
