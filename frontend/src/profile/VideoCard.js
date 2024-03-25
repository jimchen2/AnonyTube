import React, { useEffect, useState } from 'react';
import PCVideoCard from './PCVideoCard';
import MobileVideoCard from './MobileVideoCard';

const VideoCard = ({ video }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); 

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile ? <MobileVideoCard video={video} /> : <PCVideoCard video={video} />;
};

export default VideoCard;