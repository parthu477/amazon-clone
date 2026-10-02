import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './HeroBanner.css';

const BANNERS = [
  {
    id: 1,
    title: "Upgrade Your Tech & Home",
    subtitle: "Save up to 40% on top audio, laptops & smart devices with Prime Free One-Day delivery.",
    category: "Electronics",
    badge: "Big Spring Deals",
    bgGradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
    accentColor: "#ffd814",
    imgUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    title: "The Ultimate Sound Experience",
    subtitle: "Immerse yourself with Apple AirPods, Sony Noise Canceling headphones and studio sound.",
    category: "Electronics",
    badge: "Staff Pick",
    bgGradient: "linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)",
    accentColor: "#00a8e1",
    imgUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    title: "Next-Level Smart Home Solutions",
    subtitle: "Echo Dot, Smart Doorbells & intelligent appliances engineered for comfort and security.",
    category: "Smart Home",
    badge: "Trending Now",
    bgGradient: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
    accentColor: "#febd69",
    imgUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80"
  }
];

export const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setSelectedCategory, navigateTo } = useStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const handleBannerCta = (cat) => {
    setSelectedCategory(cat);
    navigateTo('home');
  };

  return (
    <div className="hero-banner-wrapper">
      <div 
        className="hero-slider"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {BANNERS.map((banner) => (
          <div 
            key={banner.id} 
            className="hero-slide"
            style={{ background: banner.bgGradient }}
          >
            <div className="hero-content">
              <div className="hero-badge">
                <Sparkles size={14} /> {banner.badge}
              </div>
              <h1 className="hero-title">{banner.title}</h1>
              <p className="hero-subtitle">{banner.subtitle}</p>
              
              <div className="hero-actions">
                <button 
                  className="hero-cta-btn"
                  onClick={() => handleBannerCta(banner.category)}
                >
                  <span>Explore {banner.category}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="hero-image-container">
              <img 
                src={banner.imgUrl} 
                alt={banner.title} 
                className="hero-image"
                loading="eager"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <button 
        className="slider-control prev-control" 
        onClick={prevSlide}
        aria-label="Previous Slide"
      >
        <ChevronLeft size={36} />
      </button>

      <button 
        className="slider-control next-control" 
        onClick={nextSlide}
        aria-label="Next Slide"
      >
        <ChevronRight size={36} />
      </button>

      {/* Slide Indicators */}
      <div className="hero-dots">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            className={`hero-dot ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Bottom Gradient Fade to merge smoothly with Amazon product cards */}
      <div className="hero-gradient-overlay" />
    </div>
  );
};
