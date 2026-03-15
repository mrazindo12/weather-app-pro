import { Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from './Card';

export function LoadingSpinner() {
    return (
        <div className="flex h-40 w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium animate-pulse">Loading weather data...</p>
            </div>
        </div>
    );
}

export function ErrorMessage({ message }: { message: string }) {
    return (
        <Card variant="glass" className="border-destructive/50 bg-destructive/10">
            <CardContent className="flex flex-col items-center gap-4 py-8 text-center text-destructive">
                <div className="rounded-full bg-destructive/20 p-3">
                    <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-semibold leading-none tracking-tight mb-2">Error Fetching Data</h3>
                    <p className="text-sm opacity-90">{message}</p>
                </div>
            </CardContent>
        </Card>
    );
}
