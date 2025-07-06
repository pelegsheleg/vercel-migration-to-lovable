import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Calendar } from "lucide-react"

interface CredentialsSectionProps {
  certifications: string[]
  experience: string
  awards: string[]
}

export default function CredentialsSection({ certifications, experience, awards }: CredentialsSectionProps) {
  return (
    <Card className="bg-purple-900/20 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-purple-400" />
          Credentials & Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-purple-400" />
            <span className="text-purple-300">Experience:</span>
          </div>
          <p className="text-white">{experience}</p>
        </div>

        {certifications.length > 0 && (
          <div>
            <h4 className="text-purple-300 mb-2">Certifications:</h4>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {awards.length > 0 && (
          <div>
            <h4 className="text-purple-300 mb-2">Awards:</h4>
            <div className="space-y-1">
              {awards.map((award, index) => (
                <div key={index} className="text-white text-sm">
                  • {award}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Named export for compatibility
export { CredentialsSection }
