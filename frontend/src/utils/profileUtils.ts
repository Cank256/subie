import { supabase } from '@/integrations/supabase/client';

export const compressImage = async (file: File, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }
            
            // Create a new file from the blob
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            
            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
};


// Function to fetch user notification settings
export const fetchNotificationSettings = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) throw error;
    
    return { success: true, settings: data };
  } catch (error: unknown) {
    console.error('Error fetching notification settings:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      settings: {
        email_notifications: true,
        push_notifications: true,
        sms_notifications: false,
        reminder_days: 3,
        billing_updates: true,
        new_features: true,
        tips: false,
        newsletter: true
      }
    };
  }
};

// Define a type for notification settings
type NotificationSettings = {
  user_id: string;
  email_notifications?: boolean;
  push_notifications?: boolean;
  sms_notifications?: boolean;
  reminder_days?: number;
  billing_updates?: boolean;
  new_features?: boolean;
  tips?: boolean;
  newsletter?: boolean;
  [key: string]: unknown;
};

// Function to save notification settings
export const saveNotificationSettings = async (settings: NotificationSettings, userId: string) => {
  try {
    const { error } = await supabase
      .from('user_settings')
      .update(settings)
      .eq('user_id', userId);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error: unknown) {
    console.error('Error saving notification settings:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Function to sign out a specific session
export const signOutSession = async (sessionId: string) => {
  try {
    const { error } = await supabase
      .from('user_login_sessions')
      .delete()
      .eq('id', sessionId);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error: unknown) {
    console.error('Error signing out session:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Function to sign out all sessions except current
export const signOutAllSessions = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('user_login_sessions')
      .delete()
      .eq('user_id', userId)
      .neq('is_current', true);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error: unknown) {
    console.error('Error signing out all sessions:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
