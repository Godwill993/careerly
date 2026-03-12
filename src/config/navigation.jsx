import {
    FaHome, FaChartPie, FaRobot,
    FaUserFriends, FaCog, FaFileSignature, FaUserCheck, FaComments
} from 'react-icons/fa';

export const getMenuItems = (userRole, userId) => {
    switch(userRole) {
        case 'student':
            return [
                { id: 1, label: 'Dashboard', icon: <FaHome />, path: '/student-dashboard' },
                { id: 2, label: 'Job Board', icon: <FaChartPie />, path: '/internships' },
                { id: 3, label: 'Messages', icon: <FaComments />, path: '/messages' },
                { id: 4, label: 'AI Assistant', icon: <FaRobot />, path: '/ai-assistant' },
                { id: 5, label: 'My Portfolio', icon: <FaFileSignature />, path: `/portfolio/${userId}` }, // Added Verified Portfolio
                { id: 6, label: 'Ratings', icon: <FaUserFriends />, path: '/ratings' },
                { id: 7, label: 'Settings', icon: <FaCog />, path: '/settings' },
            ];
        case 'company':
            return [
                { id: 1, label: 'Dashboard', icon: <FaHome />, path: '/company-dashboard' },
                { id: 2, label: 'Manage Postings', icon: <FaChartPie />, path: '/company/postings' }, // Assuming this route exists or we will use CompanyDashboard
                { id: 3, label: 'Messages', icon: <FaComments />, path: '/messages' },
                { id: 4, label: 'Validate Logs', icon: <FaUserCheck />, path: '/company/validations' }, // Added validation page
                { id: 5, label: 'Talent Search', icon: <FaUserFriends />, path: '/ratings' },
                { id: 6, label: 'AI Assistant', icon: <FaRobot />, path: '/ai-assistant' },
                { id: 7, label: 'Settings', icon: <FaCog />, path: '/settings' },
            ];
        case 'school':
            return [
                { id: 1, label: 'Dashboard', icon: <FaHome />, path: '/school-dashboard' },
                { id: 2, label: 'Messages', icon: <FaComments />, path: '/messages' },
                { id: 3, label: 'AI Assistant', icon: <FaRobot />, path: '/ai-assistant' },
                { id: 4, label: 'Settings', icon: <FaCog />, path: '/settings' },
            ];
        default:
            return []; // Unauthenticated or missing role
    }
};
