import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "@/pages/HomePage";
import AgendamentoPage from "@/pages/AgendamentoPage";
import CatalogoPage from "@/pages/CatalogoPage";
import ContatoPage from "@/pages/ContatoPage";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

function App() {
  return (
    <div className="App min-h-screen flex flex-col">
      <BrowserRouter>
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/agendamento" element={<AgendamentoPage />} />
            <Route path="/catalogo" element={<CatalogoPage />} />
            <Route path="/contato" element={<ContatoPage />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;
