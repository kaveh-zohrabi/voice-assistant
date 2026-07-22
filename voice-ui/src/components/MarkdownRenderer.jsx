import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={handleCopy} className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white text-xs transition-all duration-200 flex items-center gap-1.5 backdrop-blur-sm">
      {copied ? (<><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>) : (<><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</>)}
    </button>
  );
}

function CodeBlock({ language, children }) {
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const lines = children.split('\n');
  return (
    <div className="relative my-4 rounded-xl overflow-hidden bg-[#1a1b26] border border-white/10 group">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="text-xs text-slate-500 ml-2">{language || 'code'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLineNumbers(!showLineNumbers)} className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded hover:bg-white/5">
            {showLineNumbers ? 'Lines' : 'Lines'}
          </button>
          <CopyButton text={children} />
        </div>
      </div>
      <div className="px-4 py-3 overflow-x-auto">
        <pre className="text-sm leading-relaxed">
          <code className="text-slate-300 font-mono">
            {lines.map((line, i) => (
              <div key={i} className="flex">
                {showLineNumbers && <span className="select-none text-slate-600 text-xs w-8 text-right mr-4 flex-shrink-0">{i + 1}</span>}
                <span>{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

function TableComponent({ children }) {
  return (
    <div className="overflow-x-auto my-4 rounded-xl border border-white/10">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export default function MarkdownRenderer({ content }) {
  const cleanContent = content.replace(/\[FA\]|\[EN\]/g, '').trim();

  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            if (!inline && match) {
              return <CodeBlock language={match[1]}>{String(children).replace(/\n$/, '')}</CodeBlock>;
            }
            if (!inline) {
              return <CodeBlock language="">{String(children).replace(/\n$/, '')}</CodeBlock>;
            }
            return <code className="px-1.5 py-0.5 rounded-md bg-white/10 text-blue-300 text-sm font-mono" {...props}>{children}</code>;
          },
          pre({ children }) {
            return <>{children}</>;
          },
          table({ children }) {
            return <TableComponent>{children}</TableComponent>;
          },
          thead({ children }) {
            return <thead className="bg-white/5 border-b border-white/10">{children}</thead>;
          },
          th({ children }) {
            return <th className="px-4 py-2 text-right text-slate-300 font-medium">{children}</th>;
          },
          td({ children }) {
            return <td className="px-4 py-2 text-slate-400 border-b border-white/5">{children}</td>;
          },
          h1({ children }) {
            return <h1 className="text-2xl font-bold text-white mt-6 mb-3">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-xl font-bold text-white mt-5 mb-2">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-lg font-bold text-white mt-4 mb-2">{children}</h3>;
          },
          p({ children }) {
            return <p className="text-slate-300 leading-relaxed mb-3">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc list-inside text-slate-300 space-y-1 mb-3">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside text-slate-300 space-y-1 mb-3">{children}</ol>;
          },
          li({ children }) {
            return <li className="text-slate-300">{children}</li>;
          },
          blockquote({ children }) {
            return <blockquote className="border-r-4 border-blue-500/50 pr-4 pl-4 text-slate-400 italic my-3">{children}</blockquote>;
          },
          a({ href, children }) {
            return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">{children}</a>;
          },
          strong({ children }) {
            return <strong className="text-white font-bold">{children}</strong>;
          },
          em({ children }) {
            return <em className="text-slate-300 italic">{children}</em>;
          },
          hr() {
            return <hr className="border-white/10 my-4" />;
          },
        }}
      >
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
}
