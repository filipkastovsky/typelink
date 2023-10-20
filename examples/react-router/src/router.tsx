import { createBrowserRouter } from 'react-router-dom';
import Home from './pages';
import Company from './pages/company';
import Contact from './pages/contact';
import Features from './pages/features';
import Marketplace from './pages/marketplace';
import Login from './pages/auth/login';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: 'auth/login',
    Component: Login,
  },
  {
    path: 'company',
    Component: Company,
  },
  {
    path: 'contact',
    Component: Contact,
  },
  {
    path: 'features',
    Component: Features,
  },
  {
    path: 'marketplace',
    Component: Marketplace,
  },
  {
    path: 'team',
    Component: Marketplace,
  },
]);
