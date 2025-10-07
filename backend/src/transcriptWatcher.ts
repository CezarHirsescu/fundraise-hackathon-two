import Transcript from "./models/Transcript";
import ActionItem from "./models/ActionItem";
import OpenAI from "openai";
import mongoose from "mongoose";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const initTranscriptWatcher = () => {
  const changeStream = Transcript.watch();

  changeStream.on("change", async (change) => {
    try {
      let shouldProcess = false;
      let docId;

      // Check if status changed to 'completed' on update
      if (change.operationType === "update") {
        const updatedFields = change.updateDescription?.updatedFields;
        if (updatedFields?.status === "completed") {
          shouldProcess = true;
          docId = change.documentKey._id;
          console.log(`Transcript ${docId} status changed to 'completed'`);
        }
      }

      // Also handle inserts that are already completed (edge case)
      if (
        change.operationType === "insert" &&
        change.fullDocument?.status === "completed"
      ) {
        shouldProcess = true;
        docId = change.fullDocument._id;
        console.log(`Transcript ${docId} inserted with 'completed' status`);
      }

      if (!shouldProcess) return;

      const transcript = await Transcript.findById(docId);

      if (!transcript) {
        console.log(`⚠️ Transcript ${docId} not found, skipping.`);
        return;
      }

      if (!transcript.transcriptText) {
        console.log(
          `⚠️ Transcript ${docId} has no transcriptText, skipping summarization.`
        );
        return;
      }

      // --- First call: Summarization ---
      const summaryRes = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an assistant that summarizes meeting transcripts clearly and concisely. Keep the summary to one paragraph, focusing on the sentiment and key points.",
          },
          { role: "user", content: transcript.transcriptText },
        ],
      });

      const summary = summaryRes.choices[0]?.message.content;

      // Save summary back to DB
      if (summary) {
        transcript.summaryText = summary;
        await transcript.save();
        console.log(`Transcript ${docId} summarized and updated.`);
      } else {
        console.log(`Transcript ${docId} received empty summary from OpenAI.`);
      }

      // --- Second call: Action items ---
      // Skip if action items already exist
      if (transcript.actionItems && transcript.actionItems.length > 0) {
        return;
      }

      const actionItemsRes = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Extract actionable tasks from the transcript. Return a JSON object with this exact structure:
            {
            "items": [
                {
                "text": "Clear, actionable task description",
                "priority": "High" | "Medium" | "Low",
                "status": "To Do" | "Pending" | "Completed",
                "dueDate": "ISO datetime string (optional)",
                "assignee": "Person assigned (optional)"
                }
            ]
            }

            Guidelines:
            - text: Should be clear and actionable.
            - priority: Assess urgency and importance based on the number of times mentioned in the transcript, or if a deadline is mentioneed.(High/Medium/Low)
            - status: Default to "To Do" unless explicitly mentioned as in progress or completed.
            - dueDate: Only include if a specific date/time is mentioned.
            - assignee: Only include if a specific person is mentioned.

            Return ONLY valid JSON, no additional text.`,
          },
          { role: "user", content: transcript.transcriptText },
        ],
      });

      console.log(
        "Raw action items response:",
        actionItemsRes.choices[0]?.message.content
      );

      try {
        const parsedResponse = JSON.parse(
          actionItemsRes.choices[0]?.message.content || '{"items":[]}'
        );
        const extractedItems = parsedResponse.items || [];

        if (extractedItems.length > 0) {
          // Create ActionItem documents in the database
          const actionItemDocs = await ActionItem.insertMany(
            extractedItems.map((item: any) => ({
              meetingId: new mongoose.Types.ObjectId(transcript._id),
              text: item.text,
              priority: item.priority || "Medium",
              status: item.status || "To Do",
              dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
              assignee: item.assignee,
            }))
          );

          // Store the ActionItem IDs in the transcript
          transcript.actionItems = actionItemDocs.map((doc) =>
            doc._id.toString()
          );
          await transcript.save();

          console.log(
            `✅ Created ${actionItemDocs.length} action items for transcript ${docId}`
          );
        } else {
          console.log(`ℹ️ No action items extracted from transcript ${docId}`);
        }
      } catch (error) {
        console.error("Error parsing or creating action items:", error);
        transcript.actionItems = [];
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
