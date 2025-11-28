import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StickyLinks from "../StickyLinks/StickyLinks";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import "./Gallery.css";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import "yet-another-react-lightbox/styles.css";
import { arrayMove } from "@dnd-kit/sortable";
import SortableGallery from "../SortableGallery/SortableGallery";

import sanityClient from "../../sanityClient";

interface Photo {
  _id: string;
  title: string;
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

const Gallery = () => {
  const { id } = useParams<{ id: string }>();
  const [photos, setPhotos] = useState<
    { id: string; src: string; alt: string; width: number; height: number; lqip?: string }[]
  >([]);
  const [index, setIndex] = useState<number | null>(null);

  // ------------------------------
  // SAVE ORDER TO SANITY
  // ------------------------------
  async function saveOrderToSanity(newPhotos: { id: string }[]) {
    try {
      const newOrder = newPhotos.map((p) => ({
        _type: "reference",
        _ref: p.id,
      }));

      await sanityClient.patch(id!).set({ photos: newOrder }).commit();

      console.log("Saved new order to Sanity:", newOrder);
    } catch (err) {
      console.error("Error saving new photo order:", err);
    }
  }

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const query = `*[_type == "album" && _id == $id][0]{
          title,
          "photos": photos[]->{
            _id,
            title,
            image{
              asset->{
                url,
                metadata {
                  dimensions { width, height, aspectRatio },
                  lqip
                }
              }
            }
          }
        }`;

        const album: { photos?: Photo[] } = await sanityClient.fetch(query, { id });
        if (!album?.photos) return;

        const mapped = album.photos.map((item) => ({
          id: item._id,
          src: item.image.asset.url,
          alt: item.title,
          width: item.image.asset.metadata.dimensions.width,
          height: item.image.asset.metadata.dimensions.height,
          lqip: item.image.asset.metadata.lqip,
        }));

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
        movePhoto={(oldIndex, newIndex) => {
          const newOrder = arrayMove(photos, oldIndex, newIndex);
          setPhotos(newOrder);

          // Save to Sanity:
          saveOrderToSanity(newOrder);
        }}
      />

      {index !== null && (
        <Lightbox
          open
          close={() => setIndex(null)}
          plugins={[Fullscreen, Slideshow]}
          index={index}
          slides={photos.map((p) => ({
            src: p.src,
            title: p.alt,
          }))}
        />
      )}
    </>
  );
};

export default Gallery;
