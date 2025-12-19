import { useEffect, useRef, useState } from "react";

type VariantThumbnailProps = {
  item: any;
  index: number;
  activeIndex: number;
  onClick: (index: number) => void;
};

const VariantThumbnail = ({
  item,
  index,
  activeIndex,
  onClick,
}: VariantThumbnailProps) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [fontSize, setFontSize] = useState(12);

  useEffect(() => {
    if (!imgRef.current) return;
    if (typeof ResizeObserver === "undefined") {
      setFontSize(10);
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setFontSize(Math.max(10, width * 0.18));
    });

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div onClick={() => onClick(index)}>
      <img
        ref={imgRef}
        src={item.files[0].thumbnail_url}
        alt={item.name}
        className={
          index === activeIndex
            ? "variant-thumbnail-active"
            : "variant-thumbnail"
        }
      />
      <div className="variant-thumbnail-size" style={{ fontSize }}>{item.size}</div>
    </div>
  );
};

type VariantsProps = {
  variants: any[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

const Variants = ({ variants, activeIndex, onSelect }: VariantsProps) => {
  return (
    <div className="variant-thumbnails-container">
      {variants.map((item, index) => (
        <VariantThumbnail
          key={item.id}
          item={item}
          index={index}
          activeIndex={activeIndex}
          onClick={onSelect}
        />
      ))}
    </div>
  );
};

export default Variants;
