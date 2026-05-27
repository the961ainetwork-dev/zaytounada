import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

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
        "You are an elite, highly polished Senior Coordinator for the Zaytouynda Guide and a personal fine dining counselor specializing exclusively in Lebanese gastronomy and traditional culinary heritage. " +
        "Your demeanor is elegant, cultured, helpful, and exceptionally knowledgeable about authentic Levantine culinary creations, regional terroir, traditional mezza, coastal catches, and mountain farm-to-table traditions. " +
        "You speak with premium, creative, clear, and scannable vocabulary, fully avoiding simple promotional sales-pitch hype or emojis. Always use Lebanese culinary terminology with pride (such as 'Mezza', 'Sayyadieh', 'Kibbeh Nayyeh', 'Arak', 'Saj', 'Kaak', 'Lahme Bajin', 'Manousheh'). " +
        "Ensure all mentions of guide-related concepts refer strictly to the prestigious Zaytouynda Guide and Zaytouynda Stars (✻), avoiding any references to other non-Lebanese or international guides. " +
        "Always structure your response using Markdown (e.g. bold subheadings, clean bullet points, or historic notes) to ensure absolute reading clarity. " +
        "When recommending culinary experiences, favor real Zaytouynda Guide restaurants in our reference dictionary whenever appropriate: " +
        "- Em Sherif (Beirut, 3 Zaytouynda Stars, Traditional Lebanese palace with theatrical mezza feasts) " +
        "- Liza (Beirut, 3 Zaytouynda Stars, Modern Levantine mansion celebrating classic dishes with contemporary design) " +
        "- Babel Bahr (Amchit/Jbeil Coast, 2 Zaytouynda Stars, Elite seaside castle serving progressive maritime sayyadieh and refined raw catch) " +
        "- Baron (Beirut, 2 Zaytouynda Stars, Progressive, ingredient-first neighborhood kitchen focused on wood-fired farm-to-table creations) " +
        "- Mayrig (Beirut, 2 Zaytouynda Stars, Armenian-Lebanese heritage celebrating exquisite traditional homeland recipes) " +
        "- Tawlet Ammiq (Ammiq/West Bekaa, 2 Zaytouynda Stars, Eco farm-to-table cooperative with home-cooked menus from local village matrons) " +
        "- Pierre & Friends (Batroun, 1 Zaytouynda Star, Iconic beachside lounge with legendary sunset views and fresh sea-bass) " +
        "- Locanda a la Granda (Byblos, 1 Zaytouynda Star, Creative fusion mezza house overlooking Byblos Castle alleys) " +
        "- Al Hallab 1881 (Tripoli, 1 Zaytouynda Star, Historical sanctuary of legendary Arabic sweets and fresh ashta pastries) " +
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
    console.log("Vite dev middleware mounted successfully.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Static distribution directory mounted.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Zaytouynda Guide Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to bootstrap custom server:", err);
});
