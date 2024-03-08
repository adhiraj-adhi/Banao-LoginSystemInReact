import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Forms from './components/Forms'
import RecoverPassword from './components/RecoverPassword';

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Forms />,
    },
    {
      path: "/recoverPassword/:token",
      element: <RecoverPassword />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App