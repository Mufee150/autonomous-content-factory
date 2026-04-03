const openai = require("../config/openai");
const prompts = require("./promptTemplates");

function buildFallbackDraft(metaDocument) {
  const productName = metaDocument.product_name || "the product";
  const features = (metaDocument.features || []).join(", ") || "its core capabilities";
  const audience = metaDocument.target_audience || "your target audience";
  const value =
    metaDocument.value_proposition || "delivering clear and practical value";

  const isWorkshop = /workshop|bootcamp|training|course/i.test(productName);

  if (isWorkshop) {
    return {
      blog_post: `${productName} is built for ${audience} who want practical results, not just theory. The core value is simple: ${value}. In many learning programs, people leave motivated but unsure about what to do next. This workshop model solves that by giving participants a structured path from basics to application.

The workshop flow is anchored around ${features}. Instead of presenting disconnected ideas, each segment builds on the previous one. Participants first understand key concepts, then see guided examples, and finally apply what they learned through focused activities. This layered format helps learners retain information faster and with greater confidence.

Another advantage is clarity of outcomes. A strong workshop does not measure success by attendance alone. It measures success by whether participants can apply the skill in real scenarios. With ${productName}, each learning block is designed to produce an observable outcome, such as solving a practical task, explaining a concept clearly, or completing a guided mini project.

For instructors and organizers, this structure also improves delivery consistency. Session quality becomes repeatable across batches because the agenda, exercises, and checkpoints are aligned. That means less drift in quality and a smoother learner experience.

The result is a workshop experience that feels purposeful from start to finish. Learners know what they are learning, why it matters, and how to apply it. If the goal is to help ${audience} build confidence quickly and move toward real-world usage, ${productName} provides a practical and reliable format to achieve that goal.`,
      social_thread: [
        `${productName}: a practical format for ${audience}.`,
        `Why it works: ${value}. The focus is on real application, not passive listening.`,
        `Key workshop elements: ${features}.`,
        `Participants progress through concept -> guided example -> hands-on activity.`,
        `Outcome: stronger confidence, clearer understanding, and immediate next steps.`
      ],
      email_teaser: `${productName} helps ${audience} quickly build practical skills with a clear structure, guided exercises, and real application. If you want a workshop that turns learning into action, this is the right format.`
    };
  }

  return {
    blog_post: `${productName} is designed for ${audience}. Its main goal is to ${value}. In practical terms, this means participants or readers get a clear path from first exposure to confident execution.

The experience is built around ${features}. These elements work together to keep learning focused, reduce confusion, and provide momentum from one section to the next. Instead of scattered information, the structure gives people a reliable sequence they can follow.

One of the biggest strengths of ${productName} is clarity. Each section is planned to connect directly to outcomes that matter. People do not just consume information, they understand how to apply it.

For teams and organizers, this also improves consistency. Messaging remains aligned, expectations are transparent, and delivery quality becomes easier to maintain. Over time, this creates better engagement and stronger trust in the program.

If your objective is to help ${audience} gain confidence quickly, ${productName} provides a practical and repeatable format that supports that outcome.`,
    social_thread: [
      `${productName} in one line: ${value}.`,
      `Built for ${audience}.`,
      `Core features: ${features}.`,
      `Why it matters: clear process, better consistency, faster execution.`,
      `Result: more quality output with less manual effort.`
    ],
    email_teaser: `${productName} gives ${audience} a faster way to turn one source document into clear, consistent campaign content with ${value}.`
  };
}

function normalizeDraft(candidate) {
  return {
    blog_post: typeof candidate.blog_post === "string" ? candidate.blog_post : "",
    social_thread: Array.isArray(candidate.social_thread)
      ? candidate.social_thread
          .filter((item) => typeof item === "string")
          .slice(0, 5)
      : [],
    email_teaser:
      typeof candidate.email_teaser === "string" ? candidate.email_teaser : ""
  };
}

async function copywriterAgent(metaDocument) {
  let completion;
  try {
    completion = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: prompts.copywriterPrompt
        },
        {
          role: "user",
          content: JSON.stringify(metaDocument)
        }
      ]
    });
  } catch (error) {
    return buildFallbackDraft(metaDocument);
  }

  const rawText = (completion.output_text || "").trim();

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    const parseError = new Error("Copywriter Agent returned invalid JSON.");
    parseError.statusCode = 502;
    parseError.source = "copywriter-agent";
    throw parseError;
  }

  return normalizeDraft(parsed);
}

module.exports = copywriterAgent;

