import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Phone, Mail } from "lucide-react"

interface MessagesSectionProps {
  responseTime: string
  preferredContact: string
  availability: string
}

export default function MessagesSection({ responseTime, preferredContact, availability }: MessagesSectionProps) {
  return (
    <Card className="bg-purple-900/20 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-purple-400" />
          Communication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-purple-300">Response Time:</span>
            <span className="text-white">{responseTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-300">Preferred Contact:</span>
            <span className="text-white">{preferredContact}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-300">Availability:</span>
            <span className="text-white">{availability}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button className="flex-1 bg-purple-700 hover:bg-purple-600">
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Button>
          <Button variant="outline" className="flex-1 border-purple-500/30 bg-transparent">
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Button variant="outline" className="flex-1 border-purple-500/30 bg-transparent">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Named export for compatibility
export { MessagesSection }
