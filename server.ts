import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { requireAuth } from './src/middleware/auth.ts';
import { adminAuth } from './src/lib/firebase-admin.ts';
import {
  getOrCreateUser,
  getBookings,
  createBooking,
  getSubmissions,
  createSubmission
} from './src/db/queries.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Optional user resolver middleware
const resolveUser = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      const dbUser = await getOrCreateUser(decodedToken.uid, decodedToken.email || '');
      req.user = decodedToken;
      req.dbUser = dbUser;
    } catch (error) {
      console.warn('Optional token verification failed:', error);
    }
  }
  next();
};

app.use(resolveUser);

// Seed database on startup if empty
async function seedDatabaseIfEmpty() {
  try {
    const existingBookings = await getBookings();
    if (existingBookings.length === 0) {
      console.log('Seeding initial bookings in Cloud SQL...');
      await createBooking({
        name: 'Sarah Jenkins',
        email: 'sarah@urbanroots.com',
        businessName: 'Urban Roots Cafe',
        packageName: 'Local Domination Package',
        scheduledDate: '2026-07-12',
        scheduledTime: '10:00 AM',
      });
      await createBooking({
        name: 'Mark Miller',
        email: 'mark@millerhomes.com',
        businessName: 'Miller & Co Real Estate',
        packageName: 'Standard Boost Package',
        scheduledDate: '2026-07-15',
        scheduledTime: '02:30 PM',
      });
    }

    const existingSubmissions = await getSubmissions();
    if (existingSubmissions.length === 0) {
      console.log('Seeding initial submissions in Cloud SQL...');
      await createSubmission({
        businessName: 'Sprout Wellness',
        businessType: 'Boutique Fitness Studio',
        designPreference: 'Minimalist & Organic',
        keyFeatures: ['Online Class Booking', 'Trainer Bios', 'Testimonials Carousel'],
        primaryColor: '#2E5A44',
        email: 'hello@sproutwellness.com',
      });
    }
  } catch (err) {
    console.error('Failed to seed database:', err);
  }
}

seedDatabaseIfEmpty();


// Lazy Gemini AI Client Initialization
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in the environment variables.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// REST API Endpoints

// Authentication Sync Endpoint
app.post('/api/auth/sync', requireAuth, async (req: any, res) => {
  try {
    const dbUser = await getOrCreateUser(req.user.uid, req.user.email || '');
    res.json(dbUser);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 1. Get All Bookings (filtered if user authenticated, else gets all)
app.get('/api/bookings', async (req: any, res) => {
  try {
    const userId = req.dbUser ? req.dbUser.id : undefined;
    const items = await getBookings(userId);
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Create New Booking
app.post('/api/bookings', async (req: any, res) => {
  const { name, email, businessName, packageName, scheduledDate, scheduledTime } = req.body;
  if (!name || !email || !businessName || !packageName || !scheduledDate || !scheduledTime) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const userId = req.dbUser ? req.dbUser.id : undefined;
    const newBooking = await createBooking({
      name,
      email,
      businessName,
      packageName,
      scheduledDate,
      scheduledTime,
      userId
    });
    res.status(201).json(newBooking);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get Form Submissions (filtered if user authenticated, else gets all)
app.get('/api/submissions', async (req: any, res) => {
  try {
    const userId = req.dbUser ? req.dbUser.id : undefined;
    const items = await getSubmissions(userId);
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Submit Design Form
app.post('/api/submissions', async (req: any, res) => {
  const { businessName, businessType, designPreference, keyFeatures, primaryColor, email } = req.body;
  if (!businessName || !businessType || !designPreference || !email) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  try {
    const userId = req.dbUser ? req.dbUser.id : undefined;
    const newSubmission = await createSubmission({
      businessName,
      businessType,
      designPreference,
      keyFeatures: Array.isArray(keyFeatures) ? keyFeatures : [],
      primaryColor: primaryColor || '#1A365D',
      email,
      userId
    });
    res.status(201).json(newSubmission);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Chatbot Booking & Q&A
app.post('/api/gemini/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const ai = getGeminiClient();
    
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        ...formattedHistory,
        { text: message }
      ],
      config: {
        systemInstruction: `You are the LEE INTEGRATIONS AI Concierge, built to represent 'LEE INTEGRATIONS' (Slogan: 'INNOVATE SMARTER').
LEE INTEGRATIONS is a high-tech multi-system integration agency that provides:
1. Premium custom Web Design (Standard Boost, Premium Domination, and Custom Enterprise Portals).
2. Google Business Profile (GBP) Local SEO Management (including Gemini automated review responder suites).
3. Professional 4K Drone photography and cinematic video reel capturing.
4. Comprehensive organic Local SEO authority building campaigns.

Your goal is to answer questions about these services, explain our interactive package builder, help them select appropriate tiers, and guide them to secure a consultation or proposal.
Always be polite, modern, structured, and speak with high-tech professional composure.

OUR MODULAR SERVICES CONFIGURATION:
- Web Design: Tier 1 ($499 - Landing page), Tier 2 ($1,299 - 5-Page Bento Suite), Tier 3 ($2,499 - Enterprise Custom Portal)
- Google Business Profile (GBP) Optimization: Tier 1 ($199), Tier 2 ($399), Tier 3 ($699)
- Drone Media: Tier 1 ($299), Tier 2 ($599), Tier 3 ($999)
- Local SEO Campaigns: Tier 1 ($249), Tier 2 ($499), Tier 3 ($899)

BUNDLE DISCOUNTS ACTIVE:
- Select any 2 systems: 10% Off
- Select any 3 systems: 15% Off
- Select all 4 systems: 25% Off Full Domination!

APPOINTMENT BOOKING & PROPOSALS:
- Guide users to use the live Interactive Service Package Builder tab in the navigation menu to customize and lock in their pricing.
- If they specify contact details and desired tiers in chat, confirm the custom calculations and explain that the live builder is ready.
Keep answers friendly and concise. Use clean spacing and bullet points.`,
      },
    });

    res.json({ reply: response.text });
  } catch (err: any) {
    console.error('Chat Gemini error:', err);
    res.json({ 
      reply: "I'd love to help you with that! LEE INTEGRATIONS offers premium systems web design, local SEO, and professional drone media. (AI Concierge is running in offline demo mode. Feel free to customize your package and book directly using our custom Suite Configurator!)" 
    });
  }
});

// 6. Template Branding Generator
app.post('/api/gemini/branding', async (req, res) => {
  const { businessName, businessType, designPreference } = req.body;
  if (!businessName || !businessType) {
    return res.status(400).json({ error: 'Business name and type are required' });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Generate a sleek business branding package for:
Business Name: "${businessName}"
Business Type: "${businessType}"
Vibe/Style Preference: "${designPreference || 'Modern & Elegant'}"

Provide a JSON object containing:
- tagline: A catchy modern marketing tagline (string)
- description: A professional 2-3 sentence business description (string)
- heroTitle: Engaging big heading for their new home page (string)
- heroSubtitle: Captivating subtitle for the home page (string)
- aboutHeader: Catchy title for About section (string)
- aboutText: A premium "About Us" story tailored to their vibe (string)
- services: Array of 3 key service titles with a 1-sentence description each (array of strings)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT' as any,
          properties: {
            tagline: { type: 'STRING' as any },
            description: { type: 'STRING' as any },
            heroTitle: { type: 'STRING' as any },
            heroSubtitle: { type: 'STRING' as any },
            aboutHeader: { type: 'STRING' as any },
            aboutText: { type: 'STRING' as any },
            services: {
              type: 'ARRAY' as any,
              items: { type: 'STRING' as any }
            }
          },
          required: ['tagline', 'description', 'heroTitle', 'heroSubtitle', 'aboutHeader', 'aboutText', 'services']
        }
      }
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    console.error('Branding Gemini error:', err);
    // Fallback branding values
    res.json({
      tagline: `Elevate Your Presence with ${businessName}`,
      description: `A premium ${businessType} dedicated to delivering top-tier experiences styled in ${designPreference || 'modern elegance'}.`,
      heroTitle: `Reimagine What's Possible`,
      heroSubtitle: `Modern solutions tailored precisely for your business needs.`,
      aboutHeader: `Crafting Premium Experiences`,
      aboutText: `Our passion is bringing outstanding craftsmanship to everything we touch. We design, innovate, and create experiences that leave lasting impressions.`,
      services: [
        'Premium Experience Design - Unmatched attention to detail in every component.',
        'Seamless Local Optimization - Built from the ground up to attract and engage local customers.',
        'Stunning Visual Identity - Clean typography and curated visual assets that stand out.'
      ]
    });
  }
});

// 7. Onboarding Email Sequence Generator (based on submissions)
app.post('/api/gemini/email-sequence', async (req, res) => {
  const { businessName, businessType, designPreference, keyFeatures, primaryColor, email } = req.body;
  if (!businessName || !businessType) {
    return res.status(400).json({ error: 'Business name and type are required' });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Create a 3-part automated onboarding email sequence for a client who just submitted their web design onboarding questionnaire (Google Forms).
Details:
- Client Business: "${businessName}" (${businessType})
- Vibe Style: "${designPreference || 'Sleek & Professional'}"
- Requested Features: ${JSON.stringify(keyFeatures || [])}
- Contact Email: "${email || 'client@business.com'}"
- Selected Brand Color Accent: "${primaryColor || '#1E3A8A'}"

Provide a JSON object containing:
- email1: { subject: string, body: string } -> Instant confirmation email. Thanks them for submitting, summarizes what they requested, and sets expectations (first draft ready in 48h).
- email2: { subject: string, body: string } -> Sent 24h later. Explains our branding process, visual direction, and requests high-res photography assets or specifies we will handle it with drone media.
- email3: { subject: string, body: string } -> Sent 48h later. Invites them to their live design feedback session and introduces them to their Local SEO dashboard.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT' as any,
          properties: {
            email1: {
              type: 'OBJECT' as any,
              properties: {
                subject: { type: 'STRING' as any },
                body: { type: 'STRING' as any }
              },
              required: ['subject', 'body']
            },
            email2: {
              type: 'OBJECT' as any,
              properties: {
                subject: { type: 'STRING' as any },
                body: { type: 'STRING' as any }
              },
              required: ['subject', 'body']
            },
            email3: {
              type: 'OBJECT' as any,
              properties: {
                subject: { type: 'STRING' as any },
                body: { type: 'STRING' as any }
              },
              required: ['subject', 'body']
            }
          },
          required: ['email1', 'email2', 'email3']
        }
      }
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    console.error('Email Sequence Gemini error:', err);
    res.json({
      email1: {
        subject: `Form Received! Let's build ${businessName} together 🚀`,
        body: `Hi there,\n\nThank you so much for completing your website design questionnaire! We have successfully received your preferences for "${businessName}" as a premium "${businessType}".\n\nWe noted your preference for a "${designPreference}" look-and-feel with features like ${keyFeatures?.join(', ') || 'Online Bookings'}.\n\nOur design architects are already mapping out your custom mockups, and we'll have your first interactive draft ready in 48 hours!\n\nBest regards,\nThe AeroSite Team`
      },
      email2: {
        subject: `Visual Directions & Assets for ${businessName} 📸`,
        body: `Hi there,\n\nAs we work on the design layouts for your new business portal, we wanted to request any professional images, team photos, or brand logos you'd like us to weave in.\n\nSince visual storytelling is everything, remember that we also offer professional drone media photography to showcase your physical business workspace or local event spaces! Let us know if you'd like to bundle a media shoot.\n\nTalk soon,\nAeroSite Creative Studio`
      },
      email3: {
        subject: `Your Interactive Draft is Ready! Let's Review 💻`,
        body: `Hi there,\n\nExciting news! The initial design concepts and core structure for "${businessName}" are compiled on our dev servers.\n\nLet's schedule a brief 15-minute screen share session to review the layout, customize the branding colors, and discuss deploying your Google Business Profile & Local SEO configuration.\n\nClick the scheduler link in our website dashboard to select your preferred time slot!\n\nWarmly,\nAeroSite Studio Support`
      }
    });
  }
});

// 8. GBP Review Reply Generator
app.post('/api/gemini/reply-review', async (req, res) => {
  const { reviewText, rating, author } = req.body;
  if (!reviewText) {
    return res.status(400).json({ error: 'Review text is required' });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Write a professional, search-engine-optimized, warm, and appropriate owner response to a Google Business Profile review.
Review Author: "${author || 'A valued customer'}"
Rating: ${rating || 5} Stars
Review Text: "${reviewText}"

Guidelines:
- If positive, express gratitude, mention our dedication, and subtly reference standard keywords like 'professional service', 'outstanding experience'.
- If negative, remain polite, understanding, invite them to contact us directly via email (support@company.com) to resolve it, and keep the tone professional.
Keep the reply under 120 words. No placeholders like "[Your Name]" - sign off as "The Owner".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    res.json({ reply: response.text });
  } catch (err: any) {
    console.error('Review Reply Gemini error:', err);
    res.json({
      reply: `Thank you so much, ${author || 'valued customer'}, for your feedback! We always strive to provide a top-notch professional experience. We look forward to working with you again! - The Owner`
    });
  }
});

// Express serving configuration (Vite middleware or Static output)
const startServer = async () => {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
