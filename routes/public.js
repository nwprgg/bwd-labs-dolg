import express from "express";

const router = express.Router();

router.get("/events", (req, res) => {
  res.json([
    { id: 1, title: "Событие 1" },
    { id: 2, title: "Событие 2" },
  ]);
});

export default router;
