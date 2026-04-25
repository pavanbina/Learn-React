import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type User = {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
  };
};

type PostFormData = {
  title: string;
  body: string;
};

type CreatedPost = PostFormData & {
  id: number;
  userId: number;
};

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

export default function ApiDemo() {
  const [users, setUsers] = useState<User[]>([]);
  const [createdPost, setCreatedPost] = useState<CreatedPost | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormData>({
    defaultValues: {
      title: "",
      body: "",
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoadingUsers(true);
        setError("");

        const response = await api.get<User[]>("/users");
        setUsers(response.data);
      } catch (err) {
        setError("Could not load users. Please try again.");
        console.error(err);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const onSubmit = async (data: PostFormData) => {
    try {
      setIsSubmittingPost(true);
      setError("");
      setCreatedPost(null);

      const response = await api.post<CreatedPost>("/posts", {
        ...data,
        userId: 1,
      });

      setCreatedPost(response.data);
      reset();
    } catch (err) {
      setError("Could not create the post. Please try again.");
      console.error(err);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  return (
    <section className="api-demo">
      <div className="api-demo__header">
        <h2>Axios API Integration</h2>
        <p>GET users and POST a fake blog post using JSONPlaceholder.</p>
      </div>

      {error && <p className="api-demo__error">{error}</p>}

      <div className="api-demo__grid">
        <div className="api-demo__panel">
          <h3>GET /users</h3>

          {isLoadingUsers ? (
            <p>Loading users...</p>
          ) : (
            <ul className="api-demo__list">
              {users.slice(0, 5).map((user) => (
                <li key={user.id}>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                  <small>{user.company.name}</small>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="api-demo__panel">
          <h3>POST /posts</h3>

          <form className="api-demo__form" onSubmit={handleSubmit(onSubmit)}>
            <label>
              Title
              <input
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters",
                  },
                })}
              />
            </label>
            {errors.title && <span>{errors.title.message}</span>}

            <label>
              Body
              <textarea
                rows={4}
                {...register("body", {
                  required: "Body is required",
                  minLength: {
                    value: 10,
                    message: "Body must be at least 10 characters",
                  },
                })}
              />
            </label>
            {errors.body && <span>{errors.body.message}</span>}

            <button type="submit" disabled={isSubmittingPost}>
              {isSubmittingPost ? "Sending..." : "Create fake post"}
            </button>
          </form>

          {createdPost && (
            <div className="api-demo__result">
              <strong>API response</strong>
              <pre>{JSON.stringify(createdPost, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
