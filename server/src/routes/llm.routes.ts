import express from 'express';
import { generateFromCommits, generateFromPRs, generateFromSingleCommit, chat } from '../controllers/llm.controller.js';

const router = express.Router();

/**
 * @route   GET /api/llm/generate/commits/:owner/:repo
 * @desc    Generate blog post from repository commits
 * @access  Public
 * @query   limit - Number of commits to analyze (default: 10)
 */
router.get('/generate/commits/:owner/:repo', generateFromCommits);

/**
 * @route   GET /api/llm/generate/prs/:owner/:repo
 * @desc    Generate blog post from repository pull requests
 * @access  Public
 * @query   limit - Number of PRs to analyze (default: 10)
 */
router.get('/generate/prs/:owner/:repo', generateFromPRs);

/**
 * @route   POST /api/llm/generate/commit
 * @desc    Generate blog post from a single commit
 * @access  Public
 * @body    commit - The GitHub commit object
 * @body    owner - Repository owner
 * @body    repo - Repository name
 */
router.post('/generate/commit', generateFromSingleCommit);

/**
 * @route   POST /api/llm/chat
 * @desc    Simple chat with Gemini
 * @access  Public
 * @body    message - The message to send to Gemini
 */
router.post('/chat', chat);

export default router;
