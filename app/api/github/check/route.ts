import { NextRequest, NextResponse } from 'next/server';
import {
  getDocument,
  getCodeLinksForDocument,
  updateCodeLink,
} from '@/lib/supabase';
import { checkCodeChanged } from '@/lib/github';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId } = body;

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    const doc = await getDocument(documentId);
    if (!doc) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    const codeLinks = await getCodeLinksForDocument(documentId);

    const results = await Promise.all(
      codeLinks.map(async (link) => {
        const { isStale, currentHash } = await checkCodeChanged(link);

        await updateCodeLink(link.id, isStale, currentHash);

        return {
          linkId: link.id,
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