import { LUISRuntimeClient } from "@azure/cognitiveservices-luis-runtime";
import { ApiKeyServiceClientCredentials } from "./ApiKeyServiceClientCredentials"
import * as chai from "chai";
import * as PredictionRequest from "@azure/cognitiveservices-luis-runtime/esm/models";


const client = new LUISRuntimeClient(new ApiKeyServiceClientCredentials("b15ebe3a1ec446a08f8021fe6f95f0f6"), "https://westus.api.cognitive.microsoft.com");


const appId = "0894d430-8f00-4bcd-8153-45e06a1feca1";
var versionId = "0.1";

var utterance = "today this is a test with post";
var slotName = "production";

// Prediction Slot
let externalResolution = { text: "post", external: true };

client.prediction.getSlotPrediction(
    appId,
    slotName,
    {
        query: utterance,
        options: {
            datetimeReference: new Date("2019-01-01"),
            overridePredictions: true
        },
        externalEntities: [{
            entityName: "simple",
            startIndex: 26,
            entityLength: 4,
            resolution: externalResolution
        }],
        dynamicLists: [{
            listEntityName: "list", requestLists: [{
                name: "test",
                canonicalForm: "testing",
                synonyms: ["this"]
            }]
        }],
    }, {
        verbose: true,
        showAllIntents: true
    }
).then((result) => {
    var prediction = result.prediction;
    chai.expect(utterance).to.eql(result.query);
    chai.expect(utterance).to.eql(prediction.normalizedQuery);
    chai.expect(prediction.topIntent).to.eql("intent");
    chai.expect(Object.keys(prediction.intents).length).to.eql(2);
    chai.expect(Object.keys(prediction.entities).length).to.eql(4);
    chai.expect(prediction.entities["datetimeV2"]).to.be.exist;
    chai.expect(prediction.entities["simple"]).to.be.exist;
    chai.expect(prediction.entities["list"]).to.be.exist;
    chai.expect(prediction.entities["$instance"]).to.be.exist;

    var actualResolution = prediction.entities["simple"][0];
    chai.expect(externalResolution).to.eql(actualResolution);

    var topIntent = prediction.intents[prediction.topIntent];
    chai.expect(topIntent.score).to.be.above(0.5);
    chai.expect(prediction.sentiment.label).to.eql("positive");
    chai.expect(prediction.sentiment.score).to.be.above(0.5);

    var child = topIntent.childApp;
    chai.expect(utterance).to.eql(child.normalizedQuery);
    chai.expect(child.topIntent).to.eql("None");
    chai.expect(Object.keys(child.intents).length).to.eql(1);
    chai.expect(Object.keys(child.entities).length).to.eql(2);
    chai.expect(child.entities["datetimeV2"]).to.be.exist;
    chai.expect(child.entities["$instance"]).to.be.exist;

    var dispatchTopIntent = child.intents[child.topIntent];
    chai.expect(dispatchTopIntent.score).to.be.above(0.5);
    chai.expect(child.sentiment.label).to.eql("positive")
    chai.expect(child.sentiment.score).to.be.above(0.5);
});





// Prediction_Version
client.prediction.getVersionPrediction(
    appId,
    versionId,
    {
        query: utterance,
        options: {
            datetimeReference: new Date("2019-01-01"),
            overridePredictions: true
        },
        externalEntities: [{
            entityName: "simple",
            startIndex: 26,
            entityLength: 4,
            resolution: externalResolution
        }],
        dynamicLists: [{
            listEntityName: "list", requestLists: [{
                name: "test",
                canonicalForm: "testing",
                synonyms: ["this"]
            }]
        }],
    },
    {
        verbose: true,
        showAllIntents: true
    }
).then(result => {
    let prediction = result.prediction;
    chai.expect(utterance).to.eql(result.query);
    chai.expect(utterance).to.eql(prediction.normalizedQuery);
    chai.expect(prediction.topIntent).to.eql("intent");
    chai.expect(Object.keys(prediction.intents).length).to.eql(2);
    chai.expect(Object.keys(prediction.entities).length).to.eql(4);
    chai.expect(prediction.entities["datetimeV2"]).to.be.exist;
    chai.expect(prediction.entities["simple"]).to.be.exist;
    chai.expect(prediction.entities["list"]).to.be.exist;
    chai.expect(prediction.entities["$instance"]).to.be.exist;

    var actualResolution = prediction.entities["simple"][0];
    chai.expect(externalResolution).to.eql(actualResolution);

    var topIntent = prediction.intents[prediction.topIntent];
    chai.expect(topIntent.score).to.be.above(0.5);
    chai.expect(prediction.sentiment.label).to.eql("positive");
    chai.expect(prediction.sentiment.score).to.be.above(0.5);

    var child = topIntent.childApp;
    chai.expect(utterance).to.eql(child.normalizedQuery);
    chai.expect(child.topIntent).to.eql("None");
    chai.expect(Object.keys(child.intents).length).to.eql(1);
    chai.expect(Object.keys(child.entities).length).to.eql(2);
    chai.expect(child.entities["datetimeV2"]).to.be.exist;
    chai.expect(child.entities["$instance"]).to.be.exist;

    var dispatchTopIntent = child.intents[child.topIntent];
    chai.expect(dispatchTopIntent.score).to.be.above(0.5);
    chai.expect(child.sentiment.label).to.eql("positive")
    chai.expect(child.sentiment.score).to.be.above(0.5);
});



//Prediction_AppNotFound_ThrowsAPIErrorException
client.prediction.getSlotPrediction(
    "7555b7c1-e69c-4580-9d95-1abd6dfa8291",
    "production",
    { query: "this is a test with post" }).catch(err => {
        chai.expect(err.body.error.code).to.eql("NotFound");
    });



client.prediction.getSlotPrediction(appId, "production", { query: "" }).catch(err => {
    chai.expect(err.body.error.code).to.eql("BadArgument");
});