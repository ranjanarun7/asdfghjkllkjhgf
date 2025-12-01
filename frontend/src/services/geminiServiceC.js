export const sendMessage = async (history, message, language) => {
  const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ history, message, language })
  });

  if (!res.ok) throw new Error("AI Server Error");

  const data = await res.json();
  return data.reply;
};
