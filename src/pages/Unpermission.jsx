import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const UnPermission = () => {
  const navigate = useNavigate();
  const from = "/login";

  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button
          type="primary"
          onClick={() => navigate(from, { replace: true })}
        >
          Go Back
        </Button>
      }
    />
  );
};

export default UnPermission;
