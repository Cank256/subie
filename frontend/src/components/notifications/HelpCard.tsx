
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const HelpCard = () => {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle>Need Help?</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">
          If you're not receiving notifications or need help with your settings, our support team is here to assist you.
        </p>
        <Button variant="outline" className="w-full" onClick={() => window.location.href = '/contact'}>
          Contact Support
        </Button>
      </CardContent>
    </Card>
  );
};

