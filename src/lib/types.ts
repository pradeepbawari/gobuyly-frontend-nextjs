export interface Product {
  id: number;
  price: string;
  sale_price: string;
  stock: number;
  sku: string;
  size: string | null;
  title: string | null;
  images: ProductImage[];
  primary_image: ProductImage | null;
  name?: string;
  brand?: string;
  description?: string;
  rating?: number;
  category?: string;
  subcategory?: string;
  product_name?: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_id: number;
  image_url: string;
  public_id: string;
}

export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  children?: Category[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  fullName: string
  phoneNumber: string
  pincode: string
  area: string
  city: string
  state: string
}
