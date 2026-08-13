const express = require("express");
const {
  getStats, getAllUsers, setUserBlocked, getAllJobs, removeJob, verifyCompany,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();
router.use(protect, authorize("admin"));

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.put("/users/:id/block", setUserBlocked);
router.get("/jobs", getAllJobs);
router.delete("/jobs/:id", removeJob);
router.put("/recruiters/:id/verify", verifyCompany);

module.exports = router;
