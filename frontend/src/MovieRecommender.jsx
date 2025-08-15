import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const MovieRecommender = () => {
  const [title, setTitle] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRecommend = async () => {
    if (!title.trim()) {
      setError("Please enter a movie title");
      return;
    }
    
    setLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const response = await axios.get(
        `http://localhost:5000/recommend?title=${encodeURIComponent(title)}`
      );
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError(error.response?.data?.error || "Couldn't fetch recommendations. Try another title.");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            style={{
              backgroundSize: '200% 200%',
            }}
          >
            🍿 SmartStream Recommender
          </motion.h1>
          <p className="text-lg text-purple-200">Discover your next favorite movie</p>
        </div>

        <motion.div 
          className="flex justify-center items-center mb-16 gap-4 flex-wrap"
          whileHover={{ scale: 1.02 }}
        >
          <motion.input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a movie title like 'Toy Story'"
            className="px-6 py-4 w-full md:w-96 rounded-xl bg-gray-800 border-2 border-purple-500 text-white focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50 shadow-lg"
            onKeyPress={(e) => e.key === 'Enter' && handleRecommend()}
            whileFocus={{ scale: 1.05 }}
          />
          <motion.button
            onClick={handleRecommend}
            disabled={loading}
            className={`relative px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg ${
              loading ? "opacity-80 cursor-not-allowed" : ""
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <span className="flex items-center">
                <motion.span 
                  className="inline-block mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  🔍
                </motion.span>
                Searching...
              </span>
            ) : (
              <>
                <span className="relative z-10">🚀 Get Recommendations</span>
                <motion.span 
                  className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 rounded-xl opacity-0"
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </>
            )}
          </motion.button>
        </motion.div>

        {error && (
          <motion.div 
            className="text-center text-red-300 mb-8 p-4 bg-red-900 bg-opacity-30 rounded-xl max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.div>
        )}

        {recommendations.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {recommendations.map((movie, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-purple-500/30 relative group"
                variants={item}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative overflow-hidden h-80">
                  {movie.poster ? (
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                            <span class="text-gray-300">No Image Available</span>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                      <span className="text-gray-300">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h2 className="text-2xl font-bold text-white drop-shadow-lg">{movie.title}</h2>
                    <span className="inline-block px-3 py-1 mt-2 bg-purple-600 rounded-full text-sm font-semibold">
                      {movie.match} Match
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {movie.overview || "No description available"}
                  </p>
                  <motion.a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                      `${movie.title} official trailer`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ▶ Watch Trailer
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : !loading && !error && (
          <motion.div 
            className="text-center text-gray-400 mt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div 
              className="text-6xl mb-6"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              🎬
            </motion.div>
            <h3 className="text-2xl font-light mb-2">Your Personal Movie Guide</h3>
            <p className="max-w-lg mx-auto">Enter a movie you love and we'll recommend similar films you might enjoy!</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MovieRecommender;