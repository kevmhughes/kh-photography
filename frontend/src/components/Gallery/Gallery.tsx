import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import StickyLinks from "../StickyLinks/StickyLinks";
// react-photo-album
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import "./Gallery.css";
// yet-another-react-lightbox
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import "yet-another-react-lightbox/styles.css";
// dnd-kit
import { arrayMove } from "@dnd-kit/sortable";
import SortableGallery from "../SortableGallery/SortableGallery";
import { useResponsiveRowHeight } from "../../hooks/useResponsiveRowHeight";
// Sanity
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
  const targetRowHeight = useResponsiveRowHeight();
  const { id } = useParams<{ id: string }>();
  const [photos, setPhotos] = useState<
    { id: string; src: string; alt: string; width: number; height: number; lqip?: string }[]
  >([]);
  const [index, setIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  // Save new order after drag & drop
  async function saveOrderToSanity(newPhotos: { id: string }[]) {
    try {
      const newOrder = newPhotos.map((p) => ({ _type: "reference", _ref: p.id }));
      await sanityClient.patch(id!).set({ photos: newOrder }).commit();
      console.log("Saved new order to Sanity:", newOrder);
    } catch (err) {
      console.error("Error saving new photo order:", err);
    }
  }

  // Fetch photos from Sanity
  useEffect(() => {
    async function fetchPhotos() {
      setLoading(true);
      setImagesLoaded(false);
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
        if (!album?.photos) {
          setPhotos([]);
          return;
        }
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
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPhotos();
  }, [id]);

  // Preload all images
  useEffect(() => {
    if (photos.length === 0) {
      setImagesLoaded(false);
      return;
    }

    let isCancelled = false;

    async function preloadImages() {
      try {
        const promises = photos.map(
          (photo) =>
            new Promise<void>((resolve) => {
              const img = new Image();
              img.src = photo.src;
              if (img.complete) {
                resolve();
              } else {
                img.onload = () => resolve();
                img.onerror = () => resolve();
              }
            })
        );
        await Promise.all(promises);
        if (!isCancelled) setImagesLoaded(true);
      } catch (err) {
        console.error("Error preloading images:", err);
        if (!isCancelled) setImagesLoaded(true); // fail-safe
      }
    }

    preloadImages();

    return () => {
      isCancelled = true;
    };
  }, [photos]);

  // Show loader after a short delay to prevent flicker
  useEffect(() => {
    const t = setTimeout(() => setShowLoader(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Early return until data & images are loaded
  if (loading || !imagesLoaded) {
    return (
      <>
        <StickyLinks />
        {showLoader && <Loader />}
      </>
    );
  }

  return (
    <>
      <StickyLinks />
      <SortableGallery
        gallery={RowsPhotoAlbum}
        spacing={10}
        photos={photos}
        layoutOptions={{ targetRowHeight }}
        onClick={({ index: photoIndex }) => setIndex(photoIndex)}
        movePhoto={(oldIndex, newIndex) => {
          const newOrder = arrayMove(photos, oldIndex, newIndex);
          setPhotos(newOrder);
          saveOrderToSanity(newOrder);
        }}
      />

      {index !== null && (
        <Lightbox
          open
          close={() => setIndex(null)}
          plugins={[Fullscreen, Slideshow]}
          index={index}
          slides={photos.map((p) => ({ src: p.src, title: p.alt }))}
        />
      )}
    </>
  );
};

export default Gallery;
