export class Product {
  _id!: string;
  rId!: string;
  proName!: string;
  category!: string;
  images!: string;
  location!: string;
  qty!: string;
  price!: string;
  details!: string;
  date!: string;
  time!: string;
  discount!: string;
  status!: boolean;
}

export class UpProduct {
  id!: string;
  discount!: string;
}

export class Cart {
  _id!: string;
  uId!: string;
  proId!: string;
  rId!: string;
  proName!: string;
  category!: string;
  images!: string;
  qty!: string;
  price!: string;
  disPrice!: string;
}
