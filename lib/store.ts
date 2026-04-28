import { Document, CodeLink } from '@/types';

class DataStore {
  private documents: Map<string, Document> = new Map();
  private codeLinks: Map<string, CodeLink> = new Map();

  // Documents
  getAllDocuments(): Document[] {
    return Array.from(this.documents.values()).sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }

  getDocument(id: string): Document | undefined {
    return this.documents.get(id);
  }

  createDocument(doc: Omit<Document, 'id' | 'created_at' | 'updated_at'>): Document {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    const newDoc: Document = {
      ...doc,
      id,
      created_at: now,
      updated_at: now,
    };
    this.documents.set(id, newDoc);
    return newDoc;
  }

  updateDocument(id: string, updates: Partial<Document>): Document | null {
    const doc = this.documents.get(id);
    if (!doc) return null;
    
    const updated: Document = {
      ...doc,
      ...updates,
      id: doc.id,
      created_at: doc.created_at,
      updated_at: new Date().toISOString(),
    };
    this.documents.set(id, updated);
    return updated;
  }

  deleteDocument(id: string): boolean {
    return this.documents.delete(id);
  }

  // Code Links
  getCodeLinksForDocument(documentId: string): CodeLink[] {
    return Array.from(this.codeLinks.values()).filter(
      link => link.document_id === documentId
    );
  }

  getCodeLink(id: string): CodeLink | undefined {
    return this.codeLinks.get(id);
  }

  createCodeLink(link: Omit<CodeLink, 'id' | 'last_checked'>): CodeLink {
    const id = `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newLink: CodeLink = {
      ...link,
      id,
      last_checked: new Date().toISOString(),
    };
    this.codeLinks.set(id, newLink);
    return newLink;
  }

  updateCodeLink(id: string, updates: Partial<CodeLink>): CodeLink | null {
    const link = this.codeLinks.get(id);
    if (!link) return null;
    
    const updated: CodeLink = {
      ...link,
      ...updates,
      last_checked: new Date().toISOString(),
    };
    this.codeLinks.set(id, updated);
    return updated;
  }

  deleteCodeLinksForDocument(documentId: string): void {
    Array.from(this.codeLinks.entries()).forEach(([id, link]) => {
      if (link.document_id === documentId) {
        this.codeLinks.delete(id);
      }
    });
  }
}

// Singleton instance
export const store = new DataStore();

// Seed with demo data
store.createDocument({
  title: 'Authentication System',
  content: `# Authentication System Documentation

Our application uses JWT (JSON Web Tokens) for user authentication.

## Implementation

The main authentication logic is implemented here:
github:myapp/src/auth/jwt.js#L10-25

## Token Generation

Token generation happens in the login handler:
github:myapp/src/handlers/login.js#L45-60

## Security Considerations

We validate tokens on every request using middleware:
github:myapp/src/middleware/auth.js#L15-30`,
  codeLinks: [],
});