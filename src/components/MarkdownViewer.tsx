import Markdown from "react-markdown";

interface MarkdownViewerProps {
  content: string;
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  return <Markdown>{content}</Markdown>;
}
