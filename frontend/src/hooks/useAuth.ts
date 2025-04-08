import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom";
import { useState } from "react"

import { AxiosError } from "axios"
import {
  type Body_login_login_access_token as AccessToken,
  type ApiError,
  type UserPublic,
  type UserRegister,
  type Session,
  type UserUpdateMe,
  type UsersPreferencesUpdateData,
  LoginService,
  UsersService,
  UserSessionsService,
} from "../client"
import { useToast } from '@/hooks/use-toast';
import { setOpenAPIToken } from "../client/core/OpenAPI";

export const isLoggedIn = () => {
  return localStorage.getItem("subie-token") !== null
}

const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<UserPublic | null, Error>({
    queryKey: ["currentUser"],
    queryFn: () => UsersService.readUserProfile(),
    enabled: isLoggedIn(),
  })

  const [sessions, setSessions] = useState<Session[] | null>(() => {
    const session = localStorage.getItem('subie-session');
    return session ? JSON.parse(session) : null;
  });

  const signUpMutation = useMutation({
    mutationFn: (data: UserRegister) =>
      UsersService.registerUser({ requestBody: data }),

    onSuccess: () => {
      navigate("/login" );
      toast({
        title: "Account created",
        description: "Your account has been created successfully. Please check your email for a confirmation link.",
      });
    },
    onError: (err: ApiError) => {
      let errDetail = (err.body as { detail: string })?.detail

      if (err instanceof AxiosError) {
        errDetail = err.message
      }

      setError(errDetail)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  const login = {
    email: async (data: AccessToken) => {
      try {
        const response = await LoginService.loginAccessToken({
          formData: data,
        })
        localStorage.setItem("subie-token", response.access_token)
        setOpenAPIToken(response.access_token);

        const userData = await UsersService.readUserProfile();
    
        if (userData && userData.id) {
          await logUserSession(userData.id);
        }

        navigate("/dashboard");

        toast({
          title: "Logged in successfully",
          description: "You are succesfully logged in.",
        })
      } catch (err: unknown) {
        let errDetail = err && typeof err === 'object' && 'body' in err ? 
            (err.body as { detail: string | Array<{message: string, email: string}> })?.detail : undefined;

        if (err instanceof AxiosError) {
          errDetail = err.message
        }

        if (Array.isArray(errDetail)) {
          // Check if any item in the array has an email property
          const hasEmailProperty = errDetail.some(item => 
            typeof item === 'object' && item !== null && 'email' in item
          );
          
          // Only convert to string if email is not part of the array
          if (!hasEmailProperty) {
            errDetail = errDetail.map(item => 
              typeof item === 'object' ? JSON.stringify(item) : String(item)
            ).join(', ');
          } else {
            // If it has email property, convert to string for display but preserve the structure
            errDetail = JSON.stringify(errDetail);
          }
        }

        setError(errDetail ?? null);
        throw err;
      }
    },
    google: async () => {
      try {
        window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/google/login`;
      } catch (error: unknown) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Failed to initiate Google login",
        });
        throw error;
      }
    },
    facebook: async () => {
      try {
        window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/facebook`;
      } catch (error: unknown) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Failed to initiate Facebook login",
        });
        throw error;
      }
    },
    apple: async () => {
      try {
        window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/apple`;
      } catch (error: unknown) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Failed to initiate Apple login",
        });
        throw error;
      }
    },
    resendConfirmation: async (email: string) => {
      try {
        await LoginService.resendConfirmation({
          email: email,
        })
        
        toast({
          title: "Confirmation email sent",
          description: "Please check your email for a confirmation link",
        });
        return { success: true };
      } catch (error: unknown) {
        toast({
          variant: "destructive",
          title: "Failed to resend confirmation",
          description: error instanceof Error ? error.message : "An unknown error occurred",
        });
        throw error;
      }
    }
  }

  const updateUser = async (data: UserUpdateMe) => {
    try {
      await UsersService.updateUserMe({
        requestBody: data,
      });
      return { success: true };
    } catch (error: unknown) {
      console.error("Error updating user profile:", error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await UsersService.updatePasswordMe({
        requestBody: { current_password: currentPassword, new_password: newPassword },
      });
      return { success: true };
    } catch (error: unknown) {
      console.error("Error updating user password:", error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  const saveUserPreferences = async (data: UsersPreferencesUpdateData) => {
    try {
      await UsersService.updateUserPreferences(data);
      return { success: true };
    } catch (error: unknown) {
      console.error("Error updating user preferences:", error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    return {
      deviceName: `${platform} - ${userAgent.split('(')[1]?.split(')')[0] || 'Unknown'}`,
      deviceType: /Mobile|Android|iPhone/i.test(userAgent) ? 'Mobile' : 'Desktop',
      ipAddress: '0.0.0.0', 
      location: 'Unknown',
    };
  };

  const logUserSession = async (userId: string) => {
    try {
      const deviceInfo = getDeviceInfo();
      
      const { sessions } = await UserSessionsService.readUserSessions();

      if (sessions.length !== 0) {
        await UserSessionsService.updateCurrentSession({
          session_id: sessions[0].id,
          requestBody: { user_id: userId, is_current: false },
        });
        setSessions(sessions as unknown as Session[]);
        localStorage.setItem('subie-session', JSON.stringify(sessions));
        return { success: true };
      }

      await UserSessionsService.createUserSession({
        requestBody: { 
          user_id: userId, 
          device_name: deviceInfo.deviceName || 'Unknown Device', 
          device_type: deviceInfo.deviceType || 'Unknown', 
          device_ip: deviceInfo.ipAddress || 'Unknown', 
          location: deviceInfo.location || 'Unknown', 
        },
      });

      setSessions(sessions as unknown as Session[]);
      localStorage.setItem('subie-session', JSON.stringify(sessions));
      return { success: true };
    } catch (error: unknown) {
      console.error("Error logging user session:", error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const logout = () => {
    localStorage.removeItem("subie-token")
    localStorage.removeItem("subie-session")
    localStorage.removeItem("subscriptions")
    setOpenAPIToken(null);
    setSessions(null);
    navigate("/login");
  }

  return {
    signUpMutation,
    login,
    logout,
    user,
    isLoading,
    sessions,
    error,
    updateUser,
    updatePassword,
    saveUserPreferences,
    logUserSession,
    resetError: () => setError(null),
  }
}

export default useAuth
