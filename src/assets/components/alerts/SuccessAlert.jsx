import Alert from '@mui/material/Alert';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const SuccessAlert = ({ open, message }) => {
  if (!open) return null;
  return (
    <Alert
      icon={<TaskAltIcon fontSize="inherit" />}
      variant="filled"
      severity="success"
      sx={{
        width: '380px',
        padding: '6px 12px',
        fontSize: '0.95rem',
        border: '1px solid #43a047',
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
      {message}
    </Alert>
  );
};

export default SuccessAlert;