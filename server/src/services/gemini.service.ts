import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';
import { AppError } from '../middlewares/errorHandler.js';
import type { GitHubCommit, GitHubPullRequest } from '../types/index.js';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(config.llm.geminiApiKey);

/**
 * Generate a blog post from GitHub commits
 */
export async function generateBlogPostFromCommits(
  commits: GitHubCommit[],
  owner: string,
  repo: string
): Promise<string> {
  if (!config.llm.geminiApiKey) {
    throw new AppError(500, 'Gemini API key is not configured');
  }

  if (commits.length === 0) {
    throw new AppError(400, 'No commits provided to generate blog post');
  }

  // Prepare commit data for the prompt
  const commitSummary = commits
    .map((commit, index) => {
      return `${index + 1}. ${commit.commit.message}\n   Author: ${commit.commit.author.name}\n   Date: ${new Date(commit.commit.author.date).toLocaleDateString()}`;
    })
    .join('\n\n');

  const prompt = `You are a technical blog writer. Based on the following GitHub commits from the repository "${owner}/${repo}", write an engaging and informative blog post that explains what was accomplished in these commits.

Commits:
${commitSummary}

Please write a blog post that:
1. Has an engaging title
2. Provides an overview of the changes
3. Explains the technical details in an accessible way
4. Highlights the key improvements or features
5. Is written in a professional but friendly tone
6. Is approximately 300-500 words

Format the output as markdown with the title as an H1 heading.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new AppError(500, 'Failed to generate blog post with Gemini');
  }
}

/**
 * Generate a blog post from GitHub pull requests
 */
export async function generateBlogPostFromPRs(
  pullRequests: GitHubPullRequest[],
  owner: string,
  repo: string
): Promise<string> {
  if (!config.llm.geminiApiKey) {
    throw new AppError(500, 'Gemini API key is not configured');
  }

  if (pullRequests.length === 0) {
    throw new AppError(400, 'No pull requests provided to generate blog post');
  }

  // Prepare PR data for the prompt
  const prSummary = pullRequests
    .map((pr, index) => {
      return `${index + 1}. ${pr.title}\n   State: ${pr.state}\n   Author: ${pr.user.login}\n   Created: ${new Date(pr.created_at).toLocaleDateString()}\n   ${pr.body ? `Description: ${pr.body.substring(0, 200)}...` : ''}`;
    })
    .join('\n\n');

  const prompt = `You are a technical blog writer. Based on the following pull requests from the repository "${owner}/${repo}", write an engaging and informative blog post that explains the development activity and improvements.

Pull Requests:
${prSummary}

Please write a blog post that:
1. Has an engaging title
2. Provides an overview of the development activity
3. Explains the key features or fixes being worked on
4. Highlights the collaborative nature of the development
5. Is written in a professional but friendly tone
6. Is approximately 300-500 words

Format the output as markdown with the title as an H1 heading.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new AppError(500, 'Failed to generate blog post with Gemini');
  }
}

/**
 * Generate a detailed blog post from a single GitHub commit
 */
export async function generateBlogPostFromSingleCommit(
  commit: GitHubCommit,
  owner: string,
  repo: string
): Promise<string> {
  if (!config.llm.geminiApiKey) {
    throw new AppError(500, 'Gemini API key is not configured');
  }

  // Extract commit details
  const commitMessage = commit.commit.message;
  const author = commit.commit.author.name;
  const date = new Date(commit.commit.author.date).toLocaleDateString();
  const sha = commit.sha.substring(0, 7);

  const prompt = `You are a technical blog writer. Write a detailed and engaging blog post about the following GitHub commit from the repository "${owner}/${repo}".

Commit Details:
- Message: ${commitMessage}
- Author: ${author}
- Date: ${date}
- SHA: ${sha}

Please write a comprehensive blog post that:
1. Has a catchy, descriptive title (use ## H2 heading)
2. Starts with an introduction that provides context about what this commit accomplishes
3. Includes a "Technical Implementation" section explaining what was changed and how
4. Has an "Impact & Benefits" section discussing why this change matters
5. Ends with a brief conclusion
6. Is written in a professional but approachable tone
7. Is approximately 400-600 words
8. Uses markdown formatting with proper headings, bullet points, and emphasis where appropriate

Focus on making the technical details accessible while still being informative for developers. If the commit message is brief, use your knowledge to expand on what such changes typically involve.

Format the output as clean markdown.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new AppError(500, 'Failed to generate blog post with Gemini');
  }
}

/**
 * Simple chat with Gemini
 */
export async function chatWithGemini(message: string): Promise<string> {
  if (!config.llm.geminiApiKey) {
    throw new AppError(500, 'Gemini API key is not configured');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new AppError(500, 'Failed to chat with Gemini');
  }
}
