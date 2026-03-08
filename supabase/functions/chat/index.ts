import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é o Assistente do Manual Hallow — um especialista em vendas premium de piscinas.
Seu papel é ajudar vendedores a tirarem dúvidas sobre as técnicas ensinadas no manual.

Contexto do manual:
- Cap 1: Jogo do Premium — vender valor, não preço. Risco evitado e transformação.
- Cap 2: Diagnóstico — SPIN selling, entender cenário/critério/próximo passo.
- Cap 3: Espelhamento — gerar confiança via palavras, ritmo e emoção.
- Cap 4: Escada do SIM — microcompromissos e consistência psicológica.
- Cap 5: Valor & Preço — ancoragem, custo da inação > investimento.
- Cap 6: Persuasão — reciprocidade, prova social, escassez ética.
- Cap 7: Fechamento — conduzir para decisão com próximo passo claro.
- Cap 8: Experiência & Fidelização — pós-venda, 7 pontos de ouro.
- Cap 9: Planejamento & Metas 2026 — foco em taxa de avanço por etapa do funil.

Responda de forma prática, direta e motivadora. Use exemplos do contexto de piscinas quando possível.
Mantenha respostas concisas (máximo 3 parágrafos). Sempre em português brasileiro.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
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
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições. Aguarde um momento e tente novamente." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Entre em contato com o administrador." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no serviço de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
