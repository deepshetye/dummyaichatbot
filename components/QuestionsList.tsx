import { questions } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

// Server Component - renders on server for SEO and performance
export function QuestionsList() {
    // Server-side data loading - questions are pre-rendered
    const featuredQuestions = questions.slice(0, 20);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Featured Questions
            </h2>
            <div className="space-y-4">
                {featuredQuestions.map((question) => (
                    <Card key={question.id} className="p-6 card-hover border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600">
                        <div className="space-y-3">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100 text-left leading-relaxed">
                                {question.title}
                            </h3>
                            <div className="flex items-center space-x-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                                    {question.category}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDate(question.createdAt)}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {question.tags.slice(0, 3).map((tag) => (
                                    <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            {/* Static response content preview - SEO optimized */}
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-2 leading-relaxed">
                                {question.content.substring(0, 120)}...
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* SEO-friendly structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": featuredQuestions.slice(0, 5).map(question => ({
                            "@type": "Question",
                            "name": question.title,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": question.content.substring(0, 200)
                            }
                        }))
                    })
                }}
            />
        </div>
    );
}