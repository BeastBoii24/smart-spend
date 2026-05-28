import { useState } from "react";
import { Target, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Goal } from "@/types/finance";

interface GoalsSectionProps {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id" | "userId" | "createdAt">) => Promise<{ success: boolean; message: string }>;
  deleteGoal: (id: string) => Promise<{ success: boolean; message: string }>;
}

export default function GoalsSection({ goals, addGoal, deleteGoal }: GoalsSectionProps) {
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalCurrent, setGoalCurrent] = useState("");
  const [goalDate, setGoalDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleGoalSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!goalName.trim() || !goalTarget || !goalDate) {
      toast({
        title: "Missing goal details",
        description: "Please enter the goal name, target amount, and target date.",
        variant: "destructive",
      });
      return;
    }

    const target = parseFloat(goalTarget);
    const current = parseFloat(goalCurrent) || 0;

    if (target <= 0) {
      toast({
        title: "Invalid target amount",
        description: "Goal target amount must be a positive number.",
        variant: "destructive",
      });
      return;
    }

    if (current < 0) {
      toast({
        title: "Invalid current saved",
        description: "Current saved amount cannot be negative.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await addGoal({
      name: goalName.trim(),
      targetAmount: target,
      currentAmount: current,
      targetDate: goalDate,
    });

    toast({
      title: result.success ? "Goal Saved" : "Goal Setup Failed",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });

    if (result.success) {
      setGoalName("");
      setGoalTarget("");
      setGoalCurrent("");
      setGoalDate("");
    }
    setIsSubmitting(false);
  };

  const handleDeleteGoal = async (id: string) => {
    const result = await deleteGoal(id);
    toast({
      title: result.success ? "Goal Deleted" : "Delete Failed",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 animate-slide-in">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Target size={18} className="text-primary animate-bounce" />
        Financial Savings Goals
      </h3>

      <form onSubmit={handleGoalSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Goal Name</Label>
            <Input
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              placeholder="e.g. House Downpayment"
              className="h-10 bg-muted/30 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Target Amount (INR)</Label>
            <Input
              type="number"
              min="0"
              value={goalTarget}
              onChange={(e) => setGoalTarget(e.target.value)}
              placeholder="100000"
              className="h-10 bg-muted/30 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Current Saved (INR)</Label>
            <Input
              type="number"
              min="0"
              value={goalCurrent}
              onChange={(e) => setGoalCurrent(e.target.value)}
              placeholder="0"
              className="h-10 bg-muted/30 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Target Date</Label>
            <Input
              type="date"
              value={goalDate}
              onChange={(e) => setGoalDate(e.target.value)}
              className="h-10 bg-muted/30 text-sm"
            />
          </div>
        </div>
        <Button type="submit" size="sm" className="bg-success hover:bg-success/90 w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Add Goal"}
        </Button>
      </form>

      {goals.length > 0 ? (
        <div className="mt-6 space-y-3 max-h-60 overflow-y-auto pr-1">
          {goals.map((goal) => {
            const progress = goal.targetAmount > 0
              ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
              : 0;

            return (
              <div key={goal.id} className="p-3 rounded-xl bg-muted/20 hover:bg-muted/30 transition-all border border-border/30 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="font-semibold truncate">{goal.name}</span>
                    <span className="text-primary font-bold shrink-0">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 flex justify-between">
                    <span>{formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}</span>
                    <span className="font-medium text-foreground/80">By {goal.targetDate}</span>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => handleDeleteGoal(goal.id)} className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all rounded-full shrink-0">
                  <Trash2 size={14} />
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 p-4 rounded-xl border border-dashed border-border/50 text-center text-sm text-muted-foreground">
          No current savings goals configured. Add one above!
        </div>
      )}
    </div>
  );
}
