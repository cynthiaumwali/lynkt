export interface Document {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  codeLinks: CodeLink[];
}

export interface CodeLink {
  id: string;
  document_id: string;
  repo: string;
  file_path: string;
  line_start: number;
  line_end: number;
  code_hash: string;
  is_stale: boolean;
  last_checked: string;
}

export interface CheckCodeResponse {
  linkId: string;
  isStale: boolean;
  previousHash: string;
  currentHash: string;
}

export interface GitHubFile {
  repo: string;
  filePath: string;
  lineStart: number;
  lineEnd: number;
  content: string;
  hash: string;
}