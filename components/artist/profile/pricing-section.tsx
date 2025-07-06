import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign } from "lucide-react"

interface PricingSectionProps {
  hourlyRate: number
  estimatedCost: string
  priceRange: {
    min: number
    max: number
    currency: string
  }
}

export default function PricingSection({ hourlyRate, estimatedCost, priceRange }: PricingSectionProps) {
  return (
    <Card className="bg-purple-900/20 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-purple-400" />
          Pricing Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-purple-300">Hourly Rate:</span>
          <Badge variant="outline">${hourlyRate}/hr</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-purple-300">Estimated Cost:</span>
          <span className="text-white font-medium">{estimatedCost}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-purple-300">Price Range:</span>
          <span className="text-white font-medium">
            {priceRange.currency}
            {priceRange.min} - {priceRange.currency}
            {priceRange.max}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

// Named export for compatibility
export { PricingSection }
