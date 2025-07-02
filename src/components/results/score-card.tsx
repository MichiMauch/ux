"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { AnalysisCategory } from "@/types/analysis";

interface ScoreCardProps {
  category: AnalysisCategory;
}

export function ScoreCard({ category }: ScoreCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 8) return "success";
    if (score >= 6) return "warning";
    return "error";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 6) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const getScoreText = (score: number) => {
    if (score >= 8) return "Ausgezeichnet";
    if (score >= 6) return "Gut";
    if (score >= 4) return "Befriedigend";
    return "Verbesserungsbedürftig";
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getScoreIcon(category.score)}
            <CardTitle className="text-lg font-semibold">
              {category.name}
            </CardTitle>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant={getScoreColor(category.score)}>
              {getScoreText(category.score)}
            </Badge>
            <div className="text-2xl font-bold text-gray-700">
              {category.score}/10
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress
            value={category.score * 10}
            max={100}
            className={`h-3 ${
              category.score >= 8
                ? "bg-green-100"
                : category.score >= 6
                ? "bg-yellow-100"
                : "bg-red-100"
            }`}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>10</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed">{category.description}</p>

        {/* Expandable Recommendations */}
        <div className="border-t pt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-left font-medium text-gray-800 hover:text-blue-600 transition-colors"
          >
            <span>
              Verbesserungsvorschläge ({category.recommendations.length})
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {isExpanded && (
            <div className="mt-3 space-y-2">
              {category.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-700">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {recommendation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
