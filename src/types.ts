export interface Restaurant {
  id: string;
  name: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
    x: number; // For clean relative visual 2D mapping (0-100)
    y: number; // For clean relative visual 2D mapping (0-100)
  };
  stars: number; // 1, 2, 3 or 0 for Bib Gourmand / Recommended
  distinction: 'STAR_1' | 'STAR_2' | 'STAR_3' | 'BIB_GOURMAND' | 'SELECTED';
  priceRange: '$$$$' | '$$$' | '$$' | '$';
  cuisine: string;
  address: string;
  phone: string;
  website: string;
  chef: string;
  description: string;
  inspectorNote: string;
  signatureDishes: string[];
  imageUrl: string;
  images: string[];
  features: string[];
  instagram?: string;
  facebook?: string;
  category?: 'fine_dining' | 'pub_cafe' | 'vibe' | 'takeaway_bakery_produce';
  neighborhood?: 'hamra' | 'mar_mikhael' | 'sassine' | 'sodeco' | 'badaro' | 'antelias';
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  imageUrl: string;
  date: string;
  author: string;
  content: string[];
  website?: string;
}

export interface SavedItinerary {
  id: string;
  title: string;
  cityName: string;
  tripDate: string;
  restaurantIds: string[];
  notes: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface Booking {
  id: string;
  restaurantId: string;
  restaurantName: string;
  userName: string;
  userEmail: string;
  guestsCount: number;
  date: string;
  time: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed';
}

export interface CulinaryEvent {
  id: string;
  title: string;
  description: string;
  excerpt: string; // Excerpt for WhatsApp sharing
  date: string;
  timeString: string;
  venueName: string;
  city: string;
  neighborhood?: 'hamra' | 'mar_mikhael' | 'sassine' | 'sodeco' | 'badaro' | 'antelias';
  coordinates: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  ticketPrice: string;
  organizer: string;
  tags?: string[];
}

