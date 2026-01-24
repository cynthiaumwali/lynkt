// lib/github.ts - GitHub integration utilities

import { CodeLink } from '@/types';

export interface ParsedGitHubLink {
  repo: string;
  filePath: string;
  lineStart: number;
  lineEnd: number;
  rawText: string;
}

/**
 * Parse GitHub links from markdown content
 * Format: github:repo/path/to/file.js#L10-25
 */
export function parseGitHubLinks(content: string): ParsedGitHubLink[] {
  const regex = /github:([^\/\s]+)\/([^#\s]+)#L(\d+)-(\d+)/g;
  const links: ParsedGitHubLink[] = [];
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    links.push({
      repo: match[1],
      filePath: match[2],
      lineStart: parseInt(match[3]),
      lineEnd: parseInt(match[4]),
      rawText: match[0],
    });
  }
  
  return links;
}

/**
 * Simulate fetching code from GitHub
 * In production, this would call the GitHub API
 */
export async function fetchGitHubCode(
  repo: string,
  filePath: string,
  lineStart: number,
  lineEnd: number
): Promise<string> {
  // Simulated code snippets for demo
  const mockCode: Record<string, string> = {
    'myapp/src/auth/jwt.js': `function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: '24h'
  });
}`,
    'myapp/src/handlers/login.js': `async function handleLogin(req, res) {
  const { email, password } = req.body;
  
  const user = await User.findByEmail(email);
  if (!user || !await user.verifyPassword(password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = generateToken(user);
  res.json({ token, user });
}`,
    'myapp/src/middleware/auth.js': `function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}`,
  };

  const key = `${repo}/${filePath}`;
  const code = mockCode[key] || `// Code from ${filePath}\n// Lines ${lineStart}-${lineEnd}`;
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return code;
}

/**
 * Generate hash for code content
 */
export function generateHash(content: string): string {
  // Simple hash function for demo
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Check if the code has changed
 */
export async function checkCodeChanged(
  link: CodeLink
): Promise<{ isStale: boolean; currentHash: string }> {
  const currentCode = await fetchGitHubCode(
    link.repo,
    link.filePath,
    link.lineStart,
    link.lineEnd
  );
  
  const currentHash = generateHash(currentCode);
  const isStale = currentHash !== link.codeHash;
  
  return { isStale, currentHash };
}