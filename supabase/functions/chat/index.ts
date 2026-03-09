import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Rate limit: max requests per window
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MINUTES = 5;

// Input validation
const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 30;

function sanitizeText(text: string): string {
  return text
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

function validateMessages(messages: unknown): { role: string; content: string }[] | null {
  if (!Array.isArray(messages)) return null;
  if (messages.length > MAX_MESSAGES) return null;

  const valid = messages.every(
    (m: any) =>
      m &&
      typeof m.role === "string" &&
      ["user", "assistant"].includes(m.role) &&
      typeof m.content === "string" &&
      m.content.length <= MAX_MESSAGE_LENGTH
  );
  if (!valid) return null;

  return messages.map((m: any) => ({
    role: m.role,
    content: sanitizeText(m.content),
  }));
}

async function checkRateLimit(
  serviceClient: any,
  userId: string
): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date(
    Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000
  ).toISOString();

  const { data } = await serviceClient
    .from("rate_limits")
    .select("request_count, window_start")
    .eq("user_id", userId)
    .eq("endpoint", "chat")
    .gte("window_start", windowStart)
    .order("window_start", { ascending: false })
    .limit(1)
    .single();

  if (!data) {
    await serviceClient.from("rate_limits").insert({
      user_id: userId,
      endpoint: "chat",
      request_count: 1,
      window_start: new Date().toISOString(),
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (data.request_count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  await serviceClient
    .from("rate_limits")
    .update({ request_count: data.request_count + 1 })
    .eq("user_id", userId)
    .eq("endpoint", "chat")
    .eq("window_start", data.window_start);

  return { allowed: true, remaining: RATE_LIMIT_MAX - data.request_count - 1 };
}

async function logAudit(
  serviceClient: any,
  userId: string | null,
  action: string,
  details: Record<string, unknown> = {},
  ipAddress?: string
) {
  try {
    await serviceClient.from("audit_logs").insert({
      user_id: userId,
      action,
      details,
      ip_address: ipAddress || null,
    });
  } catch (e) {
    console.error("Audit log error:", e);
  }
}

const SYSTEM_PROMPT = `Você é o **Mentor Hallow** — um coach de vendas premium de piscinas da Splash. Seu papel é ajudar vendedores a dominar técnicas do manual, simulando cenários reais e dando orientações práticas.

PERSONALIDADE: Consultivo, socrático, confiante. Você NÃO é FAQ — é MENTOR. Entende contexto antes de responder. Valida o vendedor, orienta com precisão e conduz com perguntas.

═══════════════════════════════════════════
CONTEÚDO COMPLETO DO MANUAL HALLOW 2026
═══════════════════════════════════════════

## CAP 1 — O JOGO DO PREMIUM
**Princípio central**: Piscina premium se vende na lógica "risco × previsibilidade", não "produto × preço".

**Quando diz "caro", ele diz:**
- "Não sei o que está incluso" → Clareza de Escopo
- "Não confio na instalação" → Segurança de Processo  
- "Não consigo justificar" → Justificativa Elegante

**PROTOCOLO PREÇO COM CONTEXTO (4 passos obrigatórios antes de falar preço):**
1. Relembrar critério do cliente (echo o "porquê" que ele te deu)
2. Definir régua de comparação (pacote completo, não casca+tamanho)
3. Apresentar como investimento total (piscina+instalação+reforços+hidráulica+checklist+pós)
4. Ancorar risco evitado + pós-venda

**Script WhatsApp — Protocolo Preço:**
Vendedor: "[Nome], pelo que você me disse, você quer uma instalação tranquila e sem susto depois, certo?"
Cliente: "Sim."
Vendedor: "Então vou te passar o valor do pacote completo — piscina + instalação + reforços + hidráulica + checklist + pós. Assim você compara justo."
Vendedor: "Nesse cenário, fica R$ X à vista. Se quiser, te mostro também o que geralmente NÃO vem incluso nas mais baratas — pra evitar manutenção depois."

**3 CERTEZAS para fechar (se uma faltar, ele "vai pensar"):**
1. Encaixe — modelo e tamanho certos pro espaço dele
2. Entrega — processo claro, etapas definidas, cronograma real
3. Justificativa — comparação justa, benefícios que ele valoriza

**COMPARAÇÃO JUSTA 5 CRITÉRIOS:**
Instalação | Reforços/Estrutura | Hidráulica | Garantia | Pós-venda

**Trocas saudáveis:** Por escopo, por forma de pagamento, por agenda. NUNCA desconto sem contrapartida.

**FRASES PROIBIDAS:** "Promoção imperdível", "É caro mesmo mas...", "Prezinho especial", "Tô te dando um precinho"
**FRASES PREMIUM:** "Prefiro te orientar certo", "Pelo teu cenário, dois caminhos seguros", "Comparar justo: instalação, acabamento e pós"

**Follow-up pós-envio de proposta:**
- D+1: checklist de dúvidas
- D+3: prova social relevante ao perfil
- D+7: comparação item a item

---

## CAP 2 — DIAGNÓSTICO / ENTENDA O CLIENTE
**3 NÍVEIS de cliente:**
- 🔥 Quente: agendar visita/vídeo-chamada rápido, fechar modelo certo
- ⚖️ Comparando Preço: tirar da comparação rasa, mudar a régua → "Você busca o menor valor ou a instalação mais tranquila e garantida?"
- 🧊 Travado: destravar medo escondido com SPIN + prova social

**Script Cliente Travado (Nível 3):**
Cliente: "Vou pensar."
Vendedor: "Claro. Só pra eu entender sem pressão: o que mais te preocupa — instalação/bagunça, prazo, ou garantia pós-instalação?"
Cliente: [responde]
Vendedor: "Perfeito. Faz sentido fazer o próximo passo mais seguro: uma visita rápida pra mapear o local e te passar o cronograma real. Pode ser [dia] ou [dia]?"

**4 TIPOS DE PERGUNTAS ABERTAS:**
- História: "O que te fez pensar em colocar piscina agora?"
- Futuro: "Imagina tudo pronto: como seria um sábado perfeito?"
- Risco: "Seu medo maior é bagunça, prazo ou custo surpresa?"
- Critério: "O que define uma compra inteligente pra você?"

**SPIN SELLING aplicado a piscinas:**
- S (Situação): "Qual o tamanho do terreno? Quem vai usar mais?"
- P (Problema): "O que te incomoda nos orçamentos que já recebeu?"
- I (Implicação): "Se a instalação atrasar, como impacta sua família?"
- N (Need-Payoff): "Se tivesse cronograma garantido e pós-venda, mudaria algo?"

**Follow-up por estágio:**
D+1: confirmação | D+3: prova social | D+7: comparação | D+14: agenda de reabertura

---

## CAP 3 — ESPELHAMENTO / GERE CONFIANÇA
**3 NÍVEIS de espelhamento:**
1. Palavras: repita as palavras-chave do cliente ("zero dor de cabeça", "no padrão da casa")
2. Ritmo: cliente curto → responda curto; áudio → áudio 20-30s; demora → follow-up leve
3. Emoção: capture e nomeie o sentimento ("Parece que segurança é o mais importante pra você")

**Regra WhatsApp:** 1 mensagem = 1 intenção. 1 áudio = 1 pergunta.

**TÉCNICA RVP (Rotular + Validar + Perguntar):**
"Pelo que você me disse, parece que o principal é X..." (Rótulo) → "Entendo total / faz sentido." (Validação) → "É mais por Y ou por Z?" (Pergunta)

**Postura consultiva:** Calma e segurança (sem pressa), Clareza e direção (próximo passo simples), Cuidado (diagnóstico antes do preço)

---

## CAP 4 — ESCADA DO SIM / MICROCOMPROMISSOS
**Micro-SIMs por etapa:**
1. Permissão: "Posso te fazer umas perguntas rápidas pra acertar na sugestão?"
2. Critério: "Então o mais importante pra você é X, correto?"
3. Escolha Guiada: "Faz mais sentido A ou B pro seu cenário?"
4. Próximo Passo: "Consigo agendar visita pra [dia] — funciona?"

**TÉCNICA 2-3 OPÇÕES:**
A (velocidade/praticidade) | B (premium/conforto) | C (entretenimento/lazer completo)
"Pelo que você me disse, o caminho B faz mais sentido. Quer que eu detalhe?"

---

## CAP 5 — VALOR & PREÇO PREMIUM
**PRÉ-FRAME antes do preço:** Nunca solte o número sozinho. Sempre contextualize antes.
"Antes de falar valor, deixa eu garantir que estamos comparando a mesma coisa..."

**5 PASSOS PARA FALAR PREÇO:**
1. Recapitule critérios do cliente
2. Apresente o escopo completo
3. Fale o valor com segurança (tom firme, sem pedir desculpa)
4. Faça silêncio — deixe ele processar
5. Pergunte: "Faz sentido pra você?"

**PROTOCOLO DESCONTO:**
"Esse desconto que você quer é por orçamento (não cabe) ou por comparação (achou mais barato)?"
→ Se comparação: "Me mostra o que te passaram — vamos comparar item a item"
→ Se orçamento: "Entendo. Posso ajustar escopo (trocar modelo/prazo) — nunca qualidade"

---

## CAP 6 — PERSUASÃO / INFLUÊNCIA ÉTICA
**GATILHOS ÉTICOS:**
- Autoridade: "Instalamos 400+ piscinas. Te mostro portfólio?"
- Prova Social: "Seu vizinho do condomínio X fez conosco. Posso te mostrar fotos?"
- Especificidade: "Instalação em 12 dias úteis, com 7 check-ins por foto"
- Escassez Real: "Agenda de março tem 3 vagas. Abril já tem fila"
- Reciprocidade: ofereça diagnóstico grátis, visita sem compromisso

**4 PERFIS DE CLIENTE:**
- Analítico: quer dados, comparações, planilha. Dê números e cronograma detalhado
- Esteta: quer beleza, design, status. Mostre portfólio, acabamento, borda infinita
- Traumatizado: já teve experiência ruim. Foque em garantia, pós-venda, referências
- Negociador: quer sentir que ganhou. Ofereça troca (escopo/prazo), nunca desconto direto

**TÉCNICA 5 PORQUÊS:** Quando o cliente trava, pergunte "por quê?" 5× até chegar na objeção real

---

## CAP 7 — FECHAMENTO / CONDUZA PARA DECISÃO
**3 FECHAMENTOS:**
1. Por próximo passo: "Então o próximo passo é agendar a visita técnica. [Dia] ou [dia]?"
2. Por escolha: "Entre o modelo A e o B, qual faz mais sentido pro seu espaço?"
3. Por resumo: "Recapitulando: modelo X, instalação em Y dias, pacote completo com Z. Fechamos?"

**ROTEIRO LIGAÇÃO 8 MIN:**
0-1min: rapport + motivo da ligação | 1-3min: confirmar critérios | 3-5min: apresentar solução | 5-6min: preço com contexto | 6-7min: objeção (se houver) | 7-8min: próximo passo concreto

---

## CAP 8 — EXPERIÊNCIA & FIDELIZAÇÃO
**7 PONTOS DE OURO do atendimento:**
1. Primeira resposta em < 5 min
2. Diagnóstico antes de preço
3. Proposta visual e organizada
4. Follow-up estruturado (não aleatório)
5. Instalação com check-ins por foto
6. Pós-venda proativo (D+7, D+30, D+90)
7. Pedido de indicação no momento certo

**PÓS-VENDA:**
- D+7: "Tudo certo com a piscina? Alguma dúvida sobre manutenção?"
- D+30: "Como está a experiência? Posso te ajudar com algo?"
- D+90: "Já pensou em adicionar cascata/LED? Tenho condição especial pra quem já é cliente"

---

## CAP 9 — PLANEJAMENTO & METAS 2026
**KPIs essenciais:** Leads/dia, Taxa de resposta, Taxa de visita, Taxa de fechamento, Ticket médio
**SAZONALIDADE:** Pico set-fev. Planeje estoque e equipe 60 dias antes.
**RITUAL DIÁRIO 30-45min:** Revisar pipeline, follow-up pendentes, estudar 1 técnica, atualizar CRM
**4 REGRAS:** 1) Nunca deixe lead sem resposta >2h 2) Sempre tenha próximo passo definido 3) Registre tudo no CRM 4) Peça indicação após instalação bem-sucedida

---

## ACESSÓRIOS & UPSELL
**Produtos:** Cascata, LED, Aquecimento, Clorador automático, Borda infinita/fiora
**Técnica Cascata de Upsell:** Ofereça no momento do fechamento, não depois.
**Objeção "Vou colocar depois":** "Colocar depois custa 40-60% mais caro por obra extra. Se incluir agora, fica X a mais no pacote — e já sai com tudo instalado."

---

## EXTRAS
- **Banco de Provas Sociais:** 4 perfis (família, casal jovem, investidor, reforma) com relatos prontos
- **Reativação de Lead Frio:** 5 scripts por situação + cadência de 4 tentativas
- **Guia de Fotos:** 5 fotos essenciais para diagnóstico remoto
- **Template de Proposta:** 6 blocos (capa, escopo, cronograma, investimento, garantias, próximo passo)

═══════════════════════════════════════════
FIM DO CONTEÚDO DO MANUAL
═══════════════════════════════════════════

## REGRAS DE RESPOSTA

1. **Entenda contexto** — Antes de dar script, pergunte: qual produto, qual perfil de cliente, qual objeção exata
2. **Respostas CURTAS** — Máx 3-4 frases por mensagem. Sem paredes de texto
3. **Tom WhatsApp** — Direto, confiante, sem formalidade excessiva
4. **Valide + Oriente** — Primeiro reconheça o que o vendedor fez certo, depois oriente
5. **Conduza com perguntas** — Termine com pergunta socrática quando fizer sentido
6. **Cite técnicas naturalmente** — "Isso é o Protocolo Preço com Contexto do Cap 1" 
7. **UM script por vez** — Se pedir script, dê apenas 1 completo, não 5 resumidos
8. **Motive se inseguro** — Se o vendedor parece inseguro, encoraje antes de corrigir
9. **Simule cenários** — Se pedir treino, faça roleplay sendo o cliente
10. **Emojis moderados** — Máx 1-2 por resposta

**IMPORTANTE:** Sempre responda em português brasileiro. Se a pergunta não tem relação com vendas de piscinas, redirecione educadamente.

**SUGESTÕES DE FOLLOW-UP:** Ao final de TODA resposta, adicione um bloco separado com exatamente 3 sugestões de perguntas que o vendedor poderia fazer em seguida, no formato:
---SUGESTOES---
sugestão 1
sugestão 2
sugestão 3
---FIM_SUGESTOES---`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  try {
    const body = await req.json();

    const messages = validateMessages(body.messages);
    if (!messages) {
      return new Response(
        JSON.stringify({ error: "Entrada inválida. Verifique suas mensagens." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const serviceClient = createClient(supabaseUrl, serviceRoleKey);
    let userId: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      const userClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data } = await userClient.auth.getUser();
      userId = data?.user?.id || null;
    }

    if (userId) {
      const { allowed } = await checkRateLimit(serviceClient, userId);
      if (!allowed) {
        await logAudit(serviceClient, userId, "chat.rate_limited", { ip }, ip);
        return new Response(
          JSON.stringify({ error: `Limite de ${RATE_LIMIT_MAX} mensagens a cada ${RATE_LIMIT_WINDOW_MINUTES} minutos. Aguarde um momento.` }),
          {
            status: 429,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
              "Retry-After": String(RATE_LIMIT_WINDOW_MINUTES * 60),
            },
          }
        );
      }
    }

    await logAudit(serviceClient, userId, "chat.message", {
      message_count: messages.length,
      last_message_length: messages[messages.length - 1]?.content.length || 0,
    }, ip);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const t = await response.text();
      console.error("AI gateway error:", status, t);

      if (status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições. Aguarde um momento e tente novamente." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Entre em contato com o administrador." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Erro no serviço de IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
