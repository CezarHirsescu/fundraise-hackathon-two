import express from "express"
import {
	getMeetings,
	getMeeting,
} from "../controllers/meetingController"

const router = express.Router()

// Get all meetings with optional filters
router.get("/", getMeetings)

// Get single meeting by ID
router.get("/:id", getMeeting)

export default router
