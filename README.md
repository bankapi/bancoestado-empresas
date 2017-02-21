# Bankapi - Banco Estado - Cuenta Vista Empresas  

This module exposes a REST API to query Banco Estado de Chile's Corportate accounts incoming and outgoing transactions. Done as exploring exercise on how to use Nightmare for web crawling and koa as a server.  

## Requirements  

- NodeJS v4.x and up  
- PostgreSQL v9.5 and up  

## Installation and setup on Debian 8  

[Help setting up PostgreSQL on Debian8](https://gist.github.com/jaime-ez/c7ede87969f1884710545a01371ac3d4)  

You need to have Xvfb installed to run nightmare on headless mode:  
`sudo apt-get install -y libgtk2.0-0 libgconf-2-4 libasound2 libxtst6 libxss1 libnss3 xvfb`  

Then execute:  

- `git clone git@bitbucket.org:jaime-ez/bankapi-bancoestado-empresas.git`  
- `cd bankapi-bancoestado-empresas && npm install`  
- `cd lib/data`
- `cp config/config-example.json config/config.json`  
- `nano config/config.json` : enter database credentials  
- `../../node_modules/.bin/sequelize db:migrate`  
- `cd ../..`
- `mkdir downloads/incoming && mkdir downloads/outgoing`  
- `npm start`  

This will launch a CLI prompt where you can configure and run the service. By default the server will run on port 1337.  

## API routes  

### Auth  

The server uses a Basic Auth scheme so make sure to provide the the ApiKey id and secret with every request  

### GET /transactions  

Retrieves all transactions for the authenticated request  
