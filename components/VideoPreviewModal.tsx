// "use client";

// import { useUIStore } from "@/store/uiStore";
// import { useEffect, useRef } from "react";

// export default function VideoPreviewModal() {
//   const { previewVideo, setPreviewVideo } = useUIStore();
//   const videoRef = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (previewVideo && video && !isYouTube(previewVideo.videoUrl)) {
//       video.load();

//       const handleCanPlay = () => {
//         video
//           .play()
//           .then(() => console.log("Video playing"))
//           .catch((err) => console.warn("Autoplay blocked:", err));
//       };

//       video.addEventListener("canplay", handleCanPlay);
//       return () => {
//         video.pause();
//         video.removeEventListener("canplay", handleCanPlay);
//       };
//     }
//   }, [previewVideo]);

//   if (!previewVideo) return null;

//   const isYouTube = (url: string) =>
//     url.includes("youtube.com") || url.includes("youtu.be");

//   const getYouTubeEmbedUrl = (url: string) => {
//     const videoIdMatch = url.match(
//       /(?:youtube\.com\/.*v=|youtu\.be\/)([^&#?]*)/
//     );
//     const videoId = videoIdMatch ? videoIdMatch[1] : null;
//     return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-2 sm:px-4"
//       onClick={() => setPreviewVideo(null)}
//     >
//       <div
//         className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-auto p-4 sm:p-6 relative overflow-hidden"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4">
//           <h2 className="text-lg sm:text-2xl font-bold text-gray-900 break-words">
//             {previewVideo.title}
//           </h2>
//           <button
//             onClick={() => setPreviewVideo(null)}
//             className="text-gray-500 hover:text-gray-700 text-3xl sm:text-2xl absolute sm:static top-2 right-4"
//           >
//             ×
//           </button>
//         </div>

//         {/* Video Section */}
//         {isYouTube(previewVideo.videoUrl) ? (
//           <div className="relative w-full pb-[56.25%] h-0 rounded-lg overflow-hidden">
//             <iframe
//               src={getYouTubeEmbedUrl(previewVideo.videoUrl)}
//               className="absolute top-0 left-0 w-full h-full rounded-lg"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//               title={previewVideo.title}
//             />
//           </div>
//         ) : (
//           <video
//             ref={videoRef}
//             controls
//             className="w-full rounded-lg max-h-[70vh] object-contain"
//             poster={previewVideo.thumbnail}
//           >
//             <source src={previewVideo.videoUrl} type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useUIStore } from "@/store/uiStore";
import { useEffect, useRef, useState } from "react";

export default function VideoPreviewModal() {
  const { previewVideo, setPreviewVideo } = useUIStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const adVideoRef = useRef<HTMLVideoElement>(null);
  const [showAd, setShowAd] = useState(true);
  const [adCountdown, setAdCountdown] = useState(5);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  // VAST tag URL from HilltopAds
  const VAST_TAG_URL =
    "https://guiltydance.com/dAm.F/zkd/G/NhvgZCG/UK/AeGmI9/usZdU/l/kQPXTrYC2iObTWQM5/MTT/MItsNujYY-5fN/DMkOxBNZAz";

  // Fetch and parse VAST XML
  useEffect(() => {
    if (previewVideo && showAd) {
      fetchVastAd();
    }
  }, [previewVideo]);

  const fetchVastAd = async () => {
    try {
      const response = await fetch(VAST_TAG_URL);
      const vastXML = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(vastXML, "text/xml");

      // Extract video URL from VAST XML
      const mediaFile = xmlDoc.querySelector("MediaFile");
      if (mediaFile) {
        const adVideoUrl = mediaFile.textContent?.trim();
        if (adVideoUrl && adVideoRef.current) {
          adVideoRef.current.src = adVideoUrl;
          adVideoRef.current.load();
        }
      } else {
        setAdError(true);
        setShowAd(false);
      }
    } catch (error) {
      console.error("Failed to load VAST ad:", error);
      setAdError(true);
      setShowAd(false);
    }
  };

  // Handle ad countdown
  useEffect(() => {
    if (showAd && adLoaded && adCountdown > 0) {
      const timer = setInterval(() => {
        setAdCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showAd, adLoaded, adCountdown]);

  // Play main video after ad ends
  const handleAdEnded = () => {
    setShowAd(false);
    const mainVideo = videoRef.current;
    if (mainVideo && !isYouTube(previewVideo?.videoUrl || "")) {
      mainVideo.play().catch((err) => console.warn("Autoplay blocked:", err));
    }
  };

  // Skip ad handler
  const handleSkipAd = () => {
    if (adCountdown === 0) {
      handleAdEnded();
    }
  };

  // Main video autoplay effect
  useEffect(() => {
    const video = videoRef.current;
    if (previewVideo && video && !isYouTube(previewVideo.videoUrl) && !showAd) {
      video.load();

      const handleCanPlay = () => {
        video
          .play()
          .then(() => console.log("Video playing"))
          .catch((err) => console.warn("Autoplay blocked:", err));
      };

      video.addEventListener("canplay", handleCanPlay);
      return () => {
        video.pause();
        video.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [previewVideo, showAd]);

  if (!previewVideo) return null;

  const isYouTube = (url: string) =>
    url.includes("youtube.com") || url.includes("youtu.be");

  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(
      /(?:youtube\.com\/.*v=|youtu\.be\/)([^&#?]*)/
    );
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-2 sm:px-4"
      onClick={() => setPreviewVideo(null)}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-auto p-4 sm:p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 break-words">
            {previewVideo.title}
          </h2>
          <button
            onClick={() => setPreviewVideo(null)}
            className="text-gray-500 hover:text-gray-700 text-3xl sm:text-2xl absolute sm:static top-2 right-4"
          >
            ×
          </button>
        </div>

        {/* Ad Video Section */}
        {showAd && !adError && (
          <div className="relative w-full rounded-lg overflow-hidden bg-black">
            <video
              ref={adVideoRef}
              autoPlay
              className="w-full rounded-lg max-h-[70vh] object-contain"
              onLoadedData={() => setAdLoaded(true)}
              onEnded={handleAdEnded}
              onError={() => {
                setAdError(true);
                setShowAd(false);
              }}
            >
              Your browser does not support the video tag.
            </video>

            {/* Ad Overlay */}
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
              Advertisement
            </div>

            {/* Skip Ad Button */}
            {adLoaded && (
              <button
                onClick={handleSkipAd}
                disabled={adCountdown > 0}
                className={`absolute bottom-4 right-4 px-4 py-2 rounded font-semibold text-sm transition-all ${
                  adCountdown > 0
                    ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                    : "bg-white text-black hover:bg-gray-200 cursor-pointer"
                }`}
              >
                {adCountdown > 0 ? `Skip in ${adCountdown}s` : "Skip Ad →"}
              </button>
            )}
          </div>
        )}

        {/* Main Video Section */}
        {!showAd && (
          <>
            {isYouTube(previewVideo.videoUrl) ? (
              <div className="relative w-full pb-[56.25%] h-0 rounded-lg overflow-hidden">
                <iframe
                  src={getYouTubeEmbedUrl(previewVideo.videoUrl)}
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={previewVideo.title}
                />
              </div>
            ) : (
              <video
                ref={videoRef}
                controls
                className="w-full rounded-lg max-h-[70vh] object-contain"
                poster={previewVideo.thumbnail}
              >
                <source src={previewVideo.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </>
        )}
      </div>
    </div>
  );
}

