import React from 'react';
import Navbar from './Navbar';
import LeadList from './LeadList';
const Dashboard = () => {
    return (
        <div>
            <Navbar />
            <div className="dashboard-container">
                <LeadList />
            </div>
        </div>
    );
};
export default Dashboard;