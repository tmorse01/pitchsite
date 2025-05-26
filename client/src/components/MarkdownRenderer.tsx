import { Box } from "@mantine/core";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import classes from "./MarkdownRenderer.module.css";

interface MarkdownRendererProps {
  content: string;
  size?: "sm" | "md" | "lg";
}

export default function MarkdownRenderer({
  content,
  size = "md",
}: MarkdownRendererProps) {
  return (
    <Box className={`${classes.markdownContent} ${classes[size]}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom styling for different elements
          h1: ({ children }) => (
            <h1 className={classes.heading1}>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className={classes.heading2}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className={classes.heading3}>{children}</h3>
          ),
          p: ({ children }) => <p className={classes.paragraph}>{children}</p>,
          ul: ({ children }) => (
            <ul className={classes.unorderedList}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className={classes.orderedList}>{children}</ol>
          ),
          li: ({ children }) => (
            <li className={classes.listItem}>{children}</li>
          ),
          strong: ({ children }) => (
            <strong className={classes.bold}>{children}</strong>
          ),
          em: ({ children }) => <em className={classes.italic}>{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className={classes.blockquote}>{children}</blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className={classes.inlineCode}>{children}</code>
            ) : (
              <code className={classes.codeBlock}>{children}</code>
            );
          },
          a: ({ children, href }) => (
            <a
              href={href}
              className={classes.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}
