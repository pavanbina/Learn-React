import { useState } from 'react'

import './App.css'



function App() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {
      name: validate('name', form.name),
      email: validate('email', form.email),
      message: validate('message', form.message),
    };
    setErrors(newErrors);
    if (!newErrors.name && !newErrors.email && !newErrors.message) {
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
        <button type="submit" style={{ padding: '8px 16px' }}>Submit</button>
      </form>
    </div>
  );
}

export default App
