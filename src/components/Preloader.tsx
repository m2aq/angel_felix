import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo-angel-felix.webp";
import heroBg from "@/assets/hero-cimarron.jpg";
import {
  BIGHORN_IMAGE,
  COUES_DEER_IMAGE,
  ISLA_TIBURON_IMAGE,
  MULE_DEER_IMAGE,
  SCROLLY_MULE_DEER_IMAGE,
} from "@/lib/pageAssets";

// Everything the main page needs to look complete when the loader leaves.
// Videos and the gallery are not included: they load on demand / on scroll.
const PAGE_IMAGES = [
  heroBg,
  SCROLLY_MULE_DEER_IMAGE,
  BIGHORN_IMAGE,
  MULE_DEER_IMAGE,
  COUES_DEER_IMAGE,
  ISLA_TIBURON_IMAGE,
];
const FONT_FACES = ['400 1em "Cormorant Garamond"', '400 1em "Montserrat"'];
// Safety cap so the loader never hangs on a failed or very slow request.
const MAX_WAIT_MS = 20000;

const loadImage = (url: string) =>
  new Promise<void>((resolve) => {
    const img = new Image();
    img.src = url;
    // decode() waits for the bitmap to be ready, so Safari on iPhone does not paint it in tiles.
    if (typeof img.decode === "function") {
      img.decode().then(() => resolve(), () => resolve());
    } else {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    }
  });

const loadFonts = () =>
  Promise.all([...FONT_FACES.map((face) => document.fonts.load(face)), document.fonts.ready]).then(
    () => undefined,
    () => undefined
  );

const waitForWindowLoad = () =>
  document.readyState === "complete"
    ? Promise.resolve()
    : new Promise<void>((resolve) => window.addEventListener("load", () => resolve(), { once: true }));

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setTimeout(() => {
            document.body.style.overflow = "auto";
          }, 500);
        }, 250);
      }, 400);
    };

    // Real progress: one step per asset that finished loading.
    const tasks = [waitForWindowLoad(), loadFonts(), ...PAGE_IMAGES.map(loadImage)];
    let done = 0;
    tasks.forEach((task) =>
      task.then(() => {
        done += 1;
        if (!finished) setProgress(Math.min(99, Math.round((done / tasks.length) * 100)));
      })
    );

    Promise.all(tasks).then(finish);
    const timeout = setTimeout(finish, MAX_WAIT_MS);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full bg-white/40 blur-[80px] scale-150" />
              <motion.img
                src={logo}
                alt="Angel Felix Hunting"
                className="relative z-10 w-48 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] md:w-64"
                animate={{ filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-[10px] uppercase tracking-[0.3em] text-white"
            >
              Loading Experience
            </motion.p>

            <div className="mt-4 w-52 md:w-64">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
                <motion.div
                  className="h-full rounded-full bg-white"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                />
              </div>
              <p className="mt-2 text-center text-[10px] tracking-[0.2em] text-white/65">
                {Math.round(progress)}%
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
