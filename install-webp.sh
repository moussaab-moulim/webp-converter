#!/bin/bash

corepack enable
yarn set version berry

# Install WebP
curl -s https://raw.githubusercontent.com/Intervox/node-webp/latest/bin/install_webp | bash
