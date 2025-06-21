import React, { useState, useEffect, useRef } from 'react';
import './MobileMusicPlayer.css';

function MobileMusicPlayer() {
    const [isOpen, setIsOpen] = useState(false);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const [songs, setSongs] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    const audioRef = useRef(null);
    const progressBarRef = useRef(null);
    const playlistRef = useRef(null);

    // Load songs from localStorage or use default
    useEffect(() => {
        const defaultSongs = [
            {
                title: 'Trúc Xinh',
                artist: 'Lofi Version',
                src: '/music/trucxinh.mp3',
                cover: '/meme/meme1.jpg'
            },
            {
                title: 'Mashup Track 06',
                artist: 'Quý Lowkey',
                src: '/music/track06.mp3',
                cover: '/meme/meme12.jpg'
            },
            {
                title: 'Mở lối cho em',
                artist: 'Quý Lowkey',
                src: '/music/moloi.mp3',
                cover: '/meme/meme.jpg'
            },
            {
                title: 'Thương Một Người Mất Cả Tương Lai',
                artist: 'Quý Lowkey',
                src: '/music/thuongmotnguoi.mp3',
                cover: '/meme/meme13.jpg'
            },
            {
                title: 'Thương Một Người Không Thương',
                artist: 'Quý Lowkey',
                src: '/music/thuong1nguoi0thuong.mp3',
                cover: '/meme/meme2.jpg'
            },
            {
                title: 'Tự Lau Nước Mắt Đã Khô',
                artist: 'Quý Lowkey',
                src: '/music/tulaunuocmat.mp3',
                cover: '/meme/meme3.jpg'
            },
            {
                title: 'Nay tôi buồn',
                artist: 'Quý Lowkey',
                src: '/music/naytoibuon.mp3',
                cover: '/meme/meme4.jpg'
            },
            {
                title: 'Mất kết nối',
                artist: 'Quý Lowkey',
                src: '/music/matketnoi.mp3',
                cover: '/meme/meme6.jpg'
            },
            {
                title: 'Xin lỗi vì đã xuất hiện',
                artist: 'Quý Lowkey',
                src: '/music/xinloividaxuathien.mp3',
                cover: '/meme/meme8.jpg'
            },
            {
                title: 'Về bên anh',
                artist: 'Quý Lowkey',
                src: '/music/vebenhanh.mp3',
                cover: '/meme/meme14.jpg'
            },
            {
                title: 'Tìm em',
                artist: 'Quý Lowkey',
                src: '/music/timem.mp3',
                cover: '/meme/meme10.jpg'
            },
            {
                title: 'Hoa nở bên đường',
                artist: 'Quý Lowkey',
                src: '/music/hoanobenduong.mp3',
                cover: '/meme/meme11.jpg'
            },
            {
                title: 'Mưa rơi vào phòng',
                artist: 'Quý Lowkey',
                src: '/music/muaroivaophong.mp3',
                cover: '/meme/meme7.jpg'
            },
            {
                title: 'chiếc khăn gió ấm',
                artist: 'Quý Lowkey',
                src: '/music/chieckhangioam.mp3',
                cover: '/meme/meme9.jpg'
            },
            {
                title: 'Hết Thương Cạn Nhớ',
                artist: 'Quý Lowkey',
                src: '/music/hethuongcannho.mp3',
                cover: '/meme/meme5.jpg'
            }
        ];

        const storedMusic = localStorage.getItem('musicList');
        const playlist = storedMusic && JSON.parse(storedMusic).length > 0 ? JSON.parse(storedMusic) : defaultSongs;
        setSongs(playlist);
    }, []);

    // Listen for toggle event
    useEffect(() => {
        const handleToggle = () => {
            setIsOpen(!isOpen);
        };

        window.addEventListener('toggleMobileMusicPlayer', handleToggle);
        return () => {
            window.removeEventListener('toggleMobileMusicPlayer', handleToggle);
        };
    }, [isOpen]);

    // Audio event handlers
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const timeUpdate = () => setCurrentTime(audio.currentTime);
        const loadedMeta = () => setDuration(audio.duration);
        const songEnd = () => {
            setCurrentSongIndex((prev) => (prev + 1) % songs.length);
        };

        audio.addEventListener('timeupdate', timeUpdate);
        audio.addEventListener('loadedmetadata', loadedMeta);
        audio.addEventListener('ended', songEnd);

        return () => {
            audio.removeEventListener('timeupdate', timeUpdate);
            audio.removeEventListener('loadedmetadata', loadedMeta);
            audio.removeEventListener('ended', songEnd);
        };
    }, [songs.length]);

    // Playback logic
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Play error:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            audioRef.current.muted = isMuted;
        }
    }, [volume, isMuted]);

    useEffect(() => {
        if (audioRef.current && songs.length > 0) {
            audioRef.current.src = songs[currentSongIndex]?.src;
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Play error on song change:", e));
            }
        }
    }, [currentSongIndex, songs, isPlaying]);

    const handlePrev = () => setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
    const handleNext = () => setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    const togglePlayPause = () => setIsPlaying(prev => !prev);
    const closePlayer = () => setIsOpen(false);
    const togglePlaylist = () => setShowPlaylist(prev => !prev);

    const selectSong = (index) => {
        setCurrentSongIndex(index);
        setIsPlaying(true);
        setShowPlaylist(false);
    };

    const handleProgressSeek = (e) => {
        if (progressBarRef.current && audioRef.current) {
            const newTime = (e.nativeEvent.offsetX / progressBarRef.current.offsetWidth) * duration;
            audioRef.current.currentTime = newTime;
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (newVolume > 0 && isMuted) {
            setIsMuted(false);
        }
    };

    const toggleMute = () => setIsMuted(prev => !prev);

    const getVolumeIcon = () => {
        if (isMuted || volume === 0) return <svg viewBox="0 0 24 24"><path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4a1 1 0 00-1 1v4a1 1 0 001 1h3l5 5v-6.59l4.18 4.18c-.49.37-1.02.68-1.6.91-.71.28-1.45.43-2.2.43a4.34 4.34 0 01-1.33-.21 4.34 4.34 0 01-2.4-2.4 4.58 4.58 0 01-.2-1.32H9c0 .79.18 1.57.52 2.27s.87 1.28 1.52 1.74c.65.46 1.42.79 2.22.95.8.17 1.63.17 2.44-.02.8-.18 1.55-.55 2.2-1.07l2.05 2.05a.996.996 0 101.41-1.41L5.05 3.63a.996.996 0 00-1.42 0zM19 12c0 .82-.15 1.61-.43 2.34l-1.52-1.52c.1-.47.15-.96.15-1.45 0-1.34-.53-2.6-1.46-3.54S14.34 7 13 7c-.48 0-.95.05-1.4.15L10.08 5.63A8.46 8.46 0 0119 12zm-8.71-6.1L12 7.17V4l-5 5H3V9h3.29l-3.02-3.02a.996.996 0 010-1.41.996.996 0 011.41 0L10.3 3.9z"></path></svg>;
        if (volume < 0.5) return <svg viewBox="0 0 24 24"><path d="M14.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"></path></svg>;
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9v6h4l5 5V4L7 9H3z"/>
                <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
        );
    };

    if (!songs.length) {
        return null;
    }

    const currentSong = songs[currentSongIndex];

    return (
        <div className={`mobile-music-player ${isOpen ? 'open' : ''}`}>
            <div className={`mobile-player-card ${showPlaylist ? 'playlist-mode' : ''}`}>
                <div className="mobile-player-header">
                    <span>Trình phát nhạc</span>
                    <div className="mobile-player-actions">
                        <button className="mobile-playlist-toggle" onClick={togglePlaylist} title="Danh sách phát">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="8" y1="6" x2="21" y2="6"></line>
                                <line x1="8" y1="12" x2="21" y2="12"></line>
                                <line x1="8" y1="18" x2="21" y2="18"></line>
                                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                <line x1="3" y1="18" x2="3.01" y2="18"></line>
                            </svg>
                        </button>
                        <button className="mobile-player-close" onClick={closePlayer}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
                
                {!showPlaylist ? (
                    <div className="mobile-player-body">
                        <img 
                            src={currentSong.cover} 
                            alt={currentSong.title} 
                            className={`mobile-album-art ${isPlaying ? 'playing' : ''}`} 
                        />
                        
                        <h3 className="mobile-song-title">{currentSong.title}</h3>
                        <p className="mobile-song-artist">{currentSong.artist}</p>
                        
                        <div className="mobile-progress-container">
                            <div 
                                className="mobile-progress-bar-wrapper" 
                                ref={progressBarRef}
                                onClick={handleProgressSeek}
                            >
                                <div 
                                    className="mobile-progress-bar" 
                                    style={{ width: `${(currentTime / duration) * 100}%` }}
                                ></div>
                            </div>
                            <div className="mobile-time-display">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>
                        
                        <div className="mobile-controls">
                            <button className="mobile-control-button" onClick={handlePrev}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path>
                                </svg>
                            </button>
                            
                            <button className="mobile-control-button play" onClick={togglePlayPause}>
                                {isPlaying ? (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M14 19h4V5h-4M6 19h4V5H6v14Z"></path>
                                    </svg>
                                ) : (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 19V5l11 7l-11 7Z"></path>
                                    </svg>
                                )}
                            </button>
                            
                            <button className="mobile-control-button" onClick={handleNext}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M16 6h2v12h-2zm-4.5 6l-8.5 6V6z"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <div className="mobile-volume-control">
                            <button className="mobile-control-button" onClick={toggleMute}>
                                {getVolumeIcon()}
                            </button>
                            <input 
                                type="range" 
                                className="mobile-volume-slider"
                                min="0" max="1" step="0.01"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="mobile-playlist-container">
                        <div className="mobile-playlist-header">
                            <h4>Danh sách phát ({songs.length} bài)</h4>
                        </div>
                        <div className="mobile-playlist-list" ref={playlistRef}>
                            {songs.map((song, index) => (
                                <div 
                                    key={index} 
                                    className={`mobile-playlist-item ${index === currentSongIndex ? 'active' : ''}`}
                                    onClick={() => selectSong(index)}
                                >
                                    <img src={song.cover} alt={song.title} className="mobile-playlist-cover" />
                                    <div className="mobile-playlist-info">
                                        <h5 className="mobile-playlist-title">{song.title}</h5>
                                        <p className="mobile-playlist-artist">{song.artist}</p>
                                    </div>
                                    {index === currentSongIndex && (
                                        <div className="mobile-playing-indicator">
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <audio ref={audioRef} />
        </div>
    );
}

export default MobileMusicPlayer; 