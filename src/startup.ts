// import dotenv and load the .env file
import * as dotenv from 'dotenv';
dotenv.config({ quiet: true });

import HerionClient from "./client";
// initialize a new HerionClient with the bot token in .env file
const Client = new HerionClient(process.env.BOT_TOKEN as string);

// log (cool) template name for no reason other then it looking cool
Client.log.info(`
░██     ░██                     ░██                      
░██     ░██                                              
░██     ░██  ░███████  ░██░████ ░██ ░███████  ░████████  
░██████████ ░██    ░██ ░███     ░██░██    ░██ ░██    ░██ 
░██     ░██ ░█████████ ░██      ░██░██    ░██ ░██    ░██ 
░██     ░██ ░██        ░██      ░██░██    ░██ ░██    ░██ 
░██     ░██  ░███████  ░██      ░██ ░███████  ░██    ░██ 
`);

// at last start the client
Client.start();