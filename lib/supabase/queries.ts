import { CodeLink } from '@/types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

//fetch documents
export async function getAllDocuments(): Promise<Document[]> {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('updated_at', { ascending: false }
        );
    if (error) throw error;
    return data as Document[];
}

//fetch single document by id
export async function getDocument(id: string): Promise<Document | null> {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data as Document;
}

//create document
export async function createDocument(id: string, title: string, content: string): Promise<Document> {
    const { data, error } = await supabase
        .from('documents')
        .insert({ id, title, content })
        .select()
        .single();
    if (error) throw error;
    return data as Document;
}

//update document
export async function updateDocument(id: string, title: string, content: string): Promise<Document> {
    const { data, error } = await supabase
        .from('documents')
        .update({ title, content, updated_at: new Date().toISOString()  })
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data as Document;
}

//delete document
export async function deleteDocument(id: string): Promise<void> {
    const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
    if (error) throw error;
}

//get all code links
export async function getCodeLinksForDocument(documentId: string): Promise<CodeLink[]> {
    const { data, error } = await supabase
        .from('code_links')
        .select('*')
        .eq('document_id', documentId);
    if (error) throw error;
    return data as CodeLink[];
}

//get single code link by id
export async function getCodeLink(id:string): Promise<CodeLink | null> {
    const {data, error} = await supabase
    .from('code_links')
    .select('*')
    .eq('id', id)
    .single();
    if (error) throw error;
    return data as CodeLink;
}


//create code link
export async function createCodeLink(id:string, documentId: string, owner: string, repo: string, filePath: string, lineStart: number, lineEnd: number, codeHash: string): Promise<CodeLink> {
    const {data, error} = await supabase
    .from('code_links')
    .insert({ id, document_id: documentId, owner, repo, file_path: filePath, line_start: lineStart, line_end: lineEnd, code_hash: codeHash, is_stale: false })
    .select()
    .single();
    if (error) throw error;
    return data as CodeLink;
}

//delete code link
export async function deleteCodeLinksForDocument(documentId: string): Promise<void> {
  const { error } = await supabase
    .from('code_links')
    .delete()
    .eq('document_id', documentId);

  if (error) throw error;
}

//update code link
export async function updateCodeLink(id: string, isStale: boolean, codeHash: string): Promise<CodeLink> {
    const { data, error } = await supabase
        .from('code_links')
        .update({ is_stale: isStale, code_hash: codeHash, last_checked: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data as CodeLink;
}