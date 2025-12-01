export async function generateItinerary(input) {
  const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/itinerary/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });

  const data = await res.json();
  return data.data;
}



// Question Answering also move to backend later,
// for now show dummy response to avoid frontend crash

export async function askQuestionAboutItinerary(itinerary, question) {
  return "AI Assistant is temporarily unavailable. Backend integration pending.";
}
