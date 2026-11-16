export class PromoteLogin {
  _id!: string;
  fullName!: string;
  usrEmail!: string;
  password!: string;
  confirmPassword!: string;
  location!: boolean;
  status!: boolean;
  createdAt!: string;
}

export class VerifyPromote {
  usrEmail!: string;
  otp!: string;
}
