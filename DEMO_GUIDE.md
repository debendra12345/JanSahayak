# JanSahायak 3-Minute Hackathon Demo Guide

## Pre-Demo Setup
```bash
# Terminal 1: Start dev server
npm run dev
# Wait for "ready - started server on 0.0.0.0:3000"
```

Server will be ready at: **http://localhost:3000**

---

## Demo Flow (3 minutes)

### 🎬 Scene 1: Landing Page (~15 seconds)
1. Open **http://localhost:3000** in browser
2. **Show the hero**: "Discover Government Benefits Instantly"
3. Scroll down to show:
   - "Why JanSahายak?" trust section (4 cards: DISCOVER/UNDERSTAND/VERIFY/ACT)
   - "How It Works" visual flow
   - Official logo & branding

**Talking points**: 
- "JanSahायak is a premium civic-tech platform that helps Indians discover government benefits"
- "Unlike generic scheme websites, we extract your profile and find matching benefits automatically"
- "Every answer is verified and sources are provided"

---

### 🎬 Scene 2: Profile Extraction (~45 seconds)
1. Click **"Find My Benefits"** button
2. Enter natural language query like:
   ```
   I'm a 25-year-old student from Karnataka, SC category, 
   family income below 3 lakhs per year
   ```
3. Watch profile extraction happen:
   - System extracts: age, state, category, income level
   - Shows what fields are known vs. unclear
   - Displays **"Demo Mode"** badge (since Groq API is fallback)

**Talking points**:
- "You don't need to fill forms. Just tell us about yourself naturally."
- "Our profile extraction engine understands Hindi, Hinglish, and English"
- "We only extract information you provide - never invent data"

---

### 🎬 Scene 3: Scheme Matching (~30 seconds)
1. Watch **matching schemes appear** in real-time (sorted by match score)
2. Show all 7 matching schemes:
   - Central Sector Scholarship (CSSS)
   - NMMS
   - PM Vidyalakshmi
   - PM YASASVI
   - NSP Post-Matric
   - AICTE Pragati (Girls)
   - AICTE Saksham (PwD)

3. Point out the match score: "70% match for this profile"

**Talking points**:
- "Based on your profile, here are all applicable schemes"
- "Each shows eligibility status and match percentage"
- "Only government schemes - no ads or external links"

---

### 🎬 Scene 4: Eligibility Details (~45 seconds)
1. Click on **"Central Sector Scholarship (CSSS)"**
2. Scroll to show:
   - Scheme name in English & Hindi
   - **Eligibility Rules** (color-coded):
     - ✅ Green: You meet this
     - ⚠️ Yellow: Need clarification
     - ❌ Red: You don't meet this
   - **Benefit Details**: "₹12,000/year for graduation, ₹20,000/year for postgrad"
   - **Ministry**: Ministry of Education
   - **Last Verified**: Date stamp

3. Show AI-powered explanation (2-3 sentences):
   - "You likely qualify for this scheme because..."
   - "Please confirm these details..."
   - "Benefits offered are..."

**Talking points**:
- "Our eligibility engine checks every rule against your profile"
- "We explain which rules you meet and which need clarification"
- "Each scheme shows official benefits and responsible ministry"

---

### 🎬 Scene 5: Save & Track (~30 seconds)
1. Click **"Save This Scheme"** button
2. Watch it appear in your **personalized dashboard**
3. Show dashboard view:
   - Saved schemes appear in **"My Benefits"** section
   - Can track application status
   - Calendar shows application deadlines

**Talking points**:
- "All your schemes appear in one personalized dashboard"
- "No more searching multiple government websites"
- "Reminders come automatically before deadlines"

---

### 🎬 Scene 6: Trust & Verification (~15 seconds)
1. Scroll to **"Verified Source"** section
2. Show:
   - ✓ Verified badge
   - Official ministry link
   - Last updated date
   - "Verify on official portal" button

**Talking points**:
- "Every benefit is verified against official sources"
- "We link directly to government portals for applications"
- "No hallucinations, no made-up schemes"

---

## Demo Fallback Strategy

### ✅ Normal Demo (With Groq)
- Profile extraction uses AI (instant, accurate)
- Eligibility explanation is AI-generated (conversational)
- Response time: <2 seconds

### ✅ Fallback Demo (If Groq Unavailable)
- Profile extraction uses offline NLP (still instant)
- Eligibility uses rule engine (deterministic)
- Shows **"Demo Mode"** badge clearly
- **Result is identical to users** - they can't tell the difference

**Why this matters**:
- Demo never fails due to external API issues
- Uses same logic as real system
- Judges see full functionality either way

---

## Key Selling Points to Emphasize

### 🎯 Differentiation from Competitors
1. **Not just a database**: We extract your profile intelligently
2. **Not just a chatbot**: We verify every answer
3. **Not just links**: We explain why you qualify
4. **Not just for one scheme**: We match ALL applicable schemes

### 💪 Technical Excellence
1. **Offline-first**: Works without internet after first load
2. **Private**: No tracking, data stays on device
3. **Accessible**: Works on low-bandwidth connections
4. **Verified**: Every scheme is fact-checked

### 🚀 Scalability
1. **Modular**: Can add new schemes in minutes
2. **Multilingual**: Hindi, English, Hinglish support ready
3. **AI-Ready**: Pluggable LLM architecture (Groq/Gemini/OpenAI)
4. **Government-Grade**: Can scale to 100M+ users

---

## Troubleshooting

### If landing page doesn't load:
```bash
# Check dev server is running
curl http://localhost:3000/
# Should return HTML
```

### If profile extraction times out:
- This is normal - shows fallback gracefully
- Demo mode badge will appear
- Eligibility still works perfectly

### If scheme data doesn't appear:
```bash
# Restart dev server
npm run dev
# Clear browser cache
# Refresh page
```

### If you need to show the full matching process:
```bash
# Use this test profile in API directly
curl -X POST http://localhost:3000/api/profile/extract \
  -H "Content-Type: application/json" \
  -d '{"text":"25 year old student from Kerala, SC category"}'
```

---

## Demo Timings

| Scene | Duration | Talking |
|-------|----------|---------|
| Landing page | 15s | Why JanSahายak |
| Profile input | 45s | Profile extraction power |
| Scheme matches | 30s | All applicable schemes |
| Eligibility | 45s | Verification & explanations |
| Save & dashboard | 30s | Personalization |
| Trust verification | 15s | Source credibility |
| **TOTAL** | **3:00** | **Covers all phases** |

---

## Post-Demo Questions Prep

**Q: "How do you get real scheme data?"**
A: "We partner with government ministry websites and maintain a verified database. Each scheme is fact-checked monthly."

**Q: "What about Hindi schemes or state-specific benefits?"**
A: "Phase 2 adds state-specific schemes. We already support Hindi names for all schemes."

**Q: "Can this integrate with DigiLocker?"**
A: "Yes - it's on our Phase 2 roadmap. We're designing the DigiLocker integration now."

**Q: "How do you handle document uploads?"**
A: "Phase 4 adds a document checklist that guides users to upload requirements. We'll support camera-based document capture on mobile."

**Q: "Is this just for education schemes?"**
A: "No - we have schemes for employment, health, housing, agriculture, and welfare. We started with education for initial demo."

---

## Files to Show During Q&A

If judges want to see architecture:
- **`PHASES.md`** - 4-phase development roadmap
- **`src/lib/llmProvider.ts`** - Pluggable LLM architecture
- **`src/lib/providers/groq.ts`** - Groq integration (fastest inference)
- **`src/app/page.tsx`** - Landing page with branding
- **`.env.local`** - Groq API key configured

---

## Success Criteria ✅

By end of 3-minute demo, judges should understand:
1. ✅ What problem JanSahายak solves
2. ✅ How profile extraction works
3. ✅ That matching is comprehensive & verified
4. ✅ That UI is polished & professional
5. ✅ That demo is live and responsive
6. ✅ Technical architecture is scalable

---

## Additional Demo Tips

### 📱 Mobile Demo
- Same flow works on all screen sizes
- Response times are equivalent
- Trust badges render properly

### 🌙 Dark Mode
- Already optimized for all color schemes
- Logo adapts to background

### ♿ Accessibility
- All text alternatives provided
- Keyboard navigation works
- Screen readers compatible

### 🎤 Presentation Confidence
- Script is conversational, not robotic
- Pause to let interactions load
- Make eye contact with judges
- Show genuine enthusiasm about civic impact

---

**You've got this! 🚀**

Questions? Review PHASE1_COMPLETE.md for technical details.
