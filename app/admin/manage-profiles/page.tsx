"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Search, Edit2, Trash2, Check, X, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import profilesData from "@/app/data/profiles.json"

interface Profile {
  id: number
  email: string
  felhasznalonev: string
  jelszoHash: string
  salt: string
  profilkep: string | null
  jog: number
}

const getRoleLabel = (jog: number) => {
  switch (jog) {
    case 0: return { label: "Inaktív", color: "text-gray-500 bg-gray-500/20" }
    case 1: return { label: "Felhasználó", color: "text-blue-500 bg-blue-500/20" }
    case 2: return { label: "Szerkesztő", color: "text-purple-500 bg-purple-500/20" }
    case 3: return { label: "Főszerkesztő", color: "text-orange-500 bg-orange-500/20" }
    case 4: return { label: "Admin", color: "text-red-500 bg-red-500/20" }
    case 5: return { label: "Tulajdonos", color: "text-yellow-500 bg-yellow-500/20" }
    default: return { label: "Ismeretlen", color: "text-gray-500 bg-gray-500/20" }
  }
}

export default function ManageProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>(profilesData as Profile[])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Partial<Profile>>({})

  const filteredProfiles = profiles.filter(profile =>
    profile.id.toString().includes(searchTerm) ||
    profile.felhasznalonev.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const startEdit = (profile: Profile) => {
    setEditingId(profile.id)
    setEditForm(profile)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const saveEdit = () => {
    // Here you would typically save to backend
    setProfiles(profiles.map(p => p.id === editingId ? { ...p, ...editForm } as Profile : p))
    setEditingId(null)
    setEditForm({})
  }

  const deleteProfile = (id: number) => {
    if (confirm('Biztosan törölni szeretnéd ezt a profilt?')) {
      setProfiles(profiles.filter(p => p.id !== id))
    }
  }

  const exportProfiles = () => {
    const dataStr = JSON.stringify(profiles, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'profiles.json'
    link.click()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-primary">Felhasználók kezelése</h1>
              <p className="text-sm text-muted-foreground">Profilok szerkesztése és jogosultságok</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          {[0, 1, 2, 3, 4, 5].map(level => {
            const count = profiles.filter(p => p.jog === level).length
            const role = getRoleLabel(level)
            return (
              <Card key={level} className="p-4 bg-card border-border">
                <p className="text-sm text-muted-foreground mb-1">{role.label}</p>
                <p className="text-2xl font-bold">{count}</p>
              </Card>
            )
          })}
        </div>

        {/* Search */}
        <Card className="p-4 mb-6 bg-card border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Keresés felhasználónév, email vagy ID alapján..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Profiles Table */}
        <Card className="bg-card border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Felhasználónév</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Jogosultság</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Műveletek</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProfiles.map((profile) => {
                  const isEditing = editingId === profile.id
                  const role = getRoleLabel(profile.jog)

                  return (
                    <tr key={profile.id} className="hover:bg-accent/5 transition">
                      <td className="px-4 py-3 text-sm font-mono">{profile.id}</td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <Input
                            value={editForm.felhasznalonev || ''}
                            onChange={(e) => setEditForm({ ...editForm, felhasznalonev: e.target.value })}
                            className="h-8"
                          />
                        ) : (
                          <span className="font-medium">{profile.felhasznalonev}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <Input
                            type="email"
                            value={editForm.email || ''}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="h-8"
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground">{profile.email}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <select
                            value={editForm.jog ?? profile.jog}
                            onChange={(e) => setEditForm({ ...editForm, jog: Number(e.target.value) })}
                            className="h-8 px-2 rounded-md border border-border bg-background"
                          >
                            <option value={0}>Inaktív</option>
                            <option value={1}>Felhasználó</option>
                            <option value={2}>Szerkesztő</option>
                            <option value={3}>Főszerkesztő</option>
                            <option value={4}>Admin</option>
                            <option value={5}>Tulajdonos</option>
                          </select>
                        ) : (
                          <span className={`text-xs px-2 py-1 rounded ${role.color}`}>
                            {role.label}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {isEditing ? (
                            <>
                              <Button size="sm" variant="ghost" onClick={saveEdit}>
                                <Check className="w-4 h-4 text-green-500" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={cancelEdit}>
                                <X className="w-4 h-4 text-red-500" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="ghost" onClick={() => startEdit(profile)}>
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => deleteProfile(profile.id)}
                                disabled={profile.jog === 5}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredProfiles.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              Nincs találat a keresési feltételeknek megfelelően
            </div>
          )}
        </Card>

        <div className="mt-4 text-sm text-muted-foreground">
          Összesen {profiles.length} felhasználó, {filteredProfiles.length} megjelenítve
        </div>
      </div>
    </div>
  )
}
