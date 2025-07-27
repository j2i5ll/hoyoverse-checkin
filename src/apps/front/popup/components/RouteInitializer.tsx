import { GameKey } from '@src/shared/constants/game';
import { ga } from '@src/shared/ga';
import { useEffect } from 'react';
import { useLocation, useMatches, useNavigate } from 'react-router-dom';

const ALLOW_PATH = [
  '/',
  ...Object.entries(GameKey).map(([, value]) => `/resource/${value}`),
];
const LAST_ROUTE_STORAGE_KEY = 'lastVisitedRoute';
export const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (ALLOW_PATH.includes(location.pathname)) {
      localStorage.setItem(LAST_ROUTE_STORAGE_KEY, location.pathname);
    }
  }, [location.pathname]);

  return null;
};

export const RouteInitializer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const lastRoute = localStorage.getItem(LAST_ROUTE_STORAGE_KEY);
    const currentRoute = location.pathname;
    if (lastRoute && lastRoute !== currentRoute) {
      navigate(lastRoute, { replace: true });
    }
  }, []);

  return null;
};

type RouterData = { title: string };
export const RouteLogger = () => {
  const location = useLocation();
  const match = useMatches();
  useEffect(() => {
    const last = match.pop();
    const title = (last.data as RouterData)?.title;
    if (title) {
      ga.firePageViewEvent(title, location.pathname);
    }
  }, [match]);
  return null;
};
