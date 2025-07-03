'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { Clock, Zap, Eye, Lightbulb, ArrowRight, AlertCircle } from 'lucide-react';

interface PageSpeedMetric {
  id: string;
  title: string;
  description: string;
  score: number | null;
  displayValue?: string;
  numericValue?: number;
  numericUnit?: string;
}

interface PageSpeedResult {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  metrics: {
    firstContentfulPaint: PageSpeedMetric;
    largestContentfulPaint: PageSpeedMetric;
    firstInputDelay: PageSpeedMetric;
    cumulativeLayoutShift: PageSpeedMetric;
    speedIndex: PageSpeedMetric;
    totalBlockingTime: PageSpeedMetric;
  };
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    displayValue: string;
  }>;
  url: string;
  timestamp: string;
}

interface SimplifiedRecommendation {
  category: string;
  impact: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionSteps: string[];
  estimatedSavings?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface RecommendationsResult {
  recommendations: SimplifiedRecommendation[];
  url: string;
  timestamp: string;
  originalOpportunities: number;
}

interface PageSpeedCardProps {
  url: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'hard': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function PageSpeedCard({ url }: PageSpeedCardProps) {
  const { data: pagespeedData, error: pagespeedError, isLoading: pagespeedLoading } = useSWR<PageSpeedResult>(
    `/api/pagespeed?url=${encodeURIComponent(url)}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // State for recommendations
  const [recommendationsData, setRecommendationsData] = useState<RecommendationsResult | null>(null);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null);

  // Load recommendations when PageSpeed data is available
  useEffect(() => {
    if (pagespeedData && pagespeedData.opportunities.length > 0) {
      setRecommendationsLoading(true);
      setRecommendationsError(null);
      
      fetch('/api/pagespeed-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunities: pagespeedData.opportunities,
          url: pagespeedData.url,
          scores: {
            performance: pagespeedData.performance,
            accessibility: pagespeedData.accessibility,
            bestPractices: pagespeedData.bestPractices,
            seo: pagespeedData.seo
          }
        })
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        setRecommendationsData(data);
        setRecommendationsLoading(false);
      })
      .catch(error => {
        console.error('Error loading recommendations:', error);
        setRecommendationsError(error.message);
        setRecommendationsLoading(false);
      });
    }
  }, [pagespeedData]);

  if (pagespeedError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            PageSpeed Analyse
          </CardTitle>
          <CardDescription>
            Fehler beim Laden der PageSpeed-Daten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-600">
            {pagespeedError.message || 'Unbekannter Fehler'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          PageSpeed Analyse
        </CardTitle>
        <CardDescription>
          Google PageSpeed Insights für {url}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {pagespeedLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 animate-spin" />
            PageSpeed-Analyse läuft...
          </div>
        ) : pagespeedData ? (
          <>
            {/* Scores Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(pagespeedData.performance)}`}>
                  {pagespeedData.performance}
                </div>
                <div className="text-sm text-muted-foreground">Performance</div>
                <Progress value={pagespeedData.performance} className="mt-1" />
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(pagespeedData.accessibility)}`}>
                  {pagespeedData.accessibility}
                </div>
                <div className="text-sm text-muted-foreground">Zugänglichkeit</div>
                <Progress value={pagespeedData.accessibility} className="mt-1" />
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(pagespeedData.bestPractices)}`}>
                  {pagespeedData.bestPractices}
                </div>
                <div className="text-sm text-muted-foreground">Best Practices</div>
                <Progress value={pagespeedData.bestPractices} className="mt-1" />
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(pagespeedData.seo)}`}>
                  {pagespeedData.seo}
                </div>
                <div className="text-sm text-muted-foreground">SEO</div>
                <Progress value={pagespeedData.seo} className="mt-1" />
              </div>
            </div>

            {/* Core Web Vitals */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Core Web Vitals
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">{pagespeedData.metrics.largestContentfulPaint.title}</div>
                  <div className="text-lg font-bold text-blue-600">
                    {pagespeedData.metrics.largestContentfulPaint.displayValue}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">{pagespeedData.metrics.firstInputDelay.title}</div>
                  <div className="text-lg font-bold text-blue-600">
                    {pagespeedData.metrics.firstInputDelay.displayValue}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">{pagespeedData.metrics.cumulativeLayoutShift.title}</div>
                  <div className="text-lg font-bold text-blue-600">
                    {pagespeedData.metrics.cumulativeLayoutShift.displayValue}
                  </div>
                </div>
              </div>
            </div>

            {/* AI-Generated Recommendations */}
            {pagespeedData.opportunities.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Handlungsempfehlungen
                </h4>
                
                {recommendationsLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 animate-spin" />
                    KI analysiert die Verbesserungsmöglichkeiten...
                  </div>
                ) : recommendationsError ? (
                  <div className="text-red-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Handlungsempfehlungen konnten nicht geladen werden.
                    <div className="text-sm text-gray-500 mt-1">Fehler: {recommendationsError}</div>
                  </div>
                ) : recommendationsData?.recommendations ? (
                  <div className="space-y-4">
                    {recommendationsData.recommendations.map((rec, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium">{rec.title}</h5>
                          <div className="flex gap-2">
                            <Badge variant="outline" className={getImpactColor(rec.impact)}>
                              {rec.impact === 'high' ? 'Hoch' : rec.impact === 'medium' ? 'Mittel' : 'Niedrig'} Impact
                            </Badge>
                            <Badge variant="outline" className={getDifficultyColor(rec.difficulty)}>
                              {rec.difficulty === 'easy' ? 'Einfach' : rec.difficulty === 'medium' ? 'Mittel' : 'Schwer'}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{rec.description}</p>
                        
                        {rec.estimatedSavings && (
                          <div className="text-sm text-green-600 mb-2 font-medium">
                            💡 {rec.estimatedSavings}
                          </div>
                        )}
                        
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-700">Handlungsschritte:</div>
                          {rec.actionSteps.map((step, stepIndex) => (
                            <div key={stepIndex} className="flex items-start gap-2 text-sm">
                              <ArrowRight className="h-3 w-3 mt-1 text-blue-500 flex-shrink-0" />
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    Keine spezifischen Verbesserungsempfehlungen verfügbar
                  </div>
                )}
              </div>
            )}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
