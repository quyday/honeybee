import React, { useState, useRef, useEffect, useCallback } from 'react';
import './MusicPlayer.css';

function MusicPlayer() {
    const [songs, setSongs] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPlaylistOpen, setPlaylistOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isAutoplay, setIsAutoplay] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const audioRef = useRef(null);
    const progressBarRef = useRef(null);

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
                title: 'Mở lối cho em',
                artist: 'Quý Lowkey',
                src: '/music/moloi.mp3',
                cover: '/meme/meme.jpg'
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
                cover: '/meme/meme9.jpg'
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

    const handleNext = useCallback(() => {
        setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    }, [songs.length]);

    // --- CONTROLS ---
    const handlePrev = () => setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
    const togglePlayPause = () => setIsPlaying(prev => !prev);
    const selectSong = (index) => {
        setCurrentSongIndex(index);
        setIsPlaying(true);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (newVolume > 0 && isMuted) {
            setIsMuted(false);
        }
    };
    const toggleMute = () => setIsMuted(prev => !prev);

    // --- AUDIO EVENT HANDLING ---
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const timeUpdate = () => setCurrentTime(audio.currentTime);
        const loadedMeta = () => setDuration(audio.duration);
        const songEnd = () => {
            if (isAutoplay) {
                handleNext();
            } else {
                setIsPlaying(false);
            }
        };

        audio.addEventListener('timeupdate', timeUpdate);
        audio.addEventListener('loadedmetadata', loadedMeta);
        audio.addEventListener('ended', songEnd);

        return () => {
            audio.removeEventListener('timeupdate', timeUpdate);
            audio.removeEventListener('loadedmetadata', loadedMeta);
            audio.removeEventListener('ended', songEnd);
        };
    }, [isAutoplay, handleNext]);
    
    // --- PLAYBACK LOGIC ---
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

    // Handle progress seek
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
        <div className={`vertical-music-player ${isPlaylistOpen ? 'playlist-open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
            <audio ref={audioRef} />

            {/* Collapsed View / Main Bar */}
            <div className="player-bar">
                <button className="collapse-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
                     <svg viewBox="0 0 24 24">
                        {isCollapsed ? <path d="M11 20.59V3.41c0-.89-1.08-1.34-1.71-.71L3.7 8.29c-.39.39-.39 1.02 0 1.41l5.59 5.59c.63.63 1.71.19 1.71-.7z"></path> : <path d="M13 3.41v17.18c0 .89 1.08 1.34 1.71.71l5.59-5.59c.39-.39.39-1.02 0-1.41L14.71 8.71c-.63-.62-1.71-.18-1.71.71z"></path>}
                     </svg>
                </button>
                <img src={currentSong.cover} alt={currentSong.title} className={`album-cover ${isPlaying ? 'playing' : ''}`} />
                <div className="song-info-vertical">
                    <p className="title">{currentSong.title}</p>
                    <p className="artist">{currentSong.artist}</p>
                </div>
                <div className="main-controls">
                    <button onClick={handlePrev} className="control-button">
                        <svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path></svg>
                    </button>
                    <button onClick={togglePlayPause} className="control-button play-button">
                        {isPlaying ? <svg viewBox="0 0 24 24"><path d="M14 19h4V5h-4M6 19h4V5H6v14Z"></path></svg> : <svg viewBox="0 0 24 24"><path d="M8 19V5l11 7l-11 7Z"></path></svg>}
                    </button>
                    <button onClick={handleNext} className="control-button">
                       <svg viewBox="0 0 24 24"><path d="M16 6h2v12h-2zm-4.5 6l-8.5 6V6z"></path></svg>
                    </button>
                </div>
                <button className="playlist-toggle" onClick={() => setPlaylistOpen(!isPlaylistOpen)}>
                    <svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>
                </button>
            </div>

            {/* Expanded Playlist View */}
            <div className="playlist-container">
                <div className="playlist-header">
                    <h4>Danh sách phát</h4>
                </div>
                <ul className="playlist-vertical">
                    {songs.map((song, index) => (
                        <li key={index} className={`playlist-item-vertical ${index === currentSongIndex ? 'active' : ''}`} onClick={() => selectSong(index)}>
                            <img src={song.cover} alt={song.title} className="playlist-cover" />
                            <div className="playlist-song-details">
                                <p className="title">{song.title}</p>
                                <p className="artist">{song.artist}</p>
                            </div>
                            {index === currentSongIndex && (
                                <div className="playing-indicator">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                <div className="playlist-footer">
                    <button onClick={() => setIsAutoplay(prev => !prev)} className={`control-button autoplay-button ${isAutoplay ? 'active' : ''}`} title={isAutoplay ? 'Tắt tự động chuyển bài' : 'Bật tự động chuyển bài'}>
                         <svg viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"></path></svg>
                    </button>
                    <div className="volume-control">
                        <button onClick={toggleMute} className="control-button">
                            {getVolumeIcon()}
                        </button>
                        <input 
                            type="range" 
                            className="volume-slider"
                            min="0" max="1" step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MusicPlayer; 