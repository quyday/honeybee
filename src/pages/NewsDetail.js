import React from 'react';
import './NewsDetail.css';
import HoneyBenefit from './NewsDetail/HoneyBenefit';
import HoneyGuide from './NewsDetail/HoneyGuide';
import HoneyWho from './NewsDetail/HoneyWho';

function NewsDetail({ news, setCurrentPage }) {
  if (news === 'honey-benefit') return <HoneyBenefit setCurrentPage={setCurrentPage} />;
  if (news === 'honey-guide') return <HoneyGuide setCurrentPage={setCurrentPage} />;
  if (news === 'honey-who') return <HoneyWho setCurrentPage={setCurrentPage} />;
  return <div style={{padding: 40, textAlign: 'center'}}>Không tìm thấy bài viết.</div>;
}

export default NewsDetail; 