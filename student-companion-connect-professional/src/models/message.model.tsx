export class Conversation {
  _id!: string;
  rId!: string;
  rName!: string;
  usrId!: string;
  usrName!: string;
  createdAt!: string;
  lastMsg!: string;
}

export class Messages {
  _id!: string;
  cId!: string;
  senderId!: string;
  senderName!: string;
  message!: string;
  createdAt!: string;
}
