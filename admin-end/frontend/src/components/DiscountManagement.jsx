import React, { useEffect, useState } from 'react';
import { fetchDiscounts, createDiscount, updateDiscount, deleteDiscount, fetchBranches, fetchRoomTypes } from '../services/api';

export default function DiscountManagement() {
    const [discounts, setDiscounts] = useState([]);
    const [branches, setBranches] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        percentage: '',
        branch_id: '',
        room_type: '',
        start_date: '',
        end_date: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [discountsRes, branchesRes, roomTypesRes] = await Promise.all([
                fetchDiscounts(),
                fetchBranches(),
                fetchRoomTypes()
            ]);
            setDiscounts(discountsRes.data);
            setBranches(branchesRes.data);
            setRoomTypes(roomTypesRes.data);
        } catch (err) {
            console.error('Error loading data:', err);
        }
    };

    const resetForm = () => {
        setForm({
            percentage: '',
            branch_id: '',
            room_type: '',
            start_date: '',
            end_date: ''
        });
        setEditingId(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingId) {
                await updateDiscount(editingId, form);
                alert('Discount updated successfully!');
            } else {
                await createDiscount(form);
                alert('Discount created successfully!');
            }
            resetForm();
            loadData();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to save discount');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (discount) => {
        setForm({
            percentage: discount.percentage,
            branch_id: discount.branch_id,
            room_type: discount.room_type,
            start_date: discount.start_date,
            end_date: discount.end_date
        });
        setEditingId(discount.discount_id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this discount?')) return;
        
        try {
            await deleteDiscount(id);
            alert('Discount deleted successfully!');
            loadData();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to delete discount');
        }
    };

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h3>{editingId ? 'Edit Discount' : 'Create New Discount'}</h3>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="percentage">Discount Percentage</label>
                            <input
                                id="percentage"
                                name="percentage"
                                type="number"
                                min="1"
                                max="100"
                                value={form.percentage}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="branch_id">Branch</label>
                            <select
                                id="branch_id"
                                name="branch_id"
                                value={form.branch_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Branch</option>
                                {branches.map(branch => (
                                    <option key={branch.branch_id} value={branch.branch_id}>
                                        {branch.branch_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="room_type">Room Type</label>
                            <select
                                id="room_type"
                                name="room_type"
                                value={form.room_type}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Room Type</option>
                                {roomTypes.map(type => (
                                    <option key={type.type_name} value={type.type_name}>
                                        {type.type_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="start_date">Start Date</label>
                            <input
                                id="start_date"
                                name="start_date"
                                type="date"
                                value={form.start_date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="end_date">End Date</label>
                            <input
                                id="end_date"
                                name="end_date"
                                type="date"
                                value={form.end_date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        {editingId && (
                            <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                Cancel
                            </button>
                        )}
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : (editingId ? 'Update Discount' : 'Create Discount')}
                        </button>
                    </div>
                </form>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3>Active Discounts</h3>
                </div>

                {discounts.length === 0 ? (
                    <p>No discounts available.</p>
                ) : (
                    <table className="staff-table">
                        <thead>
                            <tr>
                                <th>Branch</th>
                                <th>Room Type</th>
                                <th>Discount %</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {discounts.map(discount => (
                                <tr key={discount.discount_id}>
                                    <td>{discount.branch_name}</td>
                                    <td>{discount.room_type_name}</td>
                                    <td>{discount.percentage}%</td>
                                    <td>{discount.start_date}</td>
                                    <td>{discount.end_date}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => handleEdit(discount)}>Edit</button>
                                        <button
                                        className="btn btn-secondary"
                                        style={{ marginLeft: "8px", color: "red" }}
                                        onClick={() => handleDelete(discount.discount_id)}
                                        >
                                        Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}