export interface SpreadProduct {
  id: number;
  title: string;
  images: { imageUrl: string }[];
  price: {
    value: number;
    currency: string;
  };
  variants?: {
    d2cPrice: string;
  }[];
}
