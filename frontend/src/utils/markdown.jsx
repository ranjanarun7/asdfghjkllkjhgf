import React from 'react';

// A simple regex-based parser for basic markdown (links, bold, bullets, newlines)
export const parseMarkdown = (text) => {
  const lines = text.split('\n');
  return lines.map((line, index) => {

    // List items
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const content = line.trim().substring(2);
      return (
        <li
          key={index}
          className="ml-4 list-disc marker:text-emerald-600 pl-1 mb-1"
        >
          {parseInline(content)}
        </li>
      );
    }

    // Empty line
    if (line.trim() === '') {
      return <div key={index} className="h-2" />;
    }

    // Paragraph
    return (
      <p key={index} className="mb-1 leading-relaxed">
        {parseInline(line)}
      </p>
    );
  });
};

// Parse inline elements: links + bold
const parseInline = (text) => {
  const parts = text.split(/(\[.*?\]\(.*?\))/g);

  return parts.map((part, i) => {
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 hover:text-emerald-800 underline decoration-emerald-300 underline-offset-2"
        >
          {linkMatch[1]}
        </a>
      );
    }

    return parseBold(part);
  });
};

const parseBold = (text) => {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);

  return parts.map((part, i) => {
    if (
      (part.startsWith('**') && part.endsWith('**')) ||
      (part.startsWith('*') && part.endsWith('*'))
    ) {
      const content = part.startsWith('**')
        ? part.slice(2, -2)
        : part.slice(1, -1);

      return (
        <strong key={i} className="font-semibold text-emerald-800">
          {content}
        </strong>
      );
    }

    return <span key={i}>{part}</span>;
  });
};
