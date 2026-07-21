import { getSurvey } from "@/lib/actions/survey.actions";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function SurveyEmbedPage({ params }: { params: { id: string } }) {
    const survey = await getSurvey(params.id);

    if (!survey) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-950">
            <div className="max-w-2xl mx-auto p-6">
                {/* Survey Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white mb-2">{survey.title}</h1>
                    {survey.description && (
                        <p className="text-slate-400">{survey.description}</p>
                    )}
                </div>

                {/* Survey Form */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                    <form
                        action={`/api/surveys/${survey._id}/respond`}
                        method="POST"
                        className="space-y-6"
                    >
                        {survey.questions?.map((question: any, idx: number) => (
                            <div key={question.id} className="space-y-3">
                                <label className="block text-white font-semibold">
                                    {idx + 1}. {question.question}
                                </label>
                                
                                {question.type === 'text' && (
                                    <input
                                        type="text"
                                        name={`question_${question.id}`}
                                        className="w-full px-4 py-3 border border-slate-700 rounded-xl bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required={question.required}
                                    />
                                )}

                                {question.type === 'textarea' && (
                                    <textarea
                                        name={`question_${question.id}`}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-slate-700 rounded-xl bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required={question.required}
                                    />
                                )}

                                {question.type === 'multiple-choice' && question.options?.map((option: string, optIdx: number) => (
                                    <label key={optIdx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`question_${question.id}`}
                                            value={option}
                                            className="w-4 h-4 text-indigo-600 bg-slate-700 border-slate-600 focus:ring-indigo-500"
                                            required={question.required}
                                        />
                                        <span className="text-slate-300">{option}</span>
                                    </label>
                                ))}

                                {question.type === 'checkbox' && question.options?.map((option: string, optIdx: number) => (
                                    <label key={optIdx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name={`question_${question.id}`}
                                            value={option}
                                            className="w-4 h-4 text-indigo-600 bg-slate-700 border-slate-600 focus:ring-indigo-500 rounded"
                                        />
                                        <span className="text-slate-300">{option}</span>
                                    </label>
                                ))}

                                {question.type === 'rating' && (
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <label key={rating} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={`question_${question.id}`}
                                                    value={rating}
                                                    className="w-4 h-4 text-indigo-600 bg-slate-700 border-slate-600 focus:ring-indigo-500"
                                                    required={question.required}
                                                />
                                                <span className="text-slate-300">{rating}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Lead Capture Fields */}
                        {survey.leadCapture?.enabled && (
                            <div className="pt-6 border-t border-slate-800 space-y-4">
                                <h3 className="text-white font-semibold">Contact Information</h3>
                                {survey.leadCapture.fields?.map((field: any) => (
                                    <div key={field.id}>
                                        <label className="block text-slate-300 text-sm mb-1">{field.label}</label>
                                        <input
                                            type={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text'}
                                            name={`lead_${field.id}`}
                                            className="w-full px-4 py-3 border border-slate-700 rounded-xl bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required={field.required}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
