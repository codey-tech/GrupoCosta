import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { NextResponse } from 'next/server';

// Inicializa o cliente com as credenciais do seu .env.local
const client = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    // O replace é vital para corrigir as quebras de linha da chave privada
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

export async function GET() {
  const propertyId = process.env.GA_PROPERTY_ID;
  if (!propertyId || !process.env.GA_CLIENT_EMAIL || !process.env.GA_PRIVATE_KEY) {
    return NextResponse.json({
      ok: false,
      unavailable: true,
      reason: 'analytics_not_configured',
      message: 'Credenciais do GA4 não configuradas no servidor.',
      rows: [],
    });
  }

  try {
    // Substitua o bloco do runReport na sua API por este:
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

    if (isServiceDisabled) {
      return NextResponse.json({
        ok: false,
        unavailable: true,
        reason: 'analytics_api_disabled',
        message: 'Google Analytics Data API desativada no projeto GCP.',
        rows: [],
      });
    }

    return NextResponse.json(
      { ok: false, error: 'Erro ao buscar dados de analytics', rows: [] },
      { status: 500 }
    );
  }
}