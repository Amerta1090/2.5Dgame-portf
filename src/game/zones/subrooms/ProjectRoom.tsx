import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Project } from '@game/types';

interface ProjectRoomProps {
  project: Project;
  onClose: () => void;
}

export function ProjectRoom({ project, onClose }: ProjectRoomProps) {
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const truncatedDesc =
    project.description.length > 200
      ? project.description.slice(0, 200) + '...'
      : project.description;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.85)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.08, duration: 0.2 }}
        style={{
          background: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: 8,
          width: 700,
          maxHeight: '80vh',
          overflowY: 'auto',
          padding: '32px 40px',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 16,
            background: 'none',
            border: 'none',
            color: '#888',
            fontSize: 24,
            cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 8,
          }}
        >
          <h2
            style={{
              color: '#F0E040',
              fontFamily: "'Impact', sans-serif",
              fontSize: 20,
              margin: 0,
              letterSpacing: '0.03em',
            }}
          >
            {project.title}
          </h2>
          {project.featured && (
            <span
              style={{
                color: '#F0E040',
                fontSize: 14,
                fontFamily: "'Impact', sans-serif",
              }}
            >
              ★
            </span>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            marginBottom: 16,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
          }}
        >
          <span style={{ color: '#888' }}>{project.period}</span>
          {project.association && (
            <>
              <span style={{ color: '#555' }}>·</span>
              <span style={{ color: '#F0E040' }}>{project.association}</span>
            </>
          )}
          <span style={{ color: '#555' }}>·</span>
          <span
            style={{
              color: '#888',
              textTransform: 'uppercase',
              fontSize: 10,
              letterSpacing: '0.08em',
            }}
          >
            {project.category}
          </span>
        </div>

        <div
          style={{
            color: '#f5f5f5',
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            lineHeight: 1.7,
            marginBottom: 16,
            maxWidth: 600,
          }}
        >
          {showFullDesc ? project.description : truncatedDesc}
          {project.description.length > 200 && (
            <span
              onClick={() => setShowFullDesc(!showFullDesc)}
              style={{
                color: '#F0E040',
                cursor: 'pointer',
                marginLeft: 4,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
              }}
            >
              {showFullDesc ? ' [Show less]' : ' [Read more]'}
            </span>
          )}
        </div>

        {project.skills.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              marginBottom: 16,
            }}
          >
            {project.skills.map((skill) => (
              <span
                key={skill}
                style={{
                  padding: '3px 10px',
                  border: '1px solid #F0E040',
                  borderRadius: 12,
                  color: '#F0E040',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  background: 'rgba(240, 224, 64, 0.06)',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {project.links.length > 0 && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {project.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '8px 20px',
                  background: 'transparent',
                  border: '1px solid #F0E040',
                  borderRadius: 4,
                  color: '#F0E040',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = 'rgba(240, 224, 64, 0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = 'transparent';
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        <div
          style={{
            marginTop: 20,
            paddingTop: 12,
            borderTop: '1px solid #2a2a2a',
            textAlign: 'right',
          }}
        >
          <span
            style={{
              color: '#666',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
            }}
          >
            Press ESC to close
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
