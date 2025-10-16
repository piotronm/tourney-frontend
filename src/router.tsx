import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { DivisionsPage } from './pages/DivisionsPage';
import { DivisionDetailPage } from './pages/DivisionDetailPage';
import { StandingsPage } from './pages/StandingsPage';
import { MatchesPage } from './pages/MatchesPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'divisions',
        element: <DivisionsPage />,
      },
      {
        path: 'divisions/:id',
        element: <DivisionDetailPage />,
        children: [
          {
            index: true,
            element: <Navigate to="standings" replace />,
          },
          {
            path: 'standings',
            element: <StandingsPage />,
          },
          {
            path: 'matches',
            element: <MatchesPage />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
