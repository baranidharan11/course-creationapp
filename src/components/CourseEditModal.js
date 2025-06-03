import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCourse, clearUpdateStatus } from '../redux/courseSlice';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CourseEditModal = ({ course, onClose, onSuccess, open }) => {
    const dispatch = useDispatch();
    const { updateLoading, updateError } = useSelector(state => state.courses);
    const { user } = useSelector(state => state.auth);

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
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        if (course) {
            setFormData({
                title: course.title || '',
                description: course.description || '',
                level: course.level || 'Beginner',
                category: course.category || 'WebDevelopment',
                subcategory: course.subcategory || '',
                coverImage: course.coverImage || ''
            });
            setImagePreview(course.coverImage || '');
        }
    }, [course]);

    useEffect(() => {
        if (updateError) {
            setSnackbarMessage(updateError);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            dispatch(clearUpdateStatus());
        }
    }, [updateError, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                setFormData(prev => ({
                    ...prev,
                    coverImage: result
                }));
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!course?._id) {
            setSnackbarMessage('Course ID is missing');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            const resultAction = await dispatch(updateCourse({
                courseId: course._id,
                courseData: formData
            }));

            if (resultAction.meta && resultAction.meta.requestStatus === 'fulfilled') {
                setSnackbarMessage('Course updated successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);

                setTimeout(() => {
                    onSuccess && onSuccess();
                    onClose();
                }, 1500);
            } else {
                const errorMsg = resultAction.error?.message || 'Update failed';
                setSnackbarMessage(errorMsg);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        } catch (error) {
            console.error('Update failed:', error);
            setSnackbarMessage('Failed to update course');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleClose = () => {
        dispatch(clearUpdateStatus());
        if (onClose) onClose();
    };

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto grid md:grid-cols-[1fr,2fr] gap-0">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 flex flex-col items-center justify-center text-white relative">
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all w-8 h-8 flex items-center justify-center text-white font-bold"
                        >
                            ×
                        </button>
                        <div className="text-center mb-6">
                            <div className="w-32 h-32 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Course preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-4xl">📚</div>
                                )}
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                {formData.title || 'Course Title'}
                            </h3>
                            <div className="space-y-1 text-sm text-indigo-100">
                                <p><span className="font-semibold">Level:</span> {formData.level}</p>
                                <p><span className="font-semibold">Category:</span> {formData.category}</p>
                                {formData.subcategory && (
                                    <p><span className="font-semibold">Subcategory:</span> {formData.subcategory}</p>
                                )}
                            </div>
                        </div>
                        <div className="mt-auto text-center">
                            <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-xl mb-2">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <p className="text-sm font-semibold">{user?.name}</p>
                            <p className="text-xs text-indigo-100">{user?.email}</p>
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Edit Course
                            </h2>
                            <p className="text-gray-600">Update your course details</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Course Title
                                </label>
                                <input
                                    name="title"
                                    type="text"
                                    placeholder="Enter course title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all border-gray-300"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    placeholder="Course description"
                                    rows={5}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none border-gray-300"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Level
                                </label>
                                <select
                                    name="level"
                                    value={formData.level}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all border-gray-300"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all border-gray-300"
                                >
                                    <option value="WebDevelopment">Web Development</option>
                                    <option value="MobileDevelopment">Mobile Development</option>
                                    <option value="DataScience">Data Science</option>
                                    <option value="Design">Design</option>
                                    <option value="Marketing">Marketing</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Subcategory (optional)
                                </label>
                                <input
                                    name="subcategory"
                                    type="text"
                                    placeholder="Enter subcategory"
                                    value={formData.subcategory}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Cover Image
                                </label>
                                <input
                                    name="coverImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full text-gray-600"
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="mt-3 w-48 h-32 object-cover rounded-md border border-gray-300"
                                    />
                                )}
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={updateLoading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
                                >
                                    {updateLoading ? 'Updating...' : 'Update Course'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
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
        </>
    );
};

export default CourseEditModal;
