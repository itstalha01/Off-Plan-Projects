export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  status: "available" | "sold" | "reserved";
  createdAt: string;
};
