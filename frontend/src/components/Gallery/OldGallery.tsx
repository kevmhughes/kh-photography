import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import StickyLinks from "../StickyLinks/StickyLinks";
// strapi
import type { AlbumPhoto } from "../../types/strapi";
// react-photo-album
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import "./Gallery.css"
// lightbox
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import "yet-another-react-lightbox/styles.css";

const Gallery = () => {
  const [photos, setPhotos] = useState<AlbumPhoto[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  const { id } = useParams<{ id: string }>();

  // Load real image dimensions
  function loadImageDimensions(
    url: string
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () =>
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
    });
  }

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await axios.get(
          `http://localhost:1337/api/albums?filters[id][$eq]=${id}&populate=*
`,
          {
            headers: {
              Authorization:
                "Bearer 39dac69f31e169c53940412d3894013bacfe632c25f0c8b1be7d38d44175d98ca866989959bc0be5da79e2bdcf6317217c7cc00eaf8341ec10a005f91811aa3746cd2022726f22ee5d31d1a8235435cc38cb92da17c45d23d39c5f067cad2ca545507ae73b0838b12d65612318b41a6efa542d442a449cd9c1c90a8ab868b2ee",
            },
          }
        );

        const items = res.data.data[0].photos;

        console.log("items", items);

        const mapped = await Promise.all(
          items.map(async (item: any) => {
            const url = item.full_image_url;
            const alt = item.title;
            const dims = await loadImageDimensions(url);

            return {
              src: url,
              alt,
              width: dims.width,
              height: dims.height,
            };
          })
        );

        console.log("mapped: ", mapped);
        setPhotos(mapped);
      } catch (err) {
        console.error("Error fetching photos:", err);
      }
    }

    fetchPhotos();
  }, []);

  console.log("photos", photos);

  return (
    <>
      <StickyLinks />

      {/* Rows gallery */}
      <RowsPhotoAlbum photos={photos} onClick={({ index: photoIndex }) => setIndex(photoIndex)}/>

      {/* Lightbox */}
      {index !== null && (
        <Lightbox
          open={index !== null}
          close={() => setIndex(null)}
          plugins={[Fullscreen, Slideshow]}
          slides={photos.map((p) => ({ src: p.src, title: p.alt }))}
          index={index}
        />
      )}
    </>
  );
};

export default Gallery;
