import { NextRequest, NextResponse } from 'next/server';
import tursoClient from '@/lib/turso-client';

export async function POST(req: NextRequest): Promise<NextResponse> {
    let data;
    try {
        data = await req.json();
        const { analysisId, email, source } = data;

        if (!analysisId || !email || !source) {
            return NextResponse.json({ 
                success: false, 
                error: 'analysisId, email, and source are required' 
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

        // Validate source
        const validSources = ['pagespeed', 'geo-check'];
        if (!validSources.includes(source)) {
            return NextResponse.json({ 
                success: false, 
                error: 'Source must be either "pagespeed" or "geo-check"' 
            }, { status: 400 });
        }

        // First, update email in leads table (original functionality)
        const leadsResult = await tursoClient.execute(
            `UPDATE leads 
             SET email = ? 
             WHERE id = (
                 SELECT lead_id 
                 FROM analyses 
                 WHERE id = ?
             ) AND (email IS NULL OR email = '')`,
            [email, analysisId]
        );

        console.log(`Email updated in leads for analysis ${analysisId}: ${email} (${leadsResult.rowsAffected} rows affected)`);

        // Then, track the email source in email_sources table
        await tursoClient.execute(
            `INSERT INTO email_sources (analysis_id, email, source, created_at) 
             VALUES (?, ?, ?, datetime('now'))`,
            [analysisId, email, source]
        );

        console.log(`Email source tracked: ${email} from ${source} for analysis ${analysisId}`);

        return NextResponse.json({ 
            success: true, 
            message: 'E-Mail-Adresse und Quelle erfolgreich gespeichert',
            source: source,
            rowsAffected: Number(leadsResult.rowsAffected)
        });

    } catch (error) {
        console.error('Fehler beim Tracken der E-Mail-Quelle:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
        const errorDetails = {
            message: errorMessage,
            analysisId: data?.analysisId,
            email: data?.email,
            source: data?.source,
            timestamp: new Date().toISOString()
        };
        
        console.error('Detailed error information:', errorDetails);
        
        return NextResponse.json({ 
            success: false, 
            error: 'Fehler beim Tracken der E-Mail-Quelle',
            details: errorDetails
        }, { status: 500 });
    }
}

// GET endpoint to retrieve email source statistics
export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(req.url);
        const analysisId = searchParams.get('analysisId');

        if (analysisId) {
            // Get email sources for specific analysis
            const result = await tursoClient.execute(
                'SELECT email, source, created_at FROM email_sources WHERE analysis_id = ? ORDER BY created_at DESC',
                [analysisId]
            );

            return NextResponse.json({
                success: true,
                emailSources: result.rows
            });
        } else {
            // Get overall statistics
            const stats = await tursoClient.execute(`
                SELECT 
                    source,
                    COUNT(*) as count,
                    COUNT(DISTINCT email) as unique_emails
                FROM email_sources 
                GROUP BY source
            `);

            return NextResponse.json({
                success: true,
                statistics: stats.rows
            });
        }

    } catch (error) {
        console.error('Error fetching email source data:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch email source data' },
            { status: 500 }
        );
    }
}