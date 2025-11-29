import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import StickyLinks from "../StickyLinks/StickyLinks";
import "../Albums/Albums.css";
import sanityClient, { urlFor } from "../../sanityClient";

interface Album {
  _id: string;
  title: string;
  description?: string;
  coverImage?: {
    asset?: any;
  };
}

const Home = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const query = `*[_type == "album"]{
          _id,
          title,
          description,
          coverImage{
            asset->{
              url,
              metadata { dimensions }
            }
          }
        }`;

        const res = await sanityClient.fetch(query);
        setAlbums(res);
      } catch (err) {
        console.error("Error fetching albums:", err);
      }
    }

    fetchAlbums();
  }, []);

  // AUTO SCROLL (only 2 times)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || albums.length === 0) return;

    // Cancel on mobile
    if (window.innerWidth < 768) return;

    let count = 0;
    let interval: ReturnType<typeof setInterval> | null = null;
    let userInteracted = false;

    // Cancel on *real* user interaction (not programmatic scroll)
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

    const waitForImages = Promise.all(
      Array.from(container.querySelectorAll("img")).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve(true);
            img.onload = () => resolve(true);
            img.onerror = () => resolve(true);
          })
      )
    );

    waitForImages.then(() => {
      if (userInteracted) return;

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

        if (count >= 2) {
          clearInterval(interval!);
        }
      };

      interval = setInterval(scrollOnce, 3000);
    });

    return () => {
      container.removeEventListener("wheel", markUserInteracted);
      container.removeEventListener("touchstart", markUserInteracted);
      container.removeEventListener("pointerdown", markUserInteracted);
      if (interval) clearInterval(interval);
    };
  }, [albums]);

  console.log("albums on homepage", albums);

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
              <Link to={`/gallery/${item._id}`}>
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
