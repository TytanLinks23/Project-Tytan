import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LogEntry, AppProps, RentIncreaseEntry, UnitTransferEntry } from '../types';
import { CALL_DRIVER_OPTIONS, CALLER_TYPE_OPTIONS } from '../constants';

interface CallerLogFormProps extends AppProps {
  onAddEntry: (entry: LogEntry) => void;
}

const CallerLogForm: React.FC<CallerLogFormProps> = ({ onAddEntry, showModal }) => {
  const initialFormState = {
    callDriver: '',
    nameOfCaller: '',
    unitNumber: '',
    storeLocation: '',
    callbackNumber: '',
    callerType: '',
    verified: false,
    notes: '',
    vacateDate: '',
    balance: '',
    promiseToPayDate: '',
    rentIncreases: [{ id: uuidv4(), unitNumber: '', prevRate: '', newRate: '' }],
    unitTransfers: [{ id: uuidv4(), currentUnit: '', newUnit: '' }],
  };

  const [formState, setFormState] = useState(initialFormState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: checked }));
  };
  
  const handleRentIncreaseChange = (id: string, field: keyof Omit<RentIncreaseEntry, 'id'>, value: string) => {
      setFormState(prevState => ({
          ...prevState,
          rentIncreases: prevState.rentIncreases.map(item =>
              item.id === id ? { ...item, [field]: value } : item
          )
      }));
  };
  
  const addRentIncrease = () => {
      setFormState(prevState => ({
          ...prevState,
          rentIncreases: [...prevState.rentIncreases, { id: uuidv4(), unitNumber: '', prevRate: '', newRate: '' }]
      }));
  };

  const removeRentIncrease = (id: string) => {
    setFormState(prevState => ({
      ...prevState,
      rentIncreases: prevState.rentIncreases.filter(item => item.id !== id)
    }));
  };

  const handleUnitTransferChange = (id: string, field: keyof Omit<UnitTransferEntry, 'id'>, value: string) => {
    setFormState(prevState => ({
        ...prevState,
        unitTransfers: prevState.unitTransfers.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        )
    }));
  };

  const addUnitTransfer = () => {
      setFormState(prevState => ({
          ...prevState,
          unitTransfers: [...prevState.unitTransfers, { id: uuidv4(), currentUnit: '', newUnit: '' }]
      }));
  };

  const removeUnitTransfer = (id: string) => {
    setFormState(prevState => ({
      ...prevState,
      unitTransfers: prevState.unitTransfers.filter(item => item.id !== id)
    }));
  };

  useEffect(() => {
    const showUnverifiedWarning = () => {
      showModal(
        "Unverified Caller - Disclosure Restriction",
        <>
          <p>You can only disclose general information, balance, and the billing date on the account.</p>
          <p className="font-bold mt-2">Please do not disclose anything account-specific!</p>
        </>
      );
    };

    if (formState.callDriver === 'Unverified Caller' || formState.callerType === 'Unlisted') {
      showUnverifiedWarning();
    }
    
    if (formState.callDriver === "Break In") {
        showModal(
            "Break In Procedure",
            <>
                <p>Check if the tenant has tenant insurance with us so they can file a claim through SBOA.</p>
                <p className="mt-2">They can do it through <a href="https://sboati.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://sboati.com</a> or call (800) 792-0345 after filing a police report.</p>
                <p className="mt-2">If they do not have tenant insurance, they will need to file a claim on their own.</p>
            </>
        );
    }

    if (formState.callDriver === "Payment") {
        showModal(
            "Payment Processing Fee Notice",
            <>
                <p className="mb-2">Team - RI and SC have now been added to this list.</p>
                <p>Here is a full list of the states where we are now charging the $4.99 fee:</p>
                <div className="mt-3 text-sm grid grid-cols-6 gap-x-2 gap-y-1 font-mono bg-slate-100 p-3 rounded-md">
                    <span>AL</span><span>AZ</span><span>CA</span><span>CO</span><span>CT</span><span>DE</span>
                    <span>FL</span><span>GA</span><span>IA</span><span>ID</span><span>IL</span><span>IN</span>
                    <span>KS</span><span>KY</span><span>LA</span><span>MA</span><span>MD</span><span>MI</span>
                    <span>MN</span><span>MO</span><span>MS</span><span>NH</span><span>NJ</span><span>NM</span>
                    <span>NV</span><span>NY</span><span>OH</span><span>OK</span><span>OR</span><span>PA</span>
                    <span>RI</span><span>SC</span><span>TN</span><span>TX</span><span>VA</span><span>WA</span>
                </div>
            </>
        );
    }

    if (formState.callDriver === "Rent Increase") {
        showModal(
            "Rent Increase Procedure",
            <>
                <p>Please make sure that there haven't been any adjustments made within a 12 month period and that they are calling within 60 days of the increase taking effect.</p>
                <p className="mt-2 font-semibold">Please offer the one time credit if they are eligible.</p>
            </>
        );
    }

    if (formState.callDriver === "Promise To Pay") {
        showModal(
            "Promise To Pay Notice",
            "Putting in a promise to pay will not stop the delinquency process from progressing and any late fees would still be incurred. Lien fee is added once the unit is over 30 days past due."
        );
    }

    if (formState.callDriver === "Late Fee Waive") {
        showModal(
            "Late Fee Waive Policy",
            "A late fee can only be applied within a 12 rolling period. Please make sure to check the notes and ledger if there's any late fees waived within the last 12 months to ensure eligiblity."
        );
    }

    if (formState.callDriver === "Unit Transfer") {
        showModal(
            "Unit Transfer Procedure",
            <>
                <p>Tenants must vacate the current unit within 48 hours and move in to the new unit.</p>
                <p className="mt-2">Please check if the store is open and that there are no overlocks on vacant units to prevent delay and issue.</p>
                <p className="mt-2">Please also check if they have access to their email if they are within the facility so they can sign the new lease.</p>
                <p className="mt-2">Please send an email to the store to notify them about the transfer. </p> 
            </>
        );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.callDriver, formState.callerType]);


  const clearForm = () => {
    setFormState(initialFormState);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.nameOfCaller && !formState.notes) {
      showModal("Input Required", "Please fill in at least the 'Name of Caller' or 'Notes' field.");
      return;
    }

    const newEntry: LogEntry = {
      id: uuidv4(),
      dateTime: new Date().toLocaleString(),
      ...formState,
      vacateDate: formState.callDriver === 'Vacate Notice' ? formState.vacateDate : undefined,
      balance: formState.callDriver === 'Partial Payment' ? formState.balance : undefined,
      promiseToPayDate: formState.callDriver === 'Promise To Pay' ? formState.promiseToPayDate : undefined,
      rentIncreases: formState.callDriver === 'Rent Increase' ? formState.rentIncreases : undefined,
      unitTransfers: formState.callDriver === 'Unit Transfer' ? formState.unitTransfers : undefined,
    };

    onAddEntry(newEntry);
    clearForm();
  };

  const renderConditionalFields = () => {
    switch (formState.callDriver) {
      case 'Vacate Notice':
        return <FormField label="Vacate Date (YYYY-MM-DD)" name="vacateDate" value={formState.vacateDate} onChange={handleInputChange} />;
      case 'Partial Payment':
        return <FormField label="Balance (if applicable)" name="balance" value={formState.balance} onChange={handleInputChange} />;
      case 'Promise To Pay':
        return <FormField label="Promise to Pay Date (YYYY-MM-DD)" name="promiseToPayDate" value={formState.promiseToPayDate} onChange={handleInputChange} />;
      case 'Rent Increase':
        return (
          <div>
            {formState.rentIncreases.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-4 items-end p-3 bg-slate-50 rounded-lg border">
                <div className="md:col-span-2"><FormField compact label="Unit #" name="unitNumber" value={item.unitNumber} onChange={(e) => handleRentIncreaseChange(item.id, 'unitNumber', e.target.value)} /></div>
                <div className="md:col-span-2"><FormField compact label="Prev Rate" name="prevRate" value={item.prevRate} onChange={(e) => handleRentIncreaseChange(item.id, 'prevRate', e.target.value)} /></div>
                <div className="md:col-span-2"><FormField compact label="New Rate" name="newRate" value={item.newRate} onChange={(e) => handleRentIncreaseChange(item.id, 'newRate', e.target.value)} /></div>
                {formState.rentIncreases.length > 1 && (
                  <button type="button" onClick={() => removeRentIncrease(item.id)} className="h-10 text-red-500 hover:text-red-700 font-semibold">Remove</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addRentIncrease} className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-800">+ Add another unit</button>
          </div>
        );
      case 'Unit Transfer':
        return (
            <div>
                {formState.unitTransfers.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4 items-end p-3 bg-slate-50 rounded-lg border">
                        <div className="md:col-span-2"><FormField compact label="Current Unit #" name="currentUnit" value={item.currentUnit} onChange={(e) => handleUnitTransferChange(item.id, 'currentUnit', e.target.value)} /></div>
                        <div className="md:col-span-2"><FormField compact label="New Unit #" name="newUnit" value={item.newUnit} onChange={(e) => handleUnitTransferChange(item.id, 'newUnit', e.target.value)} /></div>
                        {formState.unitTransfers.length > 1 && (
                        <button type="button" onClick={() => removeUnitTransfer(item.id)} className="h-10 text-red-500 hover:text-red-700 font-semibold">Remove</button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addUnitTransfer} className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-800">+ Add another transfer</button>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2">
            <label htmlFor="callDriver" className="block text-sm font-medium text-slate-600 mb-1">Call Driver:</label>
            <select id="callDriver" name="callDriver" value={formState.callDriver} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select Call Driver</option>
                {CALL_DRIVER_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
      </div>

      {renderConditionalFields()}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Name of Caller:" name="nameOfCaller" value={formState.nameOfCaller} onChange={handleInputChange} />
        <FormField label="Unit Number:" name="unitNumber" value={formState.unitNumber} onChange={handleInputChange} />
        <FormField label="Store Location:" name="storeLocation" value={formState.storeLocation} onChange={handleInputChange} />
        <FormField label="Best Callback Number:" name="callbackNumber" value={formState.callbackNumber} onChange={handleInputChange} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">Caller Type:</label>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
            {CALLER_TYPE_OPTIONS.map(type => (
                <label key={type} className="flex items-center space-x-2">
                    <input type="radio" name="callerType" value={type} checked={formState.callerType === type} onChange={handleInputChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300"/>
                    <span>{type}</span>
                </label>
            ))}
        </div>
      </div>
      
      <div>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="verified" checked={formState.verified} onChange={handleCheckboxChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 rounded"/>
          <span className="font-medium text-slate-700">Caller Verified</span>
        </label>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-600 mb-1">Notes:</label>
        <textarea id="notes" name="notes" value={formState.notes} onChange={handleInputChange} rows={5} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
      </div>

      <div className="flex space-x-4">
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">Submit Entry</button>
        <button type="button" onClick={clearForm} className="px-6 py-2 bg-slate-200 text-slate-700 font-bold rounded-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-colors">Clear Fields</button>
      </div>
    </form>
  );
};

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  compact?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ label, name, value, onChange, compact }) => (
  <div>
    <label htmlFor={name} className={`block text-sm font-medium text-slate-600 ${compact ? 'mb-1' : 'mb-1'}`}>{label}</label>
    <input type="text" id={name} name={name} value={value} onChange={onChange} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
  </div>
);

export default CallerLogForm;