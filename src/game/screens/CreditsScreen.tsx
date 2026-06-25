interface CreditsScreenProps {
  onBack: () => void;
}

export function CreditsScreen({ onBack }: CreditsScreenProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
      }}
    >
      <div
        style={{
          maxWidth: 600,
          textAlign: 'center',
          color: '#888',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <h2
          style={{
            color: '#F0E040',
            fontFamily: "'Impact', sans-serif",
            fontSize: '2rem',
            marginBottom: 24,
          }}
        >
          Credits
        </h2>
        <p style={{ lineHeight: 1.6, marginBottom: 32 }}>
          Built with Astro, React, TypeScript, Tailwind CSS, and Framer Motion. All portfolio data
          is sourced from local JSON files.
        </p>

        <div style={{ textAlign: 'left', lineHeight: 2, fontSize: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Profile data</span>
            <span style={{ color: '#555' }}>profile.json</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Certifications</span>
            <span style={{ color: '#555' }}>licenses_certifications.json</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Honors & awards</span>
            <span style={{ color: '#555' }}>honors.json</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Skills inventory</span>
            <span style={{ color: '#555' }}>skills.json</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Project portfolio</span>
            <span style={{ color: '#555' }}>projects.json</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Work experience</span>
            <span style={{ color: '#555' }}>experience.json</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Volunteering</span>
            <span style={{ color: '#555' }}>volunteering.json</span>
          </div>
        </div>

        <button
          onClick={onBack}
          style={{
            marginTop: 32,
            background: 'transparent',
            border: '1px solid #555',
            color: '#888',
            padding: '8px 24px',
            cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14,
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#F0E040';
            e.currentTarget.style.color = '#F0E040';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#555';
            e.currentTarget.style.color = '#888';
          }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
