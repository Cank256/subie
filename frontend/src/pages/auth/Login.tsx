import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Mail, Lock, Phone, Info } from 'lucide-react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import useAuth  from '@/hooks/useAuth';
import type { Body_login_login_access_token as AccessToken } from "@/client"
import { type SubmitHandler, useForm } from "react-hook-form"
import { emailPattern } from "@/utils/utils"
import {
  FormErrorMessage,
} from "@chakra-ui/react"

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [phoneValue, setPhoneValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showEmailConfirmInfo, setShowEmailConfirmInfo] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  
  const [show, setShow] = useState<boolean>(false);
  const [emailValue, setEmailValue] = useState<string>('');
  const { login, error, resetError } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccessToken>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<AccessToken> = async (data) => {
    if (isSubmitting) return

    resetError()
    setEmailValue(data.username);
    
    try {
      await login.email(data)
    } catch (error) {
      // Check if error is an object with detail property
      if (error && typeof error === 'object' && 'body' in error) {
        const errorBody = error.body as { detail?: string | Array<{message: string, email: string}> };
        if (errorBody.detail) {
          if (Array.isArray(errorBody.detail) && errorBody.detail.length > 0) {
            const firstError = errorBody.detail[0];
            if (firstError.message === "Email not verified" && firstError.email) {
              setErrorMessage(firstError.message)
              setEmailValue(firstError.email);
              setShowEmailConfirmInfo(true);
            }
          }
        }
      }
    }
  }
  
  const handleResendConfirmation = async () => {
    setIsLoading(true);
    try {
      const { success } = await login.resendConfirmation(emailValue);
      if (success) {
        toast({
          title: "Confirmation email sent",
          description: "Please check your email for a confirmation link",
        });
      }
      setShowEmailConfirmInfo(false)
      setIsLoading(false)
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Failed to resend confirmation",
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Comment out or remove the signIn.phone call since it's not implemented
      // await signIn.phone(phoneValue);
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
      // Comment out or remove the signIn.otp call since it's not implemented
      // await signIn.otp(phoneValue, otp);
      navigate('/dashboard');
    } catch (error: unknown) {
      console.error('OTP verification error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred verifying OTP');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setSocialLoading(provider);
    try {
      if (provider === 'google') {
        await login.google();
      } else if (provider === 'facebook') {
        await login.facebook();
      } else if (provider === 'apple') {
        await login.apple();
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
    } finally {
      setSocialLoading(null);
    }
  };
  
  return (
    <Layout>
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to your Subie account to continue
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                {Object.keys(errors).length > 0 && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {errors.username?.message || errors.password?.message}
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {errorMessage ? errorMessage : error}
                    </AlertDescription>
                  </Alert>
                )}

                {showEmailConfirmInfo && (
                  <Alert className="mb-4">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Email Confirmation Required</AlertTitle>
                    <AlertDescription className="space-y-2">
                      <p>Please check your inbox for a confirmation email.</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleResendConfirmation}
                        disabled={isLoading}
                      >
                        Resend confirmation email
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="username" 
                        type="email" 
                        placeholder="you@example.com" 
                        className="pl-10"
                        {...register("username", {
                          required: "Username is required",
                          pattern: emailPattern,
                        })}
                      />
                      {errors.username && (
                        <FormErrorMessage>{errors.username.message}</FormErrorMessage>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password"
                        type={show ? "text" : "password"}  
                        placeholder="••••••••" 
                        className="pl-10"
                        {...register("password", {
                          required: "Password is required",
                        })}
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

                      {error && <FormErrorMessage>{error}</FormErrorMessage>}
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
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
                      {isLoading ? 'Verifying...' : 'Verify & Sign In'}
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
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">
                    Social login options
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mt-4">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full"
                  onClick={() => handleSocialLogin('google')}
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
                  onClick={() => handleSocialLogin('facebook')}
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
                  onClick={() => handleSocialLogin('apple')}
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
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Login;
