import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate('/dashboard')}
            className="m-6 flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-colors group"
        >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
        </button>
    )
}

export default BackButton