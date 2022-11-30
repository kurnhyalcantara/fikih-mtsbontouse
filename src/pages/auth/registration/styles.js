import { makeStyles } from '@mui/styles';

export const useStyle = makeStyles({
  root: {
    backgroundColor: '#fff',
    minHeight: '90vh',
    padding: '120px 20px',
  },
  bannerWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  signupBanner: {
    width: '65%',
  },
  formWrapper: {
    maxWidth: '28rem',
    margin: '0 auto',
    border: '1px solid #e6e6e6',
    padding: '2.5rem',
    borderRadius: '0.5rem',
    background: 'white',
  },
  heading: {
    textAlign: 'center',
  },
  subheading: {
    textAlign: 'center',
    marginBottom: '28px !important',
  },
  btn: {
    height: '40px',
  },
  msg: {
    textAlign: 'center',
    padding: '30px 0',
    fontSize: '20px',
  },
  link: {
    color: '#ed6c02',
    textDecoration: 'none',
  },
  option: {
    width: '100%',
    border: '1px solid #cbcbcb',
    borderRadius: '4px',
    height: '60px',
    fontSize: '15px',
    marginBottom: '15px',
    padding: '0 10px',
  },
});
