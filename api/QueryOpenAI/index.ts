import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const prompt = (req.query.prompt || (req.body && req.body.prompt));

    context.res.json({
        text: prompt
    });

};

export default httpTrigger;