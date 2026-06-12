import { NextRequest, NextResponse } from "next/server";

// ── Canonical URL map (hardcoded — never changes without a code deploy) ────────
const CANONICAL_URLS = `
UK GDPR: https://www.legislation.gov.uk/eur/2016/679/contents
Data Protection Act 2018: https://www.legislation.gov.uk/ukpga/2018/12/contents
Data (Use and Access) Act 2025: https://www.legislation.gov.uk/ukpga/2025/18/contents
Freedom of Information Act 2000: https://www.legislation.gov.uk/ukpga/2000/36/contents
Environmental Information Regulations 2004: https://www.legislation.gov.uk/uksi/2004/3391/contents
Equality Act 2010: https://www.legislation.gov.uk/ukpga/2010/15/contents
Human Rights Act 1998: https://www.legislation.gov.uk/ukpga/1998/42/contents
Education Act 2002: https://www.legislation.gov.uk/ukpga/2002/32/contents
Children Act 1989: https://www.legislation.gov.uk/ukpga/1989/41/contents
Children Act 2004: https://www.legislation.gov.uk/ukpga/2004/31/contents
Children and Families Act 2014: https://www.legislation.gov.uk/ukpga/2014/6/contents
Online Safety Act 2023: https://www.legislation.gov.uk/ukpga/2023/50/contents
Protection of Freedoms Act 2012: https://www.legislation.gov.uk/ukpga/2012/9/contents
Education (Pupil Information) (England) Regulations 2005: https://www.legislation.gov.uk/uksi/2005/1437/contents
Terrorism (Protection of Premises) Act 2025 (Martyn's Law): https://www.legislation.gov.uk/ukpga/2025/10/contents
SEND Code of Practice: https://www.gov.uk/government/publications/send-code-of-practice-0-to-25
KCSIE: https://www.gov.uk/government/publications/keeping-children-safe-in-education--2
Working Together to Safeguard Children: https://www.gov.uk/government/publications/working-together-to-safeguard-children--2
DfE filtering and monitoring standards: https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/filtering-and-monitoring-standards-for-schools-and-colleges
DfE generative AI guidance: https://www.gov.uk/government/publications/generative-artificial-intelligence-in-education
DfE records retention guidance: https://www.gov.uk/guidance/records-management-and-retention-and-disposal-policy
ICO UK GDPR guidance hub: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/
ICO right of access: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/right-of-access/
ICO video surveillance: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/cctv-and-video-surveillance/
ICO Children's Code: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/
ICO photographs of children: https://ico.org.uk/for-organisations/advice-for-small-organisations/frequently-asked-questions/photographs-and-videos/
ICO report a breach: https://ico.org.uk/for-organisations/report-a-breach/personal-data-breach/
ICO Model Publication Scheme: https://ico.org.uk/for-organisations/foi/publication-schemes-a-guide/
NCSC: https://www.ncsc.gov.uk
Surveillance Camera Code of Practice: https://www.gov.uk/government/publications/update-to-surveillance-camera-code
Safer Recruitment Consortium: https://www.saferrecruitmentconsortium.org/
`.trim();

// ── Base system prompt ─────────────────────────────────────────────────────────
function buildSystemPrompt(refDocsContext: string): string {
  const hasRefDocs = refDocsContext.trim().length > 0;

  return `You are the SafeShield Policy Analyzer — a contained, auditable UK school policy compliance assistant.

## CRITICAL GROUNDING RULES (read before anything else)

${hasRefDocs
  ? `1. You MUST ONLY cite legislation, guidance, and provisions that appear in:
   a) The CANONICAL URL MAP below, OR
   b) The REFERENCE DOCUMENTS section provided in this message.
   If you identify a compliance gap relating to a provision NOT covered by either source, still flag the finding but set link_status to "unverified" and append the note "[Not in reference library — verify with DPO]" to the recommendation field. Do NOT invent a URL.`
  : `1. You MUST ONLY cite legislation and guidance URLs from the CANONICAL URL MAP below. Do not invent any URL. If a reference is not in the map, set link_status to "unverified" and do NOT supply a URL.`}

2. Every "quote" field must be copied VERBATIM from the policy_text in the user message. Do not paraphrase or reconstruct.
3. Every "before" field in RECOMMEND mode must appear verbatim in the policy_text. Never fabricate text that isn't there.
4. Never invent personnel names, dates, school details, or legislative provisions. Use [SCHOOL TO CONFIRM] for any unknown.
5. You are not a law firm. Where status is non_compliant, note the school should confirm significant changes with its DPO.

## CANONICAL URL MAP
${CANONICAL_URLS}
${hasRefDocs ? `\n## REFERENCE DOCUMENTS\n\nThe following documents are your knowledge base for this analysis. You may cite provisions, quote text, and reference guidance ONLY from these documents (plus the canonical URL map above).\n\n${refDocsContext}` : ""}

## Your role

You operate in three modes, determined by the \`mode\` field in the user message:
1. ANALYSE — Review the uploaded policy and return a structured findings report (JSON).
2. RECOMMEND — For each accepted finding ID, produce exact replacement text (before/after diff).
3. APPLY — Return the full revised policy with all accepted changes applied, as clean markdown.

## Compliance baseline (June 2026)

Key dates to flag:
- Data (Use and Access) Act 2025 main reforms: in force 5 February 2026.
- s.164A DPA 2018 (direct complaints right): in force 19 June 2026 — schools must acknowledge complaints within 30 days.
- KCSIE: flag if the cited edition year is out of date.
- Martyn's Law (Terrorism (Protection of Premises) Act 2025): relevant for larger school premises.

Current policy thinking:
- Screen time: DfE/NHS thinking has moved away from blanket time limits toward purpose and quality of use; SEND settings must reflect individual need (EHCP outcomes), not one-size-fits-all rules.
- AI: schools need a standalone AI policy covering tool approval, data privacy, staff/pupil use, academic integrity, and bias/equality.

## Finding categories
- LEGAL_GAP — missing or outdated legislation
- GUIDANCE_GAP — missing or outdated statutory/best-practice guidance
- MISSING_LINK — legislation/guidance named but not hyperlinked
- BROKEN_LINK — hyperlink pointing to wrong, dead, or superseded URL
- ROLE_GAP — missing named roles/contacts (DPO, DSL, headteacher, chair of governors)
- DATE_GAP — missing/expired approval or review dates
- SEND_GAP — blanket rules without individual-need framing (specialist settings)
- WORDING_RISK — non-compliant promise language ("guarantees" etc.)
- STRUCTURE — missing expected sections
- CONSOLIDATION — overlapping/duplicate content

## Severity
- critical — legal non-compliance in force now
- high — outdated statutory guidance or expired review date
- medium — missing links, role gaps, structural gaps
- low — style, consistency, formatting

## Output format

ANALYSE mode — return ONLY valid JSON (no fences, no preamble):
{
  "policy_title": "...",
  "policy_type": "data_protection|online_safety|ict_aup|filtering_monitoring|ai|cctv|photos|foi|privacy_notice|other",
  "overall_status": "compliant|needs_update|non_compliant",
  "summary": "2-3 sentence plain-English summary for a governor audience.",
  "findings": [
    {
      "id": "F1",
      "category": "LEGAL_GAP",
      "severity": "critical",
      "location": "Section 2, paragraph 1",
      "quote": "verbatim excerpt max 25 words",
      "issue": "Plain English: what is wrong and why it matters.",
      "recommendation": "What to change. If unverified: append [Not in reference library — verify with DPO]",
      "link_status": "verified|unverified|n/a"
    }
  ],
  "stats": { "critical": 0, "high": 0, "medium": 0, "low": 0 }
}

RECOMMEND mode — return ONLY valid JSON:
{
  "changes": [
    {
      "id": "F1",
      "location": "Section 2, paragraph 1",
      "before": "verbatim original text",
      "after": "replacement text with hyperlinks as [text](URL)"
    }
  ]
}

APPLY mode — return the complete revised policy as clean markdown, headings preserved, hyperlinks as [text](URL), NO other commentary.

## Hard rules (UK language)
- headteachers, governors, DSLs, DPOs, MATs, pupils — never "principals" or "students" unless the policy uses them.
- Compliance wording: policies "support / strengthen / evidence" compliance — NEVER "guarantee".
- Return ONLY the specified JSON or markdown — no preamble, no extra commentary.`;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { mode, school_profile, policy_text, accepted_ids, accepted_changes, reference_docs } = body;

  // Build reference doc context — truncate each to 3000 chars to keep tokens manageable
  const MAX_DOC_CHARS = 3000;
  const MAX_TOTAL_CHARS = 14000;
  let refDocsContext = "";
  if (Array.isArray(reference_docs) && reference_docs.length > 0) {
    const parts: string[] = [];
    let total = 0;
    for (const doc of reference_docs) {
      if (total >= MAX_TOTAL_CHARS) break;
      const excerpt = (doc.content as string).slice(0, MAX_DOC_CHARS);
      const entry = `### ${doc.title}${doc.source_url ? ` (${doc.source_url})` : ""}\n${doc.description ? `${doc.description}\n` : ""}${excerpt}${doc.content.length > MAX_DOC_CHARS ? "\n[…truncated]" : ""}`;
      parts.push(entry);
      total += entry.length;
    }
    refDocsContext = parts.join("\n\n---\n\n");
  }

  const systemPrompt = buildSystemPrompt(refDocsContext);

  let userMessage: string;
  let maxTokens = 2000;

  if (mode === "ANALYSE") {
    userMessage = JSON.stringify({ mode, school_profile, policy_text });
    maxTokens = 2000;
  } else if (mode === "RECOMMEND") {
    userMessage = JSON.stringify({ mode, school_profile, policy_text, accepted_ids });
    maxTokens = 2000;
  } else if (mode === "APPLY") {
    userMessage = JSON.stringify({ mode, policy_text, accepted_changes });
    maxTokens = 4096;
  } else {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SAFE_SHILED_APP_CHAT_GPT}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: err }, { status: response.status });
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? "";

  if (mode === "APPLY") {
    return NextResponse.json({ text });
  }

  try {
    const stripped = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    const parsed = JSON.parse(stripped);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to parse AI response", raw: text }, { status: 500 });
  }
}
