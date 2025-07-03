"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Send,
  Paperclip,
  ImageIcon,
  MoreVertical,
  Phone,
  Video,
  Search,
  Pin,
  Archive,
  Star,
  Trash2,
  Download,
  Copy,
  Reply,
  Edit,
  X,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Attachment {
  id: string
  name: string
  type: "image" | "document" | "audio" | "video"
  url: string
  size: number
  uploadedAt: string
}

interface Message {
  id: string
  content: string
  sender: "client" | "artist"
  timestamp: string
  isRead: boolean
  attachments?: Attachment[]
  isEdited?: boolean
  replyTo?: string
  isPinned?: boolean
  isStarred?: boolean
  messageType: "text" | "image" | "file" | "system"
}

interface Conversation {
  id: string
  clientName: string
  clientAvatar: string
  clientEmail: string
  lastMessage: Message
  unreadCount: number
  isOnline: boolean
  lastSeen: string
  projectName?: string
  tags: string[]
  isPinned: boolean
  isArchived: boolean
  createdAt: string
}

interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "in-progress" | "completed" | "on-hold"
  clientId: string
  createdAt: string
  dueDate?: string
  attachments: Attachment[]
  notes: string[]
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    clientName: "Alex Chen",
    clientAvatar: "/placeholder.svg?text=AC",
    clientEmail: "alex@example.com",
    lastMessage: {
      id: "msg1",
      content: "I love the latest design revision! When can we schedule the session?",
      sender: "client",
      timestamp: "2025-01-22T10:30:00Z",
      isRead: false,
      messageType: "text",
    },
    unreadCount: 3,
    isOnline: true,
    lastSeen: "",
    projectName: "Cyberpunk Sleeve",
    tags: ["urgent", "design-approved"],
    isPinned: true,
    isArchived: false,
    createdAt: "2025-01-15T09:00:00Z",
  },
  {
    id: "2",
    clientName: "Jordan Smith",
    clientAvatar: "/placeholder.svg?text=JS",
    clientEmail: "jordan@example.com",
    lastMessage: {
      id: "msg2",
      content: "Here are some additional reference images for the koi design",
      sender: "client",
      timestamp: "2025-01-21T16:45:00Z",
      isRead: true,
      attachments: [
        {
          id: "att1",
          name: "koi-reference-1.jpg",
          type: "image",
          url: "/images/tattoo-japanese.png",
          size: 2048000,
          uploadedAt: "2025-01-21T16:45:00Z",
        },
      ],
      messageType: "image",
    },
    unreadCount: 0,
    isOnline: false,
    lastSeen: "2 hours ago",
    projectName: "Japanese Koi Half Sleeve",
    tags: ["reference-provided"],
    isPinned: false,
    isArchived: false,
    createdAt: "2025-01-10T14:30:00Z",
  },
]

const mockMessages: { [key: string]: Message[] } = {
  "1": [
    {
      id: "1",
      content:
        "Hi! I'm interested in getting a cyberpunk-themed sleeve tattoo. I've seen your work and I'm really impressed!",
      sender: "client",
      timestamp: "2025-01-15T09:00:00Z",
      isRead: true,
      messageType: "text",
    },
    {
      id: "2",
      content:
        "Thank you for reaching out! I'd love to work on a cyberpunk sleeve with you. Do you have any specific elements or references in mind?",
      sender: "artist",
      timestamp: "2025-01-15T09:15:00Z",
      isRead: true,
      messageType: "text",
    },
    {
      id: "3",
      content:
        "Yes! I'm thinking circuit patterns, neon elements, and maybe some futuristic cityscape elements. I've attached some reference images.",
      sender: "client",
      timestamp: "2025-01-15T09:30:00Z",
      isRead: true,
      attachments: [
        {
          id: "att1",
          name: "cyberpunk-ref-1.jpg",
          type: "image",
          url: "/images/tattoo-cyberpunk.png",
          size: 3200000,
          uploadedAt: "2025-01-15T09:30:00Z",
        },
      ],
      messageType: "image",
    },
    {
      id: "4",
      content:
        "These references are perfect! I can definitely work with this aesthetic. Let me create some initial sketches based on your ideas.",
      sender: "artist",
      timestamp: "2025-01-15T10:00:00Z",
      isRead: true,
      messageType: "text",
    },
    {
      id: "5",
      content: "I love the latest design revision! When can we schedule the session?",
      sender: "client",
      timestamp: "2025-01-22T10:30:00Z",
      isRead: false,
      messageType: "text",
    },
  ],
}

export function EnhancedCommunicationSystem() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])
  const [showAttachmentDialog, setShowAttachmentDialog] = useState(false)
  const [showProjectDialog, setShowProjectDialog] = useState(false)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (activeConversation) {
      setMessages(mockMessages[activeConversation.id] || [])
      // Mark messages as read
      if (activeConversation.unreadCount > 0) {
        setConversations((prev) =>
          prev.map((conv) => (conv.id === activeConversation.id ? { ...conv, unreadCount: 0 } : conv)),
        )
      }
    }
  }, [activeConversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      searchQuery === "" ||
      conv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && conv.unreadCount > 0) ||
      (activeTab === "pinned" && conv.isPinned) ||
      (activeTab === "archived" && conv.isArchived)

    return matchesSearch && matchesTab && !conv.isArchived
  })

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !activeConversation) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "artist",
      timestamp: new Date().toISOString(),
      isRead: false,
      messageType: "text",
      replyTo: replyingTo?.id,
    }

    setMessages((prev) => [...prev, message])

    // Update conversation
    setConversations((prev) =>
      prev.map((conv) => (conv.id === activeConversation.id ? { ...conv, lastMessage: message } : conv)),
    )

    setNewMessage("")
    setReplyingTo(null)

    toast({
      title: "Message sent",
      description: "Your message has been delivered.",
    })
  }

  const handleFileUpload = (files: FileList) => {
    const validFiles = Array.from(files).filter((file) => file.size <= 10 * 1024 * 1024)

    validFiles.forEach((file) => {
      const attachment: Attachment = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type.startsWith("image/") ? "image" : "document",
        url: URL.createObjectURL(file),
        size: file.size,
        uploadedAt: new Date().toISOString(),
      }

      const message: Message = {
        id: Date.now().toString(),
        content: `Shared ${file.name}`,
        sender: "artist",
        timestamp: new Date().toISOString(),
        isRead: false,
        attachments: [attachment],
        messageType: attachment.type === "image" ? "image" : "file",
      }

      setMessages((prev) => [...prev, message])
    })

    toast({
      title: "Files uploaded",
      description: `${validFiles.length} file(s) shared successfully.`,
    })
  }

  const handleMessageAction = (messageId: string, action: "pin" | "star" | "delete" | "reply" | "edit") => {
    const message = messages.find((m) => m.id === messageId)
    if (!message) return

    switch (action) {
      case "pin":
        setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, isPinned: !m.isPinned } : m)))
        toast({
          title: message.isPinned ? "Message unpinned" : "Message pinned",
          description: message.isPinned ? "Message removed from pinned messages." : "Message added to pinned messages.",
        })
        break
      case "star":
        setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, isStarred: !m.isStarred } : m)))
        break
      case "reply":
        setReplyingTo(message)
        break
      case "edit":
        if (message.sender === "artist") {
          setEditingMessage(message)
        }
        break
      case "delete":
        setMessages((prev) => prev.filter((m) => m.id !== messageId))
        toast({
          title: "Message deleted",
          description: "The message has been removed.",
        })
        break
    }
  }

  const handleConversationAction = (conversationId: string, action: "pin" | "archive" | "delete") => {
    switch (action) {
      case "pin":
        setConversations((prev) =>
          prev.map((conv) => (conv.id === conversationId ? { ...conv, isPinned: !conv.isPinned } : conv)),
        )
        break
      case "archive":
        setConversations((prev) =>
          prev.map((conv) => (conv.id === conversationId ? { ...conv, isArchived: true } : conv)),
        )
        if (activeConversation?.id === conversationId) {
          setActiveConversation(null)
        }
        toast({
          title: "Conversation archived",
          description: "The conversation has been moved to archive.",
        })
        break
      case "delete":
        setConversations((prev) => prev.filter((conv) => conv.id !== conversationId))
        if (activeConversation?.id === conversationId) {
          setActiveConversation(null)
        }
        break
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="flex h-[800px] bg-black/20 rounded-lg border border-purple-500/30 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-purple-500/30 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Messages</h2>
            <Button variant="ghost" size="icon" className="text-purple-300 hover:text-white">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/40 border-purple-500/30"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="bg-black/40 border-b border-purple-500/30 rounded-none p-1">
            <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-purple-700">
              All ({conversations.filter((c) => !c.isArchived).length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1 data-[state=active]:bg-purple-700">
              Unread ({conversations.filter((c) => c.unreadCount > 0).length})
            </TabsTrigger>
            <TabsTrigger value="pinned" className="flex-1 data-[state=active]:bg-purple-700">
              Pinned ({conversations.filter((c) => c.isPinned).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-1">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                      activeConversation?.id === conversation.id
                        ? "bg-purple-800/30 border border-purple-500/50"
                        : "hover:bg-black/40"
                    }`}
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={conversation.clientAvatar || "/placeholder.svg"}
                            alt={conversation.clientName}
                          />
                          <AvatarFallback>{conversation.clientName[0]}</AvatarFallback>
                        </Avatar>
                        {conversation.isOnline && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-white truncate">{conversation.clientName}</h3>
                            {conversation.isPinned && <Pin className="h-3 w-3 text-yellow-400" />}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-purple-300">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </span>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-purple-600 text-xs">{conversation.unreadCount}</Badge>
                            )}
                          </div>
                        </div>

                        {conversation.projectName && (
                          <p className="text-xs text-purple-400 mb-1">{conversation.projectName}</p>
                        )}

                        <p
                          className={`text-sm truncate ${
                            conversation.unreadCount > 0 ? "text-white font-medium" : "text-purple-300"
                          }`}
                        >
                          {conversation.lastMessage.sender === "artist" && "You: "}
                          {conversation.lastMessage.content}
                        </p>

                        <div className="flex items-center gap-1 mt-1">
                          {conversation.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-6 w-6">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-900 border-purple-500/30">
                          <DropdownMenuItem onClick={() => handleConversationAction(conversation.id, "pin")}>
                            <Pin className="mr-2 h-4 w-4" />
                            {conversation.isPinned ? "Unpin" : "Pin"} Conversation
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleConversationAction(conversation.id, "archive")}>
                            <Archive className="mr-2 h-4 w-4" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleConversationAction(conversation.id, "delete")}
                            className="text-red-400"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-purple-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={activeConversation.clientAvatar || "/placeholder.svg"}
                    alt={activeConversation.clientName}
                  />
                  <AvatarFallback>{activeConversation.clientName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-white">{activeConversation.clientName}</h3>
                  <div className="flex items-center gap-2">
                    {activeConversation.isOnline ? (
                      <Badge className="bg-green-600 text-xs">Online</Badge>
                    ) : (
                      <span className="text-xs text-purple-300">Last seen: {activeConversation.lastSeen}</span>
                    )}
                    {activeConversation.projectName && (
                      <span className="text-xs text-purple-300">• {activeConversation.projectName}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-purple-300 hover:text-white">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-purple-300 hover:text-white">
                  <Video className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-purple-300 hover:text-white"
                  onClick={() => setShowProjectDialog(true)}
                >
                  <Pin className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-purple-300 hover:text-white">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-900 border-purple-500/30">
                    <DropdownMenuItem>View Client Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowProjectDialog(true)}>Project Details</DropdownMenuItem>
                    <DropdownMenuItem>Export Conversation</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleConversationAction(activeConversation.id, "archive")}>
                      Archive Conversation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "artist" ? "justify-end" : "justify-start"} group`}
                  >
                    <div
                      className={`max-w-[80%] ${
                        message.sender === "artist"
                          ? "bg-purple-700 rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                          : "bg-gray-800 rounded-tl-lg rounded-tr-lg rounded-br-lg"
                      } p-3 relative`}
                    >
                      {message.replyTo && (
                        <div className="bg-black/30 p-2 rounded mb-2 text-sm">
                          <p className="text-purple-300">Replying to:</p>
                          <p className="text-white truncate">
                            {messages.find((m) => m.id === message.replyTo)?.content}
                          </p>
                        </div>
                      )}

                      {message.isPinned && (
                        <div className="absolute -top-2 -right-2">
                          <Pin className="h-4 w-4 text-yellow-400" />
                        </div>
                      )}

                      <p className="text-white">{message.content}</p>

                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.attachments.map((attachment) => (
                            <div key={attachment.id}>
                              {attachment.type === "image" ? (
                                <img
                                  src={attachment.url || "/placeholder.svg"}
                                  alt={attachment.name}
                                  className="max-w-full h-auto max-h-60 object-cover rounded-lg cursor-pointer"
                                  onClick={() => window.open(attachment.url, "_blank")}
                                />
                              ) : (
                                <div className="flex items-center gap-2 p-2 bg-black/30 rounded-lg">
                                  <Paperclip className="h-4 w-4 text-purple-400" />
                                  <div className="flex-1">
                                    <p className="text-white text-sm">{attachment.name}</p>
                                    <p className="text-purple-300 text-xs">{formatFileSize(attachment.size)}</p>
                                  </div>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-purple-200/70">
                          {formatTime(message.timestamp)}
                          {message.isEdited && <span className="ml-1">(edited)</span>}
                        </span>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleMessageAction(message.id, "reply")}
                          >
                            <Reply className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleMessageAction(message.id, "star")}
                          >
                            <Star className={`h-3 w-3 ${message.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-gray-900 border-purple-500/30">
                              <DropdownMenuItem onClick={() => handleMessageAction(message.id, "pin")}>
                                <Pin className="mr-2 h-4 w-4" />
                                {message.isPinned ? "Unpin" : "Pin"} Message
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(message.content)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Text
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMessageAction(message.id, "reply")}>
                                <Reply className="mr-2 h-4 w-4" />
                                Reply
                              </DropdownMenuItem>
                              {message.sender === "artist" && (
                                <DropdownMenuItem onClick={() => handleMessageAction(message.id, "edit")}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleMessageAction(message.id, "delete")}
                                className="text-red-400"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Reply Preview */}
            {replyingTo && (
              <div className="px-4 py-2 bg-purple-900/20 border-t border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-purple-300">Replying to:</p>
                    <p className="text-sm text-white truncate">{replyingTo.content}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setReplyingTo(null)} className="h-6 w-6">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 border-t border-purple-500/30">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-purple-300 hover:text-white"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-purple-300 hover:text-white"
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>

                <div className="flex-1">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[40px] max-h-32 bg-black/40 border-purple-500/30 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage(e)
                      }
                    }}
                  />
                </div>

                <Button type="submit" disabled={!newMessage.trim()} className="bg-purple-700 hover:bg-purple-600">
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-900/30 flex items-center justify-center mb-4 mx-auto">
                <Send className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Select a Conversation</h3>
              <p className="text-purple-300 max-w-md">
                Choose a conversation from the sidebar to start messaging with your clients.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Project Details Dialog */}
      <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
        <DialogContent className="bg-gray-900 border-purple-500/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
            <DialogDescription className="text-purple-300">
              Manage project information and attachments
            </DialogDescription>
          </DialogHeader>

          {activeConversation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Project Name</Label>
                  <Input
                    value={activeConversation.projectName || ""}
                    placeholder="Enter project name"
                    className="bg-black/40 border-purple-500/30"
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select defaultValue="planning">
                    <SelectTrigger className="bg-black/40 border-purple-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea placeholder="Project description..." className="bg-black/40 border-purple-500/30" rows={3} />
              </div>

              <div>
                <Label>Project Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {activeConversation.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer">
                      {tag}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm" className="bg-black/40 border-purple-500/30">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Tag
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProjectDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-700 hover:bg-purple-600">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
