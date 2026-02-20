import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error('Supabase list error:', error);
      return NextResponse.json(
        { error: `Failed to list files: ${error.message}` },
        { status: 500 }
      );
    }

    // Get public URLs for all files
    const filesWithUrls = data.map(file => {
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(file.name);
      
      return {
        name: file.name,
        size: file.metadata?.size || 0,
        createdAt: file.created_at,
        updatedAt: file.updated_at,
        url: urlData.publicUrl
      };
    });

    return NextResponse.json({
      success: true,
      files: filesWithUrls
    });

  } catch (error) {
    console.error('List files error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
