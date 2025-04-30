"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Trash2, Mail, MailOpen, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import { getMessages, markMessageAsRead, deleteMessage } from "@/lib/data"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"

type Message = {
  id: number
  name: string
  email: string
  message: string
  read: boolean
  created_at: string
  updated_at: string
}

export default function MessagesManagement() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const data = await getMessages()
      setMessages(data as Message[])
    } catch (error: any) {
      toast({
        title: "Error fetching messages",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      const success = await deleteMessage(id)

      if (success) {
        setMessages(messages.filter((message) => message.id !== id))
        toast({
          title: "Message deleted",
          description: "The message has been successfully deleted.",
        })
      } else {
        throw new Error("Failed to delete message")
      }
    } catch (error: any) {
      toast({
        title: "Error deleting message",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      const success = await markMessageAsRead(id)

      if (success) {
        setMessages(messages.map((message) => (message.id === id ? { ...message, read: true } : message)))
        toast({
          title: "Message marked as read",
          description: "The message has been marked as read.",
        })
      } else {
        throw new Error("Failed to mark message as read")
      }
    } catch (error: any) {
      toast({
        title: "Error updating message",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message)

    // If message is unread, mark it as read
    if (!message.read) {
      handleMarkAsRead(message.id)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a")
    } catch (e) {
      return dateString
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Messages Management</h2>
        <Button onClick={fetchMessages} variant="outline" size="sm">
          <Mail className="mr-2 h-4 w-4" /> Refresh Messages
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No messages found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className={`overflow-hidden ${!message.read ? "border-primary" : ""}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{message.name}</h3>
                      {!message.read && (
                        <Badge variant="default" className="bg-primary text-primary-foreground">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{message.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(message.created_at)}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewMessage(message)}>
                      {message.read ? <MailOpen className="h-4 w-4 mr-1" /> : <Mail className="h-4 w-4 mr-1" />}
                      {message.read ? "View" : "Read"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => setDeleteId(message.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm line-clamp-2">{message.message}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Message from {selectedMessage?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium">From: {selectedMessage?.name}</p>
                <p className="text-sm text-muted-foreground">
                  <a href={`mailto:${selectedMessage?.email}`} className="flex items-center gap-1 hover:underline">
                    {selectedMessage?.email}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedMessage?.created_at && formatDate(selectedMessage.created_at)}
              </p>
            </div>

            <div className="border-t pt-4">
              <p className="whitespace-pre-wrap">{selectedMessage?.message}</p>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                Close
              </Button>
              <Button
                variant="outline"
                className="text-red-500 hover:text-red-700"
                onClick={() => {
                  if (selectedMessage) {
                    setDeleteId(selectedMessage.id)
                    setSelectedMessage(null)
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
