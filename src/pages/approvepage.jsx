import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const AccountPendingVerification = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div style={{ padding: "50px" }}>
      <Result
        status="404"
        title="Tài khoản của bạn đang chờ nền tảng xác minh"
        subTitle="Vui lòng đợi cho đến khi tài khoản của bạn được xác minh."
        extra={
          <Button type="primary" onClick={handleBack}>
            Back Home
          </Button>
        }
      />
    </div>
  );
};

export default AccountPendingVerification;
