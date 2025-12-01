const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/feedback`;

export const getFeedback = async () => {
  const res = await fetch(BASE_URL);
  return res.json();
};

export const addFeedback = async (feedback) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(feedback)
  });
  return res.json();
};

export const updateFeedbackAnalysis = async (id, analysis) => {
  const res = await fetch(`${BASE_URL}/${id}/analyze`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(analysis)
  });
  return res.json();
};

export const clearData = async () => {
  await fetch(`${BASE_URL}/wipe`, { method: "DELETE" });
};
