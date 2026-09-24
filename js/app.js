// Datos de ejemplo para los hoteles
const hotels = [
  {
    id: 1,
    name: "Hotel Gran Vía Palace",
    city: "Madrid",
    stars: 5,
    price: 185,
    category: "Lujo urbano",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    amenities: ["Spa", "Piscina en terraza", "WiFi gratis", "Restaurante gourmet"]
  },
  {
    id: 2,
    name: "Costa Brava Beach Resort",
    city: "Girona",
    stars: 4,
    price: 140,
    category: "Playa",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
    amenities: ["Acceso directo a playa", "Piscina infinita", "Desayuno incluido"]
  },
  {
    id: 3,
    name: "Sevilla Boutique & Suites",
    city: "Sevilla",
    stars: 4,
    price: 110,
    category: "Boutique",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
    amenities: ["Patio andaluz", "Terraza con vistas", "Aire acondicionado"]
  },
  {
    id: 4,
    name: "Alpine Lodge & Spa",
    city: "Pirineos",
    stars: 4,
    price: 165,
    category: "Montaña",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80",
    amenities: ["Sauna", "Guardaesquís", "Chimenea", "Vistas panorámicas"]
  },
  {
    id: 5,
    name: "Barcelona Marina Hotel",
    city: "Barcelona",
    stars: 5,
    price: 240,
    category: "Frente al mar",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80",
    amenities: ["Piscina en azotea", "Gimnasio", "Bar de cócteles", "Parking"]
  },
  {
    id: 6,
    name: "Posada Rural El Encinar",
    city: "Cantabria",
    stars: 3,
    price: 75,
    category: "Rural",
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=600&q=80",
    amenities: ["Jardín", "Pet friendly", "Senderismo", "Cocina casera"]
  }
];

// Elementos DOM
const hotelGrid = document.getElementById("hotel-grid");
const searchInput = document.getElementById("search-input");
const ratingFilter = document.getElementById("rating-filter");
const priceFilter = document.getElementById("price-filter");
const priceVal = document.getElementById("price-val");
const searchBtn = document.getElementById("search-btn");
const resultsCount = document.getElementById("results-count");

// Elementos Modal
const modal = document.getElementById("booking-modal");
const closeModal = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-hotel-title");
const modalCity = document.getElementById("modal-hotel-city");
const modalPrice = document.getElementById("modal-hotel-price");
const modalImg = document.getElementById("modal-hotel-img");
const bookingForm = document.getElementById("booking-form");

// Renderizar tarjetas de hoteles
function renderHotels(list) {
  hotelGrid.innerHTML = "";

  if (list.length === 0) {
    hotelGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--gray-color); font-size: 1.1rem; padding: 2rem 0;">No se encontraron hoteles con esos criterios.</p>`;
    resultsCount.textContent = "0 alojamientos encontrados";
    return;
  }

  resultsCount.textContent = `Mostrando ${list.length} alojamientos disponibles`;

  list.forEach(hotel => {
    const card = document.createElement("div");
    card.className = "hotel-card";
    
    const starsText = "⭐".repeat(hotel.stars);
    const amenitiesHTML = hotel.amenities.map(a => `<span class="amenity-tag">${a}</span>`).join("");

    card.innerHTML = `
      <div class="hotel-image-wrapper">
        <img src="${hotel.image}" alt="${hotel.name}" loading="lazy">
        <span class="hotel-badge">${hotel.category}</span>
      </div>
      <div class="hotel-content">
        <span class="hotel-location">📍 ${hotel.city}</span>
        <h3 class="hotel-title">${hotel.name}</h3>
        <div class="hotel-rating">${starsText} (${hotel.stars} estrellas)</div>
        <div class="hotel-amenities">
          ${amenitiesHTML}
        </div>
        <div class="hotel-footer">
          <div class="hotel-price">${hotel.price}€ <span>/ noche</span></div>
          <button class="btn btn-primary" onclick="openBookingModal(${hotel.id})">Reservar</button>
        </div>
      </div>
    `;
    hotelGrid.appendChild(card);
  });
}

// Filtrar hoteles
function filterHotels() {
  const query = searchInput.value.toLowerCase().trim();
  const minStars = parseInt(ratingFilter.value, 10);
  const maxPrice = parseInt(priceFilter.value, 10);

  const filtered = hotels.filter(hotel => {
    const matchesQuery = hotel.name.toLowerCase().includes(query) || hotel.city.toLowerCase().includes(query);
    const matchesStars = hotel.stars >= minStars;
    const matchesPrice = hotel.price <= maxPrice;
    return matchesQuery && matchesStars && matchesPrice;
  });

  renderHotels(filtered);
}

// Abrir modal con datos del hotel
window.openBookingModal = function(id) {
  const hotel = hotels.find(h => h.id === id);
  if (!hotel) return;

  modalTitle.textContent = hotel.name;
  modalCity.textContent = `📍 ${hotel.city} - ${hotel.category}`;
  modalPrice.textContent = `${hotel.price}€`;
  modalImg.src = hotel.image;
  modal.classList.add("show");
};

// Cerrar modal
closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});

// Enviar formulario de reserva
bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const guestName = document.getElementById("guest-name").value;
  alert(`¡Gracias ${guestName}! Tu reserva para ${modalTitle.textContent} ha sido confirmada con éxito.`);
  modal.classList.remove("show");
  bookingForm.reset();
});

// Eventos de filtros
priceFilter.addEventListener("input", (e) => {
  priceVal.textContent = e.target.value;
  filterHotels();
});

searchBtn.addEventListener("click", filterHotels);
ratingFilter.addEventListener("change", filterHotels);
searchInput.addEventListener("input", filterHotels);

// Render inicial
renderHotels(hotels);
