import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import RestaurantCard from './components/RestaurantCard';
import RestaurantDetailModal from './components/RestaurantDetailModal';
import AIConcierge from './components/AIConcierge';
import MapView from './components/MapView';
import MagazineView from './components/MagazineView';
import MyGuideView from './components/MyGuideView';
import GetStartedView from './components/GetStartedView';
import PlanMyDiningView from './components/PlanMyDiningView';
import CurationExplorerView from './components/CurationExplorerView';
import GiftCardView from './components/GiftCardView';
import LiveEntertainmentView from './components/LiveEntertainmentView';
import CategoryHeroSliders from './components/CategoryHeroSliders';
import SpecialtySectionView from './components/SpecialtySectionView';
import HeroSlider from './components/HeroSlider';
import NeighborhoodsView from './components/NeighborhoodsView';
import AdminDashboardView from './components/AdminDashboardView';
import SupplierOnboardingView from './components/SupplierOnboardingView';
import MerchantOfferLoyaltyView from './components/MerchantOfferLoyaltyView';
import SocialFeedView from './components/SocialFeedView';
import CulinaryEventsView from './components/CulinaryEventsView';
import { Restaurant, SavedItinerary, Booking, Article } from './types';
import { RESTAURANTS, ARTICLES as staticArticles } from './data/restaurants';
import { Award, Compass, Heart, Award as AwardIcon, MapPin, Grid, Plus, Sparkles, BookOpen, Calendar, Star, Gift, ArrowRight, Share2, Check, BookOpenCheck, ArrowUp, Instagram, Facebook, Linkedin, X, ExternalLink, Camera, Upload, Bookmark, Navigation } from 'lucide-react';
import { showToast } from './utils/toast';

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/admin' || path.startsWith('/admin/')) {
        // Replace /admin with /#admin in the address bar immediately to avoid CDN/server 404s on browser reloads
        window.history.replaceState(null, '', '/#admin');
        return 'admin';
      }
      const hash = window.location.hash;
      if (hash === '#admin') {
        return 'admin';
      }
    }
    return 'discovery';
  });
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string | null>(null);
  const [focusedNeighborhoodId, setFocusedNeighborhoodId] = useState<string | null>(null);
  const [copiedNeighborhoodId, setCopiedNeighborhoodId] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(RESTAURANTS);
  const [pagesConfig, setPagesConfig] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>({
    heroTagline: "The Elite Authority Vetting Lebanese Terroir & Gastronomy",
    heroSubtitle: "Anonymous inspections, prestigious stars, and legendary feasts curated for true epicureans.",
    neighborhoodsTitle: "Select Gourmet Neighborhoods",
    neighborhoodsSubtitle: "Cultural Quarters Directory",
    featuredChoiceId: "rest-1"
  });

  const fetchPagesAndSettings = async () => {
    try {
      const resPages = await fetch('/api/pages');
      if (resPages.ok) {
        const dataPages = await resPages.json();
        if (Array.isArray(dataPages) && dataPages.length > 0) {
          setPagesConfig(dataPages.sort((a,b) => a.order - b.order));
        }
      }
      const resSettings = await fetch('/api/settings');
      if (resSettings.ok) {
        const dataSettings = await resSettings.json();
        if (dataSettings && dataSettings.heroTagline) {
          setSiteSettings(dataSettings);
        }
      }
    } catch (err) {
      console.error("Failed to load dynamic configurations:", err);
    }
  };

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setArticles(data);
        } else {
          setArticles(staticArticles);
        }
      } else {
        setArticles(staticArticles);
      }
    } catch (err) {
      console.error("Failed to fetch articles:", err);
      setArticles(staticArticles);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const res = await fetch('/api/restaurants');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setRestaurants(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch restaurants:", err);
    }
  };

  useEffect(() => {
    fetchRestaurants();
    fetchArticles();
    fetchPagesAndSettings();
  }, []);

  useEffect(() => {
    fetchPagesAndSettings();
    fetchArticles();
  }, [activeTab]);

  useEffect(() => {
    // Gracefully normalize path-based Direct link to hash-based #admin link 
    // to prevent server-side/CDN 404 failures on subsequents refreshes.
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/admin' || path.startsWith('/admin/')) {
        window.history.replaceState(null, '', '/#admin');
        setActiveTab('admin');
      }
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'admin') {
      if (window.location.hash !== '#admin') {
        window.history.pushState(null, '', '/#admin');
      }
    } else {
      if (window.location.hash === '#admin') {
        window.history.pushState(null, '', '/');
      }
    }
  }, [activeTab]);

  // Synchronize activeTab and selectedNeighborhoodId in the query parameters gracefully
  useEffect(() => {
    if (activeTab === 'admin') return;
    try {
      const url = new URL(window.location.href);
      let changed = false;
      
      const currentTab = url.searchParams.get('tab');
      if (activeTab !== 'discovery') {
        if (currentTab !== activeTab) {
          url.searchParams.set('tab', activeTab);
          changed = true;
        }
      } else {
        if (url.searchParams.has('tab')) {
          url.searchParams.delete('tab');
          changed = true;
        }
      }

      const currentNb = url.searchParams.get('neighborhood');
      if (activeTab === 'neighborhoods' && selectedNeighborhoodId) {
        if (currentNb !== selectedNeighborhoodId) {
          url.searchParams.set('neighborhood', selectedNeighborhoodId);
          changed = true;
        }
      } else {
        if (url.searchParams.has('neighborhood')) {
          url.searchParams.delete('neighborhood');
          changed = true;
        }
      }

      // If we previously had #admin hash but switched tabs, clear hash
      if (url.hash === '#admin' && activeTab !== 'admin') {
        url.hash = '';
        changed = true;
      }

      if (changed) {
        window.history.pushState(null, '', url.pathname + url.search + url.hash);
      }
    } catch (err) {
      console.error("Failed to sync URL parameters:", err);
    }
  }, [activeTab, selectedNeighborhoodId]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || path.startsWith('/admin/')) {
        window.history.replaceState(null, '', '/#admin');
        setActiveTab('admin');
      } else if (hash === '#admin') {
        setActiveTab('admin');
      } else {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab');
        const neighborhoodParam = params.get('neighborhood');
        if (neighborhoodParam) {
          setSelectedNeighborhoodId(neighborhoodParam);
          setActiveTab('neighborhoods');
        } else if (tabParam) {
          setActiveTab(tabParam);
        } else {
          setActiveTab('discovery');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleShareNeighborhood = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const cleanPath = window.location.pathname === '/admin' ? '/' : window.location.pathname;
    const shareUrl = `${window.location.origin}${cleanPath.endsWith('/') ? cleanPath : cleanPath + '/'}?tab=neighborhoods&neighborhood=${id}`;
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          setCopiedNeighborhoodId(id);
          setTimeout(() => setCopiedNeighborhoodId(null), 2000);
          showToast('Neighborhood share link copied to clipboard!');
        });
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopiedNeighborhoodId(id);
        setTimeout(() => setCopiedNeighborhoodId(null), 2000);
        showToast('Neighborhood share link copied to clipboard!');
      }
    } catch (err) {
      console.error("Share copy failed:", err);
    }
  };

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  
  // Custom featured spot calculated robustly
  const thisWeeksChoice = useMemo<Restaurant>(() => {
    return restaurants.find(r => r.id === 'rest-1' || r.stars === 3) || restaurants[0];
  }, [restaurants]);
  
  // Advanced Filter Categories
  const [selectedDistinction, setSelectedDistinction] = useState<string>('All Distinctions');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All Cuisines');
  const [selectedPrice, setSelectedPrice] = useState<string>('All Prices');
  const [selectedDietary, setSelectedDietary] = useState<string>('All Dietary Options');

  // Geolocation & Distance sorting states
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [sortByDistance, setSortByDistance] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [proximityRadius, setProximityRadius] = useState<number | null>(null);
  const [showRadiusDropdown, setShowRadiusDropdown] = useState<boolean>(false);

  const longPressTimer = React.useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = React.useRef<boolean>(false);

  const startLongPress = (e: React.MouseEvent | React.TouchEvent) => {
    isLongPressRef.current = false;
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => {
      isLongPressRef.current = true;
      setShowRadiusDropdown(true);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(40);
      }
      showToast("Long-pressed! Select proximity radius filter.");
    }, 550);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleSelectRadius = (radius: number | null) => {
    setProximityRadius(radius);
    setShowRadiusDropdown(false);

    if (userCoords) {
      setSortByDistance(true);
      if (radius) {
        showToast(`Filtered restaurants within ${radius} km and sorted by distance.`);
      } else {
        showToast("Sorted all restaurants by distance (no limit).");
      }
      return;
    }

    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser.", "error");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setSortByDistance(true);
        if (radius) {
          showToast(`Successfully located! Showing restaurants within ${radius} km.`);
        } else {
          showToast("Successfully located! Sorted restaurants by distance.");
        }
      },
      (error) => {
        setIsLocating(false);
        console.error("Geolocation error:", error);
        let errorMsg = "Unable to retrieve your location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permissions denied. Please enable location access.";
        }
        showToast(errorMsg, "error");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleFindNearby = () => {
    if (sortByDistance) {
      setSortByDistance(false);
      setProximityRadius(null);
      return;
    }

    if (userCoords) {
      setSortByDistance(true);
      if (proximityRadius) {
        showToast(`Sorted restaurants within ${proximityRadius} km from your current location.`);
      } else {
        showToast("Sorted all restaurants by distance from your current location.");
      }
      return;
    }

    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser.", "error");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setSortByDistance(true);
        showToast("Successfully located! Sorted restaurants by distance.");
      },
      (error) => {
        setIsLocating(false);
        console.error("Geolocation error:", error);
        let errorMsg = "Unable to retrieve your location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permissions denied. Please enable location access in browser settings.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          errorMsg = "Request to get user location timed out.";
        }
        showToast(errorMsg, "error");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleFindNearbyClick = (e: React.MouseEvent) => {
    if (isLongPressRef.current) {
      e.preventDefault();
      e.stopPropagation();
      isLongPressRef.current = false;
      return;
    }
    handleFindNearby();
  };

  // Selected Restaurant for Detailed Inspector Modal
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // Magazine Articles State
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedMagazineArticleId, setSelectedMagazineArticleId] = useState<string | null>(null);

  // AI Concierge slide drawer state
  const [isConciergeActive, setIsConciergeActive] = useState<boolean>(false);

  // Footer Newsletter State
  const [footerEmail, setFooterEmail] = useState('');
  const [footerStatus, setFooterStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [footerErrorMessage, setFooterErrorMessage] = useState('');

  // Floating Back to Top Button State
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 400px
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // States with Local Persistency
  const [savedRestaurantIds, setSavedRestaurantIds] = useState<string[]>([]);
  const [revisitRestaurantIds, setRevisitRestaurantIds] = useState<string[]>([]);
  const [savedItineraries, setSavedItineraries] = useState<SavedItinerary[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Record<string, { rating: number; comment: string; date: string; photo?: string; signatureDish?: string }>>({});
  const [bookingSortOrder, setBookingSortOrder] = useState<'chrono' | 'reverse-chrono'>('chrono');

  // Global Toast state
  const [toast, setToast] = useState<{ message: string; visible: boolean; type: 'success' | 'info' | 'error' }>({
    message: '',
    visible: false,
    type: 'success'
  });

  // Show toast listener
  useEffect(() => {
    const handleShowToast = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string; type?: 'success' | 'info' | 'error' }>;
      if (customEvent.detail && customEvent.detail.message) {
        setToast({
          message: customEvent.detail.message,
          visible: true,
          type: customEvent.detail.type || 'success'
        });
      }
    };

    window.addEventListener('show-toast', handleShowToast);
    return () => {
      window.removeEventListener('show-toast', handleShowToast);
    };
  }, []);

  // Auto-close toast
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  // Review Modal States
  const [reviewModalBooking, setReviewModalBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewPhoto, setReviewPhoto] = useState<string | null>(null);
  const [reviewSignatureDish, setReviewSignatureDish] = useState<string | null>(null);
  const [photoOptimizationInfo, setPhotoOptimizationInfo] = useState<{
    originalSize: string;
    optimizedSize: string;
    reductionPercent: number;
  } | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Stop camera helper
  const handleStopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // Start camera helper
  const handleStartCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      setCameraStream(stream);
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setCameraError("Camera access denied or unavailable on this device.");
      setIsCameraActive(false);
    }
  };

  // Sync video source whenever stream changes
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream, isCameraActive]);

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + ' KB';
    return (kb / 1024).toFixed(1) + ' MB';
  };

  // Capture frame as Base64 image
  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    try {
      const canvas = document.createElement('canvas');
      const sourceWidth = videoRef.current.videoWidth || 640;
      const sourceHeight = videoRef.current.videoHeight || 480;
      
      // Target max dimension for snappy uploads and storage footprint
      const MAX_DIM = 960;
      let targetWidth = sourceWidth;
      let targetHeight = sourceHeight;
      
      if (sourceWidth > MAX_DIM || sourceHeight > MAX_DIM) {
        if (sourceWidth > sourceHeight) {
          targetHeight = Math.round((sourceHeight * MAX_DIM) / sourceWidth);
          targetWidth = MAX_DIM;
        } else {
          targetWidth = Math.round((sourceWidth * MAX_DIM) / sourceHeight);
          targetHeight = MAX_DIM;
        }
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, targetWidth, targetHeight);
        // Optimize JPEG compression to 82% quality
        const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.82);
        
        const rawBytes = Math.round(optimizedBase64.length * 0.75);
        setPhotoOptimizationInfo({
          originalSize: formatBytes(Math.round((sourceWidth * sourceHeight * 3))), // raw pixel estimation
          optimizedSize: formatBytes(rawBytes),
          reductionPercent: 88 // Estimated average camera raw format compression ratio
        });
        
        setReviewPhoto(optimizedBase64);
        handleStopCamera();
        showToast(`Camera capture optimized successfully (${formatBytes(rawBytes)})`);
      }
    } catch (err) {
      console.error("Failed to capture image:", err);
      setCameraError("Failed to snap photo from stream.");
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      showToast("Only image file formats are supported");
      return;
    }

    const originalSizeVal = file.size;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Set maximum dimensions for responsive processing (e.g. 1024px maximum)
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            if (width > height) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            } else {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            
            // Compresses dynamically: formats to JPEG format with 80% compression factor
            const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.80);
            const optimizedSizeVal = Math.round(optimizedBase64.length * 0.75);
            
            // Calculate actual footprint reduction
            const reduction = Math.max(0, Math.round(((originalSizeVal - optimizedSizeVal) / originalSizeVal) * 100));
            
            setPhotoOptimizationInfo({
              originalSize: formatBytes(originalSizeVal),
              optimizedSize: formatBytes(optimizedSizeVal),
              reductionPercent: reduction
            });
            
            setReviewPhoto(optimizedBase64);
            
            if (reduction > 10) {
              showToast(`Compressed image: shrunk size by ${reduction}%! (${formatBytes(optimizedSizeVal)})`);
            } else {
              showToast(`Photo imported (${formatBytes(optimizedSizeVal)})`);
            }
          } else {
            // Fallback to loaded original as-is
            setReviewPhoto(event.target?.result as string);
            setPhotoOptimizationInfo({
              originalSize: formatBytes(originalSizeVal),
              optimizedSize: formatBytes(originalSizeVal),
              reductionPercent: 0
            });
          }
        } catch (error) {
          console.error("Canvas optimization failed:", error);
          setReviewPhoto(event.target?.result as string);
        }
      };
      
      img.onerror = () => {
        showToast("Error processing downloaded photo structure.");
      };
      
      img.src = event.target?.result as string;
    };
    
    reader.onerror = () => {
      showToast("Failed to read selected image file.");
    };
    reader.readAsDataURL(file);
  };

  // Load Saved parameters and query-string deep link on Mount
  useEffect(() => {
    try {
      const storedSaved = localStorage.getItem('zaytounada_saved_restaurants') || localStorage.getItem('michelin_saved_restaurants');
      if (storedSaved) setSavedRestaurantIds(JSON.parse(storedSaved));

      const storedRevisit = localStorage.getItem('zaytounada_revisit_restaurants');
      if (storedRevisit) setRevisitRestaurantIds(JSON.parse(storedRevisit));

      const storedItineraries = localStorage.getItem('zaytounada_itineraries') || localStorage.getItem('michelin_itineraries');
      if (storedItineraries) setSavedItineraries(JSON.parse(storedItineraries));

      const storedBookings = localStorage.getItem('zaytounada_bookings') || localStorage.getItem('michelin_bookings');
      if (storedBookings) setBookings(JSON.parse(storedBookings));

      const storedReviews = localStorage.getItem('zaytounada_reviews');
      if (storedReviews) setReviews(JSON.parse(storedReviews));

      // Parse and apply deep-link query parameter
      const params = new URLSearchParams(window.location.search);
      const restaurantId = params.get('restaurant') || params.get('id');
      if (restaurantId) {
        const found = restaurants.find(r => r.id === restaurantId);
        if (found) {
          setSelectedRestaurant(found);
        }
      }

      const tabParam = params.get('tab');
      if (tabParam) {
        setActiveTab(tabParam);
      }
      const neighborhoodParam = params.get('neighborhood');
      if (neighborhoodParam) {
        setSelectedNeighborhoodId(neighborhoodParam);
        setActiveTab('neighborhoods');
      }
    } catch (err) {
      console.error("Storage Mount & Deep-linking Loading error:", err);
    }
  }, [restaurants]);

  const handleCloseDetailModal = () => {
    setSelectedRestaurant(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('restaurant');
      url.searchParams.delete('id');
      window.history.replaceState({}, '', url.pathname + url.search);
    } catch (err) {
      console.error("Failed to update URL history state on modal close:", err);
    }
  };

  // Sync to LocalStorage on updates
  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error(`Storage Sync failed for ${key}:`, err);
    }
  };

  const handleToggleSaveRestaurant = (id: string) => {
    let next: string[];
    if (savedRestaurantIds.includes(id)) {
      next = savedRestaurantIds.filter(item => item !== id);
    } else {
      next = [...savedRestaurantIds, id];
    }
    setSavedRestaurantIds(next);
    saveToStorage('zaytounada_saved_restaurants', next);
  };

  const handleToggleRevisitRestaurant = (id: string) => {
    let next: string[];
    if (revisitRestaurantIds.includes(id)) {
      next = revisitRestaurantIds.filter(item => item !== id);
      showToast("Removed from Plan to Revisit");
    } else {
      next = [...revisitRestaurantIds, id];
      showToast("Added to Plan to Revisit");
    }
    setRevisitRestaurantIds(next);
    saveToStorage('zaytounada_revisit_restaurants', next);
  };

  const handleAddItinerary = (itinerary: SavedItinerary) => {
    const next = [itinerary, ...savedItineraries];
    setSavedItineraries(next);
    saveToStorage('zaytounada_itineraries', next);
  };

  const handleDeleteItinerary = (id: string) => {
    const next = savedItineraries.filter(it => it.id !== id);
    setSavedItineraries(next);
    saveToStorage('zaytounada_itineraries', next);
  };

  const handleAddBooking = (booking: Booking) => {
    const next = [booking, ...bookings];
    setBookings(next);
    saveToStorage('zaytounada_bookings', next);
  };

  const handleClearAllBookings = () => {
    setBookings([]);
    saveToStorage('zaytounada_bookings', []);
  };

  const handleOpenReview = (booking: Booking) => {
    const existing = reviews[booking.id];
    setReviewModalBooking(booking);
    setReviewRating(existing ? existing.rating : 5);
    setReviewComment(existing ? existing.comment : '');
    setReviewPhoto(existing && 'photo' in existing ? (existing as any).photo : null);
    setReviewSignatureDish(existing && 'signatureDish' in existing ? (existing as any).signatureDish : null);
    setPhotoOptimizationInfo(null);
    setIsCameraActive(false);
    setCameraError(null);
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalBooking) return;

    const nextReviews = {
      ...reviews,
      [reviewModalBooking.id]: {
        rating: reviewRating,
        comment: reviewComment.trim(),
        date: new Date().toISOString().split('T')[0],
        photo: reviewPhoto || undefined,
        signatureDish: reviewSignatureDish || undefined
      }
    };
    setReviews(nextReviews);
    saveToStorage('zaytounada_reviews', nextReviews);
    setReviewModalBooking(null);
    setReviewPhoto(null);
    setReviewSignatureDish(null);
    setPhotoOptimizationInfo(null);
    setIsCameraActive(false);
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const handleFooterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setFooterErrorMessage('');
    
    // Simple client-side email format validation
    const emailStr = footerEmail.trim();
    if (!emailStr) {
      setFooterErrorMessage('Please enter an email address.');
      setFooterStatus('error');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailStr)) {
      setFooterErrorMessage('Please enter a valid email address (e.g., mail@domain.com).');
      setFooterStatus('error');
      return;
    }
    
    setFooterStatus('submitting');
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailStr })
      });
      
      if (res.ok) {
        setFooterStatus('success');
        setFooterEmail('');
        setTimeout(() => setFooterStatus('idle'), 6000);
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Unable to subscribe. Please try again.');
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      setFooterErrorMessage(err.message || 'Server connection issue. Please check your internet or try again later.');
      setFooterStatus('error');
    }
  };

  const handleSocialClick = (platform: string) => {
    console.log(`[Analytics] Social Link Engagement Tracked | Platform: ${platform} | Timestamp: ${new Date().toISOString()}`);
  };

  // Extract unique Cuisines dynamically for filtering option values
  const uniqueCuisinesList = useMemo(() => {
    const cuisinesSet = new Set<string>();
    restaurants.forEach(r => cuisinesSet.add(r.cuisine));
    return ['All Cuisines', ...Array.from(cuisinesSet)];
  }, [restaurants]);

  // Filter restaurants list based on grid combinations
  const filteredRestaurants = useMemo(() => {
    let result = restaurants.filter((rest) => {
      // City Match
      const cityMatch = selectedCity === 'All Cities' || rest.city.toLowerCase() === selectedCity.toLowerCase();
      
      // Text Query Match (Name, Chef, Cuisine, Country)
      const matchesSearch = 
        rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rest.chef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rest.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rest.country.toLowerCase().includes(searchQuery.toLowerCase());

      // Distinction Match
      let matchesDistinction = true;
      if (selectedDistinction !== 'All Distinctions') {
        if (selectedDistinction === 'Stars') {
          matchesDistinction = rest.stars > 0;
        } else if (selectedDistinction === 'Bib Gourmand') {
          matchesDistinction = rest.distinction === 'BIB_GOURMAND';
        } else if (selectedDistinction === 'Selected') {
          matchesDistinction = rest.distinction === 'SELECTED';
        }
      }

      // Cuisine tag Match
      const matchesCuisine = selectedCuisine === 'All Cuisines' || rest.cuisine === selectedCuisine;

      // Price Tier Match
      const matchesPrice = selectedPrice === 'All Prices' || rest.priceRange === selectedPrice;

      // Dietary Option Match
      let matchesDietary = true;
      if (selectedDietary !== 'All Dietary Options') {
        const searchString = `${rest.name} ${rest.cuisine} ${rest.description} ${rest.inspectorNote} ${(rest.features || []).join(' ')} ${(rest.signatureDishes || []).join(' ')}`.toLowerCase();
        
        if (selectedDietary === 'Vegan / Vegetarian') {
          matchesDietary = 
            searchString.includes('vegan') || 
            searchString.includes('vegetarian') || 
            searchString.includes('plant-based') || 
            searchString.includes('hummus') || 
            searchString.includes('falafel') ||
            searchString.includes('mezza') ||
            searchString.includes('salad') ||
            searchString.includes('za\'atar') ||
            searchString.includes('thyme') ||
            searchString.includes('bakery') ||
            searchString.includes('knefeh');
        } else if (selectedDietary === 'Gluten-Free') {
          matchesDietary = 
            searchString.includes('gluten-free') || 
            searchString.includes('gluten free') || 
            searchString.includes('coeliac') ||
            searchString.includes('seafood') ||
            searchString.includes('fish') ||
            searchString.includes('salad') ||
            searchString.includes('grilled') ||
            searchString.includes('rice');
        } else if (selectedDietary === 'Halal') {
          const isHalalCuisine = 
            rest.cuisine.toLowerCase().includes('lebanese') || 
            rest.cuisine.toLowerCase().includes('seafood') || 
            rest.cuisine.toLowerCase().includes('mediterranean') || 
            rest.cuisine.toLowerCase().includes('armenian') || 
            rest.cuisine.toLowerCase().includes('middle eastern');
          matchesDietary = 
            isHalalCuisine || 
            searchString.includes('halal') || 
            searchString.includes('kebab') || 
            searchString.includes('kabab') || 
            searchString.includes('grilled');
        }
      }

      return cityMatch && matchesSearch && matchesDistinction && matchesCuisine && matchesPrice && matchesDietary;
    });

    if (sortByDistance && userCoords) {
      if (proximityRadius !== null) {
        result = result.filter(rest => {
          const rLat = rest.coordinates?.lat ?? 0;
          const rLng = rest.coordinates?.lng ?? 0;
          const dist = getDistance(userCoords.lat, userCoords.lng, rLat, rLng);
          return dist <= proximityRadius;
        });
      }

      result = [...result].sort((a, b) => {
        const latA = a.coordinates?.lat ?? 0;
        const lngA = a.coordinates?.lng ?? 0;
        const latB = b.coordinates?.lat ?? 0;
        const lngB = b.coordinates?.lng ?? 0;
        
        const distA = getDistance(userCoords.lat, userCoords.lng, latA, lngA);
        const distB = getDistance(userCoords.lat, userCoords.lng, latB, lngB);
        return distA - distB;
      });
    }

    return result;
  }, [restaurants, searchQuery, selectedCity, selectedDistinction, selectedCuisine, selectedPrice, selectedDietary, sortByDistance, userCoords, proximityRadius]);

  const currentRestForReview = reviewModalBooking
    ? restaurants.find(r => r.id === reviewModalBooking.restaurantId)
    : null;

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans" id="zaytounada-app-root">
      
      {/* Brand & Filter Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        onOpenConcierge={() => setIsConciergeActive(true)}
        savedCount={savedRestaurantIds.length}
        pagesConfig={pagesConfig}
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        
        {/* VIEW 1: DISCOVERY & DIRECTORY */}
        {activeTab === 'discovery' && (
          <div className="space-y-8 animate-fade-in" id="discovery-pane">
            
            {/* Elegant Dynamic Branding Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pt-1 text-left animate-fade-in" id="homepage-dynamic-hero-banner">
              <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-amber-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                {/* Decorative background vectors */}
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="max-w-3xl relative z-10">
                  <span className="text-[10px] font-mono tracking-[0.2em] font-bold text-amber-400 uppercase bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                    ★ CHRONICLE HEADQUARTERS
                  </span>
                  <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal leading-tight mt-3 text-white uppercase tracking-wide">
                    {siteSettings?.heroTagline || "The Elite Authority Vetting Lebanese Terroir & Gastronomy"}
                  </h1>
                  <p className="text-sm md:text-base text-neutral-300 font-light mt-3 leading-relaxed max-w-2xl">
                    {siteSettings?.heroSubtitle || "Anonymous inspections, prestigious stars, and legendary feasts curated for true epicureans."}
                  </p>
                </div>
              </div>
            </div>

            {/* Gen Z Interactive Slider with Optimized Section Images & Live Marquee */}
            <HeroSlider 
              onNavigateTab={setActiveTab}
              onSelectDistinction={setSelectedDistinction}
              onOpenConcierge={() => setIsConciergeActive(true)}
            />

            {/* FULL-WIDTH FEATURES SECTION */}
            <div className="w-full bg-neutral-50 border-y border-neutral-200 py-12 px-4 sm:px-6 lg:px-8 text-left" id="features-editorial-fullwidth">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Visual Image Column */}
                <div className="lg:col-span-5 h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden border border-neutral-200 shadow-md relative bg-neutral-100">
                  <img
                    src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=800"
                    alt="The Changing Face of Hamra"
                    className="w-full h-full object-cover filter saturate-110 hover:scale-102 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 bg-amber-400 text-neutral-900 font-mono text-[9px] tracking-widest font-black uppercase px-2.5 py-1 rounded shadow">
                    Featured Chronicle
                  </span>
                </div>

                {/* Content Column */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-extrabold text-red-650 block">
                      FEATURES • NOSTALGIA
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-light text-neutral-900 tracking-tight uppercase leading-tight">
                      The Changing Face of Hamra: <br className="hidden sm:block"/>
                      <span className="font-semibold text-neutral-900">A Eulogy for the Zaroubi and Hamra Express</span>
                    </h2>
                    <p className="text-xs font-mono text-neutral-500 font-medium">
                      Published July 15, 2026 • 7 min read • Written by Gourmet Travel Team
                    </p>
                  </div>

                  <p className="text-sm text-neutral-600 font-serif leading-relaxed italic border-l-4 border-amber-400 pl-4">
                    "There is a long-standing debate about where the true heart of Beirut beats, but for those who know the city’s concrete veins, there is only one answer: Hamra Street is the real downtown..."
                  </p>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                    Unlike the manicured, sterile reconstructions of the geographical downtown, Hamra has always been a messy, breathing, living organism. It is a microcosm of a country constantly rebuilding itself on the fly. Today, it is a bustling, chaotic mosaic—populated by survivalists, refugee flights, and a daily mushrooming of new makeshift cafes and thatched structures. But if Hamra is the heart, its alleyways are the secret chambers where its soul used to hide. One such spot is the Zaroubi—popularly known as the Hamra Alleyway...
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setSelectedMagazineArticleId('art-hamra-eulogy');
                        setActiveTab('magazine');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <span>Read More in Magazine</span>
                      <ArrowRight className="w-4 h-4 text-amber-300" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* THIRD SECTION: ZAYTOUNA MAGAZINE – HOSPITALITY IN REVIEW */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4" id="zaytounada-magazine-review-homepage">
              <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-250 pb-3 mb-6">
                <div>
                  <span className="text-[9.5px] font-mono uppercase tracking-[0.25em] font-extrabold text-red-650 block">
                    🗞️ Hospitality in Review
                  </span>
                  <h3 className="font-serif font-light text-2xl text-neutral-900 mt-1 uppercase tracking-wide">
                    Zaytounada <span className="font-semibold text-red-650">Magazine – Hospitality in review</span>
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedMagazineArticleId(null);
                    setActiveTab('magazine');
                  }}
                  className="mt-3 md:mt-0 text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-750 hover:text-red-650 border border-neutral-300 hover:border-red-650 px-4.5 py-2 rounded-full transition-all cursor-pointer text-left md:text-right w-fit"
                >
                  Enter Magazine Feed ➔
                </button>
              </div>

              {articles.length === 0 ? (
                <div className="py-12 bg-neutral-50 border border-dashed border-neutral-250 rounded-2xl text-center text-neutral-500 text-xs">
                  Loading stories and latest culinary entries...
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Big Spotlight Story (Large card, occupies 7 columns) */}
                  {articles[0] && (
                    <div 
                      onClick={() => {
                        setSelectedMagazineArticleId(articles[0].id);
                        setActiveTab('magazine');
                      }}
                      className="lg:col-span-7 group cursor-pointer flex flex-col justify-between border border-neutral-200 hover:border-neutral-300 bg-white rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-with-duration text-left"
                    >
                      <div className="space-y-4">
                        <div className="h-64 sm:h-80 w-full rounded-xl overflow-hidden relative bg-neutral-100 border border-neutral-200">
                          <img 
                            src={articles[0].imageUrl} 
                            alt={articles[0].title}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-101 transition-all duration-505"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-4 left-4 bg-red-655 text-white font-mono text-[8px] tracking-widest font-black uppercase px-2.5 py-1 rounded shadow">
                            {articles[0].category}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono text-neutral-450 uppercase tracking-wider block">
                            {articles[0].date} • {articles[0].readTime} • By {articles[0].author}
                          </span>
                          <h4 className="font-serif font-light text-xl sm:text-2xl text-neutral-900 group-hover:text-red-650 transition-colors uppercase tracking-wide leading-snug">
                            {articles[0].title}
                          </h4>
                          <p className="text-neutral-555 text-xs font-serif italic font-light line-clamp-2 leading-relaxed">
                            {articles[0].subtitle}
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-neutral-100 pt-3.5 mt-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-red-650 font-bold">
                        <span>Lead Editorial Chronicle</span>
                        <div className="flex items-center gap-3">
                          {articles[0].website && (
                            <a
                              href={articles[0].website}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="hover:text-red-750 transition-colors flex items-center gap-1 border-r border-neutral-200 pr-3 cursor-pointer"
                              title="Visit official venue website"
                            >
                              <span>Visit Website</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          <span className="group-hover:translate-x-0.5 transition-transform duration-200">Read Full Story ➔</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Right Half: Up to 2 stories in list form (Occupies 5 columns) */}
                  <div className="lg:col-span-5 flex flex-col gap-4">
                    {articles.slice(1, 3).map((art) => (
                      <div 
                        key={art.id}
                        onClick={() => {
                          setSelectedMagazineArticleId(art.id);
                          setActiveTab('magazine');
                        }}
                        className="group cursor-pointer bg-white border border-neutral-200 hover:border-neutral-300 rounded-2xl p-4.5 flex gap-4 transition-all hover:shadow-2xs text-left h-full"
                      >
                        <div className="w-24 sm:w-28 h-24 sm:h-28 shrink-0 rounded-lg overflow-hidden border border-neutral-200 relative bg-neutral-100">
                          <img 
                            src={art.imageUrl} 
                            alt={art.title}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex flex-col justify-between flex-1 py-0.5 min-w-0">
                          <div className="space-y-1.5">
                            <span className="text-[8px] font-mono text-amber-600 bg-amber-50 border border-amber-200/60 uppercase px-1.5 py-0.5 rounded font-black tracking-wider inline-block">
                              {art.category}
                            </span>
                            <h5 className="font-serif font-semibold text-xs text-neutral-900 group-hover:text-red-650 transition-colors line-clamp-2 leading-snug uppercase tracking-wide">
                              {art.title}
                            </h5>
                            <p className="text-[10px] text-neutral-500 italic font-serif font-light line-clamp-2 leading-normal">
                              {art.subtitle}
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-[8.5px] font-mono text-neutral-450 uppercase tracking-wider font-bold mt-1.5">
                            <span>{art.date}</span>
                            <div className="flex items-center gap-2.5">
                              {art.website && (
                                <a
                                  href={art.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                  className="text-red-650 hover:text-red-750 transition-colors flex items-center gap-0.5 border-r border-neutral-200 pr-2.5 cursor-pointer"
                                  title={`Visit website of ${art.title}`}
                                >
                                  <span>Visit Website</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                              <span className="text-red-650 font-bold group-hover:text-red-750 transition-colors">Read Report ➔</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Quick subscribe or secondary callout block if only 1 story exists */}
                    {articles.length <= 1 && (
                      <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 flex flex-col justify-center items-center text-center h-full space-y-3">
                        <BookOpenCheck className="w-8 h-8 text-neutral-400" />
                        <h5 className="font-serif font-medium text-sm text-neutral-900 font-bold">Vetting the culinary landscape</h5>
                        <p className="text-[11px] text-neutral-500 max-w-xs leading-relaxed font-light">
                          More stories are currently in the editorial press. Admin can insert new stories anytime via the Lockbox panel.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* HIGH-FIDELITY LOYALTY PROGRAM PROMOTIONAL BANNER */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4" id="home-loyalty-promo-banner-rail">
              <div className="relative bg-gradient-to-br from-[#0c2e1f] via-[#051c13] to-emerald-950 border border-emerald-800/80 rounded-3xl p-6 md:p-8 xl:p-10 overflow-hidden shadow-xl flex flex-col md:flex-row items-center gap-6 text-left transition-all hover:border-emerald-600/80">
                {/* Decorative background visual elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/5 rounded-full filter blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-2xl pointer-events-none" />
                
                {/* Badge, Icon, Content layout */}
                <div className="flex-1 space-y-4 z-10 relative">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[10px] font-mono uppercase bg-amber-400 text-neutral-950 font-black px-3 py-1 rounded tracking-widest leading-none">
                      ★ VIP LOYALTY CARD
                    </span>
                    <span className="text-[9.5px] font-mono text-emerald-350 border border-emerald-850/80 uppercase px-2.5 py-0.5 rounded font-bold">
                      Flat 20% Off Outposts
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase leading-tight">
                      JOIN THE WHATSONLEBANON.BUZZ <br className="hidden md:block"/>
                      <span className="text-amber-400 underline decoration-emerald-500 decoration-2">LOYALTY ECOSYSTEM</span>
                    </h2>
                    <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-light max-w-2xl">
                      Beirut's premier digital network connecting elite consumers with top-tier venues, brands, and service providers. Enjoy a flat <strong className="text-white font-semibold">20% discount on all food & services</strong>, custom content campaigns, and real-time "What's Popping" privileges.
                    </p>
                  </div>
                </div>

                {/* Right Action Trigger Box */}
                <div className="shrink-0 z-10 relative flex flex-col gap-2.5 w-full md:w-auto text-center md:text-right">
                  <button
                    onClick={() => setActiveTab('merchant-offers')}
                    className="px-6 py-4 bg-amber-400 hover:bg-amber-500 active:scale-98 text-emerald-950 font-mono font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <span>Claim Free Digital Pass</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[9px] font-mono text-neutral-400">
                    Settle checkouts elegantly with smartphone QR scans
                  </p>
                </div>
              </div>
            </div>

            {/* NEIGHBORHOODS HERO BANNER CARDS GRID */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left" id="neighborhoods-directory-banner-rail">
              <div className="border-b border-neutral-100 pb-3 mb-6">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-extrabold text-amber-500 block">
                  {siteSettings?.neighborhoodsSubtitle || "CULTURAL QUARTERS DIRECTORY"}
                </span>
                <h3 className="font-serif font-light text-2xl text-neutral-900 mt-1 uppercase tracking-wider">
                  {siteSettings?.neighborhoodsTitle ? (
                    siteSettings.neighborhoodsTitle
                  ) : (
                    <>Select <span className="font-medium text-emerald-800">Gourmet Neighborhoods</span></>
                  )}
                </h3>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                {[
                  { id: 'hamra', name: 'Hamra', label: 'الحمراء', desc: 'Intellectual & Cozy Cafes', count: 2, bg: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=350' },
                  { id: 'mar_mikhael', name: 'Mar Mikhael', label: 'مار ميخائيل', desc: 'Arts District & Bistro Chic', count: 8, bg: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=350' },
                  { id: 'sassine', name: 'Sassine / Achrafieh', label: 'الأشرفية ساسين', desc: 'Aristocratic & Starred Fine Dining', count: 4, bg: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=350' },
                  { id: 'sodeco', name: 'Sodeco', label: 'سوديكو', desc: 'Crossroads & Sandstone Estates', count: 6, bg: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=350' },
                  { id: 'badaro', name: 'Badaro', label: 'بدارو', desc: 'Leafy Terraces & Sidewalk Lunches', count: 3, bg: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=350' },
                  { id: 'antelias', name: 'Antelias', label: 'أنطلياس', desc: 'Coastal Seafood Feasts', count: 2, bg: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=350' }
                ].map((nb) => {
                  const totalCount = RESTAURANTS.filter(r => r.neighborhood === nb.id).length || nb.count;
                  
                  // Compute match count based on all ACTIVE filters
                  const filteredCount = RESTAURANTS.filter(rest => {
                    if (rest.neighborhood !== nb.id) return false;
                    
                    const cityMatch = selectedCity === 'All Cities' || rest.city.toLowerCase() === selectedCity.toLowerCase();
                    
                    const matchesSearch = !searchQuery ? true : (
                      rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      rest.chef.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      rest.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      rest.country.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    let matchesDistinction = true;
                    if (selectedDistinction !== 'All Distinctions') {
                      if (selectedDistinction === 'Stars') {
                        matchesDistinction = rest.stars > 0;
                      } else if (selectedDistinction === 'Bib Gourmand') {
                        matchesDistinction = rest.distinction === 'BIB_GOURMAND';
                      } else if (selectedDistinction === 'Selected') {
                        matchesDistinction = rest.distinction === 'SELECTED';
                      }
                    }

                    const matchesCuisine = selectedCuisine === 'All Cuisines' || rest.cuisine === selectedCuisine;
                    const matchesPrice = selectedPrice === 'All Prices' || rest.priceRange === selectedPrice;

                    // Dietary Option Match
                    let matchesDietary = true;
                    if (selectedDietary !== 'All Dietary Options') {
                      const searchString = `${rest.name} ${rest.cuisine} ${rest.description} ${rest.inspectorNote} ${(rest.features || []).join(' ')} ${(rest.signatureDishes || []).join(' ')}`.toLowerCase();
                      
                      if (selectedDietary === 'Vegan / Vegetarian') {
                        matchesDietary = 
                          searchString.includes('vegan') || 
                          searchString.includes('vegetarian') || 
                          searchString.includes('plant-based') || 
                          searchString.includes('hummus') || 
                          searchString.includes('falafel') ||
                          searchString.includes('mezza') ||
                          searchString.includes('salad') ||
                          searchString.includes('za\'atar') ||
                          searchString.includes('thyme') ||
                          searchString.includes('bakery') ||
                          searchString.includes('knefeh');
                      } else if (selectedDietary === 'Gluten-Free') {
                        matchesDietary = 
                          searchString.includes('gluten-free') || 
                          searchString.includes('gluten free') || 
                          searchString.includes('coeliac') ||
                          searchString.includes('seafood') ||
                          searchString.includes('fish') ||
                          searchString.includes('salad') ||
                          searchString.includes('grilled') ||
                          searchString.includes('rice');
                      } else if (selectedDietary === 'Halal') {
                        const isHalalCuisine = 
                          rest.cuisine.toLowerCase().includes('lebanese') || 
                          rest.cuisine.toLowerCase().includes('seafood') || 
                          rest.cuisine.toLowerCase().includes('mediterranean') || 
                          rest.cuisine.toLowerCase().includes('armenian') || 
                          rest.cuisine.toLowerCase().includes('middle eastern');
                        matchesDietary = 
                          isHalalCuisine || 
                          searchString.includes('halal') || 
                          searchString.includes('kebab') || 
                          searchString.includes('kabab') || 
                          searchString.includes('grilled');
                      }
                    }

                    return cityMatch && matchesSearch && matchesDistinction && matchesCuisine && matchesPrice && matchesDietary;
                  }).length;

                  const hasActiveFilters = selectedCity !== 'All Cities' ||
                                           searchQuery !== '' ||
                                           selectedDistinction !== 'All Distinctions' ||
                                           selectedCuisine !== 'All Cuisines' ||
                                           selectedPrice !== 'All Prices' ||
                                           selectedDietary !== 'All Dietary Options';

                  return (
                    <div
                      key={nb.id}
                      onClick={() => {
                        setSelectedNeighborhoodId(nb.id);
                        setActiveTab('neighborhoods');
                      }}
                      className="group relative h-40 rounded-2xl overflow-hidden border border-neutral-200 shadow-xs hover:shadow-lg hover:border-emerald-600/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer text-left"
                      id={`banner-tile-${nb.id}`}
                    >
                      <img
                        src={nb.bg}
                        alt={nb.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 saturate-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-transparent" />
                      
                      {/* Floating Share Button widget with responsive micro-feedback states (placed at z-35 for active clickability above any overlays) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareNeighborhood(nb.id);
                        }}
                        className={`absolute top-2 left-2 z-35 px-2 py-1 rounded-md border text-[9px] font-medium shadow-xs transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1 font-mono ${
                          copiedNeighborhoodId === nb.id 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-900/20' 
                            : 'bg-white/95 text-neutral-600 hover:text-emerald-800 border-neutral-200 hover:bg-neutral-50'
                        }`}
                        title={`Copy Share Link for ${nb.name}`}
                        id={`banner-tile-share-${nb.id}`}
                      >
                        {copiedNeighborhoodId === nb.id ? (
                          <Check className="w-3 h-3 text-white stroke-[3px]" />
                        ) : (
                          <Share2 className="w-3 h-3 text-emerald-600" />
                        )}
                        <span className={`text-[8px] font-bold uppercase tracking-wider ${
                          copiedNeighborhoodId === nb.id ? 'text-white' : 'text-emerald-800'
                        }`}>
                          {copiedNeighborhoodId === nb.id ? 'Copied!' : 'Share'}
                        </span>
                      </button>

                      {/* Immediate Float-up Visual Feedback Toast Layer (z-30) */}
                      {copiedNeighborhoodId === nb.id && (
                        <div className="absolute inset-x-2 top-11 z-30 flex justify-center animate-[bounce_1s_infinite]">
                          <div className="bg-emerald-950/95 text-white text-[8px] font-mono tracking-wider px-2 py-1 rounded-md border border-emerald-500/30 shadow-lg flex items-center gap-1 font-bold uppercase backdrop-blur-sm">
                            <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3px]" />
                            <span>Link Copied!</span>
                          </div>
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3 right-3 text-left">
                        <span className="text-[8px] font-mono text-amber-300 font-bold uppercase tracking-wider block">
                          {nb.label}
                        </span>
                        <h4 className="font-serif text-sm font-bold text-white tracking-tight leading-tight mt-0.5 group-hover:text-amber-300 transition-colors">
                          {nb.name}
                        </h4>
                        <p className="text-[8.5px] text-neutral-300 leading-none mt-1 truncate">
                          {nb.desc}
                        </p>
                      </div>

                      <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-10">
                        <div className="bg-emerald-950/90 text-white border border-white/5 backdrop-blur-md px-1.5 py-0.5 rounded text-[7.5px] font-mono font-bold tracking-widest">
                          {totalCount} SPOTS
                        </div>
                        {hasActiveFilters && (
                          <div className="bg-amber-500 text-emerald-950 px-1.5 py-0.5 rounded text-[7.5px] font-mono font-black tracking-widest uppercase shadow border border-amber-300">
                            {filteredCount} MATCHED
                          </div>
                        )}
                      </div>

                      {/* Editorial Interactive Hover Tooltip Overlay (z-20) */}
                      <div className="absolute inset-0 bg-neutral-950/95 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 text-left">
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono text-emerald-400 font-extrabold uppercase tracking-widest block font-bold">
                            ★ NEIGHBORHOOD INSIGHT
                          </span>
                          <h4 className="font-serif text-sm font-bold text-white tracking-tight leading-tight">
                            {nb.name} ({nb.label})
                          </h4>
                          <p className="text-[9px] text-neutral-300 leading-relaxed mt-1.5 font-sans font-light">
                            {hasActiveFilters ? (
                              <>
                                Found <span className="text-amber-300 font-bold">{filteredCount}</span> spot{filteredCount === 1 ? '' : 's'} matching active filters (out of {totalCount} total).
                              </>
                            ) : (
                              `Explore ${totalCount} exquisite dining spots, including historic bistros and local sourdough bakeries.`
                            )}
                          </p>

                          {hasActiveFilters && (
                            <div className="text-[7.5px] font-mono text-neutral-400 mt-1 uppercase tracking-wider space-y-0.5">
                              {selectedDistinction !== 'All Distinctions' && (
                                <div>• {selectedDistinction}</div>
                              )}
                              {selectedCuisine !== 'All Cuisines' && (
                                <div>• Cuisine: {selectedCuisine}</div>
                              )}
                              {selectedPrice !== 'All Prices' && (
                                <div>• Price: {selectedPrice}</div>
                              )}
                              {selectedCity !== 'All Cities' && (
                                <div>• City: {selectedCity}</div>
                              )}
                              {searchQuery && (
                                <div className="truncate">• Search: "{searchQuery}"</div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="border-t border-white/10 pt-2 flex items-center justify-between">
                          <span className="text-[8px] font-mono text-amber-300 font-bold uppercase tracking-wider">
                            {hasActiveFilters ? `${filteredCount} / ${totalCount} Matches` : `${totalCount} Gourmet Spots`}
                          </span>
                          <span className="text-[8px] font-mono text-neutral-400 flex items-center gap-1 font-bold">
                            EXPLORE AREA →
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Structured Advanced Filtering Rail */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-sm">
                
                {/* Secondary select filter lists */}
                <div className="flex flex-col sm:flex-row flex-1 gap-2.5">
                  
                  {/* Distinction level filter */}
                  <select
                    value={selectedDistinction}
                    onChange={(e) => setSelectedDistinction(e.target.value)}
                    className="px-3.5 py-2 text-xs bg-white border border-neutral-200 rounded-full text-neutral-900 cursor-pointer focus:border-emerald-600 outline-none"
                    id="distinction-dropdown-select"
                  >
                    <option value="All Distinctions" className="bg-white text-neutral-900">All Distinctions</option>
                    <option value="Stars" className="bg-white text-neutral-900">Zaytounada Stars (✻)</option>
                    <option value="Bib Gourmand" className="bg-white text-neutral-900">Bib Gourmand (☺)</option>
                    <option value="Selected" className="bg-white text-neutral-900">Selected Recommendations</option>
                  </select>

                  {/* Cuisine Category filter */}
                  <select
                    value={selectedCuisine}
                    onChange={(e) => setSelectedCuisine(e.target.value)}
                    className="px-3.5 py-2 text-xs bg-white border border-neutral-200 rounded-full text-neutral-900 cursor-pointer focus:border-emerald-600 outline-none"
                    id="cuisine-dropdown-select"
                  >
                    {uniqueCuisinesList.map((cuisine) => (
                      <option key={cuisine} value={cuisine} className="bg-white text-neutral-900">{cuisine}</option>
                    ))}
                  </select>

                  {/* Price budget level filter */}
                  <select
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="px-3.5 py-2 text-xs bg-white border border-neutral-200 rounded-full text-neutral-900 cursor-pointer focus:border-emerald-600 outline-none"
                    id="price-dropdown-select"
                  >
                    <option value="All Prices" className="bg-white text-neutral-900">All Budgets ($)</option>
                    <option value="$$$$" className="bg-white text-neutral-900">$$$$ (Supreme Luxury)</option>
                    <option value="$$$" className="bg-white text-neutral-900">$$$ (Fine Dining)</option>
                    <option value="$$" className="bg-white text-neutral-900">$$ (Moderate Bistro)</option>
                  </select>

                  {/* Dietary Options Filter dropdown */}
                  <select
                    value={selectedDietary}
                    onChange={(e) => setSelectedDietary(e.target.value)}
                    className="px-3.5 py-2 text-xs bg-white border border-neutral-200 rounded-full text-neutral-900 cursor-pointer focus:border-emerald-600 outline-none"
                    id="dietary-dropdown-select"
                  >
                    <option value="All Dietary Options" className="bg-white text-neutral-900">All Dietary Options</option>
                    <option value="Vegan / Vegetarian" className="bg-white text-neutral-900">Vegan / Vegetarian Friendly</option>
                    <option value="Gluten-Free" className="bg-white text-neutral-900">Gluten-Free Options</option>
                    <option value="Halal" className="bg-white text-neutral-900">Halal Certified / Compliant</option>
                  </select>

                  {/* Find Nearby Geolocation Trigger with long-press for proximity radius selection */}
                  <div className="relative inline-block shrink-0">
                    <button
                      onMouseDown={startLongPress}
                      onMouseUp={cancelLongPress}
                      onMouseLeave={cancelLongPress}
                      onTouchStart={startLongPress}
                      onTouchMove={cancelLongPress}
                      onTouchEnd={cancelLongPress}
                      onClick={handleFindNearbyClick}
                      disabled={isLocating}
                      className={`px-3.5 py-2 text-xs rounded-full font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 select-none ${
                        sortByDistance
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs border border-emerald-700'
                          : 'bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 hover:text-emerald-800'
                      }`}
                      title="Sort restaurants by proximity (Long-press to set radius limit)"
                      id="find-nearby-btn"
                    >
                      <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : 'rotate-45 text-emerald-600'}`} />
                      <span>
                        {isLocating 
                          ? 'Locating...' 
                          : sortByDistance 
                            ? (proximityRadius ? `Within < ${proximityRadius}km` : 'Distance Sort ON') 
                            : 'Find Nearby'}
                      </span>
                    </button>

                    {/* Dimmed backdrop to close dropdown on outside clicks */}
                    {showRadiusDropdown && (
                      <div 
                        className="fixed inset-0 z-40 bg-transparent cursor-default" 
                        onClick={() => setShowRadiusDropdown(false)}
                      />
                    )}

                    {/* Dropdown menu */}
                    {showRadiusDropdown && (
                      <div className="absolute left-0 mt-2 w-52 bg-white border border-neutral-200 rounded-2xl shadow-xl py-1.5 z-50 animate-fade-in text-left">
                        <div className="px-3.5 py-2 border-b border-neutral-100 text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider font-mono flex items-center justify-between">
                          <span>Proximity Filter</span>
                          <span className="text-[8px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded">Select Limit</span>
                        </div>
                        <div className="py-1">
                          {[
                            { label: '5 km (Neighborhood)', value: 5 },
                            { label: '10 km (Short Drive)', value: 10 },
                            { label: '25 km (Regional)', value: 25 },
                            { label: '50 km (Daytrip)', value: 50 },
                            { label: 'Any Distance', value: null },
                          ].map((opt) => {
                            const isSelected = proximityRadius === opt.value;
                            return (
                              <button
                                key={opt.label}
                                type="button"
                                onClick={() => handleSelectRadius(opt.value)}
                                className="w-full px-4 py-2 text-xs flex items-center justify-between transition-colors text-left hover:bg-neutral-50 cursor-pointer select-none border-none bg-transparent"
                              >
                                <span className={isSelected ? 'text-emerald-800 font-bold' : 'text-neutral-700 font-medium'}>
                                  {opt.label}
                                </span>
                                {isSelected && (
                                  <span className="w-2 h-2 rounded-full bg-emerald-600 shadow-3xs" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                        <div className="border-t border-neutral-100 px-3.5 py-1.5 text-[9px] text-neutral-400 leading-normal font-light">
                          Hold button at any time to open this selection.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Reset Trigger */}
                {(selectedDistinction !== 'All Distinctions' || selectedCuisine !== 'All Cuisines' || selectedPrice !== 'All Prices' || selectedDietary !== 'All Dietary Options' || selectedCity !== 'All Cities' || searchQuery || sortByDistance) && (
                  <button
                    onClick={() => {
                      setSelectedCity('All Cities');
                      setSearchQuery('');
                      setSelectedCuisine('All Cuisines');
                      setSelectedDistinction('All Distinctions');
                      setSelectedPrice('All Prices');
                      setSelectedDietary('All Dietary Options');
                      setSortByDistance(false);
                      setProximityRadius(null);
                    }}
                    className="text-[10px] text-emerald-700 hover:text-emerald-600 font-bold uppercase tracking-widest cursor-pointer ml-auto text-right md:text-left shrink-0"
                  >
                    Clear Filter Selections
                  </button>
                )}
              </div>
            </div>

            {/* Redesigned Spotlight "This Week's Choice" Section - Immersive scaled-up visuals */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-left" id="weeks-choice-spotlight">
              <div className="relative bg-gradient-to-br from-emerald-900 to-emerald-950 border border-amber-400/40 rounded-3xl overflow-hidden shadow-xl flex flex-col lg:flex-row text-white">
                {/* Decorative spotlight blur overlay */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                
                {/* Details Column */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-between space-y-6 z-10 relative">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-amber-400 text-emerald-950 text-[10px] uppercase font-black font-mono px-3.5 py-1.5 rounded-full flex items-center gap-1 shadow">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>This Week's Choice</span>
                      </span>
                      <span className="text-amber-300 text-xs font-mono font-bold tracking-widest uppercase">Inspectors Benchmark</span>
                    </div>

                    <h2 className="font-serif text-3xl md:text-4xl font-extrabold tracking-tight leading-none text-white hover:text-amber-300 transition-colors">
                      {thisWeeksChoice.name}
                    </h2>
                    
                    <p className="text-[11px] font-mono tracking-widest text-amber-300 uppercase font-black">
                      {thisWeeksChoice.cuisine} • {thisWeeksChoice.city}, {thisWeeksChoice.country}
                    </p>

                    <p className="text-xs md:text-sm text-emerald-100 font-light leading-relaxed max-w-2xl">
                      {thisWeeksChoice.description}
                    </p>

                    <div className="p-4 bg-emerald-950/75 border-l-4 border-amber-400 rounded-r-xl italic text-xs text-amber-100/90 leading-relaxed max-w-2xl">
                      "{thisWeeksChoice.inspectorNote}"
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      onClick={() => setSelectedRestaurant(thisWeeksChoice)}
                      className="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-emerald-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>inspect evaluating files</span>
                      <ArrowRight className="w-4 h-4 text-emerald-950" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRestaurant(thisWeeksChoice);
                        setTimeout(() => {
                          const container = document.getElementById('gourmet-booking-desk');
                          if (container) {
                            container.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }, 250);
                      }}
                      className="px-5 py-3.5 bg-transparent border border-white/20 hover:border-amber-400 hover:bg-white/5 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer text-center"
                    >
                      Secure Instant Table Allocations
                    </button>
                  </div>
                </div>

                {/* Sizable Visual Column ("make bigger pictures when you can") */}
                <div className="w-full lg:w-[48%] h-72 sm:h-96 lg:h-auto overflow-hidden relative">
                  <img
                    src={thisWeeksChoice.imageUrl}
                    alt={thisWeeksChoice.name}
                    className="w-full h-full object-cover saturate-110 hover:scale-105 transition-transform duration-1000 min-h-[320px]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-emerald-900 via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute bottom-6 right-6 bg-emerald-950/90 border border-amber-400/30 backdrop-blur-md p-4 rounded-xl text-left max-w-xs shadow-lg">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-widest block mb-1">OFFICIAL CITATION</span>
                    <p className="font-serif text-xs font-bold text-white mb-0.5">3 ZAYTOUNADA STARS AWARDED</p>
                    <p className="text-[10px] text-neutral-300 font-light">Considered by food tasters to be the absolute pinnacle of Levantine culinary art.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CURATED CATEGORIES SECTIONS INDEX & DETAILED LISTS */}
            <CategoryHeroSliders 
              onSelectRestaurant={setSelectedRestaurant} 
              savedRestaurantIds={savedRestaurantIds} 
              onToggleSave={(id, e) => {
                e.stopPropagation();
                handleToggleSaveRestaurant(id);
              }}
              onFilterCuisine={(cuisineName) => {
                // Map the descriptive category to active state filters
                if (cuisineName.includes('Haute')) {
                  setSelectedCuisine('Traditional Lebanese Haute Cuisine');
                  setSearchQuery('');
                } else if (cuisineName.includes('Contemporary')) {
                  setSelectedCuisine('Polished Contemporary Lebanese');
                  setSearchQuery('');
                } else if (cuisineName.includes('Seafood')) {
                  setSearchQuery('Seafood');
                  setSelectedCuisine('All Cuisines');
                } else if (cuisineName.includes('Mediterranean')) {
                  setSearchQuery('Mediterranean');
                  setSelectedCuisine('All Cuisines');
                } else if (cuisineName.includes('Armenian')) {
                  setSelectedCuisine('Armenian-Lebanese Homestyle');
                  setSearchQuery('');
                } else if (cuisineName.includes('Bakeries')) {
                  setSearchQuery('Bakeries');
                  setSelectedCuisine('All Cuisines');
                }
                
                // Scroll smoothly to the filtering dropdowns
                setTimeout(() => {
                  const dropdownEl = document.getElementById('distinction-dropdown-select');
                  if (dropdownEl) {
                    dropdownEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 150);
              }}
            />

            {/* Showcase Restaurant Catalog Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-baseline mb-5">
                <h3 className="font-serif font-light text-xl text-neutral-900 flex items-center gap-2 uppercase tracking-wider">
                  <Grid className="w-4 h-4 text-neutral-400" />
                  <span>Zerytounda Catalog</span>
                  <span className="text-[10px] text-neutral-500 font-mono font-normal ml-1 tracking-widest">({filteredRestaurants.length} EVALUATION{filteredRestaurants.length === 1 ? '' : 'S'})</span>
                </h3>
              </div>

              {filteredRestaurants.length === 0 ? (
                <div className="text-center py-24 bg-neutral-50 border border-neutral-200 rounded-xl p-10 shadow-sm flex flex-col items-center justify-center">
                  <Award className="w-16 h-16 text-neutral-200 mb-3.5" />
                  <p className="font-serif italic text-lg text-neutral-800">No Evaluations Configured</p>
                  <p className="text-xs text-neutral-500 max-w-sm leading-relaxed mt-1">
                    No inspectors reports fit the active filters. Try resetting keyword indices or checking another capital.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCity('All Cities');
                      setSearchQuery('');
                      setSelectedDistinction('All Distinctions');
                      setSelectedCuisine('All Cuisines');
                      setSelectedPrice('All Prices');
                    }}
                    className="mt-6 px-5 py-3 border border-emerald-600 text-emerald-700 text-[10px] uppercase tracking-[0.3em] font-bold bg-transparent hover:bg-emerald-700 hover:text-white transition-all cursor-pointer shadow-md"
                  >
                    Reset Grid filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="restaurants-grid">
                  {filteredRestaurants.map((restaurant) => {
                    const latVal = restaurant.coordinates?.lat;
                    const lngVal = restaurant.coordinates?.lng;
                    const distance = (userCoords && latVal && lngVal)
                      ? getDistance(userCoords.lat, userCoords.lng, latVal, lngVal)
                      : undefined;
                    return (
                      <RestaurantCard
                        key={restaurant.id}
                        restaurant={restaurant}
                        distanceKm={distance}
                        onSelect={() => setSelectedRestaurant(restaurant)}
                        isSaved={savedRestaurantIds.includes(restaurant.id)}
                        onToggleSave={(e) => {
                          e.stopPropagation();
                          handleToggleSaveRestaurant(restaurant.id);
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Premium Gift Cards Promotional Showcase embedded on Homepage as requested */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" id="home-gift-cards-promo">
              <div className="relative bg-gradient-to-br from-emerald-900 to-emerald-950 border border-emerald-800/80 rounded-3xl p-8 md:p-11 overflow-hidden shadow-md flex flex-col lg:flex-row items-center gap-8 text-left">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.08)_0%,transparent_50%)] pointer-events-none" />
                
                <div className="flex-1 space-y-3.5 z-10 relative">
                  <span className="text-amber-400 text-xs font-mono uppercase tracking-[0.3em] font-extrabold flex items-center gap-1.5 leading-none">
                    <Gift className="w-4 h-4 text-amber-400" />
                    <span>Zaytounada Luxury Vouchers</span>
                  </span>
                  
                  <h3 className="font-serif text-2xl md:text-3.5xl font-light text-white leading-tight uppercase tracking-wider">
                    Give the Ultimate <span className="font-bold text-amber-300">Gourmet Luxury</span> gift card
                  </h3>
                  
                  <p className="text-xs text-emerald-100 font-light max-w-xl leading-relaxed">
                    Surprise your loved ones, coordinate corporate hospitality, or dedicate spectacular anniversaries. Our digital gift vouchers provide instant delivery options and VIP priority bookings at Lebanon's finest starred establishments.
                  </p>

                  <div className="flex items-center gap-6 pt-1.5">
                    <div className="text-left">
                      <span className="text-lg md:text-xl font-mono font-bold text-amber-400">$50–$500</span>
                      <p className="text-[9px] text-emerald-250 uppercase tracking-widest font-mono">Custom Budgets</p>
                    </div>
                    <div className="border-l border-emerald-700 h-8" />
                    <div className="text-left">
                      <span className="text-lg md:text-xl font-serif font-black text-emerald-255 text-emerald-200">Instant</span>
                      <p className="text-[9px] text-emerald-255 uppercase tracking-widest font-mono">Voucher Delivery</p>
                    </div>
                    <div className="border-l border-emerald-700 h-8" />
                    <div className="text-left">
                      <span className="text-lg md:text-xl font-serif font-black text-amber-400">100%</span>
                      <p className="text-[9px] text-emerald-255 uppercase tracking-widest font-mono">Acceptance Rate</p>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => setActiveTab('gift-cards')}
                      className="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:scale-102 cursor-pointer"
                    >
                      Configure Bespoke Voucher NOW
                    </button>
                  </div>
                </div>

                {/* Immersive high-fi interactive Gold voucher layout */}
                <div className="w-80 h-48 shrink-0 relative bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 rounded-2xl p-6 flex flex-col justify-between shadow-2xl border border-white/25 select-none transform rotate-1 hover:rotate-0 transition-transform duration-500 z-10">
                  <div className="absolute inset-0 bg-black/5 rounded-2xl" />
                  <div className="flex justify-between items-start relative z-10 text-emerald-950">
                    <div>
                      <span className="font-serif font-black tracking-widest text-emerald-900 text-xl">Z</span>
                      <p className="text-[6px] tracking-widest text-emerald-950 uppercase font-mono font-bold">ZAYTOUNADA VIP</p>
                    </div>
                    <Gift className="w-5.5 h-5.5 text-emerald-900 opacity-80" />
                  </div>

                  <div className="space-y-1 text-left relative z-10">
                    <p className="text-[7px] text-emerald-950 font-mono tracking-[0.34em] font-extrabold uppercase">GASTRONOMIC GIFT VOUCHER</p>
                    <span className="font-mono text-xl text-emerald-950 font-bold">$250.00</span>
                    <p className="text-[8px] text-emerald-900 font-light italic leading-none truncate pr-4">Valid: Grand Gourmet Tasting Option</p>
                  </div>

                  <div className="flex justify-between items-end text-emerald-900 text-[6px] font-mono tracking-widest relative z-10 uppercase">
                    <div>
                      <p className="opacity-60">ID TICKET</p>
                      <p className="font-bold">ZAYT-GC-482937</p>
                    </div>
                    <div className="text-right">
                      <p className="opacity-60">EXPIRES</p>
                      <p className="font-bold">12/2026</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW: NEIGHBORHOODS MAP & ATLAS */}
        {activeTab === 'neighborhoods' && (
          <NeighborhoodsView
            initialSelectedNeighborhood={selectedNeighborhoodId || undefined}
            savedRestaurantIds={savedRestaurantIds}
            onToggleSave={(id, e) => {
              e.stopPropagation();
              handleToggleSaveRestaurant(id);
            }}
            onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
            onViewOnMap={(neighborhoodId, city) => {
              setSelectedCity(city);
              setFocusedNeighborhoodId(neighborhoodId);
              setActiveTab('map');
            }}
            selectedDistinction={selectedDistinction}
            selectedCuisine={selectedCuisine}
            selectedPrice={selectedPrice}
            selectedDietary={selectedDietary}
            searchQuery={searchQuery}
            selectedCity={selectedCity}
          />
        )}

        {/* VIEW: NEW DEDICATED ZAYTOUNADA CATALOGUE PAGE */}
        {activeTab === 'catalogue' && (
          <div className="animate-fade-in" id="catalogue-view-pane">
            <CategoryHeroSliders 
              onSelectRestaurant={setSelectedRestaurant} 
              savedRestaurantIds={savedRestaurantIds} 
              onToggleSave={(id, e) => {
                e.stopPropagation();
                handleToggleSaveRestaurant(id);
              }}
              onFilterCuisine={(cuisineName) => {
                // Map the descriptive category to active state filters
                if (cuisineName.includes('Haute')) {
                  setSelectedCuisine('Traditional Lebanese Haute Cuisine');
                  setSearchQuery('');
                } else if (cuisineName.includes('Contemporary')) {
                  setSelectedCuisine('Polished Contemporary Lebanese');
                  setSearchQuery('');
                } else if (cuisineName.includes('Seafood')) {
                  setSearchQuery('Seafood');
                  setSelectedCuisine('All Cuisines');
                } else if (cuisineName.includes('Mediterranean')) {
                  setSearchQuery('Mediterranean');
                  setSelectedCuisine('All Cuisines');
                } else if (cuisineName.includes('Armenian')) {
                  setSelectedCuisine('Armenian-Lebanese Homestyle');
                  setSearchQuery('');
                } else if (cuisineName.includes('Bakeries')) {
                  setSearchQuery('Bakeries');
                  setSelectedCuisine('All Cuisines');
                }
                setActiveTab('discovery');
                // Scroll smoothly to the filtering dropdowns
                setTimeout(() => {
                  const dropdownEl = document.getElementById('distinction-dropdown-select');
                  if (dropdownEl) {
                    dropdownEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 150);
              }}
            />
          </div>
        )}

        {/* VIEW 2: MAP PLATFORM */}
        {activeTab === 'map' && (
          <MapView
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
            focusedNeighborhoodId={focusedNeighborhoodId}
            onClearFocusedNeighborhood={() => setFocusedNeighborhoodId(null)}
          />
        )}

        {/* VIEW: CURATION EXPLORER */}
        {activeTab === 'curation-explorer' && (
          <CurationExplorerView
            onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
            onNavigateTab={setActiveTab}
            savedRestaurantIds={savedRestaurantIds}
            onToggleSaveRestaurant={handleToggleSaveRestaurant}
          />
        )}

        {/* VIEW: PLAN MY DINING */}
        {activeTab === 'plan-dining' && (
          <PlanMyDiningView
            onAddBooking={handleAddBooking}
            onNavigateTab={setActiveTab}
            onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
          />
        )}

        {/* VIEW: GIFT CARD CENTER */}
        {activeTab === 'gift-cards' && (
          <GiftCardView />
        )}

        {/* VIEW: LIVE ENTERTAINMENT SHOWS */}
        {activeTab === 'live-shows' && (
          <LiveEntertainmentView
            onAddBooking={handleAddBooking}
            onNavigateTab={setActiveTab}
            onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
          />
        )}

        {/* VIEW: SPECIALTY - PUBS & CAFES */}
        {activeTab === 'pubs-cafes' && (
          <SpecialtySectionView
            category="pub_cafe"
            onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
            savedRestaurantIds={savedRestaurantIds}
            onToggleSaveRestaurant={handleToggleSaveRestaurant}
          />
        )}

        {/* VIEW: SPECIALTY - VIBES */}
        {activeTab === 'vibes' && (
          <SpecialtySectionView
            category="vibe"
            onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
            savedRestaurantIds={savedRestaurantIds}
            onToggleSaveRestaurant={handleToggleSaveRestaurant}
          />
        )}

        {/* VIEW: SPECIALTY - BAKERIES & PRODUCE */}
        {activeTab === 'takeaways-bakeries' && (
          <SpecialtySectionView
            category="takeaway_bakery_produce"
            onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
            savedRestaurantIds={savedRestaurantIds}
            onToggleSaveRestaurant={handleToggleSaveRestaurant}
          />
        )}

        {/* VIEW 3: MAGAZINE EDITORIALS */}
        {activeTab === 'magazine' && (
          <MagazineView 
            selectedArticleId={selectedMagazineArticleId}
            setSelectedArticleId={setSelectedMagazineArticleId}
          />
        )}

        {/* VIEW: CULINARY EVENTS */}
        {activeTab === 'culinary-events' && (
          <CulinaryEventsView />
        )}

        {/* VIEW 4: MY GUIDE & JOURNEY PLANNING */}
        {activeTab === 'my-guide' && (
          <MyGuideView
            savedRestaurantIds={savedRestaurantIds}
            onToggleSave={handleToggleSaveRestaurant}
            revisitRestaurantIds={revisitRestaurantIds}
            onToggleRevisit={handleToggleRevisitRestaurant}
            onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
            savedItineraries={savedItineraries}
            onAddItinerary={handleAddItinerary}
            onDeleteItinerary={handleDeleteItinerary}
            setActiveTab={setActiveTab}
            bookings={bookings}
            onClearBookings={handleClearAllBookings}
            reviews={reviews}
            onOpenReview={handleOpenReview}
            bookingSortOrder={bookingSortOrder}
            setBookingSortOrder={setBookingSortOrder}
          />
        )}

        {/* VIEW: INTEGRATED SOCIAL FIELD & PHOTOS FEED */}
        {activeTab === 'social-feed' && (
          <SocialFeedView 
            onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
          />
        )}

        {/* VIEW 5: MY SAVED CATALOG (BACKUP OR SHORT TAB SELECTION) */}
        {activeTab === 'saved' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="saved-guide-pane">
            <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2 mb-8 border-b border-neutral-200 pb-4 text-left">
              <div>
                <h2 className="font-serif font-light text-3xl text-neutral-900 flex items-center gap-2">
                  <Heart className="w-8 h-8 text-amber-500 fill-amber-500" />
                  <span>My Saved Guides</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-1 tracking-wide">Quick listing of Zaytounada properties marked for your notebook.</p>
              </div>
              <button
                onClick={() => setActiveTab('my-guide')}
                className="flex items-center gap-2 px-4 py-2 bg-transparent border border-emerald-600 text-emerald-700 hover:bg-emerald-700 hover:text-white transition-all text-[10px] uppercase tracking-widest font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Sequence into Travel Itinerary</span>
              </button>
            </div>

            {savedRestaurantIds.length === 0 ? (
              <div className="text-center py-20 bg-neutral-50 border border-neutral-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
                <Heart className="w-16 h-16 text-neutral-200 mb-3" />
                <p className="font-serif italic text-lg text-neutral-800">No Selections Saved</p>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm leading-relaxed">
                  You haven't notebooked a gastronomy spot yet. Touch the heart button on restaurant cards to collect.
                </p>
                <button
                  onClick={() => setActiveTab('discovery')}
                  className="mt-6 px-5 py-3 border border-emerald-600 text-emerald-700 text-[10px] uppercase tracking-[0.3em] font-bold bg-transparent hover:bg-emerald-700 hover:text-white transition-all cursor-pointer shadow-md"
                >
                  Browse Culinary Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {restaurants.filter(r => savedRestaurantIds.includes(r.id)).map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onSelect={() => setSelectedRestaurant(restaurant)}
                    isSaved={true}
                    onToggleSave={(e) => {
                      e.stopPropagation();
                      handleToggleSaveRestaurant(restaurant.id);
                    }}
                  />
                ))}
              </div>
            )}

            {/* My Active Bookings Dashboard Widget */}
            <div className="mt-12 bg-neutral-50 border border-neutral-200 rounded-xl p-6 md:p-8 text-left h-auto shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-200 pb-4 mb-5">
                <div>
                  <h3 className="font-serif font-light text-xl text-neutral-900 flex items-center gap-2 uppercase tracking-wide">
                    <Calendar className="w-5.5 h-5.5 text-emerald-600" />
                    <span>Active Bookings Dashboard</span>
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Summary of tables requested through the Gourmet Booking Desk.</p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  {bookings.length > 0 && (
                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-neutral-200 shadow-3xs">
                      <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest leading-none select-none">Sort Date:</span>
                      <select
                        value={bookingSortOrder}
                        onChange={(e) => setBookingSortOrder(e.target.value as 'chrono' | 'reverse-chrono')}
                        className="text-[10px] font-mono uppercase bg-transparent text-neutral-75 border-none outline-none cursor-pointer hover:text-emerald-700 transition-colors"
                      >
                        <option value="chrono" className="text-neutral-900 bg-white">Earliest First</option>
                        <option value="reverse-chrono" className="text-neutral-900 bg-white">Latest First</option>
                      </select>
                    </div>
                  )}

                  {bookings.length > 0 && (
                    <button
                      onClick={handleClearAllBookings}
                      className="text-[10px] text-neutral-400 hover:text-emerald-700 font-mono uppercase tracking-widest cursor-pointer select-none"
                    >
                      Clear Booking Records
                    </button>
                  )}
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className="py-8 font-serif italic text-neutral-400 text-center text-sm">
                  No allocation bookings initiated yet. Book from a restaurant's detail report modal first.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...bookings]
                    .sort((a, b) => {
                      const dateCompare = a.date.localeCompare(b.date);
                      if (dateCompare !== 0) {
                        return bookingSortOrder === 'chrono' ? dateCompare : -dateCompare;
                      }
                      return bookingSortOrder === 'chrono' 
                        ? a.time.localeCompare(b.time) 
                        : b.time.localeCompare(a.time);
                    })
                    .map((book) => {
                      const review = reviews[book.id];
                    return (
                      <div 
                        key={book.id} 
                        className="p-4.5 bg-white border border-neutral-200 shadow-sm rounded-lg flex flex-col justify-between gap-4 text-left"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-[8px] font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-250 font-bold px-1.5 py-0.5 rounded tracking-wider">
                              ALLOCATED TICKET
                            </span>
                            <h4 className="font-serif font-bold text-sm text-emerald-950 mt-1.5">
                              {book.restaurantName}
                            </h4>
                            <p className="text-[10px] text-neutral-600 mt-0.5">
                              Date: {book.date} • {book.time}
                            </p>
                            <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                              Party: {book.guestsCount} Guest{book.guestsCount > 1 ? 's' : ''} • {book.userName}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[9px] font-mono text-neutral-400 uppercase font-bold block mb-1 tracking-wider">Status</span>
                            <span className="text-[9px] uppercase font-bold text-white bg-emerald-700 px-2.5 py-1 rounded inline-block font-mono tracking-widest leading-none select-none">
                              {book.status}
                            </span>
                          </div>
                        </div>

                        {review && (
                          <div className="pt-2.5 border-t border-dotted border-neutral-200">
                            <div className="flex items-center gap-1">
                              <span className="text-amber-500 font-serif font-bold tracking-tight text-xs leading-none">
                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                              </span>
                              <span className="text-[8px] font-mono uppercase text-neutral-400 font-bold tracking-wider ml-1">My Review</span>
                            </div>
                            <p className="text-[10px] italic text-neutral-600 font-serif leading-relaxed mt-1">
                              "{review.comment}"
                            </p>
                            {review.signatureDish && (
                              <div className="mt-2 flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-800 px-2 py-1 rounded text-[9.5px] font-mono w-fit shadow-3xs animate-fade-in">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                                <span>Signature Dish: <strong className="font-extrabold">{review.signatureDish}</strong></span>
                              </div>
                            )}
                            {review.photo && (
                              <div className="mt-2 text-left">
                                <img 
                                  src={review.photo} 
                                  alt="User review attachment" 
                                  className="max-h-36 w-auto rounded-lg border border-neutral-200 object-cover shadow-3xs"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            )}
                          </div>
                        )}

                        <div className="border-t border-neutral-100 pt-3 flex justify-end gap-2.5">
                          <button
                            onClick={() => handleOpenReview(book)}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-red-500 hover:bg-red-600 hover:text-white text-red-650 transition-all text-[9.5px] font-bold uppercase tracking-widest cursor-pointer rounded bg-white shadow-3xs"
                          >
                            <Star className="w-3.5 h-3.5 text-red-500 fill-current block shrink-0" />
                            <span>{review ? 'Edit Review' : 'Review Visit'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 6: GET STARTED & GDPR RESOURCES */}
        {activeTab === 'get-started' && (
          <GetStartedView
            onNavigateTab={setActiveTab}
            onOpenConcierge={() => setIsConciergeActive(true)}
          />
        )}

        {/* VIEW: ONBOARD AND REGISTER IN THE DISCOUNTS LOYALTY CARD PUSH SYSTEM */}
        {activeTab === 'suppliers' && (
          <SupplierOnboardingView />
        )}

        {/* VIEW: MERCHANT OFFERS & LOYALTY ECOSYSTEM */}
        {activeTab === 'merchant-offers' && (
          <MerchantOfferLoyaltyView setActiveTab={setActiveTab} />
        )}

        {/* VIEW: ADMIN LOCKBOX DASHBOARD */}
        {activeTab === 'admin' && (
          <AdminDashboardView onRestaurantsUpdated={fetchRestaurants} />
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-neutral-50 border-t border-neutral-200 py-10 px-6 md:px-10 text-[10px] uppercase tracking-[0.1em] text-neutral-500 shrink-0 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-3.5 text-left">
            <div className="font-serif text-sm tracking-widest font-extrabold text-neutral-900">
              ZAYTOUNADA <span className="text-red-650">GUIDE</span>
            </div>
            <p className="normal-case tracking-normal text-xs text-neutral-500 font-light font-serif italic max-w-sm leading-relaxed">
              The discrete, curated record of exceptional culinary craft, historic milestones, and elite dining outposts across Lebanon.
            </p>
            <div className="text-[9px] text-neutral-400 tracking-[0.2em] pt-1">
              © 2026 ZAYTOUNADA GUIDE DIGITAL • ALL RIGHTS RESERVED
            </div>
          </div>

          {/* Directory Links Col */}
          <div className="md:col-span-2 space-y-2 text-left">
            <span className="text-[9px] font-mono tracking-[0.2em] font-extrabold text-neutral-400 block mb-3">
              DIRECTORY LINKS
            </span>
            <div className="flex flex-col gap-2 font-mono text-[9px] font-bold tracking-widest">
              <span onClick={() => setActiveTab('get-started')} className="hover:text-red-650 transition-colors cursor-pointer w-fit">Privacy & terms</span>
              <span onClick={() => setActiveTab('get-started')} className="hover:text-red-650 transition-colors cursor-pointer w-fit">Cookies Manager</span>
              <span onClick={() => setActiveTab('suppliers')} className="hover:text-red-650 transition-colors cursor-pointer text-emerald-800 font-bold w-fit">FAQ & Partners (Join Us)</span>
            </div>
          </div>

          {/* Social Channels Col */}
          <div className="md:col-span-2 space-y-2 text-left">
            <span className="text-[9px] font-mono tracking-[0.2em] font-extrabold text-neutral-400 block mb-3">
              FOLLOW US
            </span>
            <div className="flex gap-4 items-center">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                id="social-instagram-link"
                onClick={() => handleSocialClick('Instagram')}
                className="p-2 border border-neutral-200 rounded-full hover:border-red-650 hover:text-red-650 hover:scale-105 active:scale-95 transition-all text-neutral-500 bg-white hover:-translate-y-0.5 cursor-pointer flex items-center justify-center shadow-3xs"
                title="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                id="social-facebook-link"
                onClick={() => handleSocialClick('Facebook')}
                className="p-2 border border-neutral-200 rounded-full hover:border-red-650 hover:text-red-650 hover:scale-105 active:scale-95 transition-all text-neutral-500 bg-white hover:-translate-y-0.5 cursor-pointer flex items-center justify-center shadow-3xs"
                title="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                id="social-linkedin-link"
                onClick={() => handleSocialClick('LinkedIn')}
                className="p-2 border border-neutral-200 rounded-full hover:border-red-650 hover:text-red-650 hover:scale-105 active:scale-95 transition-all text-neutral-500 bg-white hover:-translate-y-0.5 cursor-pointer flex items-center justify-center shadow-3xs"
                title="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="normal-case tracking-normal text-[9px] text-neutral-400 font-light pt-1 select-none">
              Stay in touch with our curations.
            </p>
            
            {/* Highly Prominent Footer WhatsApp CTA Button */}
            <div className="pt-2">
              <a 
                href="https://chat.whatsapp.com/KpV2Ecmc7IM8CVBjICddDC"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleSocialClick('WhatsApp Group')}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-[8.5px] uppercase tracking-wider rounded-lg transition-all shadow-xs cursor-pointer hover:scale-102 active:scale-98"
                id="footer-whatsapp-btn"
                title="Join our WhatsApp community"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.182 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.118-2.905-6.993C16.557 1.873 14.087 1.815 12.013 1.815c-5.44 0-9.863 4.418-9.867 9.863-.002 1.93.504 3.804 1.466 5.424l-.963 3.516 3.6-.944z"/>
                </svg>
                <span>Join Community</span>
              </a>
            </div>
          </div>

          {/* Newsletter Signup Col */}
          <div className="md:col-span-4 text-left space-y-2.5">
            <span className="text-[9px] font-mono tracking-[0.2em] font-extrabold text-red-650 block mb-2">
              💌 WEEKLY GASTRONOMIC ROUNDUP
            </span>
            <p className="normal-case tracking-normal text-[11px] text-neutral-500 max-w-xs leading-normal font-light">
              Submit your email for weekly briefings, newly rated establishments, recipes, and exclusive culinary reports.
            </p>
            <form 
              onSubmit={handleFooterSubscribe}
              className="space-y-2 max-w-xs pt-1"
              id="footer-newsletter-form"
            >
              <div className="relative">
                <input
                  type="email"
                  name="footer_email"
                  value={footerEmail}
                  onChange={(e) => {
                    setFooterEmail(e.target.value);
                    if (footerStatus === 'error') setFooterStatus('idle');
                  }}
                  placeholder="Enter your email address..."
                  className="w-full px-3 py-2 text-xs border border-neutral-255 bg-white text-neutral-900 rounded focus:outline-none focus:border-red-650 placeholder-neutral-450 font-mono normal-case tracking-normal"
                />
                {footerStatus === 'success' && (
                  <span className="absolute right-2.5 top-2.5 text-emerald-600 font-mono text-[9px] font-bold tracking-wider">
                    ✓ SAVED
                  </span>
                )}
              </div>
              
              {footerErrorMessage && (
                <p className="normal-case tracking-normal text-[10px] text-red-600 font-medium font-sans">
                  ⚠️ {footerErrorMessage}
                </p>
              )}

              {footerStatus === 'success' && (
                <p className="normal-case tracking-normal text-[10px] text-emerald-700 font-bold font-sans">
                  Thank you! You have subscribed to our weekly roundups.
                </p>
              )}

              <button
                type="submit"
                disabled={footerStatus === 'submitting'}
                className="w-full py-2 bg-neutral-950 hover:bg-neutral-900 disabled:bg-neutral-400 text-white font-mono font-bold text-[9px] uppercase tracking-widest rounded transition-all cursor-pointer shadow-3xs"
              >
                {footerStatus === 'submitting' ? 'Vetting Email...' : 'Subscribe To Roundup'}
              </button>
            </form>
          </div>
        </div>
      </footer>

      {/* INSPECTOR DETAIL MODAL COMPONENT */}
      {selectedRestaurant && (
        <RestaurantDetailModal
          restaurant={selectedRestaurant}
          onClose={handleCloseDetailModal}
          isSaved={savedRestaurantIds.includes(selectedRestaurant.id)}
          onToggleSave={() => handleToggleSaveRestaurant(selectedRestaurant.id)}
          onAddBooking={handleAddBooking}
        />
      )}

      {/* AI COUNSELOR CHAT OVERLAY COMPONENT */}
      <AIConcierge
        isOpen={isConciergeActive}
        onClose={() => setIsConciergeActive(false)}
        savedRestaurants={restaurants.filter(r => savedRestaurantIds.includes(r.id)).map(r => ({
          id: r.id,
          name: r.name,
          city: r.city,
          cuisine: r.cuisine,
          stars: r.stars
        }))}
      />

      {/* DINER REVIEW SUBMISSION MODAL */}
      {reviewModalBooking && (
        <div 
          className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
          id="booking-review-modal"
        >
          <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up text-left">
            {/* Modal Header */}
            <div className="bg-neutral-50 px-6 py-4.5 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <span className="text-[8px] font-mono uppercase bg-red-50 text-red-650 border border-red-200 px-2 py-0.5 rounded font-bold tracking-widest leading-none">
                  Gourmet Feedback
                </span>
                <h3 className="font-serif font-bold text-base text-neutral-900 mt-1">
                  Review Your Experience
                </h3>
              </div>
              <button
                onClick={() => {
                  handleStopCamera();
                  setReviewModalBooking(null);
                }}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 hover:bg-neutral-100 rounded-full cursor-pointer transition-colors"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
              <div>
                <p className="text-xs text-neutral-500 font-light mb-3">
                  Share your culinary feedback on your reservation at <strong className="text-neutral-800 font-semibold">{reviewModalBooking.restaurantName}</strong> (Party of {reviewModalBooking.guestsCount} on {reviewModalBooking.date}).
                </p>
              </div>

              {/* Star Rating Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Star Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setReviewRating(stars)}
                      className="p-1 cursor-pointer hover:scale-110 active:scale-90 transition-all text-amber-400"
                      title={`${stars} Star${stars > 1 ? 's' : ''}`}
                    >
                      <Star 
                        className={`w-7 h-7 ${
                          stars <= reviewRating 
                            ? 'fill-amber-400 text-amber-500' 
                            : 'text-neutral-250 fill-transparent'
                        }`} 
                      />
                    </button>
                  ))}
                  <span className="text-[11px] font-mono text-neutral-400 font-bold ml-2">
                    ({reviewRating}/5 Stars)
                  </span>
                </div>
              </div>

              {/* Signature Dish Selector */}
              {currentRestForReview && currentRestForReview.signatureDishes && currentRestForReview.signatureDishes.length > 0 && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                    <span>Signature Dish tried (Optional)</span>
                  </label>
                  <p className="text-[9.5px] text-neutral-500 font-light leading-snug">
                    Feature a landmark signature dish in your culinary review:
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {currentRestForReview.signatureDishes.map((dish) => {
                      const isSelected = reviewSignatureDish === dish;
                      return (
                        <button
                          key={dish}
                          type="button"
                          onClick={() => setReviewSignatureDish(isSelected ? null : dish)}
                          className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-all border text-left flex items-center gap-1.5 select-none ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold shadow-xs'
                              : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-300'}`}></span>
                          <span>{dish}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Written Comment/Review feedback */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Commentary & Notes
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Elaborate on the service, flavor profile, signature dishes, ambiance, or overall impression..."
                  className="w-full text-xs px-3 py-2.5 border border-neutral-250 bg-white text-neutral-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-650 placeholder-neutral-450 resize-none leading-relaxed"
                />
              </div>

              {/* Photo & Camera Attachment */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Visual Feedback (Optional)
                </label>
                
                {reviewPhoto ? (
                  <div className="relative border border-emerald-100 rounded-lg p-2.5 bg-emerald-50/20 flex items-center justify-between gap-3 animate-fade-in">
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={reviewPhoto} 
                        alt="Review snapshot" 
                        className="w-14 h-14 rounded-md object-cover border border-emerald-200 shrink-0 shadow-xs" 
                      />
                      <div className="min-w-0">
                        <p className="text-[10px] text-neutral-800 font-bold uppercase tracking-wider truncate flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>Photo Attached & Optimized</span>
                        </p>
                        {photoOptimizationInfo ? (
                          <p className="text-[8.5px] text-emerald-805 font-mono leading-relaxed mt-0.5">
                            Ready for instant upload: <strong className="font-extrabold text-emerald-900">{photoOptimizationInfo.optimizedSize}</strong>
                            <br />
                            <span className="text-neutral-500">Compressed by {photoOptimizationInfo.reductionPercent}% (down from {photoOptimizationInfo.originalSize})</span>
                          </p>
                        ) : (
                          <p className="text-[8.5px] text-neutral-400 font-mono mt-0.5">Compressed & ready to publish with review</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setReviewPhoto(null); setPhotoOptimizationInfo(null); }}
                      className="p-1 px-2 border border-red-200 hover:bg-red-50 hover:border-red-400 text-red-650 text-[9px] font-mono font-bold uppercase tracking-widest rounded transition-all cursor-pointer shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ) : isCameraActive ? (
                  <div className="border border-neutral-200 bg-neutral-950 rounded-lg overflow-hidden relative">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full aspect-video object-cover" 
                    />
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={handleCapturePhoto}
                        className="px-3 py-1.5 bg-red-650 hover:bg-red-750 text-white font-mono font-bold uppercase tracking-widest text-[9px] rounded-full flex items-center gap-1 cursor-pointer transition-all shadow-md"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Snap Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleStopCamera}
                        className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white font-mono font-bold uppercase tracking-widest text-[9px] rounded-full flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleStartCamera}
                      className="flex flex-col items-center justify-center p-3 border border-dashed border-neutral-250 hover:border-red-500 bg-white hover:bg-red-50/10 text-neutral-650 hover:text-red-750 rounded-lg transition-all cursor-pointer group"
                    >
                      <Camera className="w-5 h-5 mb-1 text-neutral-400 group-hover:text-red-500 transition-colors" />
                      <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider">Use Camera</span>
                    </button>
                    
                    <label className="flex flex-col items-center justify-center p-3 border border-dashed border-neutral-250 hover:border-red-500 bg-white hover:bg-red-50/10 text-neutral-650 hover:text-red-750 rounded-lg transition-all cursor-pointer group">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoUpload} 
                        className="hidden" 
                      />
                      <Upload className="w-5 h-5 mb-1 text-neutral-400 group-hover:text-red-500 transition-colors" />
                      <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider">Upload File</span>
                    </label>
                  </div>
                )}
                
                {cameraError && (
                  <p className="text-[9px] text-red-600 font-mono italic">
                    ⓘ {cameraError}
                  </p>
                )}
              </div>

              {/* Future Planning / Favorite Toggles */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <label className="block text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">
                  Future Planning
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleSaveRestaurant(reviewModalBooking.restaurantId)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 border rounded-xl text-xs font-serif transition-all cursor-pointer ${
                      savedRestaurantIds.includes(reviewModalBooking.restaurantId)
                        ? 'border-red-200 bg-red-50/50 text-red-700 font-medium shadow-xs'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${
                      savedRestaurantIds.includes(reviewModalBooking.restaurantId) ? 'fill-current text-red-600 animate-pulse' : 'text-neutral-400'
                    }`} />
                    <span>{savedRestaurantIds.includes(reviewModalBooking.restaurantId) ? 'Saved Favorite' : 'Mark as Favorite'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleRevisitRestaurant(reviewModalBooking.restaurantId)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 border rounded-xl text-xs font-serif transition-all cursor-pointer ${
                      revisitRestaurantIds.includes(reviewModalBooking.restaurantId)
                        ? 'border-emerald-200 bg-emerald-50/50 text-emerald-800 font-medium shadow-xs'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${
                      revisitRestaurantIds.includes(reviewModalBooking.restaurantId) ? 'fill-current text-emerald-600' : 'text-neutral-400'
                    }`} />
                    <span>{revisitRestaurantIds.includes(reviewModalBooking.restaurantId) ? 'Saved Revisit' : 'Plan to Revisit'}</span>
                  </button>
                </div>
              </div>

              {/* Actions buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    handleStopCamera();
                    setReviewModalBooking(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 border border-neutral-250 text-neutral-600 font-bold hover:bg-neutral-50 transition-all text-[10px] uppercase tracking-widest cursor-pointer rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 bg-neutral-950 text-white font-mono font-bold hover:bg-neutral-900 transition-all text-[10px] uppercase tracking-widest cursor-pointer rounded shadow-sm hover:shadow-md"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification Container with elegant entry/exit animation details */}
      {toast.visible && (
        <div 
          className="fixed bottom-6 left-1/2 -translate-x-1/2 md:bottom-auto md:top-6 md:left-auto md:translate-x-0 md:right-6 z-[9999] px-4 py-3 bg-neutral-900 border border-neutral-850 text-neutral-100 rounded-xl shadow-2xl flex items-center justify-between gap-3 animate-fade-in animate-slide-up select-none min-w-[280px] max-w-sm"
          id="toast-notification"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            </span>
            <div className="text-[11.5px] font-mono uppercase tracking-wider font-semibold text-neutral-100">
              {toast.message}
            </div>
          </div>
          <button
            onClick={() => setToast(prev => ({ ...prev, visible: false }))}
            className="text-neutral-455 hover:text-white p-1 hover:bg-neutral-800 rounded transition-colors cursor-pointer"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* FLOATING ACTION: BACK TO TOP */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-11 h-11 bg-neutral-950 hover:bg-neutral-900 text-white border border-neutral-850 rounded-full flex items-center justify-center cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group ${
          showScrollTop ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
        }`}
        id="floating-back-to-top"
      >
        <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-300" />
      </button>

    </div>
  );
}
