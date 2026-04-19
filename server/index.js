const express = require('express');
const cors = require('cors');
const multer = require('multer');
const ModelClient = require('@azure-rest/ai-inference').default;
const { AzureKeyCredential } = require('@azure/core-auth');
require('dotenv').config();

const app = express();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

const client = ModelClient(
  'https://models.inference.ai.azure.com',
  new AzureKeyCredential(process.env.GITHUB_TOKEN)
);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/generate-report', upload.array('images', 5), async (req, res) => {
  try {
    const { notes } = req.body;

    const response = await client.path('/chat/completions').post({
      body: {
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: `You are an experienced construction site manager writing a formal daily report.

Convert the following rough field notes into a structured, professional daily site report.

Divide the report into these exact sections:
1. **Progress** - What work was completed today
2. **Issues** - Any problems, blockers, or delays
3. **HSE (Health, Safety & Environment)** - Safety observations, incidents, compliance notes
4. **Comments** - Any other relevant notes or next steps

Rules:
- Be concise and professional
- If a section has no information, write "Nothing to report"
- If HSE information is missing, flag it with: "No HSE information provided - please verify"
- Today's date: ${new Date().toLocaleDateString('nb-NO')}

Field notes:
${notes}`
        }],
        max_tokens: 1024
      }
    });

    const report = response.body.choices[0].message.content;
    res.json({ report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

app.post('/improve-report', async (req, res) => {
  try {
    const { report } = req.body;

    const response = await client.path('/chat/completions').post({
      body: {
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: `Make this construction site daily report more professional and formal.
Keep the same structure and sections. Do not add information that isn't there.

Report:
${report}`
        }],
        max_tokens: 1024
      }
    });

    res.json({ report: response.body.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to improve report' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));