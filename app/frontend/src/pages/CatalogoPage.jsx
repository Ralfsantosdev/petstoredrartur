import { useState, useEffect } from "react";
import axios from "axios";
import { Search, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const API = "/api";

const CatalogoPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${API}/products`),
          axios.get(`${API}/categories`)
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data.categories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-custom py-16">
      <h1 className="text-4xl font-bold mb-8">Catálogo de Produtos</h1>
      <div className="mb-8 max-w-md">
        <Input 
          placeholder="Buscar produtos..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <img src={product.image_url} alt={product.name} className="w-full aspect-square object-cover rounded-lg mb-4" />
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-teal-600 font-bold">R$ {product.price.toFixed(2)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CatalogoPage;
