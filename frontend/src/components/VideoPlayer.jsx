import { useRef, useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateProgress } from "../api/progressApi";

const VideoPlayer = ({ courseId, videoUrl, videoLength }) => {
  const videoRef = useRef();
  const { user } = useContext(AuthContext);
  const [lastSavedPercent, setLastSavedPercent] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = async () => {
      const percent = Math.floor((video.currentTime / videoLength) * 100);

      if (percent - lastSavedPercent >= 5 && user?.token) {
        try {
          await updateProgress(user.token, { courseId, progressPercent: percent });
          setLastSavedPercent(percent);
        } catch (err) {
          console.error("Failed to save video progress:", err);
        }
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [lastSavedPercent, courseId, videoLength, user]);

  return <video ref={videoRef} src={videoUrl} controls />;
};

export default VideoPlayer;
