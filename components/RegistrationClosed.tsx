import { Card, CardContent } from "@/components/ui/card"
import { Bubblegum_Sans } from 'next/font/google'

const bubblegum = Bubblegum_Sans({ weight: '400', subsets: ['latin'] })

export default function RegistrationClosed() {
  return (
    <div className={`min-h-screen bg-purple-200 flex items-center justify-center p-4 ${bubblegum.className}`}>
      <Card className="w-full max-w-md bg-white rounded-3xl shadow-lg">
        <CardContent className="p-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-purple-500">
            Registration Closed
          </h1>
          <p className="text-6xl font-bold text-purple-600" style={{ fontFamily: 'Arial, sans-serif' }}>
            سنعود بعد قليل
          </p>
          <p className="mt-4 text-lg text-gray-600">
            We'll be back soon
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

