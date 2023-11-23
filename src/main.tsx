import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Game from './Game.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Game />,
    },
  ]);

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <>

      <RouterProvider router={router} />
      
  
    </>,
  );