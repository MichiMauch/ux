import { NextRequest, NextResponse } from 'next/server';
import tursoClient from '@/lib/turso-client';

export async function POST(req: NextRequest): Promise<NextResponse> {
    let data;
    try {
        data = await req.json();

        // Insert lead data
        const leadId = await tursoClient.execute(
            'INSERT INTO leads (email, url, industry, timestamp) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
            [data.email, data.url, data.websiteType]
        ).then(res => res.lastInsertRowid);

        // Insert UX analysis data
        const analysisId = await tursoClient.execute(
            'INSERT INTO analyses (lead_id, ux_score, timestamp) VALUES (?, ?, CURRENT_TIMESTAMP)',
            [leadId, data.uxAnalysis.score]
        ).then(res => res.lastInsertRowid);

        // Insert UX scores
        for (const detail of data.uxAnalysis.details) {
            await tursoClient.execute(
                'INSERT INTO ux_scores (analysis_id, category, score) VALUES (?, ?, ?)',
                [analysisId, detail.category, detail.score]
            );
        }

        // Insert PageSpeed data
        if (data.pageSpeedData && data.pageSpeedData.length > 0) {
            for (const pageSpeed of data.pageSpeedData) {
                await tursoClient.execute(
                    'INSERT INTO pagespeed (analysis_id, strategy, performance, accessibility, best_practices, seo) VALUES (?, ?, ?, ?, ?, ?)',
                    [analysisId, pageSpeed.strategy || 'desktop', pageSpeed.performance || 0, pageSpeed.accessibility || 0, pageSpeed.bestPractices || 0, pageSpeed.seo || 0]
                );
            }
        }

        // Insert Meta Tags data
        if (!analysisId) {
            throw new Error('analysisId konnte nicht generiert werden.');
        }

        if (data.metaTagsData && data.metaTagsData.tags && data.metaTagsData.tags.length > 0) {
            await tursoClient.execute(
                'UPDATE analyses SET meta_tags_overview = ? WHERE id = ?',
                [JSON.stringify({
                    score: data.metaTagsData.score || 0,
                    total: data.metaTagsData.total || 0,
                    present: data.metaTagsData.present || 0,
                    missing: data.metaTagsData.missing || 0
                }), analysisId]
            );

            for (const tag of data.metaTagsData.tags) {
                await tursoClient.execute(
                    'INSERT INTO meta_tags (analysis_id, tag, content, status) VALUES (?, ?, ?, ?)',
                    [analysisId, tag.tag, tag.content || '', tag.status]
                );
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Daten erfolgreich gespeichert',
            analysisId: Number(analysisId),
            leadId: Number(leadId)
        });
    } catch (error) {
        console.error('Fehler beim Speichern der Daten:', error);
        
        // Provide more detailed error information
        const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
        const errorDetails = {
            message: errorMessage,
            hasUxData: !!(data && data.uxAnalysis),
            hasPageSpeedData: !!(data && data.pageSpeedData && data.pageSpeedData.length > 0),
            hasMetaTagsData: !!(data && data.metaTagsData && data.metaTagsData.tags && data.metaTagsData.tags.length > 0),
            timestamp: new Date().toISOString()
        };
        
        console.error('Detailed error information:', errorDetails);
        
        return NextResponse.json({ 
            success: false, 
            error: 'Fehler beim Speichern der Daten',
            details: errorDetails
        }, { status: 500 });
    }
}