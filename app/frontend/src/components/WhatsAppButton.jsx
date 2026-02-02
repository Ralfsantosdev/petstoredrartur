import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/557436214487"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 group animate-bounce-slow"
      data-testid="whatsapp-button"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="absolute right-full mr-3 bg-stone-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mb-1">
        Fale conosco no WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppButton;
