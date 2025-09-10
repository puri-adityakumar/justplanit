import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, Database, Globe, Smartphone, Cloud, Code } from "lucide-react";
import { CompleteIdea } from "@/types/database";
import mermaid from 'mermaid';
import { useEffect, useRef, useState } from 'react';

interface TechStackSectionProps {
  ideaData: CompleteIdea;
  // Remove other props
}

interface TechStackData {
  suggested_stacks: Array<{
    name: string;
    description: string;
    frontend: string;
    backend: string;
    database: string;
    other_tools: string[];
    pros: string[];
    cons: string[];
    complexity: string;
  }>;
}

export const TechStackSection = ({ ideaData }: TechStackSectionProps) => {
  const [showDiagram, setShowDiagram] = useState(false);

  const onGenerateDiagram = (stackName: string) => {
    // TODO: Generate diagram based on stackName
    setShowDiagram(true);
  };

  const data: TechStackData = (ideaData.sections?.tech_stack as TechStackData) ?? { suggested_stacks: [] };

  // Placeholder for diagram code
  const diagramCode = `graph TD
    A[Client] --> B[Frontend]
    B --> C[Backend]
    C --> D[Database]`;

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
  }, []);

  // For rendering diagram
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showDiagram && diagramRef.current) {
      mermaid.render('mermaid-diagram', diagramCode).then(({ svg }) => {
        if (diagramRef.current) {
          diagramRef.current.innerHTML = svg;
        }
      });
    }
  }, [showDiagram, diagramCode]);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">Suggested Tech Stacks</h3>
      {data.suggested_stacks.map((stack, index) => (
        <Card key={index} className="bg-black/40 backdrop-blur-xl border-border/30 p-6">
          <h4 className="text-lg font-bold text-white mb-2">{stack.name}</h4>
          <p className="text-foreground/80 mb-4">{stack.description}</p>
          <div className="space-y-2 mb-4">
            <p><strong>Frontend:</strong> {stack.frontend}</p>
            <p><strong>Backend:</strong> {stack.backend}</p>
            <p><strong>Database:</strong> {stack.database}</p>
            <p><strong>Other Tools:</strong> {stack.other_tools.join(', ')}</p>
            <p><strong>Complexity:</strong> {stack.complexity}</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => onGenerateDiagram(stack.name)}>Generate Data Flow Diagram</Button>
            <Button onClick={() => setShowDiagram(!showDiagram)}>{showDiagram ? 'Hide' : 'Show'} Diagram</Button>
          </div>
          {showDiagram && <div ref={diagramRef} className="mermaid" />}
          {/* Render pros/cons lists */}
        </Card>
      ))}
      {data.suggested_stacks.length === 0 && <p className="text-foreground/70">No suggestions available.</p>}
    </div>
  );
};
