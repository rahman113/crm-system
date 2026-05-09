import React, { useState, useEffect } from 'react';
import { getLeads, createLead, updateLead, deleteLead } from '../services/api';
import LeadForm from './LeadForm';

const LeadList = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingLead, setEditingLead] = useState(null);
    const [formError, setFormError] = useState('');

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const response = await getLeads(statusFilter);
            setLeads(response.data.data);
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch leads');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchLeads();
    }, [statusFilter]);
    const handleSaveLead = async (leadData) => {
        try {
            setFormError('');

            if (editingLead) {
                // Update existing lead
                const response = await updateLead(editingLead._id, leadData);
                if (response.data.success) {
                    await fetchLeads();
                    setShowForm(false);
                    setEditingLead(null);
                }
            } else {
                const response = await createLead(leadData);
                if (response.data.success) {
                    await fetchLeads();
                    setShowForm(false);
                }
            }
        } catch (error) {
            console.error('Save lead error:', error);
            const errorMessage = error.response?.data?.errors?.[0]?.msg ||
                error.response?.data?.message ||
                'Failed to save lead';
            setFormError(errorMessage);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this lead?')) {
            try {
                await deleteLead(id);
                await fetchLeads();
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to delete lead');
            }
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            New: 'status-new',
            Contacted: 'status-contacted',
            Qualified: 'status-qualified',
            Lost: 'status-lost',
            Closed: 'status-closed',
        };
        return colors[status] || '';
    };

    return (
        <div className="lead-list-container">
            <div className="lead-header">
                <h2>Leads Management</h2>
                <button
                    onClick={() => {
                        setEditingLead(null);
                        setShowForm(true);
                        setFormError('');
                    }}
                    className="btn-primary"
                >
                    Add New Lead
                </button>
            </div>

            <div className="filters">
                <label>Filter by Status:</label>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Lost">Lost</option>
                    <option value="Closed">Closed</option>
                </select>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">Loading leads...</div>
            ) : (
                <div className="leads-table-container">
                    <table className="leads-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="no-data">
                                        No leads found. Click "Add New Lead" to create one.
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr key={lead._id}>
                                        <td>{lead.name}</td>
                                        <td>{lead.email}</td>
                                        <td>{lead.phone}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusColor(lead.status)}`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                onClick={() => {
                                                    setEditingLead(lead);
                                                    setShowForm(true);
                                                    setFormError('');
                                                }}
                                                className="btn-edit"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(lead._id)}
                                                className="btn-delete"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <LeadForm
                    lead={editingLead}
                    onSubmit={handleSaveLead}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingLead(null);
                        setFormError('');
                    }}
                    error={formError}
                />
            )}
        </div>
    );
};

export default LeadList;