"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, ImageIcon, Trash2, Edit, Star, Calendar, Clock, Plus, X, Grid, List } from "lucide-react"
import Image from "next/image"

interface PortfolioSectionProps {
  onChange?: () => void
}

interface PortfolioItem {
  id: string
  title: string
  description: string
  image: string
  category: string
  tags: string[]
  featured: boolean
  completionTime: string
  dateCreated: string
  size: string
  bodyPart: string
}

export function PortfolioSection({ onChange }: PortfolioSectionProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    {
      id: "1",
      title: "Neo-Traditional Rose",
      description: "Vibrant neo-traditional rose with bold colors and clean lines",
      image: "/images/tattoo-neotraditional.png",
      category: "Neo-Traditional",
      tags: ["Rose", "Color", "Floral"],
      featured: true,
      completionTime: "4 hours",
      dateCreated: "2024-01-15",
      size: "Medium (4-6 inches)",
      bodyPart: "Forearm",
    },
    {
      id: "2",
      title: "Watercolor Phoenix",
      description: "Abstract watercolor phoenix with flowing colors",
      image: "/images/tattoo-watercolor.png",
      category: "Watercolor",
      tags: ["Phoenix", "Abstract", "Color"],
      featured: false,
      completionTime: "6 hours",
      dateCreated: "2024-01-10",
      size: "Large (8+ inches)",
      bodyPart: "Back",
    },
    {
      id: "3",
      title: "Fine Line Mandala",
      description: "Intricate fine line mandala with geometric patterns",
      image: "/images/tattoo-fineline.png",
      category: "Fine Line",
      tags: ["Mandala", "Geometric", "Black"],
      featured: true,
      completionTime: "5 hours",
      dateCreated: "2024-01-05",
      size: "Medium (4-6 inches)",
      bodyPart: "Shoulder",
    },
  ])

  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [newTag, setNewTag] = useState("")

  const categories = [
    "All",
    "Neo-Traditional",
    "Watercolor",
    "Fine Line",
    "Portraits",
    "Geometric",
    "Traditional",
    "Realism",
  ]
  const bodyParts = ["Arm", "Leg", "Back", "Chest", "Shoulder", "Forearm", "Thigh", "Calf", "Other"]
  const sizes = ["Small (2-4 inches)", "Medium (4-6 inches)", "Large (6-8 inches)", "Extra Large (8+ inches)"]

  const filteredItems = portfolioItems.filter(
    (item) => selectedCategory === "all" || item.category.toLowerCase() === selectedCategory.toLowerCase(),
  )

  const toggleFeatured = (id: string) => {
    setPortfolioItems((prev) => prev.map((item) => (item.id === id ? { ...item, featured: !item.featured } : item)))
    onChange?.()
  }

  const deleteItem = (id: string) => {
    setPortfolioItems((prev) => prev.filter((item) => item.id !== id))
    onChange?.()
  }

  const updateItem = (id: string, updates: Partial<PortfolioItem>) => {
    setPortfolioItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
    onChange?.()
  }

  const addTag = (itemId: string, tag: string) => {
    if (tag.trim()) {
      const item = portfolioItems.find((i) => i.id === itemId)
      if (item && !item.tags.includes(tag.trim())) {
        updateItem(itemId, { tags: [...item.tags, tag.trim()] })
      }
    }
  }

  const removeTag = (itemId: string, tagToRemove: string) => {
    const item = portfolioItems.find((i) => i.id === itemId)
    if (item) {
      updateItem(itemId, { tags: item.tags.filter((tag) => tag !== tagToRemove) })
    }
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Header */}
      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-white flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Portfolio Management
            </CardTitle>
            <div className="flex gap-2">
              <Button className="bg-purple-700 hover:bg-purple-600">
                <Upload className="h-4 w-4 mr-2" />
                Upload New Work
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-black/50 border-purple-500/30 text-white w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-purple-700" : "bg-black/50 border-purple-500/30"}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-purple-700" : "bg-black/50 border-purple-500/30"}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Items */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {filteredItems.map((item) => (
          <Card key={item.id} className="bg-black/40 border-purple-500/30 overflow-hidden">
            {viewMode === "grid" ? (
              <>
                <div className="relative aspect-square">
                  <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                  <div className="absolute top-2 right-2 flex gap-1">
                    {item.featured && (
                      <Badge className="bg-yellow-600 hover:bg-yellow-700">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => toggleFeatured(item.id)}
                      className="bg-black/70 hover:bg-black/90"
                    >
                      <Star className={`h-4 w-4 ${item.featured ? "fill-yellow-400 text-yellow-400" : ""}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setEditingItem(item.id)}
                      className="bg-black/70 hover:bg-black/90"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => deleteItem(item.id)}
                      className="bg-black/70 hover:bg-black/90 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-purple-300 text-sm mb-3">{item.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-purple-900/50 text-purple-200 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-purple-400 space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {item.completionTime}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.dateCreated).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-semibold">{item.title}</h3>
                      <div className="flex gap-1">
                        {item.featured && (
                          <Badge className="bg-yellow-600">
                            <Star className="h-3 w-3" />
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-purple-300 text-sm mb-2">{item.description}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-purple-900/50 text-purple-200 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-purple-400">
                        {item.completionTime} • {item.bodyPart} • {item.size}
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => toggleFeatured(item.id)}>
                          <Star className={`h-4 w-4 ${item.featured ? "fill-yellow-400 text-yellow-400" : ""}`} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingItem(item.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteItem(item.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Edit Portfolio Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(() => {
              const item = portfolioItems.find((i) => i.id === editingItem)
              if (!item) return null

              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-purple-300">Title</Label>
                      <Input
                        value={item.title}
                        onChange={(e) => updateItem(editingItem, { title: e.target.value })}
                        className="bg-black/50 border-purple-500/30 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-purple-300">Category</Label>
                      <Select
                        value={item.category}
                        onValueChange={(value) => updateItem(editingItem, { category: value })}
                      >
                        <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.slice(1).map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-purple-300">Description</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateItem(editingItem, { description: e.target.value })}
                      className="bg-black/50 border-purple-500/30 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-purple-300">Body Part</Label>
                      <Select
                        value={item.bodyPart}
                        onValueChange={(value) => updateItem(editingItem, { bodyPart: value })}
                      >
                        <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {bodyParts.map((part) => (
                            <SelectItem key={part} value={part}>
                              {part}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-purple-300">Size</Label>
                      <Select value={item.size} onValueChange={(value) => updateItem(editingItem, { size: value })}>
                        <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sizes.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-purple-300">Completion Time</Label>
                      <Input
                        value={item.completionTime}
                        onChange={(e) => updateItem(editingItem, { completionTime: e.target.value })}
                        className="bg-black/50 border-purple-500/30 text-white"
                        placeholder="e.g., 4 hours"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-purple-300">Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-purple-900/50 text-purple-200">
                          {tag}
                          <button onClick={() => removeTag(editingItem, tag)} className="ml-2 hover:text-red-400">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        className="bg-black/50 border-purple-500/30 text-white"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            addTag(editingItem, newTag)
                            setNewTag("")
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          addTag(editingItem, newTag)
                          setNewTag("")
                        }}
                        size="sm"
                        className="bg-purple-700 hover:bg-purple-600"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingItem(null)}
                      className="bg-black/50 border-purple-500/30"
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => setEditingItem(null)} className="bg-purple-700 hover:bg-purple-600">
                      Save Changes
                    </Button>
                  </div>
                </>
              )
            })()}
          </CardContent>
        </Card>
      )}

      {/* Portfolio Stats */}
      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Portfolio Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{portfolioItems.length}</div>
              <div className="text-sm text-purple-300">Total Works</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {portfolioItems.filter((i) => i.featured).length}
              </div>
              <div className="text-sm text-purple-300">Featured</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {new Set(portfolioItems.map((i) => i.category)).size}
              </div>
              <div className="text-sm text-purple-300">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">4.9</div>
              <div className="text-sm text-purple-300">Avg Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
