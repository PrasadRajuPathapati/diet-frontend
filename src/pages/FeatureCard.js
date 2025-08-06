import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FeatureCard({ to, staticImg, gifImg, title, description, titleColor, delay }) {
  const [isMobile, setIsMobile] = useState(false);
  const [imgSrc, setImgSrc] = useState(staticImg);

  // Detect mobile/touch device
  useEffect(() => {
    const mobileCheck =
      window.matchMedia("(max-width: 768px)").matches || "ontouchstart" in window;
    setIsMobile(mobileCheck);

    if (mobileCheck) {
      setImgSrc(gifImg); // Show GIF immediately on mobile
    }
  }, [gifImg]);

  return (
    <Link
      to={to}
      className={`feature-card animate-fade-in-card ${delay} flex flex-col items-center`}
      onMouseEnter={() => !isMobile && setImgSrc(gifImg)}
      onMouseLeave={() => !isMobile && setImgSrc(staticImg)}
    >
      {staticImg && gifImg && (
        <img
          src={imgSrc}
          alt={title}
          className="w-12 h-12 mb-2 object-contain"
        />
      )}
      <h3 className={`text-lg md:text-xl font-semibold ${titleColor}`}>
        {title}
      </h3>
      <p className="text-sm text-gray-700 mt-2 text-center">{description}</p>
    </Link>
  );
}
