import { NextRequest, NextResponse } from 'next/server';
import tursoClient from '@/lib/turso-client';

export async function POST(req: NextRequest): Promise<NextResponse> {
    let data;
    try {
        data = await req.json();
        const { analysisId, email } = data;

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

        // Update email in leads table via the analysis
        const result = await tursoClient.execute(
            `UPDATE leads 
             SET email = ? 
             WHERE id = (
                 SELECT lead_id 
                 FROM analyses 
                 WHERE id = ?
             ) AND (email IS NULL OR email = '')`,
            [email, analysisId]
        );

        console.log(`Email updated for analysis ${analysisId}: ${email} (${result.rowsAffected} rows affected)`);

        return NextResponse.json({ 
            success: true, 
            message: 'E-Mail-Adresse erfolgreich gespeichert',
            rowsAffected: Number(result.rowsAffected)
        });

    } catch (error) {
        console.error('Fehler beim Aktualisieren der E-Mail-Adresse:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
        const errorDetails = {
            message: errorMessage,
            analysisId: data?.analysisId,
            email: data?.email,
            timestamp: new Date().toISOString()
        };
        
        console.error('Detailed error information:', errorDetails);
        
        return NextResponse.json({ 
            success: false, 
            error: 'Fehler beim Aktualisieren der E-Mail-Adresse',
            details: errorDetails
        }, { status: 500 });
    }
}