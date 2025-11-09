import { useState } from 'react';

interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
}

function App() {
  const [owner, setOwner] = useState('travelerjin99');
  const [repo, setRepo] = useState('');
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCommits = async () => {
    if (!repo) {
      setError('Please enter a repository name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // fetch commits from backend server(:3000)
      const response = await fetch(
        `http://localhost:3000/api/github/repos/${owner}/${repo}/commits?limit=10`
      );
      const data = await response.json();

      if (data.success) {
        setCommits(data.data);
      } else {
        setError(data.error || 'Failed to fetch commits');
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the backend is running on port 3000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            GitHub Activity Viewer
          </h1>
          <p className="text-gray-300 text-lg">
            View commits from @{owner}'s GitHub repositories
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-2xl border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Owner
              </label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="travelerjin99"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">
                Repository
              </label>
              <input
                type="text"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchCommits()}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="my-repo"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchCommits}
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? 'Loading...' : 'Fetch Commits'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Commits List */}
        {commits.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">
              Recent Commits ({commits.length})
            </h2>
            <div className="space-y-4">
              {commits.map((commit) => (
                <div
                  key={commit.sha}
                  className="bg-white/5 border border-white/10 rounded-lg p-5 hover:bg-white/10 transition duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white font-medium mb-2 line-clamp-2">
                        {commit.commit.message.split('\n')[0]}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <span>👤 {commit.commit.author.name}</span>
                        <span>📅 {new Date(commit.commit.author.date).toLocaleDateString()}</span>
                        <span className="text-gray-400 font-mono text-xs">
                          {commit.sha.slice(0, 7)}
                        </span>
                      </div>
                    </div>
                    <a
                      href={commit.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white text-sm rounded-lg transition"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {commits.length === 0 && !loading && !error && (
          <div className="text-center text-gray-400 py-12">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg">Enter a repository name to view commits</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
