import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from 'react-router-dom';
import './Facemash.css';

const Facemash = () => {
  const [images, setImages] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);

  useEffect(() => {
    const initialImages = Array.from({ length: 81 }, (_, i) => ({
      id: i + 1,
      src: require(`./photos/img${i + 1}.jpg`),
      rating: 1000,
    }));
    setImages(initialImages);
    setCurrentImages(getRandomImages(initialImages));
  }, []);

  const handleClick = (winnerId) => {
    const [img1, img2] = currentImages;
    const winner = img1.id === winnerId ? img1 : img2;
    const loser = img1.id === winnerId ? img2 : img1;

    setImages(prevImages => {
      const updatedImages = prevImages.map((img) => {
        if (img.id === winner.id) {
          return { ...img, rating: img.rating + 250 };
        } else if (img.id === loser.id) {
          return { ...img, rating: Math.max(1, img.rating - 250) };
        }
        return img;
      });

      if (winnerId === currentImages[1].id) {
        const newOpponent = getRandomImage(updatedImages.filter(img => img.id !== winner.id));
        setCurrentImages([newOpponent, winner]);
      } else {
        const newOpponent = getRandomImage(updatedImages.filter(img => img.id !== winner.id));
        setCurrentImages([winner, newOpponent]);
      }

      return updatedImages;
    });
  };

  const getRandomImages = (images) => {
    const shuffled = [...images].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  };

  const getRandomImage = (images) => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  const MainPage = () => (
    <div>
      <p className="intro-text">
        <b>Were we let in for our looks? No. Will we be judged on them? Yes.</b>
      </p>
      <h1>Who's Beautiful? Click to Choose.</h1>
      <div className="img-container">
        <div className="img-wrapper">
          <img
            src={currentImages[0]?.src}
            className="img"
            onClick={() => handleClick(currentImages[0]?.id)}
            alt="First option"
          />
        </div>
        <p className="or-text">OR</p>
        <div className="img-wrapper">
          <img
            src={currentImages[1]?.src}
            className="img"
            onClick={() => handleClick(currentImages[1]?.id)}
            alt="Second option"
          />
        </div>
      </div>
      <Link to="/rankings" className="view-rankings-btn">View Rankings</Link>
    </div>
  );
  const RankingsPage = () => {
    const navigate = useNavigate();
  
    return (
      <div className="rankings">
        <div className="rankings-header">
          <button onClick={() => navigate('/')} className="back-btn">Back</button>
          <h1>Rankings</h1>
        </div>
        <table className="rankings-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Image</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {images
              .sort((a, b) => b.rating - a.rating)
              .map((img, index) => (
                <tr key={img.id}>
                  <td>{index + 1}</td>
                  <td><img src={img.src} alt={`Image ${img.id}`} className="ranking-img" /></td>
                  <td>{img.rating}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Router>
      <div>
        <div className="top">
          <h1>FACEMASH</h1>
        </div>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/rankings" element={<RankingsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Facemash;