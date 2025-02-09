import Client from "../schemas/Client";
import axios from "axios";

// Function to handle daily login
export const handleDailyLogin = async (clientId) => {
    const client = await Client.findById(clientId);
    const now = new Date();
    const lastLogin = client.lastLogin;

    // Convert dates to timestamps (numbers) using .getTime()
    const timeSinceLastLogin = now.getTime() - lastLogin.getTime();

    // Check if the last login was more than 24 hours ago
    if (timeSinceLastLogin > 24 * 60 * 60 * 1000) {
        client.points += 10; // Award 10 points for daily login
        client.lastLogin = now; // Update last login date
        await client.save();
        console.log("Daily login points awarded!");
    } else {
        console.log("You have already logged in today.");
    }
};

// Function to handle photo collection
export const collectPhoto = async (clientId, photoUrl) => {
    const client = await Client.findById(clientId);

    // Check if the client has enough points (e.g., 100 points)
    if (client.points >= 100) {
        client.collectedPhotos.push(photoUrl); // Add the photo to the collection
        client.points -= 100; // Deduct 100 points
        await client.save();
        console.log("Photo collected successfully!");
    } else {
        console.log("Not enough points to collect this photo.");
    }
};

const fetchRandomCatPhoto = async () => {
    try {
        const response = await axios.get("https://cataas.com/cat", {
            responseType: "arraybuffer", // Fetch the image as a binary buffer
        });
        const base64Image = Buffer.from(response.data, "binary").toString("base64"); // Convert to base64
        return `data:image/jpeg;base64,${base64Image}`; // Return as a data URL
    } catch (error) {
        console.error("Error fetching cat photo:", error);
        throw new Error("Failed to fetch cat photo");
    }
};

// Function to fetch a random dog photo from https://dog.ceo/api/breeds/image/random
const fetchRandomDogPhoto = async () => {
    try {
        const response = await axios.get("https://dog.ceo/api/breeds/image/random");
        return response.data.message; // Return the direct image URL
    } catch (error) {
        console.error("Error fetching dog photo:", error);
        throw new Error("Failed to fetch dog photo");
    }
};

// Function to fetch and save a random photo (cat or dog)
export const fetchAndSaveRandomPhoto = async (clientId: string, animal: "cat" | "dog") => {
    const client = await Client.findById(clientId);
    if (!client) {
        throw new Error("Client not found");
    }

    // Check if the client has enough points (e.g., 100 points)
    if (client.points < 100) {
        throw new Error("Not enough points to collect a photo");
    }

    // Fetch a random photo based on the selected animal
    let photoUrl: string;
    if (animal === "cat") {
        photoUrl = await fetchRandomCatPhoto();
    } else if (animal === "dog") {
        photoUrl = await fetchRandomDogPhoto();
    } else {
        throw new Error("Invalid animal type");
    }

    // Save the photo URL to the client's collection
    client.collectedPhotos.push(photoUrl);
    client.points -= 100; // Deduct 100 points
    await client.save();

    console.log("Photo collected successfully!");
    return photoUrl; // Return the photo URL for further use (e.g., sending in the response)
};