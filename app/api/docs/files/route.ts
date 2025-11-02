import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { marked } from 'marked';

export async function GET() {
  // Only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const docsDirectory = join(process.cwd(), 'docs');
    const filenames = await readdir(docsDirectory);

    // Filter for markdown files only
    const markdownFiles = filenames.filter(name => name.endsWith('.md'));

    const files = await Promise.all(
      markdownFiles.map(async (filename) => {
        const filePath = join(docsDirectory, filename);
        const content = await readFile(filePath, 'utf8');

        // Configure marked for better rendering
        marked.setOptions({
          breaks: true,
          gfm: true,
        });

        // Convert markdown to HTML
        const htmlContent = marked(content);

        return {
          name: filename,
          content: htmlContent,
          slug: filename.replace('.md', '').toLowerCase().replace(/[^a-z0-9]/g, '-')
        };
      })
    );

    // Sort files alphabetically by name
    files.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error reading docs:', error);
    return NextResponse.json({
      error: 'Failed to read documentation files',
      files: []
    }, { status: 500 });
  }
}