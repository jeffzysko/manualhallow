import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import "@/styles/manual.css";

const CHALLENGES = [
  "Quebrar objeção de preço",
  "Fazer follow-up sem parecer insistente",
  "Fechar clientes que 'vão pensar'",
  "Apresentar o valor premium",
  "Lidar com comparação de concorrência",
  "Diagnosticar o perfil do cliente",
];

const OBJECTIONS = [
  "\"Tá caro\"",
  "\"Vou pensar\"",
  "\"Estou pesquisando\"",
  "\"Vou ver com meu marido/esposa\"",
  "\"Achei mais barato na concorrência\"",
  "\"Agora não é o momento\"",
];

const SALES_STAGES = [
  "No primeiro contato (cliente ainda frio)",
  "Após enviar o orçamento",
  "Na hora de fechar (cliente enrola)",
  "No follow-up (cliente some)",
  "Quando o cliente compara com concorrência",
  "Quando preciso justificar o preço premium",
];

const OnboardingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [challenge, setChallenge] = useState("");
  const [objection, setObjection] = useState("");
  const [salesStage, setSalesStage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleFinish = async () => {
    if (!user || !challenge || !objection || !confidence) return;
    setSaving(true);
    try {
      await supabase.from("user_onboarding").insert({
        user_id: user.id,
        biggest_challenge: challenge,
        common_objection: objection,
        confidence_level: confidence,
      });
      navigate("/", { replace: true });
    } catch {
      alert("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const canAdvance = step === 0 ? !!challenge : step === 1 ? !!objection : !!confidence;

  return (
    <div className="manual-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="onboarding-container">
        {/* Progress dots */}
        <div className="onboarding-progress">
          {[0, 1, 2].map(i => (
            <div key={i} className={`onboarding-dot ${i === step ? "onboarding-dot--active" : i < step ? "onboarding-dot--done" : ""}`} />
          ))}
        </div>

        <div className="onboarding-header">
          <span className="onboarding-icon">✦</span>
          <h1 className="onboarding-title">
            {step === 0 && "Qual sua maior dificuldade em vendas?"}
            {step === 1 && "Qual objeção você mais enfrenta?"}
            {step === 2 && "Qual seu nível de experiência?"}
          </h1>
          <p className="onboarding-subtitle">
            {step === 0 && "Isso nos ajuda a personalizar sua experiência no manual."}
            {step === 1 && "Vamos focar nas técnicas certas pra você."}
            {step === 2 && "Assim o Mentor Hallow adapta as orientações ao seu perfil."}
          </p>
        </div>

        <div className="onboarding-options">
          {step === 0 && CHALLENGES.map(c => (
            <button
              key={c}
              className={`onboarding-option ${challenge === c ? "onboarding-option--selected" : ""}`}
              onClick={() => setChallenge(c)}
            >
              {c}
            </button>
          ))}

          {step === 1 && OBJECTIONS.map(o => (
            <button
              key={o}
              className={`onboarding-option ${objection === o ? "onboarding-option--selected" : ""}`}
              onClick={() => setObjection(o)}
            >
              {o}
            </button>
          ))}

          {step === 2 && CONFIDENCE.map(c => (
            <button
              key={c.value}
              className={`onboarding-option onboarding-option--wide ${confidence === c.value ? "onboarding-option--selected" : ""}`}
              onClick={() => setConfidence(c.value)}
            >
              <strong>{c.label}</strong>
              <span className="onboarding-option-desc">{c.desc}</span>
            </button>
          ))}
        </div>

        <div className="onboarding-actions">
          {step > 0 && (
            <button className="onboarding-btn onboarding-btn--back" onClick={() => setStep(s => s - 1)}>
              ← Voltar
            </button>
          )}
          {step < 2 ? (
            <button
              className="onboarding-btn onboarding-btn--next"
              disabled={!canAdvance}
              onClick={() => setStep(s => s + 1)}
            >
              Próximo →
            </button>
          ) : (
            <button
              className="onboarding-btn onboarding-btn--next"
              disabled={!canAdvance || saving}
              onClick={handleFinish}
            >
              {saving ? "Salvando..." : "Começar ✦"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
