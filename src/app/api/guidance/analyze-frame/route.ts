import { NextRequest, NextResponse } from "next/server";

/**
 * Analyze a captured screen frame and provide guidance
 * 
 * Security: Detects and warns about sensitive fields (passwords, OTPs, PINs)
 * Never processes or returns sensitive values
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { frame, schemeId, currentStep } = body;

    if (!frame) {
      return NextResponse.json(
        { error: "No frame data provided" },
        { status: 400 }
      );
    }

    // For MVP, provide demo guidance based on step and scheme
    // In production, this would be actual LLM-based frame analysis
    
    const guidance = getDemoGuidance(schemeId, currentStep);

    return NextResponse.json({
      success: true,
      pageTitle: guidance.pageTitle,
      currentStep: guidance.currentStep,
      detectedElements: guidance.detectedElements,
      guidance: guidance.guidance,
      warnings: guidance.warnings,
      sensitiveFieldsDetected: guidance.sensitiveFieldsDetected,
      nextAction: guidance.nextAction,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[guidance/analyze-frame] error:", error);
    return NextResponse.json(
      { 
        error: "Could not analyze screen. Please try again.",
        guidance: "Try taking a clearer screenshot of the government application page.",
      },
      { status: 500 }
    );
  }
}

function getDemoGuidance(schemeId?: string, currentStep?: number) {
  const steps = {
    1: {
      pageTitle: "Application Portal Homepage",
      currentStep: 1,
      detectedElements: ["New Application Button", "Login Link", "Scheme Dropdown"],
      guidance: "Look for a 'New Application' or 'Start Application' button on the main page.",
      warnings: ["This appears to be an official government portal"],
      sensitiveFieldsDetected: false,
      nextAction: "Click the 'New Application' button",
    },
    2: {
      pageTitle: "Login or Register",
      currentStep: 2,
      detectedElements: ["Email/Phone Field", "Password Field", "Register Link"],
      guidance: "Enter your registered email or phone number. Do NOT share your OTP or password with JanSahayak.",
      warnings: ["Sensitive login fields detected. Please enter credentials yourself."],
      sensitiveFieldsDetected: true,
      nextAction: "Complete login with your credentials",
    },
    3: {
      pageTitle: "Personal Information",
      currentStep: 3,
      detectedElements: ["Name Field", "Email Field", "Phone Field", "Address Field"],
      guidance: "Fill in your personal details. Make sure your name matches your identity proof.",
      warnings: [],
      sensitiveFieldsDetected: false,
      nextAction: "Enter your personal information and proceed",
    },
    4: {
      pageTitle: "Income Details",
      currentStep: 4,
      detectedElements: ["Annual Income Field", "Employment Status", "Family Income"],
      guidance: "Enter your annual family income. Use the amount from your income certificate.",
      warnings: [],
      sensitiveFieldsDetected: false,
      nextAction: "Enter income from your income certificate",
    },
    5: {
      pageTitle: "Document Upload",
      currentStep: 5,
      detectedElements: ["File Upload Section", "Supported Formats", "Upload Button"],
      guidance: "Upload the required documents. Ensure they are clear and properly scanned.",
      warnings: ["Only upload official documents. Do not share personal photos."],
      sensitiveFieldsDetected: false,
      nextAction: "Upload each required document one by one",
    },
    6: {
      pageTitle: "Review and Submit",
      currentStep: 6,
      detectedElements: ["Summary Section", "Confirmation Checkbox", "Submit Button"],
      guidance: "Review all your information carefully before submitting. Once submitted, you cannot edit most fields.",
      warnings: ["Double-check your phone number for application updates."],
      sensitiveFieldsDetected: false,
      nextAction: "Review details and click Submit",
    },
    7: {
      pageTitle: "Application Confirmation",
      currentStep: 7,
      detectedElements: ["Application ID", "Reference Number", "Confirmation Message"],
      guidance: "Save your application ID and reference number. You'll need these to track your application.",
      warnings: ["Screenshot or write down your application ID for your records."],
      sensitiveFieldsDetected: false,
      nextAction: "Save your application ID and close this window",
    },
  };

  const step = currentStep && steps[currentStep as keyof typeof steps] 
    ? steps[currentStep as keyof typeof steps]
    : steps[1];

  return step;
}
