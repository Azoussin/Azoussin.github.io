"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, Trash2, File, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface FileRecord {
  id: string
  user_id: string
  file_name: string
  file_url: string
  file_type: string
  file_size: number
  created_at: string
}

/**
 * Files page component
 * Allows users to upload, view, download, and delete files
 */
export default function FilesPage() {
  const [files, setFiles] = useState<FileRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching files:", error)
      } else {
        setFiles(data || [])
      }
    } catch (err) {
      console.error("Error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from("vault")
        .upload(fileName, file)

      if (uploadError) {
        console.error("Error uploading file:", uploadError)
        return
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("vault")
        .getPublicUrl(fileName)

      // Save file metadata to database
      const { error: dbError } = await supabase
        .from("files")
        .insert([
          {
            user_id: user.id,
            file_name: file.name,
            file_url: publicUrl,
            file_type: file.type,
            file_size: file.size,
          },
        ])

      if (dbError) {
        console.error("Error saving file metadata:", dbError)
      } else {
        fetchFiles()
      }
    } catch (err) {
      console.error("Error:", err)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const deleteFile = async (fileRecord: FileRecord) => {
    if (!confirm("Are you sure you want to delete this file?")) return

    try {
      // Extract file path from URL
      const urlParts = fileRecord.file_url.split('/vault/')
      const filePath = urlParts[1]

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("vault")
        .remove([filePath])

      if (storageError) {
        console.error("Error deleting file from storage:", storageError)
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("files")
        .delete()
        .eq("id", fileRecord.id)

      if (dbError) {
        console.error("Error deleting file record:", dbError)
      } else {
        fetchFiles()
      }
    } catch (err) {
      console.error("Error:", err)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const isImage = (fileType: string) => {
    return fileType.startsWith('image/')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading files...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Files</h1>
          <p className="text-muted-foreground mt-2">
            Manage your uploaded files
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Uploading..." : "Upload File"}
          </Button>
        </div>
      </div>

      {files.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground text-center">
              No files yet. Upload your first file to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <Card key={file.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  {isImage(file.file_type) ? (
                    <ImageIcon className="h-5 w-5" />
                  ) : (
                    <File className="h-5 w-5" />
                  )}
                  <span className="truncate">{file.file_name}</span>
                </CardTitle>
                <CardDescription>
                  {formatFileSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isImage(file.file_type) && (
                    <div className="relative w-full h-48 bg-muted rounded-md overflow-hidden">
                      <Image
                        src={file.file_url}
                        alt={file.file_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <a href={file.file_url} download target="_blank" rel="noopener noreferrer">
                        <Download className="h-3 w-3 mr-2" />
                        Download
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteFile(file)}
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
