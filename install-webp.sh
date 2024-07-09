#!/bin/bash

corepack enable
yarn set version berry --global

# Install WebP
curl -s https://raw.githubusercontent.com/Intervox/node-webp/latest/bin/install_webp | bash
