import { useNavigate } from "react-router-dom";

export default function useFormSubmit(actionUrl, successRoute) {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = await fetch(actionUrl, { method: "POST", body: formData });
    const data = await res.json();
    navigate(successRoute, { state: { data } });
  };

  return { handleSubmit };
}
