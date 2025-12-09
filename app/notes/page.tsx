"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Edit, Save, X } from "lucide-react"

interface Note {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
}

/**
 * Notes page component
 * Allows users to create, read, update, and delete notes
 */
export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNewNote, setShowNewNote] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const supabase = createClient()

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching notes:", error)
      } else {
        setNotes(data || [])
      }
    } catch (err) {
      console.error("Error:", err)
    } finally {
      setLoading(false)
    }
  }

  const createNote = async () => {
    if (!newTitle.trim() || !newContent.trim()) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { error } = await supabase
        .from("notes")
        .insert([
          {
            user_id: user.id,
            title: newTitle,
            content: newContent,
          },
        ])

      if (error) {
        console.error("Error creating note:", error)
      } else {
        setNewTitle("")
        setNewContent("")
        setShowNewNote(false)
        fetchNotes()
      }
    } catch (err) {
      console.error("Error:", err)
    }
  }

  const updateNote = async (id: string) => {
    if (!editTitle.trim() || !editContent.trim()) return

    try {
      const { error } = await supabase
        .from("notes")
        .update({
          title: editTitle,
          content: editContent,
        })
        .eq("id", id)

      if (error) {
        console.error("Error updating note:", error)
      } else {
        setEditingId(null)
        fetchNotes()
      }
    } catch (err) {
      console.error("Error:", err)
    }
  }

  const deleteNote = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return

    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)

      if (error) {
        console.error("Error deleting note:", error)
      } else {
        fetchNotes()
      }
    } catch (err) {
      console.error("Error:", err)
    }
  }

  const startEdit = (note: Note) => {
    setEditingId(note.id)
    setEditTitle(note.title)
    setEditContent(note.content)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle("")
    setEditContent("")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading notes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Notes</h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal notes
          </p>
        </div>
        <Button onClick={() => setShowNewNote(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* New note form */}
      {showNewNote && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Note</CardTitle>
            <CardDescription>Add a new note to your collection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newTitle">Title</Label>
              <Input
                id="newTitle"
                placeholder="Enter note title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newContent">Content</Label>
              <Textarea
                id="newContent"
                placeholder="Enter note content"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={6}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={createNote}>
                <Save className="h-4 w-4 mr-2" />
                Save Note
              </Button>
              <Button variant="outline" onClick={() => setShowNewNote(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes list */}
      {notes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground text-center">
              No notes yet. Create your first note to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                {editingId === note.id ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="font-semibold"
                  />
                ) : (
                  <CardTitle>{note.title}</CardTitle>
                )}
                <CardDescription>
                  {new Date(note.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {editingId === note.id ? (
                  <div className="space-y-4">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateNote(note.id)}>
                        <Save className="h-3 w-3 mr-2" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        <X className="h-3 w-3 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {note.content}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(note)}>
                        <Edit className="h-3 w-3 mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteNote(note.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
