// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Music4 } from "lucide-react";

export default function MusicIcon({ size = 100, color = "red" }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Music4 size={size} color={color} />
    </motion.div>
  );
}