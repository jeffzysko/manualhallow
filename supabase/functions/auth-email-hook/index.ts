import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GOLD = "#C9A96A";
const DARK_BG = "#09090F";
const CARD_BG = "#13151F";
const TEXT_COLOR = "#F4F0E8";
const GRAY = "#9E9A92";

function buildEmailHtml({
  title,
  heading,
  body,
  buttonText,
  buttonUrl,
}: {
  title: string;
  heading: string;
  body: string;
  buttonText: string;
  buttonUrl: string;
}) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:${DARK_BG};border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding:40px 32px 16px;">
              <h1 style="margin:0;font-size:28px;font-weight:700;color:${GOLD};letter-spacing:3px;">HALLOW</h1>
              <p style="margin:4px 0 0;font-size:11px;color:${GRAY};letter-spacing:2px;text-transform:uppercase;">Manual de Vendas</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${CARD_BG};border-radius:12px;border:1px solid rgba(201,169,106,0.18);">
                <tr>
                  <td style="padding:32px 24px;text-align:center;">
                    <h2 style="margin:0 0 16px;font-size:20px;font-weight:600;color:${TEXT_COLOR};">${heading}</h2>
                    <p style="margin:0 0 28px;font-size:14px;line-height:1.6;color:${GRAY};">${body}</p>
                    <a href="${buttonUrl}" style="display:inline-block;padding:14px 32px;background-color:${GOLD};color:${DARK_BG};font-size:14px;font-weight:700;text-decoration:none;border-radius:10px;letter-spacing:0.5px;">${buttonText}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding:8px 32px 32px;">
              <p style="margin:0;font-size:11px;color:${GRAY};">Se você não solicitou este e-mail, ignore-o.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    return new Response(
      JSON.stringify({ error: "RESEND_API_KEY not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const payload = await req.json();
    
    // Supabase auth hook payload format
    const email = payload?.user?.email || payload?.email;
    const emailData = payload?.email_data || {};
    const type = emailData?.email_action_type || payload?.type;
    const token_hash = emailData?.token_hash || payload?.token_hash;
    const redirect_to = emailData?.redirect_to || payload?.redirect_to;
    const confirmation_url = emailData?.confirmation_url || payload?.confirmation_url;

    if (!email) {
      console.error("No email found in payload:", JSON.stringify(payload));
      return new Response(
        JSON.stringify({ error: "No recipient email found" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let subject: string;
    let heading: string;
    let body: string;
    let buttonText: string;
    let buttonUrl: string;

    switch (type) {
      case "signup":
        subject = "Confirme seu cadastro — Hallow";
        heading = "Bem-vindo à Hallow!";
        body = "Estamos felizes em ter você. Clique no botão abaixo para confirmar seu e-mail e acessar o Manual de Vendas.";
        buttonText = "Confirmar E-mail";
        buttonUrl = confirmation_url || `${redirect_to || "https://hallow.com.br"}?token_hash=${token_hash}&type=signup`;
        break;

      case "recovery":
        subject = "Redefinir senha — Hallow";
        heading = "Redefinição de Senha";
        body = "Você solicitou a redefinição da sua senha. Clique no botão abaixo para criar uma nova senha.";
        buttonText = "Redefinir Senha";
        buttonUrl = confirmation_url || `${redirect_to || "https://hallow.com.br"}/reset-password?token_hash=${token_hash}&type=recovery`;
        break;

      case "magiclink":
        subject = "Seu link de acesso — Hallow";
        heading = "Link de Acesso";
        body = "Clique no botão abaixo para acessar sua conta no Manual de Vendas Hallow.";
        buttonText = "Acessar Conta";
        buttonUrl = confirmation_url || `${redirect_to || "https://hallow.com.br"}?token_hash=${token_hash}&type=magiclink`;
        break;

      case "email_change":
        subject = "Confirme a alteração de e-mail — Hallow";
        heading = "Alteração de E-mail";
        body = "Confirme a alteração do seu endereço de e-mail clicando no botão abaixo.";
        buttonText = "Confirmar Alteração";
        buttonUrl = confirmation_url || `${redirect_to || "https://hallow.com.br"}?token_hash=${token_hash}&type=email_change`;
        break;

      default:
        subject = "Notificação — Hallow";
        heading = "Notificação";
        body = "Você recebeu uma notificação do Manual de Vendas Hallow.";
        buttonText = "Acessar";
        buttonUrl = confirmation_url || redirect_to || "https://hallow.com.br";
    }

    const html = buildEmailHtml({ title: subject, heading, body, buttonText, buttonUrl });

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Hallow <noreply@hallow.com.br>",
        to: [email],
        subject,
        html,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("Resend error:", resendData);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: resendData }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true, id: resendData.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Auth email hook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
