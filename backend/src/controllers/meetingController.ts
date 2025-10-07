import { Request, Response } from "express"
import Transcript from "../models/Transcript"

/**
 * Get all meetings (transcripts) with optional filters
 * GET /api/meetings
 * Query params: status
 */
export const getMeetings = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		// Optional filter by status (?status=completed|processing|failed|partial)
		const { status } = req.query as { status?: string }
		const filter: Record<string, any> = {}
		if (status) filter.status = status

		// Fetch transcripts with populated session data
		const transcripts = await Transcript.find(filter)
			.populate("sessionId")
			.sort({ createdAt: -1 })
			.lean()

		// Map Transcript fields to Meeting interface
		const meetings = transcripts.map((transcript: any) => ({
			...transcript,
			summary: transcript.summaryText, // Map summaryText to summary
			title: transcript.sessionId?.name || transcript.sessionId?.meetingLink || "Untitled Meeting",
			date: transcript.createdAt,
			duration: transcript.duration || 0,
		}))

		res.json({
			success: true,
			data: meetings,
			count: meetings.length,
		})
	} catch (error: any) {
		console.error("Error in getMeetings:", error.message)
		res.status(500).json({
			success: false,
			error: error.message || "Failed to fetch meetings",
		})
	}
}

/**
 * Get a single meeting (transcript) by ID
 * GET /api/meetings/:id
 */
export const getMeeting = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params

		if (!id) {
			res.status(400).json({
				success: false,
				error: "Meeting ID is required",
			})
			return
		}

		// Fetch transcript with populated session data
		const transcript = await Transcript.findById(id)
			.populate("sessionId")
			.lean()

		if (!transcript) {
			res.status(404).json({
				success: false,
				error: "Meeting not found",
			})
			return
		}

		// Map Transcript fields to Meeting interface
		const meeting = {
			...transcript,
			summary: (transcript as any).summaryText, // Map summaryText to summary
			title: (transcript as any).sessionId?.name || (transcript as any).sessionId?.meetingLink || "Untitled Meeting",
			date: (transcript as any).createdAt,
			duration: (transcript as any).duration || 0,
		}

		res.json({
			success: true,
			data: meeting,
		})
	} catch (error: any) {
		console.error("Error in getMeeting:", error.message)

		if (error.message.includes("not found") || error.name === "CastError") {
			res.status(404).json({
				success: false,
				error: "Meeting not found",
			})
			return
		}

		res.status(500).json({
			success: false,
			error: error.message || "Failed to fetch meeting",
		})
	}
}


