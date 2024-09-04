"use client";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

const LoginScreen = (): any => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const passwordHash = await sha256(data.password);
      const bodyData = {
        username: data.username,
        password: passwordHash,
        deviceToken: "firebase",
        deviceName: "webDevice",
        platformName: "webPlatform",
        ipAddress: "webipaddress",
        serial: "webSerial",
      };
      const response = await axios.post(
        "https://gateway.invescore.mn/api/auth/signin",
        bodyData
      );
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "userInformation",
          JSON.stringify(response.data.user)
        );
        setLoading(false);
        window.location.href = "/main";
      } else {
        toast.error(response.data.message || "Server error!");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Нэвтрэх нэр эсвэл нууц үг таарахгүй байна");
      setLoading(false);
    }
  };

  return (
    <Box display="flex" height="100vh">
      <Box
        flex={1}
        bgcolor="#003366"
        display={{ xs: "none", md: "flex" }}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <div className="bg-gray-400 p-[20px] rounded-lg flex flex-col items-center bg-opacity-30 justify-center ">
          <Typography variant="h6" color="white" gutterBottom>
            Инвескор ББСБ ХХК
          </Typography>
          <Typography variant="body2" color="white">
            Үнэнч харилцагчдадаа зориулах инвескор платинум кредит картыг
            хэрэглэхэд нэвтрүүллээ.
          </Typography>
        </div>
      </Box>
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="#F4F6F9"
      >
        <Container maxWidth="sm">
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" className="font-semibold" gutterBottom>
              InvesCore
            </Typography>
            <Typography variant="subtitle1">Санхүүгийн байгууллага</Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="username"
              control={control}
              defaultValue=""
              rules={{ required: "Нэвтрэх нэрээ оруулна уу?" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Нэвтрэх нэр"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.username}
                  helperText={
                    errors.username ? (errors.username.message as string) : ""
                  }
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{ required: "Нууц үгээ оруулна уу?" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Нууц үг"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.password}
                  helperText={
                    errors.password ? (errors.password.message as string) : ""
                  }
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              )}
            />
            <FormControlLabel
              control={<Checkbox name="remember" color="primary" />}
              label="Нэвтрэх нэр санах"
            />
            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Нэвтрэх"}
              </Button>
            </Box>
            <Box mt={2}>
              <Button variant="outlined" color="primary" fullWidth>
                Бүртгүүлэх
              </Button>
            </Box>
            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Нууц үгээ мартсан?{" "}
                <Link href="/resetPassword">Нууц үг сэргээх</Link>
              </Typography>
            </Box>
          </form>
        </Container>
      </Box>
      <ToastContainer />
    </Box>
  );
};

const sha256 = async (message: string) => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

export default LoginScreen;
