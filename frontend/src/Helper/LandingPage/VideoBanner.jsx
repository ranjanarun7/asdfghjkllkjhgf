import React, { useState, useRef } from "react";
import myvideo from "../../assets/video1.mp4";
import { Play, Pause } from "lucide-react";

function VideoBanner() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = () => {
    setIsPlaying(true);
    setTimeout(() => {
      videoRef.current?.play();
    }, 200);
  };

  const handlePauseToggle = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section className="bg-white text-green-900">
      <div className="relative min-h-screen flex items-center mr-2">
        
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-8xl mx-auto px-10 grid grid-cols-1 md:grid-cols-2 gap-10 py-20">

          {/* LEFT SIDE */}
          <div>
            <h1 className="text-5xl font-bold leading-tight">
              Experience Jharkhand Like <br /> Never Before
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-gray-400">
              Immerse yourself in the rich traditions of the Santhal and Munda
              tribes. Dance to the rhythm of the mandar, taste the earthy
              flavors of dhuska, and let the waterfalls wash away your worries.
            </p>

            {/* PLAY BUTTON ALWAYS SHOWS CORRECT ICON */}
            <button
              onClick={isPlaying ? handlePauseToggle : handlePlay}
              className="mt-8 flex items-center gap-3 font-semibold rounded-2xl border border-white p-2 hover:bg-gray-400 hover:text-white transition py-3"
            >
              <span className="w-12 h-12 rounded-full border border-white flex items-center justify-center">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </span>
              {isPlaying ? "Pause Video" : "Watch Full Documentary"}
            </button>
          </div>

          {/* RIGHT SIDE — VIDEO */}
          <div className="relative rounded-xl overflow-hidden shadow-xl h-80 md:h-96 bg-black">
            
            {/* Before Play → Still image from video */}
            {!isPlaying && (
              <video className="w-full h-full object-cover" src={myvideo} />
            )}

            {/* After Play → Video */}
            {isPlaying && (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  src={myvideo}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                />

                <button
                  onClick={handlePauseToggle}
                  className="absolute bottom-4 left-4 bg-black/60 text-white p-3 rounded-full backdrop-blur-md"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default VideoBanner;
