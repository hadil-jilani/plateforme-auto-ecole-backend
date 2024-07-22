import { signupDto, UpdatePasswordDto, UpdateProfileDto } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable()
export class AppService {
  constructor(
    @Inject('auth') private auth: ClientProxy,
    @Inject('demande') private demande: ClientProxy,
    @Inject('formateur') private formateur: ClientProxy,
    @Inject('profile') private profile: ClientProxy,
    private jwtservice: JwtService
  ) { }

  async Signup(data: signupDto) {
    const result = this.auth.send('sign-up', data)
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return result
  }

  async ActivateAccount(activationToken) {
    console.log(activationToken)
    const result = this.auth.send('activate-account', activationToken)
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return result
  }


  async Login(data) {
    const result = this.auth.send('login-user', data)
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return result
  }

  async ForgetPassword(email) {
    const result = this.auth.send('forget-pwd', email)
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return result
  }

  async ResetPassword(data) {
    const result = this.auth.send('reset-password', data)
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return result
  }
  // pending
  async SearchSchool(data) {
    const result = this.auth.send('search-school', data)
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return result
  }

  async Logout(req: Request) {
    console.log("service")
    const result = this.auth.emit('logout-user', req)
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return result
  }

  async GetProfile(req: Request) {
    console.group("service")
    const id = this.GetLoggedUserId(req)
    const result = this.profile.send('get-profile', id)
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return result
  }

  async UpdateProfile(req: Request, updateData: UpdateProfileDto) {
    console.group("service")
    const id = this.GetLoggedUserId(req)
    const result = this.profile.send('update-profile', { id, updateData })
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return result
  }
  async DeleteProfile(req: Request) {
    console.group("service")
    const id = this.GetLoggedUserId(req)
    const result = this.profile.send('delete-profile', id)
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return result
  }
  async UpdatePassword(req: Request, updatePassword: UpdatePasswordDto) {
    console.group("service")
    const id = this.GetLoggedUserId(req)
    const result = this.profile.send('update-password', { id, updatePassword })
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return result
  }

  async AllRequests() {
    const response = await this.demande.send('get-all-requests', {})
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return response;
  }

  async AcceptRequest(id) {
    const response = await this.demande.emit('accept-request', id)
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return response;
  }
  async RejectRequest(id) {
    const response = await this.demande.emit('reject-request', id)
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return response;
  }

  async AddTrainer(req, formateurData) {
    const ecoleId = this.GetLoggedUserId(req)
    const response = await this.formateur.send('add-trainer', { ecoleId, formateurData })
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    console.log(response)
    return response;
  }
  async EditTrainer(id, formateurData) {
    const response = await this.formateur.send('edit-trainer', { id, formateurData })
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    console.log(response)
    return response;
  }
  async DeleteTrainer(req, id) {
    const ecoleId = this.GetLoggedUserId(req)
    const response = await this.formateur.emit('delete-trainer', { ecoleId, id })
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    console.log(response)
    return response;
  }
  async GetTrainer(id) {
    const response = await this.formateur.send('get-trainer', id)
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    console.log(response)
    return response;
  }
  async GetAllTrainers(req) {
    const ecoleId = this.GetLoggedUserId(req)
    const response = await this.formateur.send('get-all-trainers', ecoleId)
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    console.log(response)
    return response;
  }

  GetLoggedUserId(req) {
    const token = req.headers['accesstoken'];
    const decoded = this.jwtservice.decode(token);
    const id = decoded?.id
    return id
  }
}