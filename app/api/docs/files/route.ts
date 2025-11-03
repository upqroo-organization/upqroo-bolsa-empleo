import { NextResponse } from 'next/server';
import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';
import { marked } from 'marked';

interface DocFile {
  name: string;
  content: string;
  slug: string;
  path: string;
  type: 'file';
}

interface DocFolder {
  name: string;
  type: 'folder';
  path: string;
  children: (DocFile | DocFolder)[];
}

type DocItem = DocFile | DocFolder;

async function readDocsRecursively(dirPath: string, relativePath: string = ''): Promise<DocItem[]> {
  const items: DocItem[] = [];
  const entries = await readdir(dirPath);

  for (const entry of entries) {
    const fullPath = join(dirPath, entry);
    const itemRelativePath = relativePath ? `${relativePath}/${entry}` : entry;
    const stats = await stat(fullPath);

    if (stats.isDirectory()) {
      const children = await readDocsRecursively(fullPath, itemRelativePath);
      if (children.length > 0) {
        items.push({
          name: entry,
          type: 'folder',
          path: itemRelativePath,
          children
        });
      }
    } else if (entry.endsWith('.md') || entry.endsWith('.mdx')) {
      const content = await readFile(fullPath, 'utf8');

      // Configure marked for better rendering
      marked.setOptions({
        breaks: true,
        gfm: true,
      });

      const htmlContent = await marked(content);
      const slug = itemRelativePath.replace(/\.(md|mdx)$/, '').toLowerCase().replace(/[^a-z0-9\/]/g, '-');

      items.push({
        name: entry,
        content: htmlContent,
        slug,
        path: itemRelativePath,
        type: 'file'
      });
    }
  }

  // Sort items: folders first, then files, both alphabetically
  items.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  return items;
}

export async function GET() {
  // Only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const docsDirectory = join(process.cwd(), 'docs');
    const structure = await readDocsRecursively(docsDirectory);

    return NextResponse.json({ structure });
  } catch (error) {
    console.error('Error reading docs:', error);
    return NextResponse.json({
      error: 'Failed to read documentation files',
      structure: []
    }, { status: 500 });
  }
}