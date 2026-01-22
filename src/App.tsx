import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { FinanceProvider } from './context/FinanceContext';

function App() {
  return (
    <FinanceProvider>
      <RouterProvider router={router} />
    </FinanceProvider>
  );
}

export default App;
