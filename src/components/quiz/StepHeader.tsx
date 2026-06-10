type Props = { question: string; hint?: string }

export default function StepHeader({ question, hint }: Props) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
        fontWeight: 700,
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
        color: 'var(--court-dark)',
        marginBottom: hint ? '8px' : 0,
      }}>
        {question}
      </h2>
      {hint && (
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          fontWeight: 300,
          color: '#888',
          letterSpacing: '0.01em',
          lineHeight: 1.5,
        }}>
          {hint}
        </p>
      )}
    </div>
  )
}
