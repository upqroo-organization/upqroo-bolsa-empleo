'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, AlertTriangle, BookOpen } from 'lucide-react';

interface DocFile {
  name: string;
  content: string;
  slug: string;
}

export default function DocsPage() {
  const [docs, setDocs] = useState<DocFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    const checkEnvironmentAndLoadDocs = async () => {
      try {
        // Check if we're in development environment
        const envResponse = await fetch('/api/docs/check-env');
        const envData = await envResponse.json();
        setIsDevelopment(envData.isDevelopment);

        if (envData.isDevelopment) {
          // Fetch documentation files
          const docsResponse = await fetch('/api/docs/files');
          const docsData = await docsResponse.json();
          setDocs(docsData.files || []);
        }
      } catch (error) {
        console.error('Error loading documentation:', error);
      } finally {
        setLoading(false);
      }
    };

    checkEnvironmentAndLoadDocs();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading documentation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isDevelopment) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <CardTitle>Documentation Not Available</CardTitle>
            </div>
            <CardDescription>
              This documentation page is only available in development environment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              To access the project documentation, please run the application in development mode:
            </p>
            <div className="bg-muted p-3 rounded-md">
              <code className="text-sm">npm run dev</code>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">Project Documentation</h1>
          <Badge variant="secondary" className="ml-2">Development Only</Badge>
        </div>
        <p className="text-muted-foreground text-lg">
          Comprehensive documentation for the UPQROO Bolsa de Trabajo platform
        </p>
      </div>

      {docs.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Documentation Found</h3>
              <p className="text-muted-foreground">
                No markdown files were found in the docs directory.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={docs[0]?.slug} className="w-full">
          <div className="mb-6">
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="inline-flex h-auto p-1 bg-muted rounded-lg">
                {docs.map((doc) => (
                  <TabsTrigger
                    key={doc.slug}
                    value={doc.slug}
                    className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    {doc.name.replace('.md', '').replace(/_/g, ' ')}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
          </div>

          {docs.map((doc) => (
            <TabsContent key={doc.slug} value={doc.slug}>
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">{doc.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[70vh] w-full pr-4">
                    <div
                      className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:border"
                      dangerouslySetInnerHTML={{ __html: doc.content }}
                    />
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}