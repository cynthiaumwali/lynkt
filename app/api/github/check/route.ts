import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { checkCodeChanged } from '@/lib/github';

// POST /api/github/check - Check if code has changed
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

    const doc = store.getDocument(documentId);
    if (!doc) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    const codeLinks = store.getCodeLinksForDocument(documentId);
    
    // Check each code link
    const results = await Promise.all(
      codeLinks.map(async (link) => {
        const { isStale, currentHash } = await checkCodeChanged(link);
        
        // Update link with new status
        store.updateCodeLink(link.id, {
          isStale,
          codeHash: currentHash,
        });

        return {
          linkId: link.id,
          filePath: link.filePath,
          isStale,
          previousHash: link.codeHash,
          currentHash,
        };
      })
    );

    return NextResponse.json({
      documentId,
      results,
      totalLinks: codeLinks.length,
      staleLinks: results.filter(r => r.isStale).length,
    });
  } catch (error) {
    console.error('POST /api/github/check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}