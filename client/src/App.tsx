import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { theme } from "./theme";
import { queryClient } from "./api";
import Layout from "./components/Layout";
import PasswordGate from "./components/PasswordGate";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import PreviewPage from "./pages/PreviewPage";
import SharePage from "./pages/SharePage";
import "./App.css";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider defaultColorScheme="light" theme={theme}>
        <PasswordGate>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create" element={<CreatePage />} />
                <Route path="/preview" element={<PreviewPage />} />
                <Route path="/share/:deckId" element={<SharePage />} />
              </Routes>
            </Layout>
          </Router>
        </PasswordGate>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
