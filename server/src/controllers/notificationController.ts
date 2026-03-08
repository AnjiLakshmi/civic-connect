import { Request, Response } from 'express';
import Notification from '../models/Notification';

export const getNotifications = async (req: any, res: Response) => {
  try {
    // Get both citizen and department notifications
    const notes = await Notification.find({
      $or: [
        { recipient: req.userId, recipientType: 'citizen' },
        { recipient: req.role?.toUpperCase(), recipientType: 'department' },
      ],
    }).sort({ date: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const markRead = async (req: any, res: Response) => {
  try {
    const note = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Helper for controllers to create notifications programmatically
export const createNotification = async (
  recipient: string,
  message: string,
  complaintId: string,
  recipientType: 'citizen' | 'department' = 'citizen',
) => {
  const note = new Notification({
    recipient,
    recipientType,
    message,
    complaint: complaintId,
  });
  await note.save();
  return note;
};
