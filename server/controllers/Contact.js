import Contact from "../models/Contact.js";

export const submitContactQuery = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required" });
    }
    const query = await Contact.create({ name, email, subject: subject || "", message });
    return res.status(201).json({ message: "Query submitted successfully", id: query._id });
  } catch (err) {
    next(err);
  }
};
