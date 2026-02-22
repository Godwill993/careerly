import {
    FaHome, FaChartPie, FaRobot,
    FaUserFriends, FaCog
} from 'react-icons/fa';

export const getMenuItems = (userRole) => {
    switch(userRole) {
        case 'student':
            return [
                { id: 1, label: 'Dashboard', icon: <FaHome />, path: '/student-dashboard' },
                { id: 2, label: 'Job Board', icon: <FaChartPie />, path: '/internships' },
                { id: 3, label: 'AI Assistant', icon: <FaRobot />, path: '/ai-assistant' },
                { id: 4, label: 'Rankings', icon: <FaUserFriends />, path: '/rankings' },
                { id: 5, label: 'Settings', icon: <FaCog />, path: '/settings' },
            ];
        case 'company':
            return [
                { id: 1, label: 'Dashboard', icon: <FaHome />, path: '/company-dashboard' },
                { id: 2, label: 'Manage Postings', icon: <FaChartPie />, path: '/company/postings' }, // Assuming this route exists or we will use CompanyDashboard
                { id: 3, label: 'Talent Search', icon: <FaUserFriends />, path: '/rankings' },
                { id: 4, label: 'AI Assistant', icon: <FaRobot />, path: '/ai-assistant' },
                { id: 5, label: 'Settings', icon: <FaCog />, path: '/settings' },
            ];
        case 'school':
            return [
                { id: 1, label: 'Dashboard', icon: <FaHome />, path: '/school-dashboard' },
                { id: 2, label: 'AI Assistant', icon: <FaRobot />, path: '/ai-assistant' },
                { id: 3, label: 'Settings', icon: <FaCog />, path: '/settings' },
            ];
        default:
            return []; // Unauthenticated or missing role
    }
};
