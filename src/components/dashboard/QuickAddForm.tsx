import { useState } from "react";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";

interface SubmissionResult {
  success: boolean;
  message: string;
}

interface QuickAddFormProps {
  onSubmit: (data: {
    amount: number;
    type: "income" | "expense";
    category: string;
    note: string;
    date: string;
  }) => Promise<SubmissionResult>;
}

export default function QuickAddForm({ onSubmit }: QuickAddFormProps) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const resetForm = () => {
    setAmount("");
    setType("expense");
    setCategory("");
    setNote("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!amount || !category) {
      toast({
        title: "Missing fields",
        description: "Please enter the amount and select a category.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const result = await onSubmit({
      amount: parseFloat(amount),
      type,
      category,
      note,
      date: new Date().toISOString().slice(0, 10),
    });

    toast({
      title: result.success ? "Transaction added" : "Unable to add transaction",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });

    if (result.success) {
      resetForm();
    }

    setIsSubmitting(false);
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 animate-slide-in">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Wallet size={18} className="text-primary" />
        Quick Add Transaction
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (INR)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="h-11 bg-muted/30 border-border/50 focus:border-primary input-glow"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(value) => {
              setType(value as "income" | "expense");
              setCategory("");
            }}>
              <SelectTrigger className="h-11 bg-muted/30 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-11 bg-muted/30 border-border/50">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Input
              id="note"
              type="text"
              placeholder="Optional description"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="h-11 bg-muted/30 border-border/50 focus:border-primary input-glow"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button type="submit" className="btn-gradient w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add Transaction"}
          </Button>
          <Button type="button" variant="outline" onClick={resetForm} className="border-border/50 w-full sm:w-auto">
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
}
