const ERROR_MAP: Record<string, string> = {
  "Invalid login credentials": "E-mail ou senha incorretos.",
  "Email not confirmed": "Confirme seu e-mail antes de entrar.",
  "User already registered": "Este e-mail já está cadastrado.",
  "Password should be at least 6 characters": "A senha deve ter no mínimo 6 caracteres.",
  "Signup requires a valid password": "Informe uma senha válida.",
  "Email rate limit exceeded": "Muitas tentativas. Aguarde alguns minutos.",
  "For security purposes, you can only request this after": "Aguarde antes de solicitar novamente.",
  "Unable to validate email address: invalid format": "Formato de e-mail inválido.",
  "New password should be different from the old password": "A nova senha deve ser diferente da anterior.",
};

export function translateAuthError(message: string): string {
  for (const [key, translation] of Object.entries(ERROR_MAP)) {
    if (message.includes(key)) return translation;
  }
  return message;
}
