import GlossaryTerm from "@/lib/db/models/GlossaryTerm";
import connectToDatabase from "@/lib/db/connect";
import { notFound } from "next/navigation";
import PagePrintTrigger from "@/components/glossary/PagePrintTrigger";

interface Props {
    params: Promise<{ slug: string }>;
}

// Helper — same requireUrl logic as the main page
const renderList = (items: any[] | undefined, title: string, requireUrl = false) => {
    if (!items || items.length === 0) return null;
    const displayItems = requireUrl
        ? items.filter((item: any) => {
            const url = typeof item === "object" && item.url ? item.url.trim() : "";
            return url.length > 0 && url !== "#";
          })
        : items;
    if (displayItems.length === 0) return null;
    return (
        <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{title}</h3>
            <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
                {displayItems.map((item: any, i: number) => {
                    const label = typeof item === "string" ? item : item.name;
                    const url = typeof item === "object" && item.url ? item.url : null;
                    return (
                        <li key={i} style={{ marginBottom: "0.25rem" }}>
                            {url ? (
                                <a href={url} style={{ color: "#059669", textDecoration: "none" }}>
                                    {label}
                                </a>
                            ) : (
                                label
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default async function GlossaryPrintPage({ params }: Props) {
    const { slug } = await params;
    await connectToDatabase();
    const term = await GlossaryTerm.findOne({ slug }).lean() as any;
    if (!term) notFound();
    const t = JSON.parse(JSON.stringify(term));

    const updatedDate = t.lastUpdated
        ? new Date(t.lastUpdated).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : "March 2026";

    return (
        <>
            <title>{t.term} – K Business Academy</title>
            <style>{`
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                    font-family: Inter, system-ui, -apple-system, sans-serif;
                    font-size: 11pt;
                    color: #111;
                    background: white;
                    padding: 1.5cm 2cm;
                    max-width: 800px;
                    margin: 0 auto;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                h1 { font-size: 2.25rem; font-weight: 900; margin-bottom: 0.5rem; line-height: 1.1; letter-spacing: -0.02em; }
                h2 { font-size: 1.25rem; font-weight: 800; margin: 2rem 0 0.75rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.25rem; color: #111; }
                h3 { font-size: 1rem; font-weight: 700; margin: 1.25rem 0 0.5rem; }
                p, li { line-height: 1.6; margin-bottom: 0.75rem; color: #374151; }
                ul { padding-left: 1.5rem; }
                a { color: #059669; text-decoration: underline; }
                
                .badge { display: inline-block; background: #10b981; color: white; font-size: 0.65rem; font-weight: 800; padding: 3px 10px; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; }
                
                .definition-box { background: #ecfdf5; border-left: 5px solid #10b981; padding: 1.25rem 1.5rem; border-radius: 0 12px 12px 0; margin: 1.5rem 0 2rem; }
                .definition-box p { color: #064e3b; margin: 0; font-size: 1.1rem; font-weight: 500; }
                
                .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0 2rem; }
                .meta-item { border: 1px solid #e5e7eb; padding: 0.75rem 1rem; border-radius: 12px; background: #fafafa; }
                .meta-item span:first-child { display: block; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 4px; }
                .meta-item span:last-child { font-weight: 700; font-size: 0.95rem; color: #111; }
                
                .info-box { background: #eff6ff; border: 1px solid #bfdbfe; padding: 1rem; border-radius: 12px; margin: 1.5rem 0; }
                .info-box p { color: #1e40af; margin: 0; font-size: 0.95rem; }
                
                .section-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0; }
                .card { border: 1px solid #f1f5f9; background: #f8fafc; border-radius: 12px; padding: 1rem; }
                .card h4 { font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; color: #64748b; }
                
                .footer-note { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #f1f5f9; font-size: 0.75rem; color: #94a3b8; text-align: center; }
                
                @media print {
                    body { padding: 0; margin: 0; max-width: 100%; }
                    @page { margin: 1.5cm 2cm; }
                    .no-print { display: none !important; }
                    h1, h2, h3 { page-break-after: avoid; }
                    .card, .meta-item, .definition-box, p, li { page-break-inside: avoid; }
                }
            `}</style>
            <div className="print-page-wrapper">
                <PagePrintTrigger />

                <div className="badge">{t.category || "General"}</div>
                <h1>{t.term}</h1>
                <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "2rem" }}>
                    kbusinessacademy.com/glossary/{slug} · {updatedDate}
                </p>

                {t.shortDefinition && (
                    <div className="definition-box">
                        <p><strong>Definition:</strong> {t.shortDefinition}</p>
                    </div>
                )}

                <div className="meta-grid">
                    {t.skillRequired && (
                        <div className="meta-item"><span>Skill Level</span><span>{t.skillRequired}</span></div>
                    )}
                    {t.timeToFirstDollar && (
                        <div className="meta-item"><span>Time to Entry</span><span>{t.timeToFirstDollar}</span></div>
                    )}
                    {t.startupCost && (
                        <div className="meta-item" style={{ gridColumn: "1/-1" }}><span>Startup Cost</span><span>{t.startupCost}</span></div>
                    )}
                    {t.platformPreference && (
                        <div className="meta-item" style={{ gridColumn: "1/-1" }}><span>Platform / Software</span><span>{t.platformPreference}</span></div>
                    )}
                </div>

                {t.definition && (
                    <>
                        <h2>What is {t.term}?</h2>
                        <p style={{ whiteSpace: "pre-wrap" }}>{t.definition}</p>
                    </>
                )}

                {t.expandedExplanation && (
                    <>
                        <h2>Deeping Dive</h2>
                        <p style={{ whiteSpace: "pre-wrap" }}>{t.expandedExplanation}</p>
                    </>
                )}

                {(t.origin || t.traditionalMeaning) && (
                    <>
                        <h2>History & Origins</h2>
                        {t.origin && <p>{t.origin}</p>}
                        {t.traditionalMeaning && <p>{t.traditionalMeaning}</p>}
                    </>
                )}

                {t.whyItMatters && (
                    <>
                        <h2>Why it Matters</h2>
                        <p>{t.whyItMatters}</p>
                    </>
                )}

                {(t.howItWorks || t.howItMakesMoney) && (
                    <>
                        <h2>How it Works</h2>
                        <p>{t.howItWorks || t.howItMakesMoney}</p>
                    </>
                )}

                {t.bestFor && (
                    <>
                        <h2>Ideal Audience</h2>
                        <p>{t.bestFor}</p>
                    </>
                )}

                {(t.useCases || t.commonPractices) && (
                    <>
                        <h2>Practical Applications</h2>
                        <div className="section-grid">
                            {t.useCases && (
                                <div className="card">
                                    <h4>Use Cases</h4>
                                    <p>{t.useCases}</p>
                                </div>
                            )}
                            {t.commonPractices && (
                                <div className="card">
                                    <h4>Common Practices</h4>
                                    <p>{t.commonPractices}</p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {t.realExamples && (
                    <>
                        <h2>Real-World Examples</h2>
                        <div className="info-box"><p>"{t.realExamples}"</p></div>
                    </>
                )}

                {t.benefits && (
                    <>
                        <h2>Benefits</h2>
                        <p>{t.benefits}</p>
                    </>
                )}

                {t.commonMistakes && (
                    <>
                        <h2>Common Mistakes</h2>
                        <p>{t.commonMistakes}</p>
                    </>
                )}

                {t.takeaways && t.takeaways.length > 0 && (
                    <>
                        <h2>Key Takeaways</h2>
                        <ul>{t.takeaways.map((item: string, i: number) => <li key={i}>{item}</li>)}</ul>
                    </>
                )}

                {t.gettingStartedChecklist && t.gettingStartedChecklist.length > 0 && (
                    <>
                        <h2>Getting Started</h2>
                        <ul>{t.gettingStartedChecklist.map((item: string, i: number) => <li key={i}>☐ {item}</li>)}</ul>
                    </>
                )}

                {t.faqs && t.faqs.length > 0 && (
                    <>
                        <h2>Common Questions</h2>
                        {t.faqs.map((faq: any, i: number) => (
                            <div key={i} style={{ marginBottom: "1.25rem" }}>
                                <p style={{ fontWeight: 700, marginBottom: "0.25rem" }}>{faq.question}</p>
                                <p>{faq.answer}</p>
                            </div>
                        ))}
                    </>
                )}

                {(t.headlines?.length || t.youtubeTitles?.length || t.pinterestIdeas?.length || t.instagramIdeas?.length || t.amazonProducts?.length || t.websitesRanking?.length || t.podcastsRanking?.length) && (
                    <>
                        <h2>Creator Content Roadmap</h2>
                        <div className="section-grid">
                            {renderList(t.headlines, "Blog Headlines")}
                            {renderList(t.youtubeTitles, "YouTube Titles")}
                            {renderList(t.pinterestIdeas, "Pinterest Ideas")}
                            {renderList(t.instagramIdeas, "Instagram Concepts")}
                            {renderList(t.amazonProducts, "Related Products", true)}
                            {renderList(t.websitesRanking, "Reference Websites", true)}
                            {renderList(t.podcastsRanking, "Relevant Podcasts", true)}
                        </div>
                    </>
                )}

                {(t.imagePrompt || t.productPrompt || t.socialPrompt) && (
                    <>
                        <h2>AI Content Prompts</h2>
                        <div className="section-grid">
                            {t.imagePrompt && (
                                <div className="card" style={{ gridColumn: "1/-1" }}>
                                    <h4>Visual / Image Generation Prompt</h4>
                                    <p style={{ fontSize: "0.85rem", fontStyle: "italic" }}>{t.imagePrompt}</p>
                                </div>
                            )}
                            {t.productPrompt && (
                                <div className="card">
                                    <h4>Product Opportunity Prompt</h4>
                                    <p style={{ fontSize: "0.85rem", fontStyle: "italic" }}>{t.productPrompt}</p>
                                </div>
                            )}
                            {t.socialPrompt && (
                                <div className="card">
                                    <h4>Social Media Hooks Prompt</h4>
                                    <p style={{ fontSize: "0.85rem", fontStyle: "italic" }}>{t.socialPrompt}</p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                <div className="footer-note">
                    Copyright © 2026 K Business Academy. All rights reserved.
                </div>
            </div>
        </>
    );
}
