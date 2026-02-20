## Section 6: Supabase Object Store
Supabase is an open-source Firebase alternative that provides developers with a complete backend-as-a-service platform centered around PostgreSQL, a powerful relational database system offering full SQL capabilities, real-time subscriptions, and robust extensions for scalable data management. Its object storage is an S3-compatible service designed for storing and serving files like images, videos, and user-generated content.

Website: https://supabase.com/

**Requirements**:
- Build a document upload and file management system powered by Supabase. The backend will include API endpoints to interact with Supabse.
- **Note:** The detailed requirement will be discussed in week 4 lecture.
- Make regular commits to the repository and push the update to Github.
- Capture and paste the screenshots of your steps during development and how you test the app. Show a screenshot of the documents stored in your Supabase Object Database.

Test the app in your local development environment, then deploy the app to Vercel and ensure all functionality works as expected in the deployed environment.

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Fill in project details:
   - Name: `ai-summary-app`
   - Database Password: (generate a strong password and save it)
   - Region: Choose closest to you
4. Click "Create new project" and wait for setup to complete (~2 minutes)

### Step 2: Create Storage Bucket

1. In Supabase dashboard, navigate to **Storage** in the left sidebar
2. Click **New bucket**
3. Configure bucket:
   - Name: `documents`
   - Public bucket: ✓ Enable (so files can be accessed via URL)
4. Click **Create bucket**

### Step 3: Configure Environment Variables

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - Project URL
   - `anon` `public` key (under Project API keys)

3. Update `/workspaces/EX1-/my-app/.env.local` with your actual values:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
GITHUB_TOKEN=your-github-token-here
```

### Step 4: Install Dependencies

The Supabase client library has already been installed. Verify by checking `package.json`:

```bash
cd /workspaces/EX1-/my-app
cat package.json | grep supabase
```

### Step 5: Create Supabase Client

The Supabase client configuration has been created at `app/lib/supabase.ts`. This creates a singleton client that can be imported throughout the app.

### Step 6: Create API Endpoints

The following API endpoints have been implemented:

1. **Upload API** (`app/api/upload/route.ts`):
   - Accepts file uploads via FormData
   - Validates file type (TXT, PDF, DOC, DOCX)
   - Validates file size (max 10MB)
   - Uploads to Supabase Storage
   - Returns file metadata and public URL

2. **Files List API** (`app/api/files/route.ts`):
   - Lists all files in the storage bucket
   - Returns file metadata and URLs
   - Sorted by creation date (newest first)

3. **Delete API** (`app/api/delete/route.ts`):
   - Deletes file from storage
   - Accepts fileName as query parameter

4. **Extract API** (`app/api/extract/route.ts`):
   - Downloads file from storage
   - Extracts text content
   - Currently supports TXT files (PDF/DOC need additional libraries)

### Step 7: Test the Application

1. Restart the development server (if not already running):
```bash
cd /workspaces/EX1-/my-app
npm run dev -- --port 3000
```

2. Open the application in your browser at the forwarded port

3. Test file upload:
   - Click "Upload Document" button
   - Select a `.txt` file
   - Verify file appears in the file list

4. Test file viewing:
   - Click on an uploaded file
   - Verify content displays in the Document Content panel

5. Test file deletion:
   - Click the ✕ button on a file
   - Confirm deletion
   - Verify file is removed from list

### Step 8: Verify in Supabase Dashboard

1. Go to Supabase dashboard → **Storage** → **documents** bucket
2. You should see the uploaded files listed with their timestamps

**Screenshot: Supabase Storage with uploaded files**

> [Add screenshot here showing files in Supabase Storage dashboard]

### Troubleshooting

**Issue: "Supabase upload error: new row violates row-level security policy"**
- Solution: Go to Storage → Policies and add a policy to allow public uploads (for development):
  - Target: `INSERT`
  - Policy name: `Allow public uploads`
  - USING expression: `true`

**Issue: Files upload but thumbnails show 404**
- Solution: Ensure bucket is set to "Public" in bucket settings

## Section 7: AI Summary for documents
**Requirements:**  
- **Note:** The detailed requirement will be discussed in week 4 lecture.
- Make regular commits to the repository and push the update to Github.
- Capture and paste the screenshots of your steps during development and how you test the app.
- The app should be mobile-friendly and have a responsive design.
- **Important:** You should securely handlle your API keys when pushing your code to GitHub and deploying your app to the production.
- When testing your app, try to explore some tricky and edge test cases that AI may miss. AI can help generate basic test cases, but it's the human expertise to  to think of the edge and tricky test cases that AI cannot be replace. 

Test the app in your local development environment, then deploy the app to Vercel and ensure all functionality works as expected in the deployed environment. 

### Step 1: Obtain GitHub Models API Token

GitHub Models provides free access to various AI models including GPT-4o-mini for testing and development.

1. Go to [GitHub Models](https://github.com/marketplace/models)
2. Sign in with your GitHub account
3. Browse available models and select GPT-4o-mini
4. Generate an API token from your GitHub settings:
   - Go to Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token with appropriate scopes
   - Or use GitHub Models specific token if available

5. Update `.env.local`:
```bash
GITHUB_TOKEN=your-github-token-here
```

**Important**: Never commit `.env.local` to Git. The `.gitignore` is already configured to exclude it.

### Step 2: Create Summarize API Endpoint

The summarize API endpoint has been implemented at `app/api/summarize/route.ts`. This endpoint:

1. Accepts text content from the frontend
2. Truncates text to fit within model context window (15,000 chars)
3. Sends request to GitHub Models API using GPT-4o-mini
4. Returns AI-generated summary
5. Saves summary to database (Section 8)

**API Request Format**:
```typescript
POST /api/summarize
Content-Type: application/json

{
  "text": "document content here...",
  "fileName": "optional-file-name.txt"
}
```

**API Response Format**:
```typescript
{
  "success": true,
  "summary": "AI-generated summary..."
}
```

### Step 3: Update Frontend UI

The frontend has been updated with a three-panel layout:

1. **Left Panel**: Document list and upload
2. **Middle Panel**: Document content viewer with "Generate AI Summary" button
3. **Right Panel**: AI-generated summary display

The UI is responsive and mobile-friendly using Tailwind CSS utility classes:
- `grid-cols-1 lg:grid-cols-3` - Stacks vertically on mobile, 3 columns on large screens
- Mobile-optimized touch targets and spacing

### Step 4: Test AI Summarization

1. Create a test document (`test.txt`) with sample content:
```bash
echo "Artificial Intelligence (AI) is transforming industries worldwide. Machine learning algorithms can now analyze vast amounts of data, identify patterns, and make predictions with remarkable accuracy. Deep learning, a subset of machine learning, uses neural networks with multiple layers to process information in ways that mimic the human brain. AI applications range from natural language processing and computer vision to robotics and autonomous vehicles. As AI technology continues to advance, it raises important questions about ethics, privacy, and the future of work." > /workspaces/EX1-/test.txt
```

2. Upload the test file through the UI
3. Click on the file to view its content
4. Click "Generate AI Summary" button
5. Observe the summary appearing in the right panel

**Expected behavior**:
- Status updates during processing
- Summary appears within 5-10 seconds
- Summary is concise (typically 2-4 sentences for short documents)
- Summary captures main points

### Step 5: Handle Edge Cases

Test the following scenarios:

1. **Empty file**:
   - Upload an empty `.txt` file
   - Expected: Should handle gracefully or show appropriate message

2. **Very large file**:
   - Upload a file > 50KB
   - Expected: Content is truncated, summary still generated

3. **Special characters**:
   - Test with files containing emojis, Unicode, special symbols
   - Expected: Should handle without errors

4. **Rapid successive requests**:
   - Generate summary for multiple files quickly
   - Expected: Each request should complete independently

5. **Invalid API token**:
   - Test with incorrect `GITHUB_TOKEN`
   - Expected: Shows error message without crashing

### Step 6: Improve UI/UX

Consider adding these enhancements:

1. **Loading indicator**: Show spinner while generating summary
2. **Copy button**: Allow copying summary to clipboard
3. **Export summary**: Download summary as text file
4. **Character count**: Show document length
5. **Summary history**: Display previously generated summaries

### Step 7: Mobile Testing

Test the responsive design on mobile:

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)

Verify:
- Panels stack vertically on mobile
- Buttons are easily tappable (min 44x44px)
- Text is readable without zooming
- No horizontal scrolling

**Screenshot: Application running on desktop**

> [Add screenshot here showing the three-panel layout with a document and its summary]

**Screenshot: Application on mobile device**

> [Add screenshot here showing the mobile-responsive layout]


## Section 8: Database Integration with Supabase  
**Requirements:**  
- Enhance the app to integrate with the Postgres database in Supabase to store the information about the documents and the AI generated summary.
- Make regular commits to the repository and push the update to Github.
- Capture and paste the screenshots of your steps during development and how you test the app.. Show a screenshot of the data stored in your Supabase Postgres Database.

Test the app in your local development environment, then deploy the app to Vercel and ensure all functionality works as expected in the deployed environment.

### Step 1: Understand the Database Schema

The `documents` table has been designed to store:
- File metadata (name, size, type)
- Storage path reference
- Extracted text content
- AI-generated summary
- Timestamps for tracking

Review the schema at `database/schema.sql`:

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

### Step 2: Create Database Table in Supabase

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New query**
3. Copy the contents of `database/schema.sql`
4. Paste into the SQL editor
5. Click **Run** to execute
6. Verify table creation by going to **Table Editor** → You should see `documents` table

**Screenshot: Supabase Table Editor showing documents table**

> [Add screenshot here showing the documents table structure in Supabase]

### Step 3: Configure Row Level Security (RLS)

The schema includes RLS policies for security. For development, we're using a permissive policy:

```sql
CREATE POLICY "Allow all operations" ON documents
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

**For Production**: Replace with user-specific policies:
```sql
-- Example: Only authenticated users can access their own documents
CREATE POLICY "Users can access own documents" ON documents
  FOR ALL
  USING (auth.uid() = user_id);
```

### Step 4: Update API Endpoints for Database Integration

All API endpoints have been updated to interact with the database:

1. **Upload API**: Saves file metadata to database after storage upload
2. **Extract API**: Updates content field after text extraction
3. **Summarize API**: Updates summary field after AI generation  
4. **Delete API**: Removes database record along with storage file

### Step 5: Test Database Integration

1. Upload a new document through the UI
2. Verify in Supabase Dashboard:
   - Go to **Table Editor** → **documents**
   - You should see a new row with file metadata
   - `content` and `summary` fields should be NULL initially

3. View the document in the app
4. Check database again:
   - The `content` field should now be populated
   - `updated_at` timestamp should be updated

5. Generate AI summary
6. Check database:
   - The `summary` field should now contain the AI-generated text

7. Delete the document
8. Verify the database row is also deleted

**Screenshot: Documents table with data**

> [Add screenshot here showing populated documents table with content and summaries]

### Step 6: Add Database Query API (Optional Enhancement)

Create an API to retrieve documents with summaries from the database:

Create `app/api/documents/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      documents: data
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

This allows fetching complete document information including summaries from the database.

### Step 7: Verify Data Consistency

Test data consistency between storage and database:

1. Upload 3-5 documents
2. Process some with AI summaries
3. Query the database to count records:

SQL query in Supabase:
```sql
SELECT COUNT(*) as total_docs,
       COUNT(content) as docs_with_content,
       COUNT(summary) as docs_with_summary
FROM documents;
```

4. Verify counts match your uploads and processing
5. Check that deleting from UI removes both storage file and database record

### Step 8: Monitor Database Performance

For larger applications, consider:

1. **Indexes**: Already created on `created_at` and `file_name`
2. **Query optimization**: Use `.select()` to fetch only needed columns
3. **Pagination**: Implement for large document lists
4. **Connection pooling**: Supabase handles this automatically

**Performance test**:
- Upload 50+ documents
- Measure query time in Network tab
- Should be < 500ms for list queries

### Troubleshooting

**Issue: "new row violates row-level security policy"**
- Verify RLS policies are correctly configured
- Check that policy allows INSERT/SELECT/UPDATE/DELETE operations

**Issue: Database updates fail silently**
- Check browser console for error messages
- Verify API endpoints are catching and logging errors
- Check Supabase logs in Dashboard → Logs

**Issue: Data not appearing in UI but exists in database**
- Verify API is querying correct table name
- Check that frontend is correctly parsing API response
- Inspect Network tab to see actual API responses


## Section 9: Additional Features [OPTIONAL]
Implement at least one additional features that you think is useful that can better differentiate your app from others. Describe the feature that you have implemented and provide a screenshot of your app with the new feature.

> [Description of your additional features with screenshot goes here]
