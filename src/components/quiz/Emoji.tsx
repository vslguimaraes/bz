type Props = { e: string; size?: number }

export default function Emoji({ e, size = 40 }: Props) {
  return (
    <span style={{ fontSize: size, lineHeight: 1, display: 'block' }} role="img" aria-hidden>
      {e}
    </span>
  )
}
