import React, { useState } from 'react';
import './FloatingActions.css';

const FloatingActions = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Gửi event để yêu cầu MusicPlayer mở/đóng playlist
    const handleMusicClick = () => {
        window.dispatchEvent(new CustomEvent('toggleMusicPlaylist'));
    };

    // Mở link chat với admin
    const handleContactClick = () => {
        window.open('https://www.facebook.com/messages/e2ee/t/7498801963555219/', '_blank');
    };

    // Cuộn lên đầu trang
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsOpen(false);
    };
    
    // Toggle menu
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`fab-container ${isOpen ? 'open' : ''}`}>
            <div className="fab-actions">
                <div className="fab-action" onClick={handleMusicClick} title="Mở trình phát nhạc">
                    <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4V7h4V3h-6Z"></path></svg>
                </div>
                <div className="fab-action" onClick={handleContactClick} title="Liên hệ Admin">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                 <div className="fab-action" onClick={handleScrollToTop} title="Lên đầu trang">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6l-6 6l1.41 1.41z"></path></svg>
                </div>
            </div>
            <div className="fab-main" onClick={toggleMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </div>
        </div>
    );
};

export default FloatingActions; 