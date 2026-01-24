import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { parseGitHubLinks, fetchGitHubCode, generateHash } from '@/lib/github';

// GET /api/docs - Get all documents or single document
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const doc = store.getDocument(id);
      if (!doc) {
        return NextResponse.json(
          { error: 'Document not found' },
          { status: 404 }
        );
      }

      // Include code links
      const codeLinks = store.getCodeLinksForDocument(id);
      return NextResponse.json({ ...doc, codeLinks });
    }

    const docs = store.getAllDocuments();
    return NextResponse.json(docs);
  } catch (error) {
    console.error('GET /api/docs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/docs - Create new document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Create document
    const doc = store.createDocument({
      title: title.trim(),
      content: content || '',
      codeLinks: [],
    });

    // Parse and create code links
    const parsedLinks = parseGitHubLinks(content || '');
    const codeLinks = await Promise.all(
      parsedLinks.map(async (parsed) => {
        const code = await fetchGitHubCode(
          parsed.repo,
          parsed.filePath,
          parsed.lineStart,
          parsed.lineEnd
        );
        
        return store.createCodeLink({
          documentId: doc.id,
          repo: parsed.repo,
          filePath: parsed.filePath,
          lineStart: parsed.lineStart,
          lineEnd: parsed.lineEnd,
          codeHash: generateHash(code),
          isStale: false,
        });
      })
    );

    return NextResponse.json(
      { ...doc, codeLinks },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/docs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/docs - Update document
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, content } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    const doc = store.updateDocument(id, { title, content });
    if (!doc) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Update code links
    store.deleteCodeLinksForDocument(id);
    const parsedLinks = parseGitHubLinks(content || '');
    const codeLinks = await Promise.all(
      parsedLinks.map(async (parsed) => {
        const code = await fetchGitHubCode(
          parsed.repo,
          parsed.filePath,
          parsed.lineStart,
          parsed.lineEnd
        );
        
        return store.createCodeLink({
          documentId: id,
          repo: parsed.repo,
          filePath: parsed.filePath,
          lineStart: parsed.lineStart,
          lineEnd: parsed.lineEnd,
          codeHash: generateHash(code),
          isStale: false,
        });
      })
    );

    return NextResponse.json({ ...doc, codeLinks });
  } catch (error) {
    console.error('PUT /api/docs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/docs - Delete document
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    store.deleteCodeLinksForDocument(id);
    const deleted = store.deleteDocument(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/docs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}