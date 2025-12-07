import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg gradient-primary hover:scale-105 transition-transform z-50"
      size="icon"
    >
      <Plus className="w-6 h-6 text-primary-foreground" />
    </Button>
  );
};
