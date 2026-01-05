# components/Layout/Footer.jsx
cat > src/components/Layout/Footer.jsx << 'EOF'
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        Password Manager © {new Date().getFullYear()}
      </Typography>
    </Box>
  );
};

export default Footer;
EOF