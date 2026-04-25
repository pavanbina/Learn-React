import { useState } from 'react'
import './App.css'

type ContactFormState = {
  name: string;
  email: string;
  message: string;
  phones: string[];
  gender: string;
  country: string;
  agree: boolean;
  hobbies: string[];
  otherCountry?: string;
};

function App() {
  // Arrays in state: phones (dynamic), hobbies (checkbox group)
  const [form, setForm] = useState<ContactFormState>({
    name: '',
    email: '',
    message: '',
    phones: [''],
    gender: '', // radio
    country: '', // select
    agree: false, // checkbox
    hobbies: [] as string[], // checkbox group
    // otherCountry is added dynamically if needed
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string; phones?: string[] }>({});

  const validate = (field: string, value: string) => {
    switch (field) {
      case 'name':
        if (!/^[A-Za-z ]+$/.test(value)) {
          return 'Name must contain only letters and spaces.';
        }
        break;
      case 'email':
        if (!/^\S+@\S+\.\S+$/.test(value)) {
          return 'Invalid email format.';
        }
        break;
      case 'message':
        if (!value.trim()) {
          return 'Message cannot be empty.';
        }
        // Allow minimal special chars: . , ! ? -
        if (/[^A-Za-z0-9 .,!?\-]/.test(value)) {
          return 'Message contains invalid special characters.';
        }
        break;
      default:
        break;
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox' && name === 'agree') {
      setForm(prev => ({ ...prev, agree: (e.target as HTMLInputElement).checked }));
    } else if (type === 'checkbox' && name === 'hobbies') {
      setForm(prev => {
        const checked = (e.target as HTMLInputElement).checked;
        const alreadySelected = prev.hobbies.includes(value);
        let hobbies = prev.hobbies;

        if (checked && !alreadySelected) {
          hobbies = [...prev.hobbies, value];
        }

        if (!checked && alreadySelected) {
          hobbies = prev.hobbies.filter((h: string) => h !== value);
        }

        return { ...prev, hobbies };
      });
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  // Dynamic phone number handlers
  const handlePhoneChange = (idx: number, value: string) => {
    setForm(prev => {
      const phones = [...prev.phones];
      phones[idx] = value;
      return { ...prev, phones };
    });
    setErrors(prev => {
      const phonesErr = prev.phones ? [...prev.phones] : [];
      phonesErr[idx] = value && !/^\d{10}$/.test(value) ? 'Phone must be 10 digits' : '';
      return { ...prev, phones: phonesErr };
    });
  };

  const addPhone = () => {
    setForm(prev => ({ ...prev, phones: [...prev.phones, ''] }));
    setErrors(prev => ({ ...prev, phones: prev.phones ? [...prev.phones, ''] : [''] }));
  };

  const removePhone = (idx: number) => {
    setForm(prev => {
      const phones = prev.phones.filter((_, i) => i !== idx);
      return { ...prev, phones };
    });
    setErrors(prev => {
      const phonesErr = prev.phones ? prev.phones.filter((_, i) => i !== idx) : [];
      return { ...prev, phones: phonesErr };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneErrors = form.phones.map(p => (p && !/^\d{10}$/.test(p) ? 'Phone must be 10 digits' : ''));
    const newErrors: typeof errors = {
      name: validate('name', form.name),
      email: validate('email', form.email),
      message: validate('message', form.message),
      phones: phoneErrors,
    };
    setErrors(newErrors);
    const hasPhoneError = phoneErrors.some(Boolean);
    if (!newErrors.name && !newErrors.email && !newErrors.message && !hasPhoneError && form.gender && form.country && form.agree) {
      alert(JSON.stringify(form));
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Contact Form</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 12 }}>
          <label>
            Name:<br />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </label>
          {errors.name && <div style={{ color: 'red', fontSize: 13 }}>{errors.name}</div>}
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Email:<br />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </label>
          {errors.email && <div style={{ color: 'red', fontSize: 13 }}>{errors.email}</div>}
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Message:<br />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={4}
              style={{ width: '100%', padding: 8 }}
            />
          </label>
          {errors.message && <div style={{ color: 'red', fontSize: 13 }}>{errors.message}</div>}
        </div>

        {/* Gender radio */}
        <div style={{ marginBottom: 12 }}>
          <label>Gender:</label><br />
          <label><input type="radio" name="gender" value="male" checked={form.gender === 'male'} onChange={handleChange} /> Male</label>
          <label style={{ marginLeft: 12 }}><input type="radio" name="gender" value="female" checked={form.gender === 'female'} onChange={handleChange} /> Female</label>
          <label style={{ marginLeft: 12 }}><input type="radio" name="gender" value="other" checked={form.gender === 'other'} onChange={handleChange} /> Other</label>
          {!form.gender && <div style={{ color: 'red', fontSize: 13 }}>Please select gender</div>}
        </div>

        {/* Country select */}
        <div style={{ marginBottom: 12 }}>
          <label>Country:<br />
            <select name="country" value={form.country} onChange={handleChange} style={{ width: '100%', padding: 8 }} required>
              <option value="">Select country</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Other">Other</option>
            </select>
          </label>
          {!form.country && <div style={{ color: 'red', fontSize: 13 }}>Please select country</div>}
        </div>

        {/* Dependent input: specify country if 'Other' */}
        {form.country === 'Other' && (
          <div style={{ marginBottom: 12 }}>
            <label>
              Please specify country:<br />
              <input
                type="text"
                name="otherCountry"
                value={form.otherCountry || ''}
                onChange={handleChange}
                style={{ width: '100%', padding: 8 }}
                required
              />
            </label>
          </div>
        )}

        {/* Hobbies checkbox group */}
        <div style={{ marginBottom: 12 }}>
          <label>Hobbies:</label><br />
          <label><input type="checkbox" name="hobbies" value="Reading" checked={form.hobbies.includes('Reading')} onChange={handleChange} /> Reading</label>
          <label style={{ marginLeft: 12 }}><input type="checkbox" name="hobbies" value="Sports" checked={form.hobbies.includes('Sports')} onChange={handleChange} /> Sports</label>
          <label style={{ marginLeft: 12 }}><input type="checkbox" name="hobbies" value="Music" checked={form.hobbies.includes('Music')} onChange={handleChange} /> Music</label>
        </div>

        {/* Agree checkbox */}
        <div style={{ marginBottom: 12 }}>
          <label>
            <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} /> I agree to terms
          </label>
          {!form.agree && <div style={{ color: 'red', fontSize: 13 }}>You must agree to continue</div>}
        </div>

        {/* Dynamic phone fields */}
        <div style={{ marginBottom: 12 }}>
          <label>Phone Numbers:</label>
          {form.phones.map((phone, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
              <input
                type="text"
                value={phone}
                onChange={e => handlePhoneChange(idx, e.target.value)}
                placeholder="10 digit phone"
                style={{ flex: 1, padding: 8 }}
              />
              <button type="button" onClick={() => removePhone(idx)} style={{ marginLeft: 8 }} disabled={form.phones.length === 1}>-</button>
              {idx === form.phones.length - 1 && (
                <button type="button" onClick={addPhone} style={{ marginLeft: 4 }}>+</button>
              )}
              {errors.phones && errors.phones[idx] && (
                <span style={{ color: 'red', fontSize: 13, marginLeft: 8 }}>{errors.phones[idx]}</span>
              )}
            </div>
          ))}
        </div>
        
        <button type="submit" style={{ padding: '8px 16px' }}>Submit</button>
      </form>
    </div>
  );
}

export default App
