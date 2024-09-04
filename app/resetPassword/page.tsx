"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import LinkComponent from "@/components/LinkComponent";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Snackbar,
  CircularProgress,
  IconButton,
  InputAdornment,
  Dialog,
  DialogContent,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CoreUrl = {
  serviceUrl: "https://gateway.invescore.mn/api/", // Ensure this is correct
};

const ResetPassword = () => {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [registerFirstLetter, setRegisterFirstLetter] = useState("А");
  const [registerSecondLetter, setRegisterSecondLetter] = useState("А");
  const [register, setRegister] = useState("");
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState(Array(4).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedLetterField, setSelectedLetterField] = useState(null);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openLetterDialog, setOpenLetterDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState("phone");
  const [passwordCriteria, setPasswordCriteria] = useState([
    { name: "8 болон түүнээс дээш тэмдэгтэй байх", valid: false },
    { name: "Дор хаяж 1 том үсэг агуулсан байх", valid: false },
    { name: "Дор хаяж 1 жижиг үсэг агуулсан байх", valid: false },
    { name: "Дор хаяж 1 тоо агуулсан байх", valid: false },
    { name: "Дор хаяж 1 тусгай тэмдэгт агуулсан байх", valid: false },
  ]);

  const letters = [
    "А",
    "Б",
    "В",
    "Г",
    "Д",
    "Е",
    "Ё",
    "Ж",
    "З",
    "И",
    "Й",
    "К",
    "Л",
    "М",
    "Н",
    "О",
    "Ө",
    "П",
    "Р",
    "С",
    "Т",
    "У",
    "Ү",
    "Ф",
    "Х",
    "Ц",
    "Ч",
    "Ш",
    "Щ",
    "Ъ",
    "Ы",
    "Ь",
    "Э",
    "Ю",
    "Я",
  ];

  const regexList = [
    {
      name: "8 болон түүнээс дээш тэмдэгтэй байх",
      regex: /.{8}$/,
    },
    {
      name: "Дор хаяж 1 том үсэг агуулсан байх",
      regex: /[A-Z]/,
    },
    {
      name: "Дор хаяж 1 жижиг үсэг агуулсан байх",
      regex: /[a-z]/,
    },
    {
      name: "Дор хаяж 1 тоо агуулсан байх",
      regex: /[0-9]/,
    },
    {
      name: "Дор хаяж 1 тусгай тэмдэгт агуулсан байх",
      regex: /[!@#$%^&*(),.?":{}|<>;]/,
    },
  ];

  useEffect(() => {
    if (step === 1 && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${CoreUrl.serviceUrl}otp/create`, {
        identity: username,
      });
      if (response.status === 200) {
        setStep(1);
        setCountdown(120);
      } else {
        throw new Error(response.data.message || "Server error!");
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${CoreUrl.serviceUrl}otp/check`, {
        identity: username,
        code: otp.join(""),
      });
      if (response.status === 200) {
        setStep(2);
      } else {
        throw new Error(response.data.message || "Invalid OTP!");
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    const criteria = regexList.map((item) => ({
      name: item.name,
      valid: item.regex.test(password),
    }));
    setPasswordCriteria(criteria);
    return criteria.every((item) => item.valid);
  };

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      setSnackbarMessage("Passwords do not match!");
      setSnackbarOpen(true);
      return;
    }
    if (!validatePassword(password)) {
      setSnackbarMessage("Password does not meet the criteria!");
      setSnackbarOpen(true);
      return;
    }
    setLoading(true);
    try {
      const bytes = new TextEncoder().encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

      const response = await axios.post(
        `${CoreUrl.serviceUrl}user/change-password-otp`,
        {
          userId,
          newPassword: hashHex,
        }
      );

      if (response.status === 200) {
        setSnackbarMessage("Password changed successfully!");
        setSnackbarOpen(true);
        router.push("/login");
      } else {
        throw new Error(response.data.message || "Server error!");
      }
    } catch (error) {
      console.error(
        "Error changing password:",
        error.response ? error.response.data : error.message
      );
      setSnackbarMessage(
        `Request failed with status code ${
          error.response ? error.response.status : "unknown"
        }`
      );
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUserFindChecker = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${CoreUrl.serviceUrl}user/find-username-and-regno`,
        {
          username,
          regNo:
            `${registerFirstLetter}${registerSecondLetter}${register}`.toLowerCase(),
        }
      );
      if (response.status === 200) {
        setUserId(response.data.id);
        setStep(1);
        setCountdown(120);
        handleSendOtp();
      } else {
        throw new Error(response.data.message || "Server error!");
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRegNumberLetterSetter = (assigned, letter) => {
    if (assigned === 1) {
      setRegisterFirstLetter(letter);
    } else {
      setRegisterSecondLetter(letter);
    }
  };

  const handleOpenLetterDialog = (field) => {
    setSelectedLetterField(field);
    setOpenLetterDialog(true);
  };

  const handleCloseLetterDialog = () => {
    setOpenLetterDialog(false);
  };

  const handleLetterSelect = (letter) => {
    if (selectedLetterField === "first") {
      setRegisterFirstLetter(letter);
    } else if (selectedLetterField === "second") {
      setRegisterSecondLetter(letter);
    }
    handleCloseLetterDialog();
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen ">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="70vh"
        bgcolor="background.paper"
        margin={2}
        p={3}
        borderRadius={2}
        boxShadow={3}
      >
       <CardContent sx={{ mb: 4 }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: "bold", color: "blue" }}>
            InvesCore
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary">
            Санхүүгийн байгууллага
          </Typography>
        </CardContent>
        <Typography variant="h4" gutterBottom>
          Нууц үг сэргээх
        </Typography>
        {step === 0 && (
          <>
            <ToggleButtonGroup
              value={selectedOption}
              exclusive
              onChange={(event, newOption) => setSelectedOption(newOption)}
              fullWidth
              sx={{ mb: 2 }}
            >
              <ToggleButton value="phone" aria-label="phone">
                <PhoneIcon />
                Утасны дугаар
              </ToggleButton>
              <ToggleButton value="email" aria-label="email">
                <EmailIcon />
                И-мэйл хаяг
              </ToggleButton>
            </ToggleButtonGroup>
            <TextField
              label={
                selectedOption === "phone" ? "Утасны дугаар" : "И-мэйл хаяг"
              }
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Box display="flex" gap="10px" mt={2}>
              <TextField
                value={registerFirstLetter}
                onClick={() => handleOpenLetterDialog("first")}
                sx={{ cursor: "pointer", width: "20%" }}
              />
              <TextField
                value={registerSecondLetter}
                onClick={() => handleOpenLetterDialog("second")}
                sx={{ cursor: "pointer", width: "20%" }}
              />
              <TextField
                label="Регистрийн дугаар"
                value={register}
                onChange={(e) => setRegister(e.target.value)}
                sx={{ width: "100%" }}
              />
            </Box>
            <div className="flex items-center justify-between w-full ">
              <Link
                href={"/"}
                className=" py-2 h-[35px] px-4 w-[150px] flex items-center justify-center text-white bg-black mt-6 rounded hover:shadow-lg duration-200"
              >
                Буцах
              </Link>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleUserFindChecker}
                disabled={loading}
                sx={{ mt: 3 }}
                className="w-[150px] rounded h-[35px]"
              >
                {loading ? <CircularProgress size={24} /> : "Үргэлжлүүлэх"}
              </Button>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <Box display="flex" justifyContent="center" mt={2}>
              {otp.map((value, index) => (
                <TextField
                  key={index}
                  id={`otp-${index}`}
                  value={value}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  inputProps={{ maxLength: 1 }}
                  sx={{ width: "50px", margin: "0 5px" }}
                />
              ))}
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt={2}
            >
              <Typography
                variant="body2"
                align="center"
                textDecorationLine="underline"
                sx={{ cursor: "pointer", mb: 1 }}
                onClick={() => handleSendOtp()}
              >
                Нэг удаагийн код дахин илгээх
              </Typography>
              <Typography>
                {Math.floor(countdown / 60)}:{countdown % 60}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleCheckOtp}
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : "Үргэлжлүүлэх"}
            </Button>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{ mt: 2 }}
            >
              Буцах
            </Button>
          </>
        )}
        {step === 2 && (
          <>
            <TextField
              label="Нууц үг"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Нууц үгээ давтана уу"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <List>
              {passwordCriteria.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {item.valid ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleChangePassword}
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : "Нууц үг солих"}
            </Button>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{ mt: 2 }}
            >
              Буцах
            </Button>
          </>
        )}
      </Box>

      <Dialog open={openLetterDialog} onClose={handleCloseLetterDialog}>
        <DialogContent>
          <Grid container spacing={1}>
            {letters.map((letter, index) => (
              <Grid item xs={3} sm={2} md={2} lg={1} key={index}>
                <Button
                  variant="outlined"
                  onClick={() => handleLetterSelect(letter)}
                  fullWidth
                >
                  {letter}
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={6000}
      />
    </div>
  );
};

export default ResetPassword;
