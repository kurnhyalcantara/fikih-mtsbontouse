import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { ReactComponent as SignUpBanner } from "../../../assets/signup-banner.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  AdornmentInputPassword,
  AdornmentInputPhone,
  BootstrapedInput,
  SelectInputStyled,
} from "../../../components/Input/BootstrapedInput";
import "./Registration.css";
import Transition from "../../../components/transition/Transition";
import { toCapitalize } from "../../../utils/StringModify";

const Registration = () => {
  const theme = useTheme();
  const history = useNavigate();
  const [namaLengkap, setNamaLengkap] = useState("");
  const [nis, setNis] = useState("");
  const [kelas, setKelas] = useState("tujuh");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [labelSubmit, setLabelSubmit] = useState("Buat Akun");
  const [submitDisable, setSubmitDisable] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitDisable(!submitDisable);
    setLabelSubmit("Loading");
    try {
      await axios
        .post(
          "https://api-fikih-mts-bontouse.herokuapp.com/api/student/register",
          {
            namaLengkap: toCapitalize(namaLengkap),
            nis: nis,
            kelas: kelas,
            mobile: mobile,
            password: password,
          }
        )
        .then((res) => {
          if (res.status === 200) {
            const { data } = res;
            localStorage.setItem("AUTH", JSON.stringify(data));
            toast.success("Pendaftaran Berhasil, Silahkan login");
            history("/login");
          }
        });
    } catch (error) {
      toast.error(error.response.data.msg);
      setSubmitDisable(false);
      setLabelSubmit("Buat Akun");
    }
  };

  useEffect(() => {
    if (password < 4) {
      setSubmitDisable(true);
    } else {
      setSubmitDisable(false);
    }
  }, [password]);

  return (
    <Transition>
      <Box className="container">
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            <Grid
              item
              md={7}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: { xs: "center", md: "flex-start" },
              }}
            >
              <SignUpBanner className="banner-registration" />
            </Grid>
            <Grid item md={5} xs={12}>
              <Box
                sx={{
                  maxWidth: "28rem",
                  margin: "0 auto",
                  padding: {
                    xs: "0",
                    md: "2.5rem",
                  },
                  border: {
                    xs: "none",
                    md: "1px solid #e6e6e6",
                  },
                  borderRadius: "0.5rem",
                  background: "#fff",
                }}
              >
                <form id="signup-submit" onSubmit={handleSubmit}>
                  <Typography
                    variant="h4"
                    fontWeight="700"
                    color={theme.palette.text.primary}
                    textAlign="center"
                  >
                    Yuk, Daftar!
                  </Typography>
                  <Typography
                    color={theme.palette.text.secondary}
                    marginBottom={3}
                    textAlign="center"
                  >
                    Belajar dan wujudkan mimpi kamu
                  </Typography>
                  <FormControl
                    fullWidth
                    variant="standard"
                    className="registration-input"
                    required
                  >
                    <InputLabel
                      shrink
                      htmlFor="nama-lengkap-input"
                      sx={{ fontWeight: "700" }}
                    >
                      Nama Lengkap
                    </InputLabel>
                    <BootstrapedInput
                      id="nama-lengkap-input"
                      variant="outlined"
                      type="text"
                      onChange={(e) => {
                        setNamaLengkap(e.target.value);
                      }}
                      value={namaLengkap}
                    />
                  </FormControl>
                  <FormControl
                    fullWidth
                    variant="standard"
                    className="registration-input"
                  >
                    <InputLabel
                      shrink
                      htmlFor="nis-input"
                      sx={{ fontWeight: "700" }}
                    >
                      NIS
                    </InputLabel>
                    <BootstrapedInput
                      id="nis-input"
                      variant="outlined"
                      type="text"
                      onChange={(e) => {
                        setNis(e.target.value);
                      }}
                      value={nis}
                    />
                  </FormControl>
                  <FormControl
                    fullWidth
                    variant="standard"
                    className="registration-input"
                    required
                  >
                    <InputLabel
                      shrink
                      htmlFor="class-student-select"
                      sx={{ fontWeight: "700" }}
                    >
                      Pilih Kelas
                    </InputLabel>
                    <Select
                      id="class-student-select"
                      fullWidth
                      onChange={(e) => {
                        setKelas(e.target.value);
                      }}
                      value={kelas}
                      input={<SelectInputStyled />}
                    >
                      <MenuItem value={"tujuh"}>Kelas VII</MenuItem>
                      <MenuItem value={"delapan"}>Kelas VIII</MenuItem>
                      <MenuItem value={"sembilan"}>Kelas IX</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl
                    fullWidth
                    variant="standard"
                    className="registration-input"
                    required
                  >
                    <InputLabel
                      shrink
                      htmlFor="phone-input"
                      sx={{ fontWeight: "700" }}
                    >
                      Nomor Telepon
                    </InputLabel>
                    <div className="container-input-adornment-register">
                      <Box
                        sx={{
                          p: "0.8rem",
                          border: "1px solid #dcdcdc",
                          borderTopLeftRadius: "0.5rem",
                          borderBottomLeftRadius: "0.5rem",
                          borderRightColor: "transparent",
                        }}
                      >
                        +62
                      </Box>
                      <AdornmentInputPhone
                        id="phone-input"
                        variant="outlined"
                        sx={{
                          flexGrow: "2",
                        }}
                        type="text"
                        onChange={(e) => {
                          setMobile(e.target.value);
                        }}
                        value={mobile}
                      />
                    </div>
                  </FormControl>
                  <FormControl
                    fullWidth
                    variant="standard"
                    className="registration-input"
                  >
                    <InputLabel
                      shrink
                      htmlFor="password-input"
                      sx={{ fontWeight: "700" }}
                    >
                      Password
                    </InputLabel>
                    <div className="container-input-adornment-register">
                      <AdornmentInputPassword
                        fullWidth
                        id="password-input"
                        variant="outlined"
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        value={password}
                        type={!showPassword ? "password" : "text"}
                      />
                      <Box>
                        <IconButton
                          aria-label="Tampilkan Password"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {!showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </Box>
                    </div>
                    <FormHelperText id="helper-password">
                      Password minimal 4 karakter
                    </FormHelperText>
                  </FormControl>

                  <Button
                    color="primary"
                    className="bootstraped-button"
                    sx={{ margin: "1rem 0" }}
                    fullWidth
                    disabled={submitDisable}
                    variant="contained"
                    type="submit"
                  >
                    {labelSubmit}
                  </Button>
                  <Typography
                    color={theme.palette.text.secondary}
                    sx={{ textAlign: "center" }}
                  >
                    Sudah punya akun? <Link to="/login">Login</Link>
                  </Typography>
                </form>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Transition>
  );
};

export default Registration;
