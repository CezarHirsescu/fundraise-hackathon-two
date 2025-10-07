import { Request, Response } from "express";
import OpenAIService from "../services/openaiService";
import Transcript from "../models/Transcript";
import ActionItem from "../models/ActionItem";

/**
 * Stream chat responses with meeting context
 * POST /api/chat/stream
 */
export const streamChat = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { meetingId, messages } = req.body;

    // Validate input
    if (!meetingId || !messages || !Array.isArray(messages)) {
      res.status(400).json({
        success: false,
        error: "meetingId and messages array are required",
      });
      return;
    }

    // Get meeting context (transcript + action items)
    const transcript = await Transcript.findOne({
      sessionId: meetingId,
    }).select("transcriptText summary");

    if (!transcript) {
      res.status(404).json({
        success: false,
        error: "Meeting not found",
      });
      return;
    }

    const actionItems = await ActionItem.find({
      meetingId,
    }).select("text priority status");

    // Build meeting context
    const meetingContext = OpenAIService.buildMeetingContext(
      "Meeting Discussion",
      new Date(),
      transcript.summaryText || transcript.transcriptText || "",
      actionItems.map((item) => ({
        text: item.text,
        priority: item.priority,
        status: item.status,
      }))
    );

    // Set up SSE headers
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Stream the response
    const stream = await OpenAIService.streamChat(meetingContext, messages);

    for await (const chunk of stream.textStream) {
      res.write(chunk);
    }

    res.end();
  } catch (error: any) {
    console.error("Error in streamChat:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to stream chat response",
      });
    }
  }
};
