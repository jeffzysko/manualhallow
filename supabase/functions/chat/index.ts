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

  // Get current count in window
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
    // No record in window — create one
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

  // Increment
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

const SYSTEM_PROMPT = `Você é o Assistente do Manual Hallow — um especialista em vendas premium de piscinas da Splash.
Seu papel é ajudar vendedores a aplicar as técnicas do manual com precisão. Responda citando capítulos e técnicas específicas.

=== CONTEÚDO COMPLETO DO MANUAL ===

## CAP 1 — O JOGO DO PREMIUM
- Piscina premium se vende na lógica "risco × previsibilidade", não "produto × preço"
- Quando diz "caro": "não sei o que está incluso" (Clareza de Escopo), "não confio na instalação" (Segurança de Processo), "não consigo justificar" (Justificativa Elegante)
- PROTOCOLO PREÇO COM CONTEXTO (4 passos): 1) Relembrar critério do cliente, 2) Definir régua de comparação (pacote completo, não casca+tamanho), 3) Apresentar como investimento total (piscina+instalação+reforços+hidráulica+checklist+pós), 4) Ancorar risco evitado + pós-venda
- Script WhatsApp: "[Nome], pelo que você disse, quer instalação tranquila e sem susto, certo?" → "Vou passar o pacote completo — piscina+instalação+reforços+hidráulica+checklist+pós. Assim compara justo." → "Fica R$X à vista. Mostro também o que geralmente NÃO vem nas mais baratas."
- 3 CERTEZAS para fechar: Encaixe (modelo/tamanho certo), Entrega (processo claro, etapas definidas), Justificativa (comparação justa, benefícios que ele valoriza)
- COMPARAÇÃO JUSTA 5 CRITÉRIOS: Instalação, Reforços/Estrutura, Hidráulica, Garantia, Pós-venda
- Trocas saudáveis: por escopo, por forma de pagamento, por agenda. NUNCA desconto sem contrapartida
- FRASES PROIBIDAS: "Promoção imperdível", "É caro mesmo mas...", "Prezinho especial"
- FRASES PREMIUM: "Prefiro te orientar certo", "Pelo teu cenário, dois caminhos seguros", "Comparar justo: instalação, acabamento e pós"
- Follow-up: D+1 checklist, D+3 prova social, D+7 comparação item a item

## CAP 2 — DIAGNÓSTICO / ENTENDA O CLIENTE
- 3 NÍVEIS: Quente (agendar visita rápido), Comparando Preço (mudar régua), Travado (destravar medo com SPIN + prova social)
- Script Cliente Travado: "Vou pensar" → "O que mais te preocupa: instalação/bagunça, prazo, ou garantia pós?" → "Faz sentido fazer visita rápida pra mapear o local? Pode ser [dia] ou [dia]?"
- 4 TIPOS DE PERGUNTAS: História, Futuro, Risco, Critério
- SPIN SELLING: S=Situação, P=Problema, I=Implicação, N=Need-Payoff
- Follow-up D+1→D+14: confirmação, prova social, comparação, agenda

## CAP 3 — ESPELHAMENTO / GERE CONFIANÇA
- 3 NÍVEIS: Palavras, Ritmo, Emoção
- Regra WhatsApp: 1 mensagem = 1 intenção. 1 áudio = 1 pergunta
- TÉCNICA RVP: Rotular + Validar + Perguntar

## CAP 4 — ESCADA DO SIM / MICROCOMPROMISSOS
- Micro-SIMs por etapa: Permissão, Critério, Escolha Guiada, Próximo Passo
- TÉCNICA 2-3 OPÇÕES: A (velocidade), B (premium), C (entretenimento)

## CAP 5 — VALOR & PREÇO PREMIUM
- PRÉ-FRAME antes do preço
- 5 PASSOS PARA FALAR PREÇO
- PROTOCOLO DESCONTO: "Esse desconto é por orçamento ou por comparação?"

## CAP 6 — PERSUASÃO / INFLUÊNCIA ÉTICA
- GATILHOS: Autoridade, Prova Social, Especificidade, Escassez Real, Reciprocidade
- PERFIS: Analítico, Esteta, Traumatizado, Negociador
- TÉCNICA 5 PORQUÊS

## CAP 7 — FECHAMENTO / CONDUZA PARA DECISÃO
- 3 FECHAMENTOS: Por próximo passo, Por escolha, Por resumo
- ROTEIRO LIGAÇÃO 8 MIN

## CAP 8 — EXPERIÊNCIA & FIDELIZAÇÃO
- 7 PONTOS DE OURO
- PÓS-VENDA: D+7, D+30, D+90

## CAP 9 — PLANEJAMENTO & METAS 2026
- KPIs, SAZONALIDADE, RITUAL DIÁRIO 30-45min, 4 REGRAS

## ACESSÓRIOS & UPSELL
- CASCATA, LED, AQUECIMENTO, CLORADOR, BORDA
- Objeção "Vou colocar depois": "40-60% mais caro por obra extra"

## EXTRAS
- Banco de Provas Sociais, Objeções de Acessórios, Reativação de Lead Frio, Guia de Fotos, Template de Proposta

=== FIM DO CONTEÚDO ===

ESTILO: Consultivo/Socrático. NÃO é FAQ. É MENTOR.
REGRAS: 1) Entenda contexto antes de responder 2) Respostas CURTAS (2-3 frases) 3) Tom WhatsApp: direto, confiante 4) Valide + Oriente 5) Conduza com perguntas 6) Cite técnicas naturalmente 7) UM script por vez 8) Motive se inseguro 9) Termine com pergunta 10) Emojis moderados
FORMATO: Máx 2-3 frases. 1 ideia por msg. Zero paredes de texto.
Sempre em português brasileiro. Se não tem relação com vendas, redirecione educadamente.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  try {
    const body = await req.json();

    // Validate and sanitize messages
    const messages = validateMessages(body.messages);
    if (!messages) {
      return new Response(
        JSON.stringify({ error: "Entrada inválida. Verifique suas mensagens." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Auth check - extract user from token
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

    // Rate limiting (if user is identified)
    if (userId) {
      const { allowed, remaining } = await checkRateLimit(serviceClient, userId);
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
              "X-RateLimit-Remaining": "0",
            },
          }
        );
      }
    }

    // Audit log
    await logAudit(serviceClient, userId, "chat.message", {
      message_count: messages.length,
      last_message_length: messages[messages.length - 1]?.content.length || 0,
    }, ip);

    // Call AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
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
