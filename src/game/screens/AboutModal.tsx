interface AboutModalProps {
  onBack: () => void;
}

export function AboutModal({ onBack }: AboutModalProps) {
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
          What is This?
        </h2>
        <p style={{ lineHeight: 1.6 }}>
          25DGAME is an interactive portfolio experience. Explore the mind, work, and identity of
          Abdul Majid Ridwan through a 2.5D side-scrolling game.
        </p>
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
