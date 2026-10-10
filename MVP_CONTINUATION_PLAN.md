# 🎯 JanSahायक MVP Continuation Plan

**Date**: October 10, 2026  
**Status**: Phase 3 Complete, Ready for MVP Finalization  
**Build**: ✅ Passing (13.5s)  
**Scope**: Application features ONLY (excluding authentication)

---

## ✅ CURRENT STATE ASSESSMENT

### Completed (Phase 1-3)
- ✅ Landing page with hero section
- ✅ 4-step onboarding wizard (profile creation)
- ✅ Dashboard with personalized recommendations
- ✅ Scheme browsing (Central, State, Recommended)
- ✅ Scheme detail pages with full information
- ✅ Document checklist component
- ✅ Trust verification badges
- ✅ Eligibility breakdown display
- ✅ Application tracker page
- ✅ Reminder system page
- ✅ Assistant chat interface

### Build Status
- ✅ 19 static pages prerendered
- ✅ 8 API routes compiled
- ✅ TypeScript strict mode passing
- ✅ No build errors

---

## 🎯 PRIORITY 1: Dashboard Enhancement

### Current State
Dashboard exists but needs to be transformed into a comprehensive civic-assistance home page.

### Required Changes
1. **Add Welcome Section**
   - Personalized greeting based on user profile
   - Quick onboarding status indicator
   
2. **Add Profile Completion Indicator**
   - Show what profile information is missing
   - Percentage complete
   - Link to update profile

3. **Restructure Sections**
   - Recommended schemes (with match scores)
   - Saved schemes (bookmarked)
   - Active applications (with status)
   - Upcoming reminders (deadline alerts)
   - Quick actions (Central, State, Recommended, Applications, Reminders)
   
4. **Improve Empty States**
   - New users: "Complete your profile to get recommendations"
   - No applications: "Start with a scheme"
   - No reminders: "Set a reminder for application follow-up"

### Files to Modify
- `src/app/dashboard/page.tsx` - Main dashboard page
- Components: Add new dashboard sections

---

## 🎯 PRIORITY 2: Profile Management Enhancement

### Current State
Onboarding wizard exists but profile management is basic.

### Required Changes
1. **Profile Edit Page**
   - Edit all profile fields
   - Conditional fields based on selections
   - Save and immediately refresh recommendations
   
2. **Profile Validation**
   - Require minimum information for recommendations
   - Explain why each field matters
   
3. **Profile Persistence**
   - Ensure profile updates trigger recommendation refresh
   - Update displayed eligibility assessments

### Files to Modify
- `src/app/profile/page.tsx` - Profile edit page
- Add profile update validation

---

## 🎯 PRIORITY 3: Scheme Browsing and Search

### Current State
Browsing exists but search and filters need improvement.

### Required Changes
1. **Functional Search**
   - Search by scheme name
   - Search by keyword (benefits, eligibility, etc.)
   - Real-time results
   
2. **Practical Filters**
   - Government level (Central/State)
   - State selection
   - Category
   - Beneficiary type
   - Eligibility status

3. **Improved Scheme Cards**
   - Scheme name + ministry
   - Short description
   - Key benefits (1-2 lines)
   - Target beneficiaries
   - Quick action: View Details

### Files to Modify
- `src/app/schemes/central/page.tsx`
- `src/app/schemes/state/page.tsx`
- Add search functionality to scheme listing

---

## 🎯 PRIORITY 4: Recommendation Refresh Logic

### Current State
Recommendations are shown but don't refresh when profile changes.

### Required Changes
1. **Real-Time Refresh**
   - When profile updates, regenerate recommendations
   - Show which profile changes affected recommendations
   
2. **Incomplete Profile Handling**
   - Show what additional info would improve recommendations
   - Suggest specific profile fields to complete

### Files to Modify
- Add refresh logic to profile update
- Modify dashboard to listen for profile changes

---

## 🎯 PRIORITY 5: Guided Application Workflow

### Current State
Guided application UI exists but workflow may need refinement.

### Required Changes
1. **Step-by-Step Flow**
   - Clear numbered steps
   - Current step highlighting
   - What to do next
   - Why this step matters
   
2. **Step Progress Persistence**
   - Save which steps are complete
   - Resume from last step
   
3. **Official Portal Integration**
   - Link to verified official application URL
   - Clear instruction on next action at each step

### Files to Modify
- `src/app/guided-apply/[id]/page.tsx`
- Ensure steps are properly persisted

---

## 🎯 PRIORITY 6: Application Tracker Enhancements

### Current State
Tracker shows applications with status filtering.

### Required Changes
1. **Status Management**
   - Allow users to update status
   - Show status history/timeline
   - Display next actions clearly
   
2. **Application Notes**
   - Let users add notes to applications
   - Show important dates and events
   
3. **Status Clarity**
   - Distinguish user-entered, demo, and verified statuses
   - Never claim government integration unless real

### Files to Modify
- `src/app/applications/[id]/page.tsx`
- Add status update and notes features

---

## 🎯 PRIORITY 7: Reminders Enhancements

### Current State
Reminders page exists with filtering.

### Required Changes
1. **Reminder Management**
   - Create new reminders from applications
   - Edit reminder dates and messages
   - Delete reminders
   
2. **Smart Defaults**
   - Suggest reminder dates based on processing times
   - "Check status in 20 days" type suggestions
   
3. **Clear Notification Strategy**
   - Show that notifications are in-app only for MVP
   - Don't claim email/SMS unless actually implemented

### Files to Modify
- `src/app/reminders/page.tsx`
- Add create/edit reminder functionality

---

## 🎯 PRIORITY 8: Ask JanSahायक Context

### Current State
Chat interface exists.

### Required Changes
1. **Context Awareness**
   - Use current page context
   - Reference user's profile when relevant
   - Link to relevant scheme records
   
2. **Grounded Answers**
   - Show scheme sources for eligibility questions
   - Link to official documentation
   - Never fabricate answers
   
3. **Graceful Fallbacks**
   - If LLM unavailable, show honest fallback
   - Don't show fabricated "live" analysis

### Files to Modify
- `src/app/assistant/page.tsx`
- Enhance with profile and scheme context

---

## 🎯 PRIORITY 9: Screen-Sharing and Camera Guidance

### Current State
Not yet implemented.

### Required Changes
1. **Desktop Screen-Sharing**
   - User-initiated via button
   - Clear permission request
   - Visible "Sharing Active" indicator
   - "Analyze Current Screen" action
   - "Stop Sharing" control
   
2. **Mobile Camera Fallback**
   - Camera-based guidance option
   - Frame capture for analysis
   - Privacy banner

3. **Safety**
   - Never auto-capture or auto-analyze
   - Warn about sensitive information
   - Don't process passwords, OTPs, PINs

### Files to Create/Modify
- Add screen-sharing components
- Add camera guidance components
- Implement analysis endpoints

---

## 🎯 PRIORITY 10: Testing and Polish

### Final Steps
1. **Test User Journeys**
   - Profile → Recommendations → Scheme → Application → Reminder
   - Empty state flows
   - Error handling
   
2. **Responsive Testing**
   - Mobile (375px), Tablet (768px), Desktop (1440px+)
   
3. **Persistence Testing**
   - Profile saves and refreshes work
   - Checklists persist
   - Applications saved
   - Reminders created
   
4. **Build Verification**
   - `npm run build` passes
   - `npm run lint` reviewed
   - No console errors

---

## 📋 SCOPE RESTRICTIONS

### ❌ DO NOT TOUCH
- Authentication-related files
- Login/Signup/Registration pages
- DigiLocker integration
- OAuth/PKCE flows
- Session management
- Password handling
- Identity verification workflows
- Aadhaar collection

### ✅ OK TO MODIFY
- Dashboard
- Profile (non-auth) fields
- Scheme browsing and search
- Application tracking (not auth-related)
- Reminders
- Chat assistant
- Document checklists
- Guided application
- Screen-sharing guidance
- All data persistence (user-generated data only)

---

## 📊 SUCCESS CRITERIA

### Build
- [x] npm run build passes
- [x] No TypeScript errors
- [x] No critical lint issues

### Functionality
- [ ] Dashboard is personalized civic home
- [ ] Profile can be edited and refreshes recommendations
- [ ] Scheme search and filters work
- [ ] Recommendations update with profile changes
- [ ] Application tracker persists and updates
- [ ] Reminders can be created and viewed
- [ ] Guided application step flow works
- [ ] Ask JanSahायak uses context

### UX
- [ ] All empty states explained clearly
- [ ] Loading states smooth
- [ ] Error states handled gracefully
- [ ] No broken links or dead buttons
- [ ] Responsive at all breakpoints
- [ ] Accessible keyboard navigation

### Data
- [ ] Profile persists across refreshes
- [ ] Applications persist
- [ ] Reminders persist
- [ ] Recommendations refresh on profile change
- [ ] No data loss on navigation

---

## 🚀 NEXT STEPS

1. **Inspect current dashboard implementation**
2. **Assess each priority item against current code**
3. **Create task breakdown with specific file changes**
4. **Implement Priority 1: Dashboard Enhancement**
5. **Test and validate before moving to Priority 2**
6. **Continue through priorities sequentially**
7. **Perform final integration testing**
8. **Commit and document completion**

---

**Ready to begin. Which priority should we start with?**
