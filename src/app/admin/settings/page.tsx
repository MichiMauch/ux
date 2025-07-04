"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Settings,
  Save,
  RefreshCw,
  Database,
  Mail,
  Key,
  Globe,
  Shield,
  Bell,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "email" | "api" | "security" | "system">("general");

  const [settings, setSettings] = useState({
    general: {
      siteName: "UX-Analyzer",
      siteUrl: "https://ux-analyzer.com",
      timezone: "Europe/Berlin",
      language: "de",
      maintenanceMode: false,
    },
    email: {
      smtpHost: "smtp.example.com",
      smtpPort: "587",
      smtpUser: "noreply@ux-analyzer.com",
      smtpPassword: "••••••••",
      fromEmail: "noreply@ux-analyzer.com",
      fromName: "UX-Analyzer",
    },
    api: {
      rateLimit: "100",
      cacheTtl: "3600",
      enableCors: true,
      allowedOrigins: "https://ux-analyzer.com",
      apiKey: "••••••••••••••••",
    },
    security: {
      sessionTimeout: "1440",
      maxLoginAttempts: "5",
      passwordMinLength: "8",
      requireMfa: false,
      allowRegistration: true,
    },
    system: {
      backupFrequency: "daily",
      logLevel: "info",
      cleanupOldAnalyses: "90",
      maxFileSize: "10",
    }
  });

  const handleSave = async (category: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Saving ${category} settings:`, settings[category as keyof typeof settings]);
      // In a real app, you would make an API call here
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const systemStatus = {
    database: { status: "healthy", lastCheck: "2 Minuten", responseTime: "12ms" },
    cache: { status: "healthy", lastCheck: "1 Minute", hitRate: "94%" },
    email: { status: "healthy", lastCheck: "5 Minuten", lastSent: "10 Minuten" },
    storage: { status: "warning", usage: "78%", available: "2.1 GB" },
    apis: { status: "healthy", uptime: "99.9%", avgResponse: "245ms" }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-success-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning-600" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-danger-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const tabs = [
    { id: "general", label: "Allgemein", icon: Settings },
    { id: "email", label: "E-Mail", icon: Mail },
    { id: "api", label: "API", icon: Key },
    { id: "security", label: "Sicherheit", icon: Shield },
    { id: "system", label: "System", icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Einstellungen</h1>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          System Check
        </Button>
      </div>

      {/* System Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(systemStatus).map(([key, status]) => (
              <div key={key} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium capitalize">{key}</span>
                  {getStatusIcon(status.status)}
                </div>
                <div className="space-y-1 text-xs text-gray-500">
                  {Object.entries(status).filter(([k]) => k !== "status").map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="capitalize">{k.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <IconComponent className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Settings Content */}
      <Card>
        <CardContent className="p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Allgemeine Einstellungen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Seitenname
                    </label>
                    <Input
                      value={settings.general.siteName}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, siteName: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website URL
                    </label>
                    <Input
                      value={settings.general.siteUrl}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, siteUrl: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zeitzone
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={settings.general.timezone}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, timezone: e.target.value }
                      })}
                    >
                      <option value="Europe/Berlin">Europe/Berlin</option>
                      <option value="Europe/London">Europe/London</option>
                      <option value="America/New_York">America/New_York</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sprache
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={settings.general.language}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, language: e.target.value }
                      })}
                    >
                      <option value="de">Deutsch</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.general.maintenanceMode}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, maintenanceMode: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm">Wartungsmodus aktiviert</span>
                  </label>
                </div>
              </div>
              <Button onClick={() => handleSave("general")} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Speichere..." : "Speichern"}
              </Button>
            </div>
          )}

          {activeTab === "email" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">E-Mail Einstellungen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SMTP Host
                    </label>
                    <Input
                      value={settings.email.smtpHost}
                      onChange={(e) => setSettings({
                        ...settings,
                        email: { ...settings.email, smtpHost: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SMTP Port
                    </label>
                    <Input
                      value={settings.email.smtpPort}
                      onChange={(e) => setSettings({
                        ...settings,
                        email: { ...settings.email, smtpPort: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SMTP Benutzer
                    </label>
                    <Input
                      value={settings.email.smtpUser}
                      onChange={(e) => setSettings({
                        ...settings,
                        email: { ...settings.email, smtpUser: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SMTP Passwort
                    </label>
                    <Input
                      type="password"
                      value={settings.email.smtpPassword}
                      onChange={(e) => setSettings({
                        ...settings,
                        email: { ...settings.email, smtpPassword: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Absender E-Mail
                    </label>
                    <Input
                      value={settings.email.fromEmail}
                      onChange={(e) => setSettings({
                        ...settings,
                        email: { ...settings.email, fromEmail: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Absender Name
                    </label>
                    <Input
                      value={settings.email.fromName}
                      onChange={(e) => setSettings({
                        ...settings,
                        email: { ...settings.email, fromName: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSave("email")} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Speichere..." : "Speichern"}
              </Button>
            </div>
          )}

          {activeTab === "api" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">API Einstellungen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rate Limit (Anfragen/Minute)
                    </label>
                    <Input
                      value={settings.api.rateLimit}
                      onChange={(e) => setSettings({
                        ...settings,
                        api: { ...settings.api, rateLimit: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cache TTL (Sekunden)
                    </label>
                    <Input
                      value={settings.api.cacheTtl}
                      onChange={(e) => setSettings({
                        ...settings,
                        api: { ...settings.api, cacheTtl: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Erlaubte Origins
                    </label>
                    <Input
                      value={settings.api.allowedOrigins}
                      onChange={(e) => setSettings({
                        ...settings,
                        api: { ...settings.api, allowedOrigins: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Schlüssel
                    </label>
                    <div className="flex">
                      <Input
                        type="password"
                        value={settings.api.apiKey}
                        readOnly
                        className="flex-1"
                      />
                      <Button variant="outline" className="ml-2">
                        Neu generieren
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.api.enableCors}
                      onChange={(e) => setSettings({
                        ...settings,
                        api: { ...settings.api, enableCors: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm">CORS aktiviert</span>
                  </label>
                </div>
              </div>
              <Button onClick={() => handleSave("api")} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Speichere..." : "Speichern"}
              </Button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Sicherheitseinstellungen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Timeout (Minuten)
                    </label>
                    <Input
                      value={settings.security.sessionTimeout}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, sessionTimeout: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max. Login-Versuche
                    </label>
                    <Input
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, maxLoginAttempts: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min. Passwort-Länge
                    </label>
                    <Input
                      value={settings.security.passwordMinLength}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, passwordMinLength: e.target.value }
                      })}
                    />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.security.requireMfa}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, requireMfa: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm">Zwei-Faktor-Authentifizierung erforderlich</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.security.allowRegistration}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, allowRegistration: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm">Registrierung erlaubt</span>
                  </label>
                </div>
              </div>
              <Button onClick={() => handleSave("security")} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Speichere..." : "Speichern"}
              </Button>
            </div>
          )}

          {activeTab === "system" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">System Einstellungen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Backup-Häufigkeit
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={settings.system.backupFrequency}
                      onChange={(e) => setSettings({
                        ...settings,
                        system: { ...settings.system, backupFrequency: e.target.value }
                      })}
                    >
                      <option value="hourly">Stündlich</option>
                      <option value="daily">Täglich</option>
                      <option value="weekly">Wöchentlich</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Log Level
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={settings.system.logLevel}
                      onChange={(e) => setSettings({
                        ...settings,
                        system: { ...settings.system, logLevel: e.target.value }
                      })}
                    >
                      <option value="error">Error</option>
                      <option value="warn">Warning</option>
                      <option value="info">Info</option>
                      <option value="debug">Debug</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Analysen löschen nach (Tage)
                    </label>
                    <Input
                      value={settings.system.cleanupOldAnalyses}
                      onChange={(e) => setSettings({
                        ...settings,
                        system: { ...settings.system, cleanupOldAnalyses: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max. Dateigröße (MB)
                    </label>
                    <Input
                      value={settings.system.maxFileSize}
                      onChange={(e) => setSettings({
                        ...settings,
                        system: { ...settings.system, maxFileSize: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSave("system")} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Speichere..." : "Speichern"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}