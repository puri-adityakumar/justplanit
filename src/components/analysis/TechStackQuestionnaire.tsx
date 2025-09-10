import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface TechStackQuestionnaireProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (answers: { stack: string; diagram: boolean }) => void;
    loading: boolean;
}

export const TechStackQuestionnaire = ({ isOpen, onClose, onSubmit, loading }: TechStackQuestionnaireProps) => {
    const [stack, setStack] = useState("ai");
    const [diagram, setDiagram] = useState(false);

    const handleSubmit = () => {
        onSubmit({ stack, diagram });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-card/80 backdrop-blur-xl border-border/40">
                <DialogHeader>
                    <DialogTitle>Tech Stack Generator</DialogTitle>
                    <DialogDescription>
                        Answer a few questions to get a tailored tech stack recommendation.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-3">
                        <Label>Choose a foundation for your stack:</Label>
                        <RadioGroup value={stack} onValueChange={setStack}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="ai" id="ai" />
                                <Label htmlFor="ai">Let AI Decide (Recommended)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="next_supabase" id="next_supabase" />
                                <Label htmlFor="next_supabase">Next.js + Supabase</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="react_firebase" id="react_firebase" />
                                <Label htmlFor="react_firebase">React + Firebase</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="diagram" checked={diagram} onCheckedChange={(checked) => setDiagram(!!checked)} />
                        <Label htmlFor="diagram">Generate a data flow diagram?</Label>
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Generating..." : "Generate Tech Stack"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
