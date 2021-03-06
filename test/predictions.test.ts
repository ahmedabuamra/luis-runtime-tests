import * as helper from "../helper";
import * as chai from "chai";


describe("Predections Tests", () => {
    it('should test prediction slot', async done => {
        let client = await helper.luisRuntimeClientInit();
        let result = await client.prediction.getSlotPrediction(
            helper.appId,
            helper.slotName,
            {
                query: helper.utterance,
                options: {
                    datetimeReference: new Date("2019-01-01"),
                    overridePredictions: true
                },
                externalEntities: [{
                    entityName: "simple",
                    startIndex: 26,
                    entityLength: 4,
                    resolution: helper.externalResolution
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
        );
        var prediction = result.prediction;
        chai.expect(helper.utterance).to.eql(result.query);
        chai.expect(helper.utterance).to.eql(prediction.normalizedQuery);
        chai.expect(prediction.topIntent).to.eql("intent");
        chai.expect(Object.keys(prediction.intents).length).to.eql(2);
        chai.expect(Object.keys(prediction.entities).length).to.eql(4);
        chai.expect(prediction.entities["datetimeV2"]).to.be.exist;
        chai.expect(prediction.entities["simple"]).to.be.exist;
        chai.expect(prediction.entities["list"]).to.be.exist;
        chai.expect(prediction.entities["$instance"]).to.be.exist;

        var actualResolution = prediction.entities["simple"][0];
        chai.expect(helper.externalResolution).to.eql(actualResolution);

        var topIntent = prediction.intents[prediction.topIntent];
        chai.expect(topIntent.score).to.be.above(0.5);
        chai.expect(prediction.sentiment.label).to.eql("positive");
        chai.expect(prediction.sentiment.score).to.be.above(0.5);

        var child = topIntent.childApp;
        chai.expect(helper.utterance).to.eql(child.normalizedQuery);
        chai.expect(child.topIntent).to.eql("None");
        chai.expect(Object.keys(child.intents).length).to.eql(1);
        chai.expect(Object.keys(child.entities).length).to.eql(2);
        chai.expect(child.entities["datetimeV2"]).to.be.exist;
        chai.expect(child.entities["$instance"]).to.be.exist;

        var dispatchTopIntent = child.intents[child.topIntent];
        chai.expect(dispatchTopIntent.score).to.be.above(0.5);
        chai.expect(child.sentiment.label).to.eql("positive")
        chai.expect(child.sentiment.score).to.be.above(0.5);
        done();
    });

    it("should test prediction with version", () => {
        return helper.luisRuntimeClientInit().then(client => {
            client.prediction.getVersionPrediction(
                helper.appId,
                helper.versionId,
                {
                    query: helper.utterance,
                    options: {
                        datetimeReference: new Date("2019-01-01"),
                        overridePredictions: true
                    },
                    externalEntities: [{
                        entityName: "simple",
                        startIndex: 26,
                        entityLength: 4,
                        resolution: helper.externalResolution
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
                chai.expect(helper.utterance).to.eql(result.query);
                chai.expect(helper.utterance).to.eql(prediction.normalizedQuery);
                chai.expect(prediction.topIntent).to.eql("intent");
                chai.expect(Object.keys(prediction.intents).length).to.eql(2);
                chai.expect(Object.keys(prediction.entities).length).to.eql(4);
                chai.expect(prediction.entities["datetimeV2"]).to.be.exist;
                chai.expect(prediction.entities["simple"]).to.be.exist;
                chai.expect(prediction.entities["list"]).to.be.exist;
                chai.expect(prediction.entities["$instance"]).to.be.exist;

                var actualResolution = prediction.entities["simple"][0];
                chai.expect(helper.externalResolution).to.eql(actualResolution);

                var topIntent = prediction.intents[prediction.topIntent];
                chai.expect(topIntent.score).to.be.above(0.5);
                chai.expect(prediction.sentiment.label).to.eql("positive");
                chai.expect(prediction.sentiment.score).to.be.above(0.5);

                var child = topIntent.childApp;
                chai.expect(helper.utterance).to.eql(child.normalizedQuery);
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
        });
    });

    it("should test app not found - throws api error exception", () => {
        return helper.luisRuntimeClientInit().then(client => {
            return client.prediction.getSlotPrediction(
                "7555b7c1-e69c-4580-9d95-1abd6dfa8291",
                "production",
                { query: "this is a test with post" }).catch(err => {
                    chai.expect(err.body.error.code).to.eql("NotFound");
                });
        });
    });

    it("should test empty query throws validation excpetion", () => {
        return helper.luisRuntimeClientInit().then(client => {
            return client.prediction.getSlotPrediction(helper.appId, "production", { query: "" }).catch(err => {
                chai.expect(err.body.error.code).to.eql("BadArgument");
            });
        });
    });
});

