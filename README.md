# <p align=center>npmhome</p>

## About

Self-hosted and fully automated dashboard for your Nginx Proxy Manager proxy hosts!

## Screenshots

![image](https://github.com/billettg/npmhome/assets/3407237/0d330661-c59d-4729-86ae-08d339f0886c)

![image](https://github.com/billettg/npmhome/assets/3407237/05165f4b-bc49-4fd8-9536-870dada8f302)

![image](https://github.com/billettg/npmhome/assets/3407237/90a01cf6-b4f0-4933-ab14-756cc6f2f7bd)

## Features

- NEW - Mobile support
- Automatically populated dashboard
- No authentication required other than initially setting up the config.json as this happens automatically using the API with bearer tokens
- Clean and simple interface
- Dark and light theme

## Instructions

Create a config.json file with the following content:

```
{
    "server": {
        "host" : "192.168.0.254",
        "port" : 81,
        "email" : "admin@example.com", 
        "password" : "password"
    },
    "appearance": {
        "showforwarding": false,
        "showdisabled": false,
        "showheader": true,
        "showfooter": true,
        "darkmode": true
    }
}
```
NOTE: To see newer revisions please make sure you clear your browser cache, or do a cache refresh (CTRL + F5 on Windows, SHIFT + CMD + R on Mac).

## Docker run

Run Docker command to create the container:

```docker run -d --name npmhome -v /path/to/your/config.json:/app/config.json -p 1234:1234 billettg/npmhome```

If you're running the container through Docker desktop, make sure you go to optional settings > ports, and set the host port to your desired port (doesn't have to be 1234).

## Docker desktop

As per the documentation, please pull the image billettg/npmhome and run it, then select optional settings > ports, and specify your host port (the one that you will connect on). If you don't do this Docker will assign a random port. It is important to note that if you run the container as is you will not be able to connect to it on port 1234!

Once you have done this point your browser to http://localhost:port or http://IP:port to access the web interface.

## Docker compose

Add this to your docker-compose.yml:

```
services:
    npmhome:
        image: billettg/npmhome
        container_name: npmhome
        volumes:
            - /path/to/your/config.json:/app/config.json
        ports:
            - 1234:1234
        restart: unless-stopped
```

Run the container with ```docker-compose up -d```

## Testing

You can also git clone this project and start the http-server for testing:

```
git clone https://github.com/billettg/npmhome.git
cd npmhome
npx http-server -p <your port>
```

You will need to put your config.json file in the root of the npmhome directory.

## Known issues

- No support for ARM Docker image yet ([issue](https://github.com/billettg/npmhome/issues/2))

## Disclaimer

This project is provided free and open source, and as-is.

Reliability, performance and compatibility of this software is not guaranteed.

## Support

If you have any feedback, questions, or issues please log them [here](https://github.com/billettg/npmhome/issues).

This project is currently under active development and I plan to implement features, and bug fix when I have time to do so.

I cannot guarantee any support responses or timescales for bug fixes or feature implementations.

## Donations

If you like this project then please consider supporting me by making a donation via the link below:

<a href="https://www.buymeacoffee.com/billettg" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
