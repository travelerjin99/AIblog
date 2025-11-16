import type { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { generateBlogPostFromCommits, generateBlogPostFromPRs, generateBlogPostFromSingleCommit, chatWithGemini } from '../services/gemini.service.js';
import { fetchCommitsGraphQL, fetchPullRequestsGraphQL } from '../services/github.service.js';
import type { GitHubCommit } from '../types/index.js';

/**
 * Generate a blog post from repository commits
 * GET /api/llm/generate/commits/:owner/:repo
 */
export const generateFromCommits = asyncHandler(async (req: Request, res: Response) => {
  const { owner, repo } = req.params as { owner: string; repo: string };
  const limit = parseInt(req.query.limit as string) || 10;

  // Fetch commits from GitHub
  const commits = await fetchCommitsGraphQL(owner, repo, limit);

  // Generate blog post using Gemini
  const blogPost = await generateBlogPostFromCommits(commits, owner, repo);

  res.json({
    success: true,
    data: {
      blogPost,
      commitsAnalyzed: commits.length,
      repository: `${owner}/${repo}`,
    },
  });
});

/**
 * Generate a blog post from repository pull requests
 * GET /api/llm/generate/prs/:owner/:repo
 */
export const generateFromPRs = asyncHandler(async (req: Request, res: Response) => {
  const { owner, repo } = req.params as { owner: string; repo: string };
  const limit = parseInt(req.query.limit as string) || 10;

  // Fetch PRs from GitHub
  const pullRequests = await fetchPullRequestsGraphQL(owner, repo, limit);

  // Generate blog post using Gemini
  const blogPost = await generateBlogPostFromPRs(pullRequests, owner, repo);

  res.json({
    success: true,
    data: {
      blogPost,
      prsAnalyzed: pullRequests.length,
      repository: `${owner}/${repo}`,
    },
  });
});

/**
 * Generate a blog post from a single commit
 * POST /api/llm/generate/commit
 */
export const generateFromSingleCommit = asyncHandler(async (req: Request, res: Response) => {
  const { commit, owner, repo } = req.body as { commit: GitHubCommit; owner: string; repo: string };

  if (!commit || !owner || !repo) {
    res.status(400).json({
      success: false,
      error: 'Commit data, owner, and repo are required',
    });
    return;
  }

  // Generate blog post using Gemini
  const blogPost = await generateBlogPostFromSingleCommit(commit, owner, repo);

  res.json({
    success: true,
    data: {
      blogPost,
      commit: {
        sha: commit.sha.substring(0, 7),
        message: commit.commit.message.split('\n')[0],
        author: commit.commit.author.name,
      },
    },
  });
});

/**
 * Simple chat with Gemini
 * POST /api/llm/chat
 */
export const chat = asyncHandler(async (req: Request, res: Response) => {
  const { message } = req.body as { message: string };

  if (!message) {
    res.status(400).json({
      success: false,
      error: 'Message is required',
    });
    return;
  }

  // Chat with Gemini
  const response = await chatWithGemini(message);

  res.json({
    success: true,
    data: {
      response,
    },
  });
});
