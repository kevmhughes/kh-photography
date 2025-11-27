// Type definitions for Strapi response
export interface ExifData {
  Camera: string;
  Lens: string;
  ISO: number;
  ShutterSpeed: string;
  Aperture: string;
}

export interface Album {
  id: number;
  title: string;
  description: string;
  cover_image_url: string;
}

export interface Photo {
  id: number;
  title: string;
  caption: string;
  description: { type: string; children: { text: string }[] }[];
  exif_data: ExifData;
  full_image_url: string;
  thumbnail_url: string;
  albums: { data: Album[] };
}

// react-photo-album
export interface AlbumPhoto {
  src: string;
  width: number;
  height: number;
  alt?: string;
}
