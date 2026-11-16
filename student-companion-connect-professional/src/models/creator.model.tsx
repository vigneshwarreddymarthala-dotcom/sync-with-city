export class Creator {
  _id!: string;
  rId!: string;
  rLogo!: string;
  rName!: string;
  description!: string;
  location!: string;
  category!: string;
  ownerName!: string;
  menuList!: string[];
  facebook!: string;
  twitter!: string;
  instagram!: string;
  website!: string;
  googleReview!: string;
  usrType!: string;
}

export class CreatorLogin {
  _id!: string;
  fullName!: string;
  usrEmail!: string;
  accType!: string;
  password!: string;
  confirmPassword!: string;
  status!: boolean;
  createdAt!: string;
}

export class VerifyCreator {
  usrEmail!: string;
  otp!: string;
}
