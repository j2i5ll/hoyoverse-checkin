import {
  RouteInitializer,
  RouteLogger,
  RouteTracker,
} from '@front/popup/components/RouteInitializer';
import CheckInHome from '@front/popup/pages/CheckInHome';
import ResourceHome from '@front/popup/pages/ResourceHome';
import SelectCharacter from '@front/popup/pages/SelectCharacter';
import Notification from '@front/popup/pages/Notification';
import Popup from '@front/popup/Popup';
import { GameKey } from '@src/shared/constants/game';
import {
  createHashRouter,
  Navigate,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';

const routeList: RouteObject[] = [
  {
    path: '/',
    element: (
      <>
        <RouteInitializer />
        <RouteTracker />
        <RouteLogger />
        <Popup />
      </>
    ),

    children: [
      {
        path: '/',
        element: <CheckInHome />,
        loader: () => ({ title: '체크인' }),
      },
      {
        path: '/resource',
        children: [
          { path: '', element: <Navigate to={GameKey.Genshin} replace /> },
          {
            path: ':gameKey',
            element: <ResourceHome />,
            loader: () => ({ title: '리소스' }),
          },
          {
            path: 'selectCharacter',
            element: <SelectCharacter />,
            loader: () => ({ title: '캐릭터 선택' }),
          },
        ],
      },
      {
        path: '/notice',
        element: <Notification />,
        loader: () => ({ title: '알림' }),
      },
    ],
  },
];
const router = createHashRouter(routeList);
const PopupRoutes = () => {
  return <RouterProvider router={router}></RouterProvider>;
};
export default PopupRoutes;
