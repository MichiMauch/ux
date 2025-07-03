"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Download, Check, AlertCircle, Loader2 } from "lucide-react";
import { AnalysisData, AnalysisResult } from "@/types/analysis";
import useSWR from "swr";

interface GetReportFormProps {
  url: string;
  uxAnalysis: AnalysisResult;
  analysisId?: number;
}

type FormStatus = "idle" | "sending" | "success" | "error";

interface FormState {
  email: string;
  status: FormStatus;
  message: string;
}

const GetReportForm: React.FC<GetReportFormProps> = ({ url, uxAnalysis, analysisId }) => {
  const [formState, setFormState] = useState<FormState>({
    email: "",
    status: "idle",
    message: "",
  });

  // Fetch all analysis data
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data: pageSpeedDesktopData } = useSWR(
    `/api/pagespeed?url=${encodeURIComponent(url)}&strategy=desktop`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const { data: pageSpeedMobileData } = useSWR(
    `/api/pagespeed?url=${encodeURIComponent(url)}&strategy=mobile`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const { data: metaTagsData } = useSWR(
    `/api/meta-tags?url=${encodeURIComponent(url)}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    uxAnalysis,
    pageSpeedData: undefined,
    metaTagsData: undefined,
  });

  useEffect(() => {
    // Combine desktop and mobile data into expected format
    const combinedPageSpeedData =
      pageSpeedDesktopData || pageSpeedMobileData
        ? {
            desktop: pageSpeedDesktopData
              ? {
                  score: pageSpeedDesktopData.performance,
                  performance: pageSpeedDesktopData.performance,
                  accessibility: pageSpeedDesktopData.accessibility,
                  bestPractices: pageSpeedDesktopData.bestPractices,
                  seo: pageSpeedDesktopData.seo,
                  metrics: pageSpeedDesktopData.metrics || {},
                }
              : undefined,
            mobile: pageSpeedMobileData
              ? {
                  score: pageSpeedMobileData.performance,
                  performance: pageSpeedMobileData.performance,
                  accessibility: pageSpeedMobileData.accessibility,
                  bestPractices: pageSpeedMobileData.bestPractices,
                  seo: pageSpeedMobileData.seo,
                  metrics: pageSpeedMobileData.metrics || {},
                }
              : undefined,
          }
        : undefined;

    setAnalysisData({
      uxAnalysis,
      pageSpeedData: combinedPageSpeedData,
      metaTagsData: metaTagsData || undefined,
    });
  }, [uxAnalysis, pageSpeedDesktopData, pageSpeedMobileData, metaTagsData]);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(formState.email)) {
      setFormState((prev) => ({
        ...prev,
        status: "error",
        message: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      }));
      return;
    }

    setFormState((prev) => ({
      ...prev,
      status: "sending",
      message: "PDF wird erstellt und versendet...",
    }));

    try {
      // Log report download if analysisId is available
      if (analysisId) {
        try {
          const downloadResponse = await fetch("/api/log-report-download", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              analysisId,
              email: formState.email,
              reportType: 'pdf'
            }),
          });

          const downloadResult = await downloadResponse.json();
          if (downloadResult.success) {
            console.log("PDF Report Download geloggt:", formState.email, "Download ID:", downloadResult.downloadId);
          } else {
            console.error("Fehler beim Loggen des Downloads:", downloadResult.error);
          }
        } catch (downloadError) {
          console.error("Fehler beim Loggen des Downloads:", downloadError);
        }
      }

      const response = await fetch("/api/send-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formState.email,
          url,
          data: analysisData,
          timestamp: new Date().toLocaleDateString("de-DE"),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setFormState((prev) => ({
          ...prev,
          status: "success",
          message:
            "Report erfolgreich versendet! Bitte prüfen Sie Ihr E-Mail-Postfach.",
        }));
      } else {
        throw new Error(result.error || "Unbekannter Fehler");
      }
    } catch (error) {
      console.error("Error sending report:", error);
      setFormState((prev) => ({
        ...prev,
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Fehler beim Versenden. Bitte versuchen Sie es später erneut.",
      }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({
      ...prev,
      email: e.target.value,
      status: "idle",
      message: "",
    }));
  };

  const getStatusIcon = () => {
    switch (formState.status) {
      case "sending":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "success":
        return <Check className="h-4 w-4 text-green-600" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getStatusBadgeVariant = () => {
    switch (formState.status) {
      case "success":
        return "default" as const;
      case "error":
        return "destructive" as const;
      default:
        return "secondary" as const;
    }
  };

  // Extract summary data for display
  const summaryData = {
    uxScore: uxAnalysis.overallScore || 0,
    desktopSpeed: pageSpeedDesktopData?.performance || 0,
    mobileSpeed: pageSpeedMobileData?.performance || 0,
    metaScore: metaTagsData?.summary?.score || 0,
    totalChecks: (uxAnalysis.categories?.length || 0) + 2 + 1, // UX + Speed + Meta
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-blue-600" />
          <CardTitle>Detaillierten Report erhalten</CardTitle>
        </div>
        <CardDescription>
          Lassen Sie sich den vollständigen UX-Analyse-Report als PDF per E-Mail
          zusenden
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Analysis Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-sm text-gray-700 mb-3">
            Ihr Report enthält:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {summaryData.uxScore}
              </div>
              <div className="text-xs text-gray-600">UX-Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {summaryData.desktopSpeed}
              </div>
              <div className="text-xs text-gray-600">Desktop Speed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {summaryData.mobileSpeed}
              </div>
              <div className="text-xs text-gray-600">Mobile Speed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {summaryData.metaScore}%
              </div>
              <div className="text-xs text-gray-600">SEO Meta</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500 text-center">
            {summaryData.totalChecks} detaillierte Analysen mit Empfehlungen
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              E-Mail-Adresse
            </label>
            <Input
              id="email"
              type="email"
              placeholder="ihre.email@example.com"
              value={formState.email}
              onChange={handleEmailChange}
              disabled={formState.status === "sending"}
              className={`
                ${formState.status === "error" ? "border-red-300 focus:border-red-500" : ""}
                ${formState.status === "success" ? "border-green-300 focus:border-green-500" : ""}
              `}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={
              !formState.email ||
              formState.status === "sending" ||
              formState.status === "success"
            }
            className="w-full"
          >
            {getStatusIcon()}
            <span className="ml-2">
              {formState.status === "sending" && "Report wird erstellt..."}
              {formState.status === "success" && "Report versendet!"}
              {formState.status === "idle" && "PDF-Report per E-Mail erhalten"}
              {formState.status === "error" && "Erneut versuchen"}
            </span>
          </Button>
        </form>

        {/* Status Message */}
        {formState.message && (
          <div className="flex items-center justify-center">
            <Badge variant={getStatusBadgeVariant()} className="px-3 py-1">
              {getStatusIcon()}
              <span className="ml-1">{formState.message}</span>
            </Badge>
          </div>
        )}

        {/* Additional Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Der Report wird als PDF-Datei an Ihre E-Mail-Adresse gesendet</p>
          <p>
            • Enthält alle Analyse-Ergebnisse mit detaillierten Empfehlungen
          </p>
          <p>• Ihre E-Mail-Adresse wird nur für den Versand verwendet</p>
        </div>

        {/* Website URL Display */}
        <div className="border-t pt-4">
          <div className="text-xs text-gray-500 mb-1">Analysierte Website:</div>
          <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-700 break-all">
            {url}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GetReportForm;
