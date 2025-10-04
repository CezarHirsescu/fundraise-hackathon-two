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

		res.json({
			success: true,
			data: transcripts,
			count: transcripts.length,
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

		res.json({
			success: true,
			data: transcript,
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
