import { useMemo } from 'react';
import { getAllGameData } from '@game/data';

interface StandardPortfolioProps {
  onBack: () => void;
}

export function StandardPortfolio({ onBack }: StandardPortfolioProps) {
  const data = useMemo(() => getAllGameData(), []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'auto',
        background: '#0A0A0A',
        color: '#f5f5f5',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: '40px 24px',
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: '1px solid #555',
            color: '#888',
            padding: '8px 24px',
            cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14,
            marginBottom: 32,
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
          ← Back to Menu
        </button>

        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            color: '#F0E040',
            fontFamily: "'Impact', sans-serif",
            marginBottom: 4,
          }}
        >
          {data.profile.name}
        </h1>
        <p style={{ color: '#aaa', fontSize: '1.1rem', marginBottom: 4 }}>
          {data.profile.headline}
        </p>
        <p style={{ color: '#888', marginBottom: 24 }}>{data.profile.tagline}</p>

        <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
          <span style={{ color: '#888', fontSize: 14 }}>
            📍 {data.profile.location}
          </span>
          <span style={{ color: '#888', fontSize: 14 }}>
            ⏱ {data.profile.metrics.yearsExperience}+ years
          </span>
          <span style={{ color: '#888', fontSize: 14 }}>
            📦 {data.profile.metrics.projectsShipped} projects
          </span>
          <span style={{ color: '#888', fontSize: 14 }}>
            🏅 {data.profile.metrics.certifications} certifications
          </span>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
          {data.profile.contact.linkedin && (
            <a
              href={data.profile.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#F0E040', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}
            >
              LinkedIn ↗
            </a>
          )}
          {data.profile.contact.github && (
            <a
              href={data.profile.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#F0E040', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}
            >
              GitHub ↗
            </a>
          )}
          {data.profile.resumeUrl && (
            <a
              href={data.profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#F0E040', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}
            >
              Resume ↗
            </a>
          )}
        </div>

        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              color: '#F0E040',
              fontFamily: "'Impact', sans-serif",
              fontSize: '1.5rem',
              marginBottom: 12,
              borderBottom: '1px solid #333',
              paddingBottom: 8,
            }}
          >
            About
          </h2>
          <p style={{ lineHeight: 1.7, color: '#ccc' }}>{data.profile.summary}</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              color: '#F0E040',
              fontFamily: "'Impact', sans-serif",
              fontSize: '1.5rem',
              marginBottom: 12,
              borderBottom: '1px solid #333',
              paddingBottom: 8,
            }}
          >
            Skills
          </h2>
          {data.skills.map((cat) => (
            <div key={cat.name} style={{ marginBottom: 16 }}>
              <h3 style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: 8 }}>
                {cat.name}
              </h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {cat.skills.map((skill) => (
                  <span
                    key={skill.name}
                    style={{
                      border: '1px solid #F0E040',
                      color: '#F0E040',
                      padding: '4px 12px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {skill.name} {'●'.repeat(skill.proficiency).padEnd(5, '○')}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              color: '#F0E040',
              fontFamily: "'Impact', sans-serif",
              fontSize: '1.5rem',
              marginBottom: 12,
              borderBottom: '1px solid #333',
              paddingBottom: 8,
            }}
          >
            Projects
          </h2>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {data.projects.map((project) => (
              <div
                key={project.id}
                style={{
                  background: '#1a1a1a',
                  border: project.featured ? '1px solid #F0E040' : '1px solid #333',
                  borderRadius: 4,
                  padding: 16,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ color: '#f5f5f5', fontSize: '0.95rem', margin: 0 }}>
                    {project.title}
                  </h3>
                  {project.featured && <span style={{ color: '#F0E040', fontSize: 11 }}>★</span>}
                </div>
                <p style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>
                  {project.category} · {project.period}
                </p>
                <p style={{ color: '#aaa', fontSize: 13, lineHeight: 1.5, marginBottom: 8 }}>
                  {project.description}
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {project.skills.map((s) => (
                    <span key={s} style={{ color: '#666', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
                      {s}
                    </span>
                  ))}
                </div>
                {project.links.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    {project.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#F0E040', fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {link.label} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              color: '#F0E040',
              fontFamily: "'Impact', sans-serif",
              fontSize: '1.5rem',
              marginBottom: 12,
              borderBottom: '1px solid #333',
              paddingBottom: 8,
            }}
          >
            Experience
          </h2>
          {data.experiences.map((exp) => (
            <div
              key={exp.id}
              style={{
                borderLeft: '2px solid #F0E040',
                paddingLeft: 16,
                marginBottom: 20,
              }}
            >
              <h3 style={{ color: '#f5f5f5', fontSize: '1rem', margin: 0 }}>
                {exp.role}
              </h3>
              <p style={{ color: '#888', fontSize: 13, margin: '4px 0' }}>
                {exp.company} · {exp.type} · {exp.startDate} – {exp.endDate || 'Present'}
              </p>
              <ul style={{ margin: '8px 0', paddingLeft: 20, color: '#aaa', fontSize: 13, lineHeight: 1.6 }}>
                {exp.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {exp.technologies.map((t) => (
                  <span key={t} style={{ color: '#666', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              color: '#F0E040',
              fontFamily: "'Impact', sans-serif",
              fontSize: '1.5rem',
              marginBottom: 12,
              borderBottom: '1px solid #333',
              paddingBottom: 8,
            }}
          >
            Certifications
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {data.certifications.map((cert) => (
              <span
                key={cert.id}
                style={{
                  border: '1px solid #555',
                  color: '#aaa',
                  padding: '4px 10px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {cert.title}
              </span>
            ))}
          </div>
        </section>

        <footer style={{ borderTop: '1px solid #333', paddingTop: 24, textAlign: 'center' }}>
          <p style={{ color: '#555', fontSize: 12 }}>
            25DGAME · Interactive Portfolio · {data.profile.name}
          </p>
        </footer>
      </div>
    </div>
  );
}
