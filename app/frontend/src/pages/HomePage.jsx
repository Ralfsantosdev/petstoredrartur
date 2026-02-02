import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  Star, 
  ArrowRight, 
  Stethoscope, 
  ShoppingBag, 
  Scissors, 
  Truck,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Quote,
  Shield,
  Heart,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Use environment variable or fallback to localhost
const API = "/api";

const HomePage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Seed data first
        await axios.post(`${API}/seed`);
        
        // Then fetch
        const [testimonialsRes, productsRes] = await Promise.all([
          axios.get(`${API}/testimonials`),
          axios.get(`${API}/products?featured=true`)
        ]);
        setTestimonials(testimonialsRes.data);
        setProducts(productsRes.data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const services = [
    {
      icon: Stethoscope,
      title: "Consulta Veterinária",
      description: "Atendimento completo com diagnóstico preciso e orientação profissional para seu pet.",
      color: "bg-teal-50 text-teal-600"
    },
    {
      icon: ShoppingBag,
      title: "Pet Shop Completo",
      description: "Produtos de qualidade selecionados para alimentação, higiene e bem-estar animal.",
      color: "bg-orange-50 text-orange-600"
    },
    {
      icon: Scissors,
      title: "Banho e Tosa",
      description: "Serviços de higiene e estética com profissionais experientes e produtos premium.",
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      icon: Truck,
      title: "Entrega em Domicílio",
      description: "Receba seus produtos em casa com rapidez e segurança em toda Jacobina.",
      color: "bg-blue-50 text-blue-600"
    }
  ];

  const stats = [
    { value: "4,4", label: "Avaliação Google", icon: Star },
    { value: "118+", label: "Avaliações", icon: Award },
    { value: "10+", label: "Anos de Experiência", icon: Shield },
    { value: "1000+", label: "Pets Atendidos", icon: Heart }
  ];

  return (
    <div data-testid="home-page">
      {/* Hero Section */}
      <section className="gradient-hero relative overflow-hidden" data-testid="hero-section">
        <div className="container-custom py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-6">
                <div className="flex">
                  {[1,2,3,4,5].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-stone-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-stone-700">4,4 estrelas • 118 avaliações</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-tight mb-6">
                Cuidado Veterinário com{" "}
                <span className="gradient-text">Amor e Excelência</span>{" "}
                em Jacobina
              </h1>

              <p className="text-lg md:text-xl text-stone-600 mb-8 max-w-xl">
                Seu pet não é um número. Na Petstore Dr. Artur Teixeira, tratamos seu melhor amigo como família, 
                com atendimento humanizado e profissionalismo há mais de 10 anos.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/agendamento" data-testid="hero-agendar-btn">
                  <Button className="btn-primary w-full sm:w-auto">
                    Agendar Consulta
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <a 
                  href="https://wa.me/557436214487"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="hero-whatsapp-btn"
                >
                  <Button variant="outline" className="btn-secondary w-full sm:w-auto">
                    Falar no WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10">
                <img
                   src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800"
                  alt="Veterinário examinando cachorro"
                  className="w-full h-auto rounded-3xl shadow-2xl object-cover aspect-[4/3]"
                  data-testid="hero-image"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-teal-200 rounded-full opacity-60 blur-xl" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-orange-200 rounded-full opacity-60 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-y border-stone-100" data-testid="stats-section">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-50 rounded-2xl mb-3">
                  <stat.icon className="w-6 h-6 text-teal-600" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-stone-900">{stat.value}</p>
                <p className="text-sm text-stone-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-stone-50" data-testid="services-section">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-teal-600 font-medium text-sm uppercase tracking-wider">Nossos Serviços</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 mt-4 mb-6">
              Tudo que seu Pet Precisa em um Só Lugar
            </h2>
            <p className="text-lg text-stone-600">
              Oferecemos atendimento completo com profissionais qualificados e produtos de qualidade.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="service-card group cursor-pointer"
                data-testid={`service-card-${index}`}
              >
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-900 mb-3">{service.title}</h3>
                  <p className="text-stone-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/agendamento" data-testid="services-agendar-btn">
              <Button className="btn-primary">
                Agendar Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="section-padding bg-white" data-testid="testimonials-section">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-teal-600 font-medium text-sm uppercase tracking-wider">Depoimentos</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 mt-4 mb-6">
                O que Nossos Clientes Dizem
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <Card className="testimonial-card relative" data-testid="testimonial-card">
                <CardContent className="p-8 md:p-12">
                  <Quote className="w-12 h-12 text-teal-200 mb-6" />
                  
                  <p className="text-xl md:text-2xl text-stone-700 mb-8 leading-relaxed">
                    "{testimonials[currentTestimonial]?.text}"
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-stone-900">
                        {testimonials[currentTestimonial]?.author_name}
                      </p>
                      {testimonials[currentTestimonial]?.pet_name && (
                        <p className="text-sm text-stone-500">
                          Tutor(a) de {testimonials[currentTestimonial]?.pet_name}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={prevTestimonial}
                        className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center hover:bg-teal-100 transition-colors"
                        data-testid="testimonial-prev-btn"
                      >
                        <ChevronLeft className="w-5 h-5 text-stone-600" />
                      </button>
                      <button
                        onClick={nextTestimonial}
                        className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center hover:bg-teal-100 transition-colors"
                        data-testid="testimonial-next-btn"
                      >
                        <ChevronRight className="w-5 h-5 text-stone-600" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-teal-600 relative overflow-hidden" data-testid="cta-section">
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Seu Pet Precisa de Cuidado Agora?
            </h2>
            <p className="text-xl text-teal-100 mb-10">
              Entre em contato e agende uma consulta. Estamos prontos para cuidar do seu melhor amigo 
              com todo carinho e profissionalismo.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/agendamento" data-testid="cta-agendar-btn">
                <Button className="bg-white text-teal-600 hover:bg-stone-100 h-14 px-10 rounded-full font-semibold text-lg transition-all">
                  Agendar Consulta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
