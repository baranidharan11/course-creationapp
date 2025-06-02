import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CourseForm = () => {
    const { user, token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        level: 'Beginner',
        category: 'WebDevelopment',
        subcategory: '',
        coverImage: ''
    });

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:3000/api/courses/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to create course');

            setSnackbarMessage('Course created successfully');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            setFormData({
                title: '',
                description: '',
                level: 'Beginner',
                category: 'WebDevelopment',
                subcategory: '',
                coverImage: ''
            });
        } catch (err) {
            setSnackbarMessage(err.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center p-6 relative">
            <div className="absolute top-4 right-4">
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl grid md:grid-cols-2 gap-0 overflow-hidden">
                {/* LEFT SIDE - Profile */}
                <div className="bg-gray-100 p-8 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 bg-blue-400 text-white flex items-center justify-center text-3xl rounded-full mb-4">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">{user?.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{user?.email}</p>
                    <button
                        onClick={() => navigate('/my-courses')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        My Courses
                    </button>


                </div>

                {/* RIGHT SIDE - Course Form */}
                <form
                    onSubmit={handleSubmit}
                    className="p-8"
                >
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                        Create Course
                    </h2>

                    <input
                        name="title"
                        type="text"
                        placeholder="Course Title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        required
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                    />

                    <select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        required
                        className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                    >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                    </select>

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                    >
                        <option>WebDevelopment</option>
                        <option>CyberSecurity</option>
                        <option>Data Management</option>
                        <option>Data Analyst</option>
                        <option>Data Science</option>
                        <option>Embedded Systems</option>
                    </select>

                    <input
                        name="subcategory"
                        type="text"
                        placeholder="Subcategory"
                        value={formData.subcategory}
                        onChange={handleChange}
                        className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                    />

                    <input
                        name="coverImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setFormData((prev) => ({
                                    ...prev,
                                    coverImage: reader.result,
                                }));
                            };
                            if (file) reader.readAsDataURL(file);
                        }}
                        className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Create Course
                    </button>
                </form>
            </div>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default CourseForm;
