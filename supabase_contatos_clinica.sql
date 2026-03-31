-- Tabela para contatos da página Centro Clínico
create table if not exists public.contatos_clinica (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  nome text not null,
  telefone text not null,
  mensagem text not null,
  origem text not null default 'site-centro-clinico',
  status text not null default 'Novo'
);

create index if not exists idx_contatos_clinica_created_at
  on public.contatos_clinica (created_at desc);

create index if not exists idx_contatos_clinica_status
  on public.contatos_clinica (status);

-- Opcional: habilite RLS se desejar controlar permissões por política.
alter table public.contatos_clinica enable row level security;

-- Permite inserir sem autenticação (site público).
drop policy if exists "insert_contatos_clinica_anon" on public.contatos_clinica;
create policy "insert_contatos_clinica_anon"
  on public.contatos_clinica
  for insert
  to anon
  with check (true);

-- Permite leitura para anon (necessário para painel atual, que usa anon key no cliente).
drop policy if exists "select_contatos_clinica_anon" on public.contatos_clinica;
create policy "select_contatos_clinica_anon"
  on public.contatos_clinica
  for select
  to anon
  using (true);

-- Permite update para anon (caso queira mudar status direto no painel cliente).
drop policy if exists "update_contatos_clinica_anon" on public.contatos_clinica;
create policy "update_contatos_clinica_anon"
  on public.contatos_clinica
  for update
  to anon
  using (true)
  with check (true);
