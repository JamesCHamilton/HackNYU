import axios from "axios";

let cachedCatUrl = null;
let lastFetched = 0; // Timestamp of last fetch

const fetchCatImage = async () => {
    try {
        const response = await axios.get('https://cataas.com/cat?json=true');
        cachedCatUrl = `https://cataas.com${response.data.url}`;
        lastFetched = Date.now();
    } catch (error) {
        console.error('Failed to fetch cat image:', error);
    }
};


export default fetchCatImage();