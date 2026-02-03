import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";

const Gallery = () => {
  const [shuffledImages, setShuffledImages] = useState<string[]>([]);

  useEffect(() => {
    // Generar array y barajarlo
    const images = Array.from({ length: 29 }, (_, i) => `/angel_felix/album/photo-${i + 1}.jpg`);
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
    
    // Subir al inicio de la página al entrar
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-black">
      <Navigation onBookNow={() => {}} />
      
      <div className="pt-32 pb-20 px-4 container mx-auto">
        <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors mb-12 uppercase text-xs tracking-[0.2em] font-bold"
        >
            <ArrowLeft size={16} />
            Back to Home
        </Link>

        <header className="mb-16 text-center">
            <span className="mb-4 inline-block font-body text-xs uppercase tracking-[0.3em] text-primary">
                The Trophy Collection
            </span>
            <h1 className="font-display text-5xl md:text-7xl text-white mb-6">Our Legacy</h1>
            <div className="elegant-line mx-auto" />
        </header>

        {/* Masonry-like Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {shuffledImages.map((src, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="relative overflow-hidden rounded-lg group"
                >
                    <img 
                        src={src} 
                        alt={`Experience ${index}`} 
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <div className="h-0.5 w-8 bg-primary transition-all duration-500 group-hover:w-full" />
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
      
      <footer className="py-20 border-t border-white/10 text-center">
         <p className="text-gray-500 text-xs uppercase tracking-widest">© 2025 Angel Felix Hunting</p>
      </footer>
    </main>
  );
};

export default Gallery;
