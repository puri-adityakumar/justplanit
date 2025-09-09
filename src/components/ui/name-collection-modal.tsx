import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

interface NameCollectionModalProps {
    isOpen: boolean;
    onSubmit: (name: string) => void;
    isLoading?: boolean;
}

export const NameCollectionModal: React.FC<NameCollectionModalProps> = ({
    isOpen,
    onSubmit,
    isLoading = false
}) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit(name.trim());
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border/40">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <User className="h-5 w-5 text-primary" />
                        Complete Your Profile
                    </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground/80">
                            What should we call you?
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-background/50 border-border/40"
                            autoFocus
                            disabled={isLoading}
                        />
                        <p className="text-sm text-foreground/60">
                            This helps us personalize your experience on Just Plan It!
                        </p>
                    </div>
                    
                    <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={!name.trim() || isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Continue'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
