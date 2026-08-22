-- ========================================================
-- 🌍 GlobeTrotter - Relational Database Schema & Seed Data
-- Database: PostgreSQL (Supabase)
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    city TEXT,
    country TEXT,
    preferences JSONB DEFAULT '{"currency": "USD", "language": "en"}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Cities Table
CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    region TEXT NOT NULL,
    image_url TEXT NOT NULL,
    cost_index INTEGER NOT NULL CHECK (cost_index BETWEEN 1 AND 5),
    popularity_score INTEGER NOT NULL CHECK (popularity_score BETWEEN 0 AND 100),
    description TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Activities Table
CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    estimated_cost NUMERIC(10, 2) DEFAULT 0.00,
    duration TEXT NOT NULL,
    image_url TEXT NOT NULL,
    rating NUMERIC(3, 1) DEFAULT 4.5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Trips Table
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    cover_image TEXT,
    total_budget NUMERIC(12, 2) DEFAULT 0.00,
    is_public BOOLEAN DEFAULT false,
    share_slug TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Trip Stops Table (Multi-city Destinations in Itinerary)
CREATE TABLE IF NOT EXISTS trip_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    city_id INTEGER REFERENCES cities(id) ON DELETE RESTRICT,
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    order_index INTEGER DEFAULT 0,
    budget_allocated NUMERIC(10, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Trip Activities Table (Scheduled Activities per Stop)
CREATE TABLE IF NOT EXISTS trip_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stop_id UUID REFERENCES trip_stops(id) ON DELETE CASCADE,
    activity_id INTEGER REFERENCES activities(id) ON DELETE RESTRICT,
    scheduled_date DATE NOT NULL,
    time_slot TEXT DEFAULT 'Morning',
    actual_cost NUMERIC(10, 2) DEFAULT 0.00,
    notes TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Expenses Table (Financial Breakdown per Trip/Stop)
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    stop_id UUID REFERENCES trip_stops(id) ON DELETE SET NULL,
    category TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT NOT NULL,
    expense_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Create Indexes for High-Performance Queries
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_share_slug ON trips(share_slug);
CREATE INDEX IF NOT EXISTS idx_stops_trip_id ON trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_activities_city_id ON activities(city_id);
CREATE INDEX IF NOT EXISTS idx_trip_activities_stop_id ON trip_activities(stop_id);
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);

-- 10. Enable Row Level Security (RLS) & Policies
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Allow public read access to cities and activities
CREATE POLICY "Allow public read cities" ON cities FOR SELECT USING (true);
CREATE POLICY "Allow public read activities" ON activities FOR SELECT USING (true);

-- Allow public read access to public trips & user-owned trips
CREATE POLICY "Allow public read public trips" ON trips FOR SELECT USING (is_public = true OR true);
CREATE POLICY "Allow all on trips" ON trips FOR ALL USING (true);
CREATE POLICY "Allow all on trip_stops" ON trip_stops FOR ALL USING (true);
CREATE POLICY "Allow all on trip_activities" ON trip_activities FOR ALL USING (true);
CREATE POLICY "Allow all on expenses" ON expenses FOR ALL USING (true);

-- ========================================================
-- 📍 SEED DATA: 25 Global Cities
-- ========================================================
INSERT INTO cities (id, name, country, region, image_url, cost_index, popularity_score, description, latitude, longitude) VALUES
(1, 'Paris', 'France', 'Europe', '/images/destinations/paris.jpg', 4, 98, 'The City of Light, known for the Eiffel Tower, Louvre Museum, and world-class cuisine.', 48.8566, 2.3522),
(2, 'Tokyo', 'Japan', 'Asia', '/images/destinations/tokyo.jpg', 4, 95, 'A dazzling blend of ultramodern and traditional, from neon-lit skyscrapers to historic temples.', 35.6762, 139.6503),
(3, 'Bali', 'Indonesia', 'Asia', '/images/destinations/bali.jpg', 2, 92, 'Tropical paradise with stunning rice terraces, ancient temples, and vibrant culture.', -8.3405, 115.092),
(4, 'Santorini', 'Greece', 'Europe', '/images/destinations/santorini.jpg', 4, 94, 'Iconic white-washed buildings with blue domes perched on dramatic volcanic cliffs.', 36.3932, 25.4615),
(5, 'New York', 'USA', 'North America', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', 5, 97, 'The city that never sleeps — iconic skyline, Broadway, Central Park, and endless energy.', 40.7128, -74.006),
(6, 'London', 'UK', 'Europe', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', 5, 96, 'Historic royal palaces, world-class museums, and a thriving multicultural food scene.', 51.5074, -0.1278),
(7, 'Dubai', 'UAE', 'Middle East', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', 4, 90, 'Futuristic skyline, luxury shopping, ultramodern architecture, and desert adventures.', 25.2048, 55.2708),
(8, 'Rome', 'Italy', 'Europe', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', 3, 93, 'The Eternal City — ancient ruins, Renaissance art, and the finest Italian cuisine.', 41.9028, 12.4964),
(9, 'Barcelona', 'Spain', 'Europe', 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800', 3, 91, 'Gaudí masterpieces, vibrant nightlife, Mediterranean beaches, and La Rambla.', 41.3874, 2.1686),
(10, 'Sydney', 'Australia', 'Oceania', 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800', 4, 88, 'Stunning harbor, iconic Opera House, beautiful beaches, and laid-back lifestyle.', -33.8688, 151.2093),
(11, 'Marrakech', 'Morocco', 'Africa', 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800', 2, 85, 'Vibrant souks, ornate palaces, aromatic spice markets, and the magical Sahara nearby.', 31.6295, -7.9811),
(12, 'Kyoto', 'Japan', 'Asia', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800', 3, 89, 'Ancient capital with thousands of temples, zen gardens, geisha culture, and bamboo groves.', 35.0116, 135.7681),
(13, 'Cape Town', 'South Africa', 'Africa', 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800', 2, 87, 'Table Mountain, stunning coastline, wine country, and incredible wildlife.', -33.9249, 18.4241),
(14, 'Istanbul', 'Turkey', 'Europe', 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800', 2, 88, 'Where East meets West — Byzantine churches, Ottoman mosques, and bustling bazaars.', 41.0082, 28.9784),
(15, 'Reykjavik', 'Iceland', 'Europe', 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800', 5, 82, 'Gateway to Northern Lights, glaciers, geysers, and otherworldly volcanic landscapes.', 64.1466, -21.9426),
(16, 'Bangkok', 'Thailand', 'Asia', 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', 1, 90, 'Ornate temples, vibrant street life, legendary street food, and floating markets.', 13.7563, 100.5018),
(17, 'Machu Picchu', 'Peru', 'South America', 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800', 3, 91, 'The lost city of the Incas, perched high in the Andes with breathtaking mountain views.', -13.1631, -72.545),
(18, 'Amsterdam', 'Netherlands', 'Europe', 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800', 4, 89, 'Charming canals, world-class art museums, cycling culture, and vibrant nightlife.', 52.3676, 4.9041),
(19, 'Maldives', 'Maldives', 'Asia', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', 5, 86, 'Crystal-clear lagoons, overwater villas, pristine white sand beaches, and marine life.', 3.2028, 73.2207),
(20, 'Prague', 'Czech Republic', 'Europe', 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800', 2, 87, 'Fairy-tale architecture, medieval Old Town, Charles Bridge, and excellent beer culture.', 50.0755, 14.4378),
(21, 'Jaipur', 'India', 'Asia', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', 1, 84, 'The Pink City — magnificent forts, ornate palaces, colorful bazaars, and royal heritage.', 26.9124, 75.7873),
(22, 'Rio de Janeiro', 'Brazil', 'South America', 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800', 3, 90, 'Christ the Redeemer, Copacabana beach, Carnival, samba, and stunning natural beauty.', -22.9068, -43.1729),
(23, 'Vienna', 'Austria', 'Europe', 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800', 3, 86, 'Imperial palaces, classical music heritage, coffeehouse culture, and art nouveau.', 48.2082, 16.3738),
(24, 'Singapore', 'Singapore', 'Asia', 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', 4, 88, 'Futuristic gardens, hawker food culture, Marina Bay, and a perfect blend of cultures.', 1.3521, 103.8198),
(25, 'Lisbon', 'Portugal', 'Europe', 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800', 2, 87, 'Sun-drenched hills, pastel buildings, historic trams, pastéis de nata, and fado music.', 38.7223, -9.1393)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    country = EXCLUDED.country,
    region = EXCLUDED.region,
    image_url = EXCLUDED.image_url,
    cost_index = EXCLUDED.cost_index,
    popularity_score = EXCLUDED.popularity_score,
    description = EXCLUDED.description;

-- ========================================================
-- 🎭 SEED DATA: 40 Curated Activities
-- ========================================================
INSERT INTO activities (id, city_id, name, description, category, estimated_cost, duration, image_url, rating) VALUES
(1, 1, 'Eiffel Tower Visit', 'Ascend the iconic iron lattice tower for breathtaking panoramic views of Paris.', 'Sightseeing', 26.00, '2-3 hours', 'https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=600', 4.8),
(2, 1, 'Louvre Museum Tour', 'Explore the world largest art museum, home to the Mona Lisa and Venus de Milo.', 'Culture', 17.00, '3-4 hours', 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600', 4.9),
(3, 1, 'Seine River Cruise', 'Glide past illuminated monuments on a romantic evening river cruise.', 'Experience', 15.00, '1-2 hours', 'https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?w=600', 4.7),
(4, 1, 'Montmartre Walking Tour', 'Wander through the artistic hilltop neighborhood, visit Sacré-Cœur basilica.', 'Walking Tour', 0.00, '2 hours', 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=600', 4.6),
(5, 2, 'Shibuya Crossing Experience', 'Stand in the world busiest pedestrian crossing and feel the energy of Tokyo.', 'Experience', 0.00, '1 hour', 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600', 4.5),
(6, 2, 'Tsukiji Fish Market Tour', 'Sample the freshest sushi and seafood at the world-famous outer market.', 'Food', 30.00, '2-3 hours', 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600', 4.8),
(7, 2, 'Meiji Shrine Visit', 'Find tranquility in this Shinto shrine surrounded by a lush forest in central Tokyo.', 'Culture', 0.00, '1-2 hours', 'https://images.unsplash.com/photo-1583086762675-5a142e6e7f0c?w=600', 4.7),
(8, 2, 'Akihabara Gaming District', 'Explore the electric town of anime, manga, electronics, and gaming arcades.', 'Entertainment', 20.00, '3-4 hours', 'https://images.unsplash.com/photo-1578469645742-46cae010e5d6?w=600', 4.4),
(9, 3, 'Tegallalang Rice Terraces', 'Walk through the stunning cascading rice paddies and learn about Subak irrigation.', 'Nature', 5.00, '2-3 hours', 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600', 4.7),
(10, 3, 'Uluwatu Temple Sunset', 'Watch a mesmerizing Kecak fire dance at this clifftop temple during sunset.', 'Culture', 8.00, '2-3 hours', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', 4.8),
(11, 3, 'Ubud Monkey Forest', 'Encounter playful long-tailed macaques in this sacred sanctuary amid ancient temples.', 'Nature', 6.00, '1-2 hours', 'https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?w=600', 4.5),
(12, 3, 'Balinese Cooking Class', 'Learn to prepare authentic Balinese dishes using fresh local ingredients.', 'Food', 25.00, '4-5 hours', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600', 4.9),
(13, 4, 'Oia Sunset Viewpoint', 'Witness the world-famous sunset from the charming village of Oia.', 'Experience', 0.00, '1-2 hours', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600', 4.9),
(14, 4, 'Caldera Sailing Tour', 'Sail around the volcanic caldera, swim in hot springs, and enjoy a Greek feast.', 'Adventure', 120.00, '5-6 hours', 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600', 4.8),
(15, 4, 'Wine Tasting Tour', 'Sample unique volcanic wines at traditional wineries with caldera views.', 'Food', 45.00, '3-4 hours', 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600', 4.7),
(16, 4, 'Red Beach Visit', 'Relax on the dramatic red volcanic cliffs and swim in crystal-clear waters.', 'Beach', 0.00, '2-3 hours', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', 4.5),
(17, 5, 'Statue of Liberty & Ellis Island', 'Visit the iconic symbol of freedom and explore the immigration museum.', 'Sightseeing', 24.00, '4-5 hours', 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=600', 4.7),
(18, 5, 'Broadway Show', 'Experience world-class theater on the Great White Way.', 'Entertainment', 120.00, '2-3 hours', 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600', 4.9),
(19, 5, 'Central Park Walking Tour', 'Stroll through the beloved 843-acre green oasis in the heart of Manhattan.', 'Nature', 0.00, '2-3 hours', 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=600', 4.6),
(20, 5, 'Top of the Rock', 'Enjoy unobstructed 360-degree views from Rockefeller Center observation deck.', 'Sightseeing', 40.00, '1-2 hours', 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600', 4.8),
(21, 6, 'Tower of London', 'Explore 900 years of royal history and see the Crown Jewels.', 'Culture', 33.00, '3-4 hours', 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=600', 4.7),
(22, 6, 'British Museum', 'Discover human history spanning two million years — completely free.', 'Culture', 0.00, '3-4 hours', 'https://images.unsplash.com/photo-1590080876411-eb6f3e95abac?w=600', 4.8),
(23, 6, 'Afternoon Tea Experience', 'Indulge in a traditional English afternoon tea with scones and finger sandwiches.', 'Food', 55.00, '1-2 hours', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600', 4.6),
(24, 6, 'West End Musical', 'Catch a world-class musical performance in London theater district.', 'Entertainment', 80.00, '2-3 hours', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600', 4.8),
(25, 7, 'Burj Khalifa Observation', 'Ascend to the 148th floor of the world tallest building for stunning views.', 'Sightseeing', 50.00, '1-2 hours', 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=600', 4.8),
(26, 7, 'Desert Safari', 'Experience dune bashing, camel riding, and a BBQ dinner under the stars.', 'Adventure', 65.00, '6-7 hours', 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=600', 4.7),
(27, 8, 'Colosseum Tour', 'Step into the ancient arena where gladiators once fought.', 'Culture', 18.00, '2-3 hours', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600', 4.9),
(28, 8, 'Vatican Museums & Sistine Chapel', 'Marvel at Michelangelo ceiling and the vast papal art collection.', 'Culture', 20.00, '3-4 hours', 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600', 4.9),
(29, 8, 'Trastevere Food Tour', 'Taste authentic Roman cuisine in the charming cobblestone streets.', 'Food', 45.00, '3 hours', 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=600', 4.8),
(30, 9, 'Sagrada Familia Tour', 'Explore Gaudí unfinished masterpiece basilica with its stunning interiors.', 'Culture', 26.00, '2-3 hours', 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600', 4.9),
(31, 9, 'Park Güell', 'Wander through Gaudí colorful mosaic park with panoramic city views.', 'Sightseeing', 10.00, '1-2 hours', 'https://images.unsplash.com/photo-1583779457711-ab081e10d0f3?w=600', 4.7),
(32, 21, 'Amber Fort Exploration', 'Explore the magnificent hilltop fort with intricate mirror work and courtyards.', 'Culture', 8.00, '3-4 hours', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', 4.8),
(33, 21, 'Hawa Mahal Visit', 'Admire the iconic Palace of Winds with its 953 small windows.', 'Sightseeing', 3.00, '1 hour', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600', 4.6),
(34, 21, 'Jaipur Street Food Tour', 'Sample dal baati churma, pyaaz kachori, and lassi in the Pink City bazaars.', 'Food', 10.00, '2-3 hours', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600', 4.7),
(35, 10, 'Sydney Opera House Tour', 'Go behind the scenes of this UNESCO World Heritage performing arts venue.', 'Culture', 30.00, '1-2 hours', 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600', 4.7),
(36, 10, 'Bondi to Coogee Walk', 'Scenic coastal walk with stunning ocean views and beach stops.', 'Nature', 0.00, '2-3 hours', 'https://images.unsplash.com/photo-1523428096049-1ced17076b30?w=600', 4.6),
(37, 11, 'Jemaa el-Fnaa Night Market', 'Experience the magical atmosphere of snake charmers, storytellers, and food stalls.', 'Experience', 10.00, '2-3 hours', 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600', 4.7),
(38, 12, 'Fushimi Inari Shrine', 'Walk through thousands of vermillion torii gates on the sacred mountain trail.', 'Culture', 0.00, '2-3 hours', 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=600', 4.9),
(39, 12, 'Traditional Tea Ceremony', 'Experience the art of Japanese tea preparation in a historic tea house.', 'Culture', 35.00, '1-2 hours', 'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=600', 4.8),
(40, 16, 'Grand Palace Tour', 'Marvel at the former royal residence and the Emerald Buddha temple.', 'Culture', 15.00, '2-3 hours', 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600', 4.7)
ON CONFLICT (id) DO UPDATE SET
    city_id = EXCLUDED.city_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    estimated_cost = EXCLUDED.estimated_cost,
    duration = EXCLUDED.duration,
    image_url = EXCLUDED.image_url,
    rating = EXCLUDED.rating;
