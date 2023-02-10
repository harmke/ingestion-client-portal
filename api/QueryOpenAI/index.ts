import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const prompt = (req.query.prompt || (req.body && req.body.prompt));

    const api_key = process.env.API_KEY;
    const base_url =  process.env.AOAI_ENDPOINT;
    const deployment_name = process.env.DEPLOYMENT_NAME;
    const url = base_url + "/openai/deployments/" + deployment_name + "/completions?api-version=2022-12-01";

    let output = '';
    const response = await fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "api-key": api_key as string,
        Accept: "application/json",
    },
    body:    JSON.stringify(   {
        "temperature": 0,
        "max_tokens":600,
        "prompt" : prompt
        })
    })
    // .then(function(response){ 
    //     return response.json()})
    //     .then(function(data)
    //     {console.log(data);
    //     // console.log("OpenAI Response", data);
    //     console.log("OpneAI", data.choices[0].text);
    //     })
    // .catch((error) => {
    //     //Promise.reject(error);
    //     console.log(error)
    // });



    context.res.json({
        text: prompt
    });

};

export default httpTrigger;