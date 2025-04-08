import { useState, useEffect } from "react";
import { Subscription, SubscriptionCategory } from "@/types/subscription";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { categories } from "@/utils/mockData";
import { currencies } from "@/utils/profileConstants";

interface AddSubscriptionModalProps {
  subscription?: Subscription | null;
  onSave: (subscription: Partial<Subscription>) => void;
  onCancel: () => void;
}

const DEFAULT_SUBSCRIPTION: Partial<Subscription> = {
  name: "",
  description: "",
  amount: 0,
  currency: "USD",
  billingCycle: "monthly",
  category: "other",
  nextBillingDate: new Date(),
  logo: "",
  color: "#000000",
  active: true,
  autoRenew: true,
};

const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
  subscription,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Subscription>>(DEFAULT_SUBSCRIPTION);
  const isEditing = !!subscription;

  useEffect(() => {
    if (subscription) {
      setFormData(subscription);
    } else {
      setFormData(DEFAULT_SUBSCRIPTION);
    }
  }, [subscription]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) || 0 });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, nextBillingDate: date });
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit Subscription" : "Add New Subscription"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Update the details of your subscription."
            : "Add a new subscription to track your spending."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subscription Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="Netflix, Spotify, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Premium streaming service..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount || ""}
                onChange={handleNumberChange}
                placeholder="9.99"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleSelectChange("currency", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billingCycle">Billing Cycle</Label>
              <Select
                value={formData.billingCycle}
                onValueChange={(value) => handleSelectChange("billingCycle", value as "weekly" | "monthly" | "quarterly" | "yearly")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value as SubscriptionCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Next Billing Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.nextBillingDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.nextBillingDate ? (
                    format(formData.nextBillingDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.nextBillingDate}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Logo Text</Label>
              <Input
                id="logo"
                name="logo"
                value={formData.logo || ""}
                onChange={handleChange}
                maxLength={3}
                placeholder="N, S, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Brand Color</Label>
              <div className="flex">
                <Input
                  id="color"
                  name="color"
                  type="color"
                  value={formData.color || "#000000"}
                  onChange={handleChange}
                  className="w-12 h-10 p-1"
                />
                <Input
                  name="color"
                  value={formData.color || ""}
                  onChange={handleChange}
                  placeholder="#000000"
                  className="flex-1 ml-2"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => handleSwitchChange("active", checked)}
              />
              <Label htmlFor="active">Active</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="autoRenew"
                checked={formData.autoRenew}
                onCheckedChange={(checked) => handleSwitchChange("autoRenew", checked)}
              />
              <Label htmlFor="autoRenew">Auto-renew</Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Subscription" : "Add Subscription"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default AddSubscriptionModal;
