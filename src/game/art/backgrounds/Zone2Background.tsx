const BOOK_COLORS = ['#8B4513', '#556B2F', '#8B0000', '#191970', '#4A0000', '#2F4F4F', '#800020', '#3CB371', '#B8860B', '#483D8B'];

function randomBookColor() {
  return BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)];
}

function BookshelfRow({ y }: { y: number }) {
  const books = Array.from({ length: 8 }, (_, i) => (
    <div
      key={i}
      style={{
        position: 'absolute',
        left: 6 + i * 14,
        top: -4,
        width: 10,
        height: 30 + Math.floor(Math.random() * 20),
        background: randomBookColor(),
        borderRadius: '1px 2px 0 0',
        borderBottom: '1px solid rgba(0,0,0,0.3)',
      }}
    />
  ));
  const glowingBook = (
    <div
      style={{
        position: 'absolute',
        left: 6 + Math.floor(Math.random() * 7) * 14,
        top: -4,
        width: 10,
        height: 40,
        background: '#d4a017',
        borderRadius: '1px 2px 0 0',
        boxShadow: '0 0 6px rgba(212, 160, 23, 0.4)',
        borderBottom: '1px solid rgba(0,0,0,0.3)',
      }}
    />
  );
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 0, right: 0, top: y,
          height: 2,
          background: 'rgba(212, 160, 23, 0.15)',
        }}
      />
      {books.slice(0, 4)}
      {glowingBook}
      {books.slice(5)}
    </>
  );
}

export function Zone2Background() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #1a1208 0%, #221a0d 50%, #2a1f0a 100%)',
        }}
      />

      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
        <div
          key={`shelf-far-${i}`}
          style={{
            position: 'absolute',
            left: 100 + i * 250,
            bottom: 80,
            width: 120,
            height: 500,
            background: '#1a1410',
            border: '1px solid rgba(212, 160, 23, 0.05)',
            borderRadius: 2,
            opacity: 0.6,
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6].map((s) => (
            <BookshelfRow key={s} y={30 + s * 65} />
          ))}
        </div>
      ))}

      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <div
          key={`shelf-mid-${i}`}
          style={{
            position: 'absolute',
            left: 50 + i * 300,
            bottom: 80,
            width: 140,
            height: 520,
            background: '#151008',
            border: '1px solid rgba(212, 160, 23, 0.1)',
            borderRadius: 2,
            zIndex: 1,
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6].map((s) => (
            <BookshelfRow key={s} y={25 + s * 68} />
          ))}
        </div>
      ))}

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: 'linear-gradient(180deg, #2a1f0a 0%, #1a1208 100%)',
          borderTop: '1px solid rgba(212, 160, 23, 0.2)',
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 60px,
                rgba(212, 160, 23, 0.03) 60px,
                rgba(212, 160, 23, 0.03) 61px
              )
            `,
          }}
        />
      </div>
    </div>
  );
}
