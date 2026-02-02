import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";

const API = "/api";

const ContatoPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/contact`, formData);
      toast.success("Mensagem enviada com sucesso!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Erro ao enviar mensagem.");
    }
  };

  return (
    <div className="container-custom py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Entre em Contato</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-4">
               <Phone className="text-teal-600" />
               <span>(74) 3621-4487</span>
            </div>
            <div className="flex items-center gap-4">
               <Mail className="text-teal-600" />
               <span>contato@petstore.com.br</span>
            </div>
            <div className="flex items-center gap-4">
               <MapPin className="text-teal-600" />
               <span>R. Margem Rio do Ouro, 59 – Leader, Jacobina – BA</span>
            </div>
          </CardContent>
        </Card>
        <form onSubmit={handleSubmit} className="space-y-4">
           <Label>Nome</Label>
           <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
           <Label>E-mail</Label>
           <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
           <Label>Mensagem</Label>
           <Textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
           <Button type="submit" className="w-full">Enviar Mensagem</Button>
        </form>
      </div>
    </div>
  );
};

export default ContatoPage;
