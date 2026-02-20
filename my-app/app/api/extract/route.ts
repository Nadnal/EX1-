import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { fileName } = await request.json();

    if (!fileName) {
      return NextResponse.json(
        { error: 'File name is required' },
        { status: 400 }
      );
    }

    // Download file from Supabase
    const { data, error } = await supabase.storage
      .from('documents')
      .download(fileName);

    if (error) {
      console.error('Supabase download error:', error);
      return NextResponse.json(
        { error: `Download failed: ${error.message}` },
        { status: 500 }
      );
    }

    // Convert to text based on file type
    let text = '';
    const fileType = fileName.toLowerCase();

    if (fileType.endsWith('.txt')) {
      text = await data.text();
    } else if (fileType.endsWith('.pdf')) {
      // For PDF files, we'll return a placeholder
      // In production, you'd use a library like pdf-parse
      text = '[PDF content extraction requires additional setup]';
    } else if (fileType.endsWith('.doc') || fileType.endsWith('.docx')) {
      // For DOC/DOCX files, we'll return a placeholder
      // In production, you'd use a library like mammoth
      text = '[DOC/DOCX content extraction requires additional setup]';
    } else {
      text = await data.text();
    }

    // Limit text length for preview
    const maxLength = 50000;
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + '... (truncated)';
    }

    return NextResponse.json({
      success: true,
      text: text,
      fileName: fileName
    });

  } catch (error) {
    console.error('Extract error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
