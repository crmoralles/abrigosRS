import { AUTH_ERRORS } from 'src/app/shared/constants/errors.const'

export class AuthError extends Error {
  constructor(error: any) {
    super(error.message)

    this.message = this.getMessage(error)
    this.name = 'AuthError'
  }

  getMessage(error: any) {
    const errors = [error?.code, error?.message, error.error?.code, error]
    let errorMessage = 'Ocorreu um erro desconhecido.'

    for (const error of errors) {
      if (AUTH_ERRORS[error]) {
        errorMessage = AUTH_ERRORS[error]
        break
      }
    }

    return errorMessage
  }
}
