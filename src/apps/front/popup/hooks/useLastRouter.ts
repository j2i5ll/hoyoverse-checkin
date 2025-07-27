import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'

const STORAGE_LAST_ROUTER_KEY = 'last_router'
export function useLastRouter () {
  const location = useLocation();
  useEffect(() => {
    window.localStorage.setItem(STORAGE_LAST_ROUTER_KEY, location.pathname)
  }, [location])
  return window.localStorage.getItem(STORAGE_LAST_ROUTER_KEY)
}
