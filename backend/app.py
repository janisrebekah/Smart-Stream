from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Load movies
movies = pd.read_csv("data/movies.csv")
movies['overview'] = movies['overview'].fillna('')

# TF-IDF Vectorizer
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(movies['overview'])

# Cosine Similarity
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

# Indexing
movies = movies.reset_index()
indices = pd.Series(movies.index, index=movies['title'].str.lower())

# TMDB API
TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_SEARCH_URL=https://api.themoviedb.org/3/search/movie
TMDB_IMG_BASE=https://image.tmdb.org/t/p/w500

def fetch_poster(title):
    try:
        response = requests.get(TMDB_SEARCH_URL, params={
            "api_key": TMDB_API_KEY,
            "query": title
        })
        data = response.json()
        if data["results"]:
            return TMDB_IMG_BASE + data["results"][0]["poster_path"]
    except:
        pass
    return None

@app.route("/")
def home():
    return "🎬 SmartStream Movie Recommender is Live!"

@app.route("/recommend", methods=["GET"])
def recommend():
    title = request.args.get('title')

    if not title:
        return jsonify({"error": "Missing 'title' parameter in query"}), 400

    title = title.lower()

    if title not in indices:
        return jsonify({"error": f"No movie found with title '{title}'"}), 404

    idx = indices[title]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:6]

    movie_indices = [i[0] for i in sim_scores]

    recommendations = []
    for i in sim_scores:
        movie_idx = i[0]
        movie_title = movies['title'].iloc[movie_idx]
        overview = movies['overview'].iloc[movie_idx]
        poster_url = fetch_poster(movie_title)
        score = round(i[1] * 100, 2)  # Convert similarity to percentage

        recommendations.append({
            "title": movie_title,
            "poster": poster_url,
            "overview": overview,
            "match": f"{score}%"  # match percent!
        })


    return jsonify({
        "input_movie": title,
        "recommendations": recommendations
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
