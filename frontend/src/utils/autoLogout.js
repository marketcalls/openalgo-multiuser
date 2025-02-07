import { differenceInMilliseconds } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const AUTO_LOGOUT_TIME = '03:30';  // Set to 3:30 AM IST
const TIMEZONE = 'Asia/Kolkata';

export const setupAutoLogout = (logoutCallback) => {
  const checkAndScheduleLogout = () => {
    const now = toZonedTime(new Date(), TIMEZONE);
    const [hours, minutes] = AUTO_LOGOUT_TIME.split(':').map(Number);
    
    // Create today's logout time
    let logoutTime = toZonedTime(new Date(), TIMEZONE);
    logoutTime.setHours(hours, minutes, 0, 0);
    
    // If the logout time has already passed today, schedule for tomorrow
    if (now > logoutTime) {
      logoutTime.setDate(logoutTime.getDate() + 1);
    }
    
    // Calculate milliseconds until logout
    const msUntilLogout = differenceInMilliseconds(logoutTime, now);
    
    // Schedule the logout
    const timeoutId = setTimeout(() => {
      logoutCallback();
      // Schedule next day's logout after executing
      checkAndScheduleLogout();
    }, msUntilLogout);
    
    // Store the timeout ID for cleanup
    return timeoutId;
  };
  
  // Start the initial scheduling
  const timeoutId = checkAndScheduleLogout();
  
  // Return cleanup function
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
};
