export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  codeLinks: CodeLink[];
}

export interface CodeLink {
  id: string;
  documentId: string;
  repo: string;
  filePath: string;
  lineStart: number;
  lineEnd: number;
  codeHash: string;
  isStale: boolean;
  lastChecked: string;
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