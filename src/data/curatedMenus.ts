import { RestaurantMenu, MenuItem } from '../types';

// Handcrafted menus for the premier featured spots
const eliteMenus: RestaurantMenu[] = [
  {
    id: 'menu-1',
    restaurantId: 'rest-1',
    restaurantName: 'Em Sherif',
    cuisine: 'Traditional Lebanese Haute Cuisine',
    priceRange: '$$$$',
    city: 'Beirut',
    status: 'approved',
    createdAt: '2026-06-01T12:00:00Z',
    sections: [
      {
        category: 'Appetizers',
        items: [
          { name: 'Hummus Snobar', price: '$12.00', description: 'Velvet-textured chickpea purée with warm toasted Lebanese pine seeds and organic olive oil.', category: 'Appetizer' },
          { name: 'Fattoush with Pomegranate', price: '$10.00', description: 'Crispy flatbread shards, fresh purslane, sumac, and rich molasses pomegranate dressing.', category: 'Appetizer' },
          { name: 'Kibbeh Nayyeh', price: '$18.00', description: 'Traditional fine paste of raw lamb blended with fine bulgur, sweet mint, and Lebanese spices.', category: 'Appetizer' },
          { name: 'Sambousek Lahme', price: '$9.00', description: 'Crispy puff pastry pockets stuffed with spiced minced pine nuts and minced beef.', category: 'Appetizer' }
        ]
      },
      {
        category: 'Main Courses',
        items: [
          { name: 'Kabab Karaz', price: '$26.00', description: 'Tender charcoal lamb skewers glazed in a sweet-and-sour wild mountain cherry reduction.', category: 'Main Course' },
          { name: 'Em Sherif Mixed Grill', price: '$32.00', description: 'Masterful skewers of beef fillet, shish taouk, and spicy kafta grilled on high-intensity charcoal.', category: 'Main Course' },
          { name: 'Shish Barak', price: '$24.00', description: 'Homemade meat-stuffed dumplings poached in a warm garlic, mint, and yogurt broth.', category: 'Main Course' }
        ]
      },
      {
        category: 'Desserts',
        items: [
          { name: 'Mafroukeh', price: '$11.00', description: 'Rich roasted semolina and pistachio dough layered with fresh clotted ashta cream and orange blossom syrup.', category: 'Dessert' },
          { name: 'Knefeh Nabulsieh', price: '$12.00', description: 'Warm akawi cheese pastry topped with crisp semolina and drizzled with warm sugar syrup.', category: 'Dessert' }
        ]
      },
      {
        category: 'Beverages',
        items: [
          { name: 'House Arak Ksara', price: '$9.00', description: 'Traditional triple-distilled Lebanese aniseed liqueur served with pure mountain ice.', category: 'Beverage' },
          { name: 'Mountain Mint Lemonade', price: '$6.50', description: 'Fresh squeezed local lemons blended with hand-picked organic spearmint and crushed ice.', category: 'Beverage' }
        ]
      }
    ]
  },
  {
    id: 'menu-2',
    restaurantId: 'rest-2',
    restaurantName: 'Liza',
    cuisine: 'Polished Contemporary Lebanese',
    priceRange: '$$$$',
    city: 'Beirut',
    status: 'approved',
    createdAt: '2026-06-02T10:00:00Z',
    sections: [
      {
        category: 'Appetizers',
        items: [
          { name: 'Tabbouleh Liza', price: '$9.50', description: 'Superfine hand-cut parsley, diced organic tomatoes, spring onions, olive oil, and premium citrus lemon squeeze.', category: 'Appetizer' },
          { name: 'Moutabbal al-Dhahab', price: '$11.00', description: 'Wood-smoked eggplant dip infused with raw tahini, roasted sesame seeds, and raw walnut oil.', category: 'Appetizer' },
          { name: 'Batata Harra', price: '$8.00', description: 'Spiced crispy local potato cubes tossed in green coriander, crushed garlic, and sweet chili.', category: 'Appetizer' }
        ]
      },
      {
        category: 'Main Courses',
        items: [
          { name: 'Siyadiyeh Red Snapper', price: '$29.00', description: 'Flaky red snapper served over brown pine-and-cumin fragrant rice with sweet caramelized onions.', category: 'Main Course' },
          { name: 'Kharouf 12-Hour Lamb', price: '$31.00', description: 'Slow-braised lamb shank accompanied by sweet organic dried figs, apricots, and saffron rice.', category: 'Main Course' }
        ]
      },
      {
        category: 'Desserts',
        items: [
          { name: 'Ghazl el Banat with Ashta', price: '$10.50', description: 'Traditional Levantine spun cotton candy over rich milk-and-rose clotted cream.', category: 'Dessert' },
          { name: 'Mouhalabieh', price: '$8.50', description: 'Traditional cold milk pudding scented with mastic and orange blossom water, topped with crushed green pistachios.', category: 'Dessert' }
        ]
      }
    ]
  },
  {
    id: 'menu-3',
    restaurantId: 'rest-3',
    restaurantName: 'Babel Bahr',
    cuisine: 'Lebanese Seafood & Coastal Grill',
    priceRange: '$$$',
    city: 'Byblos',
    status: 'approved',
    createdAt: '2026-06-03T15:30:00Z',
    sections: [
      {
        category: 'Appetizers',
        items: [
          { name: 'Hummus Babel Beiruty', price: '$10.00', description: 'Velvety smooth hummus topped with warm local pine nuts and chopped spicy red chillies.', category: 'Appetizer' },
          { name: 'Warak Enab Bil Zeit', price: '$9.00', description: 'Stuffed grape leaves rolled with spiced Egyptian rice, wild tomatoes, spring onions, and olive oil.', category: 'Appetizer' },
          { name: 'Kraydes Provence', price: '$16.50', description: 'Sautéed Mediterranean wild prawns swimming in a rich emulsion of garlic, lemon juice, coriander, and olive oil.', category: 'Appetizer' }
        ]
      },
      {
        category: 'Main Courses',
        items: [
          { name: 'Sultan Ibrahim Red Mullet', price: '$28.00', description: 'Crispy deep-fried native red mullet seasoned with crushed wild sea salt, sumac, and lemon wedges.', category: 'Main Course' },
          { name: 'Grilled Sea Bass', price: '$34.00', description: 'Whole sea bass grilled on open cherrywood flames, dressed in a traditional hot spicy tahini sauce.', category: 'Main Course' }
        ]
      },
      {
        category: 'Desserts',
        items: [
          { name: 'Ghazl el Banat Babel', price: '$11.00', description: 'Warm mastic ice cream enclosed in fine spun cotton sugar and drizzled with mountain honey.', category: 'Dessert' }
        ]
      }
    ]
  },
  {
    id: 'menu-4',
    restaurantId: 'rest-4',
    restaurantName: 'Baron',
    cuisine: 'Polished Contemporary Lebanese',
    priceRange: '$$$',
    city: 'Beirut',
    status: 'approved',
    createdAt: '2026-06-04T11:00:00Z',
    sections: [
      {
        category: 'Appetizers',
        items: [
          { name: 'Wood-Fired Romanesco', price: '$12.50', description: 'Charred romanesco florets served over rich garlic-tahini whip with black sea salt and lemon oil.', category: 'Appetizer' },
          { name: 'Slow-Cooked Beetroot Tartare', price: '$11.00', description: 'Saffron-infused roasted beetroot cubes with goat labneh, wild sorrel, and pistachio dust.', category: 'Appetizer' }
        ]
      },
      {
        category: 'Main Courses',
        items: [
          { name: 'Wood-Oven Lamb Breast', price: '$28.00', description: 'Spiced lamb breast slow-roasted on olive wood, served with smoked freekeeh and fermented cucumber ribbons.', category: 'Main Course' },
          { name: 'Atlantic Octopus', price: '$30.00', description: 'Charred octopus tentacles with spicy harissa oil, wild rosemary potatoes, and preserved citrus aioli.', category: 'Main Course' }
        ]
      }
    ]
  }
];

// Helper dictionaries for generating authentic Lebanese restaurants up to 100
const cityList = [
  'Beirut', 'Byblos', 'Batroun', 'Zahle', 'Tripoli', 'Sidon', 'Tyre', 'Ehden', 
  'Broumana', 'Faraya', 'Jounieh', 'Baalbek', 'Deir el Qamar', 'Zgharta', 'Anjar'
];

const cuisines = [
  'Traditional Lebanese Haute Cuisine', 'Lebanese Seafood & Coastal Grill', 
  'Polished Contemporary Lebanese', 'Armenian-Lebanese Homestyle', 
  'Lebanese Mountain Farm-to-Table', 'Classic Mezze & Gastro-Pub', 
  'Traditional Sourdough Manousheh & Bakeries', 'Levant Sweets & Confectionery'
];

const priceRanges = ['$', '$$', '$$$', '$$$$'];

const owners = [
  { ownerName: 'Tony Khoury', email: 'tony@lebanonresto.com', phone: '+961 3 123 456' },
  { ownerName: 'Yasmine Saab', email: 'yasmine@saabgourmet.com', phone: '+961 70 987 654' },
  { ownerName: 'Maroun Haddad', email: 'maroun@haddadbistro.com', phone: '+961 3 456 789' },
  { ownerName: 'Zeina Gemayel', email: 'zeina@gemayelvines.com', phone: '+961 71 222 333' },
  { ownerName: 'Rami Al Hallab', email: 'rami@hallablegacy.com', phone: '+961 6 444 555' }
];

// Base pools of authentic items to dynamically construct high-quality menus
const appetizerPool: Omit<MenuItem, 'category'>[] = [
  { name: 'Hummus Snobar', price: '$6.50', description: 'Creamy chickpea puree with raw tahini, finished with warm toasted pine nuts and virgin olive oil.' },
  { name: 'Classic Tabbouleh', price: '$5.50', description: 'Finely hand-shaved flat leaf parsley, mint, fresh tomatoes, bulgur, and lemon-olive oil dressing.' },
  { name: 'Smoked Moutabbal', price: '$6.00', description: 'Chargrilled eggplants whipped with rich sesame tahini, fresh lemon juice, and red pomegranate.' },
  { name: 'Batata Harra', price: '$5.00', description: 'Triple-cooked crispy potato cubes tossed in garlic oil, dry coriander, and hot red pepper flakes.' },
  { name: 'Cheese Sambousek', price: '$5.00', description: 'Fried flaky crescent pastry filled with a blend of local Akkawi and Halloumi cheeses.' },
  { name: 'Meat Kebbeh', price: '$7.50', description: 'Fried bulgur shells stuffed with minced lamb, sweet spices, pine nuts, and caramelized onions.' },
  { name: 'Stuffed Grape Leaves', price: '$6.50', description: 'Tender grape leaves stuffed with spiced Egyptian rice, wild tomatoes, and extra virgin olive oil.' },
  { name: 'Saj Kaak with Picon', price: '$4.50', description: 'Traditional Lebanese kaak bread toasted over hot coals with melted Picon cheese.' },
  { name: 'Hummus Beiruty', price: '$6.00', description: 'Creamy hummus blended with fresh garlic, chopped tomatoes, cumin, and fresh green parsley.' },
  { name: 'Labneh with Wild Thyme', price: '$4.50', description: 'Strained local goat milk yogurt drizzled with mountain olive oil and premium organic zaatar.' }
];

const mainCoursePool: Omit<MenuItem, 'category'>[] = [
  { name: 'Shish Taouk Platter', price: '$14.50', description: 'Charcoal-grilled skewers of tender marinated chicken cubes, served with garlic paste and hand-cut fries.' },
  { name: 'Kabab Halabi', price: '$16.00', description: 'Hand-minced spicy lamb skewers grilled on open coals with spicy tomato purée and sumac onions.' },
  { name: 'Lebanese Mixed Grill', price: '$19.50', description: 'The absolute classic: one skewer each of Shish Taouk, Beef Fillet, and Kabab, with grilled vegetables.' },
  { name: 'Sayyadieh Local Catch', price: '$18.00', description: 'Fragrant cumin-scented brown rice topped with flaky white snapper, caramelized onions, and toasted almonds.' },
  { name: 'Kharouf Mahshi', price: '$22.00', description: 'Slow-roasted baby lamb served over a bed of spiced oriental rice with toasted nuts and rich lamb gravy.' },
  { name: 'Kibbeh Labanieh', price: '$15.00', description: 'Handcrafted meat kibbeh balls cooked in a creamy, minty hot goat yogurt sauce, with rice.' },
  { name: 'Kafta Khashkhash', price: '$16.50', description: 'Spiced minced lamb skewers grilled over charcoal, on a bed of warm mashed tomatoes, garlic, and hot chili.' },
  { name: 'Chicken Shawarma Platter', price: '$13.50', description: 'Shaved premium chicken thighs marinated in cardamom and red vinegar, with wild pickles and garlic whip.' },
  { name: 'Baked Sea Bass with Tajen', price: '$24.50', description: 'Tender sea bass fillet baked with a rich, velvety sesame tahini sauce, caramelized onions, and walnuts.' },
  { name: 'Fattet Hummus with Lamb', price: '$12.00', description: 'Warm chickpeas layered with crispy flatbread shards, hot garlic yogurt, roasted pine seeds, and sautéed lamb.' }
];

const dessertPool: Omit<MenuItem, 'category'>[] = [
  { name: 'Ashta Knefeh', price: '$6.50', description: 'Warm shredded semolina cheese pastry soaked in sweet orange-blossom simple syrup, in sesame kaak bread.' },
  { name: 'Mafroukeh al-Malika', price: '$7.00', description: 'Velvet pistachio semolina dough topped with fresh clotted mountain ashta cream and roasted almonds.' },
  { name: 'Mouhalabieh Cold Pudding', price: '$5.00', description: 'Classic Lebanese milk custard infused with real mastic gum, drizzled with rosewater syrup and green pistachios.' },
  { name: 'Warm Katayef with Ashta', price: '$6.00', description: 'Mini pancakes folded around rich clotted cream, dipped in crushed green pistachios and orange syrup.' },
  { name: 'Baklava Selection', price: '$5.50', description: 'Assorted flaky layers of golden-baked phyllo pastry filled with premium pine nuts, walnuts, or cashews.' }
];

const beveragePool: Omit<MenuItem, 'category'>[] = [
  { name: 'Premium Lebanese Arak', price: '$7.00', description: 'A single glass of our triple-distilled, aged aniseed spirit, served with hand-chipped spring ice.' },
  { name: 'Cold Jallab with Pine Seeds', price: '$4.50', description: 'Sweet iced beverage prepared from date and grape molasses, topped with raw almonds and pine seeds.' },
  { name: 'Organic Rose Lemonade', price: '$4.00', description: 'Hand-pressed local lemons infused with sweet mountain-grown red rose petal syrup.' },
  { name: 'Traditional White Coffee', price: '$3.00', description: 'A fragrant warm beverage of hot spring water infused with sweet organic orange blossom water.' },
  { name: 'Wild Mountain Sage Tea', price: '$3.50', description: 'A soothing infusion of dried wild mountain sage, mint leaves, and raw Lebanese oak honey.' }
];

// Programmatic Generator to reach 100 menus
const generatedMenus: RestaurantMenu[] = [];

// Base set of famous Lebanese restaurant names to use in the generator (to make them look real)
const lebaneseRestaurantNames = [
  'Al Halab', 'Abdel Wahab', 'Karam Al Bahr', 'Falamanki', 'Mhanna sur Mer', 'Barbar', 
  'Tawlet', 'Mayrig', 'Onno', 'Babel', 'Seza', 'Kababji', 'Crepaway', 'Classic Burger Joint',
  'Roadster Diner', 'Massaad', 'Le Chef', 'Al Mayass', 'Batchig', 'Kababji Grill',
  'Al Soussi', 'L\'Avenue du Parc', 'Sultan Ibrahim', 'Mounir', 'Al Sultan Brahim',
  'Chez Sami', 'Pierre & Friends', 'Locanda', 'Al-Tahoon', 'Baytna', 'Al-Sanawbar', 
  'Shater Hasan', 'Saj Al-Reef', 'Broumana Palace', 'Bayt Em Nazih', 'Zawat Beirut', 
  'Kahwet Leila', 'Em Sherif Cafe', 'Tawlet Ammiq', 'Furn Beaino', 'Zaatar w Zeit',
  'Wooden Bakery', 'Hallab 1881', 'Al Douaihy', 'Amal Bohsali', 'Taj Al-Mouj',
  'Sanyour', 'Ahwak', 'Le Telegraphe', 'Lola', 'Mir Amin Palace', 'Boubouffe', 
  'Deek Duke', 'Couqley', 'Meat the Fish', 'Burgundy', 'Cocteau', 'Centrale',
  'Al-Balad', 'Dany\'s', 'Rabbit Hole', 'Ferdinand', 'Pacifico', 'Internazionale',
  'Kayan', 'Bardo', 'The Glocal', 'Blue Note', 'Salon Beyrouth', 'Syk',
  'Gilt', 'Sway', 'Clap', 'Iris', 'Caprice', 'Discotek', 'Spine', 'B018',
  'The Ballroom', 'The Grand Factory', 'O1NE', 'White', 'Music Hall', 'Aoba',
  'Ginger', 'Mandaloun', 'Ahwet El Ez', 'L\'Os', 'Al-Halabi', 'Al-Ajami',
  'La Parrilla', 'Elio\'s', 'L\'Atelier', 'La Crêperie', 'Mayrig Armenian',
  'Saddle', 'Zaytouna Bay Cafe', 'Le Gabriel', 'L\'Auberge', 'Al-Mina Garden'
];

export function get100Menus(): RestaurantMenu[] {
  if (generatedMenus.length > 0) return generatedMenus;

  // 1. Add our elite handcrafted menus first
  generatedMenus.push(...eliteMenus);

  // 2. Programmatically generate remaining up to 100
  let idCounter = eliteMenus.length + 1;

  for (let i = 0; i < 100 - eliteMenus.length; i++) {
    const restaurantName = lebaneseRestaurantNames[i % lebaneseRestaurantNames.length] + ` ${cityList[i % cityList.length]}`;
    const city = cityList[i % cityList.length];
    const cuisine = cuisines[i % cuisines.length];
    const priceRange = priceRanges[i % priceRanges.length];
    const owner = owners[i % owners.length];

    // Build some semi-random dishes from pools to make them uniform but diverse
    const appetizers: MenuItem[] = [];
    const mainCourses: MenuItem[] = [];
    const desserts: MenuItem[] = [];
    const beverages: MenuItem[] = [];

    // Take 3-4 random items per category
    const appIndexes = [(i) % appetizerPool.length, (i + 2) % appetizerPool.length, (i + 5) % appetizerPool.length];
    appIndexes.forEach(idx => {
      const baseItem = appetizerPool[idx];
      // Slightly vary prices based on priceRange to make it highly professional
      let price = parseFloat(baseItem.price.replace('$', ''));
      if (priceRange === '$$$$') price += 4.5;
      if (priceRange === '$$$') price += 2;
      if (priceRange === '$') price = Math.max(2.5, price - 1.5);
      appetizers.push({
        ...baseItem,
        price: `$${price.toFixed(2)}`,
        category: 'Appetizer'
      });
    });

    const mainIndexes = [(i + 1) % mainCoursePool.length, (i + 3) % mainCoursePool.length, (i + 6) % mainCoursePool.length];
    mainIndexes.forEach(idx => {
      const baseItem = mainCoursePool[idx];
      let price = parseFloat(baseItem.price.replace('$', ''));
      if (priceRange === '$$$$') price += 8.5;
      if (priceRange === '$$$') price += 4;
      if (priceRange === '$') price = Math.max(6.0, price - 3.5);
      mainCourses.push({
        ...baseItem,
        price: `$${price.toFixed(2)}`,
        category: 'Main Course'
      });
    });

    const dessertIndexes = [(i + 2) % dessertPool.length, (i + 4) % dessertPool.length];
    dessertIndexes.forEach(idx => {
      const baseItem = dessertPool[idx];
      let price = parseFloat(baseItem.price.replace('$', ''));
      if (priceRange === '$$$$') price += 2.5;
      if (priceRange === '$') price = Math.max(2.0, price - 1.5);
      desserts.push({
        ...baseItem,
        price: `$${price.toFixed(2)}`,
        category: 'Dessert'
      });
    });

    const bevIndexes = [(i + 1) % beveragePool.length, (i + 3) % beveragePool.length];
    bevIndexes.forEach(idx => {
      const baseItem = beveragePool[idx];
      let price = parseFloat(baseItem.price.replace('$', ''));
      if (priceRange === '$$$$') price += 2.0;
      if (priceRange === '$') price = Math.max(1.5, price - 1.0);
      beverages.push({
        ...baseItem,
        price: `$${price.toFixed(2)}`,
        category: 'Beverage'
      });
    });

    // Make the first 90 approved, and the last 10 pending (to demonstrate admin approval flow!)
    const status = (i < 90) ? 'approved' : 'pending';

    const menu: RestaurantMenu = {
      id: `menu-${idCounter++}`,
      restaurantName,
      cuisine,
      priceRange,
      city,
      status,
      createdAt: new Date(Date.now() - (i * 24 * 3600 * 1000)).toISOString(), // staggered dates
      sections: [
        { category: 'Appetizers', items: appetizers },
        { category: 'Main Courses', items: mainCourses },
        { category: 'Desserts', items: desserts },
        { category: 'Beverages', items: beverages }
      ],
      submittedBy: status === 'pending' ? owner : undefined
    };

    generatedMenus.push(menu);
  }

  return generatedMenus;
}
