import { NextRequest, NextResponse } from 'next/server';
import tursoClient from '@/lib/turso-client';

export async function POST(req: NextRequest): Promise<NextResponse> {
    let data;
    try {
        data = await req.json();
        const { analysisId, pageSpeedData, metaTagsData, geoCheckData } = data;

        if (!analysisId) {
            return NextResponse.json({ success: false, error: 'analysisId is required' }, { status: 400 });
        }

        // Update PageSpeed data if provided
        if (pageSpeedData && pageSpeedData.length > 0) {
            console.log('Received PageSpeed data:', JSON.stringify(pageSpeedData, null, 2));

            // Insert new PageSpeed data (using UPSERT to avoid duplicates)
            for (const pageSpeed of pageSpeedData) {
                const strategy = pageSpeed.strategy || 'desktop';
                
                console.log('Upserting PageSpeed record:', {
                    analysisId,
                    strategy,
                    performance: pageSpeed.performance || 0,
                    accessibility: pageSpeed.accessibility || 0,
                    bestPractices: pageSpeed.bestPractices || 0,
                    seo: pageSpeed.seo || 0
                });
                
                // Delete existing data for this specific strategy only
                await tursoClient.execute(
                    'DELETE FROM pagespeed WHERE analysis_id = ? AND strategy = ?',
                    [analysisId, strategy]
                );
                
                // Insert new data for this strategy
                await tursoClient.execute(
                    'INSERT INTO pagespeed (analysis_id, strategy, performance, accessibility, best_practices, seo) VALUES (?, ?, ?, ?, ?, ?)',
                    [analysisId, strategy, pageSpeed.performance || 0, pageSpeed.accessibility || 0, pageSpeed.bestPractices || 0, pageSpeed.seo || 0]
                );
            }
            console.log(`PageSpeed data updated for analysis ${analysisId}`);
        } else {
            console.log('No PageSpeed data provided or empty array');
        }

        // Update Meta Tags data if provided
        console.log('Received Meta Tags data:', JSON.stringify(metaTagsData, null, 2));
        if (metaTagsData && metaTagsData.tags && metaTagsData.tags.length > 0) {
            // Update meta_tags_overview in analyses table
            await tursoClient.execute(
                'UPDATE analyses SET meta_tags_overview = ? WHERE id = ?',
                [JSON.stringify({
                    score: metaTagsData.score || 0,
                    total: metaTagsData.total || 0,
                    present: metaTagsData.present || 0,
                    missing: metaTagsData.missing || 0
                }), analysisId]
            );

            // Delete existing meta tags for this analysis
            await tursoClient.execute(
                'DELETE FROM meta_tags WHERE analysis_id = ?',
                [analysisId]
            );

            // Insert new meta tags
            for (const tag of metaTagsData.tags) {
                await tursoClient.execute(
                    'INSERT INTO meta_tags (analysis_id, tag, content, status) VALUES (?, ?, ?, ?)',
                    [analysisId, tag.tag, tag.content || '', tag.status]
                );
            }
            console.log(`Meta tags data updated for analysis ${analysisId}`);
        }

        // Update GEO check data if provided
        if (geoCheckData) {
            console.log('Received GEO check data:', JSON.stringify(geoCheckData, null, 2));

            // Update the main analysis table with GEO score
            await tursoClient.execute(
                'UPDATE analyses SET geo_score = ? WHERE id = ?',
                [geoCheckData.score, analysisId]
            );

            // Delete existing GEO factors for this analysis
            await tursoClient.execute(
                'DELETE FROM geo_factors WHERE analysis_id = ?',
                [analysisId]
            );

            // Insert new GEO factors
            for (const factor of geoCheckData.factors) {
                await tursoClient.execute(
                    'INSERT INTO geo_factors (analysis_id, name, result, weight, comment, details) VALUES (?, ?, ?, ?, ?, ?)',
                    [
                        analysisId, 
                        factor.name, 
                        factor.result ? 1 : 0, 
                        factor.weight, 
                        factor.comment,
                        factor.details ? JSON.stringify(factor.details) : null
                    ]
                );
            }
            console.log(`GEO check data updated for analysis ${analysisId}`);
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Analysis updated successfully',
            analysisId
        });
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Analyse:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
        const errorDetails = {
            message: errorMessage,
            analysisId: data?.analysisId,
            hasPageSpeedData: !!(data && data.pageSpeedData && data.pageSpeedData.length > 0),
            hasMetaTagsData: !!(data && data.metaTagsData && data.metaTagsData.tags && data.metaTagsData.tags.length > 0),
            hasGeoCheckData: !!(data && data.geoCheckData && data.geoCheckData.factors && data.geoCheckData.factors.length > 0),
            timestamp: new Date().toISOString()
        };
        
        console.error('Detailed error information:', errorDetails);
        
        return NextResponse.json({ 
            success: false, 
            error: 'Fehler beim Aktualisieren der Analyse',
            details: errorDetails
        }, { status: 500 });
    }
}