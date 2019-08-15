import { ServiceClientCredentials } from "./node_modules/@azure/cognitiveservices-luis-runtime/node_modules/@azure/ms-rest-js/";

export class ApiKeyServiceClientCredentials implements ServiceClientCredentials {
    signRequest(webResource: import("./node_modules/@azure/cognitiveservices-luis-runtime/node_modules/@azure/ms-rest-js/").WebResource): Promise<import("./node_modules/@azure/cognitiveservices-luis-runtime/node_modules/@azure/ms-rest-js/").WebResource> {
        return new Promise<import("./node_modules/@azure/cognitiveservices-luis-runtime/node_modules/@azure/ms-rest-js/").WebResource>((resolve, reject) => {
            if (typeof webResource == "undefined" || webResource == null) {
                reject("WebResource is undefined or null.");
            }
            webResource.headers.set("Ocp-Apim-Subscription-Key", this.authoring_key);
            resolve(webResource);
        });
    }
    authoring_key: string = null;

    constructor(authoring_key: string) {
        if (!authoring_key || authoring_key.trim() == '') {
            throw new Error("Null or Empty Subsription Key Error");
        }
        this.authoring_key = authoring_key;
    }

}