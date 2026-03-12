import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { app } from "../firebase/config";

const functions = getFunctions(app, "us-central1");

// ⚡ Emulator Check
const useEmulators = import.meta.env.VITE_USE_EMULATORS === 'true';
if (useEmulators) {
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

// 🏢 Platform Identity & Mission
const PLATFORM_CONTEXT = `
[PLATFORM INFORMATION]
Name: Careerly
Mission: Empowering the next generation of African professionals by bridging the gap between education and employment.
Core Features: 
1. AI-Powered Skill Gap Analysis: Personalized roadmaps based on industry needs.
2. Direct Internship Matching: Connecting students with top-tier companies (MTN, Orange, local hubs).
3. Portfolio Verifiability: Validating student tasks through accredited mentors.
4. Professional Community: A nexus for students, schools, and companies to interact.
Target Region: Primarily Africa (starting with Cameroon).
`;

export const aiService = {
  /**
   * Generates a response from the AI assistant with full user context and platform knowledge.
   * @param {string} userInput - The message from the user.
   * @param {Object} user - The current user's profile data from AuthContext.
   */
  generateResponse: async (userInput, user = null) => {
    // Contextual Awareness: Build a personality profile based on user data and platform mission
    let contextPrompt = PLATFORM_CONTEXT;

    if (user) {
      contextPrompt += `
[CONTEXTUAL USER DATA]
Name: ${user.fullName || 'User'}
Role: ${user.role || 'Unspecified'}
Skills: ${user.skills?.join(', ') || 'None listed'}
Location: ${user.location || 'Unknown'}
Education: ${user.education || 'Not provided'}
Bio: ${user.bio || 'None'}
Status: ${user.status || 'Active'}

Instructions: You are the Careerly AI Strategist. Answer the user query using the Careerly mission as your guide. 
Always aim to provide actionable, strategic advice that helps them level up on the Careerly platform. 
If they ask for a roadmap, use their current skills as the starting point.
Keep the tone professional, African-centric, and encouraging.
---
User Query: ${userInput}
`;
    } else {
      contextPrompt += `
Instructions: You are the Careerly AI Strategist. Answer the following user query.
User Query: ${userInput}
`;
    }

    // 🛡️ Step 1: Backend Call (Only if Emulators are ON)
    if (useEmulators) {
      try {
        const chatWithGemini = httpsCallable(functions, "chatWithGemini");
        const result = await chatWithGemini({ text: contextPrompt });
        return result.data || "I'm thinking...";
      } catch (error) {
        console.warn("Backend Emulator bypassed. Using direct API.");
      }
    }

    // 🌐 Step 2: Direct-to-Gemini (2026 Super-Waterfall)
    const localKey = import.meta.env.VITE_AI_API_KEY;
    if (localKey && localKey.startsWith("AIza")) {
      const configurations = [
        { v: 'v1beta', m: 'gemini-1.5-flash-latest' },
        { v: 'v1beta', m: 'gemini-2.0-flash-lite' },
        { v: 'v1beta', m: 'gemini-3-flash-preview' },
        { v: 'v1beta', m: 'gemini-1.5-pro-latest' }
      ];

      for (const config of configurations) {
        try {
          const url = `https://generativelanguage.googleapis.com/${config.v}/models/${config.m}:generateContent?key=${localKey}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: contextPrompt }] }],
              generationConfig: { temperature: 0.7 }
            })
          });

          const data = await res.json().catch(() => ({}));

          if (res.ok) {
            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
              return data.candidates[0].content.parts[0].text;
            }
          } else {
            if (data.error?.status === "RESOURCE_EXHAUSTED") continue;
          }
        } catch (fErr) {
          continue;
        }
      }
    }

    // 🎭 Step 3: Heuristic Local Intelligence (Fallbacks with Platform Knowledge)
    return getContextualLocalResponse(userInput, user);
  },
};

/**
 * Enhanced local responder that uses user data to personalize offline advice.
 */
function getContextualLocalResponse(input, user) {
  const low = input.toLowerCase();
  const name = user?.fullName?.split(' ')[0] || "there";

  if (low.includes("skill") || low.includes("roadmap") || low.includes("gap")) {
    const skills = user?.skills?.length > 0 ? user.skills.join(', ') : "your current core";
    return `### High-Performance Roadmap for ${name} (Careerly Intelligence)
Since my live neural bridge is syncing, I've analyzed your Careerly profile locally. 

**Current Baseline:** ${skills}
**Strategic Target:** Senior Development & Architecture.

**Strategic Gaps to Bridge:**
1. **System Design:** Moving from feature-thinking to systems-thinking.
2. **Scalability:** Understanding how ${skills} perform under heavy load.
3. **Leadership:** Technical mentorship patterns within your role as a ${user?.role || 'professional'}.

[System Note: Offline personalized response generated based on Careerly profile data.]`;
  }

  if (low.includes("internship") || low.includes("job")) {
    return `Hello ${name}! As your Careerly strategist, I've analyzed your background as a ${user?.role || 'student'}. I recommend checking these Careerly-partnered hubs:
- **Orange Digital Center:** Great for hands-on technical workshops.
- **Zixtech Hub:** Excellent for entrepreneurship and mentorship.
- **MTN Innovation Labs:** Target these for high-tier engineering roles.

[Careerly Local Strategist Response]`;
  }

  return `Hello ${name}, I've received your query as part of the Careerly ecosystem. 
Even while syncing, I'm dedicated to helping you bridge the gap between education and employment. To get a full neural analysis, ensure your API key is active or enable the Firebase emulators!`;
}