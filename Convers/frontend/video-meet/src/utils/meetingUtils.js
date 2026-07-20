export function generateMeetingId() {
  const number = Math.floor(10000 + Math.random() * 90000);
  return `convers-${number}`;
}