import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { router } from './router';
import { FinanceProvider } from './context/FinanceContext';

function App() {
  return (
    <FinanceProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </FinanceProvider>
  );
}

export default App;
