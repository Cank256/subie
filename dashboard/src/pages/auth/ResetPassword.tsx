
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lock, AlertCircle } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import Layout from '@/components/Layout';
import { type ApiError, LoginService, type NewPassword } from "@/client"
import { useToast } from "@/hooks/use-toast"
import { confirmPasswordRules, handleError, passwordRules } from "@/utils/utils"

interface NewPasswordForm extends NewPassword {
  new_password: string
  confirm_password: string
}

function ResetPassword() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<NewPasswordForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      new_password: "",
    },
  })

  const resetPassword = async (data: NewPassword) => {
    const token = new URLSearchParams(window.location.search).get("token")
    if (!token) return
    await LoginService.resetPassword({
      requestBody: { new_password: data.new_password, token: token },
    })
  }

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Password updated successfully.',
      });
      reset()
      navigate("/login")
    },
    onError: (err: ApiError) => {
      handleError(err, toast)
    },
  })

  const onSubmit: SubmitHandler<NewPasswordForm> = async (data) => {
    setIsLoading(true)
    mutation.mutate(data)
    setIsLoading(false)
  }

  // const resetPassword = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setErrorMessage('');

  //   const token = new URLSearchParams(window.location.search).get("token")
  //   if (!token) return
    
  //   // Get the password value from the form
  //   const form = e.target as HTMLFormElement;
  //   const passwordInput = form.querySelector('input[type="password"]') as HTMLInputElement;
  //   const newPassword = passwordInput.value;
    
  //   try {
  //     await LoginService.resetPassword({
  //       requestBody: { new_password: newPassword, token: token },
  //     })
  //     navigate("/login")
  //     toast({
  //       title: 'Password reset succesful',
  //       description: 'Your password has been reset successfully',
  //     });
  //     setIsLoading(false);
  //   } catch (error: any) {
  //     // console.error('Login error');
  //     const error_message = error.body.detail?? '';
  //     if (error_message) {
  //       setErrorMessage(error_message);
  //     }  else {
  //       setErrorMessage(error.message || 'An error occurred during password reset request');
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <Layout>
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground mt-2"></p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        type={show ? "text" : "password"}   
                        placeholder="••••••••" 
                        className="pl-10"
                        {...register("new_password", passwordRules())}
                        required
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
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="confirmPassword" 
                        type={show ? "text" : "password"}   
                        placeholder="••••••••" 
                        className="pl-10"
                        {...register("confirm_password", confirmPasswordRules(getValues))}
                        required
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

                  {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        {  
                          errors.new_password?.message || 
                          errors.confirm_password?.message
                        }
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Reseting...' : 'Reset Password'}
                  </Button>
                </form>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  )
}

export default ResetPassword;
