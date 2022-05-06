import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm } from "react-hook-form";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const onSubmit = ({ email, password, fname, lname, cfpassword }) => {

    fetch('http://localhost:3333/register', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fname, lname, cfpassword }),
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === 'ok'){
          alert('ลงทะเบียน สำเสร็จ')
          window.location = '/login'
        }else if (data.status === 'error'){
          alert('กรุณากรอกข้อมูล Users ให้ครบทั้งหมด !')
        }else if (data.status === 'errorremail'){
          alert('มี Email นี้อยู่แล้ว !')
          window.location = '/login'
        }else if (data.status === 'errorpassword'){
          alert('Password ไม่ตรงกัน !')
        }
        else {
          alert('ลงทะเบียน ไม่สำเสร็จ')
        }
        
    })
    .catch((error) => {
        console.error('Error:', error);
    });


  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="fname"
                  required
                  fullWidth
                  id="fname"
                  label="First Name"
                  autoFocus
                  {...register("fname", {required: "กรุณากรอก First Name"})}
                  error={!!errors?.fname}
                  helperText={errors?.fname ? errors.fname.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lname"
                  label="Last Name"
                  name="lname"
                  autoComplete="family-name"
                  {...register("lname", {required: "กรุณากรอก Last Name"})}
                  error={!!errors?.lname}
                  helperText={errors?.lname ? errors.lname.message : null}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  {...register("email", {
                    required: "กรุณากรอก Email Address",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "รูปแบบ Email Address ไม่ถูกต้อง",
                    },
                  })}
                  error={!!errors?.email}
                  helperText={errors?.email ? errors.email.message : null}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  {...register("password", {
                    required: "กรุณากรอก Password ",
                    minLength: {value: 6,message:'ต้องใส่อย่างน้อย 6 ตัวอักษร'}
                  })}
                  error={!!errors?.password}
                  helperText={errors?.password ? errors.password.message : null}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="cfpassword"
                  label="ConfirmPassword"
                  type="password"
                  id="cfpassword"
                  autoComplete="new-password"
                  {...register("cfpassword", {
                    required: "กรุณากรอก ConfirmPassword ",
                    minLength: {value: 6,message:'ต้องใส่อย่างน้อย 6 ตัวอักษร'}
                  })}
                  error={!!errors?.password}
                  helperText={errors?.password ? errors.password.message : null}
                />
              </Grid>
             
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="Login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}