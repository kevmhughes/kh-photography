import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import StickyLinks from "../StickyLinks/StickyLinks";
import type { Album as AlbumType } from "../../types/strapi";
import "../Albums/Albums.css";

const token = import.meta.env.VITE_API_TOKEN;
const apiUrl = import.meta.env.VITE_API_URL;

const Home = () => {
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const res = await axios.get(`${apiUrl}/api/albums?populate=*`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAlbums(res.data.data);
      } catch (err) {
        console.error("Error fetching photos: ", err);
      }
    }

    fetchAlbums();
  }, []);

  // AUTO SCROLL (only 2 times)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || albums.length === 0) return;

    let count = 0; // how many times it has scrolled

    // Wait until images are fully loaded
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
      const scrollOnce = () => {
        count++;

        const cards = container.children;
        const nextIndex = count; // move 1 → 2

        if (nextIndex >= cards.length) return; // avoid errors

        const card = cards[nextIndex] as HTMLElement;

        card.scrollIntoView({
          behavior: "smooth",
          inline: "start",
        });

        if (count >= 2) {
          clearInterval(interval); // STOP after 2 scrolls
        }
      };

      const interval = setInterval(scrollOnce, 3000); // scroll every 3 seconds

      return () => clearInterval(interval);
    });
  }, [albums]);

  return (
    <>
      <StickyLinks />
      <div className="albums-container" ref={containerRef}>
        {albums.map((item) => (
          <div key={item.id} className="album-card">
            <Link to={`/gallery/${item.id}`}>
              <img
                src={item.cover_image_url}
                alt={item.title}
                className="album-image"
              />
              <div className="album-title">
                <div className="title-container">{item.title}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
