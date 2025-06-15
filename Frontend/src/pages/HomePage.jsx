import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const { user, isAuthenticated, loading,currentUser } = useUser();
  const navigate = useNavigate();
  const [quote, setQuote] = useState("");

  useEffect(() => {
    currentUser()
    const quotes = [
      "Conversations begin here. Who will you connect with today?",
      "Start a chat — a single message can spark a world of ideas.",
      "Every message matters. Say it clearly, kindly, and confidently.",
      "Looking quiet? Start typing. Someone might be waiting.",
      "Ready when you are. Conversations don’t start themselves.",
      "Clear communication is powerful. Keep it thoughtful.",
      "The best ideas start as a simple message. Send yours.",
      "No conversations yet — be the first to say hello.",
      "Communicate with clarity. Collaborate with confidence.",
      "Timely conversations lead to better decisions. Start yours now."
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="animate-pulse text-xl text-gray-500">
          Loading your universe...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative min-h-screen bg-black text-white overflow-hidden px-4 py-20 flex items-center justify-center"
    >

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1 }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <h1 className="text-5xl font-extrabold mb-6 flicker-text">
          Welcome, {user?.fullName || "Ghost"}
        </h1>

        <p className="text-gray-500 mb-10 text-lg italic">{quote}</p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/chat")}
          className="px-6 py-3 rounded-lg border border-white text-white font-semibold text-lg shadow-lg hover:shadow-white/10 transition-all duration-300 hover:bg-white hover:text-black hover:cursor-pointer"
        >
          Enter Chat
        </motion.button>

        <div className="mt-12 flex justify-center gap-6 text-sm">
          <button
            onClick={() => navigate("/profile")}
            className="text-gray-400 hover:text-white transition"
          >
            Profile
          </button>
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white transition"
          >
            Features
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
