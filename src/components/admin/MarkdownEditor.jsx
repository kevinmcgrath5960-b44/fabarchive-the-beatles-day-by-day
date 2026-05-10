import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';

// ── Toolbar button definitions ────────────────────────────────────────────────
const TOOLS = [
  { label: 'B',     title: 'Bold',           wrap: ['**', '**'],          block: false },
  { label: 'I',     title: 'Italic',         wrap: ['*', '*'],            block: false },
  { label: 'H2',    title: 'Section heading', prefix: '## ',              block: true  },
  { label: 'H3',    title: 'Sub-heading',    prefix: '### ',             block: true  },
  { label: 'H4',    title: 'Label (caps)',   prefix: '#### ',            block: true  },
  { label: '"',     title: 'Blockquote',     prefix: '> ',               block: true  },
  { label: '—',     title: 'Divider',        insert: '\n\n---\n\n',      block: false },
  { label: '• list',title: 'Bullet list',    prefix: '- ',               block: true  },
  { label: '🔗',    title: 'Link',           special: 'link'                          },
  { label: '🖼',    title: 'Image (highlight URL then click)',
                                              special: 'image'                         },
];

// Apply a toolbar action to a textarea and return the new value + cursor positions
function applyTool(tool, value, selStart, selEnd) {
  const before = value.slice(0, selStart);
  const selected = value.slice(selStart, selEnd);
  const after = value.slice(selEnd);

  // ── Wrap (bold / italic) ──────────────────────────────────────────────────
  if (tool.wrap) {
    const [open, close] = tool.wrap;
    const newText = `${open}${selected || 'text'}${close}`;
    const newValue = before + newText + after;
    const cursor = selStart + open.length + (selected || 'text').length + close.length;
    return { newValue, selStart: cursor, selEnd: cursor };
  }

  // ── Block prefix (headings, blockquote, list) ─────────────────────────────
  if (tool.prefix) {
    // Apply prefix to every selected line, or insert on blank line
    if (selected) {
      const lines = selected.split('\n').map(l => tool.prefix + l).join('\n');
      const newValue = before + lines + after;
      return { newValue, selStart: selStart + tool.prefix.length, selEnd: selStart + lines.length };
    } else {
      // Insert prefix at start of current line
      const lineStart = before.lastIndexOf('\n') + 1;
      const newValue = value.slice(0, lineStart) + tool.prefix + value.slice(lineStart);
      const cursor = lineStart + tool.prefix.length;
      return { newValue, selStart: cursor, selEnd: cursor };
    }
  }

  // ── Raw insert ────────────────────────────────────────────────────────────
  if (tool.insert) {
    const newValue = before + tool.insert + after;
    const cursor = selStart + tool.insert.length;
    return { newValue, selStart: cursor, selEnd: cursor };
  }

  // ── Image: selected text is the URL ──────────────────────────────────────
  if (tool.special === 'image') {
    const url = selected.trim() || 'https://example.com/image.jpg';
    const snippet = `![Place caption here|full](${url})`;
    const newValue = before + snippet + after;
    // Select "Place caption here" so user can immediately type the real caption
    const captionStart = selStart + 2; // after ![
    const captionEnd = captionStart + 'Place caption here'.length;
    return { newValue, selStart: captionStart, selEnd: captionEnd };
  }

  // ── Link: selected text becomes the label ─────────────────────────────────
  if (tool.special === 'link') {
    const label = selected || 'link text';
    const snippet = `[${label}](https://)`;
    const newValue = before + snippet + after;
    // Place cursor inside the URL part
    const urlStart = selStart + label.length + 3; // after [label](
    const urlEnd = urlStart + 8; // https://
    return { newValue, selStart: urlStart, selEnd: urlEnd };
  }

  return { newValue: value, selStart, selEnd };
}

// ── MarkdownEditor component ──────────────────────────────────────────────────
export default function MarkdownEditor({ value, onChange, rows = 14, placeholder = '' }) {
  const textareaRef = useRef(null);

  const handleTool = (tool) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart, selectionEnd } = ta;
    const { newValue, selStart, selEnd } = applyTool(tool, value, selectionStart, selectionEnd);
    onChange(newValue);
    // Restore focus + selection after React re-render
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(selStart, selEnd);
    });
  };

  const btnStyle = (label) => ({
    padding: label.length > 2 ? '3px 8px' : '3px 7px',
    fontSize: '11px',
    fontFamily: label === 'B' ? 'serif' : '"Inter", sans-serif',
    fontWeight: label === 'B' ? 700 : 500,
    fontStyle: label === 'I' ? 'italic' : 'normal',
    color: '#333',
    background: '#FAFAFA',
    border: '1px solid #DDDDDD',
    cursor: 'pointer',
    lineHeight: 1,
    height: '26px',
    whiteSpace: 'nowrap',
  });

  return (
    <div style={{ border: '1px solid #CCCCCC', background: '#FFF' }}>
      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '3px',
        padding: '6px 8px',
        background: '#F4F4F4',
        borderBottom: '1px solid #DDDDDD',
        alignItems: 'center',
      }}>
        {TOOLS.map((tool, i) => (
          <React.Fragment key={tool.label}>
            {/* Visual separator before link/image group */}
            {i === 8 && <span style={{ width: '1px', height: '18px', background: '#DDD', margin: '0 3px' }} />}
            <button
              type="button"
              title={tool.title}
              onMouseDown={e => { e.preventDefault(); handleTool(tool); }}
              style={btnStyle(tool.label)}
            >
              {tool.label}
            </button>
          </React.Fragment>
        ))}
        <span style={{
          marginLeft: 'auto', fontSize: '10px', color: '#AAA',
          fontFamily: '"Inter", sans-serif', letterSpacing: '0.02em',
        }}>
          For images: highlight a URL, then click 🖼
        </span>
      </div>

      {/* ── Two-pane layout: editor left, preview right ───────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {/* Editor */}
        <div style={{ borderRight: '1px solid #EEEEEE' }}>
          <div style={{
            padding: '4px 10px', fontSize: '10px', color: '#AAA',
            background: '#FAFAFA', borderBottom: '1px solid #EEE',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            Markdown
          </div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={rows}
            placeholder={placeholder}
            spellCheck
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '12px', fontSize: '13px',
              fontFamily: '"JetBrains Mono", "Courier New", monospace',
              lineHeight: 1.7, border: 'none', outline: 'none',
              resize: 'vertical', color: '#222', background: '#FFFFFF',
            }}
          />
        </div>

        {/* Preview */}
        <div>
          <div style={{
            padding: '4px 10px', fontSize: '10px', color: '#AAA',
            background: '#FAFAFA', borderBottom: '1px solid #EEE',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            Preview
          </div>
          <div style={{
            padding: '12px 16px',
            fontSize: '14px', lineHeight: 1.75,
            color: '#222', fontFamily: 'Georgia, serif',
            minHeight: `${rows * 1.7 * 13}px`,
            overflowY: 'auto',
          }}>
            {value ? (
              <ReactMarkdown
                components={{
                  h2: ({ children }) => <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '1.4em 0 0.4em', borderBottom: '1px solid #eee', paddingBottom: '0.3em' }}>{children}</h2>,
                  h3: ({ children }) => <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '1.2em 0 0.3em' }}>{children}</h3>,
                  h4: ({ children }) => <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', margin: '1em 0 0.3em' }}>{children}</h4>,
                  p: ({ children }) => <p style={{ marginBottom: '1em' }}>{children}</p>,
                  blockquote: ({ children }) => <blockquote style={{ borderLeft: '3px solid #C8102E', paddingLeft: '12px', color: '#666', fontStyle: 'italic', margin: '1em 0' }}>{children}</blockquote>,
                  hr: () => <hr style={{ border: 'none', borderTop: '1px solid #DDD', margin: '1.5em 0' }} />,
                  strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
                  em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
                  ul: ({ children }) => <ul style={{ paddingLeft: '1.4em', marginBottom: '1em' }}>{children}</ul>,
                  ol: ({ children }) => <ol style={{ paddingLeft: '1.4em', marginBottom: '1em' }}>{children}</ol>,
                  li: ({ children }) => <li style={{ marginBottom: '0.3em' }}>{children}</li>,
                  img: ({ src, alt }) => {
                    const [caption] = (alt || '').split('|');
                    return (
                      <figure style={{ margin: '1em 0' }}>
                        <img src={src} alt={caption} style={{ maxWidth: '100%', display: 'block' }} />
                        {caption && <figcaption style={{ fontSize: '11px', color: '#888', marginTop: '4px', fontStyle: 'italic' }}>{caption}</figcaption>}
                      </figure>
                    );
                  },
                  a: ({ href, children }) => <a href={href} style={{ color: '#C8102E', textDecoration: 'underline' }}>{children}</a>,
                }}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <p style={{ color: '#CCC', fontStyle: 'italic', fontSize: '13px' }}>Preview will appear here…</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
