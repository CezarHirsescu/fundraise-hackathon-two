import Transcript from "./models/Transcript"
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const initTranscriptWatcher = () => {
  console.log("🔍 Initializing Transcript Watcher...");

  const changeStream = Transcript.watch();

  changeStream.on("change", async (change) => {
    console.log("📝 Transcript change detected:", change.operationType);
    try {
      let shouldProcess = false;
      let docId;

      // Check if status changed to 'completed' on update
      if (change.operationType === "update") {
        const updatedFields = change.updateDescription?.updatedFields;
        if (updatedFields?.status === "completed") {
          shouldProcess = true;
          docId = change.documentKey._id;
          console.log(`✅ Transcript ${docId} status changed to 'completed'`);
        }
      }

      // Also handle inserts that are already completed (edge case)
      if (change.operationType === "insert" && change.fullDocument?.status === "completed") {
        shouldProcess = true;
        docId = change.fullDocument._id;
        console.log(`✅ Transcript ${docId} inserted with 'completed' status`);
      }

      if (!shouldProcess) return;

      const transcript = await Transcript.findById(docId);

      if (!transcript) {
        console.log(`⚠️ Transcript ${docId} not found, skipping.`);
        return;
      }

      if (!transcript.transcriptText) {
        console.log(`⚠️ Transcript ${docId} has no transcriptText, skipping summarization.`);
        return;
      }

      console.log(`🤖 Calling OpenAI to summarize transcript ${docId}...`);

      // Call OpenAI to summarize
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an assistant that summarizes meeting transcripts clearly and concisely." },
          { role: "user", content: transcript.transcriptText },
        ],
      });

      const summary = response.choices[0]?.message.content;

      // Save summary back to DB
      if (summary) {
        transcript.summaryText = summary;
        await transcript.save();
        console.log(`Transcript ${docId} summarized and updated.`);
      } else {
        console.log(`Transcript ${docId} received empty summary from OpenAI.`);
      }
    } catch (err) {
      console.error("Error in transcript watcher:", err);
    }
  });

  changeStream.on("error", (error) => {
    console.error("Transcript watcher stream error:", error);
  });

  console.log("Transcript Watcher initialized successfully");
};
