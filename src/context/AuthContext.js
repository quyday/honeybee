import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Hàm đồng bộ user từ localStorage
    const syncUserFromLocalStorage = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
        setLoading(false);
        // Lắng nghe sự kiện thay đổi localStorage (giữa các tab)
        const handleStorage = (e) => {
            if (e.key === 'user') {
                syncUserFromLocalStorage();
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    // Khởi tạo tài khoản admin cứng nếu chưa có
    if (typeof window !== 'undefined') {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        
        // --- Cập nhật hoặc tạo tài khoản Admin ---
        const adminEmail = 'admin1@gmail.com';
        let adminUser = users.find(u => u.email && u.email.toLowerCase() === adminEmail);
        
        if (!adminUser) {
            // Nếu không tìm thấy, tạo mới
            adminUser = {
                name: 'Admin Công Quý',
                email: adminEmail,
                password: 'Admin123',
                phone: '0387231205',
                address: 'Nghĩa Chỉ, Tiên Du, Bắc Ninh',
                avatar: '/avt/avt-admin.jpg',
                role: 'admin'
            };
            users.push(adminUser);
        } else if (!adminUser.avatar) {
            // Nếu tìm thấy nhưng chưa có avatar, cập nhật
            adminUser.avatar = '/avt/avt-admin.jpg';
        }

        // --- Cập nhật hoặc tạo tài khoản User ---
        const userEmail = 'user1@gmail.com';
        let normalUser = users.find(u => u.email && u.email.toLowerCase() === userEmail);

        if (!normalUser) {
            // Nếu không tìm thấy, tạo mới
            normalUser = {
                name: 'Nguyễn Văn A',
                email: userEmail,   
                password: 'User123',
                phone: '0987654321',
                address: 'Hà Nội, Việt Nam',
                avatar: '/avt/avt-user.jpg',
                role: 'user'
            };
            users.push(normalUser);
        } else if (!normalUser.avatar) {
            // Nếu tìm thấy nhưng chưa có avatar, cập nhật
            normalUser.avatar = '/avt/avt-user.jpg';
        }
        
        localStorage.setItem('users', JSON.stringify(users));
    }

    const login = async (email, password) => {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const foundUser = users.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('user', JSON.stringify(foundUser));
            return { success: true };
        }
        return { success: false, error: 'Email hoặc mật khẩu không đúng!' };
    };

    const register = async ({ name, email, password, phone, address, avatar }) => {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        // So sánh email không phân biệt hoa thường
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, error: 'Email đã tồn tại!' };
        }
        const newUser = { name, email, password, phone, address, avatar, role: 'user' };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        return { success: true };
    };

    const logout = () => {
        // Chỉ xóa user, giữ lại thông tin admin
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        // Giỏ hàng sẽ được CartContext tự động xóa khi user = null
    };

    const updateProfile = async (userData) => {
        try {
            const response = await api.put('/users/profile', userData);
            const updatedUser = { ...user, ...response.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.error || 'Cập nhật thất bại' 
            };
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        setUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 