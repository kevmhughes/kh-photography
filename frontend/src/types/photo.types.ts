export interface ExifData {
  camera?: string;
  lens?: string;
  aperture?: string;
  iso?: number;
  focalLength?: string;
  shutterSpeed?: string;
  // description field is being used to describe location
  description?: string
}

export interface Photo {
  _id: string;
  title: string;
  caption: string;
  description: string;
  exif_data: ExifData;
  image: {
    asset: {
      url: string;
      metadata: {
        dimensions: { width: number; height: number; aspectRatio: number };
        lqip?: string;
      };
    };
  };
}

export interface Album {
  _id: string;
  title: string;
  slug?: {
    current: string;
  };
  description?: string;
  coverImage?: {
    asset?: any;
  };
}
