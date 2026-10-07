import {
  EligibilityReason,
  EligibilityResult,
  Scheme,
  UserProfile,
} from "./types";

/**
 * Deterministic, explainable rule engine. Every criterion produces a
 * grounded pass/fail/unknown reason so downstream explanations (including
 * any LLM step) are anchored to real facts instead of invented ones.
 */
export function evaluateEligibility(
  profile: UserProfile,
  scheme: Scheme
): EligibilityResult {
  const reasons: EligibilityReason[] = [];
  const { rules } = scheme;

  // Age
  if (rules.minAge !== undefined || rules.maxAge !== undefined) {
    if (profile.age === undefined) {
      reasons.push({
        criterion: "Age",
        passed: "unknown",
        detail: `Age not provided. Scheme requires ${rules.minAge ?? 0}-${
          rules.maxAge ?? "any"
        } years.`,
      });
    } else {
      const min = rules.minAge ?? 0;
      const max = rules.maxAge ?? Infinity;
      const ok = profile.age >= min && profile.age <= max;
      reasons.push({
        criterion: "Age",
        passed: ok,
        detail: ok
          ? `Age ${profile.age} is within the required ${min}-${rules.maxAge ?? "∞"} range.`
          : `Age ${profile.age} is outside the required ${min}-${rules.maxAge ?? "∞"} range.`,
      });
    }
  }

  // Gender
  if (rules.gender && rules.gender !== "Any") {
    if (!profile.gender) {
      reasons.push({
        criterion: "Gender",
        passed: "unknown",
        detail: `Gender not provided. Scheme is for ${rules.gender} applicants.`,
      });
    } else {
      const ok = profile.gender === rules.gender;
      reasons.push({
        criterion: "Gender",
        passed: ok,
        detail: ok
          ? `Matches required gender (${rules.gender}).`
          : `Scheme is restricted to ${rules.gender} applicants.`,
      });
    }
  }

  // Category
  if (rules.categories && !rules.categories.includes("Any")) {
    if (!profile.category) {
      reasons.push({
        criterion: "Social Category",
        passed: "unknown",
        detail: `Category not provided. Scheme requires: ${rules.categories.join(", ")}.`,
      });
    } else {
      const ok = rules.categories.includes(profile.category);
      reasons.push({
        criterion: "Social Category",
        passed: ok,
        detail: ok
          ? `Category "${profile.category}" is covered by this scheme.`
          : `Category "${profile.category}" is not in the eligible list (${rules.categories.join(", ")}).`,
      });
    }
  }

  // Income
  if (rules.maxFamilyIncome !== undefined) {
    if (profile.familyIncome === undefined) {
      reasons.push({
        criterion: "Family Income",
        passed: "unknown",
        detail: `Family income not provided. Limit is ₹${rules.maxFamilyIncome.toLocaleString(
          "en-IN"
        )}/year.`,
      });
    } else {
      const ok = profile.familyIncome <= rules.maxFamilyIncome;
      reasons.push({
        criterion: "Family Income",
        passed: ok,
        detail: ok
          ? `Income ₹${profile.familyIncome.toLocaleString("en-IN")} is within the ₹${rules.maxFamilyIncome.toLocaleString(
              "en-IN"
            )} limit.`
          : `Income ₹${profile.familyIncome.toLocaleString("en-IN")} exceeds the ₹${rules.maxFamilyIncome.toLocaleString(
              "en-IN"
            )} limit.`,
      });
    }
  }

  // Education level
  if (rules.educationLevels && !rules.educationLevels.includes("Any")) {
    if (!profile.educationLevel) {
      reasons.push({
        criterion: "Education Level",
        passed: "unknown",
        detail: `Education level not provided. Scheme requires: ${rules.educationLevels.join(", ")}.`,
      });
    } else {
      const ok = rules.educationLevels.includes(profile.educationLevel);
      reasons.push({
        criterion: "Education Level",
        passed: ok,
        detail: ok
          ? `Education level "${profile.educationLevel}" matches.`
          : `Education level "${profile.educationLevel}" is not in the eligible list (${rules.educationLevels.join(", ")}).`,
      });
    }
  }

  // State
  if (rules.states && rules.states.length > 0) {
    if (!profile.state) {
      reasons.push({
        criterion: "State / Region",
        passed: "unknown",
        detail: `State not provided. Scheme is limited to: ${rules.states.join(", ")}.`,
      });
    } else {
      const ok = rules.states.some(
        (s) => s.toLowerCase() === profile.state!.toLowerCase()
      );
      reasons.push({
        criterion: "State / Region",
        passed: ok,
        detail: ok
          ? `${profile.state} is a covered state.`
          : `${profile.state} is not in the covered states (${rules.states.join(", ")}).`,
      });
    }
  } else {
    reasons.push({
      criterion: "State / Region",
      passed: true,
      detail: "Available nationwide (All India).",
    });
  }

  // Disability
  if (rules.requiresDisability) {
    if (profile.disability === undefined) {
      reasons.push({
        criterion: "Disability Status",
        passed: "unknown",
        detail: "Disability status not provided. This scheme requires a valid disability certificate.",
      });
    } else {
      reasons.push({
        criterion: "Disability Status",
        passed: profile.disability,
        detail: profile.disability
          ? "Disability status confirmed, as required."
          : "This scheme is exclusively for persons with disabilities.",
      });
    }
  }

  // Occupation
  if (rules.occupations && rules.occupations.length > 0) {
    if (!profile.occupation) {
      reasons.push({
        criterion: "Occupation",
        passed: "unknown",
        detail: `Occupation not provided. Scheme requires: ${rules.occupations.join(", ")}.`,
      });
    } else {
      const ok = rules.occupations.some(
        (o) => o.toLowerCase() === profile.occupation!.toLowerCase()
      );
      reasons.push({
        criterion: "Occupation",
        passed: ok,
        detail: ok
          ? `Occupation "${profile.occupation}" matches requirement.`
          : `Scheme requires occupation to be one of: ${rules.occupations.join(", ")}.`,
      });
    }
  }

  const failedCount = reasons.filter((r) => r.passed === false).length;
  const unknownCount = reasons.filter((r) => r.passed === "unknown").length;
  const passedCount = reasons.filter((r) => r.passed === true).length;
  const total = reasons.length || 1;

  let status: EligibilityResult["status"];
  if (failedCount > 0) {
    status = "Not Eligible";
  } else if (unknownCount > 0) {
    status = "Likely Eligible";
  } else {
    status = "Eligible";
  }

  // Score: passed criteria weighted fully, unknown criteria weighted half.
  const score = Math.round(((passedCount + unknownCount * 0.5) / total) * 100);

  return {
    schemeId: scheme.id,
    status,
    score,
    reasons,
  };
}

export function matchSchemes(
  profile: UserProfile,
  schemes: Scheme[]
): EligibilityResult[] {
  return schemes
    .map((s) => evaluateEligibility(profile, s))
    .sort((a, b) => {
      const rank = (s: EligibilityResult["status"]) =>
        s === "Eligible" ? 0 : s === "Likely Eligible" ? 1 : 2;
      const r = rank(a.status) - rank(b.status);
      if (r !== 0) return r;
      return b.score - a.score;
    });
}
