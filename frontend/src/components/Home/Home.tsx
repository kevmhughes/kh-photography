import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";
import StickyLinks from "../StickyLinks/StickyLinks";
import "../Albums/Albums.css";
import sanityClient, { urlFor } from "../../sanityClient";
import type {Album} from "../../types/photo.types"

const Home = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Fetch albums using async/await
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const query = `*[_type == "album"]{
          _id,
          title,
          description,
          slug,
          coverImage{
            asset->{
              url,
              metadata { dimensions }
            }
          }
        }`;

        const res = await sanityClient.fetch(query);
        setAlbums(res);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching albums:", err);
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  // Preload all album cover images
  useEffect(() => {
    if (albums.length === 0) return;

    const preloadImages = async () => {
      const promises = albums.map(async (album) => {
        const imgUrl = album.coverImage?.asset?.url;
        if (!imgUrl) return true;

        return new Promise((resolve) => {
          const img = new Image();
          img.src = imgUrl;
          img.onload = () => resolve(true);
          img.onerror = () => resolve(true);
        });
      });

      await Promise.all(promises);
      setImagesLoaded(true);
    };

    preloadImages();
  }, [albums]);

  // AUTO SCROLL (desktop only)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || albums.length === 0) return;
    if (window.innerWidth < 768) return;

    let count = 0;
    let interval: ReturnType<typeof setInterval> | null = null;
    let userInteracted = false;

    const markUserInteracted = () => {
      userInteracted = true;
      if (interval) clearInterval(interval);
    };

    container.addEventListener("wheel", markUserInteracted, { once: true });
    container.addEventListener("touchstart", markUserInteracted, {
      once: true,
    });
    container.addEventListener("pointerdown", markUserInteracted, {
      once: true,
    });

    const scrollOnce = () => {
      if (userInteracted) {
        clearInterval(interval!);
        return;
      }

      count++;
      const cards = container.children;
      const nextIndex = count;

      if (nextIndex >= cards.length) {
        clearInterval(interval!);
        return;
      }

      (cards[nextIndex] as HTMLElement).scrollIntoView({
        behavior: "smooth",
        inline: "start",
      });

      if (count >= 2) clearInterval(interval!);
    };

    interval = setInterval(scrollOnce, 3000);

    return () => {
      container.removeEventListener("wheel", markUserInteracted);
      container.removeEventListener("touchstart", markUserInteracted);
      container.removeEventListener("pointerdown", markUserInteracted);
      if (interval) clearInterval(interval);
    };
  }, [albums]);

  // Show loader if albums or images are still loading
  if (loading || !imagesLoaded) {
    return (
      <>
        <StickyLinks />
        <Loader />
      </>
    );
  }

  return (
    <>
      <StickyLinks />
      <div className="albums-container" ref={containerRef}>
        {albums.map((item) => {
          const imgUrl = item.coverImage?.asset
            ? urlFor(item.coverImage).url()
            : null;

          return (
            <div key={item._id} className="album-card">
              <Link to={`/gallery/${item.slug?.current}`}>
                {imgUrl ? (
                  <img src={imgUrl} alt={item.title} className="album-image" />
                ) : (
                  <div className="no-image-placeholder">No cover image</div>
                )}

                <div className="album-title-container">
                  <div className="album-title">{item.title}</div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Home;
