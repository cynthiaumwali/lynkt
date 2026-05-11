import { NextRequest, NextResponse } from 'next/server';
import {
  getDocument,
  getCodeLinksForDocument,
  updateCodeLink,
  getGithubToken,
} from '@/lib/supabase/queries';
import { checkCodeChanged } from '@/lib/github';
import { createSupabaseClient, getUser } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const fallbackToken = process.env.GITHUB_TOKEN!;
    const body = await request.json();
    const { documentId } = body;

    const supabase = await createSupabaseClient();
    const user = await getUser(supabase);
    let token = await getGithubToken(supabase, user.id);

    if (!token) {
        token = fallbackToken;
    }

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    const doc = await getDocument(supabase, documentId);
    if (!doc) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    const codeLinks = await getCodeLinksForDocument(supabase, documentId);
    
    const results = await Promise.all(
      codeLinks.map(async (link) => {
        const { isStale, currentHash } = await checkCodeChanged(link, token || '');

        await updateCodeLink(supabase, link.id, isStale, currentHash);

        //Claude AI doc Updates - 
        return {
          filePath: link.file_path,
          isStale,
          previousHash: link.code_hash,
          currentHash,
        };
      })
    );

    return NextResponse.json({
      documentId,
      results,
      totalLinks: codeLinks.length,
      staleLinks: results.filter((r) => r.isStale).length,
    });
  } catch (error) {
    console.error('POST /api/github/check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}