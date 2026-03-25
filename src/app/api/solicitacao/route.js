import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const data = await request.json();
    // Removido totalHoje do desestruturamento do body
    const { titular, dependentes, plano } = data;

    const { error } = await supabase
      .from('adesoes')
      .insert([
        { 
          nome: titular.nome,
          cpf: titular.cpf,
          nascimento: titular.nascimento,
          nome_mae: titular.nomeMae,
          nome_pai: titular.nomePai,
          email: titular.email,
          telefone: titular.telefone,
          rua: titular.rua,
          numero: titular.numero,
          bairro: titular.bairro,
          cidade: titular.cidade,
          uf: titular.uf,
          plano: plano,
          valor_total: 'Sob Consulta', // String padrão para respeitar a estrutura do DB
          dependentes: dependentes
        }
      ]);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Erro ao salvar no Supabase:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}