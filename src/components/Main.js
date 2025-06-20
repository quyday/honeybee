import React, { useState } from 'react';
import ProductList from '../pages/ProductList';

function Main({ onPageChange }) {
  const [currentPage, setCurrentPage] = useState('home');

  // Khi currentPage thay đổi, gọi callback để App biết
  React.useEffect(() => {
    if (onPageChange) onPageChange(currentPage);
  }, [currentPage, onPageChange]);

  // Hàm này sẽ được truyền xuống Header/Footer để đổi trang
  return null; // Main không render gì, chỉ quản lý state và truyền lên App
}

export default Main; 