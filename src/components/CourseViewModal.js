
import React, { useState, useEffect } from 'react';

const CourseViewModal = ({ isOpen, onClose, courseId }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token'); 

        const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
        const response = await fetch(`${baseURL}/api/courses/${courseId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const htmlContent = await response.text();
          console.error('Received HTML instead of JSON:', htmlContent);
          throw new Error('Server returned HTML instead of JSON. Check if the API endpoint exists.');
        }

        const data = await response.json();
        setCourse(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && courseId) {
      fetchCourse();
    }
  }, [isOpen, courseId]);

  const handleClose = () => {
    setCourse(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
   
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold">Course Details</h2>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-lg text-red-600">{error}</p>
            </div>
          ) : course ? (
            <div className="space-y-6">
          
              {course.coverImage && (
                <div className="w-full">
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src={course.coverImage} 
                      alt={course.title}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/800x300/f3f4f6/9ca3af?text=Course+Image';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {course.title}
                </h1>
              </div>

              {/* Course Tags */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 font-semibold">
                  {course.category}
                </span>
                {course.subcategory && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold">
                    {course.subcategory}
                  </span>
                )}
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 font-semibold">
                  {course.level}
                </span>
              </div>

         
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {course.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-indigo-50 p-6 rounded-xl text-center">
                  <div className="text-indigo-600 mb-2">
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-indigo-800 mb-1">Category</h4>
                  <p className="text-indigo-700">{course.category}</p>
                </div>

                {course.subcategory && (
                  <div className="bg-gray-50 p-6 rounded-xl text-center">
                    <div className="text-gray-600 mb-2">
                      <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-700 mb-1">Subcategory</h4>
                    <p className="text-gray-600">{course.subcategory}</p>
                  </div>
                )}

                <div className="bg-green-50 p-6 rounded-xl text-center">
                  <div className="text-green-600 mb-2">
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-green-800 mb-1">Level</h4>
                  <p className="text-green-700">{course.level}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No course data available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            {course && (
              <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
                Edit Course
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewModal;