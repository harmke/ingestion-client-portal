module.exports = async function (context, req) {
  context.log('HTTP trigger function processed a request.');
  // const prompt = (req.query.prompt || (req.body && req.body.prompt));

  const api_key = "04e8a255f5984800928bd8b42c129d8c";
  const url = "https://sam-openai-rs.openai.azure.com/openai/deployments/text-davinci-003/completions?api-version=2022-12-01";

  try {
      const response = await fetch(url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "api-key": api_key,
          Accept: "application/json",
      },
      body: JSON.stringify({
          "temperature": 0,
          "max_tokens":600,
          "prompt" : "say test",
          })
      })

      const result = await response.json()
      context.res.json(result)

  } catch (error) {
      context.res.json({
      error: error
  });
  }
};