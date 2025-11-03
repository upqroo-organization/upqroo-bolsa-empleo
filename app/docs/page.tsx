'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FileText, AlertTriangle, BookOpen, Folder, FolderOpen, ChevronRight, ChevronDown, Menu, X, List, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface NavigationItemProps {
  item: DocItem;
  selectedSlug: string | null;
  onSelect: (file: DocFile) => void;
  level?: number;
}

function NavigationItem({ item, selectedSlug, onSelect, level = 0 }: NavigationItemProps) {
  const [isOpen, setIsOpen] = useState(level === 0);

  if (item.type === 'file') {
    return (
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start text-left h-auto py-2 px-2 font-normal",
          selectedSlug === item.slug && "bg-accent text-accent-foreground"
        )}
        style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}
        onClick={() => onSelect(item)}
      >
        <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
        <span className="truncate">{item.name.replace(/\.(md|mdx)$/, '').replace(/_/g, ' ')}</span>
      </Button>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-left h-auto py-2 px-2 font-normal"
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
          )}
          {isOpen ? (
            <FolderOpen className="h-4 w-4 mr-2 flex-shrink-0" />
          ) : (
            <Folder className="h-4 w-4 mr-2 flex-shrink-0" />
          )}
          <span className="truncate">{item.name.replace(/_/g, ' ')}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1">
        {item.children.map((child, index) => (
          <NavigationItem
            key={`${child.path}-${index}`}
            item={child}
            selectedSlug={selectedSlug}
            onSelect={onSelect}
            level={level + 1}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function DocsPage() {
  const [structure, setStructure] = useState<DocItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<DocFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showToc, setShowToc] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  // Get all files from the structure recursively
  const getAllFiles = (items: DocItem[]): DocFile[] => {
    const files: DocFile[] = [];
    for (const item of items) {
      if (item.type === 'file') {
        files.push(item);
      } else {
        files.push(...getAllFiles(item.children));
      }
    }
    return files;
  };

  useEffect(() => {
    const checkEnvironmentAndLoadDocs = async () => {
      try {
        // Check if we're in development environment
        const envResponse = await fetch('/api/docs/check-env');
        const envData = await envResponse.json();
        setIsDevelopment(envData.isDevelopment);

        if (envData.isDevelopment) {
          // Fetch documentation structure
          const docsResponse = await fetch('/api/docs/files');
          const docsData = await docsResponse.json();
          const docStructure = docsData.structure || [];
          setStructure(docStructure);

          // Select the welcome file by default, or the first file if welcome doesn't exist
          const allFiles = getAllFiles(docStructure);
          const welcomeFile = allFiles.find(file => file.name.toLowerCase().includes('welcome'));
          if (welcomeFile) {
            setSelectedFile(welcomeFile);
          } else if (allFiles.length > 0) {
            setSelectedFile(allFiles[0]);
          }
        }
      } catch (error) {
        console.error('Error loading documentation:', error);
      } finally {
        setLoading(false);
      }
    };

    checkEnvironmentAndLoadDocs();
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter structure based on search query
  const filterItems = (items: DocItem[], query: string): DocItem[] => {
    if (!query.trim()) return items;

    const filtered: DocItem[] = [];

    for (const item of items) {
      if (item.type === 'file') {
        const fileName = item.name.replace(/\.(md|mdx)$/, '').replace(/_/g, ' ').toLowerCase();
        if (fileName.includes(query.toLowerCase())) {
          filtered.push(item);
        }
      } else {
        const folderName = item.name.replace(/_/g, ' ').toLowerCase();
        const filteredChildren = filterItems(item.children, query);

        if (folderName.includes(query.toLowerCase()) || filteredChildren.length > 0) {
          filtered.push({
            ...item,
            children: filteredChildren.length > 0 ? filteredChildren : item.children
          });
        }
      }
    }

    return filtered;
  };

  const filteredStructure = filterItems(structure, searchQuery);

  const handleFileSelect = (file: DocFile) => {
    setSelectedFile(file);
    setSidebarOpen(false); // Close sidebar on mobile after selection
    setShowBackToTop(false); // Reset back to top button
    // Scroll to top when selecting a new file
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTop = 0;
    }
  };

  const scrollToTop = () => {
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle scroll events to show/hide back to top button
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    setShowBackToTop(scrollTop > 300);
  };

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

  const allFiles = getAllFiles(structure);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-80 bg-background border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Documentation</h2>
            <Badge variant="secondary" className="text-xs">
              {allFiles.length} docs
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-2 border-b flex-shrink-0">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search documentation... (Ctrl+K)"
            className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-2 docs-sidebar">
            {filteredStructure.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'No matching documents found' : 'No documentation found'}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredStructure.map((item, index) => (
                  <NavigationItem
                    key={`${item.path}-${index}`}
                    item={item}
                    selectedSlug={selectedFile?.slug || null}
                    onSelect={handleFileSelect}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-4 p-4 border-b bg-background flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Project Documentation</h1>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          {selectedFile ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b bg-muted/30 flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <h2 className="text-lg font-semibold">
                      {selectedFile.name.replace(/\.(md|mdx)$/, '').replace(/_/g, ' ')}
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowToc(!showToc)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span>docs</span>
                  {selectedFile.path.split('/').slice(0, -1).map((segment, index) => (
                    <span key={index} className="flex items-center gap-1">
                      <ChevronRight className="h-3 w-3" />
                      <span>{segment.replace(/_/g, ' ')}</span>
                    </span>
                  ))}
                  <ChevronRight className="h-3 w-3" />
                  <span className="font-medium text-foreground">
                    {selectedFile.name.replace(/\.(md|mdx)$/, '').replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-hidden relative">
                <div
                  ref={contentScrollRef}
                  className="h-full overflow-y-auto docs-content-scroll"
                  onScroll={handleScroll}
                >
                  <div className="docs-content-wrapper">
                    <div className="p-6">
                      <div
                        className="docs-content prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:border prose-a:text-primary hover:prose-a:text-primary/80"
                        dangerouslySetInnerHTML={{ __html: selectedFile.content }}
                      />
                    </div>
                  </div>
                </div>

                {/* Back to Top Button */}
                {showBackToTop && (
                  <Button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-50 rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all duration-200"
                    size="sm"
                    title="Back to top"
                    aria-label="Scroll back to top"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Welcome to Documentation</h3>
                <p className="text-muted-foreground">
                  Select a document from the sidebar to get started.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}