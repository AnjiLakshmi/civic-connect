import { Request, Response } from 'express';
import Complaint from '../models/Complaint';
import { getSuggestion } from '../utils/aiSuggestion';
import { createNotification } from './notificationController';
import aiService from '../services/aiService';

export const createComplaint = async (req: any, res: Response) => {
  try {
    const data = req.body;
    data.citizen = req.userId;
    
    // Get AI suggestion
    const suggestion = getSuggestion(data.issueType);
    data.aiSuggestedDept = suggestion.dept;
    data.priority = suggestion.priority;
    
    // Parse coordinates
    data.lat = parseFloat(data.lat);
    data.lng = parseFloat(data.lng);
    
    // Handle image upload
    if (req.file) {
      data.imageUrl = '/uploads/' + req.file.filename;
    }
    
    // Find nearby complaints for duplicate detection
    const nearbyComplaints = await aiService.findNearbyComplaints(
      data.lat,
      data.lng,
      data.issueType
    );
    
    // Set nearby count and check for emergency
    data.nearbyCount = nearbyComplaints.length + 1;
    data.isEmergency = data.nearbyCount >= 5;
    
    // Group duplicate complaints
    const duplicateGroup = await aiService.groupNearbyComplaints({
      lat: data.lat,
      lng: data.lng,
      issueType: data.issueType,
    } as any);
    data.duplicateGroup = duplicateGroup;
    
    // Calculate estimated resolution time
    data.estimatedResolutionDays = aiService.estimateResolutionTime(
      data.priority,
      suggestion.dept
    );
    
    // Create complaint
    const complaint = new Complaint(data);
    await complaint.save();
    
    // Update nearby complaint counts
    await aiService.updateNearbyComplaintCounts(data.lat, data.lng, data.issueType);
    
    res.json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const getComplaints = async (req: any, res: Response) => {
  try {
    const { role, userId } = req;
    let query: any = {};
    if (role === 'citizen') query.citizen = userId;
    if (role === 'bbmp' || role === 'bescom') query.assignedDept = role.toUpperCase();
    const complaints = await Complaint.find(query).populate('citizen', 'name email');
    const formatted = complaints.map(c => ({
      ...c.toObject(),
      citizenName: (c.citizen as any)?.name,
      citizenEmail: (c.citizen as any)?.email,
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const getUserComplaints = async (req: any, res: Response) => {
  try {
    const complaints = await Complaint.find({ citizen: req.params.userId }).populate('citizen', 'name email');
    const formatted = complaints.map(c => ({
      ...c.toObject(),
      citizenName: (c.citizen as any)?.name,
      citizenEmail: (c.citizen as any)?.email,
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const getAllComplaints = async (req: Request, res: Response) => {
  try {
    const complaints = await Complaint.find().populate('citizen', 'name email').sort({ date: -1 });
    const formatted = complaints.map(c => ({
      ...c.toObject(),
      citizenName: (c.citizen as any)?.name,
      citizenEmail: (c.citizen as any)?.email,
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const getDepartmentComplaints = async (req: Request, res: Response) => {
  try {
    const deptParam = req.params.department;
    const dept = typeof deptParam === 'string' ? deptParam.toUpperCase() : 'BBMP';
    const complaints = await Complaint.find({ 
      $or: [{ assignedDept: dept }, { aiSuggestedDept: dept }] 
    }).populate('citizen', 'name email');
    const formatted = complaints.map(c => ({
      ...c.toObject(),
      citizenName: (c.citizen as any)?.name,
      citizenEmail: (c.citizen as any)?.email,
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const assignComplaint = async (req: any, res: Response) => {
  try {
    const { department } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        assignedDept: department, 
        status: 'assigned',
        estimatedResolutionDays: aiService.estimateResolutionTime(
          req.body.priority || 'medium',
          department
        ),
      },
      { new: true }
    ).populate('citizen', 'name email');
    
    if (complaint) {
      // Notify citizen
      await createNotification(
        complaint.citizen._id.toString(),
        `Your complaint about "${complaint.issueType}" at ${complaint.location} has been assigned to ${department}. Expected resolution: ${Math.ceil((complaint as any).estimatedResolutionDays)} days.`,
        complaint._id.toString()
      );
      
      // Notify department
      await createNotification(
        department,
        `New assignment: ${complaint.issueType} at ${complaint.location}. Priority: ${complaint.priority}. Nearby complaints: ${complaint.nearbyCount}`,
        complaint._id.toString(),
        'department'
      );
    }
    res.json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const updateComplaint = async (req: any, res: Response) => {
  try {
    const oldComplaint = await Complaint.findById(req.params.id);
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('citizen', 'name email');
    
    if (oldComplaint && complaint && oldComplaint.status !== complaint.status) {
      let message = '';
      if (complaint.status === 'assigned') {
        message = `Your complaint about "${complaint.issueType}" has been assigned to ${complaint.assignedDept}.`;
      } else if (complaint.status === 'inProgress') {
        message = `Work has started on your complaint about "${complaint.issueType}".`;
      } else if (complaint.status === 'resolved') {
        message = `Your complaint about "${complaint.issueType}" has been resolved by ${complaint.assignedDept}.`;
      }
      if (message) {
        await createNotification(
          (oldComplaint.citizen as any).toString(), 
          message, 
          complaint._id.toString()
        );
      }
    }
    res.json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const resolveComplaint = async (req: any, res: Response) => {
  try {
    const updateData: any = {
      status: 'resolved',
      resolvedAt: new Date(),
    };
    
    // Handle proof image upload
    if (req.file) {
      updateData.proofUrl = '/uploads/' + req.file.filename;
    }
    
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('citizen', 'name email');
    
    if (complaint) {
      await createNotification(
        complaint.citizen._id.toString(),
        `Your complaint about "${complaint.issueType}" at ${complaint.location} has been resolved by ${complaint.assignedDept}. Thank you for reporting!`,
        complaint._id.toString()
      );
    }
    res.json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const getEmergencyAlerts = async (req: Request, res: Response) => {
  try {
    const emergencies = await aiService.getEmergencyAlerts();
    res.json(emergencies);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const getHeatmapData = async (req: Request, res: Response) => {
  try {
    const heatmapData = await aiService.getHeatmapData();
    res.json(heatmapData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
