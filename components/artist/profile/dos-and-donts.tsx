import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Info } from "lucide-react"

interface DosAndDontsProps {
  dos: string[]
  donts: string[]
  specialRequirements: string[]
}

export default function DosAndDonts({ dos, donts, specialRequirements }: DosAndDontsProps) {
  return (
    <Card className="bg-purple-900/20 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-purple-400" />
          Guidelines & Requirements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {dos.length > 0 && (
          <div>
            <h4 className="text-green-400 font-medium mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Do's
            </h4>
            <ul className="space-y-1">
              {dos.map((item, index) => (
                <li key={index} className="text-white text-sm flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {donts.length > 0 && (
          <div>
            <h4 className="text-red-400 font-medium mb-2 flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Don'ts
            </h4>
            <ul className="space-y-1">
              {donts.map((item, index) => (
                <li key={index} className="text-white text-sm flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {specialRequirements.length > 0 && (
          <div>
            <h4 className="text-purple-300 font-medium mb-2">Special Requirements:</h4>
            <ul className="space-y-1">
              {specialRequirements.map((item, index) => (
                <li key={index} className="text-white text-sm flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Named export for compatibility
export { DosAndDonts }
