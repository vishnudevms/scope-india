import Alert from '@mui/material/Alert';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const FillErrorAlert = ({ open, message }) => {
  if (!open) return null;
  return (
    <Alert
      icon={<ErrorOutlineIcon fontSize="inherit" />}
      variant="filled"
      severity="info"
      sx={{
        width: '300px',
        padding: '6px 12px',
        fontSize: '0.95rem',
        boxShadow: 3,
        borderRadius: '6px',
        alignItems: 'center',
        position: 'fixed',
        top: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1300,
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      {message || 'Please fill all required fields.'}
    </Alert>
  );
};

export default FillErrorAlert;