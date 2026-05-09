import { CodeLink } from '@/types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

//fetch documents
export async function getAllDocuments(supabase: SupabaseClient): Promise<Document[]> {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('updated_at', { ascending: false }
        );
    if (error) throw error;
    return data as Document[];
}

//fetch single document by id
export async function getDocument(supabase: SupabaseClient, id: string): Promise<Document | null> {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data as Document;
}

//create document
export async function createDocument(supabase: SupabaseClient, id: string, title: string, content: string, userId: string): Promise<Document> {
    console.log('Creating document with:', { id, title, userId })
    const { data, error } = await supabase
        .from('documents')
        .insert({ id, title, content, user_id: userId })
        .select()
        .single()
    if (error) throw error;
    return data as Document;
}

//update document
export async function updateDocument(supabase: SupabaseClient, id: string, title: string, content: string, userId: string): Promise<Document> {
    const { data, error } = await supabase
        .from('documents')
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
    if (error) throw error;
    return data as Document;
}

//delete document
export async function deleteDocument(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
    if (error) throw error;
}

//get all code links
export async function getCodeLinksForDocument(supabase: SupabaseClient, documentId: string): Promise<CodeLink[]> {
    const { data, error } = await supabase
        .from('code_links')
        .select('*')
        .eq('document_id', documentId);
    if (error) throw error;
    return data as CodeLink[];
}

//get single code link by id
export async function getCodeLink(supabase: SupabaseClient, id: string): Promise<CodeLink | null> {
    const { data, error } = await supabase
        .from('code_links')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data as CodeLink;
}


//create code link
export async function createCodeLink(supabase: SupabaseClient, id: string, documentId: string, owner: string, repo: string, filePath: string, lineStart: number, lineEnd: number, codeHash: string): Promise<CodeLink> {
    const { data, error } = await supabase
        .from('code_links')
        .insert({ id, document_id: documentId, owner, repo, file_path: filePath, line_start: lineStart, line_end: lineEnd, code_hash: codeHash, is_stale: false })
        .select()
        .single();
    if (error) throw error;
    return data as CodeLink;
}

//delete code link
export async function deleteCodeLinksForDocument(supabase: SupabaseClient, documentId: string): Promise<void> {
    const { error } = await supabase
        .from('code_links')
        .delete()
        .eq('document_id', documentId);

    if (error) throw error;
}

//update code link
export async function updateCodeLink(supabase: SupabaseClient, id: string, isStale: boolean, codeHash: string): Promise<CodeLink> {
    const { data, error } = await supabase
        .from('code_links')
        .update({ is_stale: isStale, code_hash: codeHash, last_checked: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data as CodeLink;
}

//get token
export async function getGithubToken(supabase: SupabaseClient, user_id: string): Promise<string | null> {
    const { data, error } = await supabase.from('github_tokens')
        .select('tokens')
        .eq('user_id', user_id)
        .single();
    if (error) throw error;
    return data ? data.tokens : null;
}