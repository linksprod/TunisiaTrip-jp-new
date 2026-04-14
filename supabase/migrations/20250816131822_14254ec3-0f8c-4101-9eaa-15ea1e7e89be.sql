-- Migration: Insert all existing activities from static data
INSERT INTO public.activities (title, location, description, image, tags, category, rating, duration, price, show_in_travel, show_in_start_my_trip) VALUES
('Desert Safari & Camel Riding', 'Sahara Desert, Douz', 'Experience the magic of the Sahara Desert on a camel trek across golden dunes.', '/uploads/a2d95c89-23fc-48b3-b72b-742bdd9b0076.png', ARRAY['Adventure', 'Nature', 'Cultural'], 'activity', 4.9, 'Half-day to multi-day', '$$', true, true),
('Explore Ancient Carthage', 'Carthage, near Tunis', 'Walk through the legendary ruins of Carthage, once the center of a powerful ancient civilization.', '/uploads/59785105-2ab9-4ee5-9e99-65d6f4634e73.png', ARRAY['Historical', 'UNESCO Site', 'Educational'], 'activity', 4.8, '3-4 hours', '$', true, true),
('Wander Through Sidi Bou Said', 'Sidi Bou Said, near Tunis', 'Get lost in the picturesque blue and white village of Sidi Bou Said.', '/uploads/2714f2c3-4465-4a55-8369-5484aa8f3b28.png', ARRAY['Cultural', 'Photography', 'Relaxation'], 'activity', 4.8, '2-3 hours', '$', true, true),
('Visit the El Jem Amphitheatre', 'El Jem', 'Marvel at one of the world''s best-preserved Roman amphitheaters.', '/uploads/b1054a66-c723-4e47-b4d5-345f2c611881.png', ARRAY['Historical', 'UNESCO Site', 'Architecture'], 'activity', 4.9, '1-2 hours', '$', true, true),
('Shop in Traditional Souks', 'Medinas across Tunisia', 'Immerse yourself in the vibrant atmosphere of Tunisia''s traditional markets.', '/uploads/17d3abc2-7548-4528-9546-2db58e5b2029.png', ARRAY['Shopping', 'Cultural', 'Crafts'], 'activity', 4.6, '2-4 hours', '$-$$', true, true),
('Star Wars Film Locations Tour', 'Southern Tunisia', 'Visit the otherworldly landscapes that served as Tatooine in the Star Wars films.', '/uploads/9eb876d7-b767-4dea-a400-0ee661b1abdc.png', ARRAY['Film Tourism', 'Adventure', 'Photography'], 'activity', 4.8, '1-3 days', '$$-$$$', true, true);

-- Migration: Insert all existing hotels from static data
INSERT INTO public.hotels (name, location, description, image, amenities, breakfast, rating, price_per_night) VALUES
('Four Seasons Hotel', 'Tunis, Tunisia', 'Luxury hotel in the heart of Tunis', '/uploads/31fa750b-9618-4556-9aa2-c9b62cf3b480.png', ARRAY['Spa', 'Pool', 'Restaurant', 'Business Center', 'Concierge'], true, 5.0, '$$$'),
('Anantara Tozeur', 'Tozeur, Tunisia', 'Desert luxury resort with stunning views', '/uploads/7848de0b-5463-4416-ae56-7922714a447b.png', ARRAY['Desert views', 'Spa', 'Pool', 'Desert excursions'], true, 4.9, '$$$'),
('Movenpick Sousse', 'Sousse, Tunisia', 'Beachfront luxury hotel', '/uploads/d5b362eb-773a-485d-aa39-67eff2ccf55e.png', ARRAY['Beach access', 'Pool', 'Spa', 'Restaurant'], true, 4.8, '$$'),
('The Residence Tunis', 'Tunis, Tunisia', 'Premium resort with golf course', '/uploads/4de6ef16-ca24-431b-899d-e5c7cf11c73c.png', ARRAY['Golf course', 'Spa', 'Multiple restaurants', 'Beach club'], true, 4.9, '$$$'),
('Le Kasbah Kairouan', 'Kairouan, Tunisia', 'Boutique hotel with traditional architecture', '/uploads/4fdc3022-820b-4653-8401-6d31df53747b.png', ARRAY['Traditional architecture', 'Cultural tours', 'Restaurant'], true, 4.7, '$$'),
('Pansy KSAR Ghilene', 'Ghilene, Tunisia', 'Desert camp experience', '/uploads/53341fca-0b8d-47ff-a07c-7a30290c0170.png', ARRAY['Desert camp', 'Traditional meals', 'Camel trekking'], true, 4.6, '$$');

-- Migration: Insert all existing guesthouses from static data
INSERT INTO public.guesthouses (name, location, description, image, amenities, breakfast, rating, price_per_night) VALUES
('Dar Ben Gacem', 'Medina of Tunis, Tunisia', 'Traditional guesthouse in the heart of Tunis Medina', '/uploads/549c131b-140c-4a2b-a663-3d920f194f91.png', ARRAY['Traditional architecture', 'Courtyard', 'Local cuisine', 'Cultural tours'], true, 4.8, '$'),
('Dar Fatma', 'Sidi Bou Said, Tunis, Tunisia', 'Charming guesthouse with sea views', '/uploads/cbd7751a-e460-45c8-847d-849a5ca51bcc.png', ARRAY['Sea view', 'Traditional decor', 'Terrace', 'Local guide services'], true, 4.7, '$'),
('Dar Ellama', 'Bizerte, Tunisia', 'Historic guesthouse with cultural immersion', '/uploads/549c131b-140c-4a2b-a663-3d920f194f91.png', ARRAY['Historic building', 'Local cuisine', 'Cultural immersion'], true, 4.6, '$');