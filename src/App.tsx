import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { router } from './router';
import { FinanceProvider } from './context/FinanceContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;
