import { QuestionsList } from '@/components/QuestionsList';
import { ChatWrapper } from '@/components/ChatWrapper';
import { SearchWrapper } from '@/components/SearchWrapper';
import { ProgressiveEnhancement } from '@/components/ProgressiveEnhancement';

// Server Component - renders on server for SEO
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header - Server Rendered */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              AI Chat Application
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Search for questions and get AI-powered responses with nested comments
            </p>

            {/* Search - Client Component Wrapper with Progressive Enhancement */}
            <div className="flex justify-center mb-12">
              <ProgressiveEnhancement
                fallback={
                  <div className="w-full max-w-2xl p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                      Search functionality will be available when JavaScript loads
                    </p>
                  </div>
                }
              >
                <SearchWrapper />
              </ProgressiveEnhancement>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Questions List - Server Component */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <QuestionsList />
            </div>

            {/* Chat Interface - Client Component Wrapper with Progressive Enhancement */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <ProgressiveEnhancement
                fallback={
                  <div className="p-12 text-center">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
                      Chat Interface
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Interactive chat will be available when JavaScript loads
                    </p>
                  </div>
                }
              >
                <ChatWrapper />
              </ProgressiveEnhancement>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
