import { useState, FormEvent } from 'react';
import { Restaurant, Booking } from '../types';
import { X, MapPin, Phone, Globe, Award, Calendar, Users, Clock, AlertCircle, CheckCircle, Heart, Star, Share2, Check, Sparkles, Percent, BookOpen, CalendarPlus } from 'lucide-react';

interface MenuItem {
  name: string;
  description: string;
  priceUSD: number;
  priceLBP: number;
  tags: string[];
  isSignature?: boolean;
}

function getCuratedMenu(restaurant: Restaurant): { category: string; items: MenuItem[] }[] {
  if (restaurant.id === 'rest-1' || restaurant.name.toLowerCase().includes('em sherif')) {
    return [
      {
        category: "Cold Mezza & Garden Starters",
        items: [
          {
            name: "Hummus Snobar Premium",
            description: "Creamy hand-whipped Lebanese mountain chickpea purée drizzled with cold-pressed organic olive oil and loaded with golden roasted pine seeds.",
            priceUSD: 14.00,
            priceLBP: 1260000,
            tags: ["Signature Match", "Award Winner", "Local Souk Product"]
          },
          {
            name: "Fattoush Royal with Sumac & Crushed Pomegranate",
            description: "Freshly harvested purslane leaves, organic wild cucumbers, garden radishes, sumac flatbread shards, and sweet pomegranate molasses.",
            priceUSD: 11.00,
            priceLBP: 990000,
            tags: ["Bio Organic", "Voted Best of Beirut"]
          },
          {
            name: "Kibbeh Nayyeh Safi",
            description: "Traditional raw local spring lamb paste hand-blended with fine bulgur, sweet mint, house spices, served alongside fresh green onions.",
            priceUSD: 19.50,
            priceLBP: 1755000,
            tags: ["Chef's Masterpiece", "Classic Heritage"]
          }
        ]
      },
      {
        category: "Famous Hot Mezza",
        items: [
          {
            name: "Wild Purslane Hand-Folded Fatayer",
            description: "Golden flaky house dough stuffed with sour purslane, sumac, sweet onions, and drizzled with key lime oil.",
            priceUSD: 12.00,
            priceLBP: 1080000,
            tags: ["Vegan Option", "Handcrafted Daily"]
          },
          {
            name: "Spicy Batata Harra Levant",
            description: "Hand-cut crispy cubic potatoes tossed with garlic, fresh green coriander leaves, and special red Aleppo chili flakes.",
            priceUSD: 9.55,
            priceLBP: 859500,
            tags: ["Spicy Accent", "Guest Favorite"]
          }
        ]
      },
      {
        category: "Signature Main Sequences",
        items: [
          {
            name: "Kabab Karaz with Wild Mountain Cherries",
            description: "Finest charcoal-grilled Lebanese lamb skewers glazed in a beautiful slow-simmered dark crimson wild cherry glaze.",
            priceUSD: 31.00,
            priceLBP: 2790000,
            tags: ["Chef's Special", "Gluten Free", "Highly Acclaimed"]
          },
          {
            name: "Em Sherif Mixed Coal Feast",
            description: "A glamorous array of prime beef tenderloin shish taouk, spiced lamb kofta, seasoned lamb chops, roasted with organic local onions and hot flatbread.",
            priceUSD: 44.00,
            priceLBP: 3960000,
            tags: ["Grand Banquet", "Award Winner"]
          }
        ]
      },
      {
        category: "Elite Heritage Desserts",
        items: [
          {
            name: "Ashta Cloud with Orange Blossom",
            description: "Light, velvety clotted rose-water cream topped with pistachios, caramelized pine-tree honey, and wild Lebanese figs.",
            priceUSD: 13.50,
            priceLBP: 1215000,
            tags: ["Organic Honey", "Stellar Finish"]
          }
        ]
      }
    ];
  }

  if (restaurant.id === 'rest-2' || restaurant.name.toLowerCase().includes('liza')) {
    return [
      {
        category: "Shaken Cold Plates",
        items: [
          {
            name: "Beetroot Hummus with Thyme",
            description: "Earthy roasted local sweet beets blended with creamed sesame tahini, wild thyme, and toasted organic sesame keys.",
            priceUSD: 12.50,
            priceLBP: 1125000,
            tags: ["Gluten Free", "Lighter Choice"]
          },
          {
            name: "Freekeeh & Spiced Pumpkin Salad",
            description: "Smoked green wheat grains tossed with honey-charred local pumpkins, fresh mint, pomegranate pearls, and orange blossom olive oil dress.",
            priceUSD: 15.00,
            priceLBP: 1350000,
            tags: ["Earthy Blend", "Vegetarian Marvel"]
          }
        ]
      },
      {
        category: "Modern Main Courses",
        items: [
          {
            name: "Siyadiyeh Red Snapper",
            description: "Perfectly scorched flaky Mediterranean red snapper served on organic brown pine-and-cumin fragrant rice with caramelized sweet onions.",
            priceUSD: 36.50,
            priceLBP: 3285000,
            tags: ["Award Winner", "Red Snapper Catch"]
          },
          {
            name: "12-Hour Slow-Braised Kharouf",
            description: "Fall-away tender lamb shank accompanied by sweet dried Lebanese mountain apricot reductions and glazed chestnut cloves.",
            priceUSD: 38.00,
            priceLBP: 3420000,
            tags: ["12Hrs Craft", "Signature Epic"]
          }
        ]
      },
      {
        category: "Artisanal Selection Sweet Treats",
        items: [
          {
            name: "Mafroukeh Semolina Cake",
            description: "Ethereal fine semolina cake layers infused with Lebanese rose water, clotted mountain cream, toasted pine seeds, and floral drops.",
            priceUSD: 12.00,
            priceLBP: 1080000,
            tags: ["Rose-infused", "Heritage Legacy"]
          }
        ]
      }
    ];
  }

  if (restaurant.id === 'rest-3' || restaurant.name.toLowerCase().includes('babel')) {
    return [
      {
        category: "Cold Mezza & Coastal Crudos",
        items: [
          {
            name: "Hummus Babel Signature",
            description: "Our legendary velvet-smooth hummus infused with a special spiced citric reduction and warm roasted pine nuts.",
            priceUSD: 13.00,
            priceLBP: 1170000,
            tags: ["Legendary Recipe", "Ecosystem Exclusive"]
          },
          {
            name: "Seabass Crudo with Sea Salt & Sumac",
            description: "Thinly sliced raw Byblos wild seabass matched with hand-harvested sea salt, local sumac flowers, and virgin olive oil bath.",
            priceUSD: 18.50,
            priceLBP: 1665000,
            tags: ["Wild Raw Catch", "Gluten Free"]
          }
        ]
      },
      {
        category: "Charcoal Seaside Catches",
        items: [
          {
            name: "Sultan Ibrahim (Red Mullet)",
            description: "Crispy fried local red mullet fish seasoned with organic wild salt, crushed garlic cloves, and dynamic natural sumac zest.",
            priceUSD: 32.00,
            priceLBP: 2880000,
            tags: ["Hyper Local", "Daily Fresh Catch"]
          },
          {
            name: "Babel Charcoal Octopus",
            description: "Tender flame-grilled octopus arms brushed with lemon-coriander emulsion and cracked Lebanese black peppers.",
            priceUSD: 29.00,
            priceLBP: 2610000,
            tags: ["Voted Best of Month", "Flame Kissed"]
          }
        ]
      },
      {
        category: "Pastry Outpost",
        items: [
          {
            name: "Ghazl el Banat with Clotted Ashta",
            description: "Traditional Lebanese spun cotton candy clouds over cold clotted high-mountain milk cream and green Syrian pistachios.",
            priceUSD: 14.50,
            priceLBP: 1305000,
            tags: ["Kids & Adult Favorite", "Insta-famous"]
          }
        ]
      }
    ];
  }

  if (restaurant.id === 'rest-4' || restaurant.name.toLowerCase().includes('baron')) {
    return [
      {
        category: "Bistronomy Fire Starters",
        items: [
          {
            name: "Whole Fire-Charred Cauliflower",
            description: "Flame-charred young cauliflower head bathed in warm creamed sesame tahini, sweet pomegranate molasses spikes, and toasted raw almond shingles.",
            priceUSD: 16.50,
            priceLBP: 1485000,
            tags: ["Famous Plate", "Gluten Free", "Vegan Option"]
          },
          {
            name: "Whipped Mountain Labneh with Smoked Honey",
            description: "Thick sheep labneh whipped with wild oak smoke honey and sweet black date slices, served with clay-oven hot sourdough.",
            priceUSD: 14.00,
            priceLBP: 1260000,
            tags: ["Local Sourdough", "Sweet & Savory"]
          }
        ]
      },
      {
        category: "Feasts of Bistronomy Mains",
        items: [
          {
            name: "Coal Spiced Lamb Shoulder",
            description: "Tender fall-off-the-bone locally sourced lamb shoulder slow-finished on hot oak coals, smothered in rich cumin mountain jus.",
            priceUSD: 39.00,
            priceLBP: 3510000,
            tags: ["Oak Charcoal", "Premium Feast"]
          },
          {
            name: "Seared Red Snapper with Wild Chicory",
            description: "Fresh coastal snapper fillet crisp-seared on skin, accompanied by steamed wild mountain chicory leaves and red grape vinegar glaze.",
            priceUSD: 34.00,
            priceLBP: 3060000,
            tags: ["Gluten Free", "Organic Herbs"]
          }
        ]
      }
    ];
  }

  const isBakery = restaurant.cuisine.toLowerCase().includes('bakery') || restaurant.cuisine.toLowerCase().includes('pastry') || restaurant.category === 'takeaway_bakery_produce';
  const isPubOrCafe = restaurant.cuisine.toLowerCase().includes('cafe') || restaurant.cuisine.toLowerCase().includes('coffee') || restaurant.category === 'pub_cafe';
  const isSeafood = restaurant.cuisine.toLowerCase().includes('seafood') || restaurant.cuisine.toLowerCase().includes('fish');

  if (isBakery) {
    return [
      {
        category: "Fresh Morning Bake Crumbles",
        items: [
          {
            name: "Artisanal Wild Za'atar Manousheh",
            description: "Traditional thin round wheat dough baked in a clay oven with premium southern olive oil and hand-sorted wild thyme.",
            priceUSD: 4.50,
            priceLBP: 405000,
            tags: ["Saj Baked", "100% Organic"]
          },
          {
            name: "Triple Local Cheese Blend Boat (Kashkaval & Akkawi)",
            description: "Warm pastry boat overflowing with melted, slightly salted akkawi, kashkaval, and fresh goat cheeses under black sesame seeds.",
            priceUSD: 6.50,
            priceLBP: 585000,
            tags: ["Warm Pastry", "Beirut Classic"]
          }
        ]
      },
      {
        category: "Lush Sweet Pastries",
        items: [
          {
            name: "Orange Blossom Knefeh Bun",
            description: "Warm sweet semolina cheese pie soaked in scented sugar syrup and squeezed inside a toasted brioche bun with pistachios.",
            priceUSD: 8.00,
            priceLBP: 720000,
            tags: ["Sweet Decadence", "Signature Highlight"]
          },
          {
            name: "Halawet el Jibn Rollouts",
            description: "Soft roll-ups of sweet cheese and semolina dough stuffed with rich ashta cream, finished with fine orange blossom syrup.",
            priceUSD: 9.00,
            priceLBP: 810000,
            tags: ["Cold Delicacy", "Perfect with Coffee"]
          }
        ]
      }
    ];
  }

  if (isPubOrCafe) {
    return [
      {
        category: "Signature Coffee Extracts",
        items: [
          {
            name: "Premium Cardamom Lebanese Brew",
            description: "Slow-brewed unfiltered single-origin coffee beans infused with crushed green cardamom pods in copper djezve pots.",
            priceUSD: 3.50,
            priceLBP: 315000,
            tags: ["Heritage Brew", "Intense Aroma"]
          },
          {
            name: "Iced Orange Blossom Latte",
            description: "Two shots of freshly pulled espresso poured over cold jersey milk, organic simple sugar, and a mist of Levant food orange blossom water.",
            priceUSD: 5.50,
            priceLBP: 495000,
            tags: ["Cold Brewed", "Zesty Floral"]
          }
        ]
      },
      {
        category: "Café Bistro All-Day Plates",
        items: [
          {
            name: "Avocado Toast on Organic Sourdough",
            description: "Crushed organic Haas avocados tossed with direct-harvested pink sea salt, local cherry tomatoes, mint, and extra virgin olive oil.",
            priceUSD: 11.50,
            priceLBP: 1035000,
            tags: ["Healthy Bio", "Vegan Pick"]
          },
          {
            name: `${restaurant.name} Benedict Set`,
            description: "Two poached farm eggs on house-baked salted english muffins, smoked local ham, topped with lemon sumac hollandaise emulsion.",
            priceUSD: 14.50,
            priceLBP: 1305000,
            tags: ["Chef's Special", "Breakfast Hub"]
          }
        ]
      }
    ];
  }

  if (isSeafood) {
    return [
      {
        category: "Cold Marine Delicacies",
        items: [
          {
            name: "Byblos Citrus Calamari Carpaccio",
            description: "Paper-thin cold raw squid rings finished with local blood orange juice, organic sea salt, and baby sorrel leaves.",
            priceUSD: 16.00,
            priceLBP: 1440000,
            tags: ["Gluten Free", "Fresh Coastal Catch"]
          }
        ]
      },
      {
        category: "Gourmet Hot Crustaceans & Grill",
        items: [
          {
            name: "Salt-Baked Mediterranean Sea Bream",
            description: "Premium sea bream baked inside an aromatic rock-salt crust with wild thyme, cracked open table-side for maximum temperature and moisture.",
            priceUSD: 29.50,
            priceLBP: 2655000,
            tags: ["Table-side Show", "Juicy Fillet"]
          },
          {
            name: "Spiced Harra Style Fish Fillet",
            description: "Charcoal snapper flakes simmered in hot rich tomato jus, spicy red bell pepper chunks, crushed pine nuts, and fresh green coriander.",
            priceUSD: 24.00,
            priceLBP: 2160000,
            tags: ["Spicy Magic", "Local Heritage"]
          }
        ]
      }
    ];
  }

  return [
    {
      category: "Signature Curated Appetizers",
      items: [
        {
          name: "Duo of Curated Hummus & Roasted Beetroot Dip",
          description: "Smooth organic chickpea purée contrasting beautifully with our garlic-roasted thyme beet paste and fresh flatbread logs.",
          priceUSD: 11.00,
          priceLBP: 990000,
          tags: ["Vegetarian Pick", "Excellent to Share"]
        },
        {
          name: "Crisp Fried Halloumi Skewers",
          description: "Premium thick goat halloumi slices pan-singed in butter, drizzled with raw mountain thyme-infused honey and sesame seeds.",
          priceUSD: 13.50,
          priceLBP: 1215000,
          tags: ["Voted Best Starter", "Sweet & Golden Finish"]
        }
      ]
    },
    {
      category: "Chef's Primary Creations (Mains)",
      items: [
        {
          name: restaurant.signatureDishes[0] ? restaurant.signatureDishes[0].split(':')[0] : `${restaurant.cuisine} Gourmet Feast`,
          description: restaurant.signatureDishes[0] ? restaurant.signatureDishes[0].split(':').slice(1).join(':').trim() : `A masterclass in modern ${restaurant.cuisine.toLowerCase()} flavor design utilizing organic locally harvested grains and farm meats.`,
          priceUSD: 26.00,
          priceLBP: 2340000,
          tags: ["Signature Match", "Award Winner"]
        },
        {
          name: restaurant.signatureDishes[1] ? restaurant.signatureDishes[1].split(':')[0] : "Bespoke Slow-Roasted Platter",
          description: restaurant.signatureDishes[1] ? restaurant.signatureDishes[1].split(':').slice(1).join(':').trim() : "Fine tender farm cuts slow-cooked over wood charcoal embers with local organic garden root vegetables.",
          priceUSD: 28.50,
          priceLBP: 2565000,
          tags: ["Chef's Selection", "Gluten Free"]
        }
      ]
    },
    {
      category: "Delicacy Desserts",
      items: [
        {
          name: restaurant.signatureDishes[2] ? restaurant.signatureDishes[2].split(':')[0] : "Traditional Rose Water Pudding",
          description: restaurant.signatureDishes[2] ? restaurant.signatureDishes[2].split(':').slice(1).join(':').trim() : "Luxurious house milk pudding slow boiled with wild honey, crushed green pistachios, and fresh mint sprigs.",
          priceUSD: 10.00,
          priceLBP: 900000,
          tags: ["Floral Delight", "Aromatic Accent"]
        }
      ]
    }
  ];
}

interface RestaurantDetailModalProps {
  restaurant: Restaurant;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
  onAddBooking: (booking: Booking) => void;
}

export default function RestaurantDetailModal({
  restaurant,
  onClose,
  isSaved,
  onToggleSave,
  onAddBooking
}: RestaurantDetailModalProps) {
  const [activeImage, setActiveImage] = useState(restaurant.imageUrl);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [guestsCount, setGuestsCount] = useState(2);
  const [bookingDate, setBookingDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('19:30');
  const [dietaryRequirements, setDietaryRequirements] = useState('');
  const [bookingState, setBookingState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'menu' | 'booking'>('overview');

  const getGoogleCalendarUrl = (booking: Booking | null, address: string) => {
    if (!booking) return '#';
    const title = encodeURIComponent(`Dining at ${booking.restaurantName} (Zaytounada Guide)`);
    const pad = (num: number) => String(num).padStart(2, '0');
    
    // Parse time
    const [hours, minutes] = booking.time.split(':').map(Number);
    const endHours = (hours + 2) % 24;
    const isNextDay = hours + 2 >= 24;
    
    let endDateStr = booking.date;
    if (isNextDay) {
      const d = new Date(booking.date);
      d.setDate(d.getDate() + 1);
      endDateStr = d.toISOString().split('T')[0];
    }
    
    const startStr = `${booking.date.replace(/-/g, '')}T${booking.time.replace(/:/g, '')}00`;
    const endStr = `${endDateStr.replace(/-/g, '')}T${pad(endHours)}${pad(minutes)}00`;
    
    const details = encodeURIComponent(
      `Your dining reservation is confirmed!\n\n` +
      `Confirmation ID: ${booking.id}\n` +
      `Restaurant: ${booking.restaurantName}\n` +
      `Maitre D' Desk: ${restaurant.phone}\n` +
      `Guests Count: ${booking.guestsCount} Guests\n` +
      `Timing: ${booking.time}\n` +
      `Special Requests: ${booking.specialRequests || 'None'}\n\n` +
      `Thank you for using Zaytounada Guide.`
    );
    
    const location = encodeURIComponent(address);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
  };

  const downloadIcsFile = (booking: Booking | null, address: string) => {
    if (!booking) return;
    const [hours, minutes] = booking.time.split(':').map(Number);
    const endHours = (hours + 2) % 24;
    const isNextDay = hours + 2 >= 24;
    
    let endDateStr = booking.date;
    if (isNextDay) {
      const d = new Date(booking.date);
      d.setDate(d.getDate() + 1);
      endDateStr = d.toISOString().split('T')[0];
    }
    
    const pad = (num: number) => String(num).padStart(2, '0');
    const startStr = `${booking.date.replace(/-/g, '')}T${booking.time.replace(/:/g, '')}00`;
    const endStr = `${endDateStr.replace(/-/g, '')}T${pad(endHours)}${pad(minutes)}00`;
    const stampStr = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Zaytounada Guide//NONSGML Invitation//EN',
      'BEGIN:VEVENT',
      `UID:${booking.id}@zaytounadaguide.com`,
      `DTSTAMP:${stampStr}`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:Dining at ${booking.restaurantName} (Zaytounada Guide)`,
      `DESCRIPTION:Reservation ID: ${booking.id}\\nGuests: ${booking.guestsCount} Guests\\nNotes: ${booking.specialRequests || 'None'}`,
      `LOCATION:${address}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ];

    const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reservation-${booking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    const deepLink = `${window.location.origin}${window.location.pathname}?restaurant=${restaurant.id}`;
    navigator.clipboard.writeText(deepLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy link:', err);
      });
  };

  const timeSlots = ['12:00', '13:00', '19:00', '19:30', '20:00', '20:30', '21:00'];

  const handleBookingSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail || !bookingDate) {
      alert('Please fill in all booking fields.');
      return;
    }

    setBookingState('submitting');
    setTimeout(() => {
      const newBooking: Booking = {
        id: `book-${Math.random().toString(36).substr(2, 9)}`,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        userName,
        userEmail,
        guestsCount,
        date: bookingDate,
        time: selectedTime,
        specialRequests: dietaryRequirements,
        status: 'confirmed'
      };
      
      onAddBooking(newBooking);
      setConfirmedBooking(newBooking);
      setBookingState('success');
    }, 1500);
  };

  const imagesList = [restaurant.imageUrl, ...restaurant.images];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Visual Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 text-center">
        <div 
          className="relative w-full max-w-5xl bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row text-left my-8 scale-100 transition-all transform duration-300 text-neutral-950"
          id="restaurant-detail-container"
        >
          {/* Close Trigger Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 flex items-center justify-center w-10 h-10 bg-white/90 hover:bg-white text-neutral-800 rounded-full border border-neutral-250 shadow-sm transition-colors cursor-pointer"
            id="modal-close-button"
          >
            <X className="w-5 h-5 font-bold" />
          </button>

          {/* Left half: High-end visual showcase & galleries */}
          <div className="w-full md:w-1/2 bg-neutral-50 flex flex-col text-neutral-900 border-b md:border-b-0 md:border-r border-neutral-200">
            {/* Spotlight Banner Image */}
            <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-neutral-100">
              <img
                src={activeImage}
                alt={restaurant.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-transparent to-transparent h-40" />
              
              {/* Header Title Placement */}
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-705 text-emerald-700 font-extrabold block">
                  {restaurant.cuisine}
                </span>
                <h2 className="text-3xl font-serif font-black mt-1 text-neutral-955">
                  {restaurant.name}
                </h2>
                <p className="flex items-center gap-1.5 text-xs text-neutral-600 mt-1.5 font-light">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{restaurant.address}</span>
                </p>
              </div>
            </div>

            {/* Thumbnail Selection Bar */}
            <div className="p-6 pt-2 bg-neutral-50 flex flex-col gap-4">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {imagesList.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border transition-all cursor-pointer ${
                      activeImage === img ? 'border-emerald-600 scale-105 opacity-100 shadow-md' : 'border-neutral-250 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>

              {/* Distinction info details */}
              <div className="border-t border-neutral-200 pt-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                <div>
                  <p className="text-[9px] text-neutral-450 font-mono tracking-widest uppercase font-bold">Official Distinction</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {restaurant.stars > 0 ? (
                      <div className="flex items-center gap-1 text-neutral-900">
                        <span className="text-amber-550 text-lg leading-none font-bold">✻</span>
                        <span className="font-serif text-sm font-bold text-neutral-850">
                          {restaurant.stars} Zaytounada Star{restaurant.stars > 1 ? 's' : ''} (✻)
                        </span>
                      </div>
                    ) : restaurant.distinction === 'BIB_GOURMAND' ? (
                      <span className="text-amber-700 font-bold text-sm">☺ Exceptional Value Bib Gourmand</span>
                    ) : (
                      <span className="text-neutral-700 font-semibold text-sm">Selected Zaytounada Guide Spot</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                      copied 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                        : 'bg-white text-neutral-700 border-neutral-250 hover:bg-neutral-50 shadow-xs'
                    }`}
                    title="Copy unique deep-link"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Share Spot</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={onToggleSave}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold cursor-pointer border transition-all ${
                      isSaved
                        ? 'bg-emerald-750 bg-emerald-700 text-white border-emerald-500 font-extrabold shadow-sm hover:bg-emerald-850'
                        : 'bg-white text-neutral-705 border-neutral-250 hover:bg-neutral-50 shadow-xs'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    <span>{isSaved ? 'Saved to Guides' : 'Save'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right half: Editorial evaluation review & booking systems */}
          <div className="w-full md:w-1/2 flex flex-col h-[72vh] md:h-[85vh] overflow-y-auto bg-white text-neutral-900 text-left" id="modal-tabs-body">
            {/* Interactive Tab Navigation Indicator */}
            <div className="flex border-b border-neutral-100 bg-neutral-50 px-6 pt-4 gap-6 shrink-0 sticky top-0 z-20" id="modal-tabs-trigger-rail">
              <button
                id="tab-btn-overview"
                onClick={() => {
                  setActiveModalTab('overview');
                  document.getElementById('modal-tabs-body')?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`pb-3.5 text-xs font-mono font-bold tracking-wider uppercase transition-all relative cursor-pointer ${
                  activeModalTab === 'overview' ? 'text-emerald-800' : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                📋 Overview Report
                {activeModalTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-emerald-800 rounded-full" />}
              </button>

              <button
                id="tab-btn-menu"
                onClick={() => {
                  setActiveModalTab('menu');
                  document.getElementById('modal-tabs-body')?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`pb-3.5 text-xs font-mono font-bold tracking-wider uppercase transition-all relative cursor-pointer ${
                  activeModalTab === 'menu' ? 'text-emerald-800' : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Curated Menu</span>
                </span>
                {activeModalTab === 'menu' && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-emerald-800 rounded-full" />}
              </button>

              <button
                id="tab-btn-booking"
                onClick={() => {
                  setActiveModalTab('booking');
                  document.getElementById('modal-tabs-body')?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`pb-3.5 text-xs font-mono font-bold tracking-wider uppercase transition-all relative cursor-pointer ${
                  activeModalTab === 'booking' ? 'text-emerald-800' : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                ✍ Booking Desk
                {activeModalTab === 'booking' && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-emerald-800 rounded-full" />}
              </button>
            </div>

            {/* Modal Tabs or section contents */}
            <div className="p-6 md:p-8 space-y-8 flex-1" id="modal-tabs-content-viewport">
              {activeModalTab === 'overview' && (
                <div className="space-y-8 animate-fade-in text-left" id="overview-tab-content">
                  {/* Core Inspector Summary */}
                  <section id="inspector-analysis">
                    <div className="flex items-center gap-2 text-emerald-700 font-serif font-black text-sm uppercase tracking-widest mb-3 border-b border-neutral-200 pb-1 text-left">
                      <Award className="w-4.5 h-4.5" />
                      <span>Zaytounada Inspection Report</span>
                    </div>
                    
                    {/* Master Chef block */}
                    <div className="mb-4 inline-flex items-center gap-2.5 px-3 py-1 bg-neutral-100 rounded border border-neutral-200">
                      <span className="text-[9px] bg-emerald-700 text-white px-1.5 py-0.5 rounded font-mono font-black uppercase tracking-wide">CHEF DE CUISINE</span>
                      <span className="font-serif font-semibold text-sm text-neutral-805">{restaurant.chef}</span>
                    </div>

                    {/* Inspector's detailed text */}
                    <p className="font-serif italic text-neutral-850 text-xs sm:text-sm leading-relaxed border-l-2 border-amber-400 pl-4 bg-neutral-50 py-3 rounded-r-md text-left">
                      "{restaurant.inspectorNote}"
                    </p>
                    
                    <p className="text-neutral-600 text-xs leading-relaxed mt-4 font-light font-sans text-left">
                      {restaurant.description}
                    </p>
                  </section>

                  {/* Signature Dishes */}
                  <section id="signature-dishes" className="text-left">
                    <h4 className="font-serif font-black text-base text-neutral-950 mb-3.5 uppercase tracking-wide text-left">Signature Dishes Selected by Inspectors</h4>
                    <div className="space-y-2.5 text-left">
                      {restaurant.signatureDishes.map((dish, idx) => (
                        <div key={idx} className="flex gap-3 items-start p-3 bg-neutral-50 rounded border border-neutral-200 text-left">
                          <span className="flex items-center justify-center w-5.5 h-5.5 bg-emerald-50 text-emerald-800 border border-emerald-250 rounded-full font-mono text-xs font-bold shrink-0 mt-0.5 select-none">
                            {idx + 1}
                          </span>
                          <p className="text-neutral-800 text-sm leading-snug font-light font-serif text-left">{dish}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Special Features / Atmosphere */}
                  <section id="features" className="text-left">
                    <h4 className="font-mono text-[9px] font-bold tracking-widest text-neutral-450 uppercase mb-3 text-left">Establishment Features</h4>
                    <div className="flex flex-wrap gap-2 text-left">
                      {restaurant.features.map((feature, i) => (
                        <span key={i} className="px-3 py-1 bg-neutral-100 border border-neutral-200 text-neutral-850 rounded-full text-xs font-medium">
                          ✓ {feature}
                        </span>
                      ))}
                    </div>
                  </section>

                  {/* Contact Information & Practical Details */}
                  <section id="contacts" className="pt-6 border-t border-neutral-200 text-left">
                    <h4 className="font-mono text-[9px] font-bold tracking-widest text-neutral-450 uppercase mb-3.5 text-left">Practical Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-600 text-left">
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-neutral-450 shrink-0" />
                        <span>{restaurant.phone}</span>
                      </div>
                      <a 
                        href={restaurant.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2.5 text-emerald-700 hover:text-emerald-600 hover:underline transition-colors font-bold text-left"
                      >
                        <Globe className="w-4 h-4 text-neutral-450 shrink-0" />
                        <span>Visit Official Website ↗</span>
                      </a>
                    </div>
                  </section>
                </div>
              )}

              {activeModalTab === 'menu' && (
                <div className="space-y-6 animate-fade-in text-left" id="menu-tab-content">
                  <div className="flex flex-col gap-1 border-b border-neutral-100 pb-3 text-left">
                    <div className="flex items-center gap-2 text-emerald-800 font-serif font-black text-sm uppercase tracking-widest text-left">
                      <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                      <span>Curated Digital Menu</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 font-light mt-0.5 text-left">
                      Premium gourmet selections hand-inspected for optimal texture and ingredient sourcing.
                    </p>
                  </div>

                  {/* SPECIAL LOYALTY CARD INTEGRATION CARD */}
                  <div className="bg-gradient-to-br from-[#0c2e1f] to-[#041a11] border border-emerald-800 rounded-2xl p-4.5 text-white flex items-start gap-3.5 shadow-sm text-left relative overflow-hidden" id="menu-loyalty-pass-panel">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 rounded-full filter blur-xl" />
                    <Percent className="w-6 h-6 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                    <div className="space-y-1 text-left">
                      <h5 className="font-serif text-[12.5px] font-black text-amber-400 uppercase tracking-wide">WhatsOnLebanon Partnership Offer</h5>
                      <p className="text-[10.5px] text-neutral-300 font-light leading-normal text-left">
                        Present your synchronized <strong>WhatsOnLebanon Loyalty Pass</strong> in the smartphone wallet app to verified waiters before requesting the final check. Enjoy a flat <strong className="text-white">20% discount sequence</strong> on these menu choices automatically.
                      </p>
                    </div>
                  </div>

                  {/* RESTAURANT MENU ITEMS CATEGORIZED */}
                  <div className="space-y-8 text-left" id="menu-categorized-list">
                    {getCuratedMenu(restaurant).map((cat, cIdx) => (
                      <div key={cIdx} className="space-y-4 text-left">
                        <h4 className="font-serif text-xs font-black uppercase text-emerald-800 tracking-wider bg-emerald-50/75 border-l-2 border-emerald-700 py-1.5 px-3 rounded-r-md text-left">
                          ◆ {cat.category}
                        </h4>
                        
                        <div className="space-y-3.5 text-left">
                          {cat.items.map((item, iIdx) => (
                            <div key={iIdx} className="p-4 bg-white hover:bg-neutral-50/60 border border-neutral-200 hover:border-neutral-250 rounded-xl transition-all shadow-2xs space-y-2.5 text-left">
                              {/* Title and price row */}
                              <div className="flex justify-between items-start gap-4 text-left">
                                <h5 className="font-serif font-black text-neutral-900 text-[13.5px] leading-tight text-left">
                                  {item.name}
                                </h5>
                                
                                {/* Format Prices in USD and LBP */}
                                <div className="text-right shrink-0">
                                  <span className="font-mono text-[13.5px] font-extrabold text-neutral-900 block">
                                    ${item.priceUSD.toFixed(2)}
                                  </span>
                                  <span className="font-mono text-[9px] text-neutral-450 block font-semibold mt-0.5">
                                    {item.priceLBP.toLocaleString()} LBP
                                  </span>
                                </div>
                              </div>

                              {/* Description */}
                              <p className="text-[11px] text-neutral-500 font-light leading-relaxed text-left">
                                {item.description}
                              </p>

                              {/* Price Highlight Tags */}
                              <div className="flex flex-wrap gap-1.5 pt-1 text-left font-mono">
                                {item.tags.map((tag, tIdx) => (
                                  <span 
                                    key={tIdx} 
                                    className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-600 rounded text-[9px] font-mono font-medium tracking-wide uppercase text-left"
                                  >
                                    ★ {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Disclaimer banner */}
                  <div className="pt-4 border-t border-dashed border-neutral-200 text-center text-[10px] text-neutral-400 font-light leading-relaxed">
                    * Curated menu specifications and prices are dynamically adjusted base configurations according to local market availability. Actual prices may fluctuate slightly during hyper-seasonal sequences. LBP calculations are synced with current standard rates.
                  </div>
                </div>
              )}

              {activeModalTab === 'booking' && (
                <div className="space-y-6 animate-fade-in text-left font-sans" id="booking-tab-content">
                  {/* Interactive Booking Section */}
                  <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 md:p-6 shadow-xs text-left">
                    {bookingState === 'idle' || bookingState === 'submitting' ? (
                      <form onSubmit={handleBookingSubmit} className="space-y-4 text-left">
                        <div className="flex items-center gap-2 mb-2 text-left">
                          <Calendar className="w-5 h-5 text-emerald-700" />
                          <h4 className="font-serif font-black text-lg text-emerald-950 uppercase tracking-wide">Gourmet Booking Desk</h4>
                        </div>
                        <p className="text-xs text-neutral-555 mb-4 leading-relaxed font-light font-sans text-left">
                          Zaytounada Guide tables are highly coveted. Request a seat placement, and details will be forwarded directly to our Maitre D'.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                          {/* Name Input */}
                          <div>
                            <label className="block text-[9px] font-bold font-mono tracking-wider uppercase text-neutral-600 mb-1">Full Name</label>
                            <input
                              type="text"
                              required
                              placeholder="John Doc"
                              value={userName}
                              onChange={(e) => setUserName(e.target.value)}
                              disabled={bookingState === 'submitting'}
                              className="w-full px-3 py-2.5 bg-white border border-neutral-250 text-neutral-900 rounded-lg text-xs focus:border-emerald-600 outline-none"
                            />
                          </div>

                          {/* Email Input */}
                          <div>
                            <label className="block text-[9px] font-bold font-mono tracking-wider uppercase text-neutral-600 mb-1">Email Address</label>
                            <input
                              type="email"
                              required
                              placeholder="johndoe@gmail.com"
                              value={userEmail}
                              onChange={(e) => setUserEmail(e.target.value)}
                              disabled={bookingState === 'submitting'}
                              className="w-full px-3 py-2.5 bg-white border border-neutral-250 text-neutral-900 rounded-lg text-xs focus:border-emerald-600 outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                          {/* Guest Count */}
                          <div>
                            <label className="block text-[9px] font-bold font-mono tracking-wider uppercase text-neutral-600 mb-1">Guests Count</label>
                            <div className="flex items-center border border-neutral-250 rounded-lg overflow-hidden bg-white">
                              <button
                                type="button"
                                onClick={() => setGuestsCount(g => Math.max(1, g - 1))}
                                disabled={bookingState === 'submitting'}
                                className="px-3 py-1 bg-neutral-50 hover:bg-neutral-100 border-r border-neutral-200 text-sm font-semibold cursor-pointer text-neutral-800 animate-none"
                              >
                                -
                              </button>
                              <span className="flex-1 text-center font-mono text-xs font-bold text-neutral-900">
                                {guestsCount}
                              </span>
                              <button
                                type="button"
                                onClick={() => setGuestsCount(g => Math.min(10, g + 1))}
                                disabled={bookingState === 'submitting'}
                                className="px-3 py-1 bg-neutral-50 hover:bg-neutral-100 border-l border-neutral-200 text-sm font-semibold cursor-pointer text-neutral-800 animate-none"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Date Picker */}
                          <div>
                            <label className="block text-[9px] font-bold font-mono tracking-wider uppercase text-neutral-600 mb-1">Select Date</label>
                            <input
                              type="date"
                              required
                              value={bookingDate}
                              onChange={(e) => setBookingDate(e.target.value)}
                              disabled={bookingState === 'submitting'}
                              className="w-full px-3 py-2 bg-white border border-neutral-250 text-neutral-900 rounded-lg text-xs focus:border-emerald-600 outline-none select-none cursor-pointer"
                            />
                          </div>

                          {/* Time Slots Selector */}
                          <div>
                            <label className="block text-[9px] font-bold font-mono tracking-wider uppercase text-neutral-600 mb-1">Select Time</label>
                            <select
                              value={selectedTime}
                              onChange={(e) => setSelectedTime(e.target.value)}
                              disabled={bookingState === 'submitting'}
                              className="w-full px-3 py-2 bg-white border border-neutral-250 text-neutral-900 rounded-lg text-xs focus:border-emerald-600 outline-none cursor-pointer"
                            >
                              {timeSlots.map((time) => (
                                <option key={time} value={time} className="bg-white text-neutral-900">{time}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Special Dietary Requirements */}
                        <div className="text-left">
                          <label className="block text-[9px] font-bold font-mono tracking-wider uppercase text-neutral-600 mb-1">Dietary Preferences or Allergies</label>
                          <textarea
                            placeholder="Vegetarian, pescatarian, nut allergies, celebrating wedding anniversary, etc..."
                            value={dietaryRequirements}
                            onChange={(e) => setDietaryRequirements(e.target.value)}
                            disabled={bookingState === 'submitting'}
                            rows={2}
                            className="w-full px-3 py-2 bg-white border border-neutral-250 text-neutral-900 rounded-lg text-xs focus:border-emerald-600 outline-none resize-none text-left"
                          />
                        </div>

                        {/* Request Button */}
                        <button
                          type="submit"
                          disabled={bookingState === 'submitting'}
                          className={`w-full py-3.5 rounded-lg uppercase tracking-widest text-xs font-black shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            bookingState === 'submitting' 
                              ? 'bg-neutral-150 border-neutral-200 text-neutral-400 cursor-not-allowed' 
                              : 'bg-emerald-700 hover:bg-emerald-850 text-white shadow'
                          }`}
                          id="submit-booking-button"
                        >
                          {bookingState === 'submitting' ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-neutral-400 border-t-neutral-800 rounded-full animate-spin" />
                              <span>Securing Allocation Table...</span>
                            </>
                          ) : (
                            <span>Submit Booking Request</span>
                          )}
                        </button>
                      </form>
                    ) : (
                      // Booking success screen!
                      <div className="flex flex-col items-center text-center py-4 space-y-4 text-left" id="booking-success-box">
                        <div className="relative">
                          <CheckCircle className="w-16 h-16 text-emerald-600 translate-y-0.5 animate-bounce" />
                          <div className="absolute top-0 right-0 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                            <span className="text-[9px] text-neutral-950 font-bold select-none">✻</span>
                          </div>
                        </div>

                        <div className="text-center">
                          <h4 className="font-serif font-black text-xl text-neutral-950 uppercase tracking-widest">Reservation Secured</h4>
                          <p className="text-[10px] text-emerald-700 mt-1.5 font-bold font-mono uppercase tracking-widest bg-emerald-50 border border-emerald-250 px-2.5 py-1 rounded inline-block">
                            Allocated ID: {confirmedBooking?.id}
                          </p>
                        </div>

                        <div className="w-full bg-white border border-dashed border-emerald-250 rounded-lg p-4 text-xs space-y-2.5 text-left max-w-sm shadow-xs font-mono">
                          <div className="flex justify-between border-b border-neutral-205 pb-1.5 font-sans font-bold text-neutral-900">
                            <span>{restaurant.name}</span>
                            <span className="text-amber-500 font-bold text-[10px]">✻ {restaurant.stars} STARS</span>
                          </div>
                          <div className="flex justify-between text-neutral-500">
                            <span>Guest:</span>
                            <span className="text-neutral-900 font-extrabold">{confirmedBooking?.userName}</span>
                          </div>
                          <div className="flex justify-between text-neutral-500">
                            <span>Party Size:</span>
                            <span className="text-neutral-900 font-extrabold">{confirmedBooking?.guestsCount} Guests</span>
                          </div>
                          <div className="flex justify-between text-neutral-500">
                            <span>Date:</span>
                            <span className="text-neutral-900 font-extrabold">{confirmedBooking?.date}</span>
                          </div>
                          <div className="flex justify-between text-neutral-500">
                            <span>Timing:</span>
                            <span className="text-neutral-900 font-extrabold">{confirmedBooking?.time}</span>
                          </div>
                          {confirmedBooking?.specialRequests && (
                            <div className="pt-1.5 border-t border-neutral-205 text-neutral-500 text-[10px] font-sans">
                              <span className="font-bold block mb-0.5 uppercase tracking-wide text-left">Notes:</span>
                              <span className="italic block text-left">"{confirmedBooking.specialRequests}"</span>
                            </div>
                          )}
                        </div>

                        {/* ADD TO CALENDAR / SYNCING SYSTEM */}
                        <div className="w-full max-w-sm border border-neutral-200 bg-neutral-50 rounded-xl p-3.5 space-y-2.5 text-left" id="add-to-calendar-panel">
                          <p className="text-[10px] font-bold font-mono uppercase tracking-wider text-neutral-500 text-center">
                            📅 Add to Calendar / Sync Dining
                          </p>
                          <div className="grid grid-cols-2 gap-2.5">
                            <a
                              href={getGoogleCalendarUrl(confirmedBooking, restaurant.address)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-amber-50 border border-neutral-250 hover:border-amber-400 text-neutral-800 hover:text-amber-900 rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-3xs"
                              id="btn-sync-google"
                            >
                              <CalendarPlus className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span>Google Calendar</span>
                            </a>
                            <button
                              onClick={() => downloadIcsFile(confirmedBooking, restaurant.address)}
                              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-emerald-50 border border-neutral-250 hover:border-emerald-500 text-neutral-800 hover:text-emerald-950 rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-3xs"
                              id="btn-sync-ics"
                            >
                              <CalendarPlus className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>iCal / Outlook</span>
                            </button>
                          </div>
                        </div>

                        <p className="text-[9px] text-neutral-450 max-w-xs uppercase font-mono tracking-widest text-center leading-relaxed">
                          A verification code has been dispatched to **{confirmedBooking?.userEmail}**. Show verification on arrival.
                        </p>

                        <button
                          onClick={() => {
                            setBookingState('idle');
                            setUserName('');
                            setUserEmail('');
                            setDietaryRequirements('');
                          }}
                          className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-250 text-neutral-800 rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer transition-all shadow-xs"
                        >
                          Secure Another Reservation
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
