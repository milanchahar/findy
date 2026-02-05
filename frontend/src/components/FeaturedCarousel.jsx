import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const featured = [
  {
    id: 1,
    title: 'Plant-Verified Homes',
    label: 'Green Living',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc9f51f92?w=1200&auto=format&fit=crop', // Cozy living room with plants
  },
  {
    id: 2,
    title: 'Night Owl Pads',
    label: 'Late Night Vibes',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&auto=format&fit=crop', // Evening interior view
  },
  {
    id: 3,
    title: 'Campus Ready',
    label: 'Student Housing',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&auto=format&fit=crop', // Practical apartment
  },
];

const FeaturedCarousel = () => {
  return (
    <section className="border-y border-white/10 py-20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">
              Collection 01 / 01
            </p>
            <h2 className="text-4xl md:text-5xl font-black">Curated Collections</h2>
          </div>
          <p className="hidden md:block text-sm text-gray-400 max-w-sm text-right">
            Born near campus, made for the city. Discover spaces that match your rhythm and rules.
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={32}
          slidesPerView={1.1}
          centeredSlides
          loop
          autoplay={{ delay: 4500 }}
          pagination={{ clickable: true }}
          navigation
          breakpoints={{
            768: { slidesPerView: 1.4 },
            1024: { slidesPerView: 1.6 },
          }}
          className="!overflow-visible"
        >
          {featured.map((item) => (
            <SwiperSlide key={item.id}>
              <motion.div
                className="relative h-[380px] md:h-[460px] overflow-hidden border border-white/10 bg-black group cursor-pointer"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-3">
                      {item.label}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-black max-w-xl">
                      {item.title}
                    </h3>
                  </div>
                  <motion.span
                    className="text-xs md:text-sm uppercase tracking-[0.3em] text-gray-300"
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  >
                    Explore Collection →
                  </motion.span>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedCarousel;

