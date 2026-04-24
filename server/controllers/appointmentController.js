export const createAppointment = async (req, res) => {
  res.status(200).json({ success: true, message: 'Appointment created' });
};

export const getUserAppointments = async (req, res) => {
  res.status(200).json({ success: true, data: [] });
};

export const getAppointmentById = async (req, res) => {
  res.status(200).json({ success: true, data: null });
};

export const updateAppointment = async (req, res) => {
  res.status(200).json({ success: true, message: 'Appointment updated' });
};

export const cancelAppointment = async (req, res) => {
  res.status(200).json({ success: true, message: 'Appointment cancelled' });
};

export const getAvailableSlots = async (req, res) => {
  res.status(200).json({ success: true, data: [] });
};