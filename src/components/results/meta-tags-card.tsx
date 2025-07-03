'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import useSWR from 'swr';
import { useState } from 'react';
import { 
  Clock, 
  Tags, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Share2,
  Twitter,
  Lightbulb,
  Search
} from 'lucide-react';

export type MetaTagCheck = {
  group: 'Meta Tags' | 'Open Graph Tags' | 'Twitter Cards';
  tag: string;
  present: boolean;
  content: string | null;
  recommendation?: string;
};

export type MetaAnalysisResult = {
  url: string;
  timestamp: string;
  checks: MetaTagCheck[];
  summary: {
    total: number;
    present: number;
    missing: number;
    score: number;
  };
};

interface MetaTagsCardProps {
  url: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

const getScoreColor = (score: number) => {
  if (score >= 85) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getStatusIcon = (present: boolean, hasContent: boolean = true) => {
  if (present && hasContent) {
    return <CheckCircle className="h-4 w-4 text-green-600" />;
  } else if (present && !hasContent) {
    return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
  } else {
    return <XCircle className="h-4 w-4 text-red-600" />;
  }
};

const getGroupIcon = (group: string) => {
  switch (group) {
    case 'Meta Tags':
      return <Search className="h-4 w-4" />;
    case 'Open Graph Tags':
      return <Share2 className="h-4 w-4" />;
    case 'Twitter Cards':
      return <Twitter className="h-4 w-4" />;
    default:
      return <Tags className="h-4 w-4" />;
  }
};

const truncateContent = (content: string | null, maxLength: number = 50) => {
  if (!content) return '-';
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
};

export default function MetaTagsCard({ url }: MetaTagsCardProps) {
  const [activeTab, setActiveTab] = useState<'meta' | 'opengraph' | 'twitter' | 'recommendations'>('meta');

  const { data, error, isLoading } = useSWR<MetaAnalysisResult>(
    `/api/meta-tags?url=${encodeURIComponent(url)}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tags className="h-5 w-5" />
            Meta Tags Analyse
          </CardTitle>
          <CardDescription>
            Fehler beim Laden der Meta Tags-Daten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-600">
            {error.message || 'Unbekannter Fehler'}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tags className="h-5 w-5" />
            Meta Tags Analyse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 animate-spin" />
            Meta Tags werden analysiert...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const metaTags = data.checks.filter(check => check.group === 'Meta Tags');
  const openGraphTags = data.checks.filter(check => check.group === 'Open Graph Tags');
  const twitterTags = data.checks.filter(check => check.group === 'Twitter Cards');
  const missingTags = data.checks.filter(check => !check.present);

  const renderTagsTable = (tags: MetaTagCheck[]) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-3 font-medium text-sm text-gray-600">Status</th>
            <th className="text-left py-2 px-3 font-medium text-sm text-gray-600">Tag</th>
            <th className="text-left py-2 px-3 font-medium text-sm text-gray-600">Inhalt</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag, index) => (
            <tr key={index} className="border-b last:border-b-0">
              <td className="py-2 px-3">
                {getStatusIcon(tag.present, !!(tag.content && tag.content.trim().length > 0))}
              </td>
              <td className="py-2 px-3 font-mono text-sm text-blue-600">
                {tag.tag}
              </td>
              <td className="py-2 px-3 text-sm text-gray-700">
                {tag.content ? (
                  <span title={tag.content}>
                    {truncateContent(tag.content, 60)}
                  </span>
                ) : (
                  <span className="text-gray-400 italic">Nicht vorhanden</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tags className="h-5 w-5" />
          Meta Tags Analyse
        </CardTitle>
        <CardDescription>
          SEO und Social Media Tags für {url}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(data.summary.score)}`}>
              {data.summary.score}%
            </div>
            <div className="text-sm text-muted-foreground">Gesamt-Score</div>
            <Progress value={data.summary.score} className="mt-1" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {data.summary.present}
            </div>
            <div className="text-sm text-muted-foreground">Vorhanden</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {data.summary.missing}
            </div>
            <div className="text-sm text-muted-foreground">Fehlend</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {data.summary.total}
            </div>
            <div className="text-sm text-muted-foreground">Gesamt</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('meta')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'meta'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {getGroupIcon('Meta Tags')}
              Meta Tags
              <Badge variant="outline" className="ml-1">
                {metaTags.filter(t => t.present).length}/{metaTags.length}
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab('opengraph')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'opengraph'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {getGroupIcon('Open Graph Tags')}
              Open Graph
              <Badge variant="outline" className="ml-1">
                {openGraphTags.filter(t => t.present).length}/{openGraphTags.length}
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab('twitter')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'twitter'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {getGroupIcon('Twitter Cards')}
              Twitter
              <Badge variant="outline" className="ml-1">
                {twitterTags.filter(t => t.present).length}/{twitterTags.length}
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'recommendations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Lightbulb className="h-4 w-4" />
              Empfehlungen
              <Badge variant="outline" className="ml-1 bg-red-50 text-red-600">
                {missingTags.length}
              </Badge>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'meta' && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Search className="h-4 w-4" />
                Meta Tags für SEO
              </h4>
              {renderTagsTable(metaTags)}
            </div>
          )}

          {activeTab === 'opengraph' && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Open Graph Tags für Social Media
              </h4>
              {renderTagsTable(openGraphTags)}
            </div>
          )}

          {activeTab === 'twitter' && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                Twitter Cards
              </h4>
              {renderTagsTable(twitterTags)}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Verbesserungsempfehlungen
              </h4>
              {missingTags.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-3" />
                  <p className="text-lg font-medium text-gray-900 mb-1">Alle Meta Tags vorhanden!</p>
                  <p>Ihre Website hat alle wichtigen Meta Tags korrekt implementiert.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {missingTags.map((tag, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-red-50">
                      <div className="flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {tag.group}
                            </Badge>
                            <code className="text-sm font-mono text-red-600 bg-red-100 px-2 py-1 rounded">
                              {tag.tag}
                            </code>
                          </div>
                          <p className="text-sm text-gray-700">
                            {tag.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
