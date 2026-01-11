'use client'

import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Link from 'next/link'

interface NotificationsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoggedIn: boolean
}

export default function NotificationsDialog({ open, onOpenChange, isLoggedIn }: NotificationsDialogProps) {
  if (!isLoggedIn) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bejelentkezés szükséges</DialogTitle>
            <DialogDescription>
              Az értesítések megtekintéséhez be kell jelentkezned.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
              <Bell className="w-8 h-8 text-accent" />
            </div>
            <p className="text-center text-muted-foreground">
              Jelentkezz be, hogy követhesd kedvenc animéid új részeit és értesítéseket kaphass!
            </p>
            <Link href="/login" className="w-full" onClick={() => onOpenChange(false)}>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Bejelentkezés
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Értesítések</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-3">
          {/* Példa értesítések - később dinamikus lesz */}
          <div className="text-center text-muted-foreground py-8">
            Jelenleg nincsenek új értesítéseid
          </div>
          
          {/* Később itt jönnek a valódi értesítések:
          <div className="p-3 rounded-lg border border-border hover:bg-accent/10 cursor-pointer">
            <p className="font-semibold">Új rész elérhető!</p>
            <p className="text-sm text-muted-foreground">Chainsaw Man - 13. rész</p>
            <span className="text-xs text-muted-foreground">2 órája</span>
          </div>
          */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
