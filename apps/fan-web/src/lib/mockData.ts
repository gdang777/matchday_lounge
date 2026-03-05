export type MockRestaurant = {
    id: string;
    name: string;
    description: string;
    city: string;
    neighborhood: string;
    address: string;
    cuisineType: string;
    phoneNumber: string;
    website: string;
    googleMapsUrl: string;
    photoUrls: string;
    boostTier: string;
    isVerified: boolean;
};

export type MockDeal = {
    id: string;
    name: string;
    description: string;
    dealType: string;
    startTime: string;
    endTime: string;
    daysOfWeek: string;
    source: string;
    restaurantId: string;
    restaurant: {
        id: string;
        name: string;
        address: string;
        neighborhood: string;
        city: string;
        boostTier: string;
        photoUrls: string;
        googleMapsUrl: string;
        isVerified: boolean;
    };
};

// --- VANCOUVER RESTAURANTS ---
export const MOCK_RESTAURANTS_VANCOUVER: MockRestaurant[] = [
    {
        id: 'v1',
        name: 'The Pint Public House',
        description: 'Bustling sports bar with tons of screens, pub grub, and a lively Matchday atmosphere.',
        city: 'VANCOUVER',
        neighborhood: 'Gastown',
        address: '455 Abbott St, Vancouver, BC',
        cuisineType: 'Pub Food',
        phoneNumber: '(604) 684-0258',
        website: 'https://thepint.ca/vancouver',
        googleMapsUrl: 'https://maps.google.com/?q=The+Pint+Vancouver',
        photoUrls: 'https://images.unsplash.com/photo-1543007630-f9a88eb0ab30?w=800&q=80',
        boostTier: 'PREMIUM',
        isVerified: true,
    },
    {
        id: 'v2',
        name: 'Red Card Sports Bar',
        description: 'Upscale sports bar featuring European-style pizzas, craft beer, and 360-degree screens.',
        city: 'VANCOUVER',
        neighborhood: 'Downtown',
        address: '560 Smithe St, Vancouver, BC',
        cuisineType: 'Italian / Pub',
        phoneNumber: '(604) 689-4460',
        website: 'https://redcardsportsbar.ca',
        googleMapsUrl: 'https://maps.google.com/?q=Red+Card+Sports+Bar',
        photoUrls: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
        boostTier: 'FEATURED',
        isVerified: true,
    },
    {
        id: 'v3',
        name: "Shark Club Sports Bar & Grill",
        description: 'Iconic Vancouver sports bar right by the stadium with massive screens and great wings.',
        city: 'VANCOUVER',
        neighborhood: 'Stadium District',
        address: '180 W Georgia St, Vancouver, BC',
        cuisineType: 'American',
        phoneNumber: '(604) 687-4275',
        website: 'https://sharkclub.com',
        googleMapsUrl: 'https://maps.google.com/?q=Shark+Club+Vancouver',
        photoUrls: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80',
        boostTier: 'STANDARD',
        isVerified: false,
    },
    {
        id: 'v4',
        name: 'Bells and Whistles',
        description: 'Modern beer hall serving elevated casual dining with a massive selection of local craft beers.',
        city: 'VANCOUVER',
        neighborhood: 'Fraserhood',
        address: '3296 Fraser St, Vancouver, BC',
        cuisineType: 'Gastropub',
        phoneNumber: '(604) 428-1321',
        website: 'https://bellsandwhistles.ca',
        googleMapsUrl: 'https://maps.google.com/?q=Bells+and+Whistles',
        photoUrls: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
        boostTier: 'FEATURED',
        isVerified: true,
    },
    {
        id: 'v5',
        name: 'Score on Davie',
        description: 'Famous for their crazy caesars and relaxed neighborhood vibe. Unbeatable patio.',
        city: 'VANCOUVER',
        neighborhood: 'West End',
        address: '1262 Davie St, Vancouver, BC',
        cuisineType: 'Canadian',
        phoneNumber: '(604) 632-1646',
        website: 'https://scoreondavie.com',
        googleMapsUrl: 'https://maps.google.com/?q=Score+on+Davie',
        photoUrls: 'https://images.unsplash.com/photo-1568227451006-25ccdf52e46e?w=800&q=80',
        boostTier: 'PREMIUM',
        isVerified: true,
    }
];

// --- TORONTO RESTAURANTS ---
export const MOCK_RESTAURANTS_TORONTO: MockRestaurant[] = [
    {
        id: 't1',
        name: 'Real Sports Bar & Grill',
        description: 'Mammoth sports bar next to the arena featuring a 39-foot HD screen and 100+ TVs.',
        city: 'TORONTO',
        neighborhood: 'Downtown Core',
        address: '15 York St, Toronto, ON',
        cuisineType: 'American / Pub',
        phoneNumber: '(416) 815-7325',
        website: 'https://realsports.ca',
        googleMapsUrl: 'https://maps.google.com/?q=Real+Sports+Toronto',
        photoUrls: 'https://images.unsplash.com/photo-1590846406792-0adc7f928f1e?w=800&q=80',
        boostTier: 'PREMIUM',
        isVerified: true,
    },
    {
        id: 't2',
        name: 'The Dock Ellis',
        description: 'Hip sports bar offering craft beer, elevated pub eats, foosball, and pool.',
        city: 'TORONTO',
        neighborhood: 'Dundas West',
        address: '1280 Dundas St W, Toronto, ON',
        cuisineType: 'Pub Food',
        phoneNumber: '(416) 792-8472',
        website: 'https://thedockellis.com',
        googleMapsUrl: 'https://maps.google.com/?q=The+Dock+Ellis',
        photoUrls: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&q=80',
        boostTier: 'FEATURED',
        isVerified: true,
    },
    {
        id: 't3',
        name: "Kellys Landing",
        description: 'Spacious, modern pub with a huge patio and excellent drink specials.',
        city: 'TORONTO',
        neighborhood: 'South Core',
        address: '123 Front St W, Toronto, ON',
        cuisineType: 'Canadian',
        phoneNumber: '(416) 583-2007',
        website: 'https://kellyslanding.ca',
        googleMapsUrl: 'https://maps.google.com/?q=Kellys+Landing',
        photoUrls: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80',
        boostTier: 'STANDARD',
        isVerified: false,
    },
    {
        id: 't4',
        name: 'Amsterdam BrewHouse',
        description: 'Massive lakeside brewery featuring craft beer flights and wood-fired pizzas.',
        city: 'TORONTO',
        neighborhood: 'Harbourfront',
        address: '245 Queens Quay W, Toronto, ON',
        cuisineType: 'Brewery',
        phoneNumber: '(416) 504-1020',
        website: 'https://amsterdambeer.com',
        googleMapsUrl: 'https://maps.google.com/?q=Amsterdam+BrewHouse',
        photoUrls: 'https://images.unsplash.com/photo-1575037614876-c38538029d2b?w=800&q=80',
        boostTier: 'PREMIUM',
        isVerified: true,
    },
    {
        id: 't5',
        name: 'Wheat Sheaf Tavern',
        description: 'One of Toronto’s oldest bars, recently renovated but keeping its classic charm and cheap wings.',
        city: 'TORONTO',
        neighborhood: 'King West',
        address: '667 King St W, Toronto, ON',
        cuisineType: 'Pub Food',
        phoneNumber: '(416) 504-9912',
        website: 'https://wheatsheaftavern.com',
        googleMapsUrl: 'https://maps.google.com/?q=Wheat+Sheaf+Tavern',
        photoUrls: 'https://images.unsplash.com/photo-1563514969299-46be568cdb2e?w=800&q=80',
        boostTier: 'FEATURED',
        isVerified: true,
    }
];

export const MOCK_RESTAURANTS = [...MOCK_RESTAURANTS_VANCOUVER, ...MOCK_RESTAURANTS_TORONTO];

// --- VANCOUVER DEALS ---
export const MOCK_DEALS_VANCOUVER: MockDeal[] = [
    {
        id: 'd-v1', name: 'Pint Pints & Wings', description: '$6 Pints of domestic beer and half-price wings during the afternoon match.', dealType: 'BOTH',
        startTime: '14:00', endTime: '18:00', daysOfWeek: 'MON,TUE,WED,THU,FRI', source: 'PARTNER', restaurantId: 'v1',
        restaurant: MOCK_RESTAURANTS_VANCOUVER[0]
    },
    {
        id: 'd-v2', name: 'Pizza & Peroni', description: '$15 Margherita Pizza + Peroni bundle while the game is on.', dealType: 'BOTH',
        startTime: '11:00', endTime: '16:00', daysOfWeek: 'MON,TUE,WED,THU,FRI,SAT,SUN', source: 'PARTNER', restaurantId: 'v2',
        restaurant: MOCK_RESTAURANTS_VANCOUVER[1]
    },
    {
        id: 'd-v3', name: 'Pre-Game Pitchers', description: '$18 Pitchers of Canadian and Coors Light.', dealType: 'DRINKS',
        startTime: '15:00', endTime: '19:00', daysOfWeek: 'FRI,SAT,SUN', source: 'PARTNER', restaurantId: 'v3',
        restaurant: MOCK_RESTAURANTS_VANCOUVER[2]
    },
    {
        id: 'd-v4', name: 'Craft Draft Hour', description: '$5 all local BC Craft Draft beers on tap.', dealType: 'DRINKS',
        startTime: '14:00', endTime: '17:00', daysOfWeek: 'MON,TUE,WED,THU,FRI', source: 'PARTNER', restaurantId: 'v4',
        restaurant: MOCK_RESTAURANTS_VANCOUVER[3]
    },
    {
        id: 'd-v5', name: 'Caesar Sunday', description: '$7 Score Caesars and $4 appies.', dealType: 'BOTH',
        startTime: '10:00', endTime: '15:00', daysOfWeek: 'SUN', source: 'PARTNER', restaurantId: 'v5',
        restaurant: MOCK_RESTAURANTS_VANCOUVER[4]
    }
];

// --- TORONTO DEALS ---
export const MOCK_DEALS_TORONTO: MockDeal[] = [
    {
        id: 'd-t1', name: 'Game Time Tall Boys', description: '$8 Tall boys and free chips with every bucket.', dealType: 'BOTH',
        startTime: '16:00', endTime: '19:00', daysOfWeek: 'MON,TUE,WED,THU,FRI,SAT,SUN', source: 'PARTNER', restaurantId: 't1',
        restaurant: MOCK_RESTAURANTS_TORONTO[0]
    },
    {
        id: 'd-t2', name: 'Local Pints', description: '$6 select local rotational taps.', dealType: 'DRINKS',
        startTime: '17:00', endTime: '20:00', daysOfWeek: 'WED,THU,FRI', source: 'PARTNER', restaurantId: 't2',
        restaurant: MOCK_RESTAURANTS_TORONTO[1]
    },
    {
        id: 'd-t3', name: 'Patio Punch', description: '$10 Signature cocktails and 50% off calamari.', dealType: 'BOTH',
        startTime: '15:00', endTime: '18:00', daysOfWeek: 'TUE,WED,THU', source: 'PARTNER', restaurantId: 't3',
        restaurant: MOCK_RESTAURANTS_TORONTO[2]
    },
    {
        id: 'd-t4', name: 'Wood-fired & Brew', description: '$12 flights of 4 craft beers and $5 side pizzas.', dealType: 'BOTH',
        startTime: '12:00', endTime: '16:00', daysOfWeek: 'MON,TUE,WED,THU', source: 'PARTNER', restaurantId: 't4',
        restaurant: MOCK_RESTAURANTS_TORONTO[3]
    },
    {
        id: 'd-t5', name: 'Historic Wings', description: 'Half price wings and $5 domestic bottles.', dealType: 'BOTH',
        startTime: '16:00', endTime: '22:00', daysOfWeek: 'MON,TUE,SUN', source: 'PARTNER', restaurantId: 't5',
        restaurant: MOCK_RESTAURANTS_TORONTO[4]
    }
];

export const MOCK_DEALS = [...MOCK_DEALS_VANCOUVER, ...MOCK_DEALS_TORONTO];
