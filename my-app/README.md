# AI Document Summary App

A Next.js application that allows users to upload documents, extract their content, and generate AI-powered summaries using GitHub Models API and Supabase for storage and database.

## Features

- 📤 **Document Upload**: Upload TXT, PDF, DOC, DOCX files (up to 10MB)
- 📁 **File Management**: View, list, and delete uploaded documents
- 👁️ **Document Viewer**: Preview document content before summarizing
- 🤖 **AI Summarization**: Generate concise summaries using GPT-4o-mini
- 💾 **Cloud Storage**: Files stored in Supabase Object Storage
- 🗄️ **Database**: Document metadata and summaries stored in PostgreSQL
- 📱 **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Serverless Functions)
- **Storage**: Supabase Storage (S3-compatible)
- **Database**: Supabase PostgreSQL
- **AI**: GitHub Models API (GPT-4o-mini)
- **Deployment**: Vercel

## Project Structure

```
my-app/
├── app/
│   ├── api/              # API routes (backend)
│   │   ├── health/       # Health check endpoint
│   │   ├── upload/       # File upload endpoint
│   │   ├── files/        # List files endpoint
│   │   ├── extract/      # Extract text from document
│   │   ├── summarize/    # AI summarization endpoint
│   │   └── delete/       # Delete file endpoint
│   ├── lib/              # Shared utilities
│   │   └── supabase.ts   # Supabase client configuration
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main application page
│   └── globals.css       # Global styles
├── database/
│   └── schema.sql        # Database schema
├── public/               # Static assets
├── .env.local            # Environment variables (not committed)
├── .env.example          # Environment variables template
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── package.json          # Dependencies
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- Supabase account
- GitHub account with access to Models API

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Create a storage bucket named `documents` (set to Public)
3. Run the SQL schema from `database/schema.sql` in Supabase SQL Editor
4. Get your project URL and anon key from Settings → API

### 4. Set Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GITHUB_TOKEN=your-github-token
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload a Document**:
   - Click "Upload Document" button
   - Select a TXT, PDF, DOC, or DOCX file
   - File will appear in the Documents panel

2. **View Document**:
   - Click on a document in the list
   - Content will display in the middle panel

3. **Generate Summary**:
   - With a document selected, click "Generate AI Summary"
   - Wait 5-10 seconds for AI processing
   - Summary appears in the right panel

4. **Delete Document**:
   - Click the ✕ button on any document
   - Confirm deletion
   - File and database record will be removed

## API Endpoints

### `GET /api/health`
Health check endpoint

**Response**:
```json
{
  "ok": true,
  "message": "Next.js backend is running"
}
```

### `POST /api/upload`
Upload a document

**Request**: multipart/form-data with `file` field

**Response**:
```json
{
  "success": true,
  "fileName": "timestamp-filename.txt",
  "size": 1234,
  "url": "https://..."
}
```

### `GET /api/files`
List all uploaded files

**Response**:
```json
{
  "success": true,
  "files": [
    {
      "name": "file.txt",
      "size": 1234,
      "createdAt": "2024-01-01T00:00:00Z",
      "url": "https://..."
    }
  ]
}
```

### `POST /api/extract`
Extract text from a document

**Request**:
```json
{
  "fileName": "file.txt"
}
```

**Response**:
```json
{
  "success": true,
  "text": "extracted content...",
  "fileName": "file.txt"
}
```

### `POST /api/summarize`
Generate AI summary

**Request**:
```json
{
  "text": "document content...",
  "fileName": "file.txt"
}
```

**Response**:
```json
{
  "success": true,
  "summary": "AI-generated summary..."
}
```

### `DELETE /api/delete?fileName=file.txt`
Delete a document

**Response**:
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

## Database Schema

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  storage_path VARCHAR(500) NOT NULL,
  content TEXT,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed deployment instructions to Vercel.

Quick deploy:
```bash
vercel --prod
```

Don't forget to set environment variables in Vercel Dashboard!

## Troubleshooting

**Build errors**: Clear `.next` folder and rebuild
```bash
rm -rf .next
npm run build
```

**Supabase connection errors**: 
- Verify environment variables
- Check Supabase project is active
- Ensure RLS policies allow access

**AI summarization fails**:
- Verify GitHub token is valid
- Check token has Models API access
- Review function logs for errors

## License

This project is for educational purposes.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [GitHub Models](https://github.com/marketplace/models)
- [Tailwind CSS](https://tailwindcss.com/docs)
