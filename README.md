![image](https://github.com/billettg/npmhome/assets/3407237/b260331a-7023-4003-8ca8-b3d4f841c979)

# <p align=center>npmhome</p>

## Info

Self-hosted and fully automated dashboard for your NPM proxy hosts!

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

## Docker run

Run Docker command to create the container:

```docker run -d --name npmhome -v /path/to/your/config.json:/app/config.json -p 1234:1234 billettg/npmhome```

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

## Known issues

- Dark mode toggle does not work
- No support for ARM Docker image yet
- Mobile rendering may be broken

## Disclaimer

This project is provided free and open source, and as-is.

Reliability, performance and compatibility of this software is not guaranteed.

## Support

Please log any issues [here](https://github.com/billettg/npmhome/issues).

This project is currently under active development and I plan to implement features, and bug fix when I have time to do so.

I cannot guarantee any support responses or timescales for bug fixes or feature implementations.

## Donations

If you like this project then please consider supporting me by making a donation via the link below:

<a href="https://www.buymeacoffee.com/billettg" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
