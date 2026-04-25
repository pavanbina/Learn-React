import { useForm, useFieldArray } from "react-hook-form";

export type FormData = {
  name: string;
  email: string;
  message: string;
  phones: { value: string }[];
  gender: string;
  country: string;
  agree: boolean;
  hobbies: string[];
  otherCountry?: string;
};

export default function ContactForm() {
  const { register, control, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    defaultValues: {
      phones: [{ value: "" }],
      hobbies: [],
      agree: false,
    }
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "phones"
  });
  const country = watch("country");

  const onSubmit = (data: FormData) => {
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Name:</label>
        <input {...register("name", { required: "Name is required", pattern: { value: /^[A-Za-z ]+$/, message: "Only letters and spaces allowed" } })} />
        {errors.name && <span style={{ color: 'red' }}>{errors.name.message}</span>}
      </div>
      <div>
        <label>Email:</label>
        <input {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } })} />
        {errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}
      </div>
      <div>
        <label>Message:</label>
          <textarea {...register("message", { required: "Message is required", pattern: { value: /^[A-Za-z0-9 .,!?\-]+$/, message: "Invalid characters" } })} />
        {errors.message && <span style={{ color: 'red' }}>{errors.message.message}</span>}
      </div>
      <div>
        <label>Gender:</label>
        <label><input type="radio" value="male" {...register("gender", { required: "Gender is required" })} /> Male</label>
        <label><input type="radio" value="female" {...register("gender", { required: "Gender is required" })} /> Female</label>
        <label><input type="radio" value="other" {...register("gender", { required: "Gender is required" })} /> Other</label>
        {errors.gender && <span style={{ color: 'red' }}>{errors.gender.message}</span>}
      </div>
      <div>
        <label>Country:</label>
        <select {...register("country", { required: "Country is required" })}>
          <option value="">Select country</option>
          <option value="India">India</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
          <option value="Other">Other</option>
        </select>
        {errors.country && <span style={{ color: 'red' }}>{errors.country.message}</span>}
      </div>
      {country === "Other" && (
        <div>
          <label>Please specify country:</label>
          <input {...register("otherCountry", { required: "Please specify country" })} />
          {errors.otherCountry && <span style={{ color: 'red' }}>{errors.otherCountry.message}</span>}
        </div>
      )}
      <div>
        <label>Hobbies:</label>
        <label><input type="checkbox" value="Reading" {...register("hobbies")} /> Reading</label>
        <label><input type="checkbox" value="Sports" {...register("hobbies")} /> Sports</label>
        <label><input type="checkbox" value="Music" {...register("hobbies")} /> Music</label>
      </div>
      <div>
        <label><input type="checkbox" {...register("agree", { required: "You must agree" })} /> I agree to terms</label>
        {errors.agree && <span style={{ color: 'red' }}>{errors.agree.message}</span>}
      </div>
      <div>
        <label>Phone Numbers:</label>
        {fields.map((field, idx) => (
          <div key={field.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <input
              {...register(`phones.${idx}.value`, { required: "Phone is required", pattern: { value: /^\d{10}$/, message: "10 digits required" } })}
              placeholder="10 digit phone"
            />
            <button type="button" onClick={() => remove(idx)} disabled={fields.length === 1}>-</button>
            {idx === fields.length - 1 && (
              <button type="button" onClick={() => append({ value: "" })}>+</button>
            )}
            {errors.phones?.[idx]?.value && <span style={{ color: 'red', marginLeft: 8 }}>{errors.phones[idx].value?.message}</span>}
          </div>
        ))}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
