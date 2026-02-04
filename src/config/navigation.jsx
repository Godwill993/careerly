import {
    FaHome, FaChartPie, FaRobot,
    FaUserFriends, FaCog
} from 'react-icons/fa';

export const getMenuItems = (userRole) => {
    const dashboardPath = userRole ? `/${userRole}-dashboard` : '/login';

    return [
        { id: 1, label: 'Dashboard', icon: <FaHome />, path: dashboardPath },
        { id: 3, label: 'Internships', icon: <FaChartPie />, path: '/internships' },
        { id: 4, label: 'AI Assistant', icon: <FaRobot />, path: '/ai-assistant' },
        { id: 5, label: 'Rankings', icon: <FaUserFriends />, path: '/rankings' },
        { id: 6, label: 'Settings', icon: <FaCog />, path: '/settings' },
    ];
};
