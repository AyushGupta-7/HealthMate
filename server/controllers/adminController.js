export const getAdminStats = async (req, res) => {
  res.status(200).json({ 
    success: true, 
    data: {
      totalDoctors: 0,
      totalUsers: 0,
      totalAppointments: 0,
      pendingAppointments: 0,
      completedAppointments: 0,
      cancelledAppointments: 0
    }
  });
};

export const getAllDoctors = async (req, res) => {
  res.status(200).json({ success: true, data: [] });
};

export const addDoctor = async (req, res) => {
  res.status(200).json({ success: true, message: 'Doctor added' });
};

export const updateDoctor = async (req, res) => {
  res.status(200).json({ success: true, message: 'Doctor updated' });
};

export const deleteDoctor = async (req, res) => {
  res.status(200).json({ success: true, message: 'Doctor deleted' });
};

export const updateDoctorAvailability = async (req, res) => {
  res.status(200).json({ success: true, message: 'Availability updated' });
};

export const getAllUsers = async (req, res) => {
  res.status(200).json({ success: true, data: [] });
};

export const deleteUser = async (req, res) => {
  res.status(200).json({ success: true, message: 'User deleted' });
};

export const getAllAppointments = async (req, res) => {
  res.status(200).json({ success: true, data: [] });
};

export const updateAppointmentStatus = async (req, res) => {
  res.status(200).json({ success: true, message: 'Status updated' });
};