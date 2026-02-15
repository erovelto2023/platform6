import React from 'react';
import { notFound } from 'next/navigation';
import { tools } from '../_config/tools';
import { getToolContent } from '../_lib/content';
import ToolPage from '../_components/tools/ToolPage';
import MergePDFTool from '../_components/tools/merge/MergePDFTool';
import { GenericPDFTool } from '../_components/tools/GenericPDFTool';

interface PageProps {
  params: Promise<{
    tool: string;
  }>;
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const tool = tools.find((t) => t.slug === params.tool);
  if (!tool) return {};

  const content = getToolContent(tool.id);

  return {
    title: `${content.title} - PDFCraft`,
    description: content.metaDescription,
  };
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const tool = tools.find((t) => t.slug === params.tool);

  if (!tool) {
    return notFound();
  }

  const content = getToolContent(tool.id);

  // Helper to render the specific tool component
  const renderToolInterface = () => {
    switch (tool.id) {
      case 'merge-pdf':
        return <MergePDFTool />;
      default:
        return <GenericPDFTool tool={tool} />;
    }
  };

  return (
    <ToolPage
      tool={tool}
      content={content}
      localizedRelatedTools={{}}
    >
      {renderToolInterface()}
    </ToolPage>
  );
}
