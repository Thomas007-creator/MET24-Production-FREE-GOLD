const crypto = require('crypto');

const templates = {
  summarizer: [
    "Korte summary: Een bedachtzame strateeg gericht op lange termijn, efficiency en visie.",
    "Kern: Intellectueel, toekomstgericht en onafhankelijk met een voorkeur voor structuren."
  ],
  generator: [
    "Variant A: Formuleer je doelen concreet in 3 stappen...",
    "Variant B: Probeer deze oefening: ..."
  ]
};

function pick(kind, prompt) {
  const hash = crypto.createHash('md5').update(prompt).digest('hex');
  const idx = parseInt(hash.slice(0,4), 16) % templates[kind].length;
  return templates[kind][idx];
}

async function callModel(kind, prompt, params) {
  const text = pick(kind, prompt);
  const prompt_hash = crypto.createHash('sha256').update(prompt).digest('hex');
  return { text, model: 'mock', model_version: 'mock-1', prompt_hash };
}

module.exports = { callModel };
















