import { useState } from 'react';
import CommitDetailPanel from './components/CommitDetailPanel';
import BlogPostsPage from './components/BlogPostsPage';
import { useCommits, useSummaryGenerator } from './hooks';
import { useBlog } from './context/BlogContext';
import type { Commit } from './types';

type Page = 'commits' | 'saved-posts';

function App() {
  const [owner, setOwner] = useState('travelerjin99');
  const [repo, setRepo] = useState('');
  const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('commits');

  // Custom hooks
  const { commits, status: commitsStatus, error: commitsError, fetchCommits } = useCommits();
  const { summary, status: summaryStatus, error: summaryError, generateSummary, reset: resetSummary } = useSummaryGenerator();
  const { savePost, state: blogState } = useBlog();

  const handleFetchCommits = () => {
    fetchCommits(owner, repo);
  };

  const selectCommit = (commit: Commit) => {
    setSelectedCommit(commit);
    resetSummary();
  };

  const handleGenerateSummary = (commit: Commit) => {
    generateSummary(commit, owner, repo);
  };

  const handleSaveAsBlogPost = (title: string, content: string) => {
    if (!selectedCommit) return;

    savePost({
      title,
      content,
      commitSha: selectedCommit.sha,
      commitMessage: selectedCommit.commit.message,
      author: selectedCommit.commit.author.name,
      repository: `${owner}/${repo}`,
    });

    alert('Blog post saved successfully!');
  };

  const isLoading = commitsStatus === 'loading';

  // If on saved posts page, render that instead
  if (currentPage === 'saved-posts') {
    return <BlogPostsPage onBack={() => setCurrentPage('commits')} />;
  }

  // Main commits page
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Smart Blog</h1>
            <p className="text-gray-300">Generate AI summaries from GitHub commits</p>
          </div>
          <button
            onClick={() => setCurrentPage('saved-posts')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Saved Posts ({blogState.posts.data.length})
          </button>
        </div>

        {/* Input Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 shadow-xl border border-white/20">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-white font-medium mb-2">Repository</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="w-40 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="owner"
                />
                <span className="text-white py-2">/</span>
                <input
                  type="text"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFetchCommits()}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="repository"
                />
              </div>
            </div>
            <button
              onClick={handleFetchCommits}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition duration-200"
            >
              {isLoading ? 'Loading...' : 'Fetch'}
            </button>
          </div>

          {commitsError && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {commitsError}
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Commits List */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">
              Recent Commits {commits.length > 0 && `(${commits.length})`}
            </h2>

            {commits.length === 0 && !isLoading && (
              <div className="text-center text-gray-400 py-12">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>Enter a repository to view commits</p>
              </div>
            )}

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {commits.map((commit) => (
                <div
                  key={commit.sha}
                  onClick={() => selectCommit(commit)}
                  className={`bg-white/5 border rounded-lg p-4 cursor-pointer transition duration-200 ${
                    selectedCommit?.sha === commit.sha
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium mb-2 line-clamp-2">
                        {commit.commit.message.split('\n')[0]}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span>{commit.commit.author.name}</span>
                        <span>{new Date(commit.commit.author.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectCommit(commit);
                        handleGenerateSummary(commit);
                      }}
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition duration-200 whitespace-nowrap"
                    >
                      Generate Summary
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Selected Commit Detail */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 min-h-[500px]">
            <CommitDetailPanel
              commit={selectedCommit}
              summary={summary}
              status={summaryStatus}
              error={summaryError}
              onGenerateSummary={handleGenerateSummary}
              onSaveAsBlogPost={handleSaveAsBlogPost}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
