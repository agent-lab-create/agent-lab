{\rtf1\ansi\ansicpg932\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import express from "express";\
import \{ Client, middleware \} from "@line/bot-sdk";\
import axios from "axios";\
\
const config = \{\
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,\
  channelSecret: process.env.LINE_CHANNEL_SECRET,\
\};\
\
const client = new Client(config);\
const app = express();\
\
app.post("/webhook", middleware(config), async (req, res) => \{\
  const events = req.body.events;\
\
  for (const event of events) \{\
    if (event.type === "message" && event.message.type === "text") \{\
      const userMessage = event.message.text;\
\
      const claudeResponse = await axios.post(\
        "https://api.anthropic.com/v1/messages",\
        \{\
          model: "claude-3-sonnet-20240229",\
          max_tokens: 200,\
          messages: [\{ role: "user", content: userMessage \}],\
        \},\
        \{\
          headers: \{\
            "x-api-key": process.env.CLAUDE_API_KEY,\
            "anthropic-version": "2023-06-01",\
          \},\
        \}\
      );\
\
      const replyText = claudeResponse.data.content[0].text;\
\
      await client.replyMessage(event.replyToken, \{\
        type: "text",\
        text: replyText,\
      \});\
    \}\
  \}\
\
  res.sendStatus(200);\
\});\
\
app.get("/", (req, res) => \{\
  res.send("agent-lab server is running");\
\});\
\
app.listen(3000, () => \{\
  console.log("Server running on port 3000");\
\});\
}