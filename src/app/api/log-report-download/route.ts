import { NextRequest, NextResponse } from 'next/server';
import tursoClient from '@/lib/turso-client';

export async function POST(req: NextRequest): Promise<NextResponse> {
    let data;
    try {
        data = await req.json();
        const { analysisId, email, reportType = 'pdf' } = data;

        if (!analysisId || !email) {
            return NextResponse.json({ 
                success: false, 
                error: 'analysisId and email are required' 
            }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ 
                success: false, 
                error: 'Invalid email format' 
            }, { status: 400 });
        }

        // Insert into report_downloads table
        const downloadId = await tursoClient.execute(
            'INSERT INTO report_downloads (analysis_id, email, report_type, timestamp) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
            [analysisId, email, reportType]
        ).then(res => res.lastInsertRowid);

        console.log(`Report download logged: ID ${Number(downloadId)}, Analysis: ${analysisId}, Email: ${email}, Type: ${reportType}`);

        return NextResponse.json({ 
            success: true, 
            message: 'Report download erfolgreich geloggt',
            downloadId: Number(downloadId)
        });

    } catch (error) {
        console.error('Fehler beim Loggen des Report Downloads:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
        const errorDetails = {
            message: errorMessage,
            analysisId: data?.analysisId,
            email: data?.email,
            reportType: data?.reportType,
            timestamp: new Date().toISOString()
        };
        
        console.error('Detailed error information:', errorDetails);
        
        return NextResponse.json({ 
            success: false, 
            error: 'Fehler beim Loggen des Report Downloads',
            details: errorDetails
        }, { status: 500 });
    }
}