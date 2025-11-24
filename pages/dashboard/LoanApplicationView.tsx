




import React, { useState } from 'react';
import type { ViewType, LoanApplicationData } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface LoanApplicationViewProps {
    setActiveView: (view: ViewType) => void;
}

const ProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const steps = ['Loan Details', 'Personal Info', 'Financial Info', 'Review'];
    return (
        <div className="flex items-center mb-8">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${currentStep >= index + 1 ? 'bg-blue-800 text-white' : 'bg-gray-200 dark:bg-slate-600 text-gray-500 dark:text-gray-200'}`}>
                            {currentStep > index + 1 ? <i className="fas fa-check"></i> : index + 1}
                        </div>
                        <p className={`mt-2 text-xs font-semibold ${currentStep >= index + 1 ? 'text-gray-800 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}>{step}</p>
                    </div>
                    {index < steps.length - 1 && <div className={`flex-grow h-1 transition-colors mx-2 ${currentStep > index + 1 ? 'bg-blue-800' : 'bg-gray-200 dark:bg-slate-600'}`}></div>}
                </React.Fragment>
            ))}
        </div>
    );
};

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string, error?: string }> = ({ label, error, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <input {...props} className={`mt-1 w-full border-gray-300 dark:border-slate-600 rounded-md bg-transparent dark:bg-slate-700 dark:text-white ${error ? 'border-red-500' : ''}`} />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, error?: string, children: React.ReactNode }> = ({ label, error, children, ...props }) => (
     <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <select {...props} className={`mt-1 w-full border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-white ${error ? 'border-red-500' : ''}`}>
            {children}
        </select>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);


const LoanApplicationView: React.FC<LoanApplicationViewProps> = ({ setActiveView }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<LoanApplicationData>({
        loanType: '', amount: '', purpose: '', fullName: 'Collins William', email: 'collinwilll360@gmail.com',
        phone: '+44 20 7946 0123', address: '12 Park Lane, Mayfair, London W1K 7AA, UK', dob: '',
        employmentStatus: '', annualIncome: ''
    });
    const [errors, setErrors] = useState<Partial<Record<keyof LoanApplicationData, string>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateStep = () => {
        const newErrors: Partial<Record<keyof LoanApplicationData, string>> = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0); // To compare dates only

        if (step === 1) {
            if (!formData.loanType) newErrors.loanType = "Loan type is required";
            
            const amountValue = parseFloat(formData.amount);
            if (!formData.amount) {
                newErrors.amount = "A loan amount is required.";
            } else if (isNaN(amountValue)) {
                newErrors.amount = "Please enter a valid numerical value.";
            } else if (amountValue <= 0) {
                newErrors.amount = "Amount must be a positive number.";
            } else if (amountValue > 1000000) {
                newErrors.amount = "Loan amount cannot exceed $1,000,000";
            }

            if (!formData.purpose) {
                newErrors.purpose = "Loan purpose is required";
            } else if (formData.purpose.length < 10) {
                newErrors.purpose = "Purpose must be at least 10 characters long";
            }
        }
        if (step === 2) {
            if (!formData.fullName) newErrors.fullName = "Full name is required";
            if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "A valid email is required";
            if (!formData.phone || !/^[0-9\s()+-]{10,}$/.test(formData.phone)) newErrors.phone = "A valid phone number is required";
            if (!formData.address) newErrors.address = "Address is required";
            if (!formData.dob) {
                newErrors.dob = "Date of birth is required";
            } else if (new Date(formData.dob) >= today) {
                newErrors.dob = "Date of birth cannot be in the future";
            }
        }
        if (step === 3) {
            if (!formData.employmentStatus) newErrors.employmentStatus = "Employment status is required";

            const incomeValue = parseFloat(formData.annualIncome);
            if (!formData.annualIncome) {
                newErrors.annualIncome = "Annual income is required.";
            } else if (isNaN(incomeValue)) {
                newErrors.annualIncome = "Please enter a valid numerical value.";
            } else if (incomeValue <= 0) {
                newErrors.annualIncome = "Annual income must be a positive number.";
            } else if (incomeValue < 10000) {
                newErrors.annualIncome = "Annual income must be at least $10,000";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const nextStep = () => {
        if (validateStep()) {
            setStep(s => s + 1);
        }
    };
    
    const prevStep = () => setStep(s => s - 1);
    const submitApplication = () => {
        // Here would be an API call to submit the form data
        console.log('Submitting application:', formData);
        setStep(5); // Move to success step
    };

    const renderStep = () => {
        switch (step) {
            case 1: // Loan Details
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">1. Loan Details</h2>
                        <FormSelect label="Loan Type*" name="loanType" value={formData.loanType} onChange={handleChange} error={errors.loanType}>
                            <option value="">Select a loan type</option>
                            <option>Personal</option><option>Auto</option><option>Mortgage</option>
                        </FormSelect>
                        <FormInput label="Amount Requested ($)*" type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="e.g., 50000" error={errors.amount} />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Purpose of Loan*</label>
                            <textarea name="purpose" value={formData.purpose} onChange={handleChange} rows={3} placeholder="e.g., Home renovation, new vehicle purchase" className={`mt-1 w-full border-gray-300 dark:border-slate-600 rounded-md bg-transparent dark:bg-slate-700 dark:text-white ${errors.purpose ? 'border-red-500' : ''}`}></textarea>
                            {errors.purpose && <p className="text-xs text-red-500 mt-1">{errors.purpose}</p>}
                        </div>
                    </div>
                );
            case 2: // Personal Info
                 return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">2. Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="Full Name*" type="text" name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} />
                            <FormInput label="Date of Birth*" type="date" name="dob" value={formData.dob} onChange={handleChange} error={errors.dob} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="Email Address*" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} />
                            <FormInput label="Phone Number*" type="tel" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} />
                        </div>
                        <FormInput label="Full Mailing Address*" type="text" name="address" value={formData.address} onChange={handleChange} error={errors.address} />
                    </div>
                );
            case 3: // Financial Info
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">3. Financial Information</h2>
                        <FormSelect label="Employment Status*" name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} error={errors.employmentStatus}>
                            <option value="">Select status</option>
                            <option>Employed</option><option>Self-Employed</option><option>Unemployed</option><option>Student</option>
                        </FormSelect>
                        <FormInput label="Annual Income ($)*" type="number" name="annualIncome" value={formData.annualIncome} onChange={handleChange} placeholder="e.g., 80000" error={errors.annualIncome} />
                    </div>
                );
            case 4: // Review
                const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
                    <div className="py-3 grid grid-cols-3 gap-4"><p className="text-sm text-gray-500 dark:text-gray-400 col-span-1">{label}</p><p className="font-semibold text-gray-800 dark:text-gray-100 col-span-2 break-words">{value || '-'}</p></div>
                );
                return (
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">4. Review & Submit</h2>
                        <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg divide-y divide-gray-200 dark:divide-slate-600">
                           <DetailItem label="Loan Type" value={formData.loanType} />
                           <DetailItem label="Amount" value={formatCurrency(parseFloat(formData.amount))} />
                           <DetailItem label="Purpose" value={formData.purpose} />
                           <DetailItem label="Full Name" value={formData.fullName} />
                           <DetailItem label="Date of Birth" value={formData.dob} />
                           <DetailItem label="Email" value={formData.email} />
                           <DetailItem label="Phone" value={formData.phone} />
                           <DetailItem label="Address" value={formData.address} />
                           <DetailItem label="Employment" value={formData.employmentStatus} />
                           <DetailItem label="Annual Income" value={formatCurrency(parseFloat(formData.annualIncome))} />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">By submitting, you agree to our terms and conditions and confirm that the information provided is accurate.</p>
                    </div>
                );
            case 5: // Success
                return (
                    <div className="text-center py-12">
                         <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-check text-green-500 dark:text-green-400 text-3xl"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Application Submitted!</h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">Thank you, {formData.fullName}. We have received your application and will be in touch within 3-5 business days.</p>
                    </div>
                );
        }
    };

    return (
        <div className="p-8">
            <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
                {step <= 4 && <ProgressBar currentStep={step} />}
                <div className="mt-6">
                    {renderStep()}
                </div>
                <div className="mt-8 pt-4 border-t dark:border-slate-700 flex justify-between">
                    {step > 1 && step < 5 && <button onClick={prevStep} className="px-6 py-2 rounded-md text-gray-600 border border-gray-300 hover:bg-gray-100 dark:text-gray-200 dark:border-slate-600 dark:hover:bg-slate-700">Back</button>}
                    {step < 4 && <button onClick={nextStep} className="px-6 py-2 rounded-md bg-[#e6b325] text-[#1a365d] font-semibold hover:bg-[#d19d1f] ml-auto">Next</button>}
                    {step === 4 && <button onClick={submitApplication} className="px-6 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 ml-auto">Submit Application</button>}
                    {step === 5 && <button onClick={() => setActiveView('loans')} className="px-6 py-2 rounded-md bg-[#1a365d] text-white font-semibold hover:bg-[#2d5c8a] mx-auto">Back to Loan Center</button>}
                </div>
            </div>
        </div>
    );
};

export default LoanApplicationView;
