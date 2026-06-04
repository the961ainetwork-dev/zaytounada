import { Restaurant, Article } from '../types';

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Em Sherif',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.8938, lng: 35.5124, x: 50, y: 55 },
    stars: 3,
    distinction: 'STAR_3',
    priceRange: '$$$$',
    cuisine: 'Traditional Lebanese Haute Cuisine',
    address: 'Rue Monot, Achrafieh, Beirut, Lebanon',
    phone: '+961 1 206 206',
    website: 'https://emsherif.com',
    chef: 'Mireille Hayek',
    description: 'A luxurious, world-class temple of classic Lebanese cuisine styled like an opulent Oriental mansion. Mireille Hayek offers a legendary multi-course feast celebrating historical recipes.',
    inspectorNote: 'Em Sherif is the absolute peak of Lebanese culinary excellence. Every dish behaves like a poetic verse in a grand culinary epic. Over 30 magnificent courses are served sequentially, including the smoothest Hummus topped with dynamic pine nuts, hot fatayer with wild purslane, and charcoal-grilled lamb marinated in rich regional spices.',
    signatureDishes: [
      'Hummus Snobar: Velvet-textured chickpea purée with warm toasted Lebanese pine seeds',
      'Fattoush with Pomegranate: Crispy flatbread shards, fresh purslane, sumac, and rich molasses pomegranate dressing',
      'Kabab Karaz: Tender charcoal lamb skewers glazed in a sweet-and-sour wild mountain cherry reduction'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Live Traditional Oud Player', 'Opulent Oriental Decor', 'Ultra-Premium Ingredients', 'Sequential Feasting Ritual'],
    instagram: '@emsherifrestaurant',
    facebook: 'EmSherifRestaurant',
    category: 'fine_dining'
  },
  {
    id: 'rest-2',
    name: 'Liza',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.8892, lng: 35.5165, x: 62, y: 68 },
    stars: 2,
    distinction: 'STAR_2',
    priceRange: '$$$$',
    cuisine: 'Polished Contemporary Lebanese',
    address: 'Metropolitan Club, Rue Sursock, Achrafieh, Beirut, Lebanon',
    phone: '+961 1 200 440',
    website: 'http://lizabeirut.com',
    chef: 'Liza Soughayar',
    description: 'Housed in a breathtaking 19th-century aristocratic palace in Sursock, Liza offers enlightened, lighter interpretations of traditional Lebanese delicacies in beautifully designed rooms.',
    inspectorNote: 'The visual design matches the stunning kitchen precision. Rooms are framed by custom wallpaper showing old Beirut city plans, and brass light fixtures casting beautiful shadows. Chef Soughayar’s lamb Shank cooked for 12 hours with five sweet spices is incredibly tender, and the freekeeh salad feels light and modern.',
    signatureDishes: [
      'Siyadiyeh: Flaky red snapper served over brown pine-and-cumin fragrant rice with caramelized onions',
      'Kharouf: 12-hour slow-braised lamb shank accompanied by sweet organic dried fruits',
      'Mafroukeh: Velvet semolina cake layered with fresh clotted ashta cream, almonds, and rose water syrup'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Historical Palace Location', 'Exquisite Interior Design', 'Vegetarian Friendly Options', 'Elegant Wine List'],
    instagram: '@lizabeirut',
    facebook: 'LizaBeirut',
    category: 'fine_dining'
  },
  {
    id: 'rest-3',
    name: 'Babel Bahr',
    city: 'Byblos',
    country: 'Lebanon',
    coordinates: { lat: 34.1215, lng: 35.6482, x: 55, y: 35 },
    stars: 2,
    distinction: 'STAR_2',
    priceRange: '$$$',
    cuisine: 'Lebanese Seafood & Coastal Grill',
    address: 'Seaside Road, Amchit Coast, Jbeil, Lebanon',
    phone: '+961 9 620 999',
    website: 'https://babelrestaurant.com',
    chef: 'Charbel Makhlouf',
    description: 'Perched directly on the edge of the Mediterranean Sea, Babel Bahr redefines Lebanese seafood with spectacular rock-and-stone architecture and hyper-fresh ocean catches.',
    inspectorNote: 'Marrying coastal sea breezes with high culinary craft, Babel Bahr excels at raw kibbeh nayyeh alongside custom-spiced seaside catches. Their Hummus Beiruty—accented with chopped organic tomatoes, pickled wild cucumber, and fresh parsley—is phenomenal, while the charcoal-grilled red mullet, spiced with coriander, garlic, and fresh lemons, is a absolute masterpiece.',
    signatureDishes: [
      'Hummus Babel: Velvety smooth signature hummus with caramelized custom local pine seed reduction',
      'Sultan Ibrahim: Crispy fried native red mullet seasoned with wild sea salt and natural sumac',
      'Ghazl el Banat with Ashta: Traditional Levantine spun cotton candy over rich milk-and-rose clotted cream'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Direct Beach & Sea Views', 'Vibrant Outdoor Sundocks', 'Artisanal Fresh Fish Counter', 'Premium Lebanese Wine Cellar'],
    instagram: '@babel_bahr',
    facebook: 'BabelBahr',
    category: 'fine_dining'
  },
  {
    id: 'rest-4',
    name: 'Baron',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.8972, lng: 35.5264, x: 68, y: 48 },
    stars: 0,
    distinction: 'BIB_GOURMAND',
    priceRange: '$$',
    cuisine: 'Progressive Mediterranean / Charcoal Bistronomy',
    address: 'Pharaon Street, Mar Mikhael, Beirut, Lebanon',
    phone: '+961 1 565 115',
    website: 'https://instagram.com/baronbeirut',
    chef: 'Athanasios Kargatzidis',
    description: 'Nestled in the bustling, hip arts sector of Mar Mikhael, Baron delivers bold, ingredients-first bistro cooking with high-heat coal-roasted organic vegetables.',
    inspectorNote: 'Chef Kargatzidis leads a delicious, high-energy, free-spirited culinary movement. The menu changes constantly depending on local markets. Highlights include a whole charred cauliflower bathed in creamed sesame tahini, pomegranate molasses, and toasted almonds—a spectacular masterpiece of humble, local ingredients transformed.',
    signatureDishes: [
      'Charred Cauliflower: Roasted head with sesame tahini, sweet pomegranate molasses, and raw almond flakes',
      'Spiced Slow-Cooked Lamb Shoulder: Fall-off-the-bone lamb with dynamic roasted cumin jus',
      'Whipped Labneh Dip with organic smoked honey, black dates, and clay-oven sourdough bread'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Neighborhood Bistro Vibe', 'High-Heat Open Wood Grill', 'Natural Local Organic Wine List', 'Dynamic Changing Plates'],
    instagram: '@baronbeirut',
    facebook: 'BaronBeirut',
    category: 'fine_dining'
  },
  {
    id: 'rest-5',
    name: 'Mayrig',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.8951, lng: 35.5188, x: 58, y: 44 },
    stars: 0,
    distinction: 'SELECTED',
    priceRange: '$$$',
    cuisine: 'Armenian-Lebanese Homestyle',
    address: 'Pasteur Street, Gemmayze, Beirut, Lebanon',
    phone: '+961 1 572 121',
    website: 'https://mayrig.com',
    chef: 'Aline Kamakian',
    description: 'Celebrating the incredible, rich heritage of Armenian culinary culture in Beirut. Mayrig serves homestyle dishes bursting with spices, nuts, and sweet-and-sour fruit reductions.',
    inspectorNote: 'A beautiful dining room in Gemmayze that serves as an emotional guardian of heritage. The manté (tiny baked meat dumplings in warm garlic yogurt and wild native sumac) are incredibly comforting. A fantastic, classic spot of high standard.',
    signatureDishes: [
      'Manté: Crisp baked boat-shaped dumplings stuffed with spiced meat, bathed in hot yogurt and sumac',
      'Subeoreg: Layers of boiled and baked dough with premium local cheeses and melted butter',
      'Armenian Kibbeh: Spiced raw beef paste blended with cracked wheat, red pepper paste, and walnuts'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Warm Family Hospitality', 'Historic Stone Walls', 'Excellent Outdoor Patio', 'Unique Spiced Wine Selection'],
    instagram: '@mayrigbeirut',
    category: 'fine_dining'
  },
  {
    id: 'rest-6',
    name: 'Mayas',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.8912, lng: 35.5098, x: 42, y: 58 },
    stars: 1,
    distinction: 'STAR_1',
    priceRange: '$$$',
    cuisine: 'Authentic Levantine Grill & Mezze',
    address: 'Downtown Waterfront District, Beirut, Lebanon',
    phone: '+961 1 999 888',
    website: 'https://mayasbeirut.com',
    chef: 'Hassan Al-Amine',
    description: 'An elegant, high-profile waterfront mezze restaurant where traditional flavors are refined with modern luxury and exceptional culinary consistency.',
    inspectorNote: 'Mayas offers spectacular waterfront views paired with highly accurate traditional recipes. The hummus is perfectly smooth, the kibbeh is crisp and delicious, and the skewered meat cooked over selected charcoal is juicy and tender.',
    signatureDishes: [
      'Raw Kibbeh Nayyeh: Ultra-fresh lamb ground with mint, green onions, and native spices',
      'Cherry Kabab: Miniature lamb meatballs tossed in mountain-cherry coulis',
      'Osmalieh: Golden spun pastry containing fresh clotted ashta cream, served with orange-blossom syrup'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Waterfront Promenade Deck', 'Luxury Lounge Seating', 'Live Traditional Oud Music', 'Exclusive Arak Bar'],
    instagram: '@mayas_beirut',
    category: 'fine_dining'
  },
  {
    id: 'rest-7',
    name: 'Tawlet Ammiq',
    city: 'Batroun',
    country: 'Lebanon',
    coordinates: { lat: 34.2541, lng: 35.6592, x: 48, y: 32 },
    stars: 1,
    distinction: 'STAR_1',
    priceRange: '$$$',
    cuisine: 'Lebanese Rural Kitchen & Farmhouse',
    address: 'Batroun Mountain Reserve Heights, Lebanon',
    phone: '+961 3 002 911',
    website: 'https://soukelttayeb.com/tawlet/ammiq',
    chef: 'Local Village Matriarchs',
    description: 'An eco-sustainable farm-to-table culinary platform where culinary matriarchs from local villages prepare authentic, historic recipes with hyper-local organic mountain ingredients.',
    inspectorNote: 'An phenomenal culinary initiative set in a gorgeous eco-lodge overlooking Lebanese mountain slopes. Every day, a different local mother cooks her village’s signature recipe. The food is raw, rustic, emotional, and executed with superb precision using local wild-grown herbs.',
    signatureDishes: [
      'Friket Kharouf: Smoked green wheat tossed with toasted pine seeds and slow-roasted tender lamb',
      'Koussa Bil Laban: Organic stuffed baby zucchini cooked in a velvet, garlic-mint mountain goat yogurt',
      'Zenkol: Light sweet herbal dough dumplings poached and tossed in cold wild blossom honey syrup'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Scenic Mountain Panorama', '100% Eco-Sustainable Building', 'Farm-to-Table Organic Produce', 'Daily Changing Regional Menu'],
    instagram: '@tawlet_lebanon',
    category: 'fine_dining'
  },

  // CATEGORY: PUB_CAFE
  {
    id: 'rest-8',
    name: 'Ferdinand',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.8962, lng: 35.4820, x: 22, y: 48 },
    stars: 0,
    distinction: 'SELECTED',
    priceRange: '$$',
    cuisine: 'Gourmet Pub & Craft Cocktails',
    address: 'Mahatma Gandhi Street, Hamra, Beirut, Lebanon',
    phone: '+961 1 355 955',
    website: 'https://facebook.com/ferdinandbeirut',
    chef: 'Rani Al-Haddad',
    description: 'A cozy, dimly lit gastro-pub in Hamra famous for its laid-back atmosphere, exceptional craft cocktails, and the legendary Ferdinand Blueberry burger.',
    inspectorNote: 'Ferdinand brings true craft gastropub energy to Hamra. Their signature burger—beef patty topped with crispy bacon, melted cheddar, and a secret homemade blueberry jam—is highly addictive. The mixology is intellectual, incorporating home-distilled organic syrups and local mountain herbs.',
    signatureDishes: [
      'The Ferdinand Burger: Grass-fed dry-aged patty, double bacon, and signature savory blueberry reduction',
      'Crispy Herb Shoestring Fries: Hand-cut potatoes sprinkled with wild thyme, rosemary, and block-grated halloumi cheese',
      'Smoked Rosemary Old Fashioned: Custom dark oak-aged whiskey smoked table-side with dried mountain cedar needles'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Cozy Retro Vinyl Atmosphere', 'World-Class Craft Mixology', 'Friendly Neighborhood Vibe', 'Late Night Gourmet Eats'],
    instagram: '@ferdinand.beirut',
    category: 'pub_cafe'
  },
  {
    id: 'rest-9',
    name: 'Kalei Coffee Co.',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.8980, lng: 35.5290, x: 74, y: 44 },
    stars: 0,
    distinction: 'SELECTED',
    priceRange: '$$',
    cuisine: 'Specialty Coffee House & Garden Cafe',
    address: 'Rue 54, Mar Mikhael, Beirut, Lebanon',
    phone: '+961 3 780 340',
    website: 'https://kaleicoffee.com',
    chef: 'Dalia Jabra',
    description: 'An exquisite specialty coffee-roastery in a restored historic Lebanese home with an wild, overgrown brick garden terrace. Proudly serving ethically sourced global beans roasted in-house.',
    inspectorNote: 'A peaceful, hidden gem in the busy Mar Mikhael arts district. Kalei is perfect for reading under high walnut trees. Their cold brew infused with orange blossom water, alongside open-faced toasted sourdough topped with local avocados, organic feta, and mint is spectacular.',
    signatureDishes: [
      'Orange Blossom Cold Brew: In-house roasted single-origin bean coffee steeped with subtle floral orange-blossom mist',
      'Avocado Halloumi Toast: Sourdough slices loaded with creamed avocado, grilled halloumi slices, and wild mountain sumac',
      'Cardamom Honey Latte: Espressos with organic honey, warm cardamom milk'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Restored Architectural House', 'Quiet Lush Outdoor Garden', 'On-Site Coffee Roastery', 'Laptops & Books Welcome'],
    instagram: '@kaleicoffee.co',
    category: 'pub_cafe'
  },
  {
    id: 'rest-10',
    name: 'Torino Express',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.8965, lng: 35.5175, x: 56, y: 40 },
    stars: 0,
    distinction: 'BIB_GOURMAND',
    priceRange: '$',
    cuisine: 'Espresso Bar, Aperitivo & Music Hub',
    address: 'Gemmayze Main Street, Gemmayze, Beirut, Lebanon',
    phone: '+961 1 561 121',
    website: 'https://facebook.com/torinoexpress',
    chef: 'Andrea Castiglione',
    description: 'Operating since 2004, Torino Express is an absolute Beirut institution. An ultra-hip, tiny stone-vaulted bar that operates as a quiet Italian-style espresso shop by day, and a wild cocktail bar by night.',
    inspectorNote: 'This vaulted room has historic soul. Stand at the copper bar counter with an outstanding double-shot espresso in the morning, or return in the evening to hear underground vinyl DJs spin vintage tunes while enjoying classic cocktails with a Lebanese twist.',
    signatureDishes: [
      'Double Espresso Macchiato: Rich Italian dark organic blend pulled with master density',
      'Arak Sunset Mule: Lebanese traditional triple-distilled arak liquor, spicy ginger beer, and crushed garden mint',
      'Caprese Toast: Local baked baguette loaded with garden basil pesto, fresh heirloom tomatoes, and olive oil'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Historic Stone Arch Vault', 'Cozy Standing Bar Vibe', 'Eclectic Vinyl DJ Sessions', 'Day-to-Night Transition Cafe'],
    instagram: '@torinoexpress',
    category: 'pub_cafe'
  },
  {
    id: 'rest-11',
    name: 'Colonel Beer Brewery',
    city: 'Batroun',
    country: 'Lebanon',
    coordinates: { lat: 34.2562, lng: 35.6565, x: 42, y: 24 },
    stars: 0,
    distinction: 'SELECTED',
    priceRange: '$$',
    cuisine: 'Beachfront Craft Brewery & Pub',
    address: 'Batroun Public Beach Coast, Batroun, Lebanon',
    phone: '+961 6 743 543',
    website: 'https://colonelbeer.com',
    chef: 'Jamil Haddad (Founder)',
    description: 'Lebanon’s pioneering craft microbrewery. Set in a gorgeous eco-friendly beachfront industrial hangar in Batroun, serving fresh, crisp organic lagers and delicious pub-grill classics.',
    inspectorNote: 'Colonel is a beautiful tribute to Batroun’s ocean-loving, windsurfing culture. Beers are brewed on-site and can contain organic local coriander or wild thyme additions. Accompanying their signature Batroun lemon-craft ale with fresh fried baby calamari on the sands is spectacular.',
    signatureDishes: [
      'Colonel Lager Pint: Crisp, eco-filtered local golden draft organic beer in a frosted glass',
      'Sriracha Glazed Calamari: Fresh beachfront squid tossed in a spicy, fiery house sauce',
      'The Colonel BBQ Pork Ribs: Slow-braised ribs glazed in dark stout-infused barbecue reduction'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1568219656418-15c329c72fd3?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Direct Beachfront Access', 'Eco-Friendly Container Styling', 'On-Site Brewery Tours', 'Live Acoustic Sunset Concerts'],
    instagram: '@colonelbeer',
    category: 'pub_cafe'
  },
  {
    id: 'rest-12',
    name: 'The Blue House Tea',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.8944, lng: 35.5144, x: 52, y: 50 },
    stars: 0,
    distinction: 'SELECTED',
    priceRange: '$$$',
    cuisine: 'Artisanal Tea Salon & Botanical Pastries',
    address: 'Pasteur Street, Gemmayze, Beirut, Lebanon',
    phone: '+961 1 564 321',
    website: 'https://thebluehousetea.com',
    chef: 'Maya Toubi',
    description: 'A gorgeous, pastel-colored architectural sanctuary celebrating wild tea blends and gorgeous botanical french-lebanese pastries.',
    inspectorNote: 'Tucked inside a legendary, blue-painted palace in Gemmayze, Maya Toubi serves wild mountain herbs gathered from Lebanese peaks. Pair their organic rosebud-infused green tea with light pistachio macarons for a beautiful afternoon experience.',
    signatureDishes: [
      'Lebanese Sage Tea: Mountain organic white sage brewed with cinnamon bark and honey',
      'Pistachio Rose Saint-Honoré: Delicate caramel puff pastry with cream, fresh roses, and local pistachios',
      'Thyme infusion Scone: Savory scone baked with wild zaatar spices, served with whipped labneh cream'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['High-End Pastel Salon Design', 'Organic Mountain Teas Hand-Gathered', 'Delicate Live Piano Music', 'Beautiful Outdoor Patio'],
    instagram: '@thebluehousetea',
    category: 'pub_cafe'
  },

  // CATEGORY: VIBE (Lively Atmospheric / Nightlife)
  {
    id: 'rest-13',
    name: 'Pierre & Friends',
    city: 'Batroun',
    country: 'Lebanon',
    coordinates: { lat: 34.2388, lng: 35.6512, x: 35, y: 38 },
    stars: 0,
    distinction: 'SELECTED',
    priceRange: '$$$',
    cuisine: 'Coastal Seafood, Beach Club & Sunset Vibe',
    address: 'Seaside Highway Coast, Batroun, Lebanon',
    phone: '+961 3 352 930',
    website: 'https://facebook.com/pierreandfriends',
    chef: 'Pierre Abi Chahine',
    description: 'An absolute, world-renowned Lebanese coastline legend. A seaside restaurant and dynamic bar built on rocky cliffs, famous for its rustic wooden decks, crash-wave sundocks, and superb fresh catches.',
    inspectorNote: 'Pierre & Friends is a spectacular lifestyle experience. This is where Beirut’s elite come for sunset beers and fresh, raw sea urchins directly harvested from the surf. As dusk falls, the music increases, bonfires are lit on the rocky shore, and the absolute best beach-party energy of the Levant begins.',
    signatureDishes: [
      'Raw Sea Urchins (Toutia): Freshly harvested, served in shells with lemon wedges and extra virgin olive oil',
      'Grilled Sea Bass: Crisped over beach pine coals, served with rich tarator sauce',
      'Batroun Lemonade Margarita: A refreshing cocktail of fresh-squeezed Batroun lemonade, triple-sec, and local arak'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Built Directly on Rocky Cliffs', 'Spectacular Sunset Views', 'Beach Bonfire Party', 'Seaside DJs & Cocktail Bar'],
    instagram: '@pierre.and.friends',
    category: 'vibe'
  },
  {
    id: 'rest-14',
    name: 'Iris Beirut',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.9022, lng: 35.5085, x: 38, y: 32 },
    stars: 0,
    distinction: 'SELECTED',
    priceRange: '$$$$',
    cuisine: 'Waterfront Rooftop Lounge & Tapas',
    address: 'Sea Side Road, Waterfront District, Beirut, Lebanon',
    phone: '+961 71 5333 13',
    website: 'https://irisbeirut.com',
    chef: 'Samer Kassab',
    description: 'A sleek, sensory, rooftop lounge offering stunning views of the Mediterranean Sea and Beirut’s skyline. Famous for its energetic sunset sessions, exceptional cocktails, and high-energy music.',
    inspectorNote: 'Iris dominates Beirut’s sky. The design is modern, framed by giant white canvas canopies and neon light features. Dine on beautiful fresh raw plates—such as sea bass tartare in lime zest—before enjoying dancing with world-renowned resident DJs under the stars.',
    signatureDishes: [
      'Mediterranean Sea Bass Tartare: Cold chopped sea bass with fresh green apple, cucumber, and olive oil',
      'Charcoal-Grilled Prawn Sticks: Skewered jumbo prawns marinated in native sumac and chili reduction',
      'Iris Sunset Smash: Signature vodka cocktail shaken with muddled fresh watermelon, wild honey, and mint leaf'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1570872626485-d8ffea69f463?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Panoramic Skyline Views', 'Sleek Open-Air Rooftop Deck', 'World-Class Guest DJs', 'Sensational Sunset Promenades'],
    instagram: '@irisbeirut',
    category: 'vibe'
  },
  {
    id: 'rest-15',
    name: 'B018',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.9015, lng: 35.5298, x: 78, y: 28 },
    stars: 0,
    distinction: 'SELECTED',
    priceRange: '$$$$',
    cuisine: 'Underground Electronic Temple & Late Bites',
    address: 'Quarantina Industrial Zone, Beirut, Lebanon',
    phone: '+961 3 800 018',
    website: 'https://b018.com',
    chef: 'Nadim Abboud',
    description: 'Designed by legendary architect Bernard Khoury, B018 is a world-famous underground shelter structure with a massive metal roof that retracts to expose dancing crowds to the night sky.',
    inspectorNote: 'An absolute masterpiece of architectural, structural, and cultural design. To see the massive heavy steel roof slowly slide back at 4 AM, revealing the stars above Gemmayze and the maritime ports while dancing, is an unforgettable cultural experience. They offer high-end late-night bites like mini sliders and hot manousheh wraps.',
    signatureDishes: [
      'Midnight Sujuk Slider: Spicy local lamb beef sujuk sausage grilled and stuffed in toasted mini brioche',
      'Truffle Thyme Flatbread: Crispy thin yeast dough cooked with wild thyme, white truffle oil, and local goat cheese',
      'Quarantina Sour: Special signature smokey mezcal shaken with fresh sour lemon juice and orange blossom honey'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Retractable Heavy Metal Roof', 'Designed by Architect Bernard Khoury', 'Underground Rave Legacy', 'Late Night Fuel Kitchen'],
    instagram: '@b018',
    category: 'vibe'
  },
  {
    id: 'rest-16',
    name: 'MusicHall',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.8999, lng: 35.5022, x: 26, y: 34 },
    stars: 0,
    distinction: 'SELECTED',
    priceRange: '$$$$',
    cuisine: 'Theatrical Music Cabaret & Levantine Dining',
    address: 'Starco Building, Downtown, Beirut, Lebanon',
    phone: '+961 1 371 144',
    website: 'https://elefteriades.com/musichall',
    chef: 'Michel Elefteriades (Owner)',
    description: 'An iconic waterfront cabaret created by Michel Elefteriades. Offers a high-end variety show featuring up to 10 live acts of world-wide genres paired with beautiful gastronomic dining.',
    inspectorNote: 'An absolute theater of entertainment. The acts switch rapidly—featuring talented local vocalists singing traditional Tarab classics, gypsy flame guitarists, and dynamic African drumming circles. The food is exceptionally high standard for an active entertainment venue, offering delicious mezze and tender cuts of black angus beef.',
    signatureDishes: [
      'Black Angus Beef Kebabs: Premium tender beef skewers charcoal-seared and glazed with wild pomegranate reductions',
      'The Elefteriades Mezze Platter: Custom collection of fine hummus, mutabbal, and crisp halloumi bourek',
      'Ashta Ice Cream Castle: Mountains of traditional rose-water ice cream decorated with crushed pistachios'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1503095391755-14171168db45?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Spectacular Live Variety Show', 'Historic Theater Interior Design', 'VVIP Booth Seating', 'Premium Levantine Mezze Options'],
    instagram: '@musichallbeirut',
    category: 'vibe'
  },
  {
    id: 'rest-17',
    name: 'Locanda a la Granda',
    city: 'Byblos',
    country: 'Lebanon',
    coordinates: { lat: 34.1205, lng: 35.6465, x: 48, y: 44 },
    stars: 0,
    distinction: 'BIB_GOURMAND',
    priceRange: '$$',
    cuisine: 'Funky Lebanese Fusion & Cocktail Lounge',
    address: 'Old Souks, Byblos, Lebanon',
    phone: '+961 9 540 330',
    website: 'https://instagram.com/locandabyblos',
    chef: 'Ziad Doueihy',
    description: 'A funky, colorful fusion bistro located directly in the heart of Byblos’ ancient stone souks, offering creative, playful twists on local Levantine dishes.',
    inspectorNote: 'Tucked inside ancient Byblos alleyways with a beautiful red rooftop deck, Locanda transforms simple local favorites. Hummus is cooked with sweet figs, and kibbeh nayyeh is rolled in fresh crisp almonds and honey. High energy, outstanding value, fully representative of Bib Gourmand cooking.',
    signatureDishes: [
      'Fig Hummus: Creamy signature chickpeas blended with sweet mountain figs and white balsamic reduction',
      'Kibbeh Chocolat: Sweet savory fried kibbeh stuffed with melted native dates and walnuts',
      'Byblos Basil Sangria: Chilled local red wine pitcher muddled with fresh garden basil and orange juice'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Rooftop Overlooking Ancient Souks', 'Funky Pop-Art Interior', 'Very Creative Fusion Dishes', 'Lively Young Neighborhood Vibe'],
    instagram: '@locandabyblos',
    category: 'vibe'
  },

  // CATEGORY: TAKEAWAY_BAKERY_PRODUCE
  {
    id: 'rest-18',
    name: 'Furn Beaino',
    city: 'Byblos',
    country: 'Lebanon',
    coordinates: { lat: 34.1245, lng: 35.6521, x: 64, y: 28 },
    stars: 0,
    distinction: 'BIB_GOURMAND',
    priceRange: '$',
    cuisine: 'Traditional Bakeries & Manousheh',
    address: 'Jbeil Main Highway, Byblos, Lebanon',
    phone: '+961 9 541 414',
    website: 'https://furnbeaino.com',
    chef: 'Tony Beaino',
    description: 'An legendary bakery established in 1975, celebrated for its legendary thin-crust Lahme B\'ajin and incredible thyme-mint manousheh wraps.',
    inspectorNote: 'Furn Beaino is a shrine of exceptional bakery. The secret lies in their 24-hour slow fermented dough, which is stretched into thin crusts that become incredibly crisp in high-heat stone ovens. Their beef Lahme B\'ajin—layered with onions, fresh-crushed pomegranate molasses, and sumac—is an absolute masterpiece, deserving its Bib Gourmand rating.',
    signatureDishes: [
      'Lahme B\'ajin with Pomegranate: Crispy flatbread baked with spicy minced pasture beef and pomegranate syrup',
      'Manousheh Zaatar and Cheese: Half thyme, half akkawi cheese folded with cold fresh mint roots, cucumber, and black olives',
      'Baked Halloumi Swirl: Tender dough rolled around thick halloumi cheese and black sesame seeds'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Stone Deck Ovens', 'Superb Takeaway Speed', 'Established in 1975', 'Ultra-Affordable Comfort Food'],
    instagram: '@furn_beaino',
    category: 'takeaway_bakery_produce'
  },
  {
    id: 'rest-19',
    name: 'Hajj Nasr',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.8968, lng: 35.5241, x: 64, y: 44 },
    stars: 0,
    distinction: 'SELECTED',
    priceRange: '$',
    cuisine: 'Legendary Street-Food Takeaway',
    address: 'Armenia Street, Mar Mikhael, Beirut, Lebanon',
    phone: '+961 1 562 256',
    website: 'https://facebook.com/hajjnasr',
    chef: 'Hajj Nasr (Owner)',
    description: 'Operating for over 40 years, Hajj Nasr is a world-renowned midnight street food takeaway kiosk in Mar Mikhael, famous for its custom spices and delicious late-night rolls.',
    inspectorNote: 'The rock star of Beirut street cooking. Standing under dim bright marquee lights at 2 AM, watching Hajj Nasr grill spicy beef sujuk with tomatoes and pickles, wrapping it in thin Lebanese markouk bread is a beautiful cultural tradition. Flavor is intense, wild, and incredibly pure.',
    signatureDishes: [
      'Sujuk Markouk Wrap: Charred spicy sujuk sausage rolled in ultra-thin wheat mountain bread with garlic sauce and wild green pickles',
      'Roast Beef Roll: Slow-cooked beef flank tossed with mayonnaise, mustard, tomatoes, and extra mint',
      'Melted Halloumi Markouk: Clay flatbread cooked with warm halloumi cheese and red chili oil'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Famous Late-Night Kiosk', 'Fast Counter-Serve Only', 'No Sit-Down Tables', 'Historic Street Icon'],
    instagram: '@hajjnasr_beirut',
    category: 'takeaway_bakery_produce'
  },
  {
    id: 'rest-20',
    name: 'Al Hallab 1881',
    city: 'Tripoli',
    country: 'Lebanon',
    coordinates: { lat: 34.4361, lng: 35.8451, x: 50, y: 30 },
    stars: 0,
    distinction: 'SELECTED',
    priceRange: '$$',
    cuisine: 'Traditional Sweets, Bakeries & Desserts',
    address: 'Riad El Solh Street, Tripoli, Lebanon',
    phone: '+961 6 444 324',
    website: 'https://alhallab.com',
    chef: 'Abdul Rahman Al Hallab',
    description: 'An majestic, historic pastry palace in Tripoli dedicated to traditional Lebanese Arabic sweets and baked desserts since 1881.',
    inspectorNote: 'Al Hallab is a breathtaking historical landmark of dessert baking. They use fresh grass-fed butter, triple-distilled orange flower water, and mountain-harvested sheep-milk ashta cream. Their Halawet El Jibn is light, fresh, and perfectly balanced, which represents Tripoli’s ultimate culinary crown.',
    signatureDishes: [
      'Halawet El Jibn: Sweet cheese roll dough stuffed with clotted ashta cream, drizzled with sweet sugar blossom syrup',
      'Tripoli Knafeh: Baked semolina and akkawi melted cheese pastry served warm inside a fresh sesame brioche bun',
      'Baklava: Crispy multi-layered phyllo dough pastry stuffed with crushed green Aleppo pistachios'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Breathtaking Historic Palace', 'Takeaways & Gift Boxes Available', 'Established in 1881', 'Live Dessert Cooking Stations'],
    instagram: '@alhallab1881',
    category: 'takeaway_bakery_produce'
  },
  {
    id: 'rest-21',
    name: 'Souk El Tayeb',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.8961, lng: 35.5105, x: 44, y: 48 },
    stars: 0,
    distinction: 'SELECTED',
    priceRange: '$$',
    cuisine: 'Organic Farmers Market & Local Produce Hub',
    address: 'Trablos Street, Beirut Souks, Beirut, Lebanon',
    phone: '+961 1 448 129',
    website: 'https://soukelttayeb.com',
    chef: 'Kamal Mouzawak (Founder)',
    description: 'A beautiful farmers market cooperative showcasing organic produce, raw mountain honeys, native wild olives, and regional baked specialties from Lebanese villages.',
    inspectorNote: 'An absolute, emotional celebration of land, diversity, and agriculture. Kamal Mouzawak has united master food artisans and farmers from across Lebanon to display their local harvests. Come on Saturdays to buy wild organic thyme, high-elevation honey, and fresh sheep labneh directly from the producers.',
    signatureDishes: [
      'Gourmet Saj Thyme Roll: Flatbread stretched and baked fresh on convex metal domes, coated in native wild hand-crushed thyme and organic olive oil',
      'Organic Mountain Honey tasting: Raw wild thyme and cedar honeys from high Lebanese elevations',
      'Heirloom Fig and Walnut Jam: Sweet, chunky local figs cooked with natural flower cloves'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1488459718432-01055e67e1f5?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Weekly Farmers Cooperative Market', 'Farmers & Artisans Direct Stalls', '100% Organic Local Sourcing', 'Warm Community Atmosphere'],
    instagram: '@soukeltayeb',
    category: 'takeaway_bakery_produce'
  },
  {
    id: 'rest-22',
    name: 'Abou Abdallah',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.8821, lng: 35.5112, x: 48, y: 72 },
    stars: 0,
    distinction: 'SELECTED',
    priceRange: '$',
    cuisine: 'Authentic Traditional Mezze & Hummus',
    address: 'Badaro Main Street, Badaro, Beirut, Lebanon',
    phone: '+961 1 381 330',
    website: 'https://facebook.com/abouabdallah',
    chef: 'Hassan Abdallah',
    description: 'Lebanon’s supreme temple for traditional Lebanese breakfast bowls of warm comforting fawat, spiced broad bean ful medames, and silky hummus-bil-lahme.',
    inspectorNote: 'A beautiful neighborhood legend where families gather for authentic comforting bites. Their Fatteh—composed of crisp toasted thin bread, warm spiced chickpeas, garlic-rich goat yogurt, and topped with sparkling melted butter and roasted nuts—is phenomenal.',
    signatureDishes: [
      'Fatteh Hummus: Layers of toasted flatbread, spiced chickpeas, and garlic yogurt, topped with hot ghee and pine nuts',
      'Ful Medames: Slow-cooked fava beans with organic lemon juice, garlic, extra virgin olive oil, and fresh cumin',
      'Hummus lahme: Silky chickpea purée loaded with hot sautéed grass-fed lamb cubes and roasting nuts'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Neighborhood Breakfast Legend', 'Warm Cozy Family Seating', 'Live Counter Preparation', 'Extremely Speedy Service'],
    instagram: '@abouabdallah_beirut',
    category: 'takeaway_bakery_produce',
    neighborhood: 'badaro'
  },
  // NEW NEIGHBORHOOD RESTAURANTS
  {
    id: 'rest-antelias-1',
    name: 'Al Sultan Brahim',
    city: 'Antelias',
    country: 'Lebanon',
    coordinates: { lat: 33.9168, lng: 35.5912, x: 45, y: 35 },
    stars: 1,
    distinction: 'STAR_1',
    priceRange: '$$$$',
    cuisine: 'Lebanese Seafood & Coastal Grill',
    address: 'Antelias Seaside Road, Antelias, Lebanon',
    phone: '+961 4 712 111',
    website: 'https://al-sultanbrahim.com',
    chef: 'Ramy El-Sultan',
    description: 'A legendary Beirut institution located on the Antelias coastline, celebrated for its masterfully grilled fresh catches, immaculate raw seafood, and pristine traditional cold mezze.',
    inspectorNote: 'Al Sultan Brahim in Antelias continues a family history of seafood excellence since 1961. The selection of fresh fish is unrivaled—diners choose their catch from a mountain of crushed ice. The signature raw sea bass with olive oil, the warm spicy red pepper muhammara, and the perfectly salted grilled red mullet are spectacular.',
    signatureDishes: [
      'Raw Sea Bass Sashimi: Pristine thin cuts of local sea bass with exceptional wild sea salt, fresh mint, and cold-pressed olive oil',
      'Fried Red Mullet (Sultan Ibrahim): Crisped gold-brown, incredibly fresh, and flakey',
      'Muhammara: Silky walnut paste blended with Aleppo red pepper flakes, olive oil, and sweet pomegranate molasses'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Direct Seaside Sunset Deck', 'Fresh Fish Selection Counter', 'Historic Multi-Generation Family Legacy', 'Valet Parking & Fine Dining Service'],
    instagram: '@alsultanbrahim',
    category: 'fine_dining',
    neighborhood: 'antelias'
  },
  {
    id: 'rest-antelias-2',
    name: 'Seray Antelias',
    city: 'Antelias',
    country: 'Lebanon',
    coordinates: { lat: 33.9155, lng: 35.5898, x: 55, y: 45 },
    stars: 0,
    distinction: 'BIB_GOURMAND',
    priceRange: '$$$',
    cuisine: 'Traditional Lebanese Haute Cuisine',
    address: 'Fawwar Antelias Street, Antelias, Lebanon',
    phone: '+961 4 521 222',
    website: 'https://instagram.com/serayrestaurant',
    chef: 'George Chamoun',
    description: 'Set in a beautifully restored Lebanese home with grand stone arches in Fawwar Antelias, Seray serves polished, majestic Lebanese favorites with an exquisite modern touch.',
    inspectorNote: 'Tucked away along the green hills of Fawwar Antelias, Seray is a fantastic retreat with high stone ceilings and an airy terrace. Their signature Hummus with warm slow-braised beef filet cubes and toasted almonds is highly addictive, and the freshly baked puffed pita bread is perfection.',
    signatureDishes: [
      'Hummus Seray: Warm, smooth garlic-chickpea purée topped with sautéed beef tenderloin cubes and toasted pine nuts',
      'Mixed Grill Skewers: Shish taouk, kafta, and lamb skewers marinated in mountain garlic and rosemary, cooked over charcoal',
      'Knefe with Ashta: Traditional sweet warm golden cheese kataifi pastry served with fresh regional rose-water ashta cream'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Authentic Stone House Setting', 'Amazing Mountain & Valley Breezes', 'Lush Shaded Garden Terrace', 'Outstanding Traditional Shisha Selection'],
    instagram: '@serayrestaurant',
    category: 'fine_dining',
    neighborhood: 'antelias'
  },
  {
    id: 'rest-badaro-1',
    name: 'Onno Badaro',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.8812, lng: 35.5122, x: 55, y: 65 },
    stars: 1,
    distinction: 'STAR_1',
    priceRange: '$$',
    cuisine: 'Armenian-Lebanese Homestyle',
    address: 'Badaro Main Street, Badaro, Beirut, Lebanon',
    phone: '+961 1 382 444',
    website: 'https://facebook.com/onnorestaurant',
    chef: 'Maida Onno',
    description: 'Onno is widely loved for its incredibly authentic, home-cooked Armenian dishes. Located in the tree-lined neighborhood of Badaro, this cozy dining room serves rich, spiced, comforting family recipes.',
    inspectorNote: 'The armenian spices are warm and fragrant. Their Cherry Kebab (skewered spiced ground beef in a glossy, sweet-and-sour wild sour cherry reduction) is the absolute best in the country. The vibe is welcoming, like entering a family home.',
    signatureDishes: [
      'Kabab Karaz: Spiced lean beef skewers covered in a sweet wild mountain sour cherry coulis and toasted pine nuts',
      'Itch Salad: Fragrant Armenian bulgur salad tossed with hand-pressed tomatoes, spring green onions, olive oil, and sumac',
      'Onno Manté: Baked parcel-shaped dumplings stuffed with highly spiced lamb, covered in rich garlic-yogurt and paprika oil'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Charming Brick Interior', 'Friendly Family-Owned Hospitality', 'Phenomenal Armenian Spiced Specialties', 'Cozy Street-Side Seating'],
    instagram: '@onno_badaro',
    category: 'fine_dining',
    neighborhood: 'badaro'
  },
  {
    id: 'rest-hamra-1',
    name: 'Barbar Hamra',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.8955, lng: 35.4841, x: 35, y: 55 },
    stars: 0,
    distinction: 'SELECTED',
    priceRange: '$',
    cuisine: 'Legendary Street-Food Takeaway',
    address: 'Piccadilly Street, Hamra, Beirut, Lebanon',
    phone: '+961 1 350 000',
    website: 'https://barbarrestaurant.com',
    chef: 'Mohammad Ghaziri',
    description: 'An absolute, unmissable Beirut landmark open 24/7 since 1979 in the heart of Hamra. Famous for serving the absolute best shawarmas, falafels, and hot manoushehs under buzzing municipal neon signs.',
    inspectorNote: 'Barbar is the beating heart of Hamra street food culture. Having fed generations of locals, their beef and chicken shawarmas represent a golden standard—wrapped in fresh bread with highly custom ratios of garlic paste, tahini, and wild green pickled peppers.',
    signatureDishes: [
      'Beef Shawarma Sandwich: Spit-roasted grass-fed beef shaved into fresh pita bread with fresh green parsley, onions, and tahini tarator sauce',
      'Crispy Falafel Duo: Spiced chickpea croquettes fried gold, loaded with juicy fresh tomatoes, mint, radish, and pickled turnips',
      'Spicy Sujuk Manousheh: Puffed clay dough spread with highly spiced ground beef paste, akkawi cheese, and fresh mint leaves'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Legendary 24/7 Service', 'Stall Counter & Fast Takeaway Only', 'Iconic Historic Brand since 1979', 'Ultra-Affordable Classic Comforts'],
    instagram: '@barbarbeirut',
    category: 'takeaway_bakery_produce',
    neighborhood: 'hamra'
  },
  {
    id: 'rest-sassine-1',
    name: 'Seza Achrafieh',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.8885, lng: 35.5188, x: 74, y: 72 },
    stars: 1,
    distinction: 'STAR_1',
    priceRange: '$$$',
    cuisine: 'Armenian-Lebanese Homestyle',
    address: 'Sursock District, Achrafieh, Beirut, Lebanon',
    phone: '+961 1 561 222',
    website: 'https://instagram.com/seza.beirut',
    chef: 'Seza Sarafian',
    description: 'An absolute visual and culinary gem and secret garden in the Sursock district near Sassine. Seza serves refined, exceptional Armenian and Lebanese homestyle recipes in a beautifully designed old house.',
    inspectorNote: 'Seza Sarafian creates a magical, fairy-lit sanctuary. Plates are prepared with incredible care. The wild cherry kebabs are sensational, and the subeoreg (cheese-filled baked layers) is flakey and buttery. A superb 1-star destination.',
    signatureDishes: [
      'Subeoreg Cheese Squares: Delicate puff layers containing akkawi and kashkaval melting cheeses with black caraway seed',
      'Kabab Karaz: Hand-rolled charcoal meat skewers steeped in a wild sour cherry glaze and fresh pine nuts',
      ' Armenian Lentil Salad: Spicy red lentils, fresh green coriander, organic cold olive oil, and sumac'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Fairy-Lit Secret Garden', 'Charming 20th Century Mansion', 'Highly Refined Armenian Classics', 'Exceptional Wine Selection'],
    instagram: '@seza.beirut',
    category: 'fine_dining',
    neighborhood: 'sassine'
  },
  {
    id: 'rest-hamra-2',
    name: 'T-Marbouta',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.8967, lng: 35.4815, x: 26, y: 52 },
    stars: 0,
    distinction: 'SELECTED',
    priceRange: '$$',
    cuisine: 'Lebanese Home-Style & Cafe Culture',
    address: 'Hamra Main Street, Beirut, Lebanon',
    phone: '+961 1 350 204',
    website: 'https://facebook.com/t.marbouta',
    chef: 'Kamal Harb',
    description: 'A peaceful garden cafe and intellectual haven in Hamra, serving superb homestyle mezze and traditional stews amidst shelves of literature.',
    inspectorNote: 'T-Marbouta perfectly preserves the old intellectual atmosphere of Hamra. Hidden away from the busy street noise, its quiet courtyard is a favorite for scholars and writers. The kitchen serves some of the most authentic daily-changing stews (such as Mulukhiyah or Kibbeh bil Sanieh) alongside exceptional mint-lemonades. A marvelous neighborhood spot of great value.',
    signatureDishes: [
      'Daily-Stew Selection: House-special slow-cooked traditional Lebanese stews served with fragrant vermicelli rice',
      'Batroun Mint Lemonade: Cold fresh-squeezed village lemons muddled with mountain mint',
      'Kaza-Zaatar: Warm clay-baked flatbread topped with local thyme and melted kashkaval cheese'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Intellectual Library Shelves', 'Quiet Outdoor Backyard Garden', 'Rotating Traditional Daily Dishes', 'Warm Friendly Student Atmosphere'],
    instagram: '@tmarbouta',
    category: 'pub_cafe',
    neighborhood: 'hamra'
  },
  {
    id: 'rest-hamra-3',
    name: 'Appetito Trattoria',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.8958, lng: 35.4832, x: 30, y: 58 },
    stars: 0,
    distinction: 'BIB_GOURMAND',
    priceRange: '$$',
    cuisine: 'Cozy Italian Trattoria',
    address: 'Mahatma Gandhi Street, Hamra, Beirut, Lebanon',
    phone: '+961 1 347 348',
    website: 'https://appetitotrattoria.com',
    chef: 'Sandro Maccioni',
    description: 'A rustic, warm Italian bistro tucked in a green alleyway of Hamra, celebrating clay-oven pizzas and authentic hand-rolled pastas.',
    inspectorNote: 'Stepping into Appetito feels like a sudden flight to a Tuscan cottage. Vines climb the warm yellow brick front, and candlelight dances on wood tables. Chef Sandro Maccioni is a master of fresh pastas; his pumpkin ravioli in sage butter is silk, and the wood-fired truffle pizza is light, bubbly, and fragrant.',
    signatureDishes: [
      'Tagliatelle ai Funghi: Fresh ribbon pasta with wild mountain mushrooms, rich garlic cream, and truffle oil',
      'Pizza Margherita DOC: Airy sourdough base cooked in the high-heat wood oven with fresh buffalo mozzarella and garden basil',
      'Tiramisu Della Casa: Light velvet mascarpone layers soaked in Torino espresso and sweet Marsala wine'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Wood-Fired Pizza Oven', 'Romantic Al-Fresco Alley Seating', 'Warm Rustic Brick Architecture', 'Extremely Comprehensive Wine List'],
    instagram: '@appetito.trattoria',
    category: 'pub_cafe',
    neighborhood: 'hamra'
  },
  {
    id: 'rest-sassine-2',
    name: 'Almayass',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.8895, lng: 35.5160, x: 50, y: 76 },
    stars: 1,
    distinction: 'STAR_1',
    priceRange: '$$$',
    cuisine: 'Refined Armenian-Lebanese Cuisine',
    address: 'Sassine Hill, Achrafieh, Beirut, Lebanon',
    phone: '+961 1 215 215',
    website: 'https://almayass.com',
    chef: 'Rita Alexandrian',
    description: 'A prestigious fine-dining establishment on Sassine Hill that beautifully bridges legendary Armenian spices with classic Levantine mezze.',
    inspectorNote: 'Almayass serves as an elite landmark on Sassine Hill. Rita Alexandrian elevates family recipes to a stellar standard of technical precision. The pastrma roll wrapped in crisp pastry with light cheese, and their legendary sour cherry kebabs are masterpieces. Excellent wine collection. Decisively 1 Star.',
    signatureDishes: [
      'Pastrma Shish: Grilled beef pastrma skewers wrapped in light local cheese and puff pastry dough',
      'Kabab Karaz Almayass: Tender minced beef meatballs slow-simmered in a dark, thick sour cherry reduction',
      'Subereglik: Soft layered cheese pastry baked with premium native butter and caraway seeds'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Sassine Hill Elevation Views', 'Prestigious Historic Dining Rooms', 'Exceptional Live Kanun Player', 'Pristine White Glove Service'],
    instagram: '@almayass_beirut',
    category: 'fine_dining',
    neighborhood: 'sassine'
  },
  {
    id: 'rest-badaro-2',
    name: 'Kissproof',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.8818, lng: 35.5118, x: 42, y: 68 },
    stars: 0,
    distinction: 'SELECTED',
    priceRange: '$$',
    cuisine: 'Hip Cafe, Bistro & Cocktail Haven',
    address: 'Badaro Main Street, Badaro, Beirut, Lebanon',
    phone: '+961 1 380 900',
    website: 'https://instagram.com/kissproof_beirut',
    chef: 'Joe Chemaly',
    description: 'The trendy, warm heartbeat of Badaro Main Street, functioning as a crisp specialty espresso joint by day and a high-vibe cocktail lounge by night.',
    inspectorNote: 'With a gorgeous industrial slate design, steel light fixtures, and leafy planters, Kissproof embodies Badaro\'s breezy neighborly spirit. Their specialty coffee program is highly meticulous, and the evening bartenders serve fantastic sour cocktails mixed with local pomegranate molasses. The sourdough tartines are phenomenal.',
    signatureDishes: [
      'Smoked Salmon Tartine: Thick house sourdough topped with herbed labneh, premium smoked salmon, and wild capers',
      'Kissproof Whiskey Sour: Signature whiskey blend shaken with custom organic pomegranate reduction and egg-white foam',
      'Truffle-Fries Bowl: Thick hand-cut golden potatoes tossed with truffle butter and parmesan cheese rasping'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Charming Sidewalk Bistro Seating', 'Craft Cocktails & Local Beers', 'Cozy Low-Light Interior', 'Highly Dog-Friendly Garden Patio'],
    instagram: '@kissproofbeirut',
    category: 'vibe',
    neighborhood: 'badaro'
  },
  {
    id: 'rest-sodeco-2',
    name: 'Burgundy',
    city: 'Beirut',
    country: 'Lebanon',
    coordinates: { lat: 33.8920, lng: 35.5080, x: 38, y: 62 },
    stars: 2,
    distinction: 'STAR_2',
    priceRange: '$$$$',
    cuisine: 'Contemporary French Gastronomy',
    address: 'Rue Gouraud, Saifi-Sodeco Border, Beirut, Lebanon',
    phone: '+961 1 999 777',
    website: 'https://burgundybeirut.com',
    chef: 'Youssef Akiki',
    description: 'An ultra-luxurious, state-of-the-art French gastronomic restaurant near Sodeco, featuring unmatched precision, ingredient purity, and an elite wine cellar.',
    inspectorNote: 'Burgundy is the ultimate showcase of contemporary culinary science in Lebanon. Chef Youssef Akiki works with a level of extreme, clinical accuracy that creates absolute art. The dry-aged duck breast in high-mountain honey glaze, and the slow-poached blue lobster with light ginger emulsion are monumental. Decisively 2 Stars of the highest European caliber.',
    signatureDishes: [
      'Dry-Aged Challans Duck: Succulent duck breast seared perfectly skin-on with raw mountain honey, thyme, and parsnip purée',
      'Poached Blue Lobster: Butter-soft lobster tail bathed in a delicate lemongrass-ginger broth',
      'Chocolate Gold Sphere: Warm dark chocolate sauce poured over a golden cocoa shell containing local wild berries'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Elite Sommelier Wine Pairing', 'Sleek Minimalist Slate Design', 'Ultra-Exclusive Seating Capacity', 'Interactive Open Kitchen View'],
    instagram: '@burgundybeirut',
    category: 'fine_dining',
    neighborhood: 'sodeco'
  },
  {
    id: 'rest-antelias-3',
    name: 'Le Phénicien',
    city: 'Antelias',
    country: 'Lebanon',
    coordinates: { lat: 33.9172, lng: 35.5920, x: 50, y: 38 },
    stars: 0,
    distinction: 'SELECTED',
    priceRange: '$$$',
    cuisine: 'Classical Coastal Seafood & Raw Mezze',
    address: 'Seaside Highway, Antelias, Lebanon',
    phone: '+961 4 414 415',
    website: 'https://lephenicien.com',
    chef: 'Antoine Khoury',
    description: 'A luxurious coastal seafood parlor in Antelias, famous for serving pristine raw sea dishes and magnificent charcoal-split tiger prawns.',
    inspectorNote: 'Le Phénicien is a classical standard-bearer of seaside luxury in Antelias. The dining room has elegant white table linen with glass walls facing the waves of Jounieh and Kaslik. Antoine Khoury cooks exceptional whole sea bass encrusted in salt, baked to soft flakiness, and served with a zesty, garlic-tarator puree. Outstanding.',
    signatureDishes: [
      'Salt-Encrusted Sea Bass: Whole rock bass baked inside a heavy thyme-sea-salt crust, cracked open table-side',
      'Tiger Prawns Thermidor: Majestic charcoal prawns baked with fresh cream, gruyere shavings, and mountain wild oregano',
      'Raw Mezze Platter: Cold freshly minced raw mullet nayyeh, red snapper carpaccio with sumac and lime oil'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Direct Panoramic Ocean View', 'Elegant White Table Linen', 'Table-side Salt Fish Carving', 'Extremely Fresh Raw Fish Counter'],
    instagram: '@lephenicien',
    category: 'fine_dining',
    neighborhood: 'antelias'
  }
];

// MASSIVE LIST OF POPULATED RESTAURANTS REQUESTED BY THE USER
const EXTRA_RESTAURANT_NAMES: string[] = [
  "Abdel Wahab",
  "Abou El Nawas",
  "Abou Jihad",
  "Ahwet al Mandaloun",
  "Ahwet Zaytouna",
  "Ai",
  "Aishti Bar",
  "Al Chalouf",
  "Al Falamanki",
  "Al Falamanki 3al Raouche",
  "Al Ferdaws",
  "Al Halabi",
  "Al Jammal",
  "Al Shams",
  "Al Shatt",
  "Al Sultan Brahim",
  "Amar",
  "Amar Café",
  "Amar Seaside",
  "Amaretti",
  "Amarilla Beach",
  "Amarilla Café",
  "Amarilla House",
  "Amethyste",
  "Antika Bar",
  "ANU Batroun",
  "Aria Beirut",
  "Ayla by Ayloul",
  "Ayloul",
  "Babel",
  "Babel Baher",
  "Babel Bay",
  "Backburner",
  "Bar 35",
  "Bar du Port",
  "Bar Tartine",
  "Barbar",
  "Baron",
  "Batchig",
  "Bavaligno",
  "BBQ Bros",
  "Be Babel",
  "Bedo",
  "Bee My Cup",
  "Beit Nazha",
  "Biomass the Farm",
  "Bobo Fou",
  "Bodo",
  "Bonavida",
  "Booza",
  "Boubouffe",
  "Bread Republic",
  "Brgr Co.",
  "Brut",
  "Buco",
  "Burger King",
  "Burgundy",
  "Burj Al Hamam",
  "Butlers Table",
  "Caprice",
  "Casino Arabi",
  "Casino Mhanna",
  "Casino Mhanna Sur Mer",
  "Casper & Gambini's",
  "Caspresso",
  "Catrinas",
  "Central Station",
  "Cezanne",
  "Cheese on Top",
  "Cherry Lane",
  "Chez Fouad",
  "Chez Michel",
  "Chili's",
  "Chopsticks",
  "Clap",
  "Club House - Pistachio",
  "Cocteau",
  "Coin Perdu",
  "Cold Stone Creamery",
  "Couqley",
  "Crepaway",
  "Cyrano",
  "Dar El Gemmayzeh",
  "Darling Society",
  "Das Kuche",
  "Deek Duke",
  "Deli co",
  "Denyeh Hek",
  "Divvy",
  "Diwan Beirut",
  "Domino's Pizza",
  "Douaihy Sweets",
  "Dunkin",
  "Duo",
  "East Village",
  "El Estez Snack Station",
  "Em Sherif",
  "Em Sherif Café",
  "Escobar",
  "Feniqia",
  "Ferdinand",
  "Fine Bouche",
  "Flirt",
  "Fred",
  "Gavi",
  "Ginger & co",
  "Grecco",
  "Green Junkie",
  "Hajj Ali",
  "Hayat Doner Al Turki",
  "Hole in The Wall",
  "House of Butlers",
  "Husk Beirut",
  "Import Export",
  "Iris",
  "Jaï",
  "Jalset El Irzal",
  "Kababji",
  "Kahwet Azmi",
  "Kahwet Ras Beirut",
  "Kampaï",
  "Kasr el Helou Abdel Rahman Hallab 1881",
  "Kasr Fakhreddine",
  "KB Doner",
  "Kebbet Zamen",
  "KFC",
  "Kitchi",
  "KP Japanese Brasserie",
  "Kun",
  "La Centrale",
  "La Crêperie",
  "La Martingale Terrace",
  "La Mezcaleria",
  "La Plaka",
  "La Scene",
  "Lakkis Farm",
  "Layali al-Shams",
  "Laylak",
  "Le Canoe",
  "Le Montagnou",
  "Le Petit Gris",
  "Le Phenicien",
  "Le Sushi Bar",
  "Leila",
  "Leo La Terrasse",
  "Lily's",
  "Liza",
  "Lock Stock",
  "Lola",
  "Loris",
  "Loris Gourmet",
  "Loubnane Ramy Ayach",
  "Malak al Tawouk",
  "Manara Palace Café",
  "Mandaloun Café",
  "Mandaloun Waterfront",
  "Mandouline",
  "Manuella",
  "Margherita Mare",
  "Marinella",
  "Mario e Mario",
  "Maryool",
  "Mayrig",
  "Mc Donald's",
  "Meat the Fish",
  "Mediterraneo",
  "Mezyane",
  "Mhanna",
  "Mitsu-Ya",
  "Mon Maki a Moi",
  "Monday's Off",
  "Mosaic",
  "Mounir",
  "Music Hall",
  "Nabeh al Bohsasa",
  "Naboulsi Resto - Café",
  "Nama by the Beach",
  "Nasma",
  "Nayla",
  "Ni Italian Japanese Caffe",
  "Nippon Sushi & Grill",
  "Osaka Sushi Lounge",
  "Pacifico",
  "Paloma",
  "Paname",
  "Pate a Choux",
  "Paul",
  "Peninsula",
  "People",
  "Per Tutti",
  "Persian Cup",
  "Pizza Hut",
  "Pizza Nini",
  "Prune",
  "Pzza Co",
  "Ritage by Maroun Chedid",
  "Roadster Diner",
  "Sai Sushi",
  "Salata",
  "Salt Fish",
  "Sayf",
  "Seray",
  "Shater Hassan Palace",
  "Shogun",
  "Sip Café",
  "Skirt",
  "Sky Bar",
  "Slate",
  "Smoking Bun",
  "Smushkies",
  "Souksixteen",
  "Spine",
  "Sporting Club",
  "Standard Café & Bar",
  "Starbucks",
  "Stove",
  "SUD Resto Bar",
  "Sushi Star",
  "Swiss Butter",
  "Tamashii",
  "Tavolina",
  "Tawlet",
  "The Barn Beirut",
  "The Blue House Tea",
  "The Blue Note Café",
  "The Bros",
  "The Cask & Barrel",
  "The Malt Gallery",
  "The SLD Bar",
  "The Terrible Prince",
  "The Townhouse",
  "Tom & Mutz",
  "Tsunami",
  "Union Marks",
  "Vesper Coktail Bar",
  "Wooden Bakery",
  "Yakiniku Japanese Grill",
  "Yamas",
  "Zaatar w Zeit",
  "Zur Bar & Bistro"
];

const existingNames = new Set(RESTAURANTS.map(r => r.name.toLowerCase()));

const IMAGES = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800', // mezze
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800', // pizza
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800', // meat
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800', // bistro
  'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=800', // elegant
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800', // skewers
  'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800', // seafood
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800', // drinks
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=800'  // coffee
];

EXTRA_RESTAURANT_NAMES.forEach((name, index) => {
  const normName = name.toLowerCase();
  
  if (existingNames.has(normName)) {
    return;
  }
  
  if (normName === 'em sherif' || normName === 'liza' || normName === 'baron' || normName === 'mayrig' || normName === 'ferdinand' || normName === 't-marbouta' || normName === 'appetito trattoria' || normName === 'almayass' || normName === 'kissproof' || normName === 'burgundy' || normName === 'le phénicien' || normName === 'leila' || normName === 'al sultan brahim') {
    return;
  }

  // Determine city
  let city = 'Beirut';
  if (normName.includes('batroun') || normName.includes('bonavida') || normName.includes('jammal') || normName.includes('shatt') || normName.includes('grecco')) {
    city = 'Batroun';
  } else if (normName.includes('byblos') || normName.includes('feniqia') || normName.includes('baher') || normName.includes('crêperie') || normName.includes('pepe')) {
    city = 'Byblos';
  } else if (normName.includes('tripoli') || normName.includes('hallab') || normName.includes('azmi')) {
    city = 'Tripoli';
  } else if (normName.includes('antelias') || normName.includes('seray') || normName.includes('phénicien') || normName.includes('manuella')) {
    city = 'Antelias';
  }

  // Determine distinction and stars
  let stars = 0;
  let distinction: 'STAR_1' | 'STAR_2' | 'STAR_3' | 'BIB_GOURMAND' | 'SELECTED' = 'SELECTED';
  if (index % 11 === 0) {
    stars = 1;
    distinction = 'STAR_1';
  } else if (index % 15 === 0) {
    stars = 2;
    distinction = 'STAR_2';
  } else if (index % 18 === 0) {
    distinction = 'BIB_GOURMAND';
  }

  // Determine cuisine & category
  let cuisine = 'Levantine Fusion Bistro';
  let category: 'fine_dining' | 'pub_cafe' | 'vibe' | 'takeaway_bakery_produce' = 'vibe';
  
  if (normName.includes('sushi') || normName.includes('mitsu') || normName.includes('maki') || normName.includes('grill') || normName.includes('kitchi') || normName.includes('kam') || normName.includes('shogun') || normName.includes('yakiniku')) {
    cuisine = 'Authentic Japanese & Premium Sushi';
    category = 'fine_dining';
  } else if (normName.includes('bar') || normName.includes('club') || normName.includes('cocktail') || normName.includes('sky') || normName.includes('bistro') || normName.includes('pub') || normName.includes('spine') || normName.includes('vesper') || normName.includes('bodo') || normName.includes('central station')) {
    cuisine = 'Cocktails & International Gastro-Bites';
    category = 'vibe';
  } else if (normName.includes('seafood') || normName.includes('fish') || normName.includes('sea') || normName.includes('jammal') || normName.includes('shatt') || normName.includes('grecco') || normName.includes('canoe')) {
    cuisine = 'Mediterranean Seafood & Fresh Catches';
    category = 'fine_dining';
  } else if (normName.includes('bakery') || normName.includes('wood') || normName.includes('zaatar') || normName.includes('furn') || normName.includes('pate') || normName.includes('dunkin') || normName.includes('paul') || normName.includes('sweets') || normName.includes('tartine')) {
    cuisine = 'Artisanal Bakery & Sweet Patisserie';
    category = 'takeaway_bakery_produce';
  } else if (normName.includes('burger') || normName.includes('co.') || normName.includes('brgr') || normName.includes('husk') || normName.includes('bros') || normName.includes('king') || normName.includes('kfc') || normName.includes('mac') || normName.includes('donald')) {
    cuisine = 'Gourmet Charcoal Burgers & Fries';
    category = 'takeaway_bakery_produce';
  } else if (normName.includes('kabab') || normName.includes('halabi') || normName.includes('shams') || normName.includes('sul') || normName.includes('abdel') || normName.includes('mhanna') || normName.includes('diwan') || normName.includes('falamanki') || normName.includes('kahwet') || normName.includes('ahwet') || normName.includes('loris') || normName.includes('tawlet')) {
    cuisine = 'Traditional Lebanese Mezze & Grills';
    category = 'fine_dining';
  }

  // Price range
  let priceRange: '$$$$' | '$$$' | '$$' | '$' = '$$';
  if (category === 'fine_dining') {
    priceRange = index % 2 === 0 ? '$$$$' : '$$$';
  } else if (category === 'takeaway_bakery_produce') {
    priceRange = '$';
  }

  // Determine neighborhood for Beirut
  let neighborhood: 'hamra' | 'mar_mikhael' | 'sassine' | 'sodeco' | 'badaro' | 'antelias' | undefined;
  if (city === 'Beirut') {
    const list: ('hamra' | 'mar_mikhael' | 'sassine' | 'sodeco' | 'badaro')[] = ['hamra', 'mar_mikhael', 'sassine', 'sodeco', 'badaro'];
    neighborhood = list[index % list.length];
  } else if (city === 'Antelias') {
    neighborhood = 'antelias';
  }

  // Generate coordinates (deterministic grid mapping values based on city)
  let lat = 33.8938;
  let lng = 35.5018;
  let x = 45;
  let y = 45;

  if (city === 'Batroun') {
    lat = 34.2530; lng = 35.6630;
    x = 30 + (index * 13) % 45;
    y = 25 + (index * 17) % 50;
  } else if (city === 'Byblos') {
    lat = 34.1230; lng = 35.6510;
    x = 25 + (index * 11) % 50;
    y = 30 + (index * 19) % 45;
  } else if (city === 'Tripoli') {
    lat = 34.4360; lng = 35.8490;
    x = 35 + (index * 14) % 40;
    y = 20 + (index * 21) % 55;
  } else {
    // Beirut or Antelias (by neighborhood)
    if (neighborhood === 'hamra') {
      lat = 33.8960; lng = 35.4820;
      x = 15 + (index * 7) % 20;
      y = 40 + (index * 11) % 25;
    } else if (neighborhood === 'mar_mikhael') {
      lat = 33.8970; lng = 35.5240;
      x = 65 + (index * 9) % 20;
      y = 42 + (index * 13) % 25;
    } else if (neighborhood === 'sassine') {
      lat = 33.8885; lng = 35.5170;
      x = 55 + (index * 8) % 25;
      y = 65 + (index * 12) % 20;
    } else if (neighborhood === 'sodeco') {
      lat = 33.8905; lng = 35.5090;
      x = 42 + (index * 11) % 18;
      y = 52 + (index * 7) % 18;
    } else if (neighborhood === 'badaro') {
      lat = 33.8795; lng = 35.5130;
      x = 45 + (index * 6) % 15;
      y = 75 + (index * 14) % 15;
    } else if (neighborhood === 'antelias') {
      lat = 33.9160; lng = 35.5890;
      x = 40 + (index * 12) % 30;
      y = 35 + (index * 15) % 30;
    }
  }

  const imgUrl = IMAGES[index % IMAGES.length];
  const formattedAddress = `${name}, ${neighborhood ? neighborhood.charAt(0).toUpperCase() + neighborhood.slice(1) + ', ' : ''}${city}, Lebanon`;

  RESTAURANTS.push({
    id: `raw-rest-${index}`,
    name,
    city,
    country: 'Lebanon',
    coordinates: { lat, lng, x, y },
    stars,
    distinction,
    priceRange,
    cuisine,
    address: formattedAddress,
    phone: `+961 ${city === 'Beirut' ? '1' : city === 'Antelias' ? '4' : '6'} ${200 + (index * 3) % 700} ${100 + (index * 7) % 800}`,
    website: `https://${normName.replace(/[^a-z0-9]/g, '')}.com`,
    chef: `Chef ${name.split(' ')[0] || 'Kamal'} ${name.split(' ')[1] || 'Saba'}`,
    description: `A marvelous Lebanese-inspired ${cuisine.toLowerCase()} landmark styled dynamically, nestled in ${city}’s heart. Celebrates seasonal micro-farm ingredients and exceptional culinary consistency.`,
    inspectorNote: `Our clandestine inspections on consecutive occasions confirmed outstanding flavor balance and technical precision. Their signature courses are exceptionally executed, retaining the local charm and culinary integrity.`,
    signatureDishes: [
      `Signature House Plate: Chef's premium selection of local herbs, hand-pulled spices, and freshly baked elements`,
      `Saffron-Infused Delicacy: Tender selections served alongside custom sumac reductions`,
      `Warm Pistachio Osmaliyeh: Layers of crisp vermicelli filled with traditional mastic ashta and regional sweet syrup`
    ],
    imageUrl: imgUrl,
    images: [imgUrl],
    features: ['High-Consistency Culinary Team', 'Farm-to-Table Focus', 'Breezy Air-Conditioned Layout'],
    instagram: `@${normName.replace(/[^a-z0-9]/g, '')}`,
    category,
    neighborhood
  });
});

// Rich map logic to assign neighborhood tags to existing restaurants in memory dynamically before export
const NEIGHBORHOOD_ASSIGNMENTS: Record<string, string> = {
  'rest-1': 'sodeco',
  'rest-12': 'mar_mikhael',
  'rest-21': 'sodeco',
  'rest-22': 'badaro',
  'rest-8': 'hamra',
  'rest-4': 'mar_mikhael',
  'rest-9': 'mar_mikhael',
  'rest-10': 'mar_mikhael',
  'rest-19': 'mar_mikhael',
  'rest-2': 'sassine',
  'rest-5': 'mar_mikhael',
  'rest-6': 'sodeco',
  'rest-14': 'sodeco'
};

RESTAURANTS.forEach(r => {
  if (NEIGHBORHOOD_ASSIGNMENTS[r.id]) {
    r.neighborhood = NEIGHBORHOOD_ASSIGNMENTS[r.id] as any;
  }
});


export const ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'How the Zaytounada Guide Redefined Levantine Cooking Honor',
    subtitle: 'From a simple notebook listing of organic family olive presses to the ultimate seal of gastronomic mastery.',
    category: 'History',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800',
    date: 'May 15, 2026',
    author: 'Jean-Luc Zaytounada',
    content: [
      'At its inception, Zaytounada (named after the ancient, sacred wild olive trees of the Levant) began as a secret journal shared among master olive oil pressers, chefs, and culinary families. Our mission was simple: cataloging pure, magnificent olive oil presses and exceptional family kitchens across historical ports.',
      'Our directory was widely circulated among true culinary purists. Recognizing that "true craftsmanship is defined by integrity and passion," Zaytounada launched its official guide, introducing anonymous inspections and strict tasting protocols.',
      'As the guide grew popular, we hired a team of anonymous culinary inspectors to visit and review eating establishments in Lebanon. In 1926, the guide introduced its famous single star rosettes. By 1931, the hierarchy expanded to include two and three stars, codifying a grading system that has remained unchanged for nearly a century.',
      'Today, Zaytounada Stars (✻) remain the most prestigious honor a chef can receive, symbolising absolute technical accuracy, emotional expression, and culinary consistency.'
    ]
  },
  {
    id: 'art-2',
    title: 'What Actually Happens on a Zaytounada Inspector\'s Lebanese Tour?',
    subtitle: 'Behind the veil of anonymity, secret checklists, and the pressure of a meal in Gemmayze and Byblos.',
    category: 'Behind The Scenes',
    readTime: '8 min read',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    date: 'April 28, 2026',
    author: 'Anonymous Inspector #12',
    content: [
      'Anonymity is our oxygen. We do not write reviews under our own names, we pay for every single meal we eat, and we never carry notebooks into the dining room. To the restaurateurs, we are merely lone, quiet travelers enjoying a dinner in Mar Mikhael.',
      'But what are we looking for? Our evaluations are based on five strict, globally consistent criteria: the quality of the ingredients, the mastery of culinary combinations and flavors, the chef\'s unique culinary personality on the plate, value for money, and consistency across both the whole menu and multiple visits.',
      'Common myths suggest we look for silver service, starch linen, or golden chandeliers. This is false. Service and decor are rated separately using exclusive comfort tags. A Zaytounada star belongs strictly to what is curated on the plate.',
      'It is a beautiful, demanding life. We travel constantly, tasting up to 250 restaurants a year. But when we experience that perfect harmony of flavors, texture, and creativity, the exhaustion fades, replaced by the thrill of discovering another masterpiece.'
    ]
  },
  {
    id: 'art-3',
    title: 'The Rise of Organic Farm-to-Table in Bekaa Valley',
    subtitle: 'How modern Lebanese chefs are returning to ancestral soils, organic wild-herbs, and heritage crops.',
    category: 'Culinary Trends',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
    date: 'March 12, 2026',
    author: 'Yuki Sato',
    content: [
      'In traditional Levantine cooking, connection to the land is sacred. Today, a powerful gastro-movement is sweeping through Lebanon, bringing organic farm-to-table practices from the fertile Bekaa valley straight to city tables.',
      'Modern chefs are partnering with small-scale farmers in Ammiq and Zahle. Dinners are structured to highlight biodynamic vegetables, hand-harvested wild thymes, and heirloom grains like smoked green freekeeh.',
      'This trend represents a broader cultural shift. Today\'s culinary elite are no longer looking to import luxury European caviar. Instead, the focus has shifted inwards to native ecology, soil health, biodynamic materials, and ancestral Levant agricultural preservation.'
    ]
  },
  {
    id: 'art-4',
    title: 'Understanding the Zaytounada Stars (✻): 1, 2, and 3',
    subtitle: 'What do the distinctions actually mean for travelers and gourmands in Lebanon?',
    category: 'Guides',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
    date: 'January 20, 2026',
    author: 'Gourmet Travel Team',
    content: [
      'The Zaytounada Guide uses three distinct star classifications, defined precisely to guide culinary travelers planning unique dining escapes:',
      '★ One Star: "High quality cooking, worth a stop!" The food is prepared to a consistently high standard and shows clear, distinct flavors. Excellent in its category.',
      '★★ Two Stars: "Excellent cooking, worth a detour!" The chef\'s personality and talent are clearly evident in their refined, expertly crafted plates. Exceptional cellars and precision preparation.',
      '★★★ Three Stars: "Exceptional cuisine, worth a special journey!" Our highest award. The cooking is elevated to an art form. Some signature dishes become absolute historic benchmarks. Superlative execution.',
      'Alongside stars sits the Bib Gourmand, indicating "good quality, good value cooking" under a moderate price limit, and the Selected distinction, indicating an inspector-recommended spot of high standard.'
    ]
  }
];
