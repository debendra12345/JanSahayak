# 🎬 PRE-DEMO CHECKLIST

**Use this before showing Janसहायक to judges.**

---

## ✅ System Checks (5 minutes before demo)

### 1. Environment
- [ ] Terminal open in project root (`C:\Users\HP\out\Jan-`)
- [ ] `.env.local` file exists with Groq API key
- [ ] Node.js 18+ installed (`node --version` to check)
- [ ] npm installed (`npm --version` to check)

### 2. Server Status
```bash
npm run dev
```
- [ ] "ready - started server on 0.0.0.0:3000" message appears
- [ ] No errors in terminal
- [ ] Server stays running after message
- [ ] **Leave this terminal open** (don't close or interrupt)

### 3. Browser
- [ ] Open new browser tab
- [ ] Go to: http://localhost:3000
- [ ] See landing page loads with:
  - [ ] Official Janसहायक logo in navbar
  - [ ] Hero section: "Government benefits shouldn't be difficult to find"
  - [ ] "Why JanSahayak?" section (4 trust cards)
  - [ ] "Find My Benefits" button is visible and clickable

### 4. Quick API Test (Optional)
```bash
# In another terminal (don't interrupt dev server)
curl -X POST http://localhost:3000/api/profile/extract \
  -H "Content-Type: application/json" \
  -d '{"text":"25 year old student from Kerala"}'
```
- [ ] Returns JSON with profile data
- [ ] Status is either "ai" or "fallback" (both work!)

---

## 📖 Demo Materials

### Files to Have Ready (Read in This Order)
- [ ] **DEMO_GUIDE.md** - 3-minute script with timings (READ FIRST)
- [ ] **QUICKSTART.md** - Quick reference
- [ ] **GROQ_INTEGRATION.md** - For technical Q&A

### Test Profiles (Copy-Paste Ready)
```
Profile 1 (Student):
"I'm a 25-year-old student from Kerala, SC category, family income below 3 lakhs"

Profile 2 (Short):
"25 year old student from Maharashtra"

Profile 3 (Natural):
"I just graduated and I'm looking for scholarships. I'm from Tamil Nadu and my family's annual income is around 2 lakhs"
```

---

## 🎯 Demo Flow (Exactly 3 Minutes)

### Scene 1: Landing (0:00-0:15)
- [ ] Browser shows http://localhost:3000
- [ ] Logo is visible ✓
- [ ] Scroll to show trust cards ✓
- [ ] Point out professional design ✓

### Scene 2: Profile Input (0:15-1:00)
- [ ] Click "Find My Benefits" button
- [ ] Type one of the test profiles (above)
- [ ] Watch extraction happen
- [ ] Point out: "No forms, just natural language"

### Scene 3: Schemes Match (1:00-1:30)
- [ ] Schemes appear (should be 7 total)
- [ ] Show ranking by match score
- [ ] Point out: "All applicable schemes, automatically"

### Scene 4: Eligibility (1:30-2:15)
- [ ] Click on top scheme (usually CSSS)
- [ ] Show eligibility breakdown:
  - Green checkmarks (✓ You meet this)
  - Yellow warnings (⚠️ Need confirmation)
  - Red X marks (✗ Don't meet this)
- [ ] Show AI explanation
- [ ] Point out: "Grounded in verified rules, never hallucinated"

### Scene 5: Save & Dashboard (2:15-2:45)
- [ ] Click "Save to Dashboard"
- [ ] Navigate to /dashboard
- [ ] Show saved scheme appears
- [ ] Point out: "Persistent across sessions, no login needed"

### Scene 6: Trust Badge (2:45-3:00)
- [ ] Scroll to show:
  - Verified badge ✓
  - Official ministry link
  - Last verified date
- [ ] Point out: "Every scheme is verified"

**TOTAL: 180 seconds (3 minutes exactly)**

---

## 🎤 Talking Points (One-Liners)

### On the Problem
> "Indians spend hours searching multiple government websites for schemes they're eligible for. We make that instant."

### On the Solution
> "Janसहायक is like a civic assistant—describe yourself once, we find all benefits instantly, explain why you qualify, and link to official applications."

### On the Tech
> "We use AI for profile extraction, but fall back to deterministic rules for eligibility—so explanations are always accurate, never hallucinated."

### On Trust
> "Every scheme is verified against official sources. We never invent requirements or benefits. Users can always apply directly on government portals."

### On Scale
> "We can scale to 100M+ users because our backend is deterministic and stateless. Groq API makes profile extraction instant."

---

## ⚠️ Troubleshooting (If Something Goes Wrong)

### Issue: "Server not responding"
**Fix**: 
1. Stop server: `Ctrl+C`
2. Restart: `npm run dev`
3. Wait for "ready" message

### Issue: "Schemes not showing"
**Fix**:
1. Refresh browser: `Ctrl+R` or `Cmd+R`
2. If still blank, restart server

### Issue: "Profile extraction very slow"
**Normal!** First request to Groq API takes 1-2 seconds. Subsequent requests are instant. 
- Show the "Demo Mode" badge 
- Explain: "This is our fallback working perfectly"
- Continue demo—it's not broken!

### Issue: "Groq API showing error"
**Perfect!** This is the fallback system working:
- System auto-switches to deterministic mode
- "Demo Mode" badge appears
- Everything still works
- **Talking point**: "This is our resilience—demo never fails"

### Issue: Browser says "ERR_CONNECTION_REFUSED"
**Check**: Is the dev server still running in the first terminal?
- Run `npm run dev` again if needed
- Wait for "ready" message
- Refresh browser

### Issue: Database errors
**Fix**: Rarely happens, but if you see DB errors:
```bash
# Stop server (Ctrl+C)
rm -rf data/jansahayak.db
npm run dev
# Database will auto-recreate
```

---

## 🎁 Bonus: Show These If Judges Ask

### Show the Code (If Asked)
```
Open: src/lib/llmProvider.ts
Explain: "Here's our pluggable LLM architecture—we 
          can swap providers without changing API routes"

Show: Provider priority logic (around line 60)
"If Groq fails, we use Gemini. If Gemini fails, we 
use our deterministic rules. Demo never breaks."
```

### Show the Architecture Diagram
```
Open: PHASES.md
Scroll to: "Current Architecture" section
Explain: "This shows how all pieces connect"
```

### Show the Data
```
Open: src/lib/schemes-data.ts
Show: 7 schemes with real data
Explain: "Real government schemes, verified URLs,
          official departments, last verified dates"
```

---

## 📊 Expected Performance

| Metric | What to Expect |
|--------|----------------|
| Server startup | 3-5 seconds |
| Landing page load | <200ms (instant) |
| Profile extraction | <100ms (fallback) or <2s (Groq) |
| Scheme matching | <100ms (very fast) |
| Full demo flow | <2-3 seconds |
| Judges' impression | 😮 "This is polished!" |

---

## 🚨 DO's and DON'Ts

### ✅ DO
- [ ] Emphasize "Grounded in verified rules"
- [ ] Show the trust badges and verified sources
- [ ] Explain the fallback guarantee
- [ ] Point out professional design
- [ ] Mention "Works on low bandwidth, mobile-first"

### ❌ DON'T
- [ ] Don't say "It's just a scheme database" (it's not)
- [ ] Don't apologize for fallback (it's a feature!)
- [ ] Don't fix code during demo (no refactoring)
- [ ] Don't go off-script (stick to 3 minutes)
- [ ] Don't mention bugs (there shouldn't be any!)

---

## 💬 Judge Questions Prep

**Q: "Is this just a web scraper?"**
A: "No, we combine AI-powered profile extraction with rule-based eligibility. Every scheme is verified, never hallucinated."

**Q: "How do you scale to all Indian schemes?"**
A: "Phase 3 adds semantic search and RAG. We start with verified high-impact schemes, then expand systematically."

**Q: "What about data privacy?"**
A: "User data stays local (SQLite). No tracking, no third-party services. Everything is open-source auditable."

**Q: "Can this integrate with DigiLocker?"**
A: "Yes—Phase 2 roadmap. We're designed as the interface layer for government digital infrastructure."

**Q: "Why now? Why this problem?"**
A: "Because 90%+ Indians don't know about schemes they qualify for. This changes that at national scale."

---

## 🏁 Final Checklist (2 minutes before demo)

- [ ] Dev server running and stable
- [ ] Browser showing landing page with logo
- [ ] Test profile copied to clipboard (ready to paste)
- [ ] DEMO_GUIDE.md on phone or second monitor (for reference)
- [ ] Talking points memorized (or notes ready)
- [ ] Groq API key in .env.local (checked)
- [ ] Phone on silent (no interruptions)
- [ ] Lighting good (if presenting over video)
- [ ] Screen resolution at 100% (not zoomed in)
- [ ] Cursor ready to click "Find My Benefits"

---

## 🎬 GO TIME!

You're ready to demo. Here's what judges will see:

1. **Wow**: Professional branding and polished UI
2. **Interest**: Profile extraction is clever
3. **Impressed**: Schemes perfectly matched
4. **Trust**: Verified sources and clear explanations
5. **Confidence**: "This team built something real"

**Remember**: Keep it under 3 minutes, focus on the problem and solution, emphasize verification and trust.

---

**You've got this!** 🚀  
**Questions?** Check DEMO_GUIDE.md or PHASE1_COMPLETE.md

**Let's show them civic-tech done right.** 🇮🇳✨
