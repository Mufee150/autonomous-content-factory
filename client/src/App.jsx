import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { AppProvider } from "./context/AppContext";

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
        </Routes>
      </AppProvider>
    </HashRouter>
  );
}

