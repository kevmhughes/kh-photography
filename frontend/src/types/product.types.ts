export interface SpreadProduct {
  id: number;
  title: string;
  description: string;
  images: { imageUrl: string }[];
  variants: {
    productTypeName: string;
    d2cPrice: number;
    stock: number;
  }[];
}
