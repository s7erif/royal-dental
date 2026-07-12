
CREATE POLICY "service images are readable by everyone" ON storage.objects FOR SELECT
TO anon, authenticated USING (bucket_id = 'service-images');

CREATE POLICY "admins upload service images" ON storage.objects FOR INSERT
TO authenticated WITH CHECK (bucket_id = 'service-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins update service images" ON storage.objects FOR UPDATE
TO authenticated USING (bucket_id = 'service-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete service images" ON storage.objects FOR DELETE
TO authenticated USING (bucket_id = 'service-images' AND public.has_role(auth.uid(), 'admin'));
