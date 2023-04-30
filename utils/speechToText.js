const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs-extra');
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function createTranscription(stream) {
    try {
        const response = await openai.createTranscription(
          fs.createReadStream(stream),
            "whisper-1"
        );
        await fs.unlink(stream);
        return response.data.text;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports = {
  createTranscription,
};