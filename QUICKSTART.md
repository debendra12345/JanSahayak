# 🚀 Quick Start - Janसहायक Hackathon Demo

## Prerequisites
- Node.js 18+ (check with `node --version`)
- npm (usually comes with Node.js)

## Setup (One-time)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Wait for message: "ready - started server on 0.0.0.0:3000"
# Open browser to http://localhost:3000
```

## Running the Demo

### Fastest Path (~3 minutes)
1. Open [http://localhost:3000](http://localhost:3000) in browser
2. Follow `DEMO_GUIDE.md` script for timing and talking points
3. Use test profile: *"I'm a 25-year-old student from Kerala, SC category"*

### Using Groq API (Optional - For Fastest LLM)
If you have the Groq API key, add to `.env.local`:
```
GROQ_API_KEY=<api-key>
```
Then restart the dev server:
```bash
npm run dev
```

Profile extraction will use Groq (instant), but **demo works perfectly without it too**.

### Using Gemini API (Optional - Alternative)
If you prefer Gemini instead of Groq:
```
GEMINI_API_KEY=your-key-here
```

## What Works Without Any API Key

✅ Profile extraction (uses offline NLP)  
✅ Scheme matching (deterministic rules)  
✅ Eligibility explanations (template-based)  
✅ Save to dashboard  
✅ Full end-to-end demo flow  

**Perfect for judges** - zero external dependencies, never fails.

## Folder Structure

```
Jan-/
├── DEMO_GUIDE.md          ← Read this before demo!
├── PHASE1_COMPLETE.md     ← What was built
├── PHASES.md              ← Full 4-phase roadmap
├── src/
│   ├── app/page.tsx       ← Landing page
│   ├── lib/
│   │   └── llmProvider.ts ← LLM abstraction (Groq/Gemini/Fallback)
│   └── components/
│       └── Navbar.tsx     ← Branded header
└── public/
    └── jansahayak-logo.png ← Official logo
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `lsof -i :3000` (Mac) or `netstat -ano \| findstr :3000` (Windows) |
| Slow first load | First build takes 5-10s. Subsequent loads are instant. |
| Profile not extracting | Works offline! Might be using fallback deterministically. Check browser console. |
| Schema data missing | Database auto-initializes. Refresh page. |

## Documentation Map

| File | Purpose |
|------|---------|
| `DEMO_GUIDE.md` | **Read first** - 3-min demo script with timings |
| `PHASE1_COMPLETE.md` | What was built in Phase 1 |
| `PHASES.md` | Full roadmap for Phases 1-4 |
| `src/lib/llmProvider.ts` | How LLM providers plug in |
| `.env.example` | All configuration options |

## Ready to Demo? 

```bash
# 1. Terminal
npm run dev

# 2. Browser
http://localhost:3000

# 3. Reference
DEMO_GUIDE.md
```

**You've got this! 🎯**

---

Questions? Check the relevant docs above or review `PHASES.md` for technical architecture.
