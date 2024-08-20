// import { useState, useEffect, useRef } from "react";
// import { Image, Button } from "antd";
// import { IoPlay, IoPause } from "react-icons/io5";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import WaveSurfer from "wavesurfer.js";

// const API_URL = import.meta.env.VITE_API_URL;

// const SongDetail = () => {
//   const { songId } = useParams();
//   const [songData, setSongData] = useState(null);
//   const [playing, setPlaying] = useState(false);
//   const audioRef = useRef(null);
//   const waveformRef = useRef(null);
//   const wavesurfer = useRef(null);

//   useEffect(() => {
//     const fetchSong = async () => {
//       try {
//         const response = await axios.get(`${API_URL}song/${songId}`);
//         setSongData(response.data);
//       } catch (error) {
//         console.error("Failed to fetch song data:", error);
//       }
//     };

//     if (songId) {
//       fetchSong();
//     }
//   }, [songId]);

//   useEffect(() => {
//     if (songData) {
//       wavesurfer.current = WaveSurfer.create({
//         container: waveformRef.current,
//         waveColor: "white",
//         progressColor: "green",
//         cursorColor: "navy",
//         barWidth: 3,
//         barRadius: 10,
//         responsive: true,
//         height: 80,
//         // Remove these options if you want to use the default UI
//         // hideScrollbar: true,
//         // hideCursor: true,
//       });

//       wavesurfer.current.load(songData.link);

//       wavesurfer.current.on("ready", function () {
//         audioRef.current = wavesurfer.current;
//       });

//       wavesurfer.current.on("play", function () {
//         setPlaying(true);
//       });

//       wavesurfer.current.on("pause", function () {
//         setPlaying(false);
//       });

//       return () => wavesurfer.current.destroy();
//     }
//   }, [songData]);

//   const togglePlayPause = () => {
//     wavesurfer.current.playPause();
//   };

//   return (
//     songData && (
//       <div
//         className="song-detail-container"
//         style={{ background: backgroundColor }}
//       >
//         <div className="song-detail-header">
//           <div className="song-detail-info">
//             <Button
//               icon={playing ? <IoPause /> : <IoPlay />}
//               onClick={togglePlayPause}
//               className="play-pause-btn"
//             />
//             <span className="song-name">{songData.name}</span>
//           </div>
//           <Image
//             src={songData.image}
//             className="song-image"
//           />
//         </div>

//         <div className="audio-wave-container" ref={waveformRef}>
//           {/* WaveSurfer will be rendered here */}
//         </div>
//       </div>
//     )
//   );
// };

// export default SongDetail;

import { useState, useEffect, useRef } from "react";
import { Image as AntImage, Button } from "antd";
import { IoPlay, IoPause } from "react-icons/io5";
import axios from "axios";
import { useParams } from "react-router-dom";
import WaveSurfer from "wavesurfer.js";
import ColorThief from "colorthief";

const API_URL = import.meta.env.VITE_API_URL;

const SongDetail = () => {
  const { songId } = useParams();
  const [songData, setSongData] = useState(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [backgroundColor, setBackgroundColor] = useState("");
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await axios.get(`${API_URL}song/${songId}`);
        setSongData(response.data);
      } catch (error) {
        console.error("Failed to fetch song data:", error);
      }
    };

    if (songId) {
      fetchSong();
    }
  }, [songId]);

  useEffect(() => {
    if (songData) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "white",
        progressColor: "#4f6f52",
        cursorColor: "navy",
        barWidth: 3,
        barRadius: 10,
        responsive: true,
        height: 80,
        barMinHeight: 1,
      });

      wavesurfer.current.load(songData.link);

      wavesurfer.current.on("ready", function () {
        audioRef.current = wavesurfer.current;
        setDuration(formatTime(wavesurfer.current.getDuration()));
      });

      wavesurfer.current.on("audioprocess", function () {
        setCurrentTime(formatTime(wavesurfer.current.getCurrentTime()));
      });

      wavesurfer.current.on("ready", function () {
        audioRef.current = wavesurfer.current;
      });

      wavesurfer.current.on("play", function () {
        setPlaying(true);
      });

      wavesurfer.current.on("pause", function () {
        setPlaying(false);
      });

      const img = document.createElement("img");
      img.crossOrigin = "Anonymous";
      img.src = songData.image;
      img.onload = () => {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 2);
        const gradient = `linear-gradient(
          135deg, 
          rgb(${palette[1].join(",")}), 
          rgba(${palette[1].join(",")}, 0.7) 30%, 
          rgba(${palette[0].join(",")}, 0.7) 70%, 
          rgb(${palette[0].join(",")})
        )`;
        setBackgroundColor(gradient);
      };

      return () => wavesurfer.current.destroy();
    }
  }, [songData]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlayPause = () => {
    wavesurfer.current.playPause();
  };

  return (
    songData && (
      <div
        className="song-detail-container"
        style={{ background: backgroundColor }}
      >
        <div className="song-detail-header">
          <div className="song-detail-info">
            <Button
              icon={playing ? <IoPause /> : <IoPlay />}
              onClick={togglePlayPause}
              className="play-pause-btn"
            />
            <span className="song-name bg-black text-white">
              {songData.name}
            </span>
          </div>
          <AntImage
            src={songData.image}
            className="song-image"
            crossOrigin="anonymous"
          />
        </div>
        <div className="audio-control-container">
          <span className="current-time">{currentTime}</span>
          <div className="audio-wave-container" ref={waveformRef}></div>
          <span className="total-time">{duration}</span>
        </div>

        {/* <div className="audio-wave-container" ref={waveformRef}>
        </div> */}
      </div>
    )
  );
};

export default SongDetail;
