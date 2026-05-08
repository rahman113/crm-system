import React, { useState, useEffect } from 'react';

const LeadForm = ({ lead, onSubmit, onCancel, error: propError }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        status: 'New',
    });
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        if (lead) {
            setFormData({
                name: lead.name || '',
                email: lead.email || '',
                phone: lead.phone || '',
                status: lead.status || 'New',
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                status: 'New',
            });
        }
    }, [lead]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setLocalError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setLocalError('Name is required');
            return;
        }
        if (!formData.email.trim()) {
            setLocalError('Email is required');
            return;
        }
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(formData.email)) {
            setLocalError('Please enter a valid email address');
            return;
        }
        if (!formData.phone.trim()) {
            setLocalError('Phone number is required');
            return;
        }
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            setLocalError('Please enter a valid 10-digit phone number');
            return;
        }
        await onSubmit(formData);
    };

    const displayError = propError || localError;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{lead ? 'Edit Lead' : 'Add New Lead'}</h3>

                {displayError && (
                    <div className="error-message" style={{ marginBottom: '20px' }}>
                        {displayError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter lead name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            pattern="[0-9]{10}"
                            placeholder="Enter 10-digit phone number"
                            title="Please enter 10-digit phone number"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Lost">Lost</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    <div className="modal-buttons">
                        <button type="submit">Save</button>
                        <button type="button" onClick={onCancel}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeadForm;