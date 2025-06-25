import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { LandingPage } from "./pages/landlingPage/LandingPage";
import { EncryptPage } from "./pages/EncryptPage";
import { DecryptPage } from "./pages/DecryptPage";
import { MyFilesPage } from "./pages/MyFilesPage";

// Create a client
const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/encrypt" element={<EncryptPage />} />
            <Route path="/decrypt/:fileId" element={<DecryptPage />} />
            <Route path="/decrypt" element={<DecryptPage />} />
            <Route path="/my-files" element={<MyFilesPage />} />
          </Routes>
        </Layout>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
