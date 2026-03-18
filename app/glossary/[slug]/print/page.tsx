import GlossaryTerm from "@/lib/db/models/GlossaryTerm";
import connectToDatabase from "@/lib/db/connect";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import PrintTrigger from "./print-trigger";

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
                                <a href={url} style={{ color: "#059669" }}>
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
        : "2026";

    return (
        <>
            <title>{t.term} – K Business Academy Glossary</title>
            <style>{`
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                    font-family: Georgia, 'Times New Roman', serif;
                    font-size: 11pt;
                    color: #111;
                    background: white;
                    padding: 2cm 2.5cm;
                    max-width: 900px;
                    margin: 0 auto;
                }
                h1 { font-size: 2rem; font-weight: 900; margin-bottom: 0.5rem; line-height: 1.2; }
                h2 { font-size: 1.2rem; font-weight: 700; margin: 1.5rem 0 0.5rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.25rem; }
                h3 { font-size: 1rem; font-weight: 700; margin: 1rem 0 0.4rem; }
                p, li { line-height: 1.7; margin-bottom: 0.5rem; color: #333; }
                ul { padding-left: 1.25rem; }
                a { color: #059669; }
                .badge { display: inline-block; background: #d1fae5; color: #065f46; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; }
                .definition-box { background: #f0fdf4; border-left: 4px solid #10b981; padding: 1rem 1.25rem; border-radius: 0 8px 8px 0; margin: 1rem 0 1.5rem; }
                .definition-box p { color: #064e3b; margin: 0; font-size: 1.05rem; }
                .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 1rem 0 1.5rem; }
                .meta-item { background: #f8fafc; border: 1px solid #e5e7eb; padding: 0.6rem 0.8rem; border-radius: 6px; }
                .meta-item span:first-child { display: block; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; margin-bottom: 2px; }
                .meta-item span:last-child { font-weight: 700; font-size: 0.9rem; }
                .highlight-box { background: #fef3c7; border: 1px solid #fcd34d; padding: 0.75rem 1rem; border-radius: 8px; margin: 1rem 0; }
                .highlight-box p { color: #92400e; margin: 0; }
                .section-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0; }
                .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 0.875rem; }
                .card h4 { font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem; }
                .footer-note { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; font-size: 0.75rem; color: #6b7280; }
                @media print {
                    body { padding: 0; }
                    @page { margin: 1.5cm 2cm; }
                    h1, h2, h3 { page-break-after: avoid; }
                    p, li { page-break-inside: avoid; }
                }
            `}</style>
            <div className="print-page-wrapper">
                <PrintTrigger />

                <div className="badge">{t.category || "General"}</div>
                <h1>{t.term}</h1>
                <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.25rem", marginBottom: "1rem" }}>
                    kbusinessacademy.com/glossary/{slug} · Updated {updatedDate}
                </p>

                {t.shortDefinition && (
                    <div className="definition-box">
                        <p><strong>Definition:</strong> {t.shortDefinition}</p>
                    </div>
                )}

                {/* Meta grid */}
                {(t.skillRequired || t.timeToFirstDollar || t.startupCost || t.platformPreference) && (
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
                            <div className="meta-item" style={{ gridColumn: "1/-1" }}><span>Platform</span><span>{t.platformPreference}</span></div>
                        )}
                    </div>
                )}

                {t.definition && (
                    <>
                        <h2>What is {t.term}?</h2>
                        <p style={{ whiteSpace: "pre-wrap" }}>{t.definition}</p>
                    </>
                )}

                {t.expandedExplanation && (
                    <>
                        <h2>Deeper Dive</h2>
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
                        <h2>Why {t.term} Matters</h2>
                        <p>{t.whyItMatters}</p>
                    </>
                )}

                {(t.howItWorks || t.howItMakesMoney) && (
                    <>
                        <h2>How It Works & Makes Money</h2>
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
                        <div className="highlight-box"><p>"{t.realExamples}"</p></div>
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
                        <h2>Getting Started Checklist</h2>
                        <ul>{t.gettingStartedChecklist.map((item: string, i: number) => <li key={i}>☐ {item}</li>)}</ul>
                    </>
                )}

                {t.faqs && t.faqs.length > 0 && (
                    <>
                        <h2>FAQs</h2>
                        {t.faqs.map((faq: any, i: number) => (
                            <div key={i} style={{ marginBottom: "1rem" }}>
                                <p style={{ fontWeight: 700 }}>{faq.question}</p>
                                <p>{faq.answer}</p>
                            </div>
                        ))}
                    </>
                )}

                {(t.headlines?.length || t.youtubeTitles?.length || t.pinterestIdeas?.length || t.instagramIdeas?.length || t.amazonProducts?.length || t.websitesRanking?.length || t.podcastsRanking?.length) && (
                    <>
                        <h2>Content Creator Setup</h2>
                        <div className="section-grid">
                            {renderList(t.headlines, "Blog Headlines")}
                            {renderList(t.youtubeTitles, "YouTube Titles")}
                            {renderList(t.pinterestIdeas, "Pinterest Pins")}
                            {renderList(t.instagramIdeas, "Instagram Posts")}
                            {renderList(t.amazonProducts, "Related Products", true)}
                            {renderList(t.websitesRanking, "Websites", true)}
                            {renderList(t.podcastsRanking, "Ranked Podcasts", true)}
                        </div>
                    </>
                )}

                <div className="footer-note">
                    Generated from kbusinessacademy.com/glossary/{slug}
                </div>
            </div>
        </>
    );
}
