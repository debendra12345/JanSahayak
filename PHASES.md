# JanSahayak — Phased Development Plan

## PHASE OVERVIEW

The current `Jan-` repository has a basic **working MVP** with:
- Landing page ✓
- Profile extraction (offline + AI fallback) ✓
- Scheme matching engine ✓
- Dashboard & tracking ✓
- Responsive UI ✓

This document outlines **Phase 1-4** enhancements that will transform it into the **full JanSahayak platform** per the master spec.

---

## CURRENT STATE AUDIT

### Working Features (Do Not Break)
- Next.js + TypeScript + Tailwind foundation
- SQLite local database (auto-migrating)
- API endpoints: `/api/profile/extract`, `/api/schemes/match`, `/api/schemes/[id]/explain`
- Offline profile extraction parser (Fallback mode)
- Eligibility rule engine (deterministic)
- Scheme matching & scoring
- Saved applications & status tracking
- Mobile-responsive UI

### What's Missing (Spec vs. Current)
1. **No RAG layer** — schemes are hardcoded, not semantically searchable
2. **No Gemini/LLM integration** — only OpenAI (and only if key is set)
3. **No premium trust/verification UI** — minimal source labelling
4. **No professional landing/onboarding** — basic hero, no trust section
5. **No demo mode** — no graceful LLM fallback clearly labelled
6. **No PostgreSQL/pgvector** — using SQLite (workable for MVP, won't scale)
7. **No auth system** — all users share one implicit profile
8. **No document checklist component** — docs just listed
9. **No multi-step application guidance** — no "guided application" flow
10. **No proper logo integration** — logo exists but not fully branded
11. **No "DISCOVER → UNDERSTAND → VERIFY → APPLY → TRACK" visual flow**
12. **No admin/dashboard for scheme management**

---

## PHASE 1: BRANDING & FOUNDATION (1-2 days)

### Goals
- Integrate proper JanSahayak branding (logo, colors, typography)
- Upgrade UI to "premium civic-tech" look per spec
- Create landing page trust section
- Implement graceful LLM fallback with clear labelling
- Prepare for Gemini integration

### Deliverables

1. **Logo & Branding**
   - Move `hello.jpg` → `public/logo.png`
   - Create Navbar with official logo + tagline "Your Personal Civic Assistant"
   - Update brand colors: navy (#001f3f), white, saffron (#FF6B35), green (#00A86B)
   - Update all text references from generic to "JanSahayak"

2. **Landing Page Enhancement**
   - Add "Why JanSahayak?" trust section (DISCOVER / UNDERSTAND / VERIFY / ACT)
   - Add visual "How It Works" flow diagram
   - Add "Built for" section: Students | Women | Senior Citizens
   - Improve hero messaging to match spec

3. **LLM Provider Abstraction**
   - Create `src/lib/llmProvider.ts` (base interface)
   - Create `src/lib/providers/gemini.ts` (Gemini API implementation)
   - Create `src/lib/providers/fallback.ts` (deterministic demo mode)
   - Update `.env.example` with `GEMINI_API_KEY`
   - Integrate into profile extraction & explanation

4. **LLM Fallback UI**
   - When using fallback, label responses clearly: "⚡ Demo Explanation (using scheme rules)"
   - Show badge distinguishing AI vs. rule-based
   - Add "Learn More About LLM Architecture" link in footer

5. **Professional Error States**
   - Implement detailed error boundaries
   - Add friendly messages for all failure scenarios
   - No raw stack traces to users

### Acceptance Criteria
- Landing page looks "premium civic-tech" per spec
- Logo appears in navbar
- Gemini can be configured (but not required for demo)
- All existing functionality still works
- Tests pass

---

## PHASE 2: AUTHENTICATION & PROFILES (2-3 days)

### Goals
- Implement proper user accounts (optional Google Auth)
- Move from implicit/cookie-based to explicit user profiles
- Enable multi-user dashboard
- Prepare for document uploads & tracking

### Deliverables

1. **Authentication**
   - Implement Firebase Auth OR JWT-based auth
   - Sign up / Sign in / Logout flows
   - Optional Google Sign-In
   - Guest mode: allow non-auth users to explore

2. **User Profile Model**
   - Extend database with `users` table
   - Create user profile CRUD endpoints
   - Move saved schemes & applications to per-user (not per-browser-cookie)

3. **Dashboard Personalization**
   - Show "Welcome, [Name]" greeting
   - Show profile completeness indicator
   - Show personalized match recommendations
   - Show upcoming deadlines

4. **Settings Page**
   - Allow users to update profile fields
   - Privacy/data settings
   - Notification preferences (future)

### Acceptance Criteria
- Users can sign up/login
- Saved schemes are tied to user account
- Dashboard shows personalized content
- Guest mode still works for demo
- Tests pass

---

## PHASE 3: ENHANCED SCHEME DATABASE & RAG (3-4 days)

### Goals
- Move from hardcoded schemes to a structured, searchable database
- Implement semantic search (RAG) using pgvector or LangChain
- Expand scheme coverage
- Add proper scheme categorization

### Deliverables

1. **Database Schema Enhancement**
   - Migrate key tables to PostgreSQL (for production; SQLite dev fallback)
   - Add tables:
     - `schemes` (full scheme info with embeddings)
     - `eligibility_rules` (structured rules, not inline)
     - `scheme_categories` & `target_groups`
     - `scheme_documents`
     - `scheme_sources` (trust metadata)
   - Add pgvector extension for semantic search

2. **Scheme Seeding**
   - Expand from 7 hardcoded schemes → ~20 realistic schemes
   - Categories: Student, Women, Senior Citizen
   - Include real official URLs (https://scholarships.gov.in, etc.)
   - Mark schemes as DEMO or VERIFIED based on actual source check
   - Generate embeddings for all schemes

3. **RAG Implementation**
   - Create `src/lib/rag.ts` (LangChain-based or custom)
   - Input: user question/profile
   - Process: embed question, pgvector similarity search, metadata filtering
   - Output: top-K relevant schemes with context
   - Integrate into `/api/assistant/query`

4. **Scheme Search API**
   - Create `GET /api/schemes/search?q=...&state=...&category=...`
   - Support filtering by target group, state, benefits
   - Return paginated results with match scores

### Acceptance Criteria
- PostgreSQL database created with proper schema
- Gemini embeddings generated for all schemes (or fallback to simpler similarity)
- RAG retrieval returns semantically relevant schemes
- Scheme search API works
- All existing flows still work
- Tests pass

---

## PHASE 4: TRUST LAYER & SOURCE VERIFICATION (2-3 days)

### Goals
- Implement robust trust/verification UI per spec
- Show official source metadata prominently
- Flag unverified schemes clearly
- Add freshness/last-verified timestamps
- Create conflict detection for scheme data

### Deliverables

1. **Trust Service**
   - Create `src/lib/trustService.ts`
   - Verify scheme source domain against whitelist (gov.in, nic.in, state portals)
   - Store: `source_domain`, `last_verified`, `verification_status`, `source_type`
   - Identify verification status: VERIFIED, UNVERIFIED, CONFLICTING

2. **Scheme Source Metadata**
   - Update all schemes with proper source info
   - Example:
     ```
     "source": {
       "domain": "scholarships.gov.in",
       "verifiedBy": "Ministry of Social Justice & Empowerment",
       "lastVerified": "2025-10-06",
       "status": "VERIFIED"
     }
     ```
   - Add conflict detection (if multiple sources have conflicting eligibility)

3. **Trust UI Components**
   - Create `VerifiedBadge` showing: 🛡 Verified Government Source | Verified by [Dept] | Last checked [date]
   - Create `UnverifiedWarning` for schemes without source verification
   - Show freshness indicator on scheme cards

4. **Scheme Details Page Enhancement**
   - Add "Verification Status" section
   - Show source domain with trust indicator
   - Show last verified timestamp
   - Add disclaimer: "Final eligibility determined by official authority"
   - Link directly to official source

5. **Document Checklist Component**
   - Create `DocumentChecklist.tsx`
   - Allow users to check off documents as ready
   - Save checklist state per-user
   - Show status: MISSING / READY / SUBMITTED

### Acceptance Criteria
- All schemes have proper source metadata
- Verified schemes show trust badge
- Unverified schemes show warning
- Document checklist works
- Source verification doesn't break existing flows
- Tests pass

---

## PHASE 5-10 (Planned, Not Yet Implemented)

5. **Advanced Eligibility Engine** — conflict resolution, conditional rules
6. **Guided Application Flow** — step-by-step application walkthrough
7. **Document Intelligence** — upload & verify documents
8. **Reminders & Deadlines** — notification system
9. **Admin Panel** — scheme management, analytics
10. **Multi-language Support** — Hindi, regional languages

---

## PHASED ROLLOUT TIMELINE

| Phase | Timeline | Critical Path |
|-------|----------|---|
| 1 | Weeks 1-2 | Branding, LLM setup |
| 2 | Weeks 2-4 | Auth, profiles |
| 3 | Weeks 4-7 | Database, RAG |
| 4 | Weeks 7-9 | Trust layer |

After Phase 4: **Production MVP** ready for full launch.

---

## IMPORTANT NOTES

### Do Not Break Existing Code
- All current endpoints remain
- Existing SQLite fallback remains for dev/demo
- Existing eligibility engine remains (will be enhanced, not replaced)
- Existing UI components remain (will be restyled, not replaced)

### Keep It Simple
- Avoid over-engineering
- Prioritize working features over perfect architecture
- Use existing libraries (LangChain, Pydantic, FastAPI if we add Python backend)
- Demo mode must always work without external APIs

### Test-Driven Development (Lite)
- For each phase, create a small test suite
- Test critical paths: extraction → matching → saving → tracking
- Manual acceptance tests per phase

---

## Success Metrics (Per Phase)

**Phase 1:** Landing page looks professional, all branding consistent, LLM provider abstraction works

**Phase 2:** Users can sign up, profiles persist, dashboard is personalized

**Phase 3:** Scheme search returns semantically relevant results, RAG improves match quality

**Phase 4:** Trust metadata is comprehensive, users trust source information, no false positives

---

## File Structure After All Phases

```
Jan-/
├── src/
│   ├── app/
│   │   ├── page.tsx                    (landing page, enhanced)
│   │   ├── auth/                       (PHASE 2)
│   │   ├── dashboard/
│   │   ├── discover/
│   │   ├── scheme/
│   │   ├── api/
│   │   │   ├── auth/                   (PHASE 2)
│   │   │   ├── profile/
│   │   │   ├── schemes/
│   │   │   ├── user/                   (PHASE 2)
│   │   │   └── assistant/
│   ├── lib/
│   │   ├── llmProvider.ts              (PHASE 1)
│   │   ├── providers/                  (PHASE 1)
│   │   ├── rag.ts                      (PHASE 3)
│   │   ├── trustService.ts             (PHASE 4)
│   │   ├── auth.ts                     (PHASE 2)
│   │   └── ... (existing)
│   ├── components/
│   │   ├── VerifiedBadge.tsx           (PHASE 4)
│   │   ├── DocumentChecklist.tsx       (PHASE 4)
│   │   └── ... (existing)
├── data/
│   └── jansahayak.db                   (SQLite, dev)
├── .env.example                        (updated each phase)
├── README.md
└── ... (existing config files)
```

---

## Next Steps

**After approval of this plan:**

1. Begin PHASE 1 immediately
2. Implement branding & LLM abstraction
3. Test existing flows still work
4. Create PR/commit with Phase 1 changes
5. Proceed to Phase 2

Would you like to approve this plan and start Phase 1?
