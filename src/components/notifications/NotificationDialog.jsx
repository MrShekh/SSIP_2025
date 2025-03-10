import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import { HiX } from 'react-icons/hi';
import styles from './Notifications.module.css';

const NotificationDialog = ({ open, onClose, notification, onMarkAsRead }) => {
  const handleClose = () => {
    onMarkAsRead(notification.id);
    onClose();
  };

  if (!notification) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      classes={{ paper: styles.notificationDialog }}
    >
      <DialogTitle className={styles.notificationDialogTitle}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{notification.title}</Typography>
          <IconButton onClick={handleClose} size="small" className={styles.closeButton}>
            <HiX className="w-5 h-5" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent className={styles.notificationDialogContent}>
        <Box className={styles.notificationMeta}>
          <Typography variant="caption" color="textSecondary">
            {new Date(notification.timestamp).toLocaleString()}
          </Typography>
          <Typography variant="caption" color="primary">
            {notification.type}
          </Typography>
        </Box>
        <Typography variant="body1" className={styles.notificationMessage}>
          {notification.message}
        </Typography>
        {notification.details && (
          <Typography variant="body2" color="textSecondary" className={styles.notificationDetails}>
            {notification.details}
          </Typography>
        )}
      </DialogContent>
      <DialogActions className={styles.notificationDialogActions}>
        <Button onClick={handleClose} variant="contained" color="primary">
          Mark as Read
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationDialog;
