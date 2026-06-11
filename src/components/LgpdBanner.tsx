'use client'
import { useState, useEffect } from 'react'

export default function LgpdBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('lgpd_accepted')) setVisible(true)
  }, [])

  function aceitar() {
    localStorage.setItem('lgpd_accepted', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999,
      background: '#1A1A18',
      borderTop: '2px solid #C4622D',
      padding: '14px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: '16px', flexWrap: 'wrap',
    }}>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem',
        color: 'rgba(247,243,238,0.75)', lineHeight: 1.5,
        flex: 1, minWidth: '220px', margin: 0,
      }}>
        Usamos cookies para melhorar sua experiência e salvar suas respostas do quiz.
        Seus dados são tratados conforme a{' '}
        <strong style={{ color: 'rgba(247,243,238,0.95)' }}>LGPD</strong>.
      </p>
      <button
        onClick={aceitar}
        style={{
          background: '#C4622D', color: '#FFFFFF',
          border: 'none', borderRadius: '4px',
          padding: '9px 20px', cursor: 'pointer',
          fontFamily: 'Inter, sans-serif', fontWeight: 700,
          fontSize: '0.8125rem', letterSpacing: '0.06em',
          textTransform: 'uppercase', flexShrink: 0,
        }}
      >
        Entendido
      </button>
    </div>
  )
}
