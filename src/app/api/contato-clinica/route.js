import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const body = await request.json();
    const nome = (body.nome || "").trim();
    const telefone = (body.telefone || "").trim();
    const mensagem = (body.mensagem || "").trim();

    if (!nome || !telefone || !mensagem) {
      return NextResponse.json(
        { success: false, message: "Preencha nome, telefone e mensagem." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("contatos_clinica").insert([
      {
        nome,
        telefone,
        mensagem,
        origem: "site-centro-clinico",
        status: "Novo",
      },
    ]);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao salvar contato da clínica:", error);
    return NextResponse.json(
      { success: false, message: "Não foi possível enviar seu contato agora." },
      { status: 500 }
    );
  }
}
