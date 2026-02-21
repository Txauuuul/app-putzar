import { supabase } from './supabase';

export const verifyAdminPin = (pin: string): boolean => {
  const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || 'GalaFormal2026';
  return pin === correctPin;
};

export const getAdminSession = async (): Promise<{ isAdmin: boolean; token?: string }> => {
  // Check if admin session token exists in localStorage (client-side only)
  if (typeof window !== 'undefined') {
    const adminToken = localStorage.getItem('admin_session_token');
    const tokenTime = localStorage.getItem('admin_session_time');
    
    if (adminToken && tokenTime) {
      const createdTime = parseInt(tokenTime, 10);
      const now = Date.now();
      
      // Token valid for 24 hours
      if (now - createdTime < 86400000) {
        return { isAdmin: true, token: adminToken };
      } else {
        localStorage.removeItem('admin_session_token');
        localStorage.removeItem('admin_session_time');
      }
    }
  }
  
  return { isAdmin: false };
};

export const setAdminSession = (pin: string): boolean => {
  if (!verifyAdminPin(pin)) {
    return false;
  }
  
  if (typeof window !== 'undefined') {
    const token = `admin_${Date.now()}_${Math.random()}`;
    localStorage.setItem('admin_session_token', token);
    localStorage.setItem('admin_session_time', Date.now().toString());
    return true;
  }
  
  return false;
};

export const clearAdminSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_session_token');
    localStorage.removeItem('admin_session_time');
  }
};

export const getNotificationsEnabled = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('notifications_enabled')
      .single();
    
    if (error) {
      console.error('Error fetching settings:', error);
      return true; // Default to enabled if error
    }
    
    return data?.notifications_enabled ?? true;
  } catch (error) {
    console.error('Error in getNotificationsEnabled:', error);
    return true;
  }
};
