import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MAX_SCORE } from "@/lib/scoring";

interface ScoreDisplayProps {
  score: number;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  const percentage = Math.round((score / MAX_SCORE) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ergebnis</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <div className="text-6xl font-bold text-blue-600">
          {score}
          <span className="text-3xl text-gray-400">/ {MAX_SCORE}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Punkte erreicht ({percentage}%)
        </p>
      </CardContent>
    </Card>
  );
}
