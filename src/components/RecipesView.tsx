import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Search, 
  Clock, 
  ShieldCheck, 
  Info, 
  Compass, 
  HelpCircle, 
  Download, 
  ChevronRight, 
  Tag, 
  Send, 
  CheckCircle2, 
  Share2, 
  Heart,
  Droplet,
  Thermometer,
  AlertTriangle,
  FileText
} from 'lucide-react';
import ShareActions from './ShareActions';

interface Recipe {
  id: string;
  title: string;
  arabicTitle: string;
  category: 'Vegetable' | 'Dairy' | 'Grain' | 'Condiment' | 'Vinegar';
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  fermentationTime: string;
  microbeProfile: string;
  tagline: string;
  description: string;
  image: string;
  phTarget: string;
  salinity: string;
  ingredients: string[];
  steps: string[];
  alchemistTip: string;
}

const PROBIOTIC_RECIPES: Recipe[] = [
  {
    id: 'red-kimchi',
    title: 'Hamod W Harr’s Signature Vibrant Red Kimchi',
    arabicTitle: 'كيمتشي أحمر بالبروبيوتيك',
    category: 'Vegetable',
    difficulty: 'Medium',
    fermentationTime: '7 - 14 Days',
    microbeProfile: 'Lactobacillus plantarum, Leuconostoc mesenteroides',
    tagline: 'An antioxidant packed fermented classic loaded with anthocyanins, earthiness, and a bold spicy kick.',
    description: 'This is the crown jewel of our laboratory: a crisp, glowing red ferment crafted from premium local cabbage and fresh root vegetables. It delivers an immune-boosting, gut-friendly explosion of pure bio-active lactic acid bacteria.',
    image: 'https://images.unsplash.com/photo-1583224964978-2257b960c3d3?auto=format&fit=crop&q=80&w=600',
    phTarget: '3.8 - 4.2',
    salinity: '2.5% sea salt by weight',
    ingredients: [
      '1 large Napa cabbage (approx. 1kg), cut into bite-sized squares',
      '1 medium white daikon radish, julienned',
      '2 medium carrots, julienned',
      '1 bunch of scallions (green onions), cut into 1-inch lengths',
      '50g sea salt (uniodized)',
      '60g gochugaru (Korean chili flakes) or red Lebanese Aleppo pepper paste',
      '6 garlic cloves, minced',
      '1 tablespoon of grated ginger',
      '1 tablespoon of raw organic honey or apple syrup',
      '2 tablespoons of seaweed paste or organic kelp powder'
    ],
    steps: [
      'Brining: In a large glass bowl, toss the cabbage with uniodized sea salt. Let it sit for 2 hours, massaging gently every 30 minutes, until wilted and releasing its natural cell moisture.',
      'Rinsing: Rinse the cabbage thoroughly three times under cool filtered water to remove excess salt. Squeeze gently to drain completely.',
      'Paste Creation: Combine minced garlic, ginger, chili flakes (or Aleppo pepper paste), honey, and kelp powder in a small bowl. Stir into a thick, fiery red paste.',
      'Folding: Mix the julienned radish, carrots, and scallions with the red chili paste, then combine with the drained cabbage. Wear gloves and massage the paste into every leaf.',
      'Packing: Pack the mixture firmly into a clean glass jar (like a Hamod W Harr lab jar), pressing down hard with a wooden tamper to expel air bubbles. Ensure the brine rises to cover all vegetables completely.',
      'Fermentation: Cover with an airtight lid but burp daily to release carbon dioxide pressure. Store in a dark space at 18-22°C for 7 to 10 days until tangy, sour, and effervescent. Transfer to cold storage.'
    ],
    alchemistTip: 'To amplify the antioxidant anthocyanins, add shredded red cabbage or heirloom dark beetroots into the mix. This turns the brine a glowing deep-ruby violet!'
  },
  {
    id: 'toum-mukhammar',
    title: 'Classic Toum Al-Mukhammar (Fermented Garlic Paste)',
    arabicTitle: 'ثوم مخمّر بروبيوتيك',
    category: 'Condiment',
    difficulty: 'Advanced',
    fermentationTime: '21 Days',
    microbeProfile: 'Lactobacillus sakei, Lactobacillus curvatus',
    tagline: 'A probiotic, bio-available twist on Lebanon’s legendary garlic paste, engineered for smooth digestion.',
    description: 'Traditional garlic toum can sometimes be heavy on the stomach due to intense raw garlic compounds. By slowly fermenting peeled garlic cloves in an organic honey-salt brine before emulsifying, we pre-digest the harsh compounds and saturate the paste in lactic acid.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600',
    phTarget: '4.0',
    salinity: '3.0% sea salt brine',
    ingredients: [
      '300g peeled organic garlic cloves',
      '200ml filtered water',
      '1 tablespoon raw organic honey',
      '10g sea salt (uniodized)',
      '150ml cold-pressed Lebanese olive oil',
      '2 tablespoons freshly squeezed lemon juice'
    ],
    steps: [
      'Brine Prep: Dissolve the uniodized sea salt and raw honey in warm filtered water, then allow it to cool to room temperature.',
      'Submergence: Place all peeled garlic cloves in a sterile fermenting jar. Pour the salt-honey brine over the cloves until they are completely submerged.',
      'Lacto-Ferment: Place a glass weight on top to keep the cloves submerged. Secure an airlock lid and store in a cool, dark cupboard for 21 days. The cloves will bubble and turn slightly translucent.',
      'The Emulsification: Drain the fermented garlic cloves, reserving 2 tablespoons of the active, cloudy probiotic brine.',
      'The Whip: Blend the fermented garlic cloves and lemon juice in a food processor until smooth. Slowly drizzle in cold-pressed olive oil in a continuous, thread-thin stream while blending until a white, cloud-like, fluffy emulsion forms.',
      'Fold Brine: Stir in the reserved active garlic brine. Store in a sterile glass jar in the refrigerator. It remains active, probiotic, and deliciously stable.'
    ],
    alchemistTip: 'If some garlic cloves turn slightly blue or green during fermentation, don’t panic! This is a natural reaction between garlic’s sulfur compounds and amino acids in an acidic environment—it is completely safe and healthy.'
  },
  {
    id: 'labneh-baladieh-oil',
    title: 'Traditional Labneh Baladieh in Olive Oil',
    arabicTitle: 'لبنة بلدية مكعزلة بزيت الزيتون',
    category: 'Dairy',
    difficulty: 'Easy',
    fermentationTime: '3 - 5 Days',
    microbeProfile: 'Lactobacillus bulgaricus, Streptococcus thermophilus',
    tagline: 'Tangy, probiotic strained yogurt spheres preserved in cold-pressed Lebanese olive oil with wild thyme.',
    description: 'The ancient mountain method of conserving probiotic dairy. Fresh local goat or cow milk yogurt is strained for days until thick and creamy, rolled into spheres, and submerged in pure oil to create a natural oxygen barrier.',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600',
    phTarget: '4.3',
    salinity: '1.5% salt by weight',
    ingredients: [
      '1kg fresh, active full-fat plain Lebanese yogurt (goat milk preferred)',
      '1.5 tablespoons fine sea salt',
      '500ml premium cold-pressed extra virgin olive oil',
      '2 tablespoons wild Lebanese za’atar (thyme, sesame, sumac mixture)',
      '1 tablespoon dried organic mint'
    ],
    steps: [
      'Salting: Whisk the fine sea salt thoroughly into the fresh active yogurt until dissolved.',
      'Straining: Line a large sieve with a double-layered clean cheesecloth or a nut milk bag. Pour the salted yogurt in and tie the corners tightly.',
      'The Hang: Suspend the cheesecloth bag over a deep bowl to collect the whey. Let it strain at room temperature for 24-36 hours, then transfer to the refrigerator for another 24 hours until a dense, moldable cheese-like paste is formed.',
      'Shaping: Lightly grease your palms with olive oil. Scoop out tablespoons of the dense labneh and roll them into uniform, smooth spheres about the size of walnuts.',
      'Dehydrating: Place the labneh balls on a tray lined with clean paper towels. Return to the refrigerator for 12 hours to dry out their outer moisture further.',
      'Preservation: Pack the labneh spheres gently into clean jars. Add wild za’atar, dried mint, and pour extra virgin olive oil until the labneh is completely submerged and protected from oxygen.'
    ],
    alchemistTip: 'Keep the nutrient-rich, neon-yellow whey that drips out during straining! It is packed with live enzymes, active probiotics, and lactic acid. Use it to ferment grains, soak sourdough, or drink it as a prebiotic tonic.'
  },
  {
    id: 'kishk-balad',
    title: 'Kishk Al-Balad (Fermented Bulgur & Yogurt Powder)',
    arabicTitle: 'كشك بلدي مخمّر',
    category: 'Grain',
    difficulty: 'Advanced',
    fermentationTime: '9 Days',
    microbeProfile: 'Lactobacillus acidophilus, Lactobacillus casei',
    tagline: 'An ancient, dry-fermented mountain superfood made of cracked wheat lacto-fermented with yogurt.',
    description: 'This is the ultimate winter survival food of Mount Lebanon. Over nine consecutive days, fine bulgur wheat is repeatedly kneaded and fermented with thick active yogurt, slowly absorbing the probiotics before being dried on rooftops and ground into a shelf-stable powder.',
    image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&q=80&w=600',
    phTarget: '3.9',
    salinity: '2.0% salt by weight',
    ingredients: [
      '500g fine whole-grain bulgur (cracked wheat)',
      '1.5kg active, tangy full-fat goat milk yogurt (re-strained slightly)',
      '2 tablespoons coarse sea salt'
    ],
    steps: [
      'Day 1-2 (The Cradle): Wash the bulgur thoroughly and drain well. In a large clay or glass bowl, mix the bulgur with 500g of active yogurt and the sea salt. Cover with a clean cloth and leave at room temperature.',
      'Day 3-5 (The Feeding): The bulgur will absorb all the moisture and begin to bubble slightly. Every morning, add another 250g of fresh, active yogurt, kneading it vigorously with your hands to incorporate.',
      'Day 6-8 (The Deep Sour): Keep the mixture covered. It will develop a distinct, pleasantly sour, cheesy aroma. Knead daily. The bulgur structure breaks down, pre-digested by lactic acid bacteria.',
      'Day 9 (The Crumble): Scoop the wet, clay-like kishk paste and spread it in small flat clumps onto clean white sheets in a well-ventilated, sunny room (or food dehydrator). Let dry completely.',
      'The Milling: Once bone-dry, rub the dried kishk clumps between your hands through a fine wire sieve, or process in a high-powered blender to obtain a fine, cream-colored, probiotic-dense traditional powder.'
    ],
    alchemistTip: 'Serve your finished Kishk powder as a warm, comforting winter soup: whisk 3 tablespoons into simmering water with minced garlic, chopped onions, and a splash of olive oil until thick, comforting, and incredibly soothing to the gut.'
  },
  {
    id: 'pink-turnips',
    title: 'Lacto-Fermented Pink Turnips (Kabees El-Lafet)',
    arabicTitle: 'مخلل لفت وردي مخمّر',
    category: 'Vegetable',
    difficulty: 'Easy',
    fermentationTime: '10 Days',
    microbeProfile: 'Lactobacillus plantarum, Leuconostoc fallax',
    tagline: 'The quintessential Lebanese table pickle, naturally fermented using sea salt brine and colored with beetroot.',
    description: 'No Lebanese table is complete without these vibrant, crunchy pink turnips. True traditional Kabees does not use boiled white vinegar. Instead, it relies on wild lactic acid fermentation, yielding a crisp pickle brimming with active gut-friendly bacteria.',
    image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&q=80&w=600',
    phTarget: '3.6 - 3.9',
    salinity: '5.0% traditional brine concentration',
    ingredients: [
      '1kg fresh, firm purple-top turnips, washed and sliced into wedges',
      '1 large dark beetroot, sliced into matching wedges (for that glowing pink color)',
      '4 garlic cloves, crushed slightly',
      '500ml filtered water',
      '25g fine sea salt (uniodized)',
      '1 bay leaf'
    ],
    steps: [
      'Vegetable Prep: Pack the turnip wedges tightly into sterile jars, interspersing them with beetroot wedges to distribute the gorgeous crimson pigment.',
      'Aromatic Core: Slip the crushed garlic cloves and bay leaf into the center of the jar.',
      'Brine Synthesis: Dissolve the uniodized sea salt completely in room-temperature filtered water to create a pure 5% salinity brine.',
      'Inundation: Pour the brine over the turnips until they are completely covered. Leave about 1 inch of headspace.',
      'The Lock: Place a small fermentation weight on top to prevent the turnip tips from floating. Screw the lid on snugly.',
      'Ferment Stage: Store in a dark space at 19-23°C for 10 days. The liquid will slowly turn into an electric pink hue, and the harsh raw turnip flavor will mellow into a crisp, tangy, garlic-infused bite.'
    ],
    alchemistTip: 'Always slice a thin layer of organic celery stalk and pack it at the very top of your turnip jar before adding the weight. Celery contains natural nitrates that act as a barrier against mold growth!'
  },
  {
    id: 'apple-vinegar-baskinta',
    title: 'Wild Apple Cider Vinegar from Baskinta Apples',
    arabicTitle: 'خل تفاح بسكنتا بلدي',
    category: 'Vinegar',
    difficulty: 'Medium',
    fermentationTime: '60 Days',
    microbeProfile: 'Acetobacter aceti, Saccharomyces cerevisiae',
    tagline: 'Raw, unfiltered ACV fermented with wild "mother" cultures, capturing the essence of Lebanese mountain orchards.',
    description: 'This raw vinegar is brewed using heirloom, mountain-grown red and golden apples from Baskinta. Fermented slowly in a two-stage process—first converting sugars to alcohol with wild yeasts, then converting alcohol to organic acetic acid with beneficial microbes.',
    image: 'https://images.unsplash.com/photo-1622484211148-716598e04141?auto=format&fit=crop&q=80&w=600',
    phTarget: '2.8 - 3.2',
    salinity: '0% (Uses natural apple sugars)',
    ingredients: [
      '1kg organic, un-waxed sweet apples (Baskinta variety preferred)',
      '2 tablespoons organic raw cane sugar',
      '1L filtered water',
      '50ml raw unpasteurized apple cider vinegar with the "Mother" (starter culture)'
    ],
    steps: [
      'Core Chop: Chop the apples into rough cubes, including the skins, cores, and seeds (as they house the highest concentration of wild yeasts).',
      'Sugar-Water Prep: Dissolve the raw cane sugar into filtered water in a large glass jar.',
      'Maceration: Add the apple chunks to the jar, ensuring they are completely submerged. Add the raw apple cider vinegar starter with its cloudy mother strands.',
      'First Stage (Yeast): Cover the jar with a breathable fabric secured with a rubber band (vinegar microbes require oxygen). Store in a warm, dark cupboard. Stir daily with a wooden spoon for 3 weeks to prevent mold.',
      'The Strain: After 3 weeks, the liquid should smell pleasantly alcoholic. Strain out the mushy apple solids, reserving the cloudy liquid.',
      'Second Stage (Acetic): Pour the liquid back into the glass jar. Cover with the breathable fabric. Leave undisturbed for another 4 to 5 weeks. A thin, gelatinous film (the vinegar mother) will form on the surface, converting alcohol into robust, probiotic acetic acid.'
    ],
    alchemistTip: 'Never use metal containers or metal lids when brewing or storing vinegar! Acetic acid actively reacts with metal, which ruins the vinegar and introduces harmful metal salts. Stick strictly to glass, ceramic, or high-quality wood.'
  },
  {
    id: 'shanqlish-cheese',
    title: 'Probiotic Shanqlish (Aged Herbal Cheese)',
    arabicTitle: 'شنكليش بروبيوتيك معتّق',
    category: 'Dairy',
    difficulty: 'Advanced',
    fermentationTime: '30 Days',
    microbeProfile: 'Lactobacillus paracasei, Penicillium roqueforti (wild strains)',
    tagline: 'Aged, dried cow’s milk labneh curd rolled in spicy pepper and wild mountain za’atar.',
    description: 'Shanqlish is one of the most distinctive aged cheeses of the Levant. Our probiotic version is slowly cured in dark chambers, allowing beneficial surface molds and lactic bacteria to digest lactose, leaving a crumbly, spicy, and deeply aromatic cheese.',
    image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&q=80&w=600',
    phTarget: '4.5',
    salinity: '3.5% salt by weight',
    ingredients: [
      '1kg thick, dry strained Labneh cheese (strained for 48 hours)',
      '2 tablespoons sea salt',
      '1 tablespoon ground hot chili pepper (Aleppo style)',
      '1 tablespoon sweet paprika',
      '4 tablespoons dried wild mountain za’atar'
    ],
    steps: [
      'The Curd Prep: Knead the thick strained Labneh with the sea salt, sweet paprika, and chili pepper until fully integrated.',
      'Spherical Molding: Shape the seasoned cheese curd into compact, smooth spheres slightly larger than tennis balls, pressing firmly to squeeze out any trapped air.',
      'Primary Dry: Wrap the cheese spheres individually in absorbent cotton kitchen towels or paper towels. Place them on a wire rack in the refrigerator for 5 days, changing the wrapping daily as they weep moisture.',
      'The Maturation: Place the dry, hardened cheese balls in clean, dark glass jars. Seal and place them in a cool (15-18°C) dark pantry for 2 to 3 weeks. A thin layer of white/gray mold will naturally form on the exterior—this is the secret to Shanqlish’s deep, pungent, umami-rich ripening.',
      'The Cleanse: Remove the spheres from the jars. Gently scrape off the thin dry surface mold layer using a paring knife to reveal a rich, golden cheese center.',
      'The Herbal Coat: Brush the cheese balls with a microscopic glaze of olive oil, then roll them generously in wild mountain za’atar until completely coated. Serve crumbled with olive oil, diced tomatoes, and chopped onions.'
    ],
    alchemistTip: 'Shanqlish is a probiotic powerhouse because the dry-curing process concentrates the bacterial colony density by up to 500% compared to standard liquid yogurt!'
  },
  {
    id: 'turmeric-kraut',
    title: 'Ginger-Turmeric Kraut-Chi (Golden Probiotics)',
    arabicTitle: 'كرنب مخلل بالكركم والزنجبيل',
    category: 'Vegetable',
    difficulty: 'Easy',
    fermentationTime: '14 Days',
    microbeProfile: 'Lactobacillus brevis, Lactobacillus plantarum',
    tagline: 'A spicy, glowing golden kraut-kimchi hybrid packed with ginger, turmeric, and crisp cabbage.',
    description: 'This is an anti-inflammatory powerhouse. Crisp green cabbage is shredded and massage-fermented with raw turmeric and fiery ginger. It creates a bright yellow, peppery kraut that delivers active lactobacillus colonies directly to your microbiome.',
    image: 'https://images.unsplash.com/photo-1540324155974-75226c3ad39d?auto=format&fit=crop&q=80&w=600',
    phTarget: '3.7',
    salinity: '2.0% salt by weight',
    ingredients: [
      '1kg organic green cabbage, outer leaves reserved, inner shredded thinly',
      '15g fresh turmeric root, finely grated',
      '20g fresh ginger root, finely grated',
      '2 garlic cloves, minced',
      '20g uniodized sea salt',
      '0.5 teaspoon freshly ground black pepper (crucial to activate turmeric curcumin!)'
    ],
    steps: [
      'Shred & Weigh: Discard any bruised outer leaves of the cabbage, but set aside one large, clean outer leaf for later. Shred the remaining cabbage thinly.',
      'The Massage: Place the shredded cabbage in a massive glass bowl. Sprinkle the sea salt over it. Using your hands, massage the cabbage vigorously for 10 minutes. It will release a significant amount of cloudy cabbage juice (the brine).',
      'Active Spice Fold: Add the grated turmeric, grated ginger, minced garlic, and ground black pepper to the wilted cabbage. Fold thoroughly until the cabbage turns a uniform, bright yellow-gold.',
      'Jar Compaction: Pack the golden cabbage tightly into a sterilized wide-mouth glass jar. Press down firmly with your knuckles or a tamper until the extracted brine rises at least 1 inch above the cabbage line.',
      'The Cap: Take the reserved clean outer cabbage leaf, cut it to fit the jar diameter, and place it directly on top of the shredded cabbage to act as a barrier. Place a fermentation weight on top to submerge everything.',
      'Curing: Cover with an airtight lid. Store in a dark drawer at room temp (18-22°C) for 14 days, burping pressure occasionally. When sour and bubbly, store in the fridge.'
    ],
    alchemistTip: 'Always include black pepper when fermenting turmeric! The piperine in black pepper increases your body\'s absorption of turmeric\'s active anti-inflammatory compound, curcumin, by up to 2000%!'
  },
  {
    id: 'kefir-jabal',
    title: 'Kefir Al-Jabal (Lebanese Mountain Kefir)',
    arabicTitle: 'كيفير الجبل بروبيوتيك',
    category: 'Dairy',
    difficulty: 'Easy',
    fermentationTime: '24 Hours',
    microbeProfile: 'Lactobacillus kefiri, Kluyveromyces marxianus',
    tagline: 'A thick, creamy probiotic dairy drink fermented with live heirloom kefir grains for maximum digestion.',
    description: 'Kefir is a legendary cultured drink that surpasses standard yogurt in microbial diversity. Our Mountain Kefir uses real, living kefir grains to ferment fresh Lebanese cow and goat milk, creating a tangy, slightly carbonated beverage that restores gut flora.',
    image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=600',
    phTarget: '4.4',
    salinity: '0% (Dairy ferment)',
    ingredients: [
      '1 tablespoon active, living milk kefir grains',
      '500ml fresh, high-quality whole milk (cow or goat milk, not ultra-pasteurized)',
      '1 clean glass jar'
    ],
    steps: [
      'The Grains Cradle: Place your active milk kefir grains at the bottom of a clean, sterile glass jar.',
      'Pour Milk: Pour the fresh whole milk (cool or room temperature, never hot!) over the grains, leaving 2 inches of headspace.',
      'Breathable Cap: Cover the jar with a breathable cloth, coffee filter, or paper towel and secure with a rubber band. This allows the wild yeasts in the grains to breathe.',
      'Primary Fermentation: Store the jar in a warm, dark pantry (20-24°C) for 24 hours. Gently shake the jar once or twice during this time.',
      'The Curdle: After 24 hours, the milk will have thickened and developed a pleasantly tart, yeasty aroma. You may see slight separation into whey pockets—this is perfect.',
      'The Harvest: Pour the kefir through a fine non-metal plastic or nylon mesh strainer over a bowl. Gently stir with a wooden spatula to guide the liquid through while keeping the rubbery kefir grains intact. Place the grains back in a jar with fresh milk to start the next batch. Pour the strained kefir into a bottle and refrigerate.'
    ],
    alchemistTip: 'Never let your kefir grains touch metal! Metal can weaken or kill the delicate microbial ecosystem of the living grains over time. Always use glass jars, wood/plastic spoons, and plastic or silicone strainers.'
  },
  {
    id: 'fermented-shata',
    title: 'Lacto-Fermented Green Chili Shata (Hot Pepper Paste)',
    arabicTitle: 'شطة خضراء مخمّرة بالزيت',
    category: 'Condiment',
    difficulty: 'Medium',
    fermentationTime: '14 Days',
    microbeProfile: 'Lactobacillus pentosus, Lactobacillus plantarum',
    tagline: 'Spicy Lebanese green hot pepper paste fermented under olive oil for a deep, complex, gut-healthy sting.',
    description: 'Traditional Lebanese Shata is a staple condiment. This lacto-fermented green version relies on the natural microflora of green serrano/jalapeno peppers. It develops a brilliant, complex lactic acidity and complex heat that completely eclipses plain vinegar-soaked hot sauces.',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=600',
    phTarget: '3.7 - 4.0',
    salinity: '3.0% sea salt by weight',
    ingredients: [
      '500g fresh green chili peppers (serrano, jalapeno, or local green horn peppers), stems removed',
      '4 garlic cloves, peeled',
      '15g uniodized coarse sea salt',
      '1 tablespoon organic apple syrup or honey (to feed the bacteria)',
      '100ml premium Lebanese extra virgin olive oil (to seal the jar)'
    ],
    steps: [
      'The Chop: Rough-chop the green chili peppers, retaining the seeds for heat. Place the chilis and garlic cloves into a food processor.',
      'Pulse & Salt: Add the sea salt and honey to the processor. Pulse until you achieve a coarse, textured paste (do not puree completely into liquid).',
      'Jar Consolidation: Scoop the chili paste into a clean, sterile glass jar. Press the mixture down firmly using a spoon to eliminate any air pockets.',
      'The Olive Barrier: Pour extra virgin olive oil over the top of the pressed chili paste until it forms a solid, 0.5-inch protective layer. This creates a strictly anaerobic environment, preventing any mold from accessing the chili pulp.',
      'Lacto-Fermenting: Close the jar with a lid. Place in a dark cupboard for 14 days. The green color will mature into an olive hue, and the mixture will bubble quietly beneath the oil barrier.',
      'Completion: Stir the olive oil into the fermented paste before use. Store in the refrigerator. It is spicy, deeply savory, and packed with digestive enzymes.'
    ],
    alchemistTip: 'The capsaicin in hot chilis is a natural anti-microbial agent, but beneficial lactic acid bacteria are immune to it! This makes hot chili ferments exceptionally safe and easy to brew, with virtually zero risk of bad mold contamination.'
  }
];

export default function RecipesView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  // Alchemist AI Advisor State
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'alchemist', text: string}>>([
    {
      role: 'alchemist',
      text: "Salutations, fermentation seeker. I am the Alchemist, Hamod W Harr's live microbiome advisor. Ask me anything about temperature, salinity ratios, white yeast films (Kahm mold), or pH benchmarks! How can I guide your culture today?"
    }
  ]);
  const [isAlchemistTyping, setIsAlchemistTyping] = useState(false);

  // Probiotic Protocol Modal state
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  // Claim offer state
  const [showOfferClaimed, setShowOfferClaimed] = useState(false);

  // Handle Alchemist AI Response simulation
  const handleSendAlchemistMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage;
    setChatHistory(prev => [...prev, { role: 'user', text: userText }]);
    setChatMessage('');
    setIsAlchemistTyping(true);

    setTimeout(() => {
      let responseText = "Fascinating query! In the realm of lacto-fermentation, the balance of salinity, anaerobic conditions, and thermal ranges is key. ";
      
      const query = userText.toLowerCase();
      if (query.includes('white') || query.includes('film') || query.includes('mold') || query.includes('surface')) {
        responseText = "Ah, you are likely encountering Kahm Yeast. It is a harmless, non-toxic white, wavy film that forms when oxygen is present on the surface of your brine. Simply skim it off with a clean spoon, ensure your vegetables are fully submerged beneath the brine weight, and add a drop of olive oil to seal out air. Rest easy, your ferment is safe!";
      } else if (query.includes('salt') || query.includes('ratio') || query.includes('salinity') || query.includes('water')) {
        responseText = "For standard vegetable ferments (like Krauts and Kimchis), we highly recommend a 2% to 2.5% uniodized sea salt ratio by weight. For harder root veggies or hot peppers, 3% is optimal. Avoid iodized salt at all costs, as iodine is antiseptic and will kill our friendly Lactobacillus allies!";
      } else if (query.includes('blue') || query.includes('green') || query.includes('garlic')) {
        responseText = "Do not be alarmed! Garlic cloves turning emerald green or sapphire blue during fermentation is a benign chemical reaction between amino acids and sulfur compounds in an acidic environment. It is fully edible, highly probiotic, and visually spectacular!";
      } else if (query.includes('temperature') || query.includes('temp') || query.includes('hot') || query.includes('cold')) {
        responseText = "The sweet spot for active lactic acid fermentation is between 18°C and 22°C (64-72°F). Anything above 25°C accelerates fermentation too quickly, resulting in mushy textures and yeasty off-flavors. Temperatures below 15°C will cause the microbes to go into a semi-dormant hibernation, slowing fermentation to a crawl.";
      } else if (query.includes('bubble') || query.includes('explosion') || query.includes('burp') || query.includes('gas')) {
        responseText = "Carbon dioxide (CO2) is a direct byproduct of energetic lactic acid synthesis. Always 'burp' your jars daily by slightly loosening the lid for a split second, or utilize an airlock lid. This prevents high pressure build-ups and unexpected volcanic probiotic eruptions on your counter!";
      } else {
        responseText = `Excellent inquiry. To master this culture, ensure three principles: 1) Strict submergence—anything below the brine is safe, anything above is subject to spoilage. 2) Uniodized sea salt—to selectively allow lactic acid bacteria to thrive. 3) Time—patience is the alchemist's finest ingredient. Your pH should drop below 4.0 within a week to indicate a successfully acidified, sterile environment. Let the microbes do their work!`;
      }

      setChatHistory(prev => [...prev, { role: 'alchemist', text: responseText }]);
      setIsAlchemistTyping(false);
    }, 1200);
  };

  const categories = ['All', 'Vegetable', 'Dairy', 'Condiment', 'Grain', 'Vinegar'];
  const difficulties = ['All', 'Easy', 'Medium', 'Advanced'];

  const filteredRecipes = PROBIOTIC_RECIPES.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          recipe.arabicTitle.includes(searchQuery) ||
                          recipe.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          recipe.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || recipe.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="bg-neutral-50 min-h-screen pb-16 font-sans text-left" id="recipes-main-view">
      
      {/* BRAND SPONSOR TOP BAR */}
      <div className="bg-neutral-900 text-white py-3 px-4 border-b border-amber-400/30 shadow-sm" id="recipes-brand-sponsor-header">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-3">
            <span className="bg-amber-400 text-neutral-950 font-mono text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
              EXCLUSIVE PARTNER
            </span>
            <span className="font-serif text-sm font-bold tracking-wider text-amber-100 flex items-center gap-1">
              HAMOD W HARR <span className="text-amber-400 text-xs font-light">• Lebanese Mouneh & Labs</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-[10.5px] font-mono text-neutral-300">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              PH VERIFIED
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              LIVE MICROBIOME ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* HERO SECTION - RECREATING ATTACHED SCREENSHOT DESIGN */}
      <div className="bg-white border-b border-neutral-200 py-12 px-4 sm:px-6 lg:px-8" id="recipes-branded-hero">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Recreated Lab Jar Illustration/Image */}
          <div className="lg:col-span-5 flex justify-center" id="recipes-screenshot-recreation">
            <div className="border-[3px] border-neutral-900 rounded-2xl p-6 bg-white shadow-xl max-w-sm w-full relative group">
              
              {/* Pinterest-style "SAVE" button mockup */}
              <button className="absolute top-4 left-4 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase py-1 px-3.5 rounded-full flex items-center gap-1 shadow-sm transition-all z-10">
                <span className="font-sans font-black">P</span> Save
              </button>

              <div className="text-center pb-4 border-b border-dashed border-neutral-300">
                <p className="font-serif text-[11px] uppercase tracking-widest text-neutral-400 font-bold">Organic Lacto-Ferment</p>
                <h3 className="font-serif text-lg font-bold text-neutral-900 uppercase tracking-tight mt-1">Vibrant Red Kimchi Jar</h3>
              </div>

              {/* Lab Jar Illustration Frame */}
              <div className="py-6 flex flex-col items-center justify-center relative bg-neutral-50/50 rounded-xl my-4 border border-neutral-100">
                <div className="w-44 h-56 relative">
                  {/* Glass Jar Body representation */}
                  <div className="absolute inset-x-4 bottom-0 top-10 border-4 border-neutral-800 bg-red-50/30 rounded-3xl overflow-hidden shadow-inner flex flex-col items-center justify-end pb-3">
                    {/* Glowing golden-red kimchi pieces inside */}
                    <div className="absolute inset-0 bg-gradient-to-t from-red-700/80 via-amber-600/60 to-orange-500/30 flex flex-col justify-end p-2 gap-1.5">
                      <div className="w-full h-8 bg-red-800/90 rounded-md border border-red-950/40 relative">
                        <div className="absolute inset-x-2 top-1 h-1 bg-white/20 rounded"></div>
                        <span className="text-[7px] font-mono text-red-100 font-bold block text-center uppercase tracking-wider">Cabbage</span>
                      </div>
                      <div className="w-4/5 h-6 bg-amber-700/90 rounded-md border border-amber-950/40 mx-auto"></div>
                      <div className="w-11/12 h-8 bg-orange-700/90 rounded-md border border-orange-950/40 mx-auto"></div>
                    </div>
                    {/* Lab label sticker inside jar */}
                    <div className="bg-amber-50 border-2 border-neutral-800 px-2 py-1 shadow text-[7px] font-mono text-neutral-900 font-black tracking-widest uppercase z-10 rounded">
                      HAMAD W HARR • LAB SAMPLE
                    </div>
                  </div>
                  {/* Jar Neck */}
                  <div className="absolute inset-x-10 top-6 h-4 border-x-4 border-t-4 border-neutral-800 bg-white/80 z-20"></div>
                  {/* Jar Lid */}
                  <div className="absolute inset-x-8 top-1 h-5 border-4 border-neutral-800 bg-neutral-850 bg-neutral-900 rounded-t-lg z-30"></div>
                  
                  {/* "New!" cursive banner overlay */}
                  <div className="absolute -left-4 top-16 -rotate-12 bg-transparent text-red-650 font-serif text-3xl font-black italic tracking-wide select-none drop-shadow">
                    New!
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="font-serif text-xs font-semibold text-neutral-800">HAMOD W HARR LABS</p>
                <p className="text-[9.5px] font-mono text-neutral-500 uppercase tracking-wider mt-1">
                  KRAUTS, KIMCHIS AND CONDIMENTS!
                </p>
              </div>

            </div>
          </div>

          {/* Right Column: Branded Promotion Texts */}
          <div className="lg:col-span-7 space-y-6" id="recipes-brand-promotions-column">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 font-mono text-[10px] font-black uppercase tracking-wider rounded-full">
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                Featured Laboratory Recipe
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-light text-neutral-900 uppercase tracking-tight leading-none">
                Turn Up The Heat <br />
                <span className="font-serif font-black text-neutral-950 block mt-2 relative">
                  with this antioxidant packed <br className="hidden sm:block"/>
                  <span className="underline decoration-wavy decoration-amber-500 underline-offset-4">Red Kimchi</span>.
                </span>
              </h1>
            </div>

            <p className="text-lg text-neutral-700 font-light leading-relaxed">
              Made with <strong className="text-neutral-900 font-semibold">kimchi cabbage</strong> and <strong className="text-neutral-900 font-semibold">root vegetables</strong>, it is packed with <span className="bg-lime-200 px-1.5 py-0.5 rounded font-mono font-bold text-sm text-neutral-900">anthocyanins</span>. It's earthy, spicy and robust.
            </p>

            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-neutral-900 rounded-xl shrink-0 text-white">
                  <span className="font-mono font-black text-xs">H</span>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-neutral-900 text-sm uppercase">HAMAD W HARR LABS</h4>
                  <p className="text-xs text-neutral-600 font-light mt-0.5">
                    Fermenting organic produce into nutrient-dense, gut-friendly elixirs. Adding a probiotic <strong className="text-amber-800">ZING</strong> to your everyday! Best consumed within 30 days of opening.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={() => {
                    const el = document.getElementById('recipe-red-kimchi');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setSelectedRecipe(PROBIOTIC_RECIPES[0]);
                  }}
                  className="px-4 py-2.5 bg-neutral-950 hover:bg-neutral-850 text-white font-mono text-[10.5px] font-bold uppercase tracking-wider rounded-xl transition-all text-center cursor-pointer shadow-sm"
                >
                  Explore Kimchi Recipe
                </button>
                <button 
                  onClick={() => setShowProtocolModal(true)}
                  className="px-4 py-2.5 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 font-mono text-[10.5px] font-bold uppercase tracking-wider rounded-xl transition-all text-center cursor-pointer shadow-2xs"
                >
                  Probiotic Protocol (PDF)
                </button>
              </div>
            </div>

            {/* July Offer Mockup Floating Strip */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 animate-bounce">
                  %
                </div>
                <div>
                  <p className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest">July Special Offer</p>
                  <p className="text-xs text-neutral-700 font-light mt-0.5">Get 15% off all retail jars at any Hamod W Harr popup market!</p>
                </div>
              </div>
              <button 
                onClick={() => setShowOfferClaimed(true)}
                className="shrink-0 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-[9.5px] uppercase tracking-wider rounded-lg transition-all cursor-pointer"
              >
                Claim Coupon
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* SEARCH, CATEGORIES & MAIN RECIPES GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12" id="recipes-catalogue-grid-section">
        <div className="border-b border-neutral-200 pb-5 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="text-left space-y-1">
            <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-[0.25em] block">
              THE GUT REVOLUTION
            </span>
            <h2 className="font-serif text-3xl font-light text-neutral-900 uppercase">
              10 Probiotic <span className="font-semibold text-neutral-950">Fermentation Recipes</span>
            </h2>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search recipes or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9.5 pr-4 py-2.5 w-full bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-emerald-600 shadow-2xs"
            />
          </div>
        </div>

        {/* Filter Badges Row */}
        <div className="flex flex-wrap gap-2.5 mb-8" id="recipes-filters-row">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-neutral-400">Category:</span>
          </div>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-all cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-emerald-700 text-white font-bold shadow-sm'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {cat}
            </button>
          ))}

          <div className="w-full md:w-auto h-px md:h-6 bg-neutral-200 md:w-px my-1 md:my-0 md:mx-2"></div>

          <div className="flex items-center gap-1.5 mr-2">
            <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-neutral-400">Difficulty:</span>
          </div>
          {difficulties.map(diff => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-all cursor-pointer ${
                selectedDifficulty === diff 
                  ? 'bg-neutral-900 text-white font-bold shadow-sm'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200 shadow-sm max-w-lg mx-auto">
            <HelpCircle className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-neutral-800">No Fermentation Recipes Found</h3>
            <p className="text-xs text-neutral-500 font-light mt-1 max-w-xs mx-auto">
              Try adjusting your filters or search keywords. Remember to use ingredients like 'garlic', 'turnip' or 'cabbage'.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="recipes-catalogue-grid">
            {filteredRecipes.map(recipe => (
              <div 
                key={recipe.id}
                id={`recipe-${recipe.id}`}
                className="bg-white rounded-2xl border border-neutral-200 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group text-left"
              >
                {/* Recipe Cover Image */}
                <div className="h-48 overflow-hidden relative bg-neutral-100">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  
                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-xs text-white font-mono text-[8.5px] uppercase tracking-widest px-2 py-0.5 rounded font-bold">
                    {recipe.category}
                  </span>

                  {/* Difficulty Badge */}
                  <span className={`absolute top-3 right-3 text-neutral-950 font-mono text-[8.5px] uppercase tracking-widest px-2 py-0.5 rounded font-black ${
                    recipe.difficulty === 'Easy' ? 'bg-emerald-350 bg-emerald-400' :
                    recipe.difficulty === 'Medium' ? 'bg-amber-400' : 'bg-red-400'
                  }`}>
                    {recipe.difficulty}
                  </span>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-[10px] font-mono tracking-widest text-neutral-300 uppercase font-black">{recipe.arabicTitle}</p>
                    <h3 className="font-serif text-base font-bold text-white tracking-tight line-clamp-1 mt-0.5">{recipe.title}</h3>
                  </div>
                </div>

                {/* Recipe Meta Info strip */}
                <div className="bg-neutral-50 px-4 py-2 border-b border-neutral-100 grid grid-cols-2 gap-2 text-[10px] font-mono text-neutral-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>Ferment: <strong>{recipe.fermentationTime}</strong></span>
                  </span>
                  <span className="flex items-center gap-1 justify-end text-right">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>pH Target: <strong>{recipe.phTarget}</strong></span>
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs text-neutral-500 font-mono font-medium tracking-tight uppercase">
                      Microbe: <span className="text-emerald-800 font-bold italic">{recipe.microbeProfile}</span>
                    </p>
                    <p className="text-xs text-neutral-700 font-serif italic line-clamp-2 leading-relaxed bg-amber-50/60 p-2 rounded-lg border border-amber-100/40">
                      "{recipe.tagline}"
                    </p>
                    <p className="text-xs text-neutral-600 font-light leading-relaxed line-clamp-3">
                      {recipe.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-neutral-400">Salinity: {recipe.salinity}</span>
                    <button
                      onClick={() => setSelectedRecipe(recipe)}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-mono font-bold text-[9.5px] uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                    >
                      <span>Get Recipe Instructions</span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECIPE DETAIL MODAL COMPONENT */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="recipe-detail-modal">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-neutral-200 shadow-2xl flex flex-col text-left">
            
            {/* Modal Header banner */}
            <div className="relative h-44 sm:h-56 shrink-0 bg-neutral-900 text-white">
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                className="w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-all cursor-pointer border border-white/20"
                aria-label="Close modal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>

              <div className="absolute bottom-4 left-6 right-6 space-y-1 text-left">
                <span className="bg-amber-400 text-neutral-950 font-mono text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                  {selectedRecipe.category} RECIPE
                </span>
                <p className="text-xs font-mono text-neutral-300 font-bold uppercase tracking-widest">{selectedRecipe.arabicTitle}</p>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight uppercase">{selectedRecipe.title}</h3>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
              
              {/* Core Specs panel */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-250/50 text-xs font-mono">
                <div className="space-y-1">
                  <span className="text-neutral-400 text-[9px] font-bold uppercase block">Ferment Time</span>
                  <span className="text-neutral-900 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    {selectedRecipe.fermentationTime}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-400 text-[9px] font-bold uppercase block">Difficulty</span>
                  <span className="text-neutral-950 font-bold">{selectedRecipe.difficulty}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-400 text-[9px] font-bold uppercase block">Salinity Range</span>
                  <span className="text-neutral-900 font-bold flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5 text-blue-500" />
                    {selectedRecipe.salinity}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-400 text-[9px] font-bold uppercase block">Safety pH Target</span>
                  <span className="text-emerald-800 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {selectedRecipe.phTarget}
                  </span>
                </div>
              </div>

              {/* Microbiological profile card */}
              <div className="bg-emerald-50 border border-emerald-200/60 p-4 rounded-xl text-xs space-y-1 text-left">
                <p className="font-mono text-[9px] font-extrabold uppercase tracking-widest text-emerald-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Microbe / Probiotic Strains Profile
                </p>
                <p className="font-mono font-bold text-neutral-800 italic text-xs">
                  {selectedRecipe.microbeProfile}
                </p>
                <p className="text-neutral-600 font-light text-[11.5px] leading-relaxed pt-1">
                  These strains are primary lactic acid producers that pre-digest fibers, synthesise vital gut nutrients, produce bacteriocins to crowd out pathogenic decay, and support metabolic defense.
                </p>
              </div>

              {/* Story/Tagline */}
              <p className="text-neutral-700 text-sm leading-relaxed font-light font-serif italic border-l-4 border-amber-400 pl-4">
                "{selectedRecipe.tagline}"
              </p>

              {/* Grid: Ingredients & Steps */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                
                {/* Ingredients column */}
                <div className="md:col-span-5 space-y-3">
                  <h4 className="font-serif font-bold text-neutral-900 text-sm uppercase border-b border-neutral-200 pb-1.5 tracking-tight flex items-center gap-1.5">
                    <span className="text-amber-500">■</span> Ingredients List
                  </h4>
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients.map((ingredient, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-neutral-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Steps column */}
                <div className="md:col-span-7 space-y-3">
                  <h4 className="font-serif font-bold text-neutral-900 text-sm uppercase border-b border-neutral-200 pb-1.5 tracking-tight flex items-center gap-1.5">
                    <span className="text-emerald-700">■</span> Fermentation Steps
                  </h4>
                  <ol className="space-y-4">
                    {selectedRecipe.steps.map((step, idx) => {
                      const splitIdx = step.indexOf(':');
                      const stepTitle = splitIdx !== -1 ? step.slice(0, splitIdx) : `Step ${idx+1}`;
                      const stepText = splitIdx !== -1 ? step.slice(splitIdx + 1) : step;
                      return (
                        <li key={idx} className="space-y-1 text-xs">
                          <p className="font-mono font-bold text-neutral-900 flex items-center gap-1.5">
                            <span className="bg-neutral-900 text-amber-300 w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0">
                              {idx + 1}
                            </span>
                            {stepTitle}
                          </p>
                          <p className="text-neutral-600 font-light leading-relaxed pl-5">
                            {stepText}
                          </p>
                        </li>
                      );
                    })}
                  </ol>
                </div>

              </div>

              {/* Alchemist's Tips Box */}
              <div className="bg-amber-50/55 border border-amber-250 p-4.5 rounded-2xl space-y-2 text-left">
                <p className="font-mono text-[9px] font-black uppercase tracking-widest text-amber-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Alchemist's Bio-Engineering Tip
                </p>
                <p className="text-xs text-neutral-700 font-light leading-relaxed">
                  {selectedRecipe.alchemistTip}
                </p>
              </div>

              {/* Share actions inside Modal */}
              <div className="pt-4 border-t border-neutral-200">
                <ShareActions 
                  headline={`Recipe: ${selectedRecipe.title}`} 
                  excerpt={selectedRecipe.tagline} 
                  linkUrl={`${window.location.origin}/?tab=recipes&recipeId=${selectedRecipe.id}`}
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-neutral-50 px-6 py-4.5 border-t border-neutral-100 flex justify-end">
              <button
                onClick={() => setSelectedRecipe(null)}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[10.5px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Close Recipe
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TWO COLUMN INTERACTIVE FOOTER BLOCK: ALCHEMIST CHATBOT & SAFETY MANUALS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8" id="recipes-interactive-labs-panel">
        
        {/* Left Column: Ask the Alchemist AI Chatbot Mockup */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between text-left relative overflow-hidden" id="alchemist-chatbot-widget">
          
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span>
              ASK ALCHEMIST (AI ADVISOR)
            </span>
            <h3 className="font-serif text-2xl font-light text-neutral-900 uppercase">
              Live <span className="font-semibold text-neutral-950">Microbiome Consulting</span>
            </h3>
            <p className="text-xs text-neutral-500 font-light">
              Stuck on a recipe? Confused about yeast types? Ask our simulated laboratory advisor directly.
            </p>
          </div>

          {/* Chat Window */}
          <div className="border border-neutral-200 rounded-2xl bg-neutral-50/50 p-4 h-64 overflow-y-auto my-5 space-y-4 flex flex-col justify-end text-xs">
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {chatHistory.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3.5 space-y-1 ${
                    msg.role === 'user' 
                      ? 'bg-neutral-900 text-white rounded-br-none' 
                      : 'bg-amber-100/50 border border-amber-250/50 text-neutral-800 rounded-bl-none'
                  }`}>
                    <p className="font-mono text-[8px] tracking-wider uppercase opacity-65 font-bold">
                      {msg.role === 'user' ? 'Your Inquiry' : 'Alchemist'}
                    </p>
                    <p className="leading-relaxed font-light">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isAlchemistTyping && (
                <div className="flex justify-start">
                  <div className="bg-amber-100/40 border border-amber-200 text-neutral-600 rounded-2xl rounded-bl-none p-3 font-mono text-[9.5px]">
                    Alchemist is consulting microbes...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input field */}
          <form onSubmit={handleSendAlchemistMessage} className="flex gap-2.5">
            <input
              type="text"
              placeholder="Ask about Kahm yeast, salt ratios, temperature, bluish garlic..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="flex-1 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-4 bg-amber-400 hover:bg-amber-500 text-neutral-900 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow active:scale-95 shrink-0"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Right Column: PDF Protocol & Probiotic Hygiene Standard Manual */}
        <div className="lg:col-span-5 bg-emerald-950 text-emerald-100 rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left shadow-md" id="recipes-safety-protocols-card">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-[0.2em] block">
                SAFETY & STANDARDS
              </span>
              <h3 className="font-serif text-2xl font-light text-white uppercase">
                Probiotic <span className="font-bold text-amber-400">Hygiene Protocol</span>
              </h3>
            </div>
            
            <p className="text-xs text-emerald-200/80 leading-relaxed font-light">
              Successful lacto-fermentation requires creating a selective environment where lactic acid bacteria thrive while excluding harmful molds.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 text-xs">
                <Thermometer className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono font-bold text-white uppercase text-[10.5px]">Strict Anaerobic Control</p>
                  <p className="text-[11px] text-emerald-200/70 leading-relaxed font-light">
                    Keep veggies submerged beneath brine at all times. Mold can ONLY grow in the presence of free oxygen.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono font-bold text-white uppercase text-[10.5px]">Sterilization & Hygiene</p>
                  <p className="text-[11px] text-emerald-200/70 leading-relaxed font-light">
                    Wash glass jars and weights in boiling water. Never double-dip utensils in your active ferments.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <FileText className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono font-bold text-white uppercase text-[10.5px]">Acidity Target Thresholds</p>
                  <p className="text-[11px] text-emerald-200/70 leading-relaxed font-light">
                    Your ferment must reach an acidic pH of 4.6 or lower within 5 days to guarantee food safety against unwanted pathogens.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => setShowProtocolModal(true)}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-neutral-900 font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-neutral-950" />
              <span>Download Probiotic Protocol (PDF)</span>
            </button>
          </div>

        </div>

      </div>

      {/* PROBIOTIC PROTOCOL DOWNLOAD POPUP MODAL */}
      {showProtocolModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="protocol-download-modal">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 border border-neutral-200 shadow-2xl space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-emerald-800 uppercase tracking-widest block">
                  HAMOD W HARR LAB MANUAL
                </span>
                <h3 className="font-serif text-lg font-bold text-neutral-950 uppercase">
                  Probiotic Fermentation Guidelines
                </h3>
              </div>
              <button
                onClick={() => setShowProtocolModal(false)}
                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 p-1.5 rounded-full cursor-pointer transition-all"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="space-y-4 text-xs text-neutral-700 leading-relaxed font-light">
              <p>
                This protocol has been formulated by the <strong>Hamod W Harr Laboratory Team</strong> to ensure your home-fermented foods are dense in live bacteria cultures and perfectly safe for consumption.
              </p>

              <div className="space-y-3.5 border-l-2 border-emerald-600 pl-4 bg-emerald-50/40 p-3 rounded-r-xl">
                <p className="font-mono font-bold text-emerald-950 text-xs">STANDARD SALINITY GUIDE BY WEIGHT</p>
                <ul className="space-y-1.5 font-mono text-[11px] text-neutral-800">
                  <li>• Cabbages (Kimchi/Kraut): 2.0% - 2.5% sea salt</li>
                  <li>• Pickled Turnips & Beets: 3.0% - 5.0% sea salt</li>
                  <li>• Peppers & Hot Pastes: 3.0% - 3.5% sea salt</li>
                  <li>• Hard Root Vegetables: 2.5% - 3.0% sea salt</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-mono font-bold text-neutral-900 uppercase">1. Sanitizing Hardware</p>
                <p className="text-neutral-600">
                  Boil all glass jars, weights, and stirring rods for 10 minutes. Lactic acid bacteria are resilient, but we must eliminate competing wild yeasts and bad molds before introducing organic cabbage or vegetables.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-mono font-bold text-neutral-900 uppercase">2. Brine Calculation</p>
                <p className="text-neutral-600">
                  Always use uniodized sea salt (like Lebanese sea salt from Anfeh). Standard table salt contains antiseptic iodine and anti-caking compounds that stall fermentation and cloud the brine.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-mono font-bold text-neutral-900 uppercase">3. Anaerobic Submergence</p>
                <p className="text-neutral-600">
                  Use a fermentation glass weight or sanitized stone to press vegetables below the water surface. Oxygen on the surface encourages mold development. If you see Kahm yeast (harmless white wavy film), skim it away immediately.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-neutral-100 justify-end">
              <button
                onClick={() => {
                  alert("Protocol PDF downloaded! (Simulated download successful)");
                  setShowProtocolModal(false);
                }}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow"
              >
                Download PDF Now
              </button>
              <button
                onClick={() => setShowProtocolModal(false)}
                className="px-4 py-2.5 bg-neutral-150 hover:bg-neutral-200 text-neutral-850 font-mono text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-neutral-300"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JULY COUPON POPUP MODAL */}
      {showOfferClaimed && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="coupon-claim-modal">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center border border-neutral-200 shadow-2xl space-y-5">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-mono font-bold">
              ★
            </div>
            
            <div className="space-y-1">
              <p className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest">COUPON REVEALED</p>
              <h3 className="font-serif text-lg font-bold text-neutral-950 uppercase">
                Claim Your July Offer!
              </h3>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Show this code to our stand at Souk El Tayeb or any Hamod W Harr popup store to claim your discount.
              </p>
            </div>

            <div className="bg-neutral-100 border-2 border-dashed border-red-300 p-4 rounded-xl">
              <p className="font-mono font-black text-2xl text-neutral-900 tracking-widest">PROBIOTIC15</p>
              <p className="text-[9px] font-mono text-neutral-400 uppercase mt-1">Get 15% off all retail fermentation jars</p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowOfferClaimed(false)}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow"
              >
                Save Code & Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
