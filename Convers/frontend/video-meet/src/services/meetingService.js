const SERVER_URL = "ws://localhost:7880";

export function getServerUrl() {
  return SERVER_URL;
}

export async function getMeetingToken(meetingId, identity) {
  const response = await fetch(
    `/api/token?room=${meetingId}&identity=${identity}`
  );

  if (!response.ok) {
    throw new Error("Failed to get meeting token");
  }

  return response.text();
}