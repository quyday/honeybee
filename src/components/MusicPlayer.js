import React, { useState, useRef, useEffect } from 'react';
import './MusicPlayer.css';

function MusicPlayer() {
    const [songs, setSongs] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isAutoplay, setIsAutoplay] = useState(true);

    const audioRef = useRef(null);

    useEffect(() => {
        const defaultSongs = [
            {
                title: 'Trúc Xinh',
                artist: 'Lofi Version',
                src: '/music/trucxinh.mp3',
                cover: '/meme/meme1.jpg'
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
                title: 'Hết Thuơng Cạn Nhớ',
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
        const storedMusic = localStorage.getItem('musicList');
        const playlist = storedMusic ? JSON.parse(storedMusic) : defaultSongs;
        setSongs(playlist);
    }, []);

    // Effect to handle audio events
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };
        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };
        const handleSongEnd = () => {
            if (isAutoplay) {
                handleNext();
            } else {
                setIsPlaying(false);
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleSongEnd);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleSongEnd);
        };
    }, [songs, currentSongIndex, isAutoplay]);

    // Effect to handle external toggle event for mobile
    useEffect(() => {
        const togglePlaylist = () => {
            setIsOpen(prev => !prev);
        };
        window.addEventListener('toggleMusicPlaylist', togglePlaylist);
        return () => {
            window.removeEventListener('toggleMusicPlaylist', togglePlaylist);
        };
    }, []);

    const togglePlayPause = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(error => console.error("Audio play failed:", error));
        }
        setIsPlaying(!isPlaying);
    };

    const handleNext = () => {
        setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
        setIsPlaying(true);
    };

    const handlePrev = () => {
        setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
        setIsPlaying(true);
    };

    const toggleAutoplay = () => {
        setIsAutoplay(prev => !prev);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
            if (newVolume > 0 && isMuted) {
                audioRef.current.muted = false;
                setIsMuted(false);
            }
        }
    };
    
    const toggleMute = () => {
        if(audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    useEffect(() => {
        if (audioRef.current && songs.length > 0) {
            audioRef.current.src = songs[currentSongIndex]?.src;
            if (isPlaying) {
                audioRef.current.play().catch(error => console.error("Audio play failed on song change:", error));
            }
        }
    }, [currentSongIndex, songs, isPlaying]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const getVolumeIcon = () => {
        if (isMuted || volume === 0) {
            return <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M16.5 12A4.5 4.5 0 0 0 14 7.97v4.07a4.5 4.5 0 0 0 2.5-.04zM4 9v6h4l5 5V4L8 9H4zm11.5 1.5c0-.17-.02-.33-.04-.5v-2.02c1.37.58 2.24 2.15 2.04 4.06c-.18 1.73-1.46 3.19-3.19 3.48c-.2.03-.4.05-.61.05a4.5 4.5 0 0 1-1.39-.24l1.54 1.54A6.5 6.5 0 0 0 20.5 9c0-.28-.03-.56-.07-.83l-1.5 1.5c.02.11.04.22.04.33z"></path></svg>;
        }
        if (volume < 0.5) {
            return <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm7.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"></path></svg>;
        }
        return <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>;
    };

    if (!songs.length) {
        return null;
    }

    const currentSong = songs[currentSongIndex];

    return (
        <div className={`music-player ${isOpen ? 'open' : ''}`}>
            <div className="music-player-icon" onClick={() => setIsOpen(!isOpen)}>
                <svg width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4V7h4V3h-6Z"></path></svg>
            </div>

            <audio ref={audioRef} src={currentSong.src} />

            <div className="music-player-playlist">
                <div className="playlist-header">
                    <h3>Danh sách phát</h3>
                    <button className="close-playlist" onClick={() => setIsOpen(false)}>×</button>
                </div>
                <div className="current-song-info">
                    <img src={currentSong.cover} alt={currentSong.title} className="song-cover" />
                    <div className="song-details">
                        <h4>{currentSong.title}</h4>
                        <p>{currentSong.artist}</p>
                    </div>
                </div>

                <div className="controls">
                    <button onClick={handlePrev}>
                        <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path></svg>
                    </button>
                    <button onClick={togglePlayPause} className="play-pause-btn">
                        {isPlaying ?
                            <svg width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M14 19h4V5h-4M6 19h4V5H6v14Z"></path></svg> :
                            <svg width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M8 19V5l11 7l-11 7Z"></path></svg>
                        }
                    </button>
                    <button onClick={handleNext}>
                        <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M16 6h2v12h-2zm-4.5 6l-8.5 6V6z"></path></svg>
                    </button>
                </div>

                <div className="bottom-controls">
                    <button onClick={toggleAutoplay} className={`control-btn autoplay-btn ${isAutoplay ? 'active' : ''}`} title="Tự động phát">
                       <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17 17H7v-3l-4 4l4 4v-3h12v-6h-2v4zm-6-1-4-4l4-4v3h12v2H11v3z"></path></svg>
                    </button>
                     <div className="volume-control">
                        <button onClick={toggleMute} className="control-btn volume-btn">
                            {getVolumeIcon()}
                        </button>
                        <div className="volume-slider-container">
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
                </div>

                <div className="progress-bar-container">
                    <span>{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={(e) => audioRef.current.currentTime = e.target.value}
                        className="progress-bar"
                    />
                    <span>{formatTime(duration)}</span>
                </div>

                <ul className="playlist">
                    {songs.map((song, index) => (
                        <li
                            key={index}
                            className={`playlist-item ${index === currentSongIndex ? 'active' : ''}`}
                            onClick={() => {
                                setCurrentSongIndex(index);
                                setIsPlaying(true);
                            }}
                        >
                            <img src={song.cover} alt={song.title} className="playlist-item-cover" />
                            <div className="playlist-item-info">
                                <h5>{song.title}</h5>
                                <p>{song.artist}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default MusicPlayer; 
