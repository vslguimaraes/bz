import type { Metadata } from 'next'
import './globals.css'
import LgpdBanner from '@/components/LgpdBanner'

const BASE_URL = 'https://bz-chi.vercel.app'
const OG_IMAGE = 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&h=630&q=80'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Qual raquete é a sua? | Raquete Ideal',
  description: 'Descubra a raquete ideal para o seu jogo em menos de 2 minutos. Recomendação personalizada com IA — grátis.',
  keywords: ['raquete de tênis', 'recomendação raquete', 'tênis', 'quiz raquete', 'raquete ideal'],
  openGraph: {
    type: 'website',
    url: BASE_URL,
    title: 'Qual raquete é a sua?',
    description: '7 perguntas. Recomendação personalizada pela mesma tecnologia que analisa specs de Roland Garros e Wimbledon.',
    siteName: 'Raquete Ideal',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Raquete de tênis sobre quadra de saibro' }],
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Qual raquete é a sua?',
    description: '7 perguntas. Recomendação personalizada por IA — grátis.',
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col">
        {children}
        <LgpdBanner />
      </body>
    </html>
  )
}
