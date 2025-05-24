import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import PreviewPage from "./pages/PreviewPage";
import SharePage from "./pages/SharePage";
import "./App.css";

function App() {
  return (
    <MantineProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/share/:deckId" element={<SharePage />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
