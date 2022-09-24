import React, { useEffect, useRef } from "react";
import prismjs from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

export default function HighlightCode({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    prismjs.highlightAll();
  }, [html]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }}></div>;
}
