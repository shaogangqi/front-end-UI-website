import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const GlobalSnackbar = ({ alertInfo, setAlertInfo }) => {
    return (
        <Snackbar 
            open={alertInfo.show} 
            autoHideDuration={1500} 
            onClose={() => setAlertInfo({ ...alertInfo, show: false })}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // 修改位置到右上角
        >
            <Alert
                onClose={() => setAlertInfo({ ...alertInfo, show: false })}
                severity={alertInfo.severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {alertInfo.message}
            </Alert>
        </Snackbar>
    );
};

export default GlobalSnackbar;