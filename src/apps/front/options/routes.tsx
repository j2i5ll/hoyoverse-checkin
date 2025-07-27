import Options from '@front/options/Options';
import Home from '@front/options/pages/Home';
import Laqoos from '@front/options/pages/Laqoos';
// import Notification from '@front/options/pages/Notification/Notification';
import {
  createHashRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';

const routeList: RouteObject[] = [
  {
    path: '/',
    element: <Options />,
    children: [
      {
        path: '/',
        loader: () => ({ title: 'check-in', logTitle: '체크인' }),
        element: <Home />,
      },
      {
        path: '/laqoos',
        loader: () => ({ title: 'LaQoos', logTitle: '라쿠스' }),
        element: <Laqoos />,
      },
      /*
  {
    path: '/notification',
    title: 'Notification',
    element: <Notification />,
  },
  */
    ],
  },
];

const router = createHashRouter(routeList);
export const OptionRoutes = () => (
  <RouterProvider router={router}></RouterProvider>
);
