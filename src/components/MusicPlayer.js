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
    title: 'Acoustic Breeze',
    artist: 'Bensound',
    src: 'https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3',
    cover: '/images/wallpaperflare-com-wallpaper-1.jpg' 
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
      </div>
      <audio ref={audioRef} src={currentSong.src} onEnded={handleEnded} />
    </div>
  );
}

export default MusicPlayer; 