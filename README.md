# FRCMS
![GitHub](https://img.shields.io/github/license/frcms/base?style=for-the-badge)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ac0058befd694666858929f4adec5c9c)](https://app.codacy.com/gh/frcms/base?utm_source=github.com&utm_medium=referral&utm_content=frcms/base&utm_campaign=Badge_Grade)
[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/open-source.svg)](https://forthebadge.com)
## FRCMS is a Content Management System made specifically for First Robotic Competition teams.

## Stuff for Devs
FRCMS was created using MERN stack (MongoDB, Express, React, Node.JS), and [CoreUI](https://coreui.io) for the Admin panel.


## Installation
## Self Hosted
### Installation with Docker (recommended)
Without NGINX and MongoDB: (If you already have a MongoDB server set up)
```$ sudo docker run -d -p 80:80 -p 443:443 --name=frcms --restart=always -v frcms_data:/usr/src/app jackmerrill/frcms```

Without NGINX and with MongoDB:
SOON™️ (Docker Compose)

With NGINX and MongoDB: (If you don't have a MongoDB server set up)
SOON™️
### Installation without Docker

1. Clone the GitHub Repository
```$ git clone https://github.com/frcms/base.git```

2. Run the server
```$ node ./base/bin/www```

<!-- ## FRCMS Hosting
Don't feel like setting up FRCMS and hosting it? Let us take care of it. -->

## Contributing & Donating

- Fork the repository
- Clone to your local machine
- Create a new branch
- Make your changes
- Create a pull request

[![Donate](https://img.shields.io/badge/$-support-ff69b4.svg?style=for-the-badge)](https://paypal.me/amusedgrape)

