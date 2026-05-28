import { useState } from "react";
import { Download, Save, Trash, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface BackupRestoreSectionProps {
  exportData: () => Promise<{ success: boolean; message: string }>;
  importData: (jsonString: string) => Promise<{ success: boolean; message: string }>;
  clearAllData: () => Promise<{ success: boolean; message: string }>;
}

export default function BackupRestoreSection({ exportData, importData, clearAllData }: BackupRestoreSectionProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportData();
      toast({
        title: result.success ? "Export Successful" : "Export Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsImporting(true);
      const reader = new FileReader();
      reader.onload = async (loadEvent) => {
        try {
          const result = await importData(String(loadEvent.target?.result || ""));
          toast({
            title: result.success ? "Restore Complete" : "Restore Failed",
            description: result.message,
            variant: result.success ? "default" : "destructive",
          });
        } catch (error) {
          console.error(error);
        } finally {
          setIsImporting(false);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClear = async () => {
    if (!window.confirm("ARE YOU ABSOLUTELY SURE? This will permanently wipe all your transactions, monthly budgets, and savings goals from our database. This action CANNOT be undone!")) {
      return;
    }

    setIsClearing(true);
    try {
      const result = await clearAllData();
      toast({
        title: result.success ? "Database Purged" : "Purge Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 animate-slide-in">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Save size={20} className="text-primary animate-pulse" />
        Data Backup & Restore Utilities
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Export your complete financial ledger as an encrypted offline JSON file, restore previous ledger configurations, or purge all personal account data.
      </p>

      <div className="flex flex-col sm:flex-row flex-wrap gap-4">
        <Button onClick={handleExport} className="btn-gradient w-full sm:w-auto" disabled={isExporting}>
          <Download size={18} className="mr-2" />
          {isExporting ? "Exporting..." : "Export Financial Ledger"}
        </Button>
        <Button onClick={handleImport} variant="outline" className="w-full sm:w-auto hover:bg-muted/50 transition-all" disabled={isImporting}>
          <Upload size={18} className="mr-2" />
          {isImporting ? "Restoring..." : "Restore Financial Ledger"}
        </Button>
        <Button onClick={handleClear} variant="destructive" className="w-full sm:w-auto hover:bg-destructive/90 transition-all" disabled={isClearing}>
          <Trash size={18} className="mr-2" />
          {isClearing ? "Purging..." : "Wipe Account Database"}
        </Button>
      </div>
    </div>
  );
}
