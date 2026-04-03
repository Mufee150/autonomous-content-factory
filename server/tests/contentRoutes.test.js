const request = require("supertest");

jest.mock("../services/researchAgent", () => jest.fn());
jest.mock("../services/copywriterAgent", () => jest.fn());
jest.mock("../services/editorAgent", () => jest.fn());

const researchAgent = require("../services/researchAgent");
const copywriterAgent = require("../services/copywriterAgent");
const editorAgent = require("../services/editorAgent");
const app = require("../app");

describe("Content Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("POST /analyze returns meta document", async () => {
    researchAgent.mockResolvedValue({
      product_name: "Autonomous Content Factory",
      target_audience: "Marketing teams",
      key_features: ["Multi-agent workflow"],
      value_proposition: "Faster campaign creation",
      supporting_points: ["Source-driven workflow"],
      tone_detected: "professional",
      constraints: [],
      risks_or_ambiguities: [],
      missing_information: []
    });

    const response = await request(app)
      .post("/analyze")
      .send({ source_text: "Sample product description" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.product_name).toBe("Autonomous Content Factory");
  });

  test("POST /generate returns validated content", async () => {
    copywriterAgent.mockResolvedValue({
      blog_post: "Draft blog",
      linkedin_post: "Draft linkedin",
      twitter_thread: ["1", "2", "3", "4", "5"],
      email_teaser: "Draft teaser"
    });

    editorAgent.mockResolvedValue({
      blog_post: "Final blog",
      linkedin_post: "Final linkedin",
      twitter_thread: ["A", "B", "C", "D", "E"],
      email_teaser: "Final teaser",
      validation_report: {
        hallucination_detected: false,
        tone_consistent: true,
        aligned_with_meta_document: true,
        notes: []
      }
    });

    const response = await request(app)
      .post("/generate")
      .send({
        meta_document: {
          product_name: "ACF",
          target_audience: "teams",
          key_features: ["f1"],
          value_proposition: "value",
          supporting_points: ["s1"],
          tone_detected: "professional",
          constraints: [],
          risks_or_ambiguities: [],
          missing_information: []
        }
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.validation_report.tone_consistent).toBe(true);
  });

  test("POST /create-content runs full pipeline", async () => {
    researchAgent.mockResolvedValue({
      product_name: "ACF",
      target_audience: "teams",
      key_features: ["f1"],
      value_proposition: "value",
      supporting_points: ["s1"],
      tone_detected: "professional",
      constraints: [],
      risks_or_ambiguities: [],
      missing_information: []
    });

    copywriterAgent.mockResolvedValue({
      blog_post: "Draft blog",
      linkedin_post: "Draft linkedin",
      twitter_thread: ["1", "2", "3", "4", "5"],
      email_teaser: "Draft teaser"
    });

    editorAgent.mockResolvedValue({
      blog_post: "Final blog",
      linkedin_post: "Final linkedin",
      twitter_thread: ["A", "B", "C", "D", "E"],
      email_teaser: "Final teaser",
      validation_report: {
        hallucination_detected: false,
        tone_consistent: true,
        aligned_with_meta_document: true,
        notes: []
      }
    });

    const response = await request(app)
      .post("/create-content")
      .send({ source_text: "Sample input" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.meta_document.product_name).toBe("ACF");
    expect(response.body.data.content.blog_post).toBe("Final blog");
  });
});