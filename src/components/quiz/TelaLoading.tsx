'use client'

export default function TelaLoading() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--court-dark)', gap: '32px',
    }}>
      {/* Spinner mínimo */}
      <div style={{
        width: '32px', height: '32px',
        border: '2px solid rgba(247,243,238,0.15)',
        borderTopColor: 'var(--clay)',
        borderRadius: '50%',
        animation: 'spin 800ms linear infinite',
      }} />

      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--font-display)', fontStyle: 'italic',
          fontSize: '1.25rem', color: 'var(--off-white)',
          marginBottom: '8px',
        }}>
          Analisando seu perfil
        </p>
        <p style={{
          fontFamily: 'var(--font-body)', fontWeight: 300,
          fontSize: '0.8125rem', color: 'rgba(247,243,238,0.4)',
          letterSpacing: '0.04em',
        }}>
          235 raquetes · specs técnicos · perfil personalizado
        </p>
      </div>
    </div>
  )
}
