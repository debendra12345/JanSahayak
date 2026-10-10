# 🎯 JanSahायक MVP - Immediate Action Items

**Status**: Ready to implement  
**Build**: Passing  
**Focus**: Application features (no auth)

---

## IMMEDIATE WINS (Start Here)

### 1. **Dashboard Sections to Add** (HIGH PRIORITY)
Current dashboard shows: Header, Profile completion bar, Recommended schemes

Missing sections to add:
- [ ] **Saved Schemes** section (bookmarked schemes)
- [ ] **Active Applications** section (with status badges)
- [ ] **Upcoming Reminders** section (deadline alerts)
- [ ] **Quick Actions Bar** (links to Central, State, Recommended, Applications, Reminders)

**Effort**: 2-3 hours (add 4 new sections to existing dashboard)
**Files**: `src/app/dashboard/page.tsx`, potentially new dashboard components

---

### 2. **Profile Edit Functionality** (HIGH PRIORITY)
Current: Profile created via onboarding only
Missing:
- [ ] Edit all profile fields
- [ ] Save changes to localStorage/backend
- [ ] Immediately refresh recommendations after save
- [ ] Show validation messages

**Effort**: 2 hours
**Files**: `src/app/profile/page.tsx` - enhance existing page

---

### 3. **Scheme Search and Filtering** (HIGH PRIORITY)
Current: Browse pages exist but search is mock
Missing:
- [ ] Real search by scheme name/keyword
- [ ] Filter by category
- [ ] Filter by beneficiary type
- [ ] Filter by eligibility status
- [ ] Real-time filtering

**Effort**: 2-3 hours
**Files**: `src/app/schemes/central/page.tsx`, `src/app/schemes/state/page.tsx`

---

### 4. **Application Tracking Enhancements** (MEDIUM PRIORITY)
Current: Applications page shows list
Missing:
- [ ] Add application (from scheme detail)
- [ ] Update application status
- [ ] Add notes to application
- [ ] Show status timeline
- [ ] Next action guidance

**Effort**: 2-3 hours
**Files**: `src/app/applications/page.tsx`, `src/app/applications/[id]/page.tsx`

---

### 5. **Reminder Management Enhancements** (MEDIUM PRIORITY)
Current: Reminders page shows list
Missing:
- [ ] Create new reminder
- [ ] Edit reminder date/message
- [ ] Delete reminder
- [ ] Smart default dates from application

**Effort**: 2 hours
**Files**: `src/app/reminders/page.tsx`

---

## DETAILED IMPLEMENTATION BREAKDOWN

### TASK 1: Add Dashboard Sections

**What to add:**

```
DASHBOARD FLOW:
┌─ Welcome Section (already exists)
├─ Profile Completion (already exists)
├─ Recommended Schemes (already exists)
├─ Saved Schemes ← NEW
├─ Active Applications ← NEW
├─ Upcoming Reminders ← NEW
└─ Quick Actions Bar ← NEW
```

**Implementation details:**

1. **Saved Schemes Section**
   - Fetch from `/api/dashboard/saved` or get from saved schemes API
   - Show scheme cards with "Remove" and "View Details" actions
   - Show empty state: "No saved schemes yet. Browse recommended or search to find schemes."

2. **Active Applications Section**
   - Fetch from `/api/dashboard/applications` or applications API
   - Show app cards with status badge
   - Show next action guidance
   - Show empty state: "No applications yet. Start with a scheme to begin."
   - Link to applications page

3. **Upcoming Reminders Section**
   - Fetch from `/api/dashboard/reminders` or reminders API
   - Show next 3-5 reminders
   - Highlight overdue reminders in red
   - Show empty state: "No reminders set. Create one to stay on track."
   - Link to reminders page

4. **Quick Actions Bar**
   - Navigation buttons: Central Schemes, State Schemes, Recommended, Applications, Reminders, Ask JanSahायak
   - Single row, responsive grid

**Files to modify:**
- `src/app/dashboard/page.tsx` - Add new sections and API calls

**APIs to use/create:**
- GET `/api/dashboard/saved` - Get saved schemes
- GET `/api/dashboard/applications` - Get active applications
- GET `/api/dashboard/reminders` - Get upcoming reminders

---

### TASK 2: Enhance Profile Edit Page

**What to add:**

```
PROFILE EDIT FLOW:
┌─ Display current profile
├─ Edit each field with validation
├─ Show explanation for each field
├─ Save button
├─ Success message
└─ Trigger recommendation refresh
```

**Implementation details:**

1. **Load Profile**
   - Fetch from localStorage or API
   - Display in form fields

2. **Edit Fields**
   - Age group / Date of birth
   - State
   - Education level
   - Income range
   - Occupation/Student status
   - Beneficiary category
   - Assistance needs

3. **Validation**
   - Required fields
   - Min/max age
   - Valid state selection

4. **Save**
   - Save to localStorage
   - Show success toast
   - Redirect to dashboard OR show updated recommendations immediately

5. **Refresh Recommendations**
   - After save, fetch new recommendations from /api/schemes/match
   - Show which recommendations changed

**Files to modify:**
- `src/app/profile/page.tsx` - Already exists, enhance with edit functionality

**Components needed:**
- FormField component with validation
- Success toast notification

---

### TASK 3: Add Scheme Search and Filtering

**What to add:**

```
SCHEME BROWSING FLOW:
┌─ Search input (real-time)
├─ Category filter
├─ Beneficiary type filter
├─ Eligibility status filter
├─ Display filtered results
└─ Show "No schemes found" with helpful message
```

**Implementation details:**

1. **Search Input**
   - Real-time search by:
     - Scheme name
     - Description
     - Benefits (keywords)
     - Keywords

2. **Filters**
   - Category (Scholarship, Loan, Insurance, Grant, etc.)
   - Beneficiary type (Student, Woman, Senior, Farmer, etc.)
   - Eligibility (Likely match, Potentially eligible, etc.)

3. **Results Display**
   - Filter scheme cards
   - Show number of results
   - Empty state with suggestions

4. **Scheme Cards**
   - Scheme name + Ministry
   - Short description
   - Key benefits (1-2 lines)
   - Target beneficiaries
   - Match score (if personalized)
   - "View Details" button

**Files to modify:**
- `src/app/schemes/central/page.tsx`
- `src/app/schemes/state/page.tsx`
- `src/app/schemes/recommended/page.tsx`

**Data needed:**
- Scheme categories
- Beneficiary types
- Available filters

---

### TASK 4: Enhance Application Tracking

**What to add:**

```
APPLICATION FLOW:
┌─ List all applications
├─ Filter by status
├─ Click to view details
├─ Update status
├─ Add notes
├─ Show next action
└─ See timeline/history
```

**Implementation details:**

1. **Create Application**
   - From scheme detail page, "Save Scheme" or "Start Application"
   - Creates Draft application
   - Link scheme to application

2. **Update Status**
   - Dropdown: Draft → Documents Pending → Ready → Submitted → Under Review → Approved/Rejected → Completed
   - Show status change timestamp
   - Preserve history

3. **Add Notes**
   - Text field for user notes
   - "Application reference: ABC123" type info
   - Save notes to application record

4. **Show Timeline**
   - Created date
   - Status changes
   - Important dates
   - Next recommended action

5. **Next Action Guidance**
   - "Complete documents" → link to checklist
   - "Submit application" → link to application portal
   - "Check status in 20 days" → suggest reminder

**Files to modify:**
- `src/app/applications/page.tsx` - List view
- `src/app/applications/[id]/page.tsx` - Detail view

**APIs to create/enhance:**
- POST `/api/applications` - Create application
- PUT `/api/applications/[id]` - Update application
- POST `/api/applications/[id]/notes` - Add notes

---

### TASK 5: Enhance Reminder Management

**What to add:**

```
REMINDER FLOW:
┌─ View reminders
├─ Create new reminder
├─ Edit reminder
├─ Delete reminder
├─ Smart default dates
└─ Mark complete
```

**Implementation details:**

1. **Create Reminder**
   - From application detail page
   - Smart defaults based on processing time
   - "Check status in 20 days" for submitted apps
   - "Upload documents by [date]" for pending docs
   - Custom dates

2. **Edit Reminder**
   - Change date
   - Change message
   - Change category

3. **Delete Reminder**
   - Confirm deletion
   - Remove from list

4. **Mark Complete**
   - Move from Upcoming to Completed
   - Keep in history

5. **Smart Default**
   - If application submitted 20 days ago, suggest reminder today
   - If documents due in 5 days, highlight in red
   - Auto-calculate from application dates

**Files to modify:**
- `src/app/reminders/page.tsx` - Main reminder page

**APIs to create:**
- POST `/api/reminders` - Create reminder
- PUT `/api/reminders/[id]` - Update reminder
- DELETE `/api/reminders/[id]` - Delete reminder
- POST `/api/reminders/[id]/complete` - Mark complete

---

## IMPLEMENTATION SEQUENCE

1. **Start with Task 1: Dashboard Sections** (HIGH IMPACT, moderate effort)
   - Makes app feel much more complete
   - All other tasks will be used here

2. **Then Task 2: Profile Edit** (MEDIUM IMPACT, low effort)
   - Quick win, high value
   - Enables profile refresh

3. **Then Task 3: Search and Filtering** (HIGH VALUE, medium effort)
   - Makes scheme discovery much better

4. **Then Task 4: Application Tracking** (HIGH VALUE, medium effort)
   - Core workflow

5. **Finally Task 5: Reminders** (NICE-TO-HAVE, low effort)
   - Adds polish

---

## TESTING CHECKLIST

For each task:
- [ ] Component renders without errors
- [ ] All inputs/buttons work
- [ ] Data persists (localStorage/API)
- [ ] Empty states show helpful messages
- [ ] Loading states smooth
- [ ] Error states handled
- [ ] Responsive on mobile/tablet/desktop
- [ ] No console errors

---

## BUILD COMMANDS

After each task:
```bash
npm run build      # Verify build passes
npm run lint       # Check linting (optional)
```

---

## READY TO START?

Which task should we tackle first? I recommend:

**Priority**: Task 1 (Dashboard Sections) → Task 2 (Profile Edit) → Task 3 (Search)

Estimated total time: 6-8 hours for all 5 tasks
