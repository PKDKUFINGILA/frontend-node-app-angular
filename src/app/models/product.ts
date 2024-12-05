export class Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  userId: string;
  createdAt: Date;

  constructor(
    name: string,
    description: string,
    price: number,
    stock: number,
    image: string,
    userId: string,
    createdAt: Date,
    _id?: string
  ) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.image = image;
    this.userId = userId;
    this.createdAt = createdAt;
  }
}
