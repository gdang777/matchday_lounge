const CONTACTS = [
  { label: '🚨 Emergency', number: '911', desc: 'Police · Fire · Ambulance (Canada-wide)' },
  { label: '🚔 Vancouver Police', number: '604-717-3321', desc: 'Non-emergency line' },
  { label: '🚔 Toronto Police', number: '416-808-2222', desc: 'Non-emergency line' },
  { label: '🏥 Poison Control', number: '1-800-567-8911', desc: 'BC & Ontario' },
  { label: '🤝 FIFA Fan Helpline', number: '1-800-FIFA-WC', desc: 'Visitor assistance (placeholder)' },
];

const PHRASES = [
  { english: 'Help!', es: '¡Ayuda!', fr: 'Au secours !' },
  { english: 'Call the police!', es: '¡Llama a la policía!', fr: 'Appelez la police !' },
  { english: 'I need a doctor.', es: 'Necesito un médico.', fr: "J'ai besoin d'un médecin." },
  { english: "I'm lost.", es: 'Estoy perdido.', fr: 'Je me suis perdu.' },
  { english: 'Where is the hospital?', es: '¿Dónde está el hospital?', fr: "Où est l'hôpital ?" },
  { english: 'I need an interpreter.', es: 'Necesito un intérprete.', fr: "J'ai besoin d'un interprète." },
  { english: 'My passport was stolen.', es: 'Me robaron el pasaporte.', fr: "On m'a volé mon passeport." },
];

export default function EmergencyPage() {
  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">🛡 Emergency</h1>
          <p className="page-subtitle">Save these contacts before you need them.</p>
        </div>
      </div>

      <div className="alert alert-error" style={{ marginBottom: 24 }}>
        In a life-threatening emergency, always call <strong>911</strong> first.
      </div>

      <h2 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--accent)', marginBottom: 12 }}>Emergency Contacts</h2>

      {CONTACTS.map(c => (
        <a key={c.number} href={`tel:${c.number.replace(/\D/g, '')}`} className="contact-card" style={{ display: 'flex', textDecoration: 'none', marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <div className="contact-label">{c.label}</div>
            <div className="contact-desc">{c.desc}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="contact-number">{c.number}</div>
            <div>📞</div>
          </div>
        </a>
      ))}

      <h2 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--accent)', margin: '28px 0 4px' }}>Quick Phrases</h2>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>English · Español · Français</p>

      {PHRASES.map(p => (
        <div key={p.english} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 18px', marginBottom: 8 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>{p.english}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>🇪🇸 {p.es}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>🇫🇷 {p.fr}</div>
        </div>
      ))}
    </div>
  );
}
