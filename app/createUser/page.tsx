"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import {
  TextField,
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Snackbar,
  FormControlLabel,
  Checkbox,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { useCallback } from "react";

const Register = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [userData, setUserData] = useState(null);
  const [birthCertificate, setBirthCertificate] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { push } = useRouter();

  const [regexList, setRegexList] = useState([
    {
      name: "8 болон түүнээс дээш тэмдэгтэй байх",
      type: false,
      regex: /.{8}$/,
    },
    { name: "Дор хаяж 1 том үсэг агуулсан байх", type: false, regex: /[A-Z]/ },
    {
      name: "Дор хаяж 1 жижиг үсэг агуулсан байх",
      type: false,
      regex: /[a-z]/,
    },
    { name: "Дор хаяж 1 тоо агуулсан байх", type: false, regex: /[0-9]/ },
    {
      name: "Дор хаяж 1 тусгай тэмдэгт агуулсан байх",
      type: false,
      regex: /[!@#$%^&*(),.?":{}|<>;]/,
    },
  ]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const validatePassword = useCallback(
    (password: string) => {
      const updatedRegexList = regexList.map((rule) => ({
        ...rule,
        type: rule.regex.test(password),
      }));
      setRegexList(updatedRegexList);
    },
    [regexList]
  );

  useEffect(() => {
    validatePassword(password);
  }, [password, validatePassword]);
  const handleOtpChange = (index: number, value: any) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleRegister = async () => {
    if (step === 3) {
      const bodyData = {
        phone: phoneOrEmail.includes("@") ? null : phoneOrEmail,
        email: phoneOrEmail.includes("@") ? phoneOrEmail : null,
        password,
        isPhone: !phoneOrEmail.includes("@"),
        isEmail: phoneOrEmail.includes("@"),
        userData,
        birthCertificate,
      };
      push("./");
      try {
        const response = await axios.post(
          "https://gateway.invescore.mn/api/user/signup",
          bodyData
        );
        if (response.status === 200) {
          setSnackbarMessage("Таны бүртгэл амжилттай үүслээ.");
          push("/login");
        } else {
          setSnackbarMessage(response.data.message || "Сервер алдаа!");
        }
      } catch (error) {
        setSnackbarMessage(
          error.response?.data?.message || "Сервертэй холбогдоход алдаа гарлаа"
        );
      }
    }
  };

  const handleNext = async () => {
    if (step === 0) {
      if (!phoneOrEmail) {
        setSnackbarMessage("Талбарыг бөглөнө үү");
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(
          `https://gateway.invescore.mn/api/user/check?username=${phoneOrEmail}`
        );
        if (response.status === 200) {
          await sendOTP();
        } else {
          setSnackbarMessage(
            response.data.message || "Сервертэй холбогдоход алдаа гарлаа"
          );
        }
      } catch (error) {
        setSnackbarMessage(
          error.response?.data?.message || "Сервертэй холбогдоход алдаа гарлаа"
        );
      } finally {
        setLoading(false);
      }
    } else if (step === 1) {
      setStep(step + 1);
    } else if (step === 2) {
      if (password !== confirmPassword) {
        setSnackbarMessage("Нууц үг таарахгүй байна!");
        return;
      }
      setStep(step + 1);
    }
  };

  const sendOTP = async () => {
    try {
      const response = await axios.post(
        "https://gateway.invescore.mn/api/otp/create",
        { identity: phoneOrEmail }
      );
      if (response.status === 200) {
        setSnackbarMessage(
          response.data.message || "Нэг удаагийн код илгээгдлээ"
        );
        setStep(1);
        setCountdown(120);
      } else {
        setSnackbarMessage(
          response.data.message || "Сервертэй холбогдоход алдаа гарлаа"
        );
      }
    } catch (error) {
      setSnackbarMessage(
        error.response?.data?.message || "Сервертэй холбогдоход алдаа гарлаа"
      );
    }
  };

  const danCall = async () => {
    const url =
      "https://dan.invescore.mn/grant?scope=W3sic2VydmljZXMiOiBbIldTMTAwMTAxX2dldENpdGl6ZW5JRENhcmRJbmZvIl0sICJ3c2RsIjogImh0dHBzOi8veHlwLmdvdi5tbi9jaXRpemVuLTEuMy4wL3dzP1dTREwifSx7InNlcnZpY2VzIjogWyJXUzEwMDEwMl9nZXRDaXRpemVuQmlydGhJbmZvIl0sICJ3c2RsIjogImh0dHBzOi8veHlwLmdvdi5tbi9jaXRpemVuLTEuMy4wL3dzP1dTREwifV0=&callbackUrl=https://dan-backend.invescore.mn/api/dan/callback";
    const popup = window.open(
      url,
      "DAN",
      "width=850, height=850, scrollbars=yes"
    );

    window.addEventListener("message", (event) => {
      const object = JSON.parse(event.data);
      if (object.response[1].services.WS100101_getCitizenIDCardInfo.response) {
        setUserData(
          object.response[1].services.WS100101_getCitizenIDCardInfo.response
        );
        setBirthCertificate(
          object.response[2].services.WS100102_getCitizenBirthInfo.response
        );
        popup.close();
        setStep(3);
      } else {
        popup.close();
        setSnackbarMessage("Invalid request");
      }
    });
  };

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (duration % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Card
        sx={{
          width: "40vw",
          height: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
        }}
      >
        <CardContent sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: "bold", color: "blue" }}
          >
            InvesCore
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary">
            Санхүүгийн байгууллага
          </Typography>
        </CardContent>
        <Typography variant="h4" align="center" gutterBottom>
          Бүртгүүлэх
        </Typography>

        {step === 0 && (
          <>
            <ToggleButtonGroup
              exclusive
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              value={phoneOrEmail.includes("@") ? "email" : "phone"}
              onChange={(e, newValue) =>
                setPhoneOrEmail(newValue === "email" ? "@" : "")
              }
            >
              <ToggleButton value="phone" aria-label="phone" sx={{ flex: 1 }}>
                <PhoneIcon />
                УТАСНЫ ДУГААР
              </ToggleButton>
              <ToggleButton value="email" aria-label="email" sx={{ flex: 1 }}>
                <EmailIcon />
                И-МЭЙЛ ХАЯГ
              </ToggleButton>
            </ToggleButtonGroup>
            <TextField
              type={phoneOrEmail.includes("@") ? "email" : "text"}
              label={
                phoneOrEmail.includes("@") ? "И-мэйл хаяг" : "Утасны дугаар"
              }
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Box className="flex w-[100%] items-center justify-between">
              <Link
                component={Link}
                href="/"
                variant="contained"
                color="secondary"
                fullWidth
                className=" py-2 h-[35px] px-4 w-[150px] flex items-center justify-center text-white bg-black mt-6 rounded hover:shadow-lg duration-200"
              >
                Буцах
              </Link>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleNext}
                disabled={loading}
                className="w-[150px] rounded h-[35px] mt-6"
              >
                {loading ? <CircularProgress size={24} /> : "Үргэлжлүүлэх"}
              </Button>
            </Box>
          </>
        )}

        {step === 1 && (
          <>
            <Typography variant="h6" align="center" gutterBottom>
              OTP баталгаажуулалт
            </Typography>
            <Typography align="center" gutterBottom>
              Таны {phoneOrEmail.includes("@") ? "И-мейл" : "утасны"} дугаар руу
              нэг удаагийн код илгээгдлээ. Доорх талбарт баталгаажуулах кодыг
              оруулна уу.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              {otp.map((value, index) => (
                <TextField
                  key={index}
                  value={value}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  variant="outlined"
                  inputProps={{ maxLength: 1 }}
                  sx={{ width: 40, mx: 0.5, textAlign: "center" }}
                />
              ))}
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleNext}
              sx={{ mb: 2 }}
            >
              Үргэлжлүүлэх
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => setStep(step - 1)}
              sx={{ mb: 2 }}
            >
              Буцах
            </Button>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={sendOTP}
              disabled={countdown > 0}
            >
              {countdown > 0
                ? `Дахин илгээх (${formatDuration(countdown)})`
                : "Дахин илгээх"}
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Typography variant="h6" align="center" gutterBottom>
              Бүртгүүлэх
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              ИНВЕСКОР АППЛИКЕЙШНЫ ХАРИЛЦАГЧДАД ҮЙЛЧИЛГЭЭ ҮЗҮҮЛЭХ ҮЙЛЧИЛГЭЭНИЙ
              НӨХЦӨЛ
            </Typography>
            <Box sx={{ maxHeight: 300, overflow: "auto", mb: 2 }}>
              <Typography variant="body2" paragraph>
                НЭГ.Нийтлэг үндэслэл 1.1 Энэхүү Үйлчилгээний нөхцөл нь Инвескор
                ББСБ ХК /цаашид “ББСБ” гэх/-аас Инвескор Аппликейшн /цаашид
                “INVESCORE APP” гэх/-ээр дамжуулан санхүүгийн үйлчилгээг
                харилцагчид цахимаар үзүүлэх харилцаанд үйлчлэх бөгөөд Харилцагч
                та энэхүү “Үйлчилгээний нөхцөл”-тэй танилцаж зөвшөөрсөн
                тохиолдолд “Би хүлээн зөвшөөрч байна” гэсэн товчийг дарснаар
                INVESCORE APP-ийг ашиглах эрх үүснэ. ...
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                />
              }
              label="Үйлчилгээний нөхцөлийг зөвшөөрсөн"
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={danCall}
              disabled={!agreed}
              sx={{ mb: 2 }}
            >
              Бүртгүүлэх
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => setStep(step - 1)}
            >
              Буцах
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <Typography variant="h6" align="center" gutterBottom>
              Нууц үг үүсгэх
            </Typography>
            <TextField
              type="password"
              label="Нууц үг"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              type="password"
              label="Нууц үг давт"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <ul>
              {regexList.map((rule, index) => (
                <li
                  key={index}
                  className={`${rule.type ? "text-green-500" : "text-red-500"}`}
                >
                  {rule.name}
                </li>
              ))}
            </ul>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleRegister}
              disabled={
                !regexList.every((rule) => rule.type) ||
                password !== confirmPassword
              }
              sx={{ mt: 2 }}
            >
              Бүртгүүлэх
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => setStep(step - 1)}
              sx={{ mt: 2 }}
            >
              Буцах
            </Button>
          </>
        )}
      </Card>
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={6000}
        onClose={() => setSnackbarMessage("")}
        message={snackbarMessage}
      />
      <ToastContainer />
    </Container>
  );
};

export default Register;
