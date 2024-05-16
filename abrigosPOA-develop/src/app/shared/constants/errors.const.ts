export const AUTH_ERRORS: { [key: string]: string } = {
  'auth/user-not-found': 'Usuário ou senha incorreta',
  'auth/invalid-email': 'Email inválido',
  'auth/wrong-password': 'Usuário ou senha incorreta',
  'auth/email-already-in-use': 'Já existe uma conta com este e-mail',
  'account-exists-with-different-credential': 'Já existe uma conta com este e-mail',
  'auth/weak-password': 'Senha precisa ter no mínimo 6 caracteres',
  'auth/user-disabled': 'Usuário desativado',
  'auth/argument-error': 'Erro no provedor de login',
  'auth/popup-closed-by-user': 'Popup de autenticação fechado pelo usuário',
  'auth/operation-not-allowed': 'Operação não permitida',
  'auth/requires-recent-login': 'Requer autenticação recente',
}
