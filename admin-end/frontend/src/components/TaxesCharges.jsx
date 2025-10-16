import React, { useEffect, useState } from 'react';
import { fetchCurrentTaxes, fetchTaxHistory, updateTaxes } from '../services/api';

export default function TaxesCharges() {
    const [currentTax, setCurrentTax] = useState({});
    const [history, setHistory] = useState([]);
    const [form, setForm] = useState({
        latest_tax_percentage: '',
        latest_surcharge_percentage: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [currentRes, historyRes] = await Promise.all([
                fetchCurrentTaxes(),
                fetchTaxHistory()
            ]);
            setCurrentTax(currentRes.data);
            setHistory(historyRes.data);
            
            // Pre-fill form with current values
            if (currentRes.data) {
                setForm({
                    latest_tax_percentage: currentRes.data.latest_tax_percentage || '',
                    latest_surcharge_percentage: currentRes.data.latest_surcharge_percentage || ''
                });
            }
        } catch (err) {
            console.error('Error loading tax data:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateTaxes(form);
            alert('Tax rates updated successfully!');
            loadData(); // Reload data to show updated values
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to update tax rates');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h3>Taxes and Charges Management</h3>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="latest_tax_percentage">Tax Percentage (%)</label>
                            <input
                                id="latest_tax_percentage"
                                name="latest_tax_percentage"
                                type="number"
                                min="0"
                                max="100"
                                value={form.latest_tax_percentage}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="latest_surcharge_percentage">Surcharge Percentage (%)</label>
                            <input
                                id="latest_surcharge_percentage"
                                name="latest_surcharge_percentage"
                                type="number"
                                min="0"
                                max="100"
                                value={form.latest_surcharge_percentage}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Tax Rates'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3>Tax Revision History</h3>
                </div>

                {history.length === 0 ? (
                    <p>No tax history available.</p>
                ) : (
                    <table className="staff-table">
                        <thead>
                            <tr>
                                <th>Revision Date</th>
                                <th>Tax %</th>
                                <th>Surcharge %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((record) => (
                                <tr key={record.revision_id}>
                                    <td>{record.revision_date}</td>
                                    <td>{record.latest_tax_percentage}%</td>
                                    <td>{record.latest_surcharge_percentage}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}