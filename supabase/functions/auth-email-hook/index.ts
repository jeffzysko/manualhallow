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
const GOLD_DIM = "rgba(201,169,106,0.12)";
const BORDER = "rgba(201,169,106,0.18)";

function buildEmailHtml({
  title,
  heading,
  subtitle,
  body,
  buttonText,
  buttonUrl,
  footerNote,
}: {
  title: string;
  heading: string;
  subtitle?: string;
  body: string;
  buttonText: string;
  buttonUrl: string;
  footerNote?: string;
}) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:48px 16px;">

        <!-- Main Container -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:${DARK_BG};border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
          
          <!-- Gold Top Accent -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg, transparent, ${GOLD}, transparent);"></td>
          </tr>

          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding:48px 40px 12px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:40px;height:1px;background:linear-gradient(90deg, transparent, ${GOLD});"></td>
                  <td style="padding:0 16px;">
                    <h1 style="margin:0;font-size:26px;font-weight:700;color:${GOLD};letter-spacing:4px;font-family:Georgia,'Times New Roman',serif;">HALLOW</h1>
                  </td>
                  <td style="width:40px;height:1px;background:linear-gradient(270deg, transparent, ${GOLD});"></td>
                </tr>
              </table>
              <p style="margin:6px 0 0;font-size:10px;color:${GRAY};letter-spacing:3px;text-transform:uppercase;">Manual de Vendas</p>
            </td>
          </tr>

          <!-- Content Card -->
          <tr>
            <td style="padding:16px 32px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${CARD_BG};border-radius:16px;border:1px solid ${BORDER};">
                <tr>
                  <td style="padding:40px 28px;text-align:center;">
                    
                    <!-- Icon / Decorative Element -->
                    <div style="width:56px;height:56px;margin:0 auto 24px;border-radius:14px;background:${GOLD_DIM};border:1px solid ${BORDER};line-height:56px;font-size:24px;">
                      ✉️
                    </div>

                    <h2 style="margin:0 0 8px;font-size:22px;font-weight:600;color:${TEXT_COLOR};line-height:1.3;">${heading}</h2>
                    ${subtitle ? `<p style="margin:0 0 20px;font-size:13px;color:${GOLD};letter-spacing:1px;text-transform:uppercase;">${subtitle}</p>` : '<div style="height:20px;"></div>'}
                    
                    <p style="margin:0 0 32px;font-size:14px;line-height:1.7;color:${GRAY};">${body}</p>
                    
                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                      <tr>
                        <td style="border-radius:12px;background:${GOLD};">
                          <a href="${buttonUrl}" style="display:inline-block;padding:16px 40px;color:${DARK_BG};font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">${buttonText}</a>
                        </td>
                      </tr>
                    </table>

                    <!-- URL fallback -->
                    <p style="margin:24px 0 0;font-size:11px;color:${GRAY};line-height:1.5;">
                      Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
                    </p>
                    <p style="margin:8px 0 0;font-size:11px;color:${GOLD};word-break:break-all;line-height:1.5;">
                      <a href="${buttonUrl}" style="color:${GOLD};text-decoration:underline;">${buttonUrl}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:0 32px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="height:1px;background:linear-gradient(90deg, transparent, ${BORDER}, transparent);"></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 32px 36px;">
              ${footerNote ? `<p style="margin:0 0 8px;font-size:11px;color:${GRAY};line-height:1.5;">${footerNote}</p>` : ''}
              <p style="margin:0;font-size:11px;color:${GRAY};">Se você não solicitou este e-mail, ignore-o com segurança.</p>
              <p style="margin:12px 0 0;font-size:10px;color:rgba(158,154,146,0.5);">© ${new Date().getFullYear()} Hallow Comunicação · Todos os direitos reservados</p>
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
    let subtitle: string | undefined;
    let body: string;
    let buttonText: string;
    let buttonUrl: string;
    let footerNote: string | undefined;

    const baseUrl = redirect_to || "https://hallow.com.br";

    switch (type) {
      case "signup":
        subject = "Confirme seu cadastro — Hallow";
        heading = "Bem-vindo à Hallow!";
        subtitle = "Confirmação de cadastro";
        body = "Estamos muito felizes em ter você conosco. Para começar a acessar o Manual de Vendas, confirme seu endereço de e-mail clicando no botão abaixo.";
        buttonText = "Confirmar meu e-mail";
        buttonUrl = confirmation_url || `${baseUrl}?token_hash=${token_hash}&type=signup`;
        footerNote = "Este link expira em 24 horas.";
        break;

      case "recovery":
        subject = "Redefinir sua senha — Hallow";
        heading = "Redefinição de Senha";
        subtitle = "Solicitação de segurança";
        body = "Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha segura.";
        buttonText = "Redefinir minha senha";
        buttonUrl = confirmation_url || `${baseUrl}/reset-password?token_hash=${token_hash}&type=recovery`;
        footerNote = "Se você não solicitou esta alteração, sua conta continua segura.";
        break;

      case "magiclink":
        subject = "Seu link de acesso — Hallow";
        heading = "Acesso Rápido";
        subtitle = "Link mágico";
        body = "Use o botão abaixo para acessar sua conta no Manual de Vendas Hallow de forma rápida e segura, sem precisar digitar sua senha.";
        buttonText = "Acessar minha conta";
        buttonUrl = confirmation_url || `${baseUrl}?token_hash=${token_hash}&type=magiclink`;
        footerNote = "Este link é válido para um único acesso.";
        break;

      case "email_change":
        subject = "Confirme a alteração de e-mail — Hallow";
        heading = "Alteração de E-mail";
        subtitle = "Confirmação necessária";
        body = "Você solicitou a alteração do endereço de e-mail associado à sua conta. Confirme esta mudança clicando no botão abaixo.";
        buttonText = "Confirmar novo e-mail";
        buttonUrl = confirmation_url || `${baseUrl}?token_hash=${token_hash}&type=email_change`;
        footerNote = "Se você não solicitou esta alteração, entre em contato conosco.";
        break;

      default:
        subject = "Notificação — Hallow";
        heading = "Notificação";
        body = "Você recebeu uma notificação do Manual de Vendas Hallow.";
        buttonText = "Acessar";
        buttonUrl = confirmation_url || baseUrl;
    }

    const html = buildEmailHtml({ title: subject, heading, subtitle, body, buttonText, buttonUrl, footerNote });

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Hallow Comunicação <noreply@hallow.com.br>",
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
