import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { RESTAURANTS as initialRestaurants, ARTICLES as initialArticles } from "./src/data/restaurants";

// Load environment variables
dotenv.config();

// In-Memory Database stores
let restaurantsList = [...initialRestaurants];
let articlesList = [...initialArticles];

let pagesConfigList: any[] = [
  { id: 'discovery', label: 'Explore Restaurants', icon: 'Compass', active: true, order: 0 },
  { id: 'neighborhoods', label: 'Neighborhoods', icon: 'MapPin', active: true, order: 1 },
  { id: 'catalogue', label: 'Zaytounada Catalogue', icon: 'Grid', active: true, order: 2 },
  { id: 'pubs-cafes', label: 'Pubs & Cafes', icon: 'Coffee', active: true, order: 3 },
  { id: 'vibes', label: 'Lebanese Vibes', icon: 'Flame', active: true, order: 4 },
  { id: 'takeaways-bakeries', label: 'Bakeries & Produce', icon: 'Store', active: true, order: 5 },
  { id: 'curation-explorer', label: 'Curation Guide', icon: 'Compass', active: true, order: 6 },
  { id: 'map', label: 'Gastronomic Map', icon: 'Navigation', active: true, order: 7 },
  { id: 'plan-dining', label: 'Plan My Dining', icon: 'Calendar', active: true, order: 8 },
  { id: 'gift-cards', label: 'Gift Vouchers', icon: 'Gift', active: true, order: 9 },
  { id: 'live-shows', label: 'Live Shows', icon: 'Music', active: true, order: 10 },
  { id: 'magazine', label: 'Editorial Magazine', icon: 'BookOpen', active: true, order: 11 },
  { id: 'my-guide', label: 'Itineraries', icon: 'Sparkles', active: true, order: 12 },
  { id: 'admin', label: 'Admin Lockbox', icon: 'Lock', active: true, order: 13, cannotDisable: true },
  { id: 'get-started', label: 'Get Started', icon: 'Info', active: true, order: 14 }
];

let siteSettings = {
  heroTagline: "The Elite Authority Vetting Lebanese Terroir & Gastronomy",
  heroSubtitle: "Anonymous inspections, prestigious stars, and legendary feasts curated for true epicureans.",
  neighborhoodsTitle: "Select Gourmet Neighborhoods",
  neighborhoodsSubtitle: "Cultural Quarters Directory",
  featuredChoiceId: "rest-1"
};

let bookingsList: any[] = [
  {
    id: "book-1",
    restaurantId: "rest-1",
    restaurantName: "Em Sherif",
    userName: "Maan Barazy",
    userEmail: "maanbarazy@gmail.com",
    guestsCount: 4,
    date: "2026-06-12",
    time: "20:30",
    specialRequests: "Anniversary table overlooking the fountain. Strict tree nut allergy.",
    status: "confirmed"
  },
  {
    id: "book-2",
    restaurantId: "rest-12",
    restaurantName: "Baron",
    userName: "Nicole Sfeir",
    userEmail: "nicole@domain.com",
    guestsCount: 2,
    date: "2026-06-18",
    time: "21:00",
    specialRequests: "Wants premium Chef's counter visual seating.",
    status: "pending"
  }
];

let subscribersList: any[] = [
  { id: "sub-1", email: "maanbarazy@gmail.com", date: "2026-06-03T05:00:00Z" },
  { id: "sub-2", email: "gourmet@lavigneprime.com", date: "2026-06-03T05:08:00Z" }
];

let emailLogs: any[] = [];

let aiClient: GoogleGenAI | null = null;

// Lazy initialization of the Gemini SDK Client
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required but missing. Configure it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Redirect any direct /admin browser page accesses to serverless-friendly /#admin to prevent CDN/Hosting 404 errors
  app.get(["/admin", "/admin/"], (req, res) => {
    res.redirect(302, "/#admin");
  });

  // --- RESTAURANTS REST API ENDPOINTS ---
  app.get("/api/restaurants", (req, res) => {
    res.json(restaurantsList);
  });

  app.post("/api/restaurants", (req, res) => {
    const { name, city, country, cuisine, address, phone, website, chef, description, inspectorNote, signatureDishes, imageUrl, images, features, priceRange, stars, distinction, category, neighborhood } = req.body;
    if (!name || !city || !cuisine || !description) {
      res.status(400).json({ error: "Name, City, Cuisine, and Description are required." });
      return;
    }
    const newRestaurant = {
      id: `rest-${Math.random().toString(36).substr(2, 9)}`,
      name,
      city,
      country: country || "Lebanon",
      coordinates: { lat: 33.8938, lng: 35.5011, x: 50, y: 50 }, // standard baseline center coords
      stars: parseInt(stars) || 0,
      distinction: distinction || "SELECTED",
      priceRange: priceRange || "$$$",
      cuisine,
      address: address || `${city}, Lebanon`,
      phone: phone || "+961 1 000 000",
      website: website || "https://zaytounadaguide.com",
      chef: chef || "Unknown Chef",
      description,
      inspectorNote: inspectorNote || "Selected fine culinary establishment vetted by inspectors of Zaytounada.",
      signatureDishes: Array.isArray(signatureDishes) ? signatureDishes : (signatureDishes ? [signatureDishes] : []),
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
      images: Array.isArray(images) ? images : [],
      features: Array.isArray(features) ? features : ["Fine Service", "Cozy Ambience"],
      category: category || "fine_dining",
      neighborhood: neighborhood || "hamra"
    };

    restaurantsList.unshift(newRestaurant);
    res.status(201).json(newRestaurant);
  });

  app.put("/api/restaurants/:id", (req, res) => {
    const { id } = req.params;
    const index = restaurantsList.findIndex(r => r.id === id);
    if (index === -1) {
      res.status(404).json({ error: "Restaurant not found." });
      return;
    }

    restaurantsList[index] = {
      ...restaurantsList[index],
      ...req.body,
      coordinates: req.body.coordinates || restaurantsList[index].coordinates || { lat: 33.8938, lng: 35.5011, x: 50, y: 50 },
      stars: req.body.stars !== undefined ? parseInt(req.body.stars) : restaurantsList[index].stars,
      signatureDishes: Array.isArray(req.body.signatureDishes) ? req.body.signatureDishes : restaurantsList[index].signatureDishes,
      images: Array.isArray(req.body.images) ? req.body.images : restaurantsList[index].images,
      features: Array.isArray(req.body.features) ? req.body.features : restaurantsList[index].features,
    };

    res.json(restaurantsList[index]);
  });

  app.delete("/api/restaurants/:id", (req, res) => {
    const { id } = req.params;
    const index = restaurantsList.findIndex(r => r.id === id);
    if (index === -1) {
      res.status(404).json({ error: "Restaurant not found." });
      return;
    }
    const removed = restaurantsList.splice(index, 1);
    res.json({ message: "Restaurant removed successfully.", deleted: removed[0] });
  });

  // --- RESERVATIONS / BOOKINGS REST API ENDPOINTS ---
  app.get("/api/bookings", (req, res) => {
    res.json(bookingsList);
  });

  app.post("/api/bookings", (req, res) => {
    const { restaurantId, restaurantName, userName, userEmail, guestsCount, date, time, specialRequests } = req.body;
    if (!restaurantId || !restaurantName || !userName || !userEmail || !date || !time) {
      res.status(400).json({ error: "Incomplete reservation fields." });
      return;
    }

    const newBooking = {
      id: `book-${Math.random().toString(36).substr(2, 9)}`,
      restaurantId,
      restaurantName,
      userName,
      userEmail,
      guestsCount: parseInt(guestsCount) || 2,
      date,
      time,
      specialRequests: specialRequests || "",
      status: "confirmed"
    };

    bookingsList.unshift(newBooking);

    // FIX EMAIL ROUTING: Construct & log SMTP dispatched confirmation email
    const emailId = `mail-${Math.random().toString(36).substr(2, 9)}`;
    const emailHTML = `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b; text-align: left;">
        <div style="text-align: center; border-bottom: 2px solid #047857; padding-bottom: 20px; margin-bottom: 24px;">
          <span style="font-family: serif; font-size: 28px; font-weight: bold; letter-spacing: 0.1em; color: #047857;">ZAYTOUNADA GUIDE</span>
          <div style="font-size: 10px; font-weight: bold; font-family: monospace; color: #b45309; letter-spacing: 0.2em; text-transform: uppercase; margin-top: 4px;">Exclusive Culinary Seating</div>
        </div>
        
        <h2 style="font-family: serif; font-size: 22px; margin-top: 0; color: #0f172a; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">Reservation Confirmed</h2>
        
        <p>Dear <strong>${userName}</strong>,</p>
        <p>We are pleased to confirm that your booking of a table with priority dining privilege through the <strong>Zaytounada Guide</strong> has been successfully allocated at ${restaurantName}.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 12px; margin: 24px 0; font-size: 14px; line-height: 1.6;">
          <div style="font-size: 11px; font-family: monospace; color: #047857; text-transform: uppercase; font-weight: bold; margin-bottom: 8px;">ALLOCATION DETAILS</div>
          <div style="margin-bottom: 6px;">🏛️ <strong>Establishment:</strong> <span style="font-size: 15px; color: #047857;">${restaurantName}</span></div>
          <div style="margin-bottom: 6px;">📅 <strong>Date:</strong> ${date}</div>
          <div style="margin-bottom: 6px;">⏰ <strong>Time:</strong> ${time}</div>
          <div style="margin-bottom: 6px;">👥 <strong>Table Allocation:</strong> ${guestsCount} seats</div>
          <div style="margin-bottom: 6px;">🎟️ <strong>Booking Code:</strong> <code style="font-family: monospace; background-color: #dcfce7; padding: 2px 6px; border-radius: 4px; color: #15803d; font-weight: bold;">${newBooking.id}</code></div>
          ${specialRequests ? `<div style="margin-top: 10px; border-top: 1px dashed #bbf7d0; padding-top: 10px;">💬 <strong>Special Requests:</strong> <span style="font-style: italic; color: #475569;">"${specialRequests}"</span></div>` : ""}
        </div>
        
        <div style="border-left: 3px solid #b45309; padding-left: 14px; margin: 20px 0; font-size: 13px; color: #475569; font-style: italic;">
          "This reservation secures your premium seating list at the selected culinary gem. Please present this routing code to the Maitre d' upon arrival."
        </div>
        
        <p style="font-size: 13px; color: #334155;">To modify your reservation, please contact our elite Concierge desk or invoke your admin dashboard controls.</p>
        
        <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; font-family: monospace;">
          Sent securely via Zaytounada Guide SMTP Router. All rights reserved 2026.
        </div>
      </div>
    `;

    const dispatchedMail = {
      id: emailId,
      to: userEmail,
      subject: `[Zaytounada Verified] Priority Seating Allocation at ${restaurantName}`,
      html: emailHTML,
      date: new Date().toISOString()
    };

    emailLogs.unshift(dispatchedMail);

    console.log(`[SMTP EMAIL ROUTER] Dispatched priority booking confirmation email to ${userEmail} regarding allocation reference ${newBooking.id} at ${restaurantName}.`);

    res.status(201).json({
      booking: newBooking,
      routedEmail: dispatchedMail
    });
  });

  app.put("/api/bookings/:id", (req, res) => {
    const { id } = req.params;
    const index = bookingsList.findIndex(b => b.id === id);
    if (index === -1) {
      res.status(404).json({ error: "Booking not found." });
      return;
    }
    bookingsList[index] = {
      ...bookingsList[index],
      ...req.body
    };
    res.json(bookingsList[index]);
  });

  app.delete("/api/bookings/:id", (req, res) => {
    const { id } = req.params;
    const index = bookingsList.findIndex(b => b.id === id);
    if (index === -1) {
      res.status(404).json({ error: "Booking not found." });
      return;
    }
    const removed = bookingsList.splice(index, 1);
    res.json({ message: "Booking removed successfully.", deleted: removed[0] });
  });

  // --- SUBSCRIBERS / REGISTRATIONS API ENDPOINTS ---
  app.get("/api/subscribers", (req, res) => {
    res.json(subscribersList);
  });

  app.post("/api/subscribers", (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      res.status(400).json({ error: "A valid email address is required to register." });
      return;
    }

    if (subscribersList.some(s => s.email.toLowerCase() === email.toLowerCase())) {
      res.status(400).json({ error: "Email already registered for update modules." });
      return;
    }

    const newSubscriber = {
      id: `sub-${Math.random().toString(36).substr(2, 9)}`,
      email,
      date: new Date().toISOString()
    };

    subscribersList.unshift(newSubscriber);

    // Record welcome email dispatch log
    const emailHTML = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b; text-align: left;">
        <h2 style="color: #047857; font-family: serif; text-align: center; margin-bottom: 20px;">Welcome to Zaytounada Chronicles</h2>
        <p>Dear Epicurean Guest,</p>
        <p>Thank you for registering to our exclusive culinary bulletins. You will receive first-look access to newly starred restaurants, mezza alerts, and seasonal mountain dining itineraries.</p>
        <div style="background-color: #fffbeb; border: 1px solid #fde68a; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 13px;">
          <strong>Verified Email:</strong> ${email} <br />
          <strong>Benefits Activated:</strong> Priority Concierge matching, direct chef tables, and weekly magazine newsletters.
        </div>
        <p style="font-size: 11px; color: #94a3b8; font-family: monospace; text-align: center; margin-top: 30px;">Zaytounada SMTP Dispatch. Unsubscribe anytime.</p>
      </div>
    `;

    const dispatchedMail = {
      id: `mail-${Math.random().toString(36).substr(2, 9)}`,
      to: email,
      subject: "Welcome to Zaytounada Chronicles - Gastronomy Vetted",
      html: emailHTML,
      date: new Date().toISOString()
    };

    emailLogs.unshift(dispatchedMail);

    res.status(201).json(newSubscriber);
  });

  app.delete("/api/subscribers/:id", (req, res) => {
    const { id } = req.params;
    const index = subscribersList.findIndex(s => s.id === id);
    if (index === -1) {
      res.status(404).json({ error: "Subscriber not found." });
      return;
    }
    const removed = subscribersList.splice(index, 1);
    res.json({ message: "Subscriber removed successfully.", deleted: removed[0] });
  });

  // --- EMAIL LOGGER ROUTER SEND BOX ENDPOINT ---
  app.get("/api/email-logs", (req, res) => {
    res.json(emailLogs);
  });

  // --- ARTICLES / MAGAZINE STORIES API ENDPOINTS ---
  app.get("/api/articles", (req, res) => {
    res.json(articlesList);
  });

  app.post("/api/articles", (req, res) => {
    const { title, subtitle, category, readTime, imageUrl, date, author, content } = req.body;
    if (!title || !subtitle || !category || !content) {
      res.status(400).json({ error: "Title, Subtitle, Category, and Content are required." });
      return;
    }
    const newArticle = {
      id: `art-${Math.random().toString(36).substr(2, 9)}`,
      title,
      subtitle,
      category,
      readTime: readTime || "5 min read",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800",
      date: date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      author: author || "Jean-Luc Zaytounada",
      content: Array.isArray(content) ? content : [content]
    };
    articlesList.unshift(newArticle);
    res.status(201).json(newArticle);
  });

  app.put("/api/articles/:id", (req, res) => {
    const { id } = req.params;
    const index = articlesList.findIndex(a => a.id === id);
    if (index === -1) {
      res.status(404).json({ error: "Article not found." });
      return;
    }
    articlesList[index] = {
      ...articlesList[index],
      ...req.body,
      content: Array.isArray(req.body.content) ? req.body.content : articlesList[index].content
    };
    res.json(articlesList[index]);
  });

  app.delete("/api/articles/:id", (req, res) => {
    const { id } = req.params;
    const index = articlesList.findIndex(a => a.id === id);
    if (index === -1) {
      res.status(404).json({ error: "Article not found." });
      return;
    }
    const removed = articlesList.splice(index, 1);
    res.json({ message: "Article deleted successfully.", deleted: removed[0] });
  });

  // --- PAGES CONFIGURATION API ENDPOINTS ---
  app.get("/api/pages", (req, res) => {
    res.json(pagesConfigList);
  });

  app.put("/api/pages", (req, res) => {
    const newConfig = req.body;
    if (Array.isArray(newConfig)) {
      pagesConfigList = newConfig;
      res.json(pagesConfigList);
    } else {
      res.status(400).json({ error: "Configuration must be an array of pages." });
    }
  });

  // --- SITE SETTINGS API ENDPOINTS ---
  app.get("/api/settings", (req, res) => {
    res.json(siteSettings);
  });

  app.put("/api/settings", (req, res) => {
    siteSettings = {
      ...siteSettings,
      ...req.body
    };
    res.json(siteSettings);
  });

  // API endpoint: Gourmet Michelin AI Concierge
  app.post("/api/concierge", async (req, res) => {
    try {
      const { prompt, history, savedContext } = req.body;

      if (!prompt) {
        res.status(400).json({ error: "Missing prompt parameter." });
        return;
      }

      // Check if API key is configured before moving forward
      let ai;
      try {
        ai = getGeminiClient();
      } catch (keyError: any) {
        console.error("Gemini Key Error:", keyError.message);
        res.status(500).json({ 
          error: "API Key Unconfigured. Please update your GEMINI_API_KEY inside Settings > Secrets." 
        });
        return;
      }

      // System instruction advising the agent how to act
      const systemInstruction = 
        "You are an elite, highly polished Senior Coordinator for the Zaytounada Guide and a personal fine dining counselor specializing exclusively in Lebanese gastronomy and traditional culinary heritage. " +
        "Your demeanor is elegant, cultured, helpful, and exceptionally knowledgeable about authentic Levantine culinary creations, regional terroir, traditional mezza, coastal catches, and mountain farm-to-table traditions. " +
        "You speak with premium, creative, clear, and scannable vocabulary, fully avoiding simple promotional sales-pitch hype or emojis. Always use Lebanese culinary terminology with pride (such as 'Mezza', 'Sayyadieh', 'Kibbeh Nayyeh', 'Arak', 'Saj', 'Kaak', 'Lahme Bajin', 'Manousheh'). " +
        "Ensure all mentions of guide-related concepts refer strictly to the prestigious Zaytounada Guide and Zaytounada Stars (✻), avoiding any references to other non-Lebanese or international guides. " +
        "Always structure your response using Markdown (e.g. bold subheadings, clean bullet points, or historic notes) to ensure absolute reading clarity. " +
        "When recommending culinary experiences, favor real Zaytounada Guide restaurants in our reference dictionary whenever appropriate: " +
        "- Em Sherif (Beirut, 3 Zaytounada Stars, Traditional Lebanese palace with theatrical mezza feasts) " +
        "- Liza (Beirut, 3 Zaytounada Stars, Modern Levantine mansion celebrating classic dishes with contemporary design) " +
        "- Babel Bahr (Amchit/Jbeil Coast, 2 Zaytounada Stars, Elite seaside castle serving progressive maritime sayyadieh and refined raw catch) " +
        "- Baron (Beirut, 2 Zaytounada Stars, Progressive, ingredient-first neighborhood kitchen focused on wood-fired farm-to-table creations) " +
        "- Mayrig (Beirut, 2 Zaytounada Stars, Armenian-Lebanese heritage celebrating exquisite traditional homeland recipes) " +
        "- Tawlet Ammiq (Ammiq/West Bekaa, 2 Zaytounada Stars, Eco farm-to-table cooperative with home-cooked menus from local village matrons) " +
        "- Pierre & Friends (Batroun, 1 Zaytounada Star, Iconic beachside lounge with legendary sunset views and fresh sea-bass) " +
        "- Locanda a la Granda (Byblos, 1 Zaytounada Star, Creative fusion mezza house overlooking Byblos Castle alleys) " +
        "- Al Hallab 1881 (Tripoli, 1 Zaytounada Star, Historical sanctuary of legendary Arabic sweets and fresh ashta pastries) " +
        "- Souk El Tayeb (Beirut, Authentic weekly farmers market cooperative celebrating smallbatch micro-producers) " +
        "- Furn Beaino (Jounieh, Famous classical lahme bajin and light airy manousheh bakers)\n\n" +
        "Maintain the conversational context from the provided history. If they have saved guides, refer to them gently. " +
        "Provide specific, rich culinary answers—never mock placeholders.";

      // Build context of previous messages
      const contentsParts: any[] = [];
      if (history && Array.isArray(history)) {
        history.forEach((msg: { role: string; content: string }) => {
          contentsParts.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          });
        });
      }

      // Context about user favorites / saved restaurants
      let userSavedAnnotation = "";
      if (savedContext && Array.isArray(savedContext) && savedContext.length > 0) {
        userSavedAnnotation = `\n[User's Current Saved Favorites Grid: ${JSON.stringify(savedContext)}]`;
      }

      // Add actual prompt
      contentsParts.push({
        role: "user",
        parts: [{ text: prompt + userSavedAnnotation }]
      });

      // Query Gemini
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contentsParts,
        config: {
          systemInstruction,
          temperature: 0.75,
        }
      });

      const reply = response.text || "I apologize, my tasting notebook is temporarily closed. Please ask again.";
      res.json({ reply });

    } catch (err: any) {
      console.error("Express Concierge error:", err);
      res.status(500).json({ error: err.message || "An unexpected error occurred during model reasoning." });
    }
  });

  // Serve static UI assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Catch-all HTML fallback for client-side routing in development
    app.get('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api/')) {
        return next();
      }
      try {
        const fs = await import("fs");
        const templatePath = path.join(process.cwd(), 'index.html');
        let template = fs.readFileSync(templatePath, 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });

    console.log("Vite dev middleware mounted successfully with SPA route fallback.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Static distribution directory mounted.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Zaytounada Guide Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to bootstrap custom server:", err);
});
