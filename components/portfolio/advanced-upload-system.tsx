"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Upload, FolderIcon, Eye, Edit, Trash2, Grid, List, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

interface PortfolioImage {
  id: string
  file?: File
  url: string
  name: string
  size: number
  category: string
  tags: string[]
  description: string
  uploadDate: string
  isPublic: boolean
  isFeatured: boolean
  dimensions?: { width: number; height: number }
  folder?: string
}

interface Folder {
  id: string
  name: string
  color: string
  imageCount: number
}

const mockFolders: Folder[] = [
  { id: "all", name: "All Images", color: "purple", imageCount: 24 },
  { id: "traditional", name: "Traditional", color: "red", imageCount: 8 },
  { id: "blackwork", name: "Blackwork", color: "gray", imageCount: 6 },
  { id: "watercolor", name: "Watercolor", color: "blue", imageCount: 4 },
  { id: "geometric", name: "Geometric", color: "green", imageCount: 6 },
]

const mockImages: PortfolioImage[] = [
  {
    id: "1",
    url: "/images/tattoo-mythological.png",
    name: "mythological-patchwork.jpg",
    size: 3200000,
    category: "Blackwork",
    tags: ["mythological", "blackwork", "symbolic"],
    description: "Mythological patchwork design with symbolic elements",
    uploadDate: "2024-01-15",
    isPublic: true,
    isFeatured: true,
    dimensions: { width: 1920, height: 1080 },
    folder: "blackwork",
  },
  {
    id: "2",
    url: "/images/tattoo-illuminati-hand.png",
    name: "illuminati-hand.jpg",
    size: 2800000,
    category: "Symbolic",
    tags: ["illuminati", "hand", "symbolic"],
    description: "Illuminati hand design with intricate details",
    uploadDate: "2024-01-14",
    isPublic: true,
    isFeatured: false,
    dimensions: { width: 1600, height: 1200 },
    folder: "blackwork",
  },
  {
    id: "3",
    url: "/images/tattoo-cyberpunk.png",
    name: "cyberpunk-arm.jpg",
    size: 4100000,
    category: "Cyberpunk",
    tags: ["cyberpunk", "arm", "neon", "futuristic"],
    description: "Cyberpunk arm design with neon elements",
    uploadDate: "2024-01-13",
    isPublic: true,
    isFeatured: true,
    dimensions: { width: 2048, height: 1536 },
    folder: "geometric",
  },
]

export function AdvancedUploadSystem() {
  const [images, setImages] = useState<PortfolioImage[]>(mockImages)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedFolder, setSelectedFolder] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [editingImage, setEditingImage] = useState<PortfolioImage | null>(null)
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [draggedOver, setDraggedOver] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredImages = images.filter((image) => {
    const matchesFolder = selectedFolder === "all" || image.folder === selectedFolder
    const matchesSearch =
      searchQuery === "" ||
      image.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      image.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFolder && matchesSearch
  })

  const handleFileSelect = useCallback((files: FileList) => {
    const validFiles = Array.from(files).filter((file) => {
      const isImage = file.type.startsWith("image/")
      const isUnderLimit = file.size <= 10 * 1024 * 1024 // 10MB limit

      if (!isImage) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file.`,
          variant: "destructive",
        })
      } else if (!isUnderLimit) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 10MB limit.`,
          variant: "destructive",
        })
      }

      return isImage && isUnderLimit
    })

    if (validFiles.length > 0) {
      simulateUpload(validFiles)
    }
  }, [])

  const simulateUpload = async (files: File[]) => {
    setIsUploading(true)
    setUploadProgress(0)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const progress = ((i + 1) / files.length) * 100
      setUploadProgress(progress)

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newImage: PortfolioImage = {
        id: Date.now().toString() + i,
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        category: "Uncategorized",
        tags: [],
        description: "",
        uploadDate: new Date().toISOString().split("T")[0],
        isPublic: true,
        isFeatured: false,
        folder: selectedFolder === "all" ? undefined : selectedFolder,
      }

      setImages((prev) => [...prev, newImage])
    }

    setIsUploading(false)
    setUploadProgress(0)

    toast({
      title: "Upload successful",
      description: `${files.length} image(s) uploaded successfully.`,
    })
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDraggedOver(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFileSelect(files)
      }
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDraggedOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDraggedOver(false)
  }, [])

  const handleImageSelect = (imageId: string) => {
    setSelectedImages((prev) => (prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]))
  }

  const handleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([])
    } else {
      setSelectedImages(filteredImages.map((img) => img.id))
    }
  }

  const handleDeleteSelected = () => {
    setImages((prev) => prev.filter((img) => !selectedImages.includes(img.id)))
    setSelectedImages([])
    toast({
      title: "Images deleted",
      description: `${selectedImages.length} image(s) deleted successfully.`,
    })
  }

  const handleBulkEdit = (updates: Partial<PortfolioImage>) => {
    setImages((prev) => prev.map((img) => (selectedImages.includes(img.id) ? { ...img, ...updates } : img)))
    setSelectedImages([])
    toast({
      title: "Images updated",
      description: `${selectedImages.length} image(s) updated successfully.`,
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Portfolio Management</h2>
          <p className="text-purple-300">Upload, organize, and manage your tattoo portfolio</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="bg-black/40 border-purple-500/30"
          >
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>

          <Button onClick={() => fileInputRef.current?.click()} className="bg-purple-700 hover:bg-purple-600">
            <Upload className="mr-2 h-4 w-4" />
            Upload Images
          </Button>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card className="bg-black/40 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white">Uploading images...</span>
              <span className="text-purple-300">{uploadProgress.toFixed(0)}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Folders */}
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Folders</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowCreateFolder(true)} className="h-6 w-6">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockFolders.map((folder) => (
                <div
                  key={folder.id}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedFolder === folder.id ? "bg-purple-800/30 border border-purple-500/50" : "hover:bg-black/40"
                  }`}
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  <div className="flex items-center gap-2">
                    <FolderIcon className={`h-4 w-4 text-${folder.color}-400`} />
                    <span className="text-white text-sm">{folder.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {folder.imageCount}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-purple-300">Total Images</span>
                <span className="text-white font-medium">{images.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Featured</span>
                <span className="text-white font-medium">{images.filter((img) => img.isFeatured).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Public</span>
                <span className="text-white font-medium">{images.filter((img) => img.isPublic).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Storage Used</span>
                <span className="text-white font-medium">
                  {formatFileSize(images.reduce((acc, img) => acc + img.size, 0))}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search images, tags, descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/40 border-purple-500/30"
              />
            </div>

            <div className="flex items-center gap-2">
              {selectedImages.length > 0 && (
                <>
                  <Badge variant="secondary">{selectedImages.length} selected</Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-black/40 border-purple-500/30">
                        Bulk Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-900 border-purple-500/30">
                      <DropdownMenuItem onClick={() => handleBulkEdit({ isPublic: true })}>
                        Make Public
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkEdit({ isPublic: false })}>
                        Make Private
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkEdit({ isFeatured: true })}>
                        Mark as Featured
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleDeleteSelected} className="text-red-400">
                        Delete Selected
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="bg-black/40 border-purple-500/30"
              >
                {selectedImages.length === filteredImages.length ? "Deselect All" : "Select All"}
              </Button>
            </div>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              draggedOver ? "border-purple-400 bg-purple-900/20" : "border-purple-500/30 hover:border-purple-500/50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
            />
            <Upload className="h-12 w-12 mx-auto text-purple-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Drop images here or click to upload</h3>
            <p className="text-purple-300">Support for PNG, JPG, GIF up to 10MB each</p>
          </div>

          {/* Images Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <Card key={image.id} className="bg-black/40 border-purple-500/30 overflow-hidden group">
                  <div className="relative">
                    <img src={image.url || "/placeholder.svg"} alt={image.name} className="w-full h-48 object-cover" />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={() => setEditingImage(image)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2">
                      <Checkbox
                        checked={selectedImages.includes(image.id)}
                        onCheckedChange={() => handleImageSelect(image.id)}
                        className="bg-black/50 border-white"
                      />
                    </div>

                    {/* Badges */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {image.isFeatured && <Badge className="bg-yellow-600 text-xs">Featured</Badge>}
                      {!image.isPublic && <Badge className="bg-red-600 text-xs">Private</Badge>}
                    </div>
                  </div>

                  <CardContent className="p-3">
                    <h4 className="font-medium text-white truncate">{image.name}</h4>
                    <p className="text-xs text-purple-300 mt-1">{image.category}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {image.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {image.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{image.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredImages.map((image) => (
                <Card key={image.id} className="bg-black/40 border-purple-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedImages.includes(image.id)}
                        onCheckedChange={() => handleImageSelect(image.id)}
                      />

                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-white">{image.name}</h4>
                          <div className="flex items-center gap-2">
                            {image.isFeatured && <Badge className="bg-yellow-600">Featured</Badge>}
                            {!image.isPublic && <Badge className="bg-red-600">Private</Badge>}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-1 text-sm text-purple-300">
                          <span>{image.category}</span>
                          <span>{formatFileSize(image.size)}</span>
                          <span>{image.uploadDate}</span>
                          {image.dimensions && (
                            <span>
                              {image.dimensions.width}×{image.dimensions.height}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {image.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setEditingImage(image)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Image Dialog */}
      {editingImage && (
        <Dialog open={!!editingImage} onOpenChange={() => setEditingImage(null)}>
          <DialogContent className="bg-gray-900 border-purple-500/30 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Image Details</DialogTitle>
              <DialogDescription className="text-purple-300">Update image information and settings</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <img
                  src={editingImage.url || "/placeholder.svg"}
                  alt={editingImage.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={editingImage.name}
                    onChange={(e) => setEditingImage({ ...editingImage, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select
                    value={editingImage.category}
                    onValueChange={(value) => setEditingImage({ ...editingImage, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Traditional">Traditional</SelectItem>
                      <SelectItem value="Blackwork">Blackwork</SelectItem>
                      <SelectItem value="Watercolor">Watercolor</SelectItem>
                      <SelectItem value="Geometric">Geometric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={editingImage.description}
                    onChange={(e) => setEditingImage({ ...editingImage, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingImage(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setImages((prev) => prev.map((img) => (img.id === editingImage.id ? editingImage : img)))
                  setEditingImage(null)
                  toast({
                    title: "Image updated",
                    description: "Image details have been saved successfully.",
                  })
                }}
                className="bg-purple-700 hover:bg-purple-600"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Folder Dialog */}
      <Dialog open={showCreateFolder} onOpenChange={setShowCreateFolder}>
        <DialogContent className="bg-gray-900 border-purple-500/30 text-white">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription className="text-purple-300">Organize your images into folders</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Folder Name</Label>
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateFolder(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Add folder creation logic here
                setShowCreateFolder(false)
                setNewFolderName("")
                toast({
                  title: "Folder created",
                  description: "New folder has been created successfully.",
                })
              }}
              className="bg-purple-700 hover:bg-purple-600"
            >
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
