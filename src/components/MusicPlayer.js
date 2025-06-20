import React, { useState, useRef, useEffect } from 'react';
import './MusicPlayer.css';

const songs = [
  // ... các bài khác
  {
    title: 'Truc xinh',
    artist: 'Quý Lowkey',
    src: '/music/trucxinh.mp3',
    cover: '/meme/meme1.jpg'
  },
   {
    title: 'Nay tôi buồn',
    artist: 'Quý Lowkey',
    src: '/music/naytoibuon.mp3',
    cover: '/meme/meme2.jpg'
  },
   {
    title: 'Tự lau nước mắt',
    artist: 'Quý Lowkey',
    src: '/music/tulaunuocmat.mp3',
    cover: '/meme/meme3.jpg'
  },
   {
    title: 'Thương 1 người không thương',
    artist: 'Quý Lowkey',
    src: '/music/thuong1nguoi0thuong.mp3',
    cover: '/meme/meme4.jpg'
  },
  {
    title: 'Het thuong can nho',
    artist: 'Quý Lowkey',
    src: '/music/hethuongcannho.mp3',
    cover: '/meme/meme5.jpg' 
  },
  {
    title: 'Sunny',
    artist: 'Bensound',
    src: 'https://www.bensound.com/bensound-music/bensound-sunny.mp3',
    cover: '/images/wallpaperflare-com-wallpaper-2.jpg'
  },
  {
    title: 'Creative Minds',
    artist: 'Bensound',
    src: 'https://www.bensound.com/bensound-music/bensound-creativeminds.mp3',
    cover: '/images/wallpaperflare-com-wallpaper-7.jpg'
  }
];

function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isAutoplayOn, setIsAutoplayOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };
  
  const handleEnded = () => {
    if (isAutoplayOn) {
      playNext();
    } else {
      setIsPlaying(false);
    }
  };

  const toggleAutoplay = () => {
    setIsAutoplayOn(!isAutoplayOn);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>;
    }
    if (volume < 0.5) {
      return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>;
    }
    return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>;
  };

  const togglePlayerVisibility = () => {
    setIsPlayerVisible(!isPlayerVisible);
  };
  
  if (!isPlayerVisible) {
    return (
      <button className="music-toggle-button" onClick={togglePlayerVisibility}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
      </button>
    );
  }

  return (
    <div className="music-player">
       <button className="music-close-button" onClick={togglePlayerVisibility}>×</button>
      <div className="song-info">
        <img src={currentSong.cover} alt={currentSong.title} className="song-cover" />
        <div>
          <p className="song-title">{currentSong.title}</p>
          <p className="song-artist">{currentSong.artist}</p>
        </div>
      </div>
      <div className="controls">
        <button onClick={playPrev}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
        </button>
        <button onClick={togglePlay}>
          {isPlaying ? 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> : 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          }
        </button>
        <button onClick={playNext}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
        </button>
        <button onClick={toggleAutoplay} className={`autoplay-button ${isAutoplayOn ? 'active' : ''}`} title={isAutoplayOn ? "Tự động chuyển bài: Bật" : "Tự động chuyển bài: Tắt"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
        </button>
        <button onClick={toggleMute} className="mute-button" title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}>
            {getVolumeIcon()}
        </button>
        <div className="volume-control">
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="volume-slider"
            />
        </div>
      </div>
      <audio ref={audioRef} src={currentSong.src} onEnded={handleEnded} />
    </div>
  );
}

export default MusicPlayer; 
