import { useState } from 'react';
import { Link } from 'react-router-dom';
import { type SubmitHandler, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Lock, 
  // Phone, 
  AlertCircle,
  // Info
} from 'lucide-react';
import Layout from "@/components/Layout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import type { UserRegister } from "@/client"
import useAuth  from '@/hooks/useAuth';
import { confirmPasswordRules, emailPattern, passwordRules, termsRules } from "@/utils/utils"

interface UserRegisterForm extends UserRegister {
  confirm_password: string
}

const SignUp = () => {
  const { signUpMutation, error, resetError } = useAuth();
  
  // const [phone, setPhone] = useState('');
  // const [otpSent, setOtpSent] = useState(false);
  // const [otp, setOtp] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [socialLoading] = useState<string | null>(null);
  // const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [show, setShow] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      confirm_password: "",
    },
  })

  const onSubmit: SubmitHandler<UserRegisterForm> = (data) => {
    if (isSubmitting) return

    resetError()

    signUpMutation.mutate(data)
  }

  termsRules(agreeTerms)
  
  // const handlePhoneSignup = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!agreeTerms) {
  //     return;
  //   }
    
  //   setIsLoading(true);
    
  //   try {
  //     await signUp.phone(phone);
  //     setOtpSent(true);
  //   } catch (error) {
  //     console.error('Phone signup error:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  
  // const handleSocialSignup = async (provider: 'google' | 'facebook' | 'apple') => {
  //   setSocialLoading(provider);
  //   try {
  //     if (provider === 'google') {
  //       await signIn.google();
  //     } else if (provider === 'facebook') {
  //       await signIn.facebook();
  //     } else if (provider === 'apple') {
  //       await signIn.apple();
  //     }
  //   } catch (error) {
  //     console.error(`${provider} signup error:`, error);
  //   } finally {
  //     setSocialLoading(null);
  //   }
  // };
  
  return (
    <Layout>
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Create Your Account</h1>
            <p className="text-muted-foreground mt-2">
              Join Subie and start managing your subscriptions
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="first_name" 
                          placeholder="John" 
                          className="pl-10"
                          minLength={3}
                          {...register("first_name", { required: "First Name is required" })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="last_name" 
                          placeholder="Doe" 
                          className="pl-10"
                          minLength={3}
                          {...register("last_name", { required: "Last Name is required" })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="you@example.com" 
                        className="pl-10"
                        {...register("email", {
                          required: "Email is required",
                          pattern: emailPattern,
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        type={show ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="pl-10"
                        {...register("password", passwordRules())}
                      />
                      <div 
                        className="absolute right-3 top-3 cursor-pointer" 
                        onClick={() => setShow(!show)}
                        aria-label={show ? "Hide password" : "Show password"}
                      >
                        {show ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                            <line x1="2" x2="22" y1="2" y2="22"></line>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="confirm_password" 
                        type={show ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="pl-10"
                        {...register("confirm_password", confirmPasswordRules(getValues))}
                      />
                    </div>
                  </div>
                  
                  {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        { 
                          errors.first_name?.message || 
                          errors.last_name?.message || 
                          errors.email?.message || 
                          errors.password?.message || 
                          errors.confirm_password?.message
                        }
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={agreeTerms}
                      onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                      required
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting || !agreeTerms}>
                    {isSubmitting ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
              
              {/* <TabsContent value="phone">
                {!otpSent ? (
                  <form onSubmit={handlePhoneSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="phone" 
                          type="tel" 
                          placeholder="+1 (555) 123-4567" 
                          className="pl-10"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        We'll send a verification code to this number
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="termsPhone" 
                        checked={agreeTerms}
                        onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                        required
                      />
                      <Label htmlFor="termsPhone" className="text-sm">
                        I agree to the{" "}
                        <Link to="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading || !agreeTerms}>
                      {isLoading ? 'Sending code...' : 'Send Verification Code'}
                    </Button>
                  </form>
                ) : (
                  <form className="space-y-4">
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
                        We've sent a code to {phone}
                      </p>
                    </div>
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Verification Required</AlertTitle>
                      <AlertDescription>
                        Please enter the code we sent to verify your phone number.
                      </AlertDescription>
                    </Alert>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Verifying...' : 'Verify & Create Account'}
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
              </TabsContent> */}
            </Tabs>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mt-4">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full" 
                  // onClick={() => handleSocialSignup('google')}
                  disabled={socialLoading === 'google'}
                >
                  {socialLoading === 'google' ? (
                    <div className="h-4 w-4 border-t-2 border-b-2 border-current rounded-full animate-spin mr-2" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="h-5 w-5">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      <path d="M1 1h22v22H1z" fill="none"/>
                    </svg>
                  )}
                  <span className="ml-2">Google</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full" 
                  // onClick={() => handleSocialSignup('facebook')}
                  disabled={socialLoading === 'facebook'}
                >
                  {socialLoading === 'facebook' ? (
                    <div className="h-4 w-4 border-t-2 border-b-2 border-current rounded-full animate-spin mr-2" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1877F2" className="h-5 w-5">
                      <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"></path>
                    </svg>
                  )}
                  <span className="ml-2">Facebook</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full"
                  // onClick={() => handleSocialSignup('apple')}
                  disabled={socialLoading === 'apple'}
                >
                  {socialLoading === 'apple' ? (
                    <div className="h-4 w-4 border-t-2 border-b-2 border-current rounded-full animate-spin mr-2" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M17.569 12.6254C17.597 15.1174 19.8125 16.0679 19.8423 16.0892C19.8211 16.159 19.5453 17.1732 18.8034 18.2365C18.1849 19.1411 17.5387 20.0413 16.5584 20.0625C15.5992 20.0837 15.2647 19.4926 14.1435 19.4926C13.0223 19.4926 12.6559 20.0625 11.7425 20.0837C10.7834 20.105 10.0628 19.0991 9.44435 18.1988C8.1727 16.351 7.17387 12.8506 8.48709 10.4667C9.13306 9.29133 10.278 8.54061 11.531 8.51939C12.4487 8.49817 13.3006 9.15308 13.8668 9.15308C14.433 9.15308 15.473 8.3726 16.5797 8.43505C17.0595 8.45627 18.3471 8.62502 19.1895 9.83199C19.1175 9.87443 17.5471 10.7557 17.569 12.6254ZM15.7235 6.43587C16.2386 5.78097 16.5965 4.88081 16.4912 3.9999C15.722 4.04234 14.743 4.54542 14.2066 5.2003C13.7256 5.79055 13.2943 6.73682 13.4208 7.5851C14.2703 7.64754 15.2086 7.09076 15.7235 6.43587Z" />
                    </svg>
                  )}
                  <span className="ml-2">Apple</span>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
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

export default SignUp;
