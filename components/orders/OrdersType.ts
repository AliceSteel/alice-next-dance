type OrderItem = {
  id: string;
  productId: number;
  orderId: string;
  price: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: {
    id: number;
    name: string;
    price: string;
    terms: string[];
  };
};

export type Order = {
  orderId: string;
  clerkId: string;
  qtyItemsInOrder: number;
  orderTotalPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItem[];
};