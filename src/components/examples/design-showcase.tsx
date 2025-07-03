"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card-new"
import { Button } from "@/components/ui/button-new"
import { Input } from "@/components/ui/input-new"
import { Badge } from "@/components/ui/badge-new"
import { 
  Sparkles, 
  Zap, 
  Target, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Search,
  Download,
  Settings,
  User,
  Mail
} from "lucide-react"

export function DesignShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="outline-primary" className="mb-4">
            <Sparkles className="h-4 w-4" />
            Design System Preview
          </Badge>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 bg-clip-text text-transparent">
            Einheitliches Design System
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Basierend auf der Primärfarbe #34CCCD - Modern, konsistent und benutzerfreundlich
          </p>
        </div>

        {/* Color Palette */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>Farbpalette</CardTitle>
            <CardDescription>Primärfarbe #34CCCD mit semantischen Farben</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-16 bg-primary-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium">#34CCCD</span>
                </div>
                <p className="text-sm font-medium text-center">Primary</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-success-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium">#3DDC97</span>
                </div>
                <p className="text-sm font-medium text-center">Success</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-warning-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium">#FFC260</span>
                </div>
                <p className="text-sm font-medium text-center">Warning</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-danger-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium">#FF6B6B</span>
                </div>
                <p className="text-sm font-medium text-center">Danger</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Verschiedene Button-Varianten und -Größen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Button Variants */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Varianten</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="default">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="warning">Warning</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>
              
              {/* Button Sizes */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Größen</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Button with Icons */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Mit Icons</h4>
                <div className="flex flex-wrap gap-3">
                  <Button>
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline">
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                  <Button variant="secondary">
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Elements */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>Formulare</CardTitle>
            <CardDescription>Input-Felder und Formulelemente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Standard Input</label>
                  <Input placeholder="Hier eingeben..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Error State</label>
                  <Input variant="error" placeholder="Fehlerhafte Eingabe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Success State</label>
                  <Input variant="success" placeholder="Erfolgreiche Eingabe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Warning State</label>
                  <Input variant="warning" placeholder="Warnung" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Input-Größen</h4>
                <div className="space-y-3">
                  <Input placeholder="Small Input" className="h-8 text-sm" />
                  <Input placeholder="Default Input" />
                  <Input placeholder="Large Input" className="h-12 text-lg" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Status-Badges und Labels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Standard Badges</h4>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="destructive">Error</Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Outline Badges</h4>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="outline-primary">Primary Outline</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Mit Icons</h4>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="success">
                    <CheckCircle className="h-3 w-3" />
                    Erfolgreich
                  </Badge>
                  <Badge variant="warning">
                    <AlertTriangle className="h-3 w-3" />
                    Warnung
                  </Badge>
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3" />
                    Fehler
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>Cards</CardTitle>
            <CardDescription>Verschiedene Card-Varianten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card variant="default" size="comfortable">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Zap className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Standard Card</CardTitle>
                      <CardDescription>Normale Karte</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Dies ist eine Standard-Karte mit normalem Styling.
                  </p>
                </CardContent>
              </Card>

              <Card variant="interactive" size="comfortable">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                      <Target className="h-5 w-5 text-success-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Interactive Card</CardTitle>
                      <CardDescription>Hover-Effekt</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Diese Karte reagiert auf Hover mit Schatten-Effekt.
                  </p>
                </CardContent>
              </Card>

              <Card variant="highlighted" size="comfortable">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-200 rounded-lg flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary-700" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Highlighted Card</CardTitle>
                      <CardDescription>Hervorgehoben</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Diese Karte ist mit Primary-Farbe hervorgehoben.
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form Example */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>Beispiel: Kontaktformular</CardTitle>
            <CardDescription>Vollständiges Formular mit dem neuen Design</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md mx-auto space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <Input placeholder="Ihr Name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">E-Mail</label>
                <Input type="email" placeholder="ihre@email.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Telefon</label>
                <Input type="tel" placeholder="+49 123 456789" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nachricht</label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                  placeholder="Ihre Nachricht..."
                />
              </div>
              <Button className="w-full">
                <Mail className="h-4 w-4" />
                Nachricht senden
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}