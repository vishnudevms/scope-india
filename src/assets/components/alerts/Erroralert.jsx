import Alert from '@mui/material/Alert';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorAlert = ({ open, message }) => {
  if (!open) return null;
  return (
    <Alert
      icon={<ErrorOutlineIcon fontSize="inherit" />}
      variant="filled"
      severity="error"
      sx={{
        width: '330px',
        padding: '6px 12px',
        fontSize: '0.95rem',
        border: '1px solid #d32f2f',
        boxShadow: 3,
        borderRadius: '6px',
        alignItems: 'center',
        position: 'fixed',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1300,
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      {message || 'Registration failed. Please try again.'}
    </Alert>
  );
};

export default ErrorAlert;