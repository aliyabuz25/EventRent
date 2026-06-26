import React from 'react';
import Home from '../pages/Home';
import About from '../pages/About';
import Services from '../pages/Services';
import ServiceDetail from '../pages/ServiceDetail';
import Teambuilding from '../pages/Teambuilding';
import Catering from '../pages/Catering';
import TV from '../pages/TV';
import Portfolio from '../pages/Portfolio';
import Gallery from '../pages/Gallery';
import Contact from '../pages/Contact';
import Catalog from '../pages/Catalog';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Admin from '../pages/Admin';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import Premium from '../pages/Premium';

export const appRoutes: { path: string; element: React.ReactElement }[] = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/services', element: <Services /> },
  { path: '/services/:category', element: <ServiceDetail /> },
  { path: '/services/:category/:id', element: <ServiceDetail /> },
  { path: '/teambuilding', element: <Teambuilding /> },
  { path: '/catering', element: <Catering /> },
  { path: '/tv', element: <TV /> },
  { path: '/portfolio', element: <Portfolio /> },
  { path: '/gallery', element: <Gallery /> },
  { path: '/contact', element: <Contact /> },
  { path: '/catalog', element: <Catalog /> },
  { path: '/product/:id', element: <ProductDetail /> },
  { path: '/cart', element: <Cart /> },
  { path: '/admin', element: <Admin /> },
  { path: '/login', element: <Login /> },
  { path: '/profile', element: <Profile /> },
  { path: '/premium', element: <Premium /> },
];