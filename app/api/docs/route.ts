import { NextRequest, NextResponse } from 'next/server';
import {
  getAllDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  getCodeLinksForDocument,
  createCodeLink,
  deleteCodeLinksForDocument,
  getGithubToken,
} from '@/lib/supabase/queries';
import { parseGitHubLinks, fetchGitHubCode, generateHash } from '@/lib/github';
import { createSupabaseClient, getUser } from '@/lib/supabase/server';

// GET /api/docs
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const doc = await getDocument(supabase, id);
      if (!doc) {
        return NextResponse.json(
          { error: 'Document not found' },
          { status: 404 }
        );
      }

      const codeLinks = await getCodeLinksForDocument(supabase, id);
      return NextResponse.json({ ...doc, codeLinks });
    }

    const docs = await getAllDocuments(supabase);
    return NextResponse.json(docs);
  } catch (error) {
    console.error('GET /api/docs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/docs
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient();
    const user = await getUser(supabase);
    const token = await getGithubToken(supabase, user.id);
    const body = await request.json();
    const { title, content } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const doc = await createDocument(supabase, id, title.trim(), content || '', user.id);

    const parsedLinks = parseGitHubLinks(content || '');
    const codeLinks = await Promise.all(
      parsedLinks.map(async (parsed) => {
        const code = await fetchGitHubCode(
          parsed.owner,
          parsed.repo,
          parsed.filePath,
          token || ''
        );

        const linkId = `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return await createCodeLink(supabase, linkId, id, parsed.owner, parsed.repo, parsed.filePath, parsed.lineStart, parsed.lineEnd, generateHash(code));
      })
    );

    return NextResponse.json({ ...doc, codeLinks }, { status: 201 });

  } catch (error) {
    console.error('POST /api/docs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/docs
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient();
    const user = await getUser(supabase);
    const token = await getGithubToken(supabase, user.id);
    const body = await request.json();
    const { id, title, content } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    const doc = await updateDocument(supabase, id, title, content, user.id);
    if (!doc) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    await deleteCodeLinksForDocument(supabase, id);
    const parsedLinks = parseGitHubLinks(content || '');
    const codeLinks = await Promise.all(
      parsedLinks.map(async (parsed) => {
        const code = await fetchGitHubCode(
          parsed.owner,
          parsed.repo,
          parsed.filePath,
          token || ''
        );

        const linkId = `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return await createCodeLink(
          supabase,
          linkId,
          id,
          parsed.owner,
          parsed.repo,
          parsed.filePath,
          parsed.lineStart,
          parsed.lineEnd,
          generateHash(code)
        );
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

// DELETE /api/docs
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

    const supabase = await createSupabaseClient();
    await deleteCodeLinksForDocument(supabase, id);
    await deleteDocument(supabase, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/docs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}