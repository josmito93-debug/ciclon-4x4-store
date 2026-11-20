export interface Product {
  id: string;
  slug: string;
  brandTitle: string;      // Bold condensed italic title on card (e.g., "Toyota Machito", "WeatherTech")
  fullName: string;        // Full official product title from Ciclón 4x4 Instagram post
  cardSubtitle: string;    // 2-line italic subtitle on card
  price: number;
  isNew?: boolean;         // Renders the black "New" ribbon on the top-right corner of the card
  category: 'interior' | 'iluminacion-rines' | 'proteccion' | 'camping';
  categoryLabel: string;
  vehicle: string;
  sku: string;
  cutoutImg: string;       // Transparent floating product image for the golden card
  postImg: string;         // Full original cropped Ciclón 4x4 graphic from Instagram
  description: string;
  specs: { label: string; value: string }[];
  variants?: string[];
}

export interface HeroVehicleBuild {
  id: string;
  name: string;
  code: string;
  image: string;
  callouts: {
    id: string;
    specText: string;      // e.g. "4 . 5 L   V 8" or "3 1 5  m m"
    subLabel: string;
    x: string;             // CSS percentage position
    y: string;
    lineHeight: number;
    direction: 'top' | 'bottom';
    linkedProductSlug: string;
  }[];
}

export const HERO_BUILDS: HeroVehicleBuild[] = [
  {
    id: 'autana-80',
    name: 'TOYOTA AUTANA SERIE 80 OVERLAND',
    code: 'FZJ80 // 4500 EFI',
    image: '/assets/vehicles/hero-autana-rimlit.png',
    callouts: [
      {
        id: 'c1',
        specText: '4 5 0 0  E F I',
        subLabel: 'Consola Central Autana',
        x: '33%',
        y: '14%',
        lineHeight: 36,
        direction: 'top',
        linkedProductSlug: 'consola-central-autana',
      },
      {
        id: 'c2',
        specText: '1 6  I N C H  O E M',
        subLabel: 'Rin 16" 6 Huecos Serie 80',
        x: '27%',
        y: '74%',
        lineHeight: 32,
        direction: 'bottom',
        linkedProductSlug: 'rin-16-serie-80',
      },
      {
        id: 'c3',
        specText: '2 5 0 0  m m  T J M',
        subLabel: 'Camping Room TJM 2.5m',
        x: '68%',
        y: '18%',
        lineHeight: 40,
        direction: 'top',
        linkedProductSlug: 'camping-room-tjm',
      },
    ],
  },
  {
    id: 'machito-70',
    name: 'TOYOTA MACHITO SERIE 70 — 2024',
    code: 'GRJ71 // OEM SPEC',
    image: '/assets/vehicles/hero-machito-rimlit.png',
    callouts: [
      {
        id: 'm1',
        specText: 'O E M  2 0 2 4',
        subLabel: 'Consola Central Machito 2024',
        x: '36%',
        y: '13%',
        lineHeight: 36,
        direction: 'top',
        linkedProductSlug: 'consola-central-machito-2024',
      },
      {
        id: 'm2',
        specText: '1 2 V  1 6  P S I',
        subLabel: 'Bomba Kosmegal 12V',
        x: '71%',
        y: '24%',
        lineHeight: 34,
        direction: 'top',
        linkedProductSlug: 'bomba-inflado-kosmegal',
      },
      {
        id: 'm3',
        specText: '1 5 x 5 . 5  O E M',
        subLabel: 'Rin 15" 6 Huecos FJ40',
        x: '63%',
        y: '78%',
        lineHeight: 28,
        direction: 'bottom',
        linkedProductSlug: 'rin-15-fj40-samurai',
      },
    ],
  },
];

export const PRODUCTS: Product[] = [
  // PAGE 1 (6 Iconic Hero Cards matching the 3x2 reference layout)
  {
    id: 'p1',
    slug: 'consola-central-machito-2024',
    brandTitle: 'Toyota Machito',
    fullName: 'CONSOLA CENTRAL PARA MACHITO 2024 ORIGINAL',
    cardSubtitle: 'Consola Central Original OEM\nLand Cruiser Serie 70 — 2024',
    price: 340.00,
    isNew: true,
    category: 'interior',
    categoryLabel: 'Interior & Consolas',
    vehicle: 'Machito Serie 70',
    sku: 'C4X4-MCH-2024',
    cutoutImg: '/assets/cutouts/consola-central-machito-2024.png',
    postImg: '/assets/posts/consola-central-machito-2024.jpg',
    description:
      'Consola central original para Toyota Land Cruiser Machito 2024 (Serie 70). Compartimiento principal de alta capacidad con tapa superior reforzada, anclajes originales de fábrica y acabado negro mate texturizado de alta resistencia.',
    specs: [
      { label: 'Compatibilidad', value: 'Toyota Machito / Serie 70 (2024)' },
      { label: 'Condición', value: '100% Original Toyota OEM' },
      { label: 'Material', value: 'Polímero ABS Industrial Texturizado' },
      { label: 'Instalación', value: 'Direct-Fit sobre puntos originales' },
    ],
  },
  {
    id: 'p2',
    slug: 'faros-delanteros-4runner',
    brandTitle: 'Toyota 4Runner',
    fullName: 'FAROS DELANTEROS PARA TOYOTA 4RUNNER 5TA GENERACIÓN',
    cardSubtitle: 'Faros Delanteros Proyector Óptico\nToyota 4Runner 5ta Generación',
    price: 580.00,
    isNew: true,
    category: 'iluminacion-rines',
    categoryLabel: 'Rines & Iluminación',
    vehicle: '4Runner 5ta Gen',
    sku: 'C4X4-4RN-HL5G',
    cutoutImg: '/assets/cutouts/faros-delanteros-4runner.png',
    postImg: '/assets/posts/faros-delanteros-4runner.jpg',
    description:
      'Juego de faros delanteros para Toyota 4Runner de 5ta Generación. Óptica de proyección de alta definición con carcasa sellada contra barro, polvo y vadeo profundo.',
    specs: [
      { label: 'Vehículo', value: 'Toyota 4Runner 5ta Generación (2014-2024)' },
      { label: 'Incluye', value: 'Par Completo (Izquierdo + Derecho)' },
      { label: 'Sellado', value: 'IP67 Off-Road Hermético' },
      { label: 'Conexión', value: 'Plug & Play arnés original' },
    ],
  },
  {
    id: 'p3',
    slug: 'rin-16-serie-80',
    brandTitle: 'Serie 80 OEM',
    fullName: 'RIN 16 6 HUECOS PLATEADO PARA SERIE 80 ORIGINAL',
    cardSubtitle: 'Rin 16" 6 Huecos Acero Plateado\nOriginal Toyota Serie 80 Autana',
    price: 195.00,
    isNew: false,
    category: 'iluminacion-rines',
    categoryLabel: 'Rines & Iluminación',
    vehicle: 'Autana / Serie 80',
    sku: 'C4X4-RIN16-S80',
    cutoutImg: '/assets/cutouts/rin-16-serie-80.png',
    postImg: '/assets/posts/rin-16-serie-80.jpg',
    description:
      'Rines originales de 16 pulgadas y 6 huecos en acabado plateado para Toyota Land Cruiser Serie 80 (Autana / Burbuja). Construcción en acero estampado de alto calibre para rutas extremas.',
    specs: [
      { label: 'Medida', value: '16 Pulgadas — 6 Huecos (6x139.7)' },
      { label: 'Compatibilidad', value: 'Toyota Land Cruiser Serie 80 / Autana' },
      { label: 'Acabado', value: 'Plateado OEM Anticorrosivo' },
      { label: 'Tipo', value: 'Original Toyota Heavy-Duty' },
    ],
  },
  {
    id: 'p4',
    slug: 'bomba-inflado-kosmegal',
    brandTitle: 'Kosmegal',
    fullName: 'BOMBA DE INFLADO RÁPIDO 12V PARA COLCHÓN DE CAMPING',
    cardSubtitle: 'Bomba Digital 12V Alta Presión\nPara Colchón & Equipo de Camping',
    price: 65.00,
    isNew: false,
    category: 'camping',
    categoryLabel: 'Camping & Overland',
    vehicle: 'Camping / Universal',
    sku: 'C4X4-KOS-12V',
    cutoutImg: '/assets/cutouts/bomba-inflado-kosmegal.png',
    postImg: '/assets/posts/bomba-inflado-kosmegal.jpg',
    description:
      'Haz más práctico tu equipo de camping con esta bomba de inflado rápido 12V marca Kosmegal. Equipada con pantalla digital LED con control de PSI, apagado automático y manguera flexible.',
    specs: [
      { label: 'Marca', value: 'Kosmegal Original' },
      { label: 'Alimentación', value: '12V DC Conector Vehicular' },
      { label: 'Pantalla', value: 'Display LCD Digital con ajuste PSI' },
      { label: 'Uso Ideal', value: 'Colchones de Camping, Kayaks, Overlanding' },
    ],
  },
  {
    id: 'p5',
    slug: 'stops-traseros-4runner',
    brandTitle: '4Runner OEM',
    fullName: 'STOPS TRASEROS ORIGINALES PARA TOYOTA 4RUNNER 5TA GEN (PAR)',
    cardSubtitle: 'Stops Traseros Originales (Par)\nToyota 4Runner 5ta Generación',
    price: 420.00,
    isNew: false,
    category: 'iluminacion-rines',
    categoryLabel: 'Rines & Iluminación',
    vehicle: '4Runner 5ta Gen',
    sku: 'C4X4-4RN-TL5G',
    cutoutImg: '/assets/cutouts/stops-traseros-4runner.png',
    postImg: '/assets/posts/stops-traseros-4runner.jpg',
    description:
      'Par de stops traseros originales para Toyota 4Runner 5ta Generación. Diseño OEM con bisel interno negro/cromado y lente policarbonato de alta claridad resistente a impactos.',
    specs: [
      { label: 'Compatibilidad', value: 'Toyota 4Runner 5ta Generación' },
      { label: 'Presentación', value: 'Par Completo (Izquierdo + Derecho)' },
      { label: 'Calidad', value: 'Original OEM Toyota' },
      { label: 'Iluminación', value: 'LED / Halógeno de fábrica' },
    ],
  },
  {
    id: 'p6',
    slug: 'alfombra-weathertech-tacoma',
    brandTitle: 'WeatherTech',
    fullName: 'ALFOMBRA WEATHERTECH NEGRA PARA TACOMA 2018 A 2023',
    cardSubtitle: 'Alfombras Termoformadas Negras\nToyota Tacoma 2018 a 2023',
    price: 245.00,
    isNew: false,
    category: 'proteccion',
    categoryLabel: 'WeatherTech & Forros',
    vehicle: 'Toyota Tacoma',
    sku: 'C4X4-WT-TAC18',
    cutoutImg: '/assets/cutouts/alfombra-weathertech-tacoma.png',
    postImg: '/assets/posts/alfombra-weathertech-tacoma.jpg',
    description:
      'Juego completo de alfombras WeatherTech negras medidas a láser para Toyota Tacoma (2018 a 2023). Bordes elevados de contención para barro, agua y arena.',
    specs: [
      { label: 'Marca', value: 'WeatherTech USA' },
      { label: 'Vehículo', value: 'Toyota Tacoma Doble Cabina (2018-2023)' },
      { label: 'Piezas', value: 'Delanteras (Piloto/Copiloto) + Corrida Trasera' },
      { label: 'Color', value: 'Negro Táctico Mate' },
    ],
  },

  // PAGE 2 (Next 6 Products in the 3x2 reference layout)
  {
    id: 'p7',
    slug: 'camping-room-tjm',
    brandTitle: 'TJM Overland',
    fullName: 'CAMPING ROOM CON PISO TJM 2.5 MTS',
    cardSubtitle: 'Anexo Carpa de Camping Con Piso\nTJM Australia 2.5 Metros',
    price: 490.00,
    isNew: true,
    category: 'camping',
    categoryLabel: 'Camping & Overland',
    vehicle: 'Camping / Universal',
    sku: 'C4X4-TJM-CR25',
    cutoutImg: '/assets/cutouts/camping-room-tjm.png',
    postImg: '/assets/posts/camping-room-tjm.jpg',
    description:
      'Amplía tu espacio de campamento y disfruta de privacidad total con el Camping Room TJM de 2.5 metros con piso integrado impermeable, ventanas con mosquitero de alta densidad y lona ripstop.',
    specs: [
      { label: 'Marca', value: 'TJM 4x4 Equipped (Australia)' },
      { label: 'Dimensiones', value: '2.5 Metros con Piso Sellado' },
      { label: 'Tejido', value: 'Polialgodón Ripstop Impermeable UV50+' },
      { label: 'Ventilación', value: 'Paneles laterales y frontal con malla anti-insectos' },
    ],
  },
  {
    id: 'p8',
    slug: 'rin-15-fj40-samurai',
    brandTitle: 'FJ40 Samurai',
    fullName: 'RIN 15X5.5 6 HUECOS BLANCOS ORIGINAL FJ40 - SAMURAI',
    cardSubtitle: 'Rin 15x5.5 6 Huecos Blanco OEM\nToyota FJ40 & Serie 60 Samurai',
    price: 175.00,
    isNew: true,
    category: 'iluminacion-rines',
    categoryLabel: 'Rines & Iluminación',
    vehicle: 'FJ40 / Samurai',
    sku: 'C4X4-RIN15-FJ40',
    cutoutImg: '/assets/cutouts/rin-15-fj40-samurai.png',
    postImg: '/assets/posts/rin-15-fj40-samurai.jpg',
    description:
      'Rines clásicos 15x5.5 de 6 huecos en color blanco con franja perimetral roja. Ideales para restauraciones y preparación off-road de Toyota FJ40 y Land Cruiser Samurai.',
    specs: [
      { label: 'Medida', value: '15 x 5.5 Pulgadas — 6 Huecos' },
      { label: 'Aplicación', value: 'Toyota FJ40 / Land Cruiser Samurai' },
      { label: 'Diseño', value: 'Blanco Clásico con Filete Rojo OEM' },
      { label: 'Material', value: 'Acero Forjado Alta Carga' },
    ],
  },
  {
    id: 'p9',
    slug: 'forros-asientos-prado-250',
    brandTitle: 'Prado 250',
    fullName: 'FORROS DE ASIENTOS PARA PRADO 250 COLOR MARRÓN',
    cardSubtitle: 'Tapicería Cuero Marrón Completa\nToyota Land Cruiser Prado 250',
    price: 460.00,
    isNew: false,
    category: 'interior',
    categoryLabel: 'Interior & Consolas',
    vehicle: 'Prado 250 (LC250)',
    sku: 'C4X4-LC250-SEAT',
    cutoutImg: '/assets/cutouts/forros-asientos-prado-250.png',
    postImg: '/assets/posts/forros-asientos-prado-250.jpg',
    description:
      'Dale un nuevo estilo ejecutivo y todoterreno al interior de tu nueva Toyota Prado 250 (LC250) con este juego completo de forros de asiento en cuero marrón microperforado de calce exacto.',
    specs: [
      { label: 'Vehículo', value: 'Toyota Land Cruiser Prado 250 (2024-2026)' },
      { label: 'Incluye', value: 'Filas Delanteras + Trasera + Apoyacabezas' },
      { label: 'Color', value: 'Marrón Terracota OEM' },
      { label: 'Acabado', value: 'Costura reforzada compatible con Airbags laterales' },
    ],
  },
  {
    id: 'p10',
    slug: 'consola-central-autana',
    brandTitle: 'Toyota Autana',
    fullName: 'CONSOLA CENTRAL PARA TOYOTA AUTANA',
    cardSubtitle: 'Consola Central Tapizada Doble\nPara Toyota Autana Serie 80',
    price: 260.00,
    isNew: false,
    category: 'interior',
    categoryLabel: 'Interior & Consolas',
    vehicle: 'Autana / Serie 80',
    sku: 'C4X4-AUT-CNS80',
    cutoutImg: '/assets/cutouts/consola-central-autana.png',
    postImg: '/assets/posts/consola-central-autana.jpg',
    description:
      'Dale mayor funcionalidad y confort al interior de tu Toyota Autana con esta consola central de diseño ergonómico, equipada con apoyabrazos acolchado, gaveta profunda tapizada, portavasos doble y bandeja inferior.',
    specs: [
      { label: 'Vehículo', value: 'Toyota Land Cruiser Autana / Burbuja (Serie 80)' },
      { label: 'Equipamiento', value: 'Portavasos Doble + Gaveta + Bandeja Inferior' },
      { label: 'Interior', value: 'Forrado en Alfombra Antirruido con Bisagra Metálica' },
      { label: 'Color', value: 'Gris / Marrón Interior Original' },
    ],
  },
  {
    id: 'p11',
    slug: 'alfombra-weathertech-cherokee',
    brandTitle: 'Grand Cherokee',
    fullName: 'ALFOMBRA WEATHERTECH JEEP GRAND CHEROKEE 2005 CON MALETA',
    cardSubtitle: 'Kit WeatherTech + Bandeja Maleta\nJeep Grand Cherokee WK 2005',
    price: 295.00,
    isNew: false,
    category: 'proteccion',
    categoryLabel: 'WeatherTech & Forros',
    vehicle: 'Jeep Grand Cherokee',
    sku: 'C4X4-WT-JGC05',
    cutoutImg: '/assets/cutouts/alfombra-weathertech-cherokee.png',
    postImg: '/assets/posts/alfombra-weathertech-cherokee.jpg',
    description:
      'Set completo de alfombras WeatherTech para Jeep Grand Cherokee 2005 incluyendo protector de maleta trasera. Máxima retención de barro, líquidos y suciedad para rutas 4x4.',
    specs: [
      { label: 'Marca', value: 'WeatherTech Original' },
      { label: 'Vehículo', value: 'Jeep Grand Cherokee (WK 2005-2010)' },
      { label: 'Incluye', value: 'Delanteras + Trasera + Alfombra de Maleta Cargo' },
      { label: 'Material', value: 'Compuesto Tri-Extruded TPE de Alta Densidad' },
    ],
  },
  {
    id: 'p12',
    slug: 'bandeja-organizadora-prado-250',
    brandTitle: 'LC250 Tray',
    fullName: 'BANDEJA ORGANIZADORA PARA CONSOLA CENTRAL DE PRADO 250',
    cardSubtitle: 'Bandeja Organizadora de Consola\nToyota Land Cruiser Prado 250',
    price: 48.00,
    isNew: false,
    category: 'interior',
    categoryLabel: 'Interior & Consolas',
    vehicle: 'Prado 250 (LC250)',
    sku: 'C4X4-LC250-TRY',
    cutoutImg: '/assets/cutouts/bandeja-organizadora-prado-250.png',
    postImg: '/assets/posts/bandeja-organizadora-prado-250.jpg',
    description:
      'Bandeja organizadora a medida para el interior de la consola central de la Toyota Prado 250 (LC250). Aprovecha al máximo el espacio con compartimientos antideslizantes para monedas, llaves y cables.',
    specs: [
      { label: 'Compatibilidad', value: 'Toyota Prado 250 / Land Cruiser LC250' },
      { label: 'Material', value: 'ABS Mate de Alta Resistencia' },
      { label: 'Instalación', value: 'Encaje directo sin herramientas' },
      { label: 'Función', value: 'Doble nivel en consola central' },
    ],
  },

  // PAGE 3 (Remaining 3 Products from the reference catalog = 15 total!)
  {
    id: 'p13',
    slug: 'soporte-goma-tablero',
    brandTitle: 'Ciclón Grip',
    fullName: 'SOPORTE DE GOMA DE TABLERO PARA TELÉFONO',
    cardSubtitle: 'Base de Goma Antideslizante 4x4\nSoporte de Tablero Para Teléfono',
    price: 24.00,
    isNew: true,
    category: 'interior',
    categoryLabel: 'Interior & Consolas',
    vehicle: 'Camping / Universal',
    sku: 'C4X4-GRP-TAB',
    cutoutImg: '/assets/cutouts/soporte-goma-tablero.png',
    postImg: '/assets/posts/soporte-goma-tablero.jpg',
    description:
      'Práctico y funcional soporte con base de goma de alto agarre para colocar el teléfono sobre el tablero en rutas off-road. Ideal para navegación GPS en trochas sin vibraciones ni caídas.',
    specs: [
      { label: 'Compatibilidad', value: 'Universal (Todos los Smartphones y Tableros)' },
      { label: 'Material', value: 'Elastómero de Silicona Táctica Antideslizante' },
      { label: 'Ángulo', value: 'Visión Horizontal Panorámica para GPS Off-Road' },
      { label: 'Fijación', value: 'Base texturizada lavable y reutilizable' },
    ],
  },
  {
    id: 'p14',
    slug: 'forro-automovil-universal',
    brandTitle: 'Zega Cover',
    fullName: 'FORRO PARA AUTOMÓVIL UNIVERSAL (XL, M, L)',
    cardSubtitle: 'Forro Exterior Impermeable Zega\nTallas Disponibles M, L y XL',
    price: 75.00,
    isNew: false,
    category: 'proteccion',
    categoryLabel: 'WeatherTech & Forros',
    vehicle: 'Camping / Universal',
    sku: 'C4X4-ZEG-COV',
    cutoutImg: '/assets/cutouts/forro-automovil-universal.png',
    postImg: '/assets/posts/forro-automovil-universal.jpg',
    description:
      '¡Protege tu vehículo cuando no lo estés utilizando! Forro exterior marca Zega en loneta impermeable con protección contra sol, lluvia y polvo, bordes elásticos de ajuste y bandas reflectivas en retrovisores.',
    specs: [
      { label: 'Marca', value: 'Zega — Loneta Impermeable' },
      { label: 'Tallas', value: 'M (4.31m) / L (4.80m) / XL (5.70m Camionetas 4x4)' },
      { label: 'Protección', value: '100% Impermeable, Filtro UV, Anti-Polvo' },
      { label: 'Extras', value: 'Bolsillo para retrovisores con cinta reflectiva + Bolso' },
    ],
    variants: ['XL (Camionetas 4x4 hasta 5.70m)', 'L (SUV / Sedán hasta 4.80m)', 'M (Compacto hasta 4.31m)'],
  },
  {
    id: 'p15',
    slug: 'gomas-puertas-corolla',
    brandTitle: 'Corolla Seal',
    fullName: 'JUEGO DE GOMAS PARA PUERTAS DE TOYOTA COROLLA 2003-2008',
    cardSubtitle: 'Kit 4 Gomas de Puerta Herméticas\nToyota Corolla 2003 a 2008',
    price: 88.00,
    isNew: false,
    category: 'proteccion',
    categoryLabel: 'WeatherTech & Forros',
    vehicle: 'Toyota Corolla',
    sku: 'C4X4-COR-GOM08',
    cutoutImg: '/assets/cutouts/gomas-puertas-corolla.png',
    postImg: '/assets/posts/gomas-puertas-corolla.jpg',
    description:
      'Juego completo de 4 gomas para puertas de Toyota Corolla (modelos 2003 al 2008). Restaura la insonorización de cabina y el sellado hermético contra agua y polvo.',
    specs: [
      { label: 'Vehículo', value: 'Toyota Corolla (2003, 2004, 2005, 2006, 2007, 2008)' },
      { label: 'Contenido', value: 'Juego Completo de 4 Gomas (Delanteras y Traseras)' },
      { label: 'Compuesto', value: 'Caucho EPDM Flexible de Alta Durabilidad' },
      { label: 'Calce', value: 'Perfil OEM con clips de sujeción exacta' },
    ],
  },
];

export const VEHICLE_FILTERS = [
  'Todos',
  'Machito Serie 70',
  'Autana / Serie 80',
  '4Runner 5ta Gen',
  'Prado 250 (LC250)',
  'Toyota Tacoma',
  'FJ40 / Samurai',
  'Jeep Grand Cherokee',
  'Toyota Corolla',
  'Camping / Universal',
];
