import 'dotenv/config';
import { Puzzlet } from "@puzzlet/sdk";
import { createTemplateRunner, ModelPluginRegistry } from "@puzzlet/agentmark";
import AllModels from "@puzzlet/all-models";

const puzzletClient = new Puzzlet({
    apiKey: process.env.PUZZLET_API_KEY!,
    appId: process.env.PUZZLET_APP_ID!
}, createTemplateRunner);
const tracer = puzzletClient.initTracing();

// Register relevant plugins for AgentMark: OpenAI, Anthropic, etc.
ModelPluginRegistry.registerAll(AllModels);

async function run() {
    const prompt = await puzzletClient.fetchPrompt("helloworld.txt");
    const props = { someExampleProp: 'someExampleValue' };
    const telemetry = {
        isEnabled: true,
        functionId: 'example-function-id',
        metadata: { userId: 'example-user-id' }
    };
    return (await prompt.run(props, { telemetry }));
}
run().then(console.log)
    .then(() => tracer.shutdown())
    .then(() => process.exit(0));
