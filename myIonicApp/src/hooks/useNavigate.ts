import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom navigation hook that ensures the URL is properly updated
 * in all environments including mobile simulator extensions.
 * 
 * This hook wraps the standard history.push() with additional
 * window.history.pushState() to ensure URL updates work properly
 * in iframe-based mobile simulators.
 */
export const useNavigate = () => {
  const location = useLocation();

  const navigate = useCallback((route: string) => {
    // Get the full path including search and hash
    const fullPath = route;
    
    // Use history.push for SPA navigation
    window.history.pushState({ path: fullPath }, '', fullPath);
    
    // Also manually update the browser URL to ensure it changes
    // This helps in mobile simulators that use iframes
    try {
      if (window.self !== window.top) {
        // We're in an iframe - update parent's URL
        const parentWindow = window.parent;
        if (parentWindow && parentWindow.history) {
          parentWindow.history.pushState({ path: fullPath }, '', fullPath);
        }
      }
    } catch (e) {
      // Cross-origin restrictions may prevent accessing parent - ignore errors
    }
    
    // Force a re-render by updating the location manually
    // This triggers the router to navigate
    window.dispatchEvent(new PopStateEvent('popstate', { state: { path: fullPath } }));
  }, []);

  return navigate;
};

export default useNavigate;
