import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette, Clock } from "lucide-react"

interface ServicesSectionProps {
  services: string[]
  specialties: string[]
  estimatedTimes: {
    small: string
    medium: string
    large: string
  }
}

export default function ServicesSection({ services, specialties, estimatedTimes }: ServicesSectionProps) {
  return (
    <Card className="bg-purple-900/20 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-purple-400" />
          Services & Specialties
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-purple-300 mb-2">Services Offered:</h4>
          <div className="flex flex-wrap gap-2">
            {services.map((service, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {service}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-purple-300 mb-2">Specialties:</h4>
          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty, index) => (
              <Badge key={index} className="bg-purple-700 text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-purple-300 mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Estimated Times:
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-white text-sm">Small piece:</span>
              <span className="text-purple-300 text-sm">{estimatedTimes.small}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white text-sm">Medium piece:</span>
              <span className="text-purple-300 text-sm">{estimatedTimes.medium}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white text-sm">Large piece:</span>
              <span className="text-purple-300 text-sm">{estimatedTimes.large}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Named export for compatibility
export { ServicesSection }
