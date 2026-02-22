import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * URL Sync Component
 * 
 * This component ensures the browser URL is always in sync with the router.
 * It handles cases where the URL doesn't update properly, especially in
 * mobile simulator extensions that use iframes.
 * 
 * Add this component to your app's root to ensure proper URL synchronization.
 */
const URLSync: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Get the current router path
    const routerPath = location.pathname + location.search + location.hash;
    
    // Update the iframe's history
    if (window.location.pathname + window.location.search !== routerPath) {
      window.history.pushState({ path: routerPath }, '', routerPath);
    }
    
    // If running in an iframe (mobile simulator), try to update parent's URL
    try {
      if (window.self !== window.top) {
        // We're in an iframe - update parent's URL
        const parentWindow = window.parent;
        if (parentWindow && parentWindow.history) {
          parentWindow.history.pushState({ path: routerPath }, '', routerPath);
        }
        
        // Also try to set the parent's location directly if pushState doesn't work
        // This helps with some mobile simulators
        if (parentWindow && parentWindow.location) {
          const parentPath = parentWindow.location.pathname + parentWindow.location.search;
          if (parentPath !== routerPath) {
            // Use replace to avoid cluttering browser history
            parentWindow.history.replaceState({ path: routerPath }, '', routerPath);
          }
        }
      }
    } catch (e) {
      // Cross-origin restrictions may prevent accessing parent - ignore errors
      console.log('URLSync: Could not access parent frame', e);
    }
  }, [location]);

  // This component doesn't render anything
  return null;
};

export default URLSync;
