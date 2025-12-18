import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, FileText, Edit, CheckCircle, Clock } from "lucide-react";
import { getBrandBases } from "@/lib/actions/brand-baser.actions";
import { format } from "date-fns";
import { DeleteBrandBaseButton } from "../_components/delete-brand-base-button";
import { ExportButton } from "../_components/export-button";

export default async function BrandDocumentsPage() {
  const brandBases = await getBrandBases();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Brand Documents</h1>
          <p className="text-slate-600">
            Manage your 20-question brand intake forms
          </p>
        </div>
        <Link href="/admin/brand-baser/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Brand Document
          </Button>
        </Link>
      </div>

      {brandBases.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Brand Documents Yet</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Create your first brand document by answering 20 strategic questions
              about your business. Use it to generate AI-powered marketing content.
            </p>
            <Link href="/admin/brand-baser/create">
              <Button size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Document
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {brandBases.map((base: any) => {
            const totalQuestions = 20;
            const answeredQuestions = base.questions
              ? Object.values(base.questions).filter((val) => val && String(val).trim()).length
              : 0;
            const progress = (answeredQuestions / totalQuestions) * 100;

            return (
              <Card key={base._id} className="hover:shadow-md transition">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        base.isComplete ? "bg-emerald-100" : "bg-blue-100"
                      }`}>
                        <FileText className={`h-6 w-6 ${
                          base.isComplete ? "text-emerald-600" : "text-blue-600"
                        }`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">{base.name}</h3>
                            {base.isComplete ? (
                              <div className="flex items-center gap-1 text-emerald-600 text-sm">
                                <CheckCircle className="h-4 w-4" />
                                <span>Complete</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-amber-600 text-sm">
                                <Clock className="h-4 w-4" />
                                <span>In Progress</span>
                              </div>
                            )}
                          </div>
                          {base.description && (
                            <p className="text-sm text-slate-600 mb-3">
                              {base.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                          <span>{answeredQuestions} of {totalQuestions} questions answered</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              base.isComplete ? "bg-emerald-500" : "bg-blue-500"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                        <span>Created {format(new Date(base.createdAt), "MMM d, yyyy")}</span>
                        <span>•</span>
                        <span>Updated {format(new Date(base.updatedAt), "MMM d, yyyy")}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/brand-baser/${base._id}`}>
                          <Button size="sm" variant="default">
                            <Edit className="h-3 w-3 mr-1" />
                            {base.isComplete ? "View" : "Continue"}
                          </Button>
                        </Link>
                        
                        {answeredQuestions > 0 && (
                          <ExportButton 
                            brandBaseId={base._id} 
                            brandName={base.name}
                            size="sm"
                          />
                        )}
                        
                        <DeleteBrandBaseButton brandBaseId={base._id} brandName={base.name} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Info Box */}
      {brandBases.length > 0 && (
        <Card className="mt-6 bg-indigo-50 border-indigo-200">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">💡 How to Use Your Brand Documents</h3>
            <ul className="text-sm space-y-1 text-slate-700">
              <li>• Complete all 20 questions to build a comprehensive brand foundation</li>
              <li>• Export your document as a text file for use with ChatGPT Projects</li>
              <li>• Upload to ChatGPT along with system prompts to generate marketing content</li>
              <li>• Use for emails, sales letters, blog posts, social media, and more</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
