import { CodeLink } from '@/types';
import { Octokit } from "@octokit/core";

export interface ParsedGitHubLink {
  owner: string;
  repo: string;
  filePath: string;
  lineStart: number;
  lineEnd: number;
  rawText: string;
}

//parsing github links from document content
export function parseGitHubLinks(content: string): ParsedGitHubLink[] {
  const regex = /github:([^\/\s]+)\/([^\/\s]+)\/blob\/[^\/]+\/([^#\s]+)#L(\d+)-(\d+)/g;
  const links: ParsedGitHubLink[] = [];

  let match;
  while ((match = regex.exec(content)) !== null) {
    links.push({
      owner: match[1],
      repo: match[2],
      filePath: match[3],
      lineStart: parseInt(match[4]),
      lineEnd: parseInt(match[5]),
      rawText: match[0],
    });
  }

  return links;
}

// fetch github code
export async function fetchGitHubCode(
  owner: string,
  reponame: string,
  filePath: string,
  token: string
): Promise<string> {
  const octokit = new Octokit(token ? { auth: token } : {});
  const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: owner,
    repo: reponame,
    path: filePath,
    headers: {
      'X-GitHub-Api-Version': '2026-03-10'
    }
  })

  if (response.status !== 200) {
    throw new Error(`Failed to fetch GitHub code: ${response.status}`);
  }

  if ("content" in response.data) {
    return atob(response.data.content);
  }
  throw new Error('Expected a file');
}

//  generate hash 
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

//chack for code changes
export async function checkCodeChanged(
  link: CodeLink,
  token: string
): Promise<{ isStale: boolean; currentHash: string }> {
  const currentCode = await fetchGitHubCode(
    link.owner,
    link.repo,
    link.file_path,
    token
  );

  const currentHash = generateHash(currentCode);
  const isStale = currentHash !== link.code_hash;

  return { isStale, currentHash };
}