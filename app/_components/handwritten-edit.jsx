export function HandwrittenReplacement({ correction, draft }) {
  return (
    <span className="handwritten-replacement">
      <span className="sr-only">{correction}</span>
      <span aria-hidden="true" className="handwritten-replacement-visual">
        <span className="handwritten-replacement-draft">{draft}</span>
        <span className="handwritten-replacement-correction">
          {correction}
        </span>
      </span>
    </span>
  );
}

export function HandwrittenInsertion({ after, before, character, value }) {
  return (
    <span className="handwritten-insertion">
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="handwritten-insertion-visual">
        <span>{before}</span>
        <span>{after}</span>
        <span className="handwritten-insertion-character">{character}</span>
        <span className="handwritten-insertion-caret">⌃</span>
      </span>
    </span>
  );
}
