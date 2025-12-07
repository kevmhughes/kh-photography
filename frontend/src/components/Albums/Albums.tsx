import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import StickyLinks from "../StickyLinks/StickyLinks";
import "../Albums/Albums.css";
import sanityClient, { urlFor } from "../../sanityClient";
import type {Album} from "../../types/photo.types"

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
      } catch (err) {
        console.error("Error fetching albums:", err);
      }
    }

    fetchAlbums();
  }, []);

  console.log("albums", albums)

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
