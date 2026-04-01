import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { NextResponse } from 'next/server';

// Garante execução server-side no Node e sem cache estático.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function normalizePrivateKey(value) {
  if (!value) return '';
  // Suporta valor com \n escapado e também com quebras reais.
  return value.replace(/\\n/g, '\n').replace(/^"|"$/g, '');
}

export async function GET() {
  const propertyId = process.env.GA_PROPERTY_ID;
  const clientEmail = process.env.GA_CLIENT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.GA_PRIVATE_KEY);

  if (!propertyId || !clientEmail || !privateKey) {
    return NextResponse.json({
      ok: false,
      unavailable: true,
      reason: 'analytics_not_configured',
      message: 'Credenciais do GA4 não configuradas no servidor.',
      rows: [],
    });
  }

  try {
    const client = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });

    const [response] = await client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }], // Aumentamos para 30 dias para ter mais base
        dimensions: [
        { name: 'pagePath' },
        { name: 'deviceCategory' }, // mobile, desktop, tablet
        { name: 'sessionSource' },  // google, direct, instagram
        { name: 'city' }            // cidade do usuário
        ],
        metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' }, // Tempo médio na página
        { name: 'bounceRate' }               // Taxa de rejeição (quem sai sem clicar em nada)
        ],
    });

    return NextResponse.json({ ok: true, ...response });
  } catch (error) {
    console.error('Erro na API do Analytics:', error);
    const reason = error?.reason || error?.statusDetails?.[0]?.reason || '';
    const isServiceDisabled = reason === 'SERVICE_DISABLED' || error?.code === 7;
    const isPermissionDenied = reason === 'PERMISSION_DENIED' || error?.code === 7;

    if (isServiceDisabled) {
      return NextResponse.json({
        ok: false,
        unavailable: true,
        reason: 'analytics_api_disabled',
        message: 'Google Analytics Data API desativada no projeto GCP.',
        rows: [],
      });
    }

    if (isPermissionDenied) {
      return NextResponse.json({
        ok: false,
        unavailable: true,
        reason: 'analytics_permission_denied',
        message: 'Conta de serviço sem permissão na propriedade GA4.',
        rows: [],
      });
    }

    return NextResponse.json(
      { ok: false, error: 'Erro ao buscar dados de analytics', reason, rows: [] },
      { status: 500 }
    );
  }
}