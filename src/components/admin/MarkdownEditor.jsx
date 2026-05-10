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

        {/* Preview — WYSIWYG: matches EventDetail article column */}
        <div style={{ background: '#F4ECDC', overflowY: 'auto' }}>
          <div style={{
            padding: '4px 10px', fontSize: '10px', color: '#8A7E74',
            background: '#EDE5D4', borderBottom: '1px solid #DDD5C4',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            Preview — as it appears on site
          </div>
          <div style={{
            maxWidth: '680px',
            margin: '0 auto',
            padding: '36px 40px 52px',
            minHeight: `${rows * 1.85 * 15}px`,
          }}>
            {value ? (
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p style={{
                      marginBottom: '1.5em',
                      fontSize: '15px',
                      lineHeight: 1.85,
                      color: '#1A1614',
                      fontFamily: '"Cormorant Garamond", "Cormorant", Georgia, serif',
                      fontWeight: 400,
                    }}>
                      {children}
                    </p>
                  ),

                  h2: ({ children }) => (
                    <h2 style={{
                      fontFamily: '"Playfair Display", "Palatino Linotype", Georgia, serif',
                      fontSize: '24px',
                      fontWeight: 700,
                      color: '#1A1614',
                      lineHeight: 1.25,
                      margin: '2.2em 0 0.7em',
                      paddingBottom: '0.4em',
                      borderBottom: '1px solid #DDD5C4',
                    }}>
                      {children}
                    </h2>
                  ),

                  h3: ({ children }) => (
                    <h3 style={{
                      fontFamily: '"Playfair Display", "Palatino Linotype", Georgia, serif',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#1A1614',
                      lineHeight: 1.3,
                      margin: '1.8em 0 0.5em',
                    }}>
                      {children}
                    </h3>
                  ),

                  h4: ({ children }) => (
                    <h4 style={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#6B6461',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      margin: '1.6em 0 0.4em',
                    }}>
                      {children}
                    </h4>
                  ),

                  blockquote: ({ children }) => (
                    <blockquote style={{
                      borderLeft: '3px solid #C8102E',
                      margin: '1.8em 0',
                      paddingLeft: '20px',
                      color: '#6B6461',
                      fontStyle: 'italic',
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontSize: '15px',
                      lineHeight: 1.85,
                    }}>
                      {children}
                    </blockquote>
                  ),

                  hr: () => (
                    <hr style={{
                      border: 'none',
                      borderTop: '1px solid #DDD5C4',
                      margin: '2.5em 0',
                    }} />
                  ),

                  ul: ({ children }) => (
                    <ul style={{
                      paddingLeft: '1.4em', marginBottom: '1.5em',
                      color: '#1A1614',
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontSize: '15px', lineHeight: 1.85,
                    }}>
                      {children}
                    </ul>
                  ),

                  ol: ({ children }) => (
                    <ol style={{
                      paddingLeft: '1.4em', marginBottom: '1.5em',
                      color: '#1A1614',
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontSize: '15px', lineHeight: 1.85,
                    }}>
                      {children}
                    </ol>
                  ),

                  li: ({ children }) => (
                    <li style={{ marginBottom: '0.4em', lineHeight: 1.7 }}>{children}</li>
                  ),

                  strong: ({ children }) => (
                    <strong style={{ color: '#1A1614', fontWeight: 600 }}>{children}</strong>
                  ),

                  em: ({ children }) => (
                    <em style={{ color: '#1A1614', fontStyle: 'italic' }}>{children}</em>
                  ),

                  a: ({ href, children }) => (
                    <a href={href} style={{
                      color: '#C8102E', textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                    }}>
                      {children}
                    </a>
                  ),

                  code: ({ children }) => (
                    <code style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '13px',
                      background: '#EDE5D4',
                      padding: '1px 6px',
                      color: '#C8102E',
                    }}>
                      {children}
                    </code>
                  ),

                  img: ({ src, alt }) => {
                    const parts = (alt || '').split('|').map(s => s.trim());
                    const caption = parts[0];
                    const sizeHint = (parts[1] || 'full').toLowerCase();
                    const sizeMap = {
                      full:  { width: '100%', margin: '2em 0', display: 'block' },
                      half:  { width: '50%',  margin: '2em auto', display: 'block' },
                      third: { width: '33.333%', margin: '2em auto', display: 'block' },
                      right: { width: '40%', float: 'right', margin: '0.4em 0 1.2em 2em' },
                      left:  { width: '40%', float: 'left',  margin: '0.4em 2em 1.2em 0' },
                    };
                    const wrapStyle = sizeMap[sizeHint] || sizeMap.full;
                    return (
                      <figure style={{ margin: 0, ...wrapStyle }}>
                        <img src={src} alt={caption} style={{ width: '100%', display: 'block' }} />
                        {caption && (
                          <figcaption style={{
                            fontSize: '11px', color: '#6B6461',
                            background: '#EDE5D4', padding: '8px 12px',
                            fontFamily: '"Inter", sans-serif',
                            lineHeight: 1.5, fontStyle: 'italic',
                          }}>
                            {caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  },
                }}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <p style={{
                color: '#A09890', fontStyle: 'italic', fontSize: '14px',
                fontFamily: '"Cormorant Garamond", Georgia, serif',
              }}>
                Preview will appear here…
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
