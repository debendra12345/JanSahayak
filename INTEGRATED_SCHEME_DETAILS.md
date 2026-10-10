# JanSahayak Integrated Scheme Details Page

## Overview

The `/schemes/[id]` route now provides a comprehensive, tabbed experience for viewing and interacting with government schemes. This page consolidates the entire application workflow into a single, intuitive interface.

## Page Structure

### 1. **Scheme Header**
- Scheme name and description
- Central/State Government badge
- Department and category information
- Save/Share buttons

### 2. **Tabbed Navigation**

The page contains four main tabs:

#### Tab 1: **📋 Overview** (Default)
Shows complete scheme information:
- **Trust Badge**: Source verification status, last verified date
- **Benefits Section**: What the citizen may receive
- **Eligibility Assessment**: Matched/unmatched criteria based on user profile
- **Document Checklist**: Required documents with status tracking
- **Application Process**: 8-step workflow explanation
- **Official Portal Link**: Verified government application URL
- **Call-to-Action Buttons**:
  - ✅ **Apply on Official Portal** (Green button) - Opens official link
  - 💾 **Save to Dashboard** (Toggle button) - Saves scheme for later
  - 🤖 **JanSahayak AI Help** (Purple button) - Switches to Guided Application tab

#### Tab 2: **🚀 Guided Application**
7-step interactive application workflow:
1. Open Official Portal
2. Login/Register
3. Personal Information
4. Eligibility Details
5. Document Upload
6. Review Application
7. Submit & Confirmation

Features:
- Progress bar showing completion percentage (Step X of 7)
- Step navigation buttons (numbered 1-7)
- Quick action buttons for each step:
  - 📺 **Share Screen for Help** - Desktop screen-sharing guidance
  - 📱 **Use Camera Guidance** - Mobile phone camera assistance
  - ❓ **View FAQ**
- Previous/Next navigation
- Action buttons:
  - **Apply on Official Portal** - Link to official site
  - **Save & Track Application** - Creates application record and switches to Tracker tab

#### Tab 3: **📊 Tracker**
Application status tracking:
- List of applications started for this scheme
- Application ID and submission status
- Empty state with CTA if no applications
- Shows:
  - Application ID
  - Scheme name
  - Current status (DRAFT, SUBMITTED, APPROVED, etc.)
- Persistent storage in localStorage

#### Tab 4: **🔔 Reminders**
Deadline and follow-up management:
- **Add Reminder Button** - Creates new reminder
- **Reminder Form**:
  - Title input (e.g., "Submit application", "Check status")
  - Date picker for reminder date
  - Create/Cancel buttons
- **Reminders List**:
  - Shows all reminders for the scheme
  - Reminder title and date
  - Bell icon indicator
- Persistent storage in localStorage
- Empty state message

## Technical Implementation

### State Management
```typescript
// Tab navigation
const [activeTab, setActiveTab] = useState<"overview" | "guided" | "tracker" | "reminders">("overview");

// Guided application
const [currentStep, setCurrentStep] = useState(1);
const [showScreenSharing, setShowScreenSharing] = useState(false);
const [showCameraGuidance, setShowCameraGuidance] = useState(false);

// Data persistence
const [applications, setApplications] = useState<Application[]>([]);
const [reminders, setReminders] = useState<Reminder[]>([]);

// Reminder form
const [showReminderForm, setShowReminderForm] = useState(false);
const [reminderTitle, setReminderTitle] = useState("");
const [reminderDate, setReminderDate] = useState("");
```

### Component Integration
- **ScreenSharingPanel**: Desktop screen-sharing with frame capture for guidance
- **CameraGuidancePanel**: Mobile camera-based guidance for users
- **DocumentChecklist**: Tracks document preparation status
- **EligibilityBreakdown**: Shows matched/unmatched criteria
- **TrustBadge**: Displays source verification information

### Data Persistence
- Applications and reminders stored in browser localStorage
- Data filtered by schemeId to show only relevant items
- Survives page refresh and browser restart

### TypeScript Interfaces
```typescript
interface Application {
  id: string;
  schemeName: string;
  applicationNumber: string;
  status: string;
  schemeId: string;
}

interface Reminder {
  id: string;
  title: string;
  date: string;
  schemeId: string;
  status: string;
}
```

## User Journey

1. **User arrives at scheme details page** (`/schemes/[schemeId]`)
2. **Overview Tab** shows complete scheme information
3. **User reads eligibility** and documents needed
4. **User clicks "JanSahayak AI Help"** → Switches to Guided Application tab
5. **Guided Application** walks through 7 steps
6. **User can share screen or use camera** for real-time help
7. **User completes application** at official portal
8. **User clicks "Save & Track Application"** → Switches to Tracker tab
9. **Tracker tab** shows application progress
10. **User sets reminders** in Reminders tab for deadlines

## Button Locations

### Overview Tab (Bottom)
- **Row 1**: Apply on Official Portal | Save to Dashboard | JanSahayak AI Help
  - Green button opens external official portal
  - Toggle button saves scheme to saved schemes list
  - Purple button switches to Guided Application tab

### Guided Application Tab (Bottom)
- **Previous** ← | **Save & Track Application →** | **Next →**
  - Previous disabled on step 1
  - Next disabled on step 7
  - Save & Track application switches to Tracker tab

## Features

✅ **Integrated Workflow**: All 4 steps in one page
✅ **Screen Sharing**: Desktop guidance with frame capture
✅ **Camera Guidance**: Mobile phone camera assistance
✅ **Application Tracking**: Save and track submitted applications
✅ **Reminders**: Set deadlines and follow-ups
✅ **Persistent Storage**: localStorage-based persistence
✅ **Responsive Design**: Works on desktop and mobile
✅ **TypeScript**: Fully typed components and interfaces
✅ **Trust Verification**: Official source badges and verification dates
✅ **Accessibility**: Proper semantic HTML and ARIA labels

## Demo Personas

Test with these profiles:

### Persona 1: Student
- Age: 19
- State: Odisha
- Income: ₹1.5 lakh
- Status: Undergraduate

### Persona 2: Working Woman
- Age: 25
- State: Rajasthan
- Income: ₹2.5 lakh
- Status: Employed

### Persona 3: Senior Citizen
- Age: 65
- State: West Bengal
- Income: ₹1 lakh
- Status: Retired

## Build Status

✅ **Build**: Successful (0 errors)
✅ **TypeScript**: All types properly defined
✅ **Imports**: All components imported correctly
✅ **Commits**: Pushed to GitHub

## Known Limitations

- Screen sharing not supported on unsecured contexts (localhost is an exception)
- Camera guidance requires explicit user permission
- Applications and reminders use browser localStorage (not synced across devices)
- Demo data only - production requires backend integration

## Next Steps

1. Connect to real application submission APIs
2. Implement email/SMS reminders
3. Add document upload functionality
4. Integrate with official government portals for status tracking
5. Add user authentication and multi-device sync
