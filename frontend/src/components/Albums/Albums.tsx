import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import StickyLinks from "../StickyLinks/StickyLinks";
import type { Album as AlbumType } from "../../types/strapi";
import "./Albums.css";

const token = import.meta.env.VITE_API_TOKEN;
const apiUrl = import.meta.env.VITE_API_URL;

const Albums = () => {
  const [albums, setAlbums] = useState<AlbumType[]>([]);

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const res = await axios.get(`${apiUrl}/api/albums?populate=*`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const items = res.data.data;
        setAlbums(items);
      } catch (err) {
        console.error("Error fetching photos: ", err);
      }
    }

    fetchAlbums();
  }, []);

  console.log("albums", albums);

  return (
    <>
      <StickyLinks />
      <div className="albums-container">
        {albums.map((item) => (
          <div key={item.id} className="album-card">
            <Link to={`/gallery/${item.id}`}>
              <img
                src={item.cover_image_url}
                alt={item.title}
                className="album-image"
                style={{ height: "100%" }}
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

export default Albums;
