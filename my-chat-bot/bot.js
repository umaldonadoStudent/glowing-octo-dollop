const { ActivityHandler, MessageFactory } = require('botbuilder');
const axios = require('axios');
const endpoint = "YOUR_AZURE_ENDPOINT";
const key = "YOUR_KEY";

async function getSentiment(text) {
    const response = await axios.post(
        `${endpoint}/language/:analyze-text?api-version=2023-04-01`,
        {
            kind: "SentimentAnalysis",
            parameters: { modelVersion: "latest" },
            analysisInput: {
                documents: [{ id: "1", language: "en", text: text }]
            }
        },
        { headers: { "Ocp-Apim-Subscription-Key": key, "Content-Type": "application/json" } }
    );
    return response.data.results.documents[0].sentiment;
}

class EchoBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            const replyText = `Echo: ${ context.activity.text }`;
            await context.sendActivity(MessageFactory.text(replyText, replyText));
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello and welcome!';
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.EchoBot = EchoBot;
