import { Moon, Sun, Download, Upload, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
  onImport: () => void;
  onCopyData: () => void;
}

export const Header = ({
  theme,
  onToggleTheme,
  onExportJSON,
  onExportCSV,
  onImport,
  onCopyData,
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">₹</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">MoneyWise</h1>
            <p className="text-xs text-muted-foreground">Personal Finance</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="rounded-xl"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-popover">
              <DropdownMenuItem onClick={onExportJSON}>
                <Download className="w-4 h-4 mr-2" />
                Backup (JSON)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onCopyData}>
                <Download className="w-4 h-4 mr-2" />
                Copy to Clipboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onImport}>
                <Upload className="w-4 h-4 mr-2" />
                Restore Backup
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
