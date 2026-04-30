import { CodeLink } from '@/types';

export interface ParsedGitHubLink {
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
      repo: ` ${match[1]}/${match[2]}`,
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
  repo: string,
  filePath: string,
  lineStart: number,
  lineEnd: number
): Promise<string> {
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3.raw',
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub code: ${response.status} ${response.statusText}`);
  }
  const content = await response.text();
  return content.split('\n').slice(lineStart - 1, lineEnd).join('\n');
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
  link: CodeLink
): Promise<{ isStale: boolean; currentHash: string }> {
  const currentCode = await fetchGitHubCode(
    link.repo,
    link.file_path,
    link.line_start,
    link.line_end
  );
  
  const currentHash = generateHash(currentCode);
  const isStale = currentHash !== link.code_hash;
  
  return { isStale, currentHash };
}