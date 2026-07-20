const API_URL = "http://localhost:8080";

export async function getToken(room, identity) {

    const response = await fetch(
        `${API_URL}/api/token?room=${room}&identity=${identity}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch token");
    }

    return await response.text();
}