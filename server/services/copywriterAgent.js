const { callGemini } = require("../config/gemini");
const prompts = require("./promptTemplates");

function buildFallbackDraft(metaDocument) {
  const productName = metaDocument.product_name || "Our Solution";
  const audience = metaDocument.target_audience || "professionals and teams";
  const value =
    metaDocument.value_proposition ||
    "deliver exceptional results with a streamlined experience";
  const featureList = metaDocument.key_features || [];
  const features = featureList.join(", ");
  const supportingPoints = (metaDocument.supporting_points || []).join("; ");
  const tone = metaDocument.tone_detected || "Professional";

  // Build rich feature paragraph for blog
  const featureBlock = featureList.length > 0
    ? `What sets ${productName} apart is its carefully crafted feature set. ${featureList.map((f, i) =>
        i === 0 ? `At the core, you'll find ${f}` :
        i === featureList.length - 1 ? `and ${f}` :
        f
      ).join(", ")} — each designed to ${value.toLowerCase()}.`
    : `${productName} brings a thoughtfully designed experience to ${audience}, focused on delivering real, measurable value from day one.`;

  const supportBlock = supportingPoints
    ? `\n\nIndustry experts note: ${supportingPoints}. These insights reinforce why ${productName} stands out in today's competitive landscape.`
    : "";

  return {
    blog_post: `# Why ${productName} Is Changing the Game for ${audience}

In today's fast-paced world, ${audience} need solutions that don't just keep up — they need tools that push boundaries. That's exactly where ${productName} comes in, built from the ground up to ${value.toLowerCase()}.

## The Problem Worth Solving

Every day, ${audience} face mounting challenges that demand smarter, faster, and more reliable solutions. Traditional approaches fall short when scale and quality both matter. ${productName} was designed to bridge that gap.

## What Makes ${productName} Different

${featureBlock}${supportBlock}

## Built for Real Results

The ${tone.toLowerCase()} approach behind ${productName} ensures that every interaction is purposeful. Whether you're just getting started or scaling up, the experience is designed to grow with you — no compromises.

## Ready to Get Started?

${productName} is available now for ${audience} who are ready to ${value.toLowerCase()}. Join the growing community of users who have already made the switch.

---
*${productName} — Empowering ${audience} to achieve more.*`,

    linkedin_post: `🚀 Excited to share: ${productName} is here — and it's built for ${audience} who demand more.

${features ? `✅ ${featureList.join("\n✅ ")}` : `✅ Purpose-built for ${audience}\n✅ Designed to ${value.toLowerCase()}`}

In a world where ${audience} need solutions that truly deliver, ${productName} stands apart by focusing on what matters most: ${value.toLowerCase()}.

${supportingPoints ? `💡 ${supportingPoints}` : `💡 We believe the best tools are the ones that get out of your way and let you focus on what you do best.`}

The future belongs to those who adapt. ${productName} is ready — are you?

#Innovation #ProductLaunch #${productName.replace(/\s+/g, "")} #Technology`,

    twitter_thread: [
      `🚀 Introducing ${productName} — built for ${audience} who want to ${value.toLowerCase()}. A thread 🧵👇`,
      features
        ? `🔑 Key features:\n${featureList.map(f => `• ${f}`).join("\n")}\n\nEach one designed to make a real difference.`
        : `🔑 What makes it special? A relentless focus on ${value.toLowerCase()} — with every detail crafted for ${audience}.`,
      supportingPoints
        ? `📊 Don't just take our word for it: ${supportingPoints}`
        : `📊 Early adopters are already seeing results. The feedback? "${productName} just works."`,
      `🎯 Who is it for? ${audience} who are tired of settling for "good enough" and ready for something better.`,
      `💡 Ready to try ${productName}? The future of ${value.toLowerCase()} starts now.\n\nLike & repost if this resonates! 🔄`
    ],

    email_teaser: `Subject: Introducing ${productName} — Built for ${audience} Like You

Hi there,

We're thrilled to introduce ${productName}, a new solution designed specifically for ${audience} who want to ${value.toLowerCase()}.

${features ? `Here's what you'll get:\n${featureList.map(f => `  • ${f}`).join("\n")}` : `Here's what makes it different: a laser focus on helping you ${value.toLowerCase()}, with a clean, intuitive experience from start to finish.`}

${supportingPoints ? `Why it matters: ${supportingPoints}.` : `We built ${productName} because we believe ${audience} deserve better tools — ones that actually deliver on their promises.`}

Ready to see it in action? Click below to get started.

[Get Started with ${productName}] →

Best regards,
The ${productName} Team

P.S. Early adopters get priority access. Don't miss out!`
  };
}

function normalizeDraft(candidate) {
  return {
    blog_post: typeof candidate.blog_post === "string" ? candidate.blog_post : "",
    linkedin_post:
      typeof candidate.linkedin_post === "string" ? candidate.linkedin_post : "",
    twitter_thread: Array.isArray(candidate.twitter_thread)
      ? candidate.twitter_thread
          .filter((item) => typeof item === "string")
          .slice(0, 5)
      : [],
    email_teaser:
      typeof candidate.email_teaser === "string" ? candidate.email_teaser : ""
  };
}

async function copywriterAgent(metaDocument) {
  let rawText;
  try {
    rawText = await callGemini(
      prompts.copywriterPrompt,
      `Fact Sheet:\n${JSON.stringify(metaDocument, null, 2)}`
    );
    rawText = rawText.trim();
    console.log("[CopywriterAgent] Gemini raw response (first 200 chars):", rawText.slice(0, 200));
  } catch (error) {
    console.error("[CopywriterAgent] Gemini call failed:", error.message);
    return buildFallbackDraft(metaDocument);
  }

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    console.error("[CopywriterAgent] JSON parse failed. Raw text:\n", rawText.slice(0, 500));
    return buildFallbackDraft(metaDocument);
  }

  return normalizeDraft(parsed);
}

module.exports = copywriterAgent;

