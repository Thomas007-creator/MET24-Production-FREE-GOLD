const mockAdapter = require('../model-adapters/mockAdapter');
async function run(job, db) {
  const prompt = job.prompt;
  const out = await mockAdapter.callModel('summarizer', prompt, {});
  // persist to ai_artifacts table
  await db.query(`INSERT INTO ai_artifacts (job_id, origin, agent, model, model_version, prompt_hash, content, provenance, moderation_status)
                  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [job.job_id, 'seed', 'summarizer', out.model, out.model_version, out.prompt_hash, { text: out.text }, { prompt_snippet: prompt.slice(0,500) }, 'pending']);
  return out;
}

module.exports = { run };
















