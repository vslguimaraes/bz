import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Qual raquete é a sua? | Tennis Recommender',
  description: 'Descubra a raquete ideal para o seu jogo em menos de 2 minutos.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
