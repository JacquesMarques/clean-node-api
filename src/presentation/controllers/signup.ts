import { MissingParamError } from '../errors/missing-param-error'
import { badRequest, serverError } from '../helpers/http-helper'
import { type HttpResponse, type HttpRequest } from '../protocols/http'
import { type Controller } from '../protocols/controller'
import { type EmailValidator } from '../protocols/email_validator'
import { InvalidParamError } from '../errors/invalid-param-error'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      return {
        statusCode: 100,
        body: null
      }
    } catch (error) {
      return serverError()
    }
  }
}
