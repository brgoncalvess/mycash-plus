import { FinanceProvider } from './context/FinanceContext';
import { Layout } from './components/layout/Layout';

function App() {
  return (
    <FinanceProvider>
      <Layout>
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold mb-4 text-brand-dark">mycash+</h1>
          <p className="text-gray-600">Sistema de Gestão Financeira Familiar</p>
          <p className="text-sm text-gray-400 mt-2">Dashboard em construção...</p>
        </div>
      </Layout>
    </FinanceProvider>
  );
}

export default App;
