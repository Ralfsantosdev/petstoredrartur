import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Calendar, Clock, User, Phone, Mail, PawPrint, FileText, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const API = "/api";

const AgendamentoPage = () => {
  const [services, setServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentCreated, setAppointmentCreated] = useState(null);
  
  const [formData, setFormData] = useState({
    pet_name: "",
    pet_type: "",
    owner_name: "",
    owner_phone: "",
    owner_email: "",
    service_type: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "09:00",
    notes: ""
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API}/services`);
        setServices(res.data.services);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API}/appointments`, formData);
      setAppointmentCreated(res.data);
      toast.success("Agendamento realizado com sucesso!");
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Erro ao realizar agendamento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (appointmentCreated) {
    return (
      <div className="min-h-screen py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Agendamento Confirmado!</h1>
        <Button onClick={() => setAppointmentCreated(null)}>Fazer outro agendamento</Button>
      </div>
    );
  }

  return (
    <div className="container-custom py-16">
      <h1 className="text-4xl font-bold mb-8">Agendar Consulta</h1>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader><CardTitle>Informações do Pet</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Label>Nome do Pet</Label>
            <Input value={formData.pet_name} onChange={(e) => handleInputChange("pet_name", e.target.value)} />
            <Label>Tipo</Label>
            <Select onValueChange={(v) => handleInputChange("pet_type", v)}>
               <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
               <SelectContent>
                 <SelectItem value="cachorro">Cachorro</SelectItem>
                 <SelectItem value="gato">Gato</SelectItem>
               </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Informações do Tutor</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Label>Seu Nome</Label>
            <Input value={formData.owner_name} onChange={(e) => handleInputChange("owner_name", e.target.value)} />
            <Label>Telefone</Label>
            <Input value={formData.owner_phone} onChange={(e) => handleInputChange("owner_phone", e.target.value)} />
          </CardContent>
        </Card>
        <div className="md:col-span-2 text-center">
          <Button type="submit" disabled={isSubmitting}>Confirmar Agendamento</Button>
        </div>
      </form>
    </div>
  );
};

export default AgendamentoPage;
