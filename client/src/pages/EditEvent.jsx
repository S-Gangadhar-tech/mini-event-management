import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import EventService from '../services/eventService';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaCloudArrowUp, FaPenNib } from 'react-icons/fa6';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Extracted fetchMyEvents and getEventDetails correctly
    const { fetchMyEvents, getEventDetails } = useEvents();

    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        capacity: '',
        eventDate: '',
        eventTime: ''
    });

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                // Using the context helper we just created
                const event = await getEventDetails(id);

                if (event) {
                    setFormData({
                        title: event.title || '',
                        description: event.description || '',
                        location: event.location || '',
                        capacity: event.capacity || '',
                        eventDate: event.eventDate || '',
                        eventTime: event.eventTime || ''
                    });
                    setPreview(event.ImageUrl);
                }
            } catch (err) {
                // Error toast is already handled in Context, just navigate
                navigate('/dashboard/my-events');
            } finally {
                setLoading(false);
            }
        };
        fetchEventData();
    }, [id, navigate, getEventDetails]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        const data = new FormData();
        // Only append image if a new file was selected
        if (file) data.append("image", file);

        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("location", formData.location);
        data.append("capacity", formData.capacity);
        data.append("eventDate", formData.eventDate);
        data.append("eventTime", formData.eventTime);

        try {
            // Note: Since you're passing id through URL, this matches: 
            // router.put("/:eventId", jwtAuthMiddleware, upload.single("image"), updateEvent);
            await EventService.update(id, data);

            toast.success("Event updated successfully!");

            // Refresh the myEvents list in context
            await fetchMyEvents();

            navigate('/dashboard/my-events');
        } catch (err) {
            // Error typically handled by axios interceptor
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500 font-medium">Loading event data...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-gray-500 font-bold hover:text-blue-600 transition group"
            >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                Cancel & Back
            </button>

            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden md:flex">
                {/* Image Preview Section */}
                <div className="md:w-1/3 bg-slate-50 p-6 flex flex-col items-center justify-center border-r border-gray-100">
                    <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-inner bg-gray-200 mb-6 group relative">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white text-xs font-bold">New Image Selected</p>
                        </div>
                    </div>
                    <label className="w-full cursor-pointer bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-200 text-sm font-bold text-blue-600 hover:bg-blue-50 transition text-center">
                        Change Event Image
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                    <p className="mt-3 text-[10px] text-gray-400 uppercase tracking-widest font-bold">Max file size: 5MB</p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleUpdate} className="md:w-2/3 p-8 space-y-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                            <FaPenNib className="text-blue-600" /> Edit Event
                        </h2>
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-tighter">
                            ID: {id.slice(-6)}
                        </span>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Event Title</label>
                        <input type="text" value={formData.title} required placeholder="e.g. Workshop"
                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition"
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Date</label>
                            <input type="date" value={formData.eventDate} required
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition"
                                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Time</label>
                            <input type="time" value={formData.eventTime} required
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition"
                                onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Location</label>
                            <input type="text" value={formData.location} required placeholder="Venue"
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition"
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Capacity</label>
                            <input type="number" value={formData.capacity} required placeholder="Seats"
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition"
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Description</label>
                        <textarea value={formData.description} required rows="3" placeholder="Describe the event..."
                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none resize-none transition"
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>

                    <button type="submit" disabled={isUpdating}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:bg-gray-400 active:scale-95">
                        <FaCloudArrowUp /> {isUpdating ? "Processing Changes..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditEvent;