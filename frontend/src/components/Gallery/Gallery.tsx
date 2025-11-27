import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import StickyLinks from "../StickyLinks/StickyLinks";
import type { AlbumPhoto } from "../../types/strapi";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import "./Gallery.css";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import "yet-another-react-lightbox/styles.css";
import { arrayMove } from "@dnd-kit/sortable";
import SortableGallery from "../SortableGallery/SortableGallery";

const token = import.meta.env.VITE_API_TOKEN;
const apiUrl = import.meta.env.VITE_API_URL;

const Gallery = () => {
  const [photos, setPhotos] = useState<AlbumPhoto[]>([]);
  const [index, setIndex] = useState<number | null>(null);
  const { id } = useParams<{ id: string }>();

  function loadImageDimensions(url: string) {
    return new Promise<{ width: number; height: number }>((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () =>
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve({ width: 0, height: 0 }); // ✅ fail-safe
    });
  }

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await axios.get(
          `${apiUrl}/api/albums?filters[id][$eq]=${id}&populate=*`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const items = res.data.data[0]?.photos ?? [];

        const mapped = await Promise.all(
          items.map(async (item: any) => {
            const url = item.full_image_url;
            const alt = item.title;
            const dims = await loadImageDimensions(url);

            return {
              src: url,
              alt,
              width: dims.width || 1,
              height: dims.height || 1,
              id: url, // ✅ unique id
            };
          })
        );

        setPhotos(mapped);
      } catch (err) {
        console.error("Error fetching photos:", err);
      }
    }

    fetchPhotos();
  }, [id]);

  return (
    <>
      <StickyLinks />

      <SortableGallery
        gallery={RowsPhotoAlbum}
        spacing={10}
        photos={photos}
        onClick={({ index: photoIndex }) => setIndex(photoIndex)}
        movePhoto={(oldIndex, newIndex) =>
          setPhotos(arrayMove(photos, oldIndex, newIndex))
        }
      />

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
