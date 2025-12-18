import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { FaCloudArrowUp, FaRegImage, FaLocationDot, FaUsers, FaCalendarDay, FaClock } from 'react-icons/fa6';
import BackButton from '../components/events/BackButton';
const NewEvent = () => {
    const { createEvent } = useEvents();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        title: "", description: "", location: "",
        capacity: "", eventDate: "", eventTime: ""
    });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        // Create a local URL for the preview
        setPreview(URL.createObjectURL(selectedFile));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Construct FormData for multipart upload
        const data = new FormData();
        data.append("image", file); // The key 'image' must match your backend Multer config
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("location", formData.location);
        data.append("capacity", formData.capacity);
        data.append("eventDate", formData.eventDate);
        data.append("eventTime", formData.eventTime);

        try {
            await createEvent(data);
            navigate("/dashboard/events");
        } catch (err) {
            // Error handled by interceptor
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
            <BackButton />
            <div className="md:flex">
                {/* Left Side: Image Upload/Preview */}
                <div className="md:w-1/3 bg-slate-50 border-r border-gray-100 flex flex-col items-center justify-center p-6">
                    {preview ? (
                        <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                onClick={() => { setFile(null); setPreview(null); }}
                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full text-xs"
                            > Remove </button>
                        </div>
                    ) : (
                        <label className="w-full aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-3xl cursor-pointer hover:bg-gray-100 transition">
                            <FaRegImage size={40} className="text-gray-400 mb-2" />
                            <span className="text-xs font-bold text-gray-500">Upload Event Image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} required />
                        </label>
                    )}
                    <p className="mt-4 text-[10px] text-gray-400 text-center uppercase tracking-widest">Supports JPG, PNG (Max 5MB)</p>
                </div>

                {/* Right Side: Form Details */}
                <form onSubmit={handleSubmit} className="md:w-2/3 p-8 space-y-5">
                    <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                        <FaCloudArrowUp className="text-blue-600" /> Event Details
                    </h2>

                    <input type="text" placeholder="Event Title" required
                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })} />

                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Location" required
                            className="p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })} />

                        <input type="number" placeholder="Capacity" required
                            className="p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-[10px] font-bold text-gray-400 ml-1 mb-1 uppercase tracking-wider">Date</label>
                            <input type="date" required
                                className="p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none"
                                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-[10px] font-bold text-gray-400 ml-1 mb-1 uppercase tracking-wider">Time</label>
                            <input type="time" required
                                className="p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none"
                                onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })} />
                        </div>
                    </div>

                    <textarea placeholder="Event Description..." required rows="3"
                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

                    <button
                        type="submit"
                        disabled={loading || !file}
                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 disabled:bg-gray-300 transition-all active:scale-95"
                    >
                        {loading ? "Uploading to Cloudinary..." : "Create Event"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewEvent;