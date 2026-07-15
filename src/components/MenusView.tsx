import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, MapPin, Sparkles, Utensils, ChefHat, Plus, Trash2, 
  ChevronDown, ChevronUp, Check, Store, Info, Mail, Phone, DollarSign, X, User
} from 'lucide-react';
import { RestaurantMenu, MenuItem } from '../types';

const CUISINE_OPTIONS = [
  'Traditional Lebanese',
  'Armenian Lebanese Fusion',
  'International Bistro & Steaks',
  'Gastro-pub & Late Night',
  'Seafood & Progressive Maritime',
  'Specialty Coffee & Desserts',
  'Levantine Bakery & Street Eats'
];

export default function MenusView() {
  const [menus, setMenus] = useState<RestaurantMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedCuisine, setSelectedCuisine] = useState('All Cuisines');
  const [selectedPrice, setSelectedPrice] = useState('All Budgets');
  
  // Expanded menu card view state
  const [expandedMenuId, setExpandedMenuId] = useState<string | null>(null);

  // Questionnaire state
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [restoName, setRestoName] = useState('');
  const [restoCuisine, setRestoCuisine] = useState('Traditional Lebanese Haute Cuisine');
  const [restoCity, setRestoCity] = useState('Beirut');
  const [restoPrice, setRestoPrice] = useState('$$$');
  
  // Custom menu creation state inside the questionnaire
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { name: 'Traditional Hummus Snobar', price: '$8.50', description: 'Velvety pureed chickpeas with tahini and warm toasted pine seeds', category: 'Appetizer' },
    { name: 'Charcoal Shish Taouk Platter', price: '$15.50', description: 'Skewered marinated chicken cubes, served with traditional garlic paste', category: 'Main Course' },
    { name: 'Premium Knefeh with Blossom Syrup', price: '$6.50', description: 'Sweet melted cheese pastry with orange blossom water drizzle', category: 'Dessert' }
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'Appetizer' | 'Main Course' | 'Dessert' | 'Beverage'>('Appetizer');

  // Status alerts
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/menus');
      const data = await res.json();
      if (Array.isArray(data)) {
        // Only show approved menus to the public
        setMenus(data.filter((m: RestaurantMenu) => m.status === 'approved'));
      }
    } catch (err) {
      console.error('Failed to retrieve menus:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) {
      setErrorMessage('Please provide both a name and a price for the menu item.');
      return;
    }
    const item: MenuItem = {
      name: newItemName,
      price: newItemPrice.startsWith('$') ? newItemPrice : `$${newItemPrice}`,
      description: newItemDesc,
      category: newItemCategory as any
    };
    setMenuItems([...menuItems, item]);
    setNewItemName('');
    setNewItemPrice('');
    setNewItemDesc('');
    setErrorMessage('');
  };

  const handleRemoveCustomItem = (index: number) => {
    setMenuItems(menuItems.filter((_, idx) => idx !== index));
  };

  const handleQuestionnaireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !ownerEmail || !ownerPhone || !restoName) {
      setErrorMessage('Please complete all contact coordinates and restaurant details.');
      return;
    }
    if (menuItems.length === 0) {
      setErrorMessage('Please add at least one menu item to your submission.');
      return;
    }

    // Structure the sections based on categories
    const categories: Record<string, MenuItem[]> = {
      'Appetizers': [],
      'Main Courses': [],
      'Desserts': [],
      'Beverages': []
    };

    menuItems.forEach(item => {
      if (item.category === 'Appetizer') categories['Appetizers'].push(item);
      else if (item.category === 'Main Course') categories['Main Courses'].push(item);
      else if (item.category === 'Dessert') categories['Desserts'].push(item);
      else categories['Beverages'].push(item);
    });

    const sections = Object.entries(categories)
      .filter(([_, items]) => items.length > 0)
      .map(([category, items]) => ({ category, items }));

    const submissionData = {
      restaurantName: restoName,
      cuisine: restoCuisine,
      priceRange: restoPrice,
      city: restoCity,
      sections,
      submittedBy: {
        ownerName,
        email: ownerEmail,
        phone: ownerPhone
      }
    };

    try {
      const response = await fetch('/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });
      if (response.ok) {
        setSubmissionSuccess(true);
        // Reset states
        setOwnerName('');
        setOwnerEmail('');
        setOwnerPhone('');
        setRestoName('');
        setMenuItems([
          { name: 'Traditional Hummus Snobar', price: '$8.50', description: 'Velvety pureed chickpeas with tahini and warm toasted pine seeds', category: 'Appetizer' },
          { name: 'Charcoal Shish Taouk Platter', price: '$15.50', description: 'Skewered marinated chicken cubes, served with traditional garlic paste', category: 'Main Course' }
        ]);
        setTimeout(() => {
          setSubmissionSuccess(false);
          setShowQuestionnaire(false);
        }, 5000);
      } else {
        const err = await response.json();
        setErrorMessage(err.error || 'Failed to submit menu questionnaire.');
      }
    } catch (err) {
      setErrorMessage('A connection error occurred. Please try again.');
    }
  };

  // Extract filters
  const cities = ['All Cities', ...Array.from(new Set(menus.map(m => m.city)))];
  const uniqueCuisines = ['All Cuisines', ...Array.from(new Set(menus.map(m => m.cuisine)))];
  const uniquePrices = ['All Budgets', '$', '$$', '$$$', '$$$$'];

  // Filter listings
  const filteredMenus = menus.filter(menu => {
    const matchesSearch = 
      menu.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menu.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menu.sections.some(sec => 
        sec.items.some(it => 
          it.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          it.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    
    const matchesCity = selectedCity === 'All Cities' || menu.city === selectedCity;
    const matchesCuisine = selectedCuisine === 'All Cuisines' || menu.cuisine === selectedCuisine;
    const matchesPrice = selectedPrice === 'All Budgets' || menu.priceRange === selectedPrice;

    return matchesSearch && matchesCity && matchesCuisine && matchesPrice;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-left">
      {/* Header Deck */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-emerald-100 pb-6 mb-8">
        <div>
          <h2 className="font-serif font-light text-3xl text-neutral-900 flex items-center gap-2.5 uppercase tracking-wider">
            <BookOpen className="w-8 h-8 text-emerald-800" />
            <span>Menus Curation Directory</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1.5 normal-case tracking-normal font-light">
            Browse verified menus from Lebanon's premier dining outposts, bistros, and coastal grilles, curated sequentially.
          </p>
        </div>
        
        {/* Trigger Questionnaire */}
        <button
          onClick={() => setShowQuestionnaire(!showQuestionnaire)}
          className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer self-stretch md:self-auto justify-center"
          id="toggle-owner-questionnaire-btn"
        >
          <Store className="w-4 h-4 text-amber-300" />
          <span>Resto Owner? Submit Your Menu</span>
        </button>
      </div>

      {/* QUESTIONNAIRE FORM BLOCK */}
      {showQuestionnaire && (
        <div className="bg-neutral-50 border border-emerald-100 rounded-2xl p-6 mb-8 relative animate-fade-in shadow-xs" id="owner-submission-form-container">
          <button 
            onClick={() => setShowQuestionnaire(false)}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 bg-white hover:bg-neutral-100 rounded-full transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="max-w-3xl">
            <span className="text-[10px] font-mono text-amber-600 font-bold uppercase tracking-widest block mb-1">PARTNER PORTAL</span>
            <h3 className="font-serif text-xl font-bold text-emerald-950 mb-1 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-emerald-700" />
              <span>Establishment Menu Questionnaire</span>
            </h3>
            <p className="text-xs text-neutral-500 mb-6 font-light">
              Submit your menu layout to be vetted by the Zaytounada Admin panel. Once approved, your menu will instantly appear uniform inside our listings catalog for our gourmet audience.
            </p>

            {submissionSuccess ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 text-left mb-4 flex items-start gap-3 animate-fade-in">
                <Check className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">Submission Vetting Initiated Successfully!</h4>
                  <p className="text-xs text-emerald-800 leading-relaxed mt-1">
                    Your menu card has been safely logged in the Admin Lockbox. Our local culinary editors will review your details, sync it with our coordinates, and publish it on the menus board.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleQuestionnaireSubmit} className="space-y-6">
                
                {/* Section 1: Contact Coordinates */}
                <div className="space-y-3.5 border-b border-neutral-200 pb-5">
                  <h4 className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider">Step 1: Ownership & Contact Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-600 mb-1.5">Owner / Manager Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                          type="text"
                          required
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          placeholder="e.g., Tony Karam"
                          className="pl-9 pr-3 py-2 w-full text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-600 mb-1.5">Contact Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                          type="email"
                          required
                          value={ownerEmail}
                          onChange={(e) => setOwnerEmail(e.target.value)}
                          placeholder="tony@establishment.com"
                          className="pl-9 pr-3 py-2 w-full text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-600 mb-1.5">Contact Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                          type="text"
                          required
                          value={ownerPhone}
                          onChange={(e) => setOwnerPhone(e.target.value)}
                          placeholder="+961 3 123 456"
                          className="pl-9 pr-3 py-2 w-full text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Restaurant Properties */}
                <div className="space-y-3.5 border-b border-neutral-200 pb-5">
                  <h4 className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider">Step 2: Restaurant Identity Card</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-600 mb-1.5">Restaurant / Pub Name</label>
                      <input
                        type="text"
                        required
                        value={restoName}
                        onChange={(e) => setRestoName(e.target.value)}
                        placeholder="e.g., Al-Mina Gardens"
                        className="px-3.5 py-2 w-full text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-600 mb-1.5">City Location</label>
                      <select
                        value={restoCity}
                        onChange={(e) => setRestoCity(e.target.value)}
                        className="px-3 py-2 w-full text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        {['Beirut', 'Byblos', 'Batroun', 'Zahle', 'Tripoli', 'Sidon', 'Tyre', 'Ehden', 'Broumana', 'Faraya', 'Jounieh'].map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-600 mb-1.5">Average Budget Tier</label>
                      <select
                        value={restoPrice}
                        onChange={(e) => setRestoPrice(e.target.value)}
                        className="px-3 py-2 w-full text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        <option value="$">$ (Inexpensive Kaak / Bakeries)</option>
                        <option value="$$">$$ (Moderate Gastropubs & Diners)</option>
                        <option value="$$$">$$$ (Fine Casual & Seafood)</option>
                        <option value="$$$$">$$$$ (Supreme High Luxury)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-neutral-600 mb-1.5">Restaurant Genre & Cuisine</label>
                    <select
                      value={restoCuisine}
                      onChange={(e) => setRestoCuisine(e.target.value)}
                      className="px-3 py-2 w-full text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-emerald-600 cursor-pointer"
                    >
                      {CUISINE_OPTIONS.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Section 3: Add Menu Items */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider">Step 3: Construct Your Menu Items</h4>
                  
                  {/* Current Items Table List */}
                  {menuItems.length > 0 ? (
                    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-neutral-50 border-b border-neutral-200 font-mono text-[9px] font-bold uppercase text-neutral-500">
                            <th className="p-3">Category</th>
                            <th className="p-3">Item Name</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Description</th>
                            <th className="p-3 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-150">
                          {menuItems.map((item, idx) => (
                            <tr key={idx} className="hover:bg-neutral-50/50">
                              <td className="p-3 font-mono text-[9px] font-bold"><span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-100">{item.category}</span></td>
                              <td className="p-3 font-semibold text-neutral-900">{item.name}</td>
                              <td className="p-3 font-mono font-bold text-emerald-700">{item.price}</td>
                              <td className="p-3 text-neutral-500 max-w-xs truncate">{item.description || '—'}</td>
                              <td className="p-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCustomItem(idx)}
                                  className="text-red-500 hover:text-red-700 p-1.5 bg-neutral-50 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs italic text-neutral-400 py-3 text-center">No menu items added yet. Build your sections below.</p>
                  )}

                  {/* Add Item form module */}
                  <div className="bg-white border border-neutral-200 rounded-xl p-4 space-y-3 shadow-2xs">
                    <span className="text-[9px] font-mono text-emerald-700 font-bold uppercase tracking-wider block">Add An Item:</span>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[8px] font-mono text-neutral-500 uppercase mb-1">Item Category</label>
                        <select
                          value={newItemCategory}
                          onChange={(e) => setNewItemCategory(e.target.value as any)}
                          className="px-2.5 py-1.5 w-full text-xs bg-neutral-50 border border-neutral-200 rounded focus:outline-none"
                        >
                          <option value="Appetizer">Appetizer</option>
                          <option value="Main Course">Main Course</option>
                          <option value="Dessert">Dessert</option>
                          <option value="Beverage">Beverage</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[8px] font-mono text-neutral-500 uppercase mb-1">Dish / Drink Name</label>
                        <input
                          type="text"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          placeholder="e.g., Spicy Grilled Octopus"
                          className="px-2.5 py-1.5 w-full text-xs bg-neutral-50 border border-neutral-200 rounded focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono text-neutral-500 uppercase mb-1">Price (e.g. $14.00)</label>
                        <input
                          type="text"
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(e.target.value)}
                          placeholder="$14.00"
                          className="px-2.5 py-1.5 w-full text-xs bg-neutral-50 border border-neutral-200 rounded focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[8px] font-mono text-neutral-500 uppercase mb-1">Dish Description (Ingredients / Flavors)</label>
                      <input
                        type="text"
                        value={newItemDesc}
                        onChange={(e) => setNewItemDesc(e.target.value)}
                        placeholder="e.g., Charred Atlantic octopus glazed in spicy harissa, crushed garlic, rosemary potatoes"
                        className="px-2.5 py-1.5 w-full text-xs bg-neutral-50 border border-neutral-200 rounded focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddCustomItem}
                      className="px-4 py-2 bg-neutral-900 text-white font-mono text-[9px] font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-850 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Item To Submission List</span>
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="text-red-650 text-xs font-mono bg-red-50 border border-red-200 p-3 rounded-lg flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-4 flex justify-end gap-3 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setShowQuestionnaire(false)}
                    className="px-4 py-2.5 border border-neutral-300 text-neutral-700 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-150 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
                    id="submit-questionnaire-btn"
                  >
                    Submit Questionnaire
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FILTER PANEL */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-4.5 mb-8 shadow-3xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          
          {/* Text Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-800 w-4 h-4" />
            <input
              type="text"
              placeholder="Search dishes, ingredients, or restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600"
              id="menu-search-bar"
            />
          </div>

          {/* City Filter */}
          <div className="w-full lg:w-48">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3.5 py-2.5 w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="All Cities">All Cities</option>
              {cities.filter(c => c !== 'All Cities').map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Cuisine Filter */}
          <div className="w-full lg:w-56">
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="px-3.5 py-2.5 w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="All Cuisines">All Cuisines</option>
              {uniqueCuisines.filter(c => c !== 'All Cuisines').map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="w-full lg:w-40">
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="px-3.5 py-2.5 w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="All Budgets">All Budgets</option>
              <option value="$">$ (Under $10)</option>
              <option value="$$">$$ ($10–$20)</option>
              <option value="$$$">$$$ ($20–$40)</option>
              <option value="$$$$">$$$$ ($40+ Premium)</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(searchQuery || selectedCity !== 'All Cities' || selectedCuisine !== 'All Cuisines' || selectedPrice !== 'All Budgets') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('All Cities');
                setSelectedCuisine('All Cuisines');
                setSelectedPrice('All Budgets');
              }}
              className="text-[10px] text-emerald-800 hover:text-emerald-700 font-bold uppercase tracking-wider shrink-0 text-center lg:text-left cursor-pointer"
            >
              Reset Filters
            </button>
          )}

        </div>
      </div>

      {/* CURATED DIRECTORY LISTS */}
      {loading ? (
        <div className="text-center py-20 flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-700 border-t-transparent animate-spin"></div>
          <p className="text-xs font-mono text-neutral-400">LOADING CURATED MENU SHEETS...</p>
        </div>
      ) : filteredMenus.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 border border-neutral-200 rounded-2xl p-8 flex flex-col items-center justify-center">
          <Utensils className="w-12 h-12 text-neutral-300 mb-3" />
          <h4 className="font-serif italic text-lg text-neutral-800">No Matching Curated Menus Found</h4>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm leading-relaxed">
            No restaurant menus matched your filters or search keywords. Try clearing search query parameters.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest font-bold">
            Showing {filteredMenus.length} Vetted Restaurant Menus
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="menus-grid-deck">
            {filteredMenus.map((menu) => {
              const isExpanded = expandedMenuId === menu.id;
              
              // Get first 2 items of the menu to serve as a uniform card "sneak peek"
              const previewItems: MenuItem[] = [];
              menu.sections.forEach(sec => {
                sec.items.forEach(it => {
                  if (previewItems.length < 3) previewItems.push(it);
                });
              });

              return (
                <div 
                  key={menu.id}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-emerald-600/20 ${
                    isExpanded ? 'ring-1 ring-emerald-700/30' : ''
                  }`}
                  id={`menu-card-${menu.id}`}
                >
                  <div className="p-5 text-left flex-1 flex flex-col justify-between">
                    <div>
                      {/* Genre Tag and Price */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider">
                          {menu.city}
                        </span>
                        <div className="flex items-center gap-1 text-emerald-800 font-mono text-[10px] font-black tracking-widest bg-emerald-50/50 border border-emerald-100/50 px-1.5 py-0.5 rounded">
                          {menu.priceRange}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif font-bold text-base text-neutral-900 tracking-tight leading-tight mb-1">
                        {menu.restaurantName}
                      </h3>
                      <p className="text-[10px] font-mono text-amber-600 font-bold uppercase tracking-wider mb-4 leading-none">
                        {menu.cuisine}
                      </p>

                      {/* Uniform Sneak Peek of Top Dishes */}
                      <div className="space-y-2 border-t border-dotted border-neutral-150 pt-3">
                        <span className="text-[8px] font-mono text-neutral-400 uppercase font-extrabold tracking-wider block mb-1">Menu Highlights</span>
                        {previewItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start text-xs gap-3">
                            <div className="flex-1">
                              <span className="font-bold text-neutral-850 block">{item.name}</span>
                              <span className="text-[9.5px] text-neutral-400 line-clamp-1 italic">{item.description}</span>
                            </div>
                            <span className="font-mono text-[10px] font-extrabold text-emerald-700 bg-neutral-50 px-1.5 py-0.5 rounded border border-neutral-100">{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => setExpandedMenuId(isExpanded ? null : menu.id)}
                      className="mt-5 w-full py-2 bg-neutral-50 hover:bg-emerald-700 hover:text-white transition-all rounded-xl border border-neutral-200 text-neutral-700 text-[10px] font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer"
                      id={`expand-menu-trigger-${menu.id}`}
                    >
                      <Utensils className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'Hide Full Menu Card' : 'Inspect Full Menu'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Complete Full Menu categories (expanded inside card or beautiful drop deck) */}
                  {isExpanded && (
                    <div className="bg-neutral-50/50 border-t border-neutral-200 p-5 space-y-5 animate-fade-in text-left">
                      <div className="flex items-center gap-1.5 border-b border-neutral-200 pb-2">
                        <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <h4 className="font-serif text-xs font-black uppercase text-emerald-950 tracking-wider">The Complete Gastronomic Record</h4>
                      </div>
                      
                      {menu.sections.map((section, sIdx) => (
                        <div key={sIdx} className="space-y-3">
                          <h5 className="font-mono text-[9px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded w-fit border border-emerald-100/50 shadow-3xs">
                            {section.category}
                          </h5>
                          <div className="space-y-3">
                            {section.items.map((item, iIdx) => (
                              <div key={iIdx} className="group flex justify-between items-start text-xs border-b border-dotted border-neutral-200 pb-2 last:border-none last:pb-0 gap-4">
                                <div className="space-y-0.5">
                                  <span className="font-semibold text-neutral-900 group-hover:text-emerald-800 transition-colors block">{item.name}</span>
                                  {item.description && (
                                    <p className="text-[10px] text-neutral-500 leading-normal font-light">{item.description}</p>
                                  )}
                                </div>
                                <span className="font-mono text-xs font-bold text-emerald-850 bg-white border border-neutral-200 px-2 py-0.5 rounded shadow-3xs shrink-0 select-none">
                                  {item.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      <div className="border-t border-neutral-200 pt-3 text-[9px] text-neutral-400 font-mono uppercase tracking-wider flex items-center gap-1 justify-center">
                        <Check className="w-3 h-3 text-emerald-600 font-bold" />
                        <span>Verified by Zaytounada Inspectors</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
