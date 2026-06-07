import React, { useState, useEffect, useMemo, FormEvent } from 'react';
import { Restaurant } from '../types';
import { RESTAURANTS } from '../data/restaurants';
import { Instagram, Facebook, Heart, MessageCircle, Send, MapPin, Compass, Search, RefreshCw, Sparkles, Plus, Check, Award, Flame, Star } from 'lucide-react';
import { showToast } from '../utils/toast';

interface SocialFeedViewProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

interface SocialPost {
  id: string;
  restaurantId?: string;
  platform: 'instagram' | 'facebook' | 'linkedin';
  handle: string;
  imageUrl: string;
  caption: string;
  likes: number;
  commentsCount: number;
  date: string;
  location: string;
  userLiked?: boolean;
}

export default function SocialFeedView({ onSelectRestaurant }: SocialFeedViewProps) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Simulating user comments state
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [postComments, setPostComments] = useState<Record<string, { author: string; text: string; date: string }[]>>({
    'post-1': [
      { author: 'GourmetBeirut', text: 'Literally the best mezza in Lebanon! Mireille Hayek is a legend.', date: 'Just now' },
      { author: 'ChicTraveler', text: 'That presentation is stunning. Worth every Zaytounada Star!', date: '3m ago' }
    ],
    'post-2': [
      { author: 'SumacLover', text: 'Sumac on sea bass is a game-changer.', date: '1h ago' },
      { author: 'CoastalGipsy', text: 'Batroun sunsets cannot be beaten 🌅', date: '2h ago' }
    ]
  });

  // Simulator Modal State to add a custom Moment
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [simPlatform, setSimPlatform] = useState<'instagram' | 'facebook'>('instagram');
  const [simRestaurantId, setSimRestaurantId] = useState<string>(RESTAURANTS[0]?.id || '');
  const [simCaption, setSimCaption] = useState<string>('');
  const [simImageUrl, setSimImageUrl] = useState<string>('');
  const [simLocation, setSimLocation] = useState<string>('');
  const [simSuccessMessage, setSimSuccessMessage] = useState<string>('');

  // Predefined gorgeous high-quality gastronomy imagery options for simulation
  const SIM_IMAGE_PRESETS = [
    { name: 'Gourmet Hummus', url: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=600' },
    { name: 'Fresh Seafood', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600' },
    { name: 'Charcoal Grill skewers', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600' },
    { name: 'Oven Flatbread / Manousheh', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600' },
    { name: 'Sweet Ashta & Pistachio', url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600' }
  ];

  // Initialize sim form defaults
  useEffect(() => {
    if (RESTAURANTS.length > 0) {
      setSimRestaurantId(RESTAURANTS[0].id);
      setSimLocation(`${RESTAURANTS[0].name}, ${RESTAURANTS[0].city}`);
    }
    setSimImageUrl(SIM_IMAGE_PRESETS[0].url);
  }, []);

  const handleSimRestaurantChange = (id: string) => {
    setSimRestaurantId(id);
    const rest = RESTAURANTS.find(r => r.id === id);
    if (rest) {
      setSimLocation(`${rest.name}, ${rest.city}`);
    }
  };

  const fetchSocialMoments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/social-moments');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          // Map to match interface and enrich with restaurant metadata if available
          const mapped: SocialPost[] = data.map((item: any) => {
            // Try to match handle to a restaurant
            const matchedRest = RESTAURANTS.find(r => 
              (r.instagram && item.handle.toLowerCase().includes(r.instagram.toLowerCase())) ||
              (r.facebook && item.handle.toLowerCase().includes(r.facebook.toLowerCase())) ||
              item.caption.toLowerCase().includes(r.name.toLowerCase())
            );

            return {
              id: item.id,
              restaurantId: matchedRest ? matchedRest.id : undefined,
              platform: item.platform || 'instagram',
              handle: item.handle,
              imageUrl: item.imageUrl,
              caption: item.caption,
              likes: item.likes || 150,
              commentsCount: item.commentsCount || 12,
              date: item.date || 'June 2026',
              location: item.location || 'Lebanon',
              userLiked: false
            };
          });
          setPosts(mapped);
        } else {
          // Generate realistic dynamic fallback moments from current restaurants catalog
          generateFallbackPosts();
        }
      } else {
        generateFallbackPosts();
      }
    } catch (err) {
      console.error("Failed to load social feed API:", err);
      generateFallbackPosts();
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackPosts = () => {
    const fallbackList: SocialPost[] = [
      {
        id: "post-1",
        restaurantId: "rest-1",
        platform: "instagram",
        handle: "@emsherifrestaurant",
        imageUrl: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=600",
        caption: "The performance on a plate is purely theatrical 🎭 The legendary mezza feast in local gardens remains an absolute peak of Lebanese heritage and hospitality. ✻✻✻ (3 Zaytounada Stars) #BeirutDining #LebaneseMezza #TraditionalGourmet #ZaytounadaStars",
        likes: 1240,
        commentsCount: 42,
        date: "June 5, 2026",
        location: "Em Sherif, Ashrafieh"
      },
      {
        id: "post-2",
        restaurantId: "rest-3",
        platform: "facebook",
        handle: "Babel Bahr",
        imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600",
        caption: "Sunset overlooking the wild Batroun waves. Grilled sea bass seasoned with mountain sumac and olive oil. Pure coastal perfection curated for true epicureans. ✻ (1 Zaytounada Star) #Summervibes #BatrounCoast #LocalWildCatch",
        likes: 852,
        commentsCount: 19,
        date: "June 3, 2026",
        location: "Babel Bahr, Byblos"
      },
      {
        id: "post-3",
        restaurantId: "rest-6",
        platform: "instagram",
        handle: "@baronbeirut",
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600",
        caption: "High-heat wood fire drama in Mar Mikhael 🔥 Slow-roasted organic baby carrots with salted butter, tahini yogurt, and wild tarragon. Voted Beirut's ultimate culinary design plate! #WoodfireKitchen #Bistronomy #MarMikhael #BaronBeirut",
        likes: 914,
        commentsCount: 28,
        date: "June 2, 2026",
        location: "Baron, Mar Mikhael"
      },
      {
        id: "post-4",
        restaurantId: "rest-2",
        platform: "instagram",
        handle: "@lizabeirut",
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600",
        caption: "Dine inside Beirut's aristocratic heritage backyard. Offering organic high-culinary Levant fusion amidst contemporary Lebanese artwork. #LizaBeirut #PalaceDining #SursockStreet #LevantineGourmet",
        likes: 672,
        commentsCount: 22,
        date: "May 30, 2026",
        location: "Liza, Sursock Achrafieh"
      }
    ];
    setPosts(fallbackList);
  };

  useEffect(() => {
    fetchSocialMoments();
  }, []);

  // Add simulated social moments on top of current feed
  const handleLikePost = (postId: string) => {
    console.log(`[Analytics] Social Post Like Incremented | PostId: ${postId}`);
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLikedNow = !post.userLiked;
        return {
          ...post,
          userLiked: isLikedNow,
          likes: isLikedNow ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  // Submit a dynamic live simulator post
  const handleAddSimulatorPost = (e: FormEvent) => {
    e.preventDefault();
    if (!simCaption.trim()) return;

    const matchedRest = RESTAURANTS.find(r => r.id === simRestaurantId);
    let handle = simPlatform === 'instagram' ? '@gourmet_insider' : 'Gourmet Insider Review';
    if (matchedRest) {
      if (simPlatform === 'instagram') {
        handle = matchedRest.instagram || `@${matchedRest.name.toLowerCase().replace(/\s+/g, '')}`;
      } else {
        handle = matchedRest.facebook || matchedRest.name;
      }
    }

    const newPost: SocialPost = {
      id: `sim-${Date.now()}`,
      restaurantId: simRestaurantId,
      platform: simPlatform,
      handle: handle,
      imageUrl: simImageUrl,
      caption: simCaption,
      likes: Math.floor(Math.random() * 80) + 120,
      commentsCount: 0,
      date: "Just now",
      location: simLocation || 'Lebanon',
      userLiked: false
    };

    setPosts(prev => [newPost, ...prev]);
    setSimCaption('');
    setSimSuccessMessage('Excellent! Your simulated live update has been published to the interactive feed.');
    
    setTimeout(() => {
      setSimSuccessMessage('');
      setIsSimulatorOpen(false);
    }, 2500);
  };

  // Handle comment submission
  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;
    const author = 'MyGourmetDiary';
    const commentsList = postComments[postId] || [];
    const updatedComments = [
      ...commentsList,
      { author, text: newCommentText.trim(), date: 'Just now' }
    ];

    setPostComments(prev => ({
      ...prev,
      [postId]: updatedComments
    }));

    // Update comment counter in original post state
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1
        };
      }
      return p;
    }));

    setNewCommentText('');
  };

  // Clean computed state for filtering
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Filter by associated restaurant if selected
      if (selectedRestaurantId !== 'all' && post.restaurantId !== selectedRestaurantId) {
        return false;
      }

      // Filter by social platform
      if (selectedPlatform !== 'all' && post.platform !== selectedPlatform) {
        return false;
      }

      // Filter by text query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return post.caption.toLowerCase().includes(query) || 
               post.location.toLowerCase().includes(query) ||
               post.handle.toLowerCase().includes(query);
      }

      return true;
    });
  }, [posts, selectedRestaurantId, selectedPlatform, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="social-feed-view">
      {/* Title & Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-100 pb-6 mb-8 text-left">
        <div>
          <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-250 font-extrabold px-2.5 py-1 rounded tracking-[0.25em] inline-block mb-2 shadow-3xs leading-none">
            📸 Live Social Vetting
          </span>
          <h2 className="font-serif font-light text-3xl sm:text-4xl text-neutral-950 uppercase tracking-wide leading-none">
            Social <span className="font-semibold text-emerald-800">Moments & Updates</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-2 font-serif italic max-w-2xl leading-relaxed">
            Real-time visual feeds, culinary updates, and direct community posts fetched from vetted gastronomy profiles in Lebanon. Look at what's hot right now!
          </p>
        </div>

        {/* Action Controls: Simulate a Live Post */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-800 text-white font-mono font-bold text-xs uppercase tracking-widest hover:bg-emerald-900 active:scale-95 transition-all rounded shadow-md cursor-pointer"
            id="open-feed-simulator-btn"
          >
            <Plus className="w-4 h-4 animate-bounce text-amber-350" />
            <span>Publish Update</span>
          </button>

          <button
            onClick={fetchSocialMoments}
            className="p-3 border border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/60 active:rotate-180 transition-all duration-550 rounded inline-flex items-center justify-center cursor-pointer shadow-3xs"
            title="Refresh Feed"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Controls Bar: Search & Restaurant Filter & Social Platform Selection */}
      <div className="bg-emerald-50/20 border border-emerald-100/60 p-4 rounded-xl mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-left">
        <div className="flex flex-wrap items-center gap-3">
          {/* Restaurant filter dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-[8.5px] font-mono text-emerald-800 uppercase tracking-widest font-black">Associated Establishment</label>
            <select
              value={selectedRestaurantId}
              onChange={(e) => setSelectedRestaurantId(e.target.value)}
              className="text-xs font-semibold uppercase bg-white border border-emerald-200 text-emerald-950 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 cursor-pointer shadow-3xs appearance-none pr-8 relative min-w-[200px]"
            >
              <option value="all">⭐ All Gourmet Establishments</option>
              {RESTAURANTS.map(rest => (
                <option key={rest.id} value={rest.id}>
                  {rest.stars > 0 ? '★'.repeat(rest.stars) + ' ' : ''}{rest.name} ({rest.city})
                </option>
              ))}
            </select>
          </div>

          {/* Social Media network filter buttons */}
          <div className="flex flex-col gap-1">
            <label className="text-[8.5px] font-mono text-emerald-800 uppercase tracking-widest font-black">Social Network</label>
            <div className="flex bg-white rounded-lg p-1 border border-emerald-200 shadow-3xs">
              {[
                { label: 'All Channels', value: 'all' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'Facebook', value: 'facebook' }
              ].map(plat => (
                <button
                  key={plat.value}
                  onClick={() => setSelectedPlatform(plat.value)}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedPlatform === plat.value
                      ? 'bg-emerald-750 bg-emerald-700 text-white shadow-3xs'
                      : 'text-emerald-900 hover:bg-emerald-50'
                  }`}
                >
                  {plat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Keyword Search Filter input */}
        <div className="flex flex-col gap-1 w-full lg:w-72">
          <label className="text-[8.5px] font-mono text-emerald-800 uppercase tracking-widest font-black">Keyword Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 w-4 h-4" />
            <input
              type="text"
              placeholder="Filter by hashtags or words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-8 py-2 border border-emerald-200 bg-white text-emerald-950 placeholder-emerald-950/40 rounded-lg focus:outline-none focus:border-emerald-600 shadow-3xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs cursor-pointer font-bold font-mono"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center">
          <RefreshCw className="w-10 h-10 text-emerald-700 animate-spin mb-3" />
          <p className="font-serif italic text-neutral-500">Retrieving culinary updates and live image feeds...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-20 text-center bg-neutral-50 border border-neutral-250 rounded-2xl p-6">
          <Instagram className="w-12 h-12 text-neutral-350 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-neutral-800">No matching updates found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 leading-relaxed">
            There are no live posts matching your current filters. Try resetting the filters or simulating a new live upload!
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSelectedRestaurantId('all');
                setSelectedPlatform('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 border border-emerald-600 text-emerald-700 text-[10px] uppercase font-bold bg-white rounded cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setIsSimulatorOpen(true)}
              className="px-4 py-2 bg-neutral-900 text-white text-[10px] uppercase font-bold rounded cursor-pointer"
            >
              Simulate New Post
            </button>
          </div>
        </div>
      ) : (
        /* Grid Masonry container */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {filteredPosts.map((post) => {
            const comments = postComments[post.id] || [];
            const isCommentsOpen = activeCommentsPostId === post.id;
            
            // Extract matching restaurant metadata to link back
            const matchingRestaurant = RESTAURANTS.find(r => r.id === post.restaurantId);

            return (
              <div 
                key={post.id} 
                className="bg-white border border-neutral-200 shadow-xs hover:shadow-md hover:border-neutral-300 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between text-left"
              >
                {/* Meta Top Header bar */}
                <div>
                  <div className="p-4 flex items-center justify-between border-b border-neutral-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200 shrink-0 relative flex items-center justify-center text-emerald-800 font-serif font-extrabold text-sm">
                        {matchingRestaurant ? (
                          <img 
                            src={matchingRestaurant.imageUrl} 
                            alt={matchingRestaurant.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          "Z"
                        )}
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-white flex items-center justify-center text-[7px] bg-emerald-800 text-white">
                          ✓
                        </span>
                      </div>
                      
                      <div className="leading-snug">
                        <div className="flex items-center gap-1">
                          <h4 
                            onClick={() => matchingRestaurant && onSelectRestaurant(matchingRestaurant)}
                            className="text-xs font-bold text-neutral-950 font-serif hover:text-emerald-700 transition-colors cursor-pointer"
                          >
                            {matchingRestaurant ? matchingRestaurant.name : post.handle}
                          </h4>
                          {matchingRestaurant && (
                            <span className="text-[9px] hover:underline cursor-pointer font-bold text-red-650 shrink-0">
                              (Review)
                            </span>
                          )}
                        </div>
                        <span className="text-[9.5px] font-mono text-neutral-400 block lowercase tracking-tight leading-none">
                          {post.handle}
                        </span>
                      </div>
                    </div>

                    {/* Platform Brand Badge */}
                    <span className={`p-1.5 rounded-full inline-flex items-center justify-center ${
                      post.platform === 'instagram' 
                        ? 'bg-gradient-to-tr from-amber-500 via-red-500 to-purple-600 text-white' 
                        : 'bg-blue-600 text-white'
                    }`} title={post.platform}>
                      {post.platform === 'instagram' ? <Instagram className="w-3.5 h-3.5" /> : <Facebook className="w-3.5 h-3.5" />}
                    </span>
                  </div>

                  {/* Geotag / Location Label */}
                  {post.location && (
                    <div className="px-4 py-1.5 bg-neutral-50 border-b border-neutral-100 text-[8.5px] font-semibold text-neutral-500 flex items-center gap-1 uppercase tracking-wider font-mono">
                      <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                      <span>{post.location}</span>
                    </div>
                  )}

                  {/* Visual Post Image representation */}
                  <div className="aspect-square relative overflow-hidden bg-neutral-100 border-b border-neutral-200 group">
                    <img 
                      src={post.imageUrl} 
                      alt={post.caption}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      referrerPolicy="no-referrer"
                    />
                    
                    {matchingRestaurant && (
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        {matchingRestaurant.stars > 0 && (
                          <span className="bg-neutral-950/80 backdrop-blur-xs text-amber-400 font-serif text-[8.5px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full shadow border border-amber-400/20">
                            {'★'.repeat(matchingRestaurant.stars)} Vetted
                          </span>
                        )}
                        <span className="bg-emerald-800/90 backdrop-blur-xs text-white font-mono text-[7px] uppercase tracking-widest font-black px-2 py-1 rounded shadow">
                          {matchingRestaurant.cuisine.split(' ')[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Engagement Action Panel */}
                  <div className="px-4.5 pt-3 flex items-center gap-4 text-neutral-600">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1.5 hover:text-red-550 transition-colors uppercase font-mono text-[10px] cursor-pointer ${
                        post.userLiked ? 'text-red-550 font-extrabold' : 'text-neutral-550'
                      }`}
                    >
                      <Heart className={`w-4.5 h-4.5 ${post.userLiked ? 'fill-red-500 text-red-550' : ''}`} />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveCommentsPostId(isCommentsOpen ? null : post.id);
                      }}
                      className="flex items-center gap-1.5 text-neutral-500 hover:text-emerald-700 transition-colors uppercase font-mono text-[10px] cursor-pointer"
                    >
                      <MessageCircle className="w-4.5 h-4.5" />
                      <span>{post.commentsCount}</span>
                    </button>

                    <button
                      onClick={() => {
                        console.log(`[Analytics] Social Share Initiated: ${post.id}`);
                        navigator.clipboard.writeText(`${window.location.host}?activeTab=social-feed&postId=${post.id}`)
                          .then(() => showToast('Link Copied to Clipboard!'))
                          .catch(() => showToast('Redirect link copied!'));
                      }}
                      className="ml-auto text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                      title="Share Post"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Caption & Paragraph Body text */}
                  <div className="px-4.5 py-3 space-y-1.5 text-xs text-neutral-800">
                    <p className="line-clamp-4 leading-relaxed font-serif">
                      <strong className="text-neutral-900 font-bold mr-1.5 text-[11.5px] tracking-tight">{post.handle}</strong>
                      {post.caption}
                    </p>
                    <span className="text-[8px] font-mono uppercase text-neutral-400 font-bold block select-none">
                      {post.date}
                    </span>
                  </div>
                </div>

                {/* Simulated Comment Box Accordion Section */}
                <div className="border-t border-neutral-150 bg-neutral-50 px-4 py-3">
                  {!isCommentsOpen ? (
                    <button
                      onClick={() => setActiveCommentsPostId(post.id)}
                      className="text-[9.5px] font-semibold uppercase text-emerald-800 hover:text-emerald-950 font-mono tracking-wider cursor-pointer select-none"
                    >
                      View comments ({post.commentsCount}) ➔
                    </button>
                  ) : (
                    <div className="space-y-3 pt-1">
                      <div className="flex justify-between items-center pb-1 border-b border-neutral-200">
                        <span className="text-[8.5px] font-mono tracking-wider font-extrabold text-neutral-400 uppercase">Live Comments Panel</span>
                        <button
                          onClick={() => setActiveCommentsPostId(null)}
                          className="text-[10px] text-neutral-400 hover:text-neutral-700 font-bold"
                          title="Hide comments"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Rendered comments listing */}
                      <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1">
                        {comments.length === 0 ? (
                          <p className="text-[10px] text-neutral-400 italic font-serif">No comments yet. Add yours below!</p>
                        ) : (
                          comments.map((comment, index) => (
                            <div key={index} className="text-[10.5px] text-neutral-700 leading-normal">
                              <strong className="text-neutral-900 mr-1.5 font-semibold font-mono text-[9.5px]">{comment.author}</strong>
                              <span className="font-serif italic text-neutral-600 font-light">"{comment.text}"</span>
                              <span className="text-[7.5px] font-mono text-neutral-400 block mt-0.5">{comment.date}</span>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Comment Input block */}
                      <div className="flex gap-1.5 pt-1.5 border-t border-neutral-200">
                        <input
                          type="text"
                          placeholder="Add cooking comment..."
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment(post.id);
                          }}
                          className="flex-1 text-[11px] px-2.5 py-1.5 border border-neutral-250 bg-white text-neutral-900 rounded-md focus:outline-none focus:border-emerald-600 shadow-3xs"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md text-[9px] font-mono uppercase font-semibold cursor-pointer"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DOCK MODAL: SIMULATION LIVE POST Uploader */}
      {isSimulatorOpen && (
        <div className="fixed inset-0 bg-neutral-950/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="social-simulator-overlay">
          <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up text-left">
            <div className="bg-gradient-to-r from-emerald-850 from-emerald-800 to-emerald-650 px-6 py-4 border-b border-emerald-200 flex items-center justify-between text-white">
              <div>
                <span className="text-[8px] font-mono uppercase bg-amber-400/20 text-amber-300 border border-amber-300/30 px-2.5 py-0.5 rounded font-black tracking-widest leading-none">
                  Simulate Feed Publisher
                </span>
                <h3 className="font-serif font-bold text-base mt-1.5">
                  Publish Social Moment
                </h3>
              </div>
              <button
                onClick={() => setIsSimulatorOpen(false)}
                className="text-emerald-100 hover:text-white p-1 hover:bg-emerald-800/40 rounded-full cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSimulatorPost} className="p-6 space-y-4">
              {simSuccessMessage ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-2">
                  <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-serif italic text-xs text-emerald-900">{simSuccessMessage}</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-neutral-500 leading-normal.">
                    This simulator allows you to mock a social post locally inside the interface to test community interaction, updates feed filtering, like incrementers, and metadata binding.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Platform Selection */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-extrabold">Network Profile</label>
                      <div className="flex bg-neutral-100 rounded-lg p-1 border border-neutral-200 shadow-3xs">
                        {[
                          { label: 'Instagram', value: 'instagram' },
                          { label: 'Facebook', value: 'facebook' }
                        ].map(plat => (
                          <button
                            key={plat.value}
                            type="button"
                            onClick={() => setSimPlatform(plat.value as any)}
                            className={`flex-1 text-center py-1.5 rounded-md text-[9.5px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              simPlatform === plat.value
                                ? 'bg-emerald-800 text-white shadow-3xs'
                                : 'text-neutral-500 hover:bg-neutral-200'
                            }`}
                          >
                            {plat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Establishment link */}
                    <div className="space-y-1 text-left">
                      <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-extrabold">Link to Restaurant</label>
                      <select
                        value={simRestaurantId}
                        onChange={(e) => handleSimRestaurantChange(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-neutral-250 bg-white text-neutral-900 rounded-lg focus:outline-none focus:border-emerald-600 shadow-3xs"
                      >
                        {RESTAURANTS.map(rest => (
                          <option key={rest.id} value={rest.id}>{rest.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Preset Imagery picker */}
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-extrabold">Gastronomy Photo Preset</label>
                    <div className="grid grid-cols-5 gap-2.5">
                      {SIM_IMAGE_PRESETS.map((preset, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSimImageUrl(preset.url)}
                          className={`aspect-square w-full rounded-lg overflow-hidden border-2 relative cursor-pointer ${
                            simImageUrl === preset.url ? 'border-emerald-700 shadow-md ring-2 ring-emerald-700/20' : 'border-transparent'
                          }`}
                          title={preset.name}
                        >
                          <img 
                            src={preset.url} 
                            alt={preset.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Location manual overwrite */}
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-extrabold">Location Tag</label>
                    <input
                      required
                      type="text"
                      value={simLocation}
                      onChange={(e) => setSimLocation(e.target.value)}
                      placeholder="e.g. Liza, Achrafieh"
                      className="w-full text-xs px-3 py-2 border border-neutral-250 bg-white text-neutral-900 rounded-lg focus:outline-none focus:border-emerald-600 shadow-3xs font-serif"
                    />
                  </div>

                  {/* Caption block */}
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-extrabold">Caption Body & Hashtags</label>
                    <textarea
                      required
                      rows={3}
                      value={simCaption}
                      onChange={(e) => setSimCaption(e.target.value)}
                      placeholder="e.g., Cooking up some absolute mezza masterpieces overlooking Sursock palace doors... #bestmezza #beirutdining"
                      className="w-full text-xs px-3 py-2 border border-neutral-250 bg-white text-neutral-900 rounded-lg focus:outline-none focus:border-emerald-600 shadow-3xs font-serif leading-relaxed resize-none"
                    />
                  </div>

                  {/* Actions buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setIsSimulatorOpen(false)}
                      className="px-4 py-2 border border-neutral-250 text-neutral-600 font-bold hover:bg-neutral-50 transition-all text-[10px] uppercase tracking-widest cursor-pointer rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-neutral-950 text-white font-mono font-bold hover:bg-neutral-900 transition-all text-[10px] uppercase tracking-widest cursor-pointer rounded shadow-sm"
                    >
                      Submit Mock Post
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
