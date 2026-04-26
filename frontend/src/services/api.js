// const API_URL = "http://localhost:8000";

// export const loginUser = async (data) => {
//   const res = await fetch(`${API_URL}/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   return res.json();
// };

// export const registerUser = async (data) => {
// //   const res = await fetch(`${API_URL}/register`, {
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //     body: JSON.stringify(data),
// //   });

// //   return res.json();
// // };/
// export const createComplaint = async (data) => {
//   const token = localStorage.getItem("token");

//   const res = await fetch("http://localhost:8000/complaints", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: token,
//     },
//     body: JSON.stringify(data),
//   });

//   return res.json();
// };

const API_URL = "http://localhost:8000";

// ✅ LOGIN
export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

// ✅ REGISTER (MISSING THA → ADD KIYA)
export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

// CREATE COMPLAINT
export const createComplaint = async (data) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/complaint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const getUserComplaints = async (userId) => {
  const res = await fetch(`${API_URL}/user/complaints/${userId}`);
  return res.json();
};

export const getAllComplaints = async () => {
  try {
    const res = await fetch(`${API_URL}/admin/complaints`);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching all complaints:', error);
    throw error;
  }
};

export const updateComplaint = async (complaintId, status, solution) => {
  const res = await fetch(`${API_URL}/complaint/${complaintId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status, solution }),
  });
  return res.json();
};

export const cancelComplaint = async (complaintId) => {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_URL}/complaint/${complaintId}/cancel`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ status: 'Cancelled' }),
  });

  return res.json();
};

export const updatePassword = async (email, newPassword) => {
  const res = await fetch(`${API_URL}/update-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, new_password: newPassword }),
  });

  return res.json();
};

export const deleteComplaint = async (complaintId) => {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_URL}/complaint/${complaintId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    }
  });

  return res.json();
};