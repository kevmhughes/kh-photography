export interface SpreadProduct {
  id: string;
  thumbnail_url: string;
  name: string;
  sync_product: {
    external_id: string;
    id: number;
    is_ignored: boolean;
    name: string;
    synced: number;
    thumbnail_url: string;
    variants: number;
  };
  sync_variants: {
    id: number;
    external_id: string;
    sync_product_id: number;
    name: string;
    availability_status: "active" | "inactive";
    color: string;
    currency: string;
    files: Array<{ id?: number; preview_url?: string; thumbnail_url?: string }>;
    main_category_id: number;
    options: { name: string; value: string }[];
    product: {
      variant_id: number;
      product_id: number;
      image: string;
      name: string;
    };
    retail_price: string;
    size: string;
    sku: string;
    synced: boolean;
    variant_id: number;
    warehouse_product_id: number | null;
    warehouse_product_variant_id: number | null;
  }[];
}
