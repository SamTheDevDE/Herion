import * as dotenv from 'dotenv';
dotenv.config({ quiet: true });

import HerionClient from "./client";
const Client = new HerionClient(process.env.BOT_TOKEN as string);

Client.log.info(`
░██     ░██                     ░██                      
░██     ░██                                              
░██     ░██  ░███████  ░██░████ ░██ ░███████  ░████████  
░██████████ ░██    ░██ ░███     ░██░██    ░██ ░██    ░██ 
░██     ░██ ░█████████ ░██      ░██░██    ░██ ░██    ░██ 
░██     ░██ ░██        ░██      ░██░██    ░██ ░██    ░██ 
░██     ░██  ░███████  ░██      ░██ ░███████  ░██    ░██ 
`);

Client.start();