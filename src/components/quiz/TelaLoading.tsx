'use client'

const MENSAGENS = [
  'Analisando seu perfil de jogo...',
  'Consultando 235 raquetes do catálogo...',
  'Aplicando regras de eliminação...',
  'Pedindo a opinião do especialista...',
  'Preparando sua recomendação personalizada...',
]

export default function TelaLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
         style={{ background: 'var(--color-creme)' }}>
      <div className="text-center animate-fade-in">
        {/* Raquete animada */}
        <div style={{ fontSize: '4rem', marginBottom: '24px', animation: 'spin 2s linear infinite', display: 'inline-block' }}>
          🎾
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px', color: 'var(--color-cinza)' }}>
          Encontrando sua raquete ideal
        </h2>

        {/* Dots de loading */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: 'var(--color-saibro)',
              animation: `pulse-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>

        <p style={{ color: 'var(--color-cinza-medium)', fontSize: '0.9375rem', maxWidth: '300px' }}>
          Nosso motor analisa specs técnicas e seu perfil para recomendar com precisão.
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
