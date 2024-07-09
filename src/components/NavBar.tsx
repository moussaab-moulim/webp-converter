'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Tooltip,
  Avatar,
  Container,
  Stack,
} from '@mui/material';
import { pages } from 'next/dist/build/templates/app-page';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MouseEvent, useState } from 'react';

const settings = [
  { label: 'Home', link: '/' },
  { link: '/api/auth/logout', label: 'Logout' },
];
interface NavBarProps {
  name: string;
}
export function NavBar({ name }: NavBarProps) {
  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {

    setAnchorElUser(null);
  };

  return (
    <AppBar position='static'>
      <Container
        maxWidth='xl'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 0',
        }}
      >
        <Typography variant='h6'>Uchiha converter</Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <Typography variant='body1' noWrap>
            {name ?? 'unknown'}
          </Typography>
          <Tooltip title='Open settings'>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              {name ? (
                <Avatar sx={{ width: 32, height: 32 }}>
                  {name?.charAt(0)}
                </Avatar>
              ) : (
                <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
              )}
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id='menu-appbar'
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem
               
                key={setting.label}
                onClick={handleCloseUserMenu}
              >
                <Link href={setting.link}>
                <Typography textAlign='center'>{setting.label}</Typography>
                </Link>
               
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Container>
    </AppBar>
  );
}
