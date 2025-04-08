import { useState } from 'react';
import { Link} from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Mail, Phone, Info } from 'lucide-react';
import Layout from "@/components/Layout";
import { useToast } from '@/hooks/use-toast';
import { LoginService } from "@/client"
import { ApiError } from "@/client/core/ApiError";

const ForgotPassword = () => {
  const { toast } = useToast();
  
  const [emailValue, setEmailValue] = useState('');
  const [phoneValue, setPhoneValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showEmailConfirmInfo, setShowEmailConfirmInfo] = useState(false);
  const [activeTab, setActiveTab] = useState('email');
  
  const handleResetWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      await LoginService.recoverPassword({ email: emailValue });
      toast({
        title: 'Email sent',
        description: 'We sent an email with a link to get back into your account.',
      });
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        const errorDetail = typeof error.body === 'object' && error.body !== null && 'detail' in error.body 
          ? String(error.body.detail) 
          : '';
        
        if (errorDetail) {
          setShowEmailConfirmInfo(false);
          setErrorMessage(errorDetail);
        } else {
          setErrorMessage('An error occurred during password reset request');
        }
      } else {
        setErrorMessage('An error occurred during password reset request');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // This function needs to be implemented or imported
      // await signIn.phone(phoneValue);
      toast({
        title: 'OTP sent',
        description: 'A verification code has been sent to your phone.',
      });
      setOtpSent(true);
    } catch (error: unknown) {
      console.error('OTP error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred sending OTP');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // This function needs to be implemented
      // await verifyOTP(phoneValue, otp);
      toast({
        title: 'Verification successful',
        description: 'You can now reset your password.',
      });
    } catch (error: unknown) {
      console.error('Verification error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred verifying OTP');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Password Recovery</h1>
            <p className="text-muted-foreground mt-2">
              {activeTab === 'email' 
                ? "A password recovery email will be sent to the registered account."
                : "An OTP SMS will be sent to your registered phone number."}
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <Tabs 
              defaultValue="email" 
              className="w-full"
              onValueChange={(value) => setActiveTab(value)}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                {errorMessage && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                {showEmailConfirmInfo && (
                  <Alert className="mb-4">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Email Confirmation Required</AlertTitle>
                    <AlertDescription className="space-y-2">
                      <p>Please check your inbox for a password reset request email.</p>
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleResetWithEmail} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="you@example.com" 
                        className="pl-10"
                        value={emailValue}
                        onChange={(e) => setEmailValue(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Verifying...' : 'Request Password Reset'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="phone">
                {errorMessage && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
                
                {!otpSent ? (
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="phone" 
                          type="tel" 
                          placeholder="+1 (555) 123-4567" 
                          className="pl-10"
                          value={phoneValue}
                          onChange={(e) => setPhoneValue(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Sending code...' : 'Send Code'}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter Verification Code</Label>
                      <Input 
                        id="otp" 
                        type="text" 
                        placeholder="123456" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        A verification code has been sent to {phoneValue}
                      </p>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Verifying...' : 'Send OTP'}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="w-full text-xs"
                      onClick={() => setOtpSent(false)}
                    >
                      Try a different phone number
                    </Button>
                  </form>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Remembered your password?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default ForgotPassword;
