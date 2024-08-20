import { useState, useEffect, useRef } from "react";
import { Slider, Button, Image } from "antd";
import { StepBackwardOutlined, StepForwardOutlined } from "@ant-design/icons";
import axios from "axios";
import PropTypes from "prop-types";
import { IoPause, IoPlay } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const MusicPlayer = ({ songId, onPrev, onNext }) => {
  const navigate = useNavigate();
  const [songData, setSongData] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = songData?.link;
      audioRef.current.play();
      setPlaying(true);
    }
  }, [songData]);

  const togglePlayPause = () => {
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleSliderChange = (value) => {
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    songData && (
      <div className="music-player rounded-t-2xl">
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
        <div className="controls">
          <Button icon={<StepBackwardOutlined />} onClick={onPrev} />
          <Button
            icon={playing ? <IoPause /> : <IoPlay />}
            onClick={togglePlayPause}
          />
          <Button icon={<StepForwardOutlined />} onClick={onNext} />
        </div>

        <span>{formatTime(currentTime)}</span>
        <Slider
          max={duration}
          value={currentTime}
          onChange={handleSliderChange}
          style={{ width: "300px" }}
        />
        <span>{formatTime(duration)}</span>

        <div className="music-player-info">
          <Image src={songData.image} width={50} className="cursor-pointer" />
          <span
            onClick={() => navigate(`/song/${songData.id}`)}
            className="cursor-pointer"
          >
            {songData.name}
          </span>
        </div>
      </div>
    )
  );
};

MusicPlayer.propTypes = {
  songId: PropTypes.string.isRequired,
  songs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string,
      link: PropTypes.string,
    })
  ).isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default MusicPlayer;
