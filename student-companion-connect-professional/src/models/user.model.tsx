export class User {
  fullName!: string;
  usrEmail!: string;
  password!: string;
  confirmPassword!: string;
  company!: string;
  location!: string;
  locationIndia!: string;
  language!: string;
  dob!: string;
}

export class UserInfo {
  _id!: string;
  fullName!: string;
  usrImg!: string;
  usrEmail!: string;
  location!: string;
  dob!: string;
  gender!: string;
  locationIndia!: string;
  profession!: string;
  hobbies!: string;
  description!: string;
  language!: string;
  facebook!: string;
  twitter!: string;
  instagram!: string;
  company!: string;
  contactNo!: string;
  contactEmail!: string;
  createdAt!: string;
  discoverable!: boolean;
  womenOnly!: boolean;
  status!: boolean;
}

export class VerifyUser {
  usrEmail!: string;
  otp!: string;
}

export class UserResetPass {
  usrEmail!: string;
  otp!: string;
  password!: string;
  confirmPassword!: string;
}
