const Favorite = require('../models/favorite');
const axios = require('axios');
const BASE_URL = 'https://api.themoviedb.org/3/movie/';
const API_KEY = process.env.API_KEY; 

module.exports = {
    getMovies,
    addFavorite 
}

async function getMovies(req, res) {
    try {
    
        const { data } = await axios.get(BASE_URL + 'now_playing?region=US&api_key=' + API_KEY)
        if (req.query.userid) {
            const favorites = await Favorite.find({ userId: req.query.userid });
            const moviesWithFavorites = markFavorites(favorites, data.results); 
            //return res.json({ data: dataWithFavorites }); 
            data.results = moviesWithFavorites;
            }
        res.json({ data });
    } catch(error) {
        console.log(error);
    }
}

async function addFavorite(req, res) {
    try {
        const userId = req.query.userid;
        const movieId = req.query.movieid; 
        await Favorite.create({ userId: userId, movieId: movieId })
        getMovies(req, res); 
    } catch (error) {
        
    }
}

function markFavorites(favoritesArr, moviesArr) {
    const movieIds = favoritesArr.map(favorite => favorite.movieId);
    return moviesArr.map(movie => {
        if (movieIds.includes(movie.id)) {
            movie.favorite = true;
        } else {
            movie.favorite = false;
        }
        return movie; 
    });
  
}