import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";

function Login() {
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    const res = await API.post("/auth/login", data);

    localStorage.setItem("token", res.data.token);
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col justify-center max-w-md h-screen m-auto">
      <Card>
        <CardBody className="flex gap-4">
          <h1 className="text-3xl font-bold text-center">LOGIN</h1>
          <Form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Input isRequired type="email" placeholder="email" name="email"/>
            <Input isRequired type="password" placeholder="Password"  name="password"/>
            <div className="flex flex-col w-full gap-0.5">
              <Button type="submit" color="primary" className="w-full">
                Login
              </Button>
              <p className="text-center">or</p>
              <Button
                color="secondary"
                className="w-full"
                as={Link}
                to="/register"
              >
                Register
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}

export default Login;
