from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============ MODELS ============

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Product Models
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    category: str
    image_url: str
    stock: int = 0
    featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image_url: str
    stock: int = 0
    featured: bool = False

# Appointment Models
class Appointment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    pet_name: str
    pet_type: str
    owner_name: str
    owner_phone: str
    owner_email: Optional[str] = None
    service_type: str
    date: str
    time: str
    notes: Optional[str] = None
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AppointmentCreate(BaseModel):
    pet_name: str
    pet_type: str
    owner_name: str
    owner_phone: str
    owner_email: Optional[str] = None
    service_type: str
    date: str
    time: str
    notes: Optional[str] = None

# Testimonial Models
class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    author_name: str
    rating: int
    text: str
    pet_name: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TestimonialCreate(BaseModel):
    author_name: str
    rating: int
    text: str
    pet_name: Optional[str] = None

# Contact Models
class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str

# ============ ROUTES ============

@api_router.get("/")
async def root():
    return {"message": "Petstore Dr. Artur Teixeira API"}

# Status routes
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# Product routes
@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None, featured: Optional[bool] = None):
    query = {}
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    products = await db.products.find(query, {"_id": 0}).to_list(100)
    for product in products:
        if isinstance(product.get('created_at'), str):
            product['created_at'] = datetime.fromisoformat(product['created_at'])
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    if isinstance(product.get('created_at'), str):
        product['created_at'] = datetime.fromisoformat(product['created_at'])
    return product

@api_router.post("/products", response_model=Product)
async def create_product(input: ProductCreate):
    product_obj = Product(**input.model_dump())
    doc = product_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.products.insert_one(doc)
    return product_obj

# Appointment routes
@api_router.get("/appointments", response_model=List[Appointment])
async def get_appointments():
    appointments = await db.appointments.find({}, {"_id": 0}).to_list(1000)
    for appt in appointments:
        if isinstance(appt.get('created_at'), str):
            appt['created_at'] = datetime.fromisoformat(appt['created_at'])
    return appointments

@api_router.post("/appointments", response_model=Appointment)
async def create_appointment(input: AppointmentCreate):
    appt_obj = Appointment(**input.model_dump())
    doc = appt_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.appointments.insert_one(doc)
    return appt_obj

@api_router.get("/appointments/{appointment_id}", response_model=Appointment)
async def get_appointment(appointment_id: str):
    appt = await db.appointments.find_one({"id": appointment_id}, {"_id": 0})
    if not appt:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    if isinstance(appt.get('created_at'), str):
        appt['created_at'] = datetime.fromisoformat(appt['created_at'])
    return appt

@api_router.patch("/appointments/{appointment_id}")
async def update_appointment_status(appointment_id: str, status: str):
    result = await db.appointments.update_one(
        {"id": appointment_id},
        {"$set": {"status": status}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    return {"message": "Status atualizado com sucesso"}

# Testimonial routes
@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    testimonials = await db.testimonials.find({}, {"_id": 0}).to_list(100)
    for t in testimonials:
        if isinstance(t.get('created_at'), str):
            t['created_at'] = datetime.fromisoformat(t['created_at'])
    return testimonials

@api_router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(input: TestimonialCreate):
    testimonial_obj = Testimonial(**input.model_dump())
    doc = testimonial_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.testimonials.insert_one(doc)
    return testimonial_obj

# Contact routes
@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(input: ContactMessageCreate):
    contact_obj = ContactMessage(**input.model_dump())
    doc = contact_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)
    return contact_obj

# Categories route
@api_router.get("/categories")
async def get_categories():
    return {
        "categories": [
            {"id": "racao", "name": "Ração", "icon": "bowl"},
            {"id": "brinquedos", "name": "Brinquedos", "icon": "bone"},
            {"id": "higiene", "name": "Higiene", "icon": "droplet"},
            {"id": "acessorios", "name": "Acessórios", "icon": "collar"},
            {"id": "medicamentos", "name": "Medicamentos", "icon": "pill"},
            {"id": "camas", "name": "Camas e Casinhas", "icon": "home"}
        ]
    }

# Services route
@api_router.get("/services")
async def get_services():
    return {
        "services": [
            {
                "id": "consulta",
                "name": "Consulta Veterinária",
                "description": "Atendimento completo com diagnóstico e orientação profissional",
                "duration": "30-45 min"
            },
            {
                "id": "vacina",
                "name": "Vacinação",
                "description": "Imunização completa para cães e gatos",
                "duration": "15-20 min"
            },
            {
                "id": "banho",
                "name": "Banho e Tosa",
                "description": "Higiene completa com produtos de qualidade",
                "duration": "60-90 min"
            },
            {
                "id": "exames",
                "name": "Exames Laboratoriais",
                "description": "Análises clínicas para diagnóstico preciso",
                "duration": "Variável"
            },
            {
                "id": "cirurgia",
                "name": "Procedimentos Cirúrgicos",
                "description": "Cirurgias com equipe especializada",
                "duration": "Variável"
            },
            {
                "id": "emergencia",
                "name": "Emergência",
                "description": "Atendimento urgente para casos críticos",
                "duration": "Imediato"
            }
        ]
    }

# Available times route
@api_router.get("/available-times")
async def get_available_times(date: str):
    # Return available time slots for a given date
    # In production, this would check against existing appointments
    times = [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
        "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
        "16:00", "16:30", "17:00", "17:30"
    ]
    return {"available_times": times}

# Seed data route (for initial setup)
@api_router.post("/seed")
async def seed_data():
    # Check if data already exists
    existing_products = await db.products.count_documents({})
    existing_testimonials = await db.testimonials.count_documents({})
    
    if existing_products == 0:
        products = [
            {
                "id": str(uuid.uuid4()),
                "name": "Ração Premium Golden - Cães Adultos",
                "description": "Ração super premium para cães adultos de porte médio e grande. Rico em proteínas e nutrientes essenciais.",
                "price": 189.90,
                "category": "racao",
                "image_url": "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400",
                "stock": 50,
                "featured": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Ração Whiskas - Gatos Adultos",
                "description": "Alimento completo para gatos adultos com sabor frango. Nutrição balanceada.",
                "price": 89.90,
                "category": "racao",
                "image_url": "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400",
                "stock": 35,
                "featured": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Brinquedo Ossinho de Borracha",
                "description": "Brinquedo resistente para cães. Ideal para brincadeiras e limpeza dental.",
                "price": 29.90,
                "category": "brinquedos",
                "image_url": "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400",
                "stock": 100,
                "featured": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Shampoo Antipulgas 500ml",
                "description": "Shampoo especializado para eliminar pulgas e carrapatos. Fórmula suave.",
                "price": 45.90,
                "category": "higiene",
                "image_url": "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400",
                "stock": 60,
                "featured": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Coleira Antipulgas - 8 meses",
                "description": "Proteção prolongada contra pulgas e carrapatos por até 8 meses.",
                "price": 79.90,
                "category": "acessorios",
                "image_url": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
                "stock": 40,
                "featured": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Cama Pet Luxo - Tamanho M",
                "description": "Cama confortável com espuma de alta densidade. Capa removível e lavável.",
                "price": 159.90,
                "category": "camas",
                "image_url": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400",
                "stock": 20,
                "featured": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Vermífugo Comprimido",
                "description": "Vermífugo de amplo espectro para cães e gatos. Fácil administração.",
                "price": 35.90,
                "category": "medicamentos",
                "image_url": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400",
                "stock": 80,
                "featured": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Arranhador para Gatos",
                "description": "Arranhador vertical com plataforma. Ideal para exercícios e diversão.",
                "price": 129.90,
                "category": "brinquedos",
                "image_url": "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400",
                "stock": 15,
                "featured": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.products.insert_many(products)
    
    if existing_testimonials == 0:
        testimonials = [
            {
                "id": str(uuid.uuid4()),
                "author_name": "Maria Silva",
                "rating": 5,
                "text": "Atendimento excepcional! O Dr. Artur foi muito atencioso com meu cachorro. Recomendo demais!",
                "pet_name": "Thor",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "author_name": "João Santos",
                "rating": 5,
                "text": "Melhor pet shop da região. Produtos de qualidade e preços justos. A equipe sempre me orienta muito bem.",
                "pet_name": "Luna",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "author_name": "Ana Oliveira",
                "rating": 4,
                "text": "Minha gatinha foi muito bem cuidada durante a consulta. Ambiente limpo e organizado.",
                "pet_name": "Mimi",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "author_name": "Carlos Pereira",
                "rating": 5,
                "text": "Confio há anos no Dr. Artur. Profissional competente e que realmente ama os animais.",
                "pet_name": "Bob",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "author_name": "Fernanda Lima",
                "rating": 5,
                "text": "O serviço de banho e tosa é excelente! Meu pet sempre volta lindo e cheiroso.",
                "pet_name": "Rex",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.testimonials.insert_many(testimonials)
    
    return {"message": "Dados iniciais criados com sucesso"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

