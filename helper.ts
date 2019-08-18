import { LUISRuntimeClient } from "@azure/cognitiveservices-luis-runtime";
import { ApiKeyServiceClientCredentials } from "./ApiKeyServiceClientCredentials";

var global_client: LUISRuntimeClient = null;
var subscription = "b15ebe3a1ec446a08f8021fe6f95f0f6";

export const appId = "0894d430-8f00-4bcd-8153-45e06a1feca1";
export var versionId = "0.1";

export var utterance = "today this is a test with post";
export var slotName = "production";

// Prediction Slot
export let externalResolution = { text: "post", external: true };



export function luisRuntimeClientInit() {
    return new Promise<LUISRuntimeClient>((resolve, reject) => {
        if (global_client) {
            resolve(global_client);
        }
        global_client = new LUISRuntimeClient(
            new ApiKeyServiceClientCredentials(subscription),
            "https://westus.api.cognitive.microsoft.com"
        );
        if (global_client == null) {
            reject("Client can't be instantiated")
        } else {
            resolve(global_client)
        }
    });
}