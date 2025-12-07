import { useState, useRef } from 'react';
import { Upload, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (json: string) => boolean;
}

export const ImportDialog = ({ open, onClose, onImport }: ImportDialogProps) => {
  const [jsonText, setJsonText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonText(content);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    const success = onImport(jsonText);
    if (success) {
      toast({
        title: 'Data restored!',
        description: 'Your financial data has been restored successfully.',
      });
      onClose();
      setJsonText('');
    } else {
      toast({
        title: 'Import failed',
        description: 'Invalid backup file format.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Restore Backup</DialogTitle>
          <DialogDescription>
            Upload a JSON backup file or paste the data below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />

          <Button
            variant="outline"
            className="w-full h-24 border-dashed flex flex-col gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileJson className="w-8 h-8 text-muted-foreground" />
            <span>Upload JSON File</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or paste JSON
              </span>
            </div>
          </div>

          <Textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='{"transactions": [...], "categories": [...]}'
            rows={6}
            className="font-mono text-sm"
          />

          <Button
            onClick={handleImport}
            disabled={!jsonText.trim()}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Restore Data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
