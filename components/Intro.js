import { useState, useEffect, useRef } from 'react';

/**
 * Fullscreen intro video component
 * Plays the intro video and calls onComplete when finished
 */
export default function IntroVideo({ onComplete }) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const videoRef = useRef(null);

  console.log('IntroVideo component mounted');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Auto-play when component mounts and video is loaded
    const handleCanPlay = () => {
      setIsVideoLoaded(true);
      video.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error('Auto-play failed:', error);
        // If auto-play fails, show play button
      });
    };

    // Handle video time update - redirect 1 second before end
    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const duration = video.duration;
      
      // Check if we're 1 second before the end
      if (duration && currentTime >= duration - 1) {
        console.log('Video about to end - redirecting to main app');
        // Start fade out animation
        setIsFadingOut(true);
        // Complete transition after fade animation
        setTimeout(() => {
          onComplete();
        }, 500);
        
        // Remove event listener to prevent multiple triggers
        video.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };

    // Handle video error
    const handleVideoError = () => {
      console.error('Video failed to load');
      // Skip intro if video fails
      onComplete();
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('error', handleVideoError);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('error', handleVideoError);
    };
  }, [onComplete]);

  // Skip intro function for manual skip
  const handleSkipIntro = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  // Manual play function if auto-play fails
  const handleManualPlay = () => {
    const video = videoRef.current;
    if (video) {
      video.play().then(() => {
        setIsPlaying(true);
      });
    }
  };

  return (
    <div className={`fixed inset-0 z-50 bg-black transition-opacity duration-1000 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Video container */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
        >
          <source src="/Intro.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Loading overlay */}
        {!isVideoLoaded && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <div className="text-white text-xl">Loading...</div>
          </div>
        )}

        {/* Play button overlay (if auto-play fails) */}
        {isVideoLoaded && !isPlaying && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <button
              onClick={handleManualPlay}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-6 transition-all duration-300"
            >
              <svg
                className="w-12 h-12 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        )}

        {/* Skip button */}
        {isPlaying && (
          <div className="absolute top-4 right-4">
            <button
              onClick={handleSkipIntro}
              className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white px-4 py-2 rounded-lg transition-all duration-300"
            >
              Skip Intro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
