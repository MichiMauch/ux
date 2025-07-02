import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface AdditionalChecksProps {
  checks: {
    name: string;
    status: 'passed' | 'failed' | 'warning';
    description: string;
  }[];
}

export function AdditionalChecks({ checks }: AdditionalChecksProps) {
  const getIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zusätzliche Checks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {checks.map((check, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
              {getIcon(check.status)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{check.name}</h4>
                  <Badge className={getStatusColor(check.status)}>
                    {check.status === 'passed' ? 'Bestanden' : 
                     check.status === 'failed' ? 'Fehlgeschlagen' : 'Warnung'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{check.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}