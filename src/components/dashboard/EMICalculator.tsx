import { useState } from "react";
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { EMIResult } from "@/types/finance";

interface EMICalculatorProps {
  calculateEMI: (principal: number, rate: number, tenure: number) => Promise<EMIResult | null>;
}

export default function EMICalculator({ calculateEMI }: EMICalculatorProps) {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [emiResult, setEmiResult] = useState<EMIResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const handleCalculate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!loanAmount || !interestRate || !tenure) {
      toast({
        title: "Missing input values",
        description: "Please enter loan amount, annual interest rate, and loan tenure.",
        variant: "destructive",
      });
      return;
    }

    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const time = parseFloat(tenure);

    if (isNaN(principal) || principal <= 0 || isNaN(rate) || rate <= 0 || isNaN(time) || time <= 0) {
      toast({
        title: "Invalid input values",
        description: "All loan values must be positive non-zero numbers.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);
    try {
      const result = await calculateEMI(principal, rate, time);
      if (result) {
        setEmiResult(result);
        toast({
          title: "EMI Calculated",
          description: "EMI values populated successfully.",
        });
      } else {
        toast({
          title: "Calculation failed",
          description: "Unable to contact EMI API right now.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("EMI Calculator Error:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 animate-slide-in">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Calculator className="text-primary animate-pulse" size={22} />
        EMI Loan Calculator
      </h2>
      <div className="grid lg:grid-cols-2 gap-8">
        <form onSubmit={handleCalculate} className="space-y-4">
          <div>
            <Label htmlFor="loanAmount">Loan Principal Amount (INR)</Label>
            <Input
              id="loanAmount"
              type="number"
              min="0"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="e.g. 500000"
              className="h-11 bg-muted/30"
            />
          </div>
          <div>
            <Label htmlFor="interestRate">Interest Rate (Annual %)</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.01"
              min="0"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="e.g. 8.5"
              className="h-11 bg-muted/30"
            />
          </div>
          <div>
            <Label htmlFor="tenure">Tenure (Years)</Label>
            <Input
              id="tenure"
              type="number"
              min="1"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              placeholder="e.g. 5"
              className="h-11 bg-muted/30"
            />
          </div>
          <Button type="submit" className="btn-gradient w-full sm:w-auto" disabled={isCalculating}>
            {isCalculating ? "Calculating..." : "Calculate EMI"}
          </Button>
        </form>

        <div className="p-6 rounded-xl bg-muted/20 flex flex-col justify-center">
          <h4 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wider">Calculated Breakdown</h4>
          {emiResult ? (
            <div className="space-y-4">
              <div className="flex justify-between items-baseline gap-4 border-b border-border/50 pb-2">
                <span className="text-muted-foreground text-sm">Monthly Installment (EMI)</span>
                <span className="font-extrabold text-primary text-2xl">{formatCurrency(emiResult.monthlyEMI)}</span>
              </div>
              <div className="flex justify-between items-center gap-4 border-b border-border/50 pb-2">
                <span className="text-muted-foreground text-sm">Total Interest Payable</span>
                <span className="font-semibold text-warning">{formatCurrency(emiResult.totalInterest)}</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-muted-foreground text-sm">Total Amount Payable</span>
                <span className="font-semibold text-foreground">{formatCurrency(emiResult.totalPayable)}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground text-sm">
              Enter loan details to view EMI repayment calculations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
